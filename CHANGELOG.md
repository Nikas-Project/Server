# Changes

## 2.1.0 ( Oct 1, 2022 )

-   Server
    -   Fix Issue [#146](https://github.com/Nikas-Project/Server/issues/146)
    -   Update package lock version
-   Client
    -   Add dark theme
    -   Fix style problems
    -   Update CP link
-   Repository
    -   Update workflows
    -   Change deploy process
    -   Update dependabot

## 2.0.4 ( Aug 24, 2022 )

-   Fix v2 problems

## 2.0.3 ( Aug 24, 2022 )

-   Server
    -   Update dependencies
-   Client
    -   Update dependencies

## 2.0.2 ( Jun 10, 2022 )

-   Server
    -   Fix security problems

## 2.0.1 ( May 25, 2022 )

-   Server
    -   Rewrite `Makefile`
    -   Update dependencies
    -   Reduce the size of the Docker image ( 48 -> 18 )
-   Admin
    -   Show auth errors
-   Repository
    -   Fix ignored files

## 2.0.0 ( May 9, 2022 )

-   Server
    -   Python
        -   Update DB Process
        -   Update comment process
        -   Update Python version
        -   Change template methods
        -   Change i18n methods
        -   Improve Backend
        -   Rewrite tests
        -   Fix code-smell problems
        -   Fix security problems
    -   JavaScript
        -   Use ES5 Concepts
        -   Replace Bower with Webpack
        -   Rewrite tests
        -   Fix code-smell problems
        -   Fix security problems
        -   Use Jest
-   Client
    -   Update GULP
    -   Make assets compressed
    -   Fix style problems
    -   Update HTML example
-   Admin
    -   Better responsive
    -   Fix style problems
-   Repository
    -   Update deployment process
    -   Format all codes automatically
    -   Reconfigure Dependabot
    -   Add Renovate
    -   Add new Actions
    -   Update old workflows

## 1.1.9 ( Jan 17, 2022 )

-   Server
    -   Use `unverified_context` for SMTP connection
-   Client
    -   Fix style problems

---

## 1.1.6 ( Jan 14, 2022 )

-   Server
    -   Fix problems with `gevent` and `greenlet`
    -   Fix SMTP problems
    -   Translate notification's body
-   Admin
    -   Fix [Quirks Mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
-   Client
    -   Missed logo and favicon added

---

## 1.1.1 ( Dec 22, 2021 )

-   Server
    -   Use [Argon2](https://en.wikipedia.org/wiki/Argon2) instead of SHA-256 for authentication process
        -   Common Weakness Enumeration: [CWE-327](https://cwe.mitre.org/data/definitions/327.html).
        -   Common Weakness Enumeration: [CWE-328](https://cwe.mitre.org/data/definitions/328.html).
        -   Common Weakness Enumeration: [CWE-916](https://cwe.mitre.org/data/definitions/916.html).
-   Admin
    -   Fix logout problem
-   Client
    -   Fix style problems for some CMS platforms

## 1.1.0 ( Sep 1, 2020 )

-   Server
    -   Use hashed password
    -   Fix config parser problems
-   Admin
    -   Make RTL
    -   Change theme & colors
    -   Use Persian font ( [Vazir](https://github.com/rastikerdar/vazir-font) )
    -   Fix margin & size problems
-   Client
    -   Make RTL
    -   Simplify styles
    -   Use Persian font ( [Vazir](https://github.com/rastikerdar/vazir-font) )
    -   Update font sizes
    -   Add `FA` for i18n
    -   Remove all shadows
    -   Fix margin problems
    -   Use justify align

## 1.0.1 ( Aug 1, 2020 )

-   Use Gitlab CI
-   Change EOF
-   Add example files
-   Fix `Makefile` problems
-   Fix `.gitignore` problems

## 1.0.0 ( Jul 9, 2020 )

-   First beta release
-   Migrate to Nikas
-   Dockerize project :
    -   Create `Dockerfile` and `docker-compose.yml`
    -   Publish docker image
-   Create `Makefile`
-   Publish python package
