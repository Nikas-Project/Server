define(["app/config", "app/i18n/fa"], function (config, fa) {
    "use strict";

    var pluralforms = function (lang) {
        switch (lang) {
            case "fa":
                return function (msgs, n) {
                    return msgs[n === 1 ? 0 : 1];
                };
            default:
                return null;
        }
    };

    // useragent's preferred language (or manually overridden)
    var lang = config.lang;

    // fall back
    if (!pluralforms(lang)) {
        lang = "fa";
    }

    var catalogue = {
        fa: fa,
    };

    var plural = pluralforms(lang);

    var translate = function (msgid) {
        return (
            config[msgid + "-text-" + lang] ||
            catalogue[lang][msgid] ||
            fa[msgid] ||
            "???"
        );
    };

    var pluralize = function (msgid, n) {
        var msg;

        msg = translate(msgid);
        if (msg.indexOf("\n") > -1) {
            msg = plural(msg.split("\n"), +n);
        }

        return msg ? msg.replace("{{ n }}", +n) : msg;
    };

    return {
        lang: lang,
        translate: translate,
        pluralize: pluralize,
    };
});
