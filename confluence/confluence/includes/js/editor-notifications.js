define('confluence/editor-notifications', [
], function(
) {
    /**
     * Displays a notification.
     *
     * @static
     * @class EditorNotification
     * @namespace AJS.Confluence
     */
    "use strict";

    var notificationFlag;

    return {
        /**
         * Display a notification.
         *
         * @param type the type of message. Can be one of error, warning, info or success.
         * @param message the message that will be notified (without any encoding so ensure the message is HTML safe).
         */
        notify: function(type, message, close) {

            var Flag = require('aui/flag');

            // CONFDEV-31504 auto-dismiss existing editor flag before showing a new one
            if (notificationFlag !== undefined && notificationFlag.getAttribute('aria-hidden') !== "true") {
                notificationFlag.close();
            }

            if (close === undefined) {
                // persistent errors, transient warnings
                close = type === 'error' ? 'manual' : 'auto';
            }

            notificationFlag = Flag({
                type: type,
                body: message,
                close: close
            });
        }
    };
});


require('confluence/module-exporter').safeRequire('confluence/editor-notifications', function(EditorNotification) {
    var AJS = require('ajs');

    AJS.bind("init.rte", function() {
        AJS.Confluence.EditorNotification = EditorNotification;
    });
});

