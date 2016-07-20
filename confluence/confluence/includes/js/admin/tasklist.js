define('confluence/tasklist', [
    'jquery',
    'ajs',
    'confluence/meta',
    'confluence/api/constants'
], function(
    $,
    AJS,
    Meta,
    CONSTANTS
) {
    "use strict";

    return function(){
        $(".tasklist a.view-completed-tasks").click(function(e) {
            $(".tasks.completed").toggle();
            e.preventDefault();
        });
        $(".tasklist ul.tasks.completed").hide();
        $(".tasklist").on("click", ".task-checkbox", function(e) {
            e.preventDefault();
            var key = $(this).data('task-key');
            var ignored = $(this).hasClass('dismissed');
            var url = CONSTANTS.CONTEXT_PATH + (ignored ? "/admin/unignoretask.action" : "/admin/ignoretask.action");
            var expected = !ignored;
            if (!key) {
                return;
            }

            $(this).toggleClass('dismissed');
            $.ajax({
                url : url,
                data : {
                    key : key,
                    atl_token : Meta.get('atl-token')
                }
            }).done(function(data) {
                if (data.ignored ^ expected) {
                    // The task hasn't been ignored/reinstated properly
                    $(this).toggleClass('dismissed');
                    AJS.messages.error({
                        title: AJS.I18n.getText("admintask.error.title"),
                        body: expected ? AJS.I18n.getText("admintask.error.not.dismissed") : AJS.I18n.getText("admintask.error.not.reinstated")
                    });
                }
            }).fail(function(a, b, c) {
                $(this).toggleClass('dismissed');
                AJS.messages.error({
                    title: AJS.I18n.getText("admintask.error.title"),
                    body: AJS.I18n.getText("admintask.error.unknown")
                });
            });
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/tasklist', function(TaskList) {
    var AJS = require('ajs');

    AJS.toInit(TaskList);
});
