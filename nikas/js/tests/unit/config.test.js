"use strict";

test("Client configuration - no languages", () => {
    // Mock navigator.languages = []
    global.languages = jest.spyOn(navigator, "languages", "get");
    global.languages.mockReturnValue([]);

    // Mock navigator.language = null
    global.language = jest.spyOn(navigator, "language", "get");
    global.language.mockReturnValue(null);

    let config = require("app/config");

    /* Expected:
     * - no config["lang"]
     * - navigator.languages empty
     *   - fall back on navigator.language
     *     - navigator.language empty
     *        - fall back on navigator.userLanguage
     *            - navigator.userLanguage empty
     *              (jsdom doesn't set it)
     * - config["default-lang"] = "fa"
     * - final manual insertion of "fa"
     */
    let expected_langs = ["fa", "fa"];

    expect(config["langs"]).toStrictEqual(expected_langs);
});
