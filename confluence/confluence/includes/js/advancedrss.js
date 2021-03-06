define('confluence/advancedrss', [
    'jquery'
], function(
    $
) {
    "use strict";

    return function AdvancedRSS() {
        var $advancedOptLink = $("#advanced_opt_link");
        $advancedOptLink.click(function () {
            var $advancedOpt = $("#advanced_opt");
            if ($advancedOpt.is(':visible')) {
                $advancedOpt.fadeOut();
                $advancedOptLink.show();
            } else {
                $advancedOpt.fadeIn();
                $advancedOptLink.hide();
            }
            return false;
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/advancedrss', function(AdvancedRSS) {
    var AJS = require('ajs');

    AJS.toInit(AdvancedRSS);
});