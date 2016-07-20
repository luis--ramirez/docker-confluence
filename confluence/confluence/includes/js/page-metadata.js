/**
 * Code for toggling version metadata.
 */
define('confluence/page-metadata', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    return function ($) {
        var comment = $("#version-comment");
        if (comment.length) {
            var showLink = $("#show-version-comment");
            var hideLink = $("#hide-version-comment");
            showLink.click(function (e) {
                showLink.hide();
                hideLink.show();
                comment.show();
                return AJS.stopEvent(e);
            });
            hideLink.click(function (e) {
                hideLink.hide();
                showLink.show();
                comment.hide();
                return AJS.stopEvent(e);
            });
            // Only hide the comment if it's possible to show it again.
            if (showLink.length && hideLink.length)
            {
                comment.hide();
            }
        }
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-metadata', function(PageMetadata) {
    require('ajs').toInit(PageMetadata);
});
