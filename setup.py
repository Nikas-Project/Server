#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import sys
from os import path

from setuptools import setup, find_packages

if sys.version_info < (3,):
    raise SystemExit("Python 2 is not supported.")
elif (3, 0) <= sys.version_info < (3, 4):
    raise SystemExit("Python 3 versions < 3.4 are not supported.")

with open('requirements.txt', 'r') as reqs:
    requires = reqs.readlines()

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='nikas',
    version='1.1.7',
    author='Arash Hatami',
    author_email='hatamiarash7@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    url='https://github.com/Nikas-Project/Server',
    license='MIT',
    description='The first persian comment system ',
    long_description=long_description,
    long_description_content_type='text/markdown',
    classifiers=[
        "Development Status :: 4 - Beta",
        "Topic :: Internet",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8"
    ],
    install_requires=requires,
    setup_requires=["cffi>=1.15.0", "argon2-cffi>=21.3.0", "nose>=1.0"],
    entry_points={
        'console_scripts':
            ['nikas = nikas:main'],
    }
)
