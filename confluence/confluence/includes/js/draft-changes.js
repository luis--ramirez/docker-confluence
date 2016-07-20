define('confluence/draft-changes', [
    'jquery',
    'ajs',
    'window',
    'confluence/legacy'
], function(
    $,
    AJS,
    window,
    Confluence
) {
    return {
        init: function() {
            var popup;
            var removeDraftPopup;

            var buildPopup = function(showMenu) {
                popup = new AJS.Dialog(860, 530, "view-diff-draft-dialog");
                var heading = AJS.I18n.getText("draft.heading");
                popup.addHeader(heading.replace(/\{0\}/, ""));
                var draftDialog = $(Confluence.Templates.DraftChanges.dialogContent());
                popup.addPanel("Diff", draftDialog);
                if (showMenu) {
                    popup.addButton(AJS.I18n.getText("edit.name"), function (e) {
                        popup.hide();
                        if (Confluence.Editor && Confluence.Editor.Drafts) {
                            Confluence.Editor.Drafts.useDraft();
                        } else {
                            window.location = $(this).attr("data-href");
                        }
                    }, "resume-diff-link");
                    popup.addButton(AJS.I18n.getText("discard.name"), function (e) {

                        if (AJS.DarkFeatures.isEnabled('editor.ajax.save') &&
                                !AJS.DarkFeatures.isEnabled('editor.ajax.save.disable') &&
                                AJS.Meta.get('remote-user') !== '') {
                            Confluence.Editor.SafeSave.Draft.discardDraft(AJS.params.pageId, AJS.Meta.get('existing-draft-id'))
                                    .done(Confluence.Editor.SafeSave.Draft.onSuccessDiscardDraft)
                                    .fail(Confluence.Editor.SafeSave.Draft.onErrorDiscardDraft);
                            popup.hide();
                            return;
                        }
                        if (Confluence.Editor && Confluence.Editor.Drafts) {
                            popup.hide();
                            Confluence.Editor.Drafts.discardDraft(AJS.Meta.get('existing-draft-id'));
                            AJS.Confluence.Analytics.publish('rte.notification.draft.discard');
                        } else {
                            var draftId = $(this).data("draftid");
                            if(discardDraft(draftId)){
                                popup.hide();
                            }
                        }
                    }, "discard-diff-link");
                }
                popup.addCancel(AJS.I18n.getText("close.name"), function () {
                    popup.hide();
                    return false;
                });
                draftDialog.removeClass("hidden");
            };

            var loadDiffInDialog = function(data, draftId) {

                $("#diff-view").html(data.htmlDiff);
                var heading = AJS.I18n.getText("draft.heading", AJS.escapeHtml(data.title));
                popup.addHeader(heading);
                // CONFDEV-12853: Add help link via prepend() instead of append() to prevent FF display issue
                popup.popup.element.find(".dialog-title").prepend(Confluence.Templates.DraftChanges.helpLink());

                // Change the link url
                var contextPath = AJS.contextPath();
                $(".resume-diff-link").attr("data-href", contextPath + "/pages/resumedraft.action?draftId=" + draftId);
                $(".discard-diff-link").data("draftid", draftId);

                AJS.setVisible("#merge-warning", data.isMergeRequired);
            };

            var getDiffForLink = function(difflink) {
                var pageId;
                var username;
                var draftId;
                var loadDiffParamsFromLink = function(difflinkClass) {
                    var matched = /draftPageId:([^ ]*)/.exec(difflinkClass);
                    pageId = matched ? matched[1] : AJS.Meta.get('page-id');


                    matched = /username:([^ ]*)/.exec(difflinkClass);
                    username = matched ? matched[1] : AJS.Meta.get('remote-user');

                    matched = /draftId:([^ ]*)/.exec(difflinkClass);
                    draftId = matched ? matched[1] : null;
                };

                loadDiffParamsFromLink(difflink.attr("class"));

                AJS.safe.ajax({
                    url: AJS.contextPath() + "/draftchanges/viewdraftchanges.action",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "pageId": pageId,
                        "username": username
                    },
                    success: function(data) {
                        if (data.actionErrors) {  // TODO - make nicer
                            var errorHtml = "";
                            var errors = data.actionErrors;
                            for (var i = 0; i < errors.length; i++)
                            {
                                AJS.log("error: " + (errors[i]));
                                errorHtml = errorHtml + "<div>" + errors[i] + "</div>";
                            }
                            $("#diff-view").html(errorHtml);
                        } else {
                            loadDiffInDialog(data, draftId);
                        }
                    },
                    error: function(data) {
                        var msg = data["errors"] || "An unknown error has occurred. Please check your logs";
                        $("#diff-view").html(msg);
                    }
                });
            };

            var openDiffDialog = function(difflink, showMenu) {
                if (!popup) {
                    buildPopup(showMenu);
                }
                popup.addHeader(AJS.I18n.getText("loading.name"));
                $("#diff-view").html("<tr><td id='draft-changes-waiting-icon'>Loading...</td></tr>");
                getDiffForLink(difflink);
                popup.show();
            };

            var discardDraft = function(draftId){

                var message = AJS.I18n.getText("discard.draft.confirmation");

                if (confirm(message)) {

                    AJS.safe.ajax({
                        url: AJS.contextPath() + "/json/deletedraft.action",
                        type: "GET",
                        dataType: "json",
                        data: {
                            draftId: draftId
                        },
                        success: function(data) {
                            if (data.actionErrors) {
                                var errorHtml = ["<ul>"];
                                var errors = data.actionErrors;

                                for (var i = 0; i < errors.length; i++) {
                                    AJS.log("error: " + (errors[i]));
                                    errorHtml.push("<li>" + errors[i] + "</li>");
                                }
                                errorHtml.push("</ul>");

                                AJS.messages.error("#errors", {
                                    title: AJS.I18n.getText("discard.draft.error.title"),
                                    body: AJS.I18n.getText("draft.saving.error.could.not.delete") + " " + errorHtml.join("\n")
                                });
                            } else {

                                var $row = $("#draft-" + draftId);

                                var $table = $row.closest("table");

                                var $draftsContainer = $table.closest(".drafts-container");

                                $row.remove();

                                if ($table.find("tbody tr").length === 0) {
                                    $draftsContainer.append("<span id=\"no-drafts-message\">" + AJS.I18n.getText("no.drafts.found") + "</span>");
                                }

                            }
                        },
                        error: function(data) {
                            AJS.messages.error({
                                title: "Error",
                                body: data["errors"] || AJS.I18n.getText("discard.draft.unknown.error")
                            });
                        }
                    });
                    return true;
                }
                return false; // user cancelled confirm message
            };

            /* We need to bind these handlers to the body so that the dialog actually opens when WebDriver
             triggers the click event from AbstractEditorPage#openDraftChangesDialogFromWarning
             If we delegate from #draft-messages, 'testDraftNotOverwrittenWithoutChangesInQuickEdit' will fail. */
            $("body")
                    .on('click', '.view-diff-link', function (e) { // For edit page
                        var elementTriggerId = this.id;

                        openDiffDialog($(this), elementTriggerId === "view-diff-link-notification");

                        // capture the ID of the element that opened the view-diff-dialog
                        AJS.trigger('analytics', { name: 'confluence.editor.view-diff-dialog.open', data: {
                            elementTriggerId: elementTriggerId
                        }});

                        return AJS.stopEvent(e);
                    });

            // For "View my drafts" page
            $('.drafts-by-space')
                    .on('click', '.discard-draft-link', function (e) {
                        e.preventDefault();
                        AJS.Confluence.Analytics.publish('confluence.draft-list.discard');
                        var draftId = $(this).data("draftid");
                        discardDraft(draftId);
                    })
                    .on('click', '.resume-draft-link', function () {
                        AJS.Confluence.Analytics.publish('confluence.draft-list.resume');
                    });
        }
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/draft-changes', function(DraftChanges) {
    var AJS = require('ajs');

    AJS.toInit(DraftChanges.init);
});


