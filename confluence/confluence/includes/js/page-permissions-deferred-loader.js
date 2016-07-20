/**
 * @tainted WRM
 */
define('confluence/page-permissions-deferred-loader', [
    'confluence/dark-features',
    'confluence/legacy',
    'ajs',
    'confluence/page-loading-indicator',
    'jquery',
    'wrm'
], function(
    DarkFeatures,
    Confluence,
    AJS,
    PageLoadingIndicator,
    $,
    WRM
) {
    "use strict";

    var resourceKey = "com.atlassian.confluence.plugins.confluence-page-restrictions-dialog:dialog-resources";
    var loadingIndicator = PageLoadingIndicator($("body"));

    return function(e) {
        var deferred = WRM.require('wr!' + resourceKey, function() {
            AJS.trigger("deferred.page.permissions");
        });
        loadingIndicator.showUntilDialogVisible(deferred, AJS.I18n.getText("page.restrictions.loading.error"));

        e.preventDefault();
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/page-permissions-deferred-loader', function(PagePermissionsDeferredLoader) {
    var AJS = require('ajs');

    AJS.toInit(function($) {
        // has to be 'on' cause of quick edit
        $("body").on("click", "#rte-button-restrictions,#action-page-permissions-link", PagePermissionsDeferredLoader);
        // another way to open the page permissions
        AJS.bind('system-content-metadata.open-restrictions-dialog', PagePermissionsDeferredLoader);
    });
});