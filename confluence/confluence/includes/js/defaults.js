/**
 * Generic Confluence default values.
 *
 * @static
 * @since 4.0
 * @class Confluence.Defaults
 */
define('confluence/defaults', [
], function(
) {
    return {
        // The maximum number of search results
        maxResults: 50
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/defaults', 'Confluence.Defaults');
