var $ = require("app/dom");
var utils = require("app/utils");
var config = require("app/config");
var api = require("app/api");
var template = require("app/template");
var i18n = require("app/i18n");
var identicons = require("app/lib/identicons");
var globals = require("app/globals");

'use strict';

var editorify = function (el) {
    el = $.htmlify(el);
    el.setAttribute("contentEditable", true);

    el.on("focus", function () {
        if (el.classList.contains("nikas-placeholder")) {
            el.innerHTML = "";
            el.classList.remove("nikas-placeholder");
        }
    });

    el.on("blur", function () {
        if (el.textContent.length === 0) {
            el.textContent = i18n.translate("postbox-text");
            el.classList.add("nikas-placeholder");
        }
    });

    return el;
};

var Postbox = function (parent) {
    var localStorage = utils.localStorageImpl,
        el = $.htmlify(
            template.render("postbox", {
                author: JSON.parse(localStorage.getItem("nikas-author")),
                email: JSON.parse(localStorage.getItem("nikas-email")),
                website: JSON.parse(localStorage.getItem("nikas-website")),
                preview: "",
            })
        );

    // callback on success (e.g. to toggle the reply button)
    el.onsuccess = function () { };

    el.validate = function () {
        if (
            utils.text($(".nikas-textarea", this).innerHTML).length < 3 ||
            $(".nikas-textarea", this).classList.contains("nikas-placeholder")
        ) {
            $(".nikas-textarea", this).focus();
            return false;
        }
        if (
            config["require-email"] &&
            $("[name='email']", this).value.length <= 0
        ) {
            $("[name='email']", this).focus();
            return false;
        }
        if (
            config["require-author"] &&
            $("[name='author']", this).value.length <= 0
        ) {
            $("[name='author']", this).focus();
            return false;
        }
        return true;
    };

    // only display notification checkbox if email is filled in
    var email_edit = function () {
        if (
            config["reply-notifications"] &&
            $("[name='email']", el).value.length > 0
        ) {
            $(".nikas-notification-section", el).show();
        } else {
            $(".nikas-notification-section", el).hide();
        }
    };
    $("[name='email']", el).on("input", email_edit);
    email_edit();

    // email is not optional if this config parameter is set
    if (config["require-email"]) {
        $("[name='email']", el).setAttribute(
            "placeholder",
            $("[name='email']", el)
                .getAttribute("placeholder")
                .replace(/ \(.*\)/, "")
        );
    }

    // author is not optional if this config parameter is set
    if (config["require-author"]) {
        $("[name='author']", el).placeholder = $(
            "[name='author']",
            el
        ).placeholder.replace(/ \(.*\)/, "");
    }

    // preview function
    $("[name='preview']", el).on("click", function () {
        api.preview(utils.text($(".nikas-textarea", el).innerHTML)).then(
            function (html) {
                $(".preview .text", el).innerHTML = html;
                el.classList.add("nikas-preview-mode");
            }
        );
    });

    // edit function
    var edit = function () {
        $(".nikas-preview .nikas-text", el).innerHTML = "";
        el.classList.remove("nikas-preview-mode");
    };
    $("[name='edit']", el).on("click", edit);
    $(".nikas-preview", el).on("click", edit);

    // submit form, initialize optional fields with `null` and reset form.
    // If replied to a comment, remove form completely.
    $("[type=submit]", el).on("click", function () {
        edit();
        if (!el.validate()) {
            return;
        }

        var author = $("[name=author]", el).value || null,
            email = $("[name=email]", el).value || null,
            website = $("[name=website]", el).value || null;

        localStorage.setItem("nikas-author", JSON.stringify(author));
        localStorage.setItem("nikas-email", JSON.stringify(email));
        localStorage.setItem("nikas-website", JSON.stringify(website));

        api.create($("#nikas-thread").getAttribute("data-nikas-id"), {
            author: author,
            email: email,
            website: website,
            text: utils.text($(".nikas-textarea", el).innerHTML),
            parent: parent || null,
            title: $("#nikas-thread").getAttribute("data-title") || null,
            notification: $("[name=notification]", el).checked() ? 1 : 0,
        }).then(function (comment) {
            $(".nikas-textarea", el).innerHTML = "";
            $(".nikas-textarea", el).blur();
            insert(comment, true);

            if (parent !== null) {
                el.onsuccess();
            }
        });
    });

    editorify($(".nikas-textarea", el));

    return el;
};

