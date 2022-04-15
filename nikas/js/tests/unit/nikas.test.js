"use strict";

test('Create Postbox', () => {
    // Set up our document body
    document.body.innerHTML =
        '<div id=nikas-thread></div>' +
        // Note: `src` and `data-nikas` need to be set,
        // else `api` fails to initialize!
        '<script src="http://nikas.api/js/embed.min.js" data-nikas="/"></script>';

    const nikas = require("app/nikas");
    const $ = require("app/dom");

    const config = require("app/config");
    const i18n = require("app/i18n");
    const svg = require("app/svg");

    const template = require("app/template");

    template.set("conf", config);
    template.set("i18n", i18n.translate);
    template.set("pluralize", i18n.pluralize);
    template.set("svg", svg);

    var nikas_thread = $('#nikas-thread');
    nikas_thread.append('<div id="nikas-root"></div>');
    nikas_thread.append(new nikas.Postbox(null));

    // Will create a `.snap` file in `./__snapshots__/`.
    // Don't forget to check in those files when changing anything!
    expect(nikas_thread.innerHTML).toMatchSnapshot();
});
