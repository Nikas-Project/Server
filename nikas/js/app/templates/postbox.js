var html = function (globals) {
    var i18n = globals.i18n;
    var author = globals.author;
    var email = globals.email;
    var website = globals.website;

    return (
        "" +
        "<div class='nikas-postbox'>" +
        "<p class='nikas-copyright'>Powered by<a href='https://www.nikasproject.ir' target='_blank'>Nikas</a></p>" +
        "<div class='nikas-form-wrapper'>" +
        "<div class='nikas-textarea-wrapper'>" +
        "<div class='nikas-textarea nikas-placeholder' contenteditable='true'>" +
        i18n("postbox-text") +
        "</div>" +
        "<div class='nikas-preview'>" +
        "<div class='nikas-comment'>" +
        "<div class='nikas-text-wrapper'>" +
        "<div class='nikas-text'></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<section class='nikas-auth-section'>" +
        "<p class='nikas-input-wrapper'>" +
        "<input type='text' name='author' placeholder='" +
        i18n("postbox-author") +
        "' value='" +
        (author ? author : "") +
        "' />" +
        "</p>" +
        "<p class='nikas-input-wrapper'>" +
        "<input type='email' name='email' placeholder='" +
        i18n("postbox-email") +
        "' value='" +
        (email ? email : "") +
        "' />" +
        "</p>" +
        "<p class='nikas-input-wrapper'>" +
        "<input type='text' name='website' placeholder='" +
        i18n("postbox-website") +
        "' value='" +
        (website ? website : "") +
        "' />" +
        "</p>" +
        "<p class='nikas-post-action'>" +
        "<input type='submit' value='" +
        i18n("postbox-submit") +
        "' />" +
        "</p>" +
        "<p class='nikas-post-action'>" +
        "<input type='button' name='preview' value='" +
        i18n("postbox-preview") +
        "' />" +
        "</p>" +
        "<p class='nikas-post-action'>" +
        "<input type='button' name='edit' value='" +
        i18n("postbox-edit") +
        "' />" +
        "</p>" +
        "</section>" +
        "<section class='nikas-notification-section'>" +
        "<label>" +
        "<input type='checkbox' name='notification' />" +
        i18n("postbox-notification") +
        "</label>" +
        "</section>" +
        "</div>" +
        "</div>"
    );
};
module.exports = html;
