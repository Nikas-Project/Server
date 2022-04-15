var html = function (globals) {
    var comment = globals.comment;
    var pluralize = globals.pluralize;

    return "" +
        "<div class='nikas-comment-loader' id='nikas-loader-" + comment.name + "'>"
        + "<a class='nikas-load-hidden' href='#'>" + pluralize('comment-hidden', comment.hidden_replies) + "</a>"
        + "</div>"
};
module.exports = html;