var insert_loader = function (comment, lastcreated) {
    var entrypoint;
    if (comment.id === null) {
        entrypoint = $("#nikas-root");
        comment.name = "null";
    } else {
        entrypoint = $(
            "#nikas-" + comment.id + " > .nikas-text-wrapper > .nikas-follow-up"
        );
        comment.name = comment.id;
    }
    var el = $.htmlify(template.render("comment-loader", { comment: comment }));

    entrypoint.append(el);

    $("a.nikas-load-hidden", el).on("click", function () {
        el.remove();
        api.fetch(
            $("#nikas-thread").getAttribute("data-nikas-id"),
            config["reveal-on-click"],
            config["max-comments-nested"],
            comment.id,
            lastcreated
        ).then(
            function (rv) {
                if (rv.total_replies === 0) {
                    return;
                }

                var lastcreated = 0;
                rv.replies.forEach(function (commentObject) {
                    insert(commentObject, false);
                    if (commentObject.created > lastcreated) {
                        lastcreated = commentObject.created;
                    }
                });

                if (rv.hidden_replies > 0) {
                    insert_loader(rv, lastcreated);
                }
            },
            function (err) {
                console.log(err);
            }
        );
    });
};

var insert = function (comment, scrollIntoView) {
    var el = $.htmlify(template.render("comment", { comment: comment }));

    // update datetime every 60 seconds
    var refresh = function () {
        $(".nikas-permalink > time", el).textContent = i18n.ago(
            globals.offset.localTime(),
            new Date(parseInt(comment.created, 10) * 1000)
        );
        setTimeout(refresh, 60 * 1000);
    };

    // run once to activate
    refresh();

    if (config["avatar"]) {
        $(".nikas-avatar > svg", el).replace(
            identicons.generate(comment.hash, 4, 48, config)
        );
    }

    var entrypoint;
    if (comment.parent === null) {
        entrypoint = $("#nikas-root");
    } else {
        entrypoint = $(
            "#nikas-" +
            comment.parent +
            " > .nikas-text-wrapper > .nikas-follow-up"
        );
    }

    entrypoint.append(el);

    if (scrollIntoView) {
        el.scrollIntoView();
    }

    var footer = $(
        "#nikas-" +
        comment.id +
        " > .nikas-text-wrapper > .nikas-comment-footer"
    ),
        header = $(
            "#nikas-" +
            comment.id +
            " > .nikas-text-wrapper > .nikas-comment-header"
        ),
        text = $(
            "#nikas-" + comment.id + " > .nikas-text-wrapper > .nikas-text"
        );

    var form = null; // XXX: probably a good place for a closure
    $("a.nikas-reply", footer).toggle(
        "click",
        function (toggler) {
            form = footer.insertAfter(
                new Postbox(
                    comment.parent === null ? comment.id : comment.parent
                )
            );
            form.onsuccess = function () {
                toggler.next();
            };
            $(".nikas-textarea", form).focus();
            $("a.nikas-reply", footer).textContent =
                i18n.translate("comment-close");
        },
        function () {
            form.remove();
            $("a.nikas-reply", footer).textContent =
                i18n.translate("comment-reply");
        }
    );

    if (config.vote) {
        var voteLevels = config["vote-levels"];
        if (typeof voteLevels === "string") {
            // Eg. -5,5,15
            voteLevels = voteLevels.split(",");
        }

        // update vote counter
        var votes = function (value) {
            var span = $("span.nikas-votes", footer);
            if (span === null) {
                footer.prepend($.new("span.nikas-votes", value));
            } else {
                span.textContent = value;
            }
            if (value) {
                el.classList.remove("nikas-no-votes");
            } else {
                el.classList.add("nikas-no-votes");
            }
            if (voteLevels) {
                var before = true;
                for (var index = 0; index <= voteLevels.length; index++) {
                    if (
                        before &&
                        (index >= voteLevels.length ||
                            value < voteLevels[index])
                    ) {
                        el.classList.add("nikas-vote-level-" + index);
                        before = false;
                    } else {
                        el.classList.remove("nikas-vote-level-" + index);
                    }
                }
            }
        };

        $("a.nikas-upvote", footer).on("click", function () {
            api.like(comment.id).then(function (rv) {
                votes(rv.likes - rv.dislikes);
            });
        });

        $("a.nikas-downvote", footer).on("click", function () {
            api.dislike(comment.id).then(function (rv) {
                votes(rv.likes - rv.dislikes);
            });
        });

        votes(comment.likes - comment.dislikes);
    }

    $("a.nikas-edit", footer).toggle(
        "click",
        function (toggler) {
            var edit = $("a.nikas-edit", footer);
            var avatar =
                config["avatar"] || config["gravatar"]
                    ? $(".nikas-avatar", el, false)[0]
                    : null;

            edit.textContent = i18n.translate("comment-save");
            edit.insertAfter(
                $.new("a.nikas-cancel", i18n.translate("comment-cancel"))
            ).on("click", function () {
                toggler.canceled = true;
                toggler.next();
            });

            toggler.canceled = false;
            api.view(comment.id, 1).then(function (rv) {
                var textarea = editorify($.new("div.nikas-textarea"));

                textarea.innerHTML = utils.detext(rv.text);
                textarea.focus();

                text.classList.remove("nikas-text");
                text.classList.add("nikas-textarea-wrapper");

                text.textContent = "";
                text.append(textarea);
            });

            if (avatar !== null) {
                avatar.hide();
            }
        },
        function (toggler) {
            var textarea = $(".nikas-textarea", text);
            var avatar =
                config["avatar"] || config["gravatar"]
                    ? $(".nikas-avatar", el, false)[0]
                    : null;

            if (!toggler.canceled && textarea !== null) {
                if (utils.text(textarea.innerHTML).length < 3) {
                    textarea.focus();
                    toggler.wait();
                    return;
                } else {
                    api.modify(comment.id, {
                        text: utils.text(textarea.innerHTML),
                    }).then(function (rv) {
                        text.innerHTML = rv.text;
                        comment.text = rv.text;
                    });
                }
            } else {
                text.innerHTML = comment.text;
            }

            text.classList.remove("nikas-textarea-wrapper");
            text.classList.add("nikas-text");

            if (avatar !== null) {
                avatar.show();
            }

            $("a.nikas-cancel", footer).remove();
            $("a.nikas-edit", footer).textContent =
                i18n.translate("comment-edit");
        }
    );

    $("a.nikas-delete", footer).toggle(
        "click",
        function (toggler) {
            var del = $("a.nikas-delete", footer);
            var state = !toggler.state;

            del.textContent = i18n.translate("comment-confirm");
            del.on("mouseout", function () {
                del.textContent = i18n.translate("comment-delete");
                toggler.state = state;
                del.onmouseout = null;
            });
        },
        function () {
            var del = $("a.nikas-delete", footer);
            api.remove(comment.id).then(function (rv) {
                if (rv) {
                    el.remove();
                } else {
                    $("span.nikas-note", header).textContent =
                        i18n.translate("comment-deleted");
                    text.innerHTML = "<p>&nbsp;</p>";
                    $("a.nikas-edit", footer).remove();
                    $("a.nikas-delete", footer).remove();
                }
                del.textContent = i18n.translate("comment-delete");
            });
        }
    );

    // remove edit and delete buttons when cookie is gone
    var clear = function (button) {
        if (!utils.cookie("nikas-" + comment.id)) {
            if ($(button, footer) !== null) {
                $(button, footer).remove();
            }
        } else {
            setTimeout(function () {
                clear(button);
            }, 15 * 1000);
        }
    };

    clear("a.nikas-edit");
    clear("a.nikas-delete");

    // show direct reply to own comment when cookie is max aged
    var show = function (el) {
        if (utils.cookie("nikas-" + comment.id)) {
            setTimeout(function () {
                show(el);
            }, 15 * 1000);
        } else {
            footer.append(el);
        }
    };

    if (!config["reply-to-self"] && utils.cookie("nikas-" + comment.id)) {
        show($("a.nikas-reply", footer).detach());
    }

    if (comment.hasOwnProperty("replies")) {
        var lastcreated = 0;
        comment.replies.forEach(function (replyObject) {
            insert(replyObject, false);
            if (replyObject.created > lastcreated) {
                lastcreated = replyObject.created;
            }
        });
        if (comment.hidden_replies > 0) {
            insert_loader(comment, lastcreated);
        }
    }
};

module.exports = {
    insert: insert,
    insert_loader: insert_loader,
    Postbox: Postbox,
};
