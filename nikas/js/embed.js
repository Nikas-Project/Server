require([
    "app/lib/ready",
    "app/config",
    "app/i18n",
    "app/api",
    "app/nikas",
    "app/count",
    "app/dom",
    "app/text/css",
    "app/text/svg",
    "app/jade",
], function (domready, config, i18n, api, nikas, count, $, css, svg, jade) {
    "use strict";

    jade.set("conf", config);
    jade.set("i18n", i18n.translate);
    jade.set("pluralize", i18n.pluralize);
    jade.set("svg", svg);

    var nikas_thread;
    var heading;

    function init() {
        nikas_thread = $("#nikas-thread");
        heading = $.new("h4");

        if (config["css"] && $("style#nikas-style") === null) {
            var style = $.new("style");
            style.id = "nikas-style";
            style.type = "text/css";
            style.textContent = css.inline;
            $("head").append(style);
        }

        count();

        if (nikas_thread === null) {
            return console.log("abort, #nikas-thread is missing");
        }

        if (config["feed"]) {
            var feedLink = $.new("a", i18n.translate("atom-feed"));
            var feedLinkWrapper = $.new("span.nikas-feedlink");
            feedLink.href = api.feed(
                nikas_thread.getAttribute("data-nikas-id")
            );
            feedLinkWrapper.appendChild(feedLink);
            nikas_thread.append(feedLinkWrapper);
        }
        nikas_thread.append(heading);
        nikas_thread.append(new nikas.Postbox(null));
        nikas_thread.append('<div id="nikas-root"></div>');
    }

    function fetchComments() {
        if ($("#nikas-root").length == 0) {
            return;
        }

        $("#nikas-root").textContent = "";
        api.fetch(
            nikas_thread.getAttribute("data-nikas-id") || location.pathname,
            config["max-comments-top"],
            config["max-comments-nested"]
        ).then(
            function (rv) {
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

                if (
                    window.location.hash.length > 0 &&
                    window.location.hash.match("^#nikas-[0-9]+$")
                ) {
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
        fetchComments: fetchComments,
    };
});
