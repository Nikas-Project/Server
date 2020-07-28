from __future__ import unicode_literals

import json
import os
import tempfile
import unittest

from fixtures import curl, loads, FakeIP, JSONClient
from werkzeug.wrappers import Response

from nikas import Nikas, core, config, dist
from nikas.utils import http

http.curl = curl


class TestVote(unittest.TestCase):

    def setUp(self):
        self.path = tempfile.NamedTemporaryFile().name

    def makeClient(self, ip):

        conf = config.load(os.path.join(dist.location, "share", "nikas.conf"))
        conf.set("general", "dbpath", self.path)
        conf.set("guard", "enabled", "off")
        conf.set("hash", "algorithm", "none")

        class App(Nikas, core.Mixin):
            pass

        app = App(conf)
        app.wsgi_app = FakeIP(app.wsgi_app, ip)

        return JSONClient(app, Response)

    def testZeroLikes(self):

        rv = self.makeClient("127.0.0.1").post(
            "/new?uri=test", data=json.dumps({"text": "..."}))
        self.assertEqual(loads(rv.data)['likes'], 0)
        self.assertEqual(loads(rv.data)['dislikes'], 0)

    def testSingleLike(self):

        self.makeClient("127.0.0.1").post(
            "/new?uri=test", data=json.dumps({"text": "..."}))
        rv = self.makeClient("0.0.0.0").post("/id/1/like")

        self.assertEqual(rv.status_code, 200)
        self.assertEqual(loads(rv.data)["likes"], 1)

    def testSelfLike(self):

        bob = self.makeClient("127.0.0.1")
        bob.post("/new?uri=test", data=json.dumps({"text": "..."}))
        rv = bob.post('/id/1/like')

        self.assertEqual(rv.status_code, 200)
        self.assertEqual(loads(rv.data)["likes"], 0)

    def testMultipleLikes(self):

        self.makeClient("127.0.0.1").post(
            "/new?uri=test", data=json.dumps({"text": "..."}))
        for num in range(15):
            rv = self.makeClient("1.2.%i.0" % num).post('/id/1/like')
            self.assertEqual(rv.status_code, 200)
            self.assertEqual(loads(rv.data)["likes"], num + 1)

    def testVoteOnNonexistentComment(self):
        rv = self.makeClient("1.2.3.4").post('/id/1/like')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(loads(rv.data), None)

    def testTooManyLikes(self):

        self.makeClient("127.0.0.1").post(
            "/new?uri=test", data=json.dumps({"text": "..."}))
        for num in range(256):
            rv = self.makeClient("1.2.%i.0" % num).post('/id/1/like')
            self.assertEqual(rv.status_code, 200)

            if num >= 142:
                self.assertEqual(loads(rv.data)["likes"], 142)
            else:
                self.assertEqual(loads(rv.data)["likes"], num + 1)

    def testDislike(self):
        self.makeClient("127.0.0.1").post(
            "/new?uri=test", data=json.dumps({"text": "..."}))
        rv = self.makeClient("1.2.3.4").post('/id/1/dislike')

        self.assertEqual(rv.status_code, 200)
        self.assertEqual(loads(rv.data)['likes'], 0)
        self.assertEqual(loads(rv.data)['dislikes'], 1)
