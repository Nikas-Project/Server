# -*- encoding: utf-8 -*-

import sys
import io
import json
import smtplib
import socket
import time

from _thread import start_new_thread
from email.header import Header
from email.mime.text import MIMEText
from email.utils import formatdate
from urllib.parse import quote

import logging
logger = logging.getLogger("nikas")

try:
    import uwsgi
except ImportError:
    uwsgi = None

from nikas import local


class SMTPConnection(object):

    def __init__(self, conf):
        self.conf = conf

    def __enter__(self):
        klass = (smtplib.SMTP_SSL if self.conf.get(
            'security') == 'ssl' else smtplib.SMTP)
        self.client = klass(host=self.conf.get('host'),
                            port=self.conf.getint('port'),
                            timeout=self.conf.getint('timeout'))

        if self.conf.get('security') == 'starttls':
            if sys.version_info >= (3, 4):
                import ssl
                # TODO: Use config to separate secure/unsecure connection: context=ssl.create_default_context()
                self.client.starttls(context=ssl._create_unverified_context())
            else:
                self.client.starttls()

        username = self.conf.get('username')
        password = self.conf.get('password')
        if username and password:
            self.client.login(username, password)

        return self.client

    def __exit__(self, exc_type, exc_value, traceback):
        self.client.quit()


class SMTP(object):

    def __init__(self, nikas):

        self.nikas = nikas
        self.conf = nikas.conf.section("smtp")
        self.public_endpoint = nikas.conf.get("server", "public-endpoint") or local("host")
        self.admin_notify = any((n in ("smtp", "SMTP")) for n in nikas.conf.getlist("general", "notify"))
        self.reply_notify = nikas.conf.getboolean("general", "reply-notifications")

        # test SMTP connectivity
        try:
            with SMTPConnection(self.conf):
                logger.info("connected to SMTP server")
        except (socket.error, smtplib.SMTPException):
            logger.exception("unable to connect to SMTP server")

        if uwsgi:
            def spooler(args):
                try:
                    self._sendmail(args[b"subject"].decode("utf-8"),
                                   args["body"].decode("utf-8"),
                                   args[b"to"].decode("utf-8"))
                except smtplib.SMTPConnectError:
                    return uwsgi.SPOOL_RETRY
                else:
                    return uwsgi.SPOOL_OK

            uwsgi.spooler = spooler

    def __iter__(self):
        yield "comments.new:after-save", self.notify_new
        yield "comments.activate", self.notify_activated

    def format(self, thread, comment, parent_comment, recipient=None, admin=False):

        rv = io.StringIO()

        author = comment["author"] or "Anonymous"
        if admin and comment["email"]:
            author += " <%s>" % comment["email"]

        rv.write(author + " wrote:\n")
        rv.write("\n")
        rv.write(comment["text"] + "\n")
        rv.write("\n")

        if admin:
            if comment["website"]:
                rv.write("وب سایت کاربر : %s\n" % comment["website"])

            rv.write("آدرس IP : %s\n" % comment["remote_addr"])

        rv.write("لینک نظر : %s\n" %
                 (local("origin") + thread["uri"] + "#nikas-%i" % comment["id"]))
        rv.write("\n")
        rv.write("---\n")

        if admin:
            uri = self.public_endpoint + "/id/%i" % comment["id"]
            key = self.nikas.sign(comment["id"])

            rv.write("حذف نظر : %s\n" % (uri + "/delete/" + key))

            if comment["mode"] == 2:
                rv.write("تایید نظر : %s\n" % (uri + "/activate/" + key))

        else:
            uri = self.public_endpoint + "/id/%i" % parent_comment["id"]
            key = self.nikas.sign(('unsubscribe', recipient))

            rv.write("لغو عضویت از این گفتگو : %s\n" % (uri + "/unsubscribe/" + quote(recipient) + "/" + key))

        rv.seek(0)
        return rv.read()

    def notify_new(self, thread, comment):
        if self.admin_notify:
            body = self.format(thread, comment, None, admin=True)
            subject = "نظر جدید ثبت شد"
            if thread['title']:
                subject = "%s on %s" % (subject, thread["title"])
            self.sendmail(subject, body, thread, comment)

        if comment["mode"] == 1:
            self.notify_users(thread, comment)

    def notify_activated(self, thread, comment):
        self.notify_users(thread, comment)

    def notify_users(self, thread, comment):
        if self.reply_notify and "parent" in comment and comment["parent"] is not None:
            # Notify interested authors that a new comment is posted
            notified = []
            parent_comment = self.nikas.db.comments.get(comment["parent"])
            comments_to_notify = [parent_comment] if parent_comment is not None else []
            comments_to_notify += self.nikas.db.comments.fetch(thread["uri"], mode=1, parent=comment["parent"])
            for comment_to_notify in comments_to_notify:
                email = comment_to_notify["email"]
                if "email" in comment_to_notify and comment_to_notify["notification"] and email not in notified \
                        and comment_to_notify["id"] != comment["id"] and email != comment["email"]:
                    body = self.format(thread, comment, parent_comment, email, admin=False)
                    subject = "Re: New comment posted on %s" % thread["title"]
                    self.sendmail(subject, body, thread, comment, to=email)
                    notified.append(email)

    def sendmail(self, subject, body, thread, comment, to=None):
        to = to or self.conf.get("to")
        if not subject:
            # Fallback, just in case as an empty subject does not work
            subject = 'nikas notification'
        if uwsgi:
            uwsgi.spool({b"subject": subject.encode("utf-8"),
                         b"body": body.encode("utf-8"),
                         b"to": to.encode("utf-8")})
        else:
            start_new_thread(self._retry, (subject, body, to))

    def _sendmail(self, subject, body, to_addr):

        from_addr = self.conf.get("from")

        msg = MIMEText(body, 'plain', 'utf-8')
        msg['From'] = from_addr
        msg['To'] = to_addr
        msg['Date'] = formatdate(localtime=True)
        msg['Subject'] = Header(subject, 'utf-8')

        with SMTPConnection(self.conf) as con:
            con.sendmail(from_addr, to_addr, msg.as_string())

    def _retry(self, subject, body, to):
        for x in range(5):
            try:
                self._sendmail(subject, body, to)
            except smtplib.SMTPConnectError:
                time.sleep(60)
            else:
                break


class Stdout(object):

    def __init__(self, conf):
        pass

    def __iter__(self):
        yield "comments.new:new-thread", self._new_thread
        yield "comments.new:finish", self._new_comment
        yield "comments.edit", self._edit_comment
        yield "comments.delete", self._delete_comment
        yield "comments.activate", self._activate_comment

    def _new_thread(self, thread):
        logger.info("new thread %(id)s: %(title)s" % thread)

    def _new_comment(self, thread, comment):
        logger.info("comment created: %s", json.dumps(comment))

    def _edit_comment(self, comment):
        logger.info('comment %i edited: %s',
                    comment["id"], json.dumps(comment))

    def _delete_comment(self, id):
        logger.info('comment %i deleted', id)

    def _activate_comment(self, thread, comment):
        logger.info("comment %(id)s activated" % thread)
