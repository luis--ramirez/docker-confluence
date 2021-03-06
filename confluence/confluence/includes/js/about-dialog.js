define('confluence/about-dialog', [
    'jquery',
    'ajs',
    'aui/templates',
    'confluence/api/constants'
],
/**
 * Displays the About Confluence dialog
 * @param $
 * @param AJS
 * @param aui AUI Soy templates
 */
function(
    $,
    AJS,
    aui,
    CONSTANTS
) {
    "use strict";

    function AboutDialog() {}

    AboutDialog.prototype.createChrome = function() {
        var closeButtonHTML = aui.buttons.button({
            type: 'link',
            id: 'close-about-dialog',
            text: AJS.I18n.getText("close.name")
        });
        var $chrome = $(aui.dialog.dialog2({
            id: 'about-confluence-dialog',
            modal: false,
            titleText: AJS.I18n.getText("aboutpage.section.title"),
            footerActionContent: closeButtonHTML,
            size: 'large'
        }));
        $chrome.on('click', '#close-about-dialog', function () {
            AJS.dialog2($chrome).hide();
        });
        return $chrome;
    };

    AboutDialog.prototype.getContents = function() {
        var contentUrl = CONSTANTS.CONTEXT_PATH + "/aboutconfluence.action";
        return $.get(contentUrl);
    };

    AboutDialog.prototype.create = function() {
        var $dialog = this.createChrome();
        this.getContents().then(function(data) {
            $dialog.find('.aui-dialog2-content').html(data).attr('id', "about-page-content");
        });
        return AJS.dialog2($dialog);
    };

    return AboutDialog;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/about-dialog', function(AboutDialog) {
    var aboutDialog = null;

    require('ajs').bind('deferred.about-confluence.help-menu', function (e) {
        e.preventDefault();
        if (aboutDialog === null) {
            aboutDialog = (new AboutDialog()).create();
        }
        aboutDialog.show();
    });
});