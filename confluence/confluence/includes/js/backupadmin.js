define('confluence/backupadmin', [
    'jquery'
], function(
    $
) {
    "use strict";

    return function BackupAdmin() {

        var pathTextBox = $("#backupPath");

        $("#backupOption\\.default").click(function(e) {
            pathTextBox.val($("#defaultPath").val());
        });

        $('#backupOption\\.default').click(function (e) {
            pathTextBox.prop("disabled", true);
        });

        $('#backupOption\\.custom').click(function (e) {
            pathTextBox.prop("disabled", false);
        });

    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/backupadmin', function(BackupAdmin) {
    var AJS = require('ajs');

    AJS.toInit(BackupAdmin);
});
