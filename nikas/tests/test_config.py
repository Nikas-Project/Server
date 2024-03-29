# -*- encoding: utf-8 -*-

import unittest
import io

from nikas import config


class TestConfig(unittest.TestCase):

    def test_parser(self):

        parser = config.NikasParser()
        parser.read_file(io.StringIO("""
            [foo]
            bar = 1h
            baz = 12
            spam = a, b, cdef
            bla =
                spam
                ham
            asd = fgh
            password = %s%%foo"""))

        self.assertEqual(parser.getint("foo", "bar"), 3600)
        self.assertEqual(parser.getint("foo", "baz"), 12)
        self.assertEqual(parser.getlist("foo", "spam"), ['a', 'b', 'cdef'])
        self.assertEqual(list(parser.getiter("foo", "bla")), ['spam', 'ham'])
        self.assertEqual(list(parser.getiter("foo", "asd")), ['fgh'])

        # Strings containing '%' should not be python-interpolated
        self.assertEqual(parser.get("foo", "password"), '%s%%foo')

        # Section.get() should function the same way as plain NikasParser
        foosection = parser.section("foo")
        self.assertEqual(foosection.get("password"), '%s%%foo')
