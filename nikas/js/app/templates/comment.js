var html = function (globals) {
    var i18n = globals.i18n;
    var comment = globals.comment;
    var conf = globals.conf;
    var datetime = globals.datetime;
    var humanize = globals.humanize;
    var svg = globals.svg;

    var author = comment.author ? comment.author : i18n('comment-anonymous');

    return "" +
        "<div class='nikas-comment' id='nikas-" + comment.id + "'>"
        + (conf.gravatar ? "<div class='nikas-avatar'><img src='" + comment.gravatar_image + "'></div>" : '')
        + (conf.avatar ? "<div class='nikas-avatar'><svg data-hash='" + comment.hash + "'</svg></div>" : '')
        + "<div class='nikas-text-wrapper'>"
        + "<div class='nikas-comment-header' role='meta'>"
        + (comment.website
            ? "<a class='nikas-author' href='" + comment.website + "' rel='nofollow'>" + author + "</a>"
            : "<span class='nikas-author'>" + author + "</span>")
        + "<span class='nikas-spacer'>&bull;</span>"
        + "<a class='nikas-permalink' href='#nikas-" + comment.id + "'>"
        + "<time title='" + humanize(comment.created) + "' datetime='" + datetime(comment.created) + "'>" + humanize(comment.created) + "</time>"
        + "</a>"
        + "<span class='nikas-note'>"
        + (comment.mode == 2 ? i18n('comment-queued') : (comment.mode == 4 ? i18n('comment-deleted') : ''))
        + "</span>"
        + "</div>" // .text-wrapper
        + "<div class='nikas-text'>"
        + (comment.mode == 4 ? '<p>&nbsp;</p>' : comment.text)
        + "</div>" // .text
        + "<div class='nikas-comment-footer'>"
        + (conf.vote
            ? "<a class='nikas-upvote' href='#'>" + svg['arrow-up'] + "</a>"
            + "<span class='nikas-spacer'>|</span>"
            + "<a class='nikas-downvote' href='#'>" + svg['arrow-down'] + "</a>"
            : '')
        + "<a class='nikas-reply' href='#'>" + i18n('comment-reply') + "</a>"
        + "<a class='nikas-edit' href='#'>" + i18n('comment-edit') + "</a>"
        + "<a class='nikas-delete' href='#'>" + i18n('comment-delete') + "</a>"
        + "</div>" // .nikas-comment-footer
        + "<div class='nikas-follow-up'></div>"
        + "</div>" // .text-wrapper
        + "</div>" // .nikas-comment
};
module.exports = html;
