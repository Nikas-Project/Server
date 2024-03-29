# -*- encoding: utf-8 -*-

import sys
import os
import logging

from glob import glob

from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response

from nikas import make_app, wsgi, config

logger = logging.getLogger("nikas")


class Dispatcher(DispatcherMiddleware):
    """
    A dispatcher to support different websites. Dispatches based on
    a relative URI, e.g. /foo.example and /other.bar.
    """

    def __init__(self, *confs):
        self.nikas = {}

        default = config.default_file()
        for i, path in enumerate(confs):
            conf = config.load(default, path)

            if not conf.get("general", "name"):
                logger.warning("unable to dispatch %r, no 'name' set", confs[i])
                continue

            self.nikas["/" + conf.get("general", "name")] = make_app(conf)

        super(Dispatcher, self).__init__(self.default, mounts=self.nikas)

    def __call__(self, environ, start_response):

        # clear X-Script-Name as the PATH_INFO is already adjusted
        environ.pop('HTTP_X_SCRIPT_NAME', None)

        return super(Dispatcher, self).__call__(environ, start_response)

    def default(self, environ, start_response):
        resp = Response("\n".join(self.nikas.keys()),
                        404, content_type="text/plain")
        return resp(environ, start_response)


settings = os.environ.get("NIKAS_SETTINGS")
if settings:
    if os.path.isdir(settings):
        conf_glob = os.path.join(settings, '*.cfg')
        confs = glob(conf_glob)
        application = wsgi.SubURI(Dispatcher(*confs))
    else:
        confs = settings.split(";")
        for path in confs:
            if not os.path.isfile(path):
                logger.fatal("%s: no such file", path)
                sys.exit(1)
    application = wsgi.SubURI(Dispatcher(*confs))
else:
    logger.fatal('environment variable NIKAS_SETTINGS must be set')
