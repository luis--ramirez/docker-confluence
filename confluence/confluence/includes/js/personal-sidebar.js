define('confluence/personal-sidebar', [
    'jquery',
    'confluence/storage-manager',
    'ajs'
], function(
    $,
    StorageManager,
    AJS
) {
    "use strict";

    var PersonalSidebar = {};

    PersonalSidebar.initialize = function() {
        var sidebarPrefs = StorageManager("personal-sidebar");
        var sidebar = $("#personal-info-sidebar");
        var height = sidebar.height();
        var content = $("#content");

        function toggleSidebar() {
            sidebar.toggleClass("collapsed");
            content.toggleClass("sidebar-collapsed");
            sidebar.trigger("toggled");
        }

        if (sidebarPrefs.getItemAsBoolean("show")) {
            toggleSidebar();
        }

        $(".sidebar-collapse").click(function(e) {
            toggleSidebar();
            sidebarPrefs.setItem("show", sidebar.hasClass("collapsed"));
            return AJS.stopEvent(e);
        }).height(height); // fixes half-px rounding bug in FF but causes overflow bug
    };
    return PersonalSidebar;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/personal-sidebar', function(PersonalSidebar) {
    require('ajs').toInit(PersonalSidebar.initialize);
});