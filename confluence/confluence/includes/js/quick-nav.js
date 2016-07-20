define('confluence/quick-nav', [
    'jquery',
    'confluence/api/logger'
], function(
    $,
    logger
) {
    "use strict";

    var dropDownPostProcess = [];
    var makeParams;

    return {
        addDropDownPostProcess: function(dp) {
            if(typeof dp !== "undefined") {
                dropDownPostProcess.push(dp);
            } else {
                logger.log("WARN: Attempted to add a dropdown post-process function that was undefined.");
            }
        },
        setMakeParams: function(mp) {
            makeParams = mp;
        },
        init : function(quickSearchInputField, dropDownPlacement) {
            quickSearchInputField.quicksearch("/rest/quicknav/1/search", null, {
                dropdownPlacement : dropDownPlacement,
                dropdownPostprocess : function(dd) {
                    $.each(dropDownPostProcess, function(index, postProcessFunction) {
                        postProcessFunction && postProcessFunction(dd);
                    });
                },
                makeParams: function(value) {
                    // if the makeParams function was set use that one instead of the default
                    if (makeParams) {
                        return makeParams(value);
                    }
                    else {
                        return { query : value };
                    }
                },
                ajsDropDownOptions: {
                    className: "quick-search-dropdown"
                }
            });
        }
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/quick-nav', 'Confluence.QuickNav');