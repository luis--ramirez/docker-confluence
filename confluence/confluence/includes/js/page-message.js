define('confluence/page-message', [
    'ajs'
], function(
    AJS
) {
    'use strict';

    /**
     * Handles a message or flags which need to be displayed on initial page load
     */

    var PageMessage = {};

    PageMessage._getQueryString = function () {
        return window.location.search;
    };

    PageMessage.displayPageMessage = function () {
        var queryString = PageMessage._getQueryString();
        var userName = AJS.Meta.get('editing-user');
        if (queryString.indexOf('editingLocked') !== -1 && userName) {
            AJS.MessageHandler.flag({
                type: 'info',
                title: AJS.I18n.getText("editor.unavailable.title"),
                body: AJS.I18n.getText("fallback.mode.existing.editor.body", userName),
                close: 'manual'
            });
        } else if (queryString.indexOf('editingFailed') !== -1) {
            AJS.MessageHandler.flag({
                type: 'info',
                title: AJS.I18n.getText("editor.unavailable.title"),
                body: AJS.I18n.getText("editor.unavailable.generic.body", userName),
                close: 'manual'
            });
        }
    };

    return PageMessage;
});

require('confluence/module-exporter').safeRequire('confluence/page-message', function(PageMessage) {
    require('ajs').toInit(PageMessage.displayPageMessage);
});