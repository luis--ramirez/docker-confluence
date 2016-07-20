define('confluence/comments', [
    'ajs',
    'jquery',
    'confluence/storage-manager'
], function(
    AJS,
    $,
    StorageManager
) {
    "use strict";

    function confirmRemovalHandler() {
        if (confirm(AJS.I18n.getText("remove.comment.confirmation.message"))) {
            this.href = this.href + '&confirm=yes';
            return true;
        }
        return false;
    }

    /**,
     * Bind a function to the remove option for the identified comment.
     *
     * TODO remove is actually a pluggable web-item. We actually need a more flexible/pluggable
     * mechanism for doing this. For instance, Likes would need dynamic binding list this as
     * well.
     *
     * @param commentId
     */
    var binder = {
        bindRemoveConfirmation: function(commentId) {
            $('#comment-' + commentId + ' .comment-action-remove a').click(confirmRemovalHandler);
        }
    };

    function initialiser($) {

        var commentsStorage = StorageManager("confluence", "comments");

        if (!$("#comments-section").length) {
            return;
        }

        /*
         * Alternate colours of comments. Doing this with threaded comments in the backend
         * is painful.
         */
        $('#comments-section .comment:odd').addClass('odd');

        /*
         * Remove comment pop-up confirmation.
         */
        $('.comment-action-remove a').click(confirmRemovalHandler);

        // Text editor bindings
        var textEditor = $("#addcomment.comment-text");
        var textarea = $("#comments-text-editor textarea");
        textarea.focus(function() {
            textEditor.addClass("active");
        }).blur(function() { //html5 supported browsers
            if(!$.trim(textarea.val()).length) {
                textEditor.removeClass("active");
            }
        }).bind("reset.default-text", function() { //non html5 supported browsers
            textEditor.removeClass("active");
        });

        // prevent empty comments
        $("form[name='textcommentform']").submit(function() {
            var content = textarea.val();
            if (!$.trim(content)) {
                alert(AJS.I18n.getText("content.empty"));
                return false;
            }
            return true;
        });
        $("#add-comment-rte").click(function() {
            if (!textarea.hasClass("placeholded")) {
                commentsStorage.setItem("text-comment", $.trim(textarea.val()));
            }
        });
        if ($("#addcomment #rte").length) {
            AJS.bind("init.rte", function(e, data) {
                var content = commentsStorage.getItem("text-comment");
                if (content) {
                    data.editor.setContent(content);
                    commentsStorage.setItem("text-comment", "");
                }
            });
        }
    }

    return {
        binder: binder,
        initialiser: initialiser
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/comments', function(Comments) {
    // TODO this should be merged with Confluence.CommentsManager from the quick-comments plugin.
    // It will be done once Quick Comments is finished. Having CommentsManager in a plugin helps dev speed.
    require('confluence/legacy').Comments = Comments.binder;
    require('ajs').toInit(Comments.initialiser);
});

