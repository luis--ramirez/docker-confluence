// NOTE: This file is actually used on the individual space permissions page and the global space permissions page.
define('confluence/space-permissions-page', [
    'jquery',
    'confluence/space-permissions-form',
    'confluence/space-permissions-any-user-permission-dialog'
], function(
    $,
    SpacePermissionsForm,
    SpacePermissionsEditAnyUserPermissionDialog
) {
    'use strict';

    var SpacePermissionsPage = {};
    var editAnyUserPermissionDialog = null;

    SpacePermissionsPage.updateField = function(id, valueToAdd) {
        if (valueToAdd != ""){
            var input = $("#" + id);
            var val = input.val();
            input.val(val == "" ? valueToAdd : val + ", " + valueToAdd);
        }
    };

    SpacePermissionsPage.updateGroupsField = function(groups) {
        SpacePermissionsPage.updateField("groups-to-add-autocomplete", groups);
    };

    SpacePermissionsPage.updateUsersField = function(users) {
        SpacePermissionsPage.updateField("users-to-add-autocomplete", users);
    };

    SpacePermissionsPage.initialize = function() {
        $('form[name="editspacepermissions"],form[name="editdefaultspacepermissions"]').each(function(index, element) {
            new SpacePermissionsForm({ el: element });
        });

        $('#edit-any-user-perm').click(function () {
            editAnyUserPermissionDialog = editAnyUserPermissionDialog || SpacePermissionsEditAnyUserPermissionDialog.create();
            editAnyUserPermissionDialog.show();
        });
    };

    return SpacePermissionsPage;
});

/* istanbul ignore next */
require('confluence/module-exporter').exportModuleAsGlobal('confluence/space-permissions-page', 'Confluence.SpacePermissions', function(SpacePermissionsPage) {
    require('ajs').toInit(SpacePermissionsPage.initialize);
});