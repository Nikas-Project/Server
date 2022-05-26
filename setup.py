#!/usr/bin/env python
# -*- encoding: utf-8 -*-

from pathlib import Path
from re import sub as re_sub
from setuptools import setup, find_packages

with open('requirements.txt', 'r') as reqs:
    requires = reqs.readlines()

with open('version.env', 'r') as v:
    version = v.readlines()

tests_require = ['pytest', 'pytest-cov']

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()
long_description = re_sub(r"\n## License\n.*LICENSE.*\n", "", long_description)

setup(
    name='nikas',
    version=version[0],
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
    python_requires='>=3.6',
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Topic :: Utilities",
        "Topic :: Internet",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        "Intended Audience :: Information Technology",
        "Intended Audience :: System Administrators",
        "Natural Language :: Persian",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    install_requires=requires,
    setup_requires=["cffi>=1.15.0", "argon2-cffi>=21.3.0"],
    tests_require=tests_require,
    entry_points={
        'console_scripts':
            ['nikas = nikas:main'],
    },
)
