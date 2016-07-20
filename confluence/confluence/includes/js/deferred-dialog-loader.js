define('confluence/deferred-dialog-loader', [
    'underscore',
    'jquery',
    'ajs',
    'confluence/page-loading-indicator',
    'confluence/api/event'
], function(
    _,
    $,
    AJS,
    PageLoadingIndicator,
    event
) {
    "use strict";

    return function() {

        var deferredDialogs = {
            userStatus: {
                resource: "confluence.userstatus:userstatus-resources",
                selector: "#create-user-status-link",
                event: "deferred.userstatus.click"
            },
            movePageDialogTools: {
                resource: "confluence.web.resources:page-move-resources",
                selector: "#action-move-page-dialog-link",
                event: "deferred.page-move.tools-menu"
            },
            movePageDialogEditor: {
                resource: "confluence.web.resources:page-move-resources",
                selector: "#rte-button-location",
                event: "deferred.page-move.editor"
            },
            moveBlogDialogTools: {
                resource: "confluence.web.resources:page-move-resources",
                selector: "#action-move-blogpost-dialog-link",
                event: "deferred.blog-move.tools-menu"
            },
            availableGadgetsHelp: {
                resource: "com.atlassian.confluence.plugins.gadgets:gadget-directory-resources",
                selector: "#gadget-directory-link",
                event: "deferred.available-gadgets.help-menu"
            },
            aboutConfluenceHelp: {
                resource: "confluence.web.resources:about",
                selector: "#confluence-about-link",
                event: "deferred.about-confluence.help-menu"
            }
        };

        var loadingIndicator = PageLoadingIndicator($("body"));

        _.each(deferredDialogs, function(dialog) {
            $("body").on('click', dialog.selector, function(e) {
                var deferred = WRM.require('wr!' + dialog.resource, function() {
                    event.trigger(dialog.event);
                });
                loadingIndicator.showUntilDialogVisible(deferred);

                // Send an analytics event.
                var eventName = dialog.resource + ".requested";
                AJS.Analytics ?
                        AJS.Analytics.triggerPrivacyPolicySafeEvent(eventName)
                        : event.trigger('analyticsEvent', {name: eventName});

                e.preventDefault();
            });
        });

    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/deferred-dialog-loader', function(DeferredDialogLoader) {
    var AJS = require('ajs');

    AJS.toInit(DeferredDialogLoader);
});
