var config = require("app/config");

var fa = require("app/i18n/fa");

"use strict";

var pluralforms = function (lang) {
    return function (msgs, n) {
        return msgs[n === 1 ? 0 : 1];
    };
};

var catalogue = {
    fa: fa,
};

// for each entry in config.langs, see whether we have a catalogue
// entry and a pluralforms entry for it.  if we don't, try chopping
// off everything but the primary language subtag, before moving
// on to the next one.
var lang, plural, translations;
for (var i = 0; i < config.langs.length; i++) {
    lang = config.langs[i];
    plural = pluralforms(lang);
    translations = catalogue[lang];
    if (plural && translations)
        break;
    if (/-/.test(lang)) {
        lang = lang.split("-", 1)[0];
        plural = pluralforms(lang);
        translations = catalogue[lang];
        if (plural && translations)
            break;
    }
}

// absolute backstop; if we get here there's a bug in config.js
if (!plural || !translations) {
    lang = "fa";
    plural = pluralforms(lang);
    translations = catalogue[lang];
}

var translate = function (msgid) {
    return config[msgid + '-text-' + lang] ||
        translations[msgid] ||
        en[msgid] ||
        "[?" + msgid + "]";
};

var pluralize = function (msgid, n) {
    var msg;

    msg = translate(msgid);
    if (msg.indexOf("\n") > -1) {
        msg = plural(msg.split("\n"), (+ n));
    }

    return msg ? msg.replace("{{ n }}", (+ n)) : msg;
};

var ago = function (localTime, date) {

    var secs = ((localTime.getTime() - date.getTime()) / 1000);

    if (isNaN(secs) || secs < 0) {
        secs = 0;
    }

    var mins = Math.floor(secs / 60), hours = Math.floor(mins / 60),
        days = Math.floor(hours / 24);

    return secs <= 45 && translate("date-now") ||
        secs <= 90 && pluralize("date-minute", 1) ||
        mins <= 45 && pluralize("date-minute", mins) ||
        mins <= 90 && pluralize("date-hour", 1) ||
        hours <= 22 && pluralize("date-hour", hours) ||
        hours <= 36 && pluralize("date-day", 1) ||
        days <= 5 && pluralize("date-day", days) ||
        days <= 8 && pluralize("date-week", 1) ||
        days <= 21 && pluralize("date-week", Math.floor(days / 7)) ||
        days <= 45 && pluralize("date-month", 1) ||
        days <= 345 && pluralize("date-month", Math.floor(days / 30)) ||
        days <= 547 && pluralize("date-year", 1) ||
        pluralize("date-year", Math.floor(days / 365.25));
};

module.exports = {
    ago: ago,
    lang: lang,
    translate: translate,
    pluralize: pluralize,
};
