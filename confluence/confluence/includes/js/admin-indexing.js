define('confluence/admin-indexing', [
    'jquery',
    'window',
    'confluence/api/ajax',
    'confluence/api/constants'
], function(
    $,
    window,
    SafeAjax,
    CONSTANTS
) {
    "use strict";

    return function () {

        var searchIndexProgress = $("#search-index-task-progress-container");
        var reindexTaskInProgress = $("#reindex-task-in-progress").length > 0;
        var buildSearchIndexButton = $("#build-search-index-button");
        var searchIndexExists = $("#search-index-exists").length > 0;
        var searchIndexElapsedTime = $("#search-index-elapsed-time");
        var searchIndexElapsedTimeContainer = $("#search-index-elapsed-time-container");
        var searchIndexErrorStatus = $("#search-index-error-status");
        var searchIndexSuccessStatus = $("#search-index-success-status");
        var searchIndexInProgressStatus = $("#search-index-inprogress-status");
        var $indexingStatus = $(".indexing-status");

        buildSearchIndexButton.click(function () {

            SafeAjax.ajax({
                url: CONSTANTS.CONTEXT_PATH + "/admin/reindex.action",
                type: "POST",
                dataType: "json",
                data: {}, // must declare this to use SafeAjax.ajax
                success: function (data) {
                    searchIndexProgress.progressBar(0);
                    searchIndexElapsedTimeContainer.hide();
                    monitorProgress();
                }
            });

            return false;
        });

        if (!searchIndexExists || searchIndexElapsedTime.html() === '') {
            searchIndexElapsedTimeContainer.hide();
        }

        searchIndexProgress.progressBar(0);

        if (reindexTaskInProgress) {
            monitorProgress();
        }

        function monitorProgress() {
            buildSearchIndexButton.prop("disabled", true);

            var searchInterval = window.setInterval(function () {
                $.getJSON(CONSTANTS.CONTEXT_PATH + '/json/reindextaskprogress.action', function (data) {
                    searchIndexProgress.progressBar(data.percentageComplete);

                    $indexingStatus.text(data.count + " / " + data.total);

                    searchIndexElapsedTimeContainer.show();
                    searchIndexElapsedTime.html(data.compactElapsedTime);

                    if (data.percentageComplete == 100) {
                        buildSearchIndexButton.prop("disabled", false);

                        searchIndexSuccessStatus.show();
                        searchIndexErrorStatus.hide();
                        searchIndexInProgressStatus.hide();

                        window.clearInterval(searchInterval);
                    }
                });
            }, 1000);
        }

        if (searchIndexExists && !reindexTaskInProgress) {
            searchIndexProgress.progressBar(100);
        }

        if (reindexTaskInProgress) {
            searchIndexInProgressStatus.show();
            searchIndexErrorStatus.hide();
            searchIndexSuccessStatus.hide();
        } else if (searchIndexExists) {
            searchIndexSuccessStatus.show();
            searchIndexErrorStatus.hide();
            searchIndexInProgressStatus.hide();
        } else {
            searchIndexErrorStatus.show();
            searchIndexSuccessStatus.hide();
            searchIndexInProgressStatus.hide();
        }

    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/admin-indexing', function(AdminIndexing) {
    var AJS = require('ajs');

    AJS.toInit(AdminIndexing);
});

