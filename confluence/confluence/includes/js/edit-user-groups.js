define('confluence/edit-user-groups', [
    'jquery'
], function(
    $
) {
    "use strict";

    var initialize = function () {
        $("#editusergroups-selectall").click(function(e) {
            $(".checkbox input:checkbox").each(function(e) {
                this.checked = true;
            });
            return false;
        });

        $("#editusergroups-selectnone").click(function(e) {
            $(".checkbox input:checkbox").each(function(e) {
                this.checked = false;
            });
            return false;
        });
    };

    return {
        initialize: initialize
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/edit-user-groups', function(EditUserGroups) {
    var AJS = require('ajs');

    AJS.toInit(EditUserGroups.initialize);
});
