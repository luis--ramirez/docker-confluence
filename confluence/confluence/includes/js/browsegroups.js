define('confluence/browsegroups', [
    'jquery'
], function(
    $
) {
    "use strict";

    var initialize = function () {
        var form = $("#create-group-form");
        var switchButton = $("#switch-button");

        form.hide(); // Initial state

        var toggles = function() {
            form.toggle();
            $("#group-list").toggle();
        };

        switchButton.toggle(function() {
            toggles();
            switchButton.text($("#i18n-cancel-add").val());
            return false;

        }, function() {
            toggles();
            switchButton.text($("#i18n-add-group").val());
            $(".error").remove();
            return false;
        });

        $("#cancel-button").click(function() {
            switchButton.click();
        });

        if ($("#fielderrors-empty").val() === "false") {
            switchButton.click();
        }
    };

    return {
        initialize: initialize
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/browsegroups', function(BrowseGroups) {
    var AJS = require('ajs');

    AJS.toInit(BrowseGroups.initialize);
});
