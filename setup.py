#!/usr/bin/env python
# -*- encoding: utf-8 -*-

from pathlib import Path
from re import sub as re_sub
from setuptools import setup, find_packages

requires = ['itsdangerous', 'Jinja2', 'misaka>=2.0,<3.0', 'html5lib',
            'werkzeug>=1.0', 'bleach', 'Flask-Caching>=1.9', 'Flask', 'argon2-cffi']
tests_require = ['pytest', 'pytest-cov']

# https://packaging.python.org/en/latest/guides/making-a-pypi-friendly-readme/
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()
# Filter out "License" section since license already displayed in PyPi sidebar
# Remember to keep this in sync with changes to README!
long_description = re_sub(r"\n## License\n.*LICENSE.*\n", "", long_description)

setup(
    name='nikas',
    version='2.0.0',
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
        "Development Status :: 4 - Beta",
        "Topic :: Internet",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    install_requires=requires,
    tests_require=tests_require,
    entry_points={
        'console_scripts':
            ['nikas = nikas:main'],
    },
)
