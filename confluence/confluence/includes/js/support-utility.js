define('confluence/support-utility', [
    'jquery'
], function ($) {
    "use strict";

    var SupportUtility = {};

    SupportUtility.initialize = function () {
        $("#includeServerLogs").change(function (e) {
            var serverIncludeBox = $(this);
            if (serverIncludeBox.prop('checked')) {
                $("#serverLogsDirectory").parent().fadeIn();
            } else {
                $("#serverLogsDirectory").parent().fadeOut();
            }
        });
    };
    return SupportUtility;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/support-utility', function (SupportUtility) {
    require('ajs').toInit(SupportUtility.initialize);
});