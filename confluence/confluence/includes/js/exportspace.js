define('confluence/exportspace', [
    'jquery',
    'ajs',
    'window',
    'raphael',
    'confluence/api/constants'
], function(
    $,
    AJS,
    window,
    Raphael,
    CONSTANTS
) {
    "use strict";

    return function ExportSpace() {
        var TREE_LOADED_ATTRIBUTE = "data-content-tree-loaded";
        function contentOptionChangeHandler() {
            var isAllSelected = !!$("#contentOptionAll:checked").length;
            if (isAllSelected) {
                hideContentTree();
            } else {
                showContentTree();
            }
        }

        function hideContentTree() {
            $("#exportContentTree").hide();
            $("#export-comments-attachments-options-container").hide();
            $("#export-content-tree-container").hide();
        }

        function showContentTree() {
            var $exportContentTree = $("#exportContentTree");
            if (!($exportContentTree.attr(TREE_LOADED_ATTRIBUTE) === "true")) {
                loadContentTree(function(){
                    //setup the events once the tree is loaded
                    $(".exportContentTreeCheckbox").click(function () {
                        toggleChildren(this);
                    });

                    // Single node select functionality
                    //
                    $(".togglemeonlytreenode").click(function (event) {
                        var inputCheckbox = $($(this).siblings(".exportContentTreeCheckbox").get(0));
                        if (inputCheckbox.prop("checked")) {
                            inputCheckbox.prop("checked",false);
                        } else {
                            inputCheckbox.prop("checked", true);
                        }
                        event.preventDefault();
                    });
                });
            }
            $("#export-comments-attachments-options-container").show();
            $("#export-content-tree-container").show();
            $exportContentTree.show();
        }

        function toggleChildren(checkboxElement) {
            var $checkbox = $(checkboxElement);
            var isChecked = $checkbox.prop("checked");

            $checkbox.parent().find("input.exportContentTreeCheckbox").prop("checked", isChecked)
                    .each(cascadeToggleExcludes(isChecked));
        }

        function cascadeToggleExcludes (isChecked) {
            return function (idx, elem) {
                var pageId = $(elem).val();
                var $excludeInput = $('input[name="contentToBeExcluded"]', $(elem).parent());
                if (!isChecked) {
                    AJS.debug("Setting contentToBeExcluded to " + pageId);
                    $excludeInput.val(pageId);
                } else {
                    AJS.debug("Unsetting contentToBeExcluded");
                    $excludeInput.val("");
                }
            };
        }

        /**
         * Loads the page tree. When the tree is completed loading, call the loadCompletedCallback parameter if given.
         */
        function loadContentTree(loadCompletedCallback) {
            var $exportContentTree = $("#exportContentTree");
            var killSpinner = Raphael.spinner("exportContentTree", 15, "#111");
            var url = CONSTANTS.CONTEXT_PATH + $exportContentTree.attr("data-content-tree-src");
            var data = {
                key:$exportContentTree.attr("data-space-key")
            };
            $.ajax({
                type: "GET",
                url: url,
                data: data,
                success:function (data) {
                    killSpinner();
                    $exportContentTree
                            .attr(TREE_LOADED_ATTRIBUTE, "true")
                            .html(data);
                    loadCompletedCallback && loadCompletedCallback();
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    killSpinner();
                    var errorMessage = AJS.template.load("content-tree-error-template").fill({
                        errorText:errorThrown + " " + textStatus + ": url=" + url + " params=" + $.param(data)
                    });
                    $exportContentTree.attr(TREE_LOADED_ATTRIBUTE, "true")
                            .html(errorMessage);
                    $('div.buttons-container input.submit[name="confirm"]').attr('disabled', 'disabled');
                },
                dataType:"html"
            });
        }

        // Check and clear all links
        //
        $("a.checkAllLink").click(function () {
            $("input.exportContentTreeCheckbox").prop("checked", true)
                    .each(cascadeToggleExcludes(true));
            return false;
        });
        $("a.clearAllLink").click(function () {
            $("input.exportContentTreeCheckbox").prop("checked", false)
                    .each(cascadeToggleExcludes(false));
            return false;
        });

        // Include comments and backup attachments checkboxes
        //
        $("#includeComments").click(function () {
            $("#includeCommentsCopy").prop("checked", this.checked);
        });
        $("#includeCommentsCopy").click(function () {
            $("#includeComments").prop("checked", this.checked);
        });
        $("#backupAttachments").click(function () {
            $("#backupAttachmentsCopy").prop("checked", this.checked);
        });
        $("#backupAttachmentsCopy").click(function () {
            $("#backupAttachments").prop("checked", this.checked);
        });

        // Pages to export radio buttons
        //
        $("#contentOptionAll, #contentOptionVisible").click(contentOptionChangeHandler);

        $(".export-space-choose-format form").submit(function(e){
            e.preventDefault();
            var $form = $(this);
            var $selected = $('input[name=format]:checked', $form);
            var href = $selected.attr('data-href');
            if (href) {
                window.location.href = href;
            }
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/exportspace', function(ExportSpace) {
    var AJS = require('ajs');

    AJS.toInit(ExportSpace);
});
