# -*- encoding: utf-8 -*-

import unittest

from nikas import utils
from nikas.utils import parse


class TestUtils(unittest.TestCase):

    def test_anonymize(self):

        examples = [
            (u'12.34.56.78', u'12.34.56.0'),
            (u'1234:5678:90ab:cdef:fedc:ba09:8765:4321',
             u'1234:5678:90ab:0000:0000:0000:0000:0000'),
            (u'::ffff:127.0.0.1', u'127.0.0.0')]

        for (addr, anonymized) in examples:
            self.assertEqual(utils.anonymize(addr), anonymized)

    def test_str(self):
        # Accept a str on both Python 2 and Python 3, for
        # convenience.
        examples = [
            ('12.34.56.78', u'12.34.56.0'),
            ('1234:5678:90ab:cdef:fedc:ba09:8765:4321',
             '1234:5678:90ab:0000:0000:0000:0000:0000'),
            ('::ffff:127.0.0.1', u'127.0.0.0')]

        for (addr, anonymized) in examples:
            self.assertEqual(utils.anonymize(addr), anonymized)


class TestParse(unittest.TestCase):

    def test_thread(self):
        self.assertEqual(parse.thread("asdf"), (None, 'Untitled.'))

        self.assertEqual(parse.thread("""
            <html>
            <head>
                <title>Foo!</title>
            </head>
            <body>
                <header>
                    <h1>generic website title.</h1>
                    <h2>subtile title.</h2>
                </header>
                <article>
                    <header>
                        <h1>Can you find me?</h1>
                    </header>
                    <section id="nikas-thread">
                    </section>
                </article>
            </body>
            </html>"""), (None, 'Can you find me?'))

        self.assertEqual(parse.thread("""
            <html>
            <body>
            <h1>I'm the real title!1
            <section data-title="No way%21" id="nikas-thread">
            """), (None, 'No way!'))

        self.assertEqual(parse.thread("""
            <section id="nikas-thread" data-title="Test" data-nikas-id="test">
            """), ('test', 'Test'))

        self.assertEqual(parse.thread('<section id="nikas-thread" data-nikas-id="Fuu.">'),
                         ('Fuu.', 'Untitled.'))
