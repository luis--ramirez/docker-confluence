define('confluence/blogpost-move-dialog', [
    'ajs',
    'jquery',
    'confluence/legacy',
    'confluence/templates',
    'confluence/api/constants'
], function(
    AJS,
    $,
    Confluence,
    Templates,
    CONSTANTS
) {
    "use strict";

    var dialogWidth = 400;
    var dialogHeight = 250;

    function viewBlogPostMoveHandler(dialog, newSpaceKey, errorHandler) {
        $("#move-blogpost-dialog .move-errors").empty();
        $('.button-spinner').spin();
        var moveButton = $(".move-button").disable();
        var cancelButton = $("#move-blogpost-dialog .button-panel-cancel-link").disable();

        function error(message) {
            errorHandler(message);
            moveButton.enable();
            cancelButton.enable();
            $('.button-spinner').spinStop();
        }

        function sendAnalytics(eventName) {
            AJS.trigger('analyticsEvent', {name: eventName, data: {newSpaceKey: newSpaceKey, oldSpaceKey: AJS.params.spaceKey, blogPostId: AJS.params.pageId}});
        }

        if (newSpaceKey === "") {
            error(AJS.I18n.getText("move.blogpost.dialog.no.space.selected"));
            return;
        }

        $.ajax({
            url: CONSTANTS.CONTEXT_PATH + "/pages/moveblogpost.action",
            type: "GET",
            dataType: "json",
            timeout: 180000,
            data: {
                blogPostId: AJS.params.pageId,
                spaceKey: newSpaceKey
            },
            error: function (xhr) {
                if (xhr.status === 403 || xhr.status === 401) {
                    error(AJS.I18n.getText("not.permitted.description"));
                }
                else {
                    error(AJS.I18n.getText("move.blogpost.dialog.move.failed"));
                }

                sendAnalytics('moveblogpost.ajaxError');
            },
            success: function (data) {
                var errors = [].concat(data.validationErrors || []).concat(data.actionErrors || []).concat(data.errorMessage || []);
                if (errors.length > 0) {
                    error(errors[0]);
                    sendAnalytics('moveblogpost.serverValidationError');
                    return;
                }
                sendAnalytics('moveblogpost.success');
                window.location.href = AJS.contextPath() + data.blogPost.url + (data.blogPost.url.indexOf("?") >= 0 ? "&" : "?") + "moved=true";
            }
        });
    }

    function MoveBlogPostDialog(options) {
        var blogPostTitle = AJS.Meta.get('page-title');
        options = $.extend({
            spaceKey: AJS.Meta.get('space-key'),
            spaceName: AJS.Meta.get('space-name'),
            title: AJS.I18n.getText("move.blogpost.dialog.title"),
            buttonName: AJS.I18n.getText("move.name"),
            moveHandler: function (dialog) {
                AJS.debug("No move handler defined. Closing dialog.");
                dialog.remove();
            },
            cancelHandler: function (dialog) {
                dialog.remove();
                return false;
            }
        }, options);

        var dialog = AJS.ConfluenceDialog({
            width : dialogWidth,
            height: dialogHeight,
            id: "move-blogpost-dialog"
        });

        dialog.addHeader(options.title);
        dialog.addPanel(AJS.I18n.getText("move.blogpost.dialog.panel.title"), Templates.MoveBlogPost.dialogPanel(), "move-blogpost-dialog-panel", "move-blogpost-dialog-panel-id");

        $("#new-space").auiSelect2(Confluence.UI.Components.SpacePicker.build());

        var moveFunction = function (dialog) {
            var newSpaceKey = $("#new-space").val();
            options.moveHandler(dialog, newSpaceKey, errorHandler);
        };

        function errorHandler(error) {
            $("#move-blogpost-dialog .move-errors").empty();
            AJS.messages.error("#move-blogpost-dialog .move-errors", {
                body: error,
                closeable: false
            });
        }

        dialog.addButton(options.buttonName, moveFunction, "move-button");
        $(".button-panel-button.move-button").attr("id", "move-button");
        dialog.addCancel(AJS.I18n.getText("cancel.name"), options.cancelHandler);

        dialog.popup.element.find(".dialog-button-panel").prepend("<div class='button-spinner'>&nbsp;</div>");

        dialog.show();
        return dialog;
    }

    return {
        control: MoveBlogPostDialog,
        initialiser: function(e) {
            e.preventDefault();

            if ($("#move-blogpost-dialog").length > 0) {
                $("#move-blogpost-dialog, body > .shadow, body > .aui-blanket").remove();
            }

            new MoveBlogPostDialog({
                moveHandler: viewBlogPostMoveHandler
            });

            return false;
        }
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/blogpost-move-dialog', function(MoveBlogPostDialog) {
    require('confluence/legacy').MoveBlogPostDialog = MoveBlogPostDialog.control;
    require('ajs').bind("deferred.blog-move.tools-menu.click", MoveBlogPostDialog.initialiser);
});