define('confluence/contentnamesearch', [
    'jquery',
    'ajs',
    'confluence/quick-nav'
], function(
    $,
    AJS,
    QuickNav
) {
    "use strict";

    function ContentNameSearch() {
        /**
         * Opens the search result in a new tab when you press ctrl+enter.
         */
        var enableSearchInNewTab = function() {
            $("#quick-search").on("keydown", function (e) {
                var quickSearchDropdownSelected = AJS.dropDown.current && AJS.dropDown.current.getFocusIndex() != -1;
                var ctrlEnterPressed = e.which === 13 && (e.metaKey || e.ctrlKey);
                if (ctrlEnterPressed && !quickSearchDropdownSelected) {
                    var $this = $(this);
                    $this.attr("target", "_blank");
                    $this.submit();
                    $this.attr("target", "");
                }
            });
        };

        var setupAnalytics = function() {
            // Capture the type of the result that is being clicked on
            $("#quick-search").on("click", "div.quick-search-dropdown li", function (e) {
                var li = $(this);
                var eventTarget = $(e.target);
                var notSecondAOrRealClick = !(eventTarget.is("a") && (eventTarget.parent().children("a")).index(eventTarget) === 1) || (e.originalEvent !== undefined);
                if (notSecondAOrRealClick) {
                    var resultType = li.children("a:first").attr("class");
                    var resultIndex = li.index("div.quick-search-dropdown li");
                    var payload = {name: "quicknav-click-" + resultType, data: {index: resultIndex}};
                    AJS.trigger("analytics", payload);
                }
            });

            // Capture when people use the quicknav field to navigate to the search page
            $("#quick-search").on("submit", function () {
                var numberOfQuickNavResults = $("div.quick-search-dropdown li").length;
                var payload = {name: "quicknav-hit-enter", data: {results: numberOfQuickNavResults}};
                AJS.trigger("analytics", payload);
            });
        };

        /**
         * Binds two events to the form for showing/hiding a loading spinner when there is ajax activity in the quick search
         * drop downs. Trigger "quick-search-loading-start" from a dropdown to show the spinner, and "quick-search-loading-stop"
         * to hide the spinner.
         */
        var bindLoadingSpinner = function() {
            $("#quick-search").on({
                "quick-search-loading-start" : function() {
                    // quick-search-loading class used to hide #quick-search:after element which contains the search icon
                    // check master.css for the CSS rule
                    $(this).spin({ className: 'quick-search-spinner' }).addClass('quick-search-loading');
                    $('.quick-search-spinner').css('left', ($(this).outerWidth() - 35) + 'px'); // place the spinner over search icon
                },
                "quick-search-loading-stop" : function() {
                    $(this).spinStop().removeClass('quick-search-loading');
                }
            });
        };

        /**
         * Append the drop down to the form element with the class quick-nav-drop-down
         */
        var quickNavPlacement = function (input) {
            return function (dropDown) {
                input.closest("form").find(".quick-nav-drop-down").append(dropDown);
            };
        };

        /**
         * Add the space name to the dropdown field.
         * @param dd
         */
        var addSpaceName = function(dd) {
            $("a", dd).each(function () {
                var $a = $(this);
                var $span = $a.find("span");
                // get the hidden space name property from the span
                var properties = $span.data("properties");
                var spaceName = properties ? properties.spaceName : null;
                if (spaceName && !$a.is(".content-type-spacedesc")) {
                    // clone the original link for now. This could potentially link to the space?
                    $a.after($a.clone().attr("class", "space-name").html(spaceName));
                    // add another class so we can restyle to make room for the space name
                    $a.parent().addClass("with-space-name");
                }

            });
        };

        var quickSearchQuery = $("#quick-search-query");
        var spaceBlogSearchQuery = $("#space-blog-quick-search-query");
        var confluenceSpaceKey = $("#confluence-space-key");

        var placementFunction = quickNavPlacement(quickSearchQuery);

        // Choose and Setup the QuickNav
        var quickNav = AJS.defaultIfUndefined("Atlassian.SearchableApps.QuickNav", { defaultValue: QuickNav });
        quickNav.init(quickSearchQuery, placementFunction);
        quickNav.addDropDownPostProcess(addSpaceName);

        if (spaceBlogSearchQuery.length && confluenceSpaceKey.length) {
            spaceBlogSearchQuery.quicksearch("/rest/quicknav/1/search?type=blogpost&spaceKey=" +
                    AJS("i").html(confluenceSpaceKey.attr("content")).text(), null, {
                dropdownPlacement : quickNavPlacement(spaceBlogSearchQuery)
            });
        }

        setupAnalytics();
        bindLoadingSpinner();
        enableSearchInNewTab();
    }

    return ContentNameSearch;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/contentnamesearch', function(ContentNameSearch) {
    var AJS = require('ajs');
    AJS.toInit(ContentNameSearch);
});
