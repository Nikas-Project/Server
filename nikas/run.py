# -*- encoding: utf-8 -*-

from __future__ import unicode_literals

import os

from nikas import dist, config
from nikas import make_app

application = make_app(
    config.load(
        os.path.join(dist.location, dist.project_name, "defaults.ini"),
        os.environ.get('NIKAS_SETTINGS')),
    multiprocessing=True)
