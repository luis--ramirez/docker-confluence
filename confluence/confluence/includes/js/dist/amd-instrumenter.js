/*eslint confluence/must-use-amd:0, no-undef:0 */
function AmdInstrumenter(configObject) {
    this.config = configObject;
    this.originalRequire = window.require;
}

AmdInstrumenter.prototype.instrument = function (context) {
    var self = this;

    if (typeof window.require.instrumented === 'undefined' || window.require.instrumented !== true) {
        window.require = function (deps) {
            if (Array.isArray(deps)) {
                for (var i = 0; i < deps.length; i++) {
                    context.log({name: deps[i]}, "amdRecord");
                }
            } else {
                context.log({name: deps}, "amdRecord");
            }
            return self.originalRequire.apply(require, arguments);
        };

        window.require.config = self.originalRequire.config;
        window.require.instrumented = true;
    }
};

AmdInstrumenter.prototype.restore = function () {
    if (window.require.instrumented) {
        window.require = this.originalRequire;
    }
};