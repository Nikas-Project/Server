var api = require("app/api");
var $ = require("app/dom");
var i18n = require("app/i18n");

module.exports = function () {
    var objs = {};

    $.each("a", function (el) {
        if (!el.href.match || !el.href.match(/#nikas-thread$/)) {
            return;
        }

        var tid =
            el.getAttribute("data-nikas-id") ||
            el.href
                .match(/^(.+)#nikas-thread$/)[1]
                .replace(/^.*\/\/[^\/]+/, "");

        if (tid in objs) {
            objs[tid].push(el);
        } else {
            objs[tid] = [el];
        }
    });

    var urls = Object.keys(objs);

    api.count(urls).then(function (rv) {
        for (var key in objs) {
            if (objs.hasOwnProperty(key)) {
                var index = urls.indexOf(key);

                for (var i = 0; i < objs[key].length; i++) {
                    objs[key][i].textContent = i18n.pluralize(
                        "num-comments",
                        rv[index]
                    );
                }
            }
        }
    });
};
