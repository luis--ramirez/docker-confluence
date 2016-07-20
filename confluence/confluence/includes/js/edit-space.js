define('confluence/edit-space', [
    'jquery',
    'confluence/legacy'
], function(
    $,
    Confluence
) {
    "use strict";

    return function () {
        Confluence.Binder.autocompletePage($(".edit-space-details"));
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/edit-space', function(EditSpace) {
    var AJS = require('ajs');

    AJS.toInit(EditSpace);
});