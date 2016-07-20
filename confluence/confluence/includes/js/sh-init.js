define('confluence/sh-init', [
], function(
) {
    return function ($) {
        dp.SyntaxHighlighter.HighlightAll('ajs-syntax-highlight');
    };
});

require('confluence/module-exporter').safeRequire('confluence/sh-init', function(shInit) {
    require('ajs').toInit(shInit);
});
