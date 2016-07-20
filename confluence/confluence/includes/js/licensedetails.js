define('confluence/licensedetails', [
    'jquery',
    'ajs',
    'aui/form-validation'
], function(
    $,
    AJS,
    validator
) {
    "use strict";

    return function LicenseDetails() {
        var confirmationRequired = false;
        validator.register(['validlicense'], function(field) {
            AJS.safe.post(
                    AJS.contextPath() + "/rest/license/1.0/license/validate",
                    {licenseKey: field.$el.val()},
                    function (data) {
                        confirmationRequired = data;
                        field.validate();
                    }
            ).fail(function (jqXHR, status, err) {
                field.invalidate(jqXHR.responseText);
            });
        });


        $('#updateLicenseForm').on('aui-valid-submit', function(event) {
            if (confirmationRequired)
            {
                AJS.dialog2("#migration-dialog").show();
                event.preventDefault();
            }
        });

        $('#migration-dialog-confirm').on('click', function() {
            confirmationRequired = false;
            $('#updateLicenseForm').submit();
        });

        $('#migration-dialog-cancel').on('click', function() {
            AJS.dialog2("#migration-dialog").hide();
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/licensedetails', function(LicenseDetails) {
    var AJS = require('ajs');

    AJS.toInit(LicenseDetails);
});
