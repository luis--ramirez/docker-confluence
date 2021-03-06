/**
 * Confluence core analytics bindings that should be loaded on all pages (e.g. for content generated by a re-usable
 * velocity macro).
 */
define('confluence/analytics-bindings', [
    'jquery',
    'confluence/analytics-support'
], function(
    $,
    Analytics
) {
    "use strict";

    return function() {
        function bindViewHistoricalVersionEvent(containerSelector, src) {
            $(containerSelector).on('click', '.view-historical-version-trigger', function() {
                Analytics.publish('confluence.page.view-historical.from-' + (src || 'unknown'));
            });
        }

        function bindRestoreHistoricalVersionEvent(containerSelector, src) {
            $(containerSelector).on('click', '.restore-historical-version-trigger', function() {
                Analytics.publish('confluence.page.restore-historical.from-' + (src || 'unknown'));
            });
        }

        function bindHeaderSecondaryDropdownEvent(selector, name) {
            $('#header .aui-header-secondary ' + selector).on('click', function() {
                var state = $(this).hasClass('aui-dropdown2-active') ? 'expanded' : 'collapsed';
                Analytics.publish('confluence.header.dropdown.' + name, {
                    state: state
                });
            });
        }

        bindViewHistoricalVersionEvent('#page-history-warning', 'navigation');
        bindViewHistoricalVersionEvent('#page-history-container', 'history');
        bindViewHistoricalVersionEvent('.diff-menu', 'diff');

        bindRestoreHistoricalVersionEvent('#page-history-warning', 'navigation');
        bindRestoreHistoricalVersionEvent('#page-history-container', 'history');

        bindHeaderSecondaryDropdownEvent('#admin-menu-link', 'administration');
        bindHeaderSecondaryDropdownEvent('#user-menu-link', 'profile');
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/analytics-bindings', function(AnalyticsBindings) {
    var AJS = require('ajs');

    AJS.toInit(AnalyticsBindings);
});