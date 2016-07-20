define('confluence/help-panel', [
    'jquery',
    'window'
], function(
    $,
    window
) {
    "use strict";

    var HelpPanel = {};

    HelpPanel.initialize = function () {
        $(".help-panel-content a").click(function () {
            var linkUrl = $(this).attr("href");
            var onClickEvent = $(this).attr("onClick");
            if (!onClickEvent && linkUrl && linkUrl.indexOf("#") !== 0 && linkUrl.indexOf(window.location) === -1) {
                window.open(linkUrl, '_blank').focus();
                return false;
            }
        });
    };
    return HelpPanel;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/help-panel', function(HelpPanel) {
    var AJS = require('ajs');

    AJS.toInit(HelpPanel.initialize);
});
