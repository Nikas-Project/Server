var domready = require("app/lib/ready");
var config = require("app/config");
var i18n = require("app/i18n");
var api = require("app/api");
var nikas = require("app/nikas");
var count = require("app/count");
var $ = require("app/dom");
var svg = require("app/svg");
var template = require("app/template");

"use strict";

template.set("conf", config);
template.set("i18n", i18n.translate);
template.set("pluralize", i18n.pluralize);
template.set("svg", svg);

var nikas_thread;
var heading;

function init () {
    nikas_thread = $('#nikas-thread');
    heading = $.new("h4");

    if (config["css"] && $("style#nikas-style") === null) {
        var style = $.new("link");
        style.id = "nikas-style";
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = config["css-url"] ? config["css-url"] : api.endpoint + "/css/nikas.css";
        $("head").append(style);
    }

    count();

    if (nikas_thread === null) {
        return console.log("abort, #nikas-thread is missing");
    }

    if (config["feed"]) {
        var feedLink = $.new('a', i18n.translate('atom-feed'));
        var feedLinkWrapper = $.new('span.nikas-feedlink');
        feedLink.href = api.feed(nikas_thread.getAttribute("data-nikas-id"));
        feedLinkWrapper.appendChild(feedLink);
        nikas_thread.append(feedLinkWrapper);
    }
    // Note: Not appending the nikas.Postbox here since it relies
    // on the config object populated by elements fetched from the server,
    // and the call to fetch those is in fetchComments()
    nikas_thread.append(heading);
    nikas_thread.append('<div id="nikas-root"></div>');
}

function fetchComments () {
    if (!$('#nikas-root')) {
        return;
    }

    var nikas_root = $('#nikas-root');
    nikas_root.textContent = '';
    api.fetch(nikas_thread.getAttribute("data-nikas-id") || location.pathname,
        config["max-comments-top"],
        config["max-comments-nested"]).then(
            function (rv) {
                for (var setting in rv.config) {
                    if (setting in config && config[setting] != rv.config[setting]) {
                        console.log("Nikas: Client value '%s' for setting '%s' overridden by server value '%s'.\n" +
                            "Since Nikas version 0.12.6, 'data-nikas-%s' is only configured via the server " +
                            "to keep client and server in sync",
                            config[setting], setting, rv.config[setting], setting);
                    }
                    config[setting] = rv.config[setting]
                }

                // Note: nikas.Postbox relies on the config object populated by elements
                // fetched from the server, so it cannot be created in init()
                nikas_root.prepend(new nikas.Postbox(null));

                if (rv.total_replies === 0) {
                    heading.textContent = i18n.translate("no-comments");
                    return;
                }

                var lastcreated = 0;
                var count = rv.total_replies;
                rv.replies.forEach(function (comment) {
                    nikas.insert(comment, false);
                    if (comment.created > lastcreated) {
                        lastcreated = comment.created;
                    }
                    count = count + comment.total_replies;
                });
                heading.textContent = i18n.pluralize("num-comments", count);

                if (rv.hidden_replies > 0) {
                    nikas.insert_loader(rv, lastcreated);
                }

                if (window.location.hash.length > 0 &&
                    window.location.hash.match("^#nikas-[0-9]+$")) {
                    $(window.location.hash).scrollIntoView();
                }
            },
            function (err) {
                console.log(err);
            }
        );
}

domready(function () {
    init();
    fetchComments();
});

window.Nikas = {
    init: init,
    fetchComments: fetchComments
};
