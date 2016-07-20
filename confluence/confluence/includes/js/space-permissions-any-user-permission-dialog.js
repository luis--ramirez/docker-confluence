define('confluence/space-permissions-any-user-permission-dialog', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    return {
        create: function () {
            var dialog = new AJS.ConfluenceDialog({
                id: 'edit-any-user-view-permission-dialog',
                width: 500,
                height: 300
            });

            dialog.addHeader($('.any-user-perm-dialog-title').text());
            dialog.addPanel("Panel 1", $('.any-user-perm-dialog-contents').html());

            dialog.addSubmit(AJS.I18n.getText('space.permissions.any.user.dialog.disable.button'), function () {
                $("form[name='disableanyuserpermission']").submit();
                dialog.hide();
            });
            dialog.addCancel(AJS.I18n.getText('cancel.name'), function () {
                dialog.hide();
            });

            return dialog;
        }
    };
});