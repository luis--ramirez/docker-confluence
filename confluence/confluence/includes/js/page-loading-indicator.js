define('confluence/page-loading-indicator', [
    'jquery',
    'underscore',
    'ajs',
    'confluence/templates'
], function(
    $,
    _,
    AJS,
    Templates
) {
    "use strict";

    function PageLoadingIndicator($section) {
        function getBlanket() {
            return $(".confluence-page-loading-blanket", $section);
        }

        function getIndicator() {
            return $(".confluence-loading-indicator", $section);
        }

        return {
            show: function () {
                if (getBlanket().length === 0) {
                    $($section).append(Templates.pageLoadingIndicator());
                }

                getBlanket().show();
                getIndicator().spin({lines: 12, length: 8, width: 4, radius: 10, trail: 60, speed: 1.5, color: "#F0F0F0"});
            },

            hide: function() {
                getIndicator().stop();
                getBlanket().hide();
            },

            /**
             * Shows the spinner until the deferred is resolved or rejected.
             *
             * @param deferred a jquery deferred object
             * @param errorMessage optional error message to display
             */
            showUntilResolved: function(deferred, errorMessage) {
                this.show();
                deferred.always(_.bind(this.hide, this));

                errorMessage && deferred.fail(function() {
                    AJS.messages.error(".confluence-page-loading-errors", {
                        body: errorMessage
                    });
                });
            },

            /**
             * This method specifically waits for a dialog to be visible before hiding the spinner.
             *
             * @param deferred a jquery deferred object
             * @param error optional error message to display
             */
            showUntilDialogVisible: function(deferred, error) {
                var pageLoadingIndicator = this;
                var errorMessage = error || AJS.I18n.getText("dialog.deferred.error.loading");

                var visibleDialog = $('.aui-dialog:visible');
                var visibleDialog2 = $('.aui-dialog2:visible');

                if (!visibleDialog.length && !visibleDialog2.length) {
                    pageLoadingIndicator.show();
                }

                deferred.always(pageLoadingIndicator.hide).fail(function() {
                    AJS.messages.error(".confluence-page-loading-errors", {
                        body: errorMessage
                    });
                });

                //For dialog1
                AJS.bind("show.dialog", function hideLoadingIndicator() {
                    AJS.unbind("show.dialog", hideLoadingIndicator);
                    pageLoadingIndicator.hide();
                });

                //For dialog2
                if (AJS.dialog2 != null && AJS.dialog2 != undefined) {
                    AJS.dialog2.on("show", function hideLoadingIndicator() {
                        AJS.dialog2.off("show", hideLoadingIndicator);
                        pageLoadingIndicator.hide();
                    });
                }
            },

            destroy: function() {
                $section.remove(".confluence-page-loading-blanket");
            }
        };
    }

    return PageLoadingIndicator;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-loading-indicator', 'Confluence.PageLoadingIndicator');
