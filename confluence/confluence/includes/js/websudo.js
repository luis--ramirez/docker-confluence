define('confluence/websudo', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    "use strict";

    return function WebSudo() {
        $("a#websudo-drop.drop-non-websudo").click(function()
        {
            $.getJSON($(this).attr("href"), function() {
                $("li#confluence-message-websudo-message").slideUp(function(){
                    // Once done, other elements like the sidebar
                    AJS.trigger('confluence.header-resized');
                });
            });
            return false;
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/websudo', function(WebSudo) {
    require('ajs').toInit(WebSudo);
});
