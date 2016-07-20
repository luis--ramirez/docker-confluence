define('confluence/breadcrumbs', [
    'jquery',
    'ajs',
    'document',
    'confluence/templates'
], function(
    $,
    AJS,
    document,
    Templates
) {
    "use strict";

    return {

        /**
         * Attaches an event listener to the ellipsis, so that when it is clicked the breadcrumbs will expand.
         */
        init: function (){
            $(document).on('click', '#ellipsis', function () {
                try {
                    $("#breadcrumbs .hidden-crumb").removeClass("hidden-crumb");
                    $(this).addClass("hidden-crumb");
                    AJS.trigger("breadcrumbs.expanded");
                } catch (e) {
                    AJS.log(e);
                }
            });
        },

        /**
         * Updates and re-renders the editor breadcrumbs after a page has been moved.
         * For more info see https://jira.atlassian.com/browse/CONFDEV-26460
         * @param spaceKey The object's new space key
         * @param parentPage the object's new parent page
         * @param success optional success callback from the ajax request
         * @param error optional error callback from the ajax request
         */
        update: function (spaceKey, parentPage){
            var options = {
                spaceKey: spaceKey,
                title: parentPage
            };

            $.ajax({
                type: "GET",
                dataType: "json",
                data: options,
                url: AJS.contextPath() + "/pages/breadcrumb.action",
                error: function(){},
                success: function(data){
                    if (!data || !data.breadcrumbs){
                        return;
                    }
                    $("ol#breadcrumbs").html(Templates.Breadcrumbs.render({
                        breadcrumbs: data.breadcrumbs,
                        ellipsisIndex: data.ellipsisIndex,
                        ellipsisLength: data.ellipsisLength
                    }));
                }
            });
        }
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/breadcrumbs', function(Breadcrumbs) {
    var AJS = require('ajs');

    AJS.toInit(Breadcrumbs.init);
});

