define('jquery', function() {
    "use strict";
    // AMD loader is shared between Confluence and Confluence mobile
    // In Confluence jquery is a reference to jQuery and in mobile it is a reference to Zepto
    return typeof jQuery !== "undefined" ? jQuery : Zepto;
});
