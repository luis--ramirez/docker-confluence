require([], function() {
    //THIS IS DIRTY HACK TO MAKE RATCHET BUILD GREEN
});

(function() {
    var pendingClaims = {};
    var availablePagelets = {};

    // All CSS/JS URLs that are already on the page.
    var existingJs = [];
    var existingCss = [];

    window.BigPipe = {
        pageletArrive: function (id, data) {
            (pendingClaims[id] || []).forEach(function (callback) {
                try {
                    callback(null, data);
                } catch (err) {
                    AJS.warn(id + " pagelet handler choked during callback", err);
                }
            });
            availablePagelets[id] = [null, data];
            delete pendingClaims[id];
        },
        claimPagelet: function (id, callback) {
            if (availablePagelets[id]) {
                return callback.apply(null, availablePagelets[id]);
            }

            if (!pendingClaims[id]) {
                pendingClaims[id] = [];
            }
            pendingClaims[id].push(callback);
        },
        setup: function(macroId, useDefaultSpinner) {
            if(useDefaultSpinner) {
                $('#macro-' + macroId + ' .default-macro-spinner').spin();
            }

            BigPipe.claimPagelet("macro-" + macroId, function(err, data) {
                if(useDefaultSpinner) {
                    $('#macro-' + macroId + ' .default-macro-spinner').spinStop();
                }
                $("div#macro-" + macroId).replaceWith(data.content);
            });
        }
    };
})();
