# 1.1.6 ( Jan 14, 2022 )

- Server
    - Fix problems with `gevent` and `greenlet`
    - Fix SMTP problems
    - Translate notification's body
- Admin
    - Fix [Quirks Mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
- Client
    - Missed logo and favicon added

---

# 1.1.1 ( Dec 22, 2021 )

- Server
    - Use [Argon2](https://en.wikipedia.org/wiki/Argon2) instead of SHA-256 for authentication process
        - Common Weakness Enumeration: [CWE-327](https://cwe.mitre.org/data/definitions/327.html).
        - Common Weakness Enumeration: [CWE-328](https://cwe.mitre.org/data/definitions/328.html).
        - Common Weakness Enumeration: [CWE-916](https://cwe.mitre.org/data/definitions/916.html).
- Admin
    - Fix logout problem
- Client
    - Fix style problems for some CMS platforms

# 1.1.0 ( Sep 1, 2020 )

- Server
    - Use hashed password
    - Fix config parser problems
- Admin
    - Make RTL
    - Change theme & colors
    - Use Persian font ( [Vazir](https://github.com/rastikerdar/vazir-font) )
    - Fix margin & size problems
- Client
    - Make RTL
    - Simplify styles
    - Use Persian font ( [Vazir](https://github.com/rastikerdar/vazir-font) )
    - Update font sizes
    - Add `FA` for i18n
    - Remove all shadows
    - Fix margin problems
    - Use justify align

# 1.0.1 ( Aug 1, 2020 )

- Use Gitlab CI
- Change EOF
- Add example files
- Fix `Makefile` problems
- Fix `.gitignore` problems

# 1.0.0 ( Jul 9, 2020 )

- First beta release
- Migrate to Nikas
- Dockerize project :
    - Create `Dockerfile` and `docker-compose.yml`
    - Publish docker image
- Create `Makefile`
- Publish python package
