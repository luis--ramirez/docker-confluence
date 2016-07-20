/**
 * Confluence's module for using [Skate.js]{@link https://github.com/skatejs/skatejs} in Confluence's UI.

 *
 * Skate is a lightweight polyfill for creating Custom Elements.
 * Skate is Confluence's conduit to creating web-components.
 *
 * Imports the Skate module from [the Atlassian JSLibs plugin]{@link https://stash.atlassian.com/projects/CP/repos/atlassian-jslibs}
 *
 * @module skate
 */
define('skate', ['atlassian/libs/skate-0.12.6'], function(skate) {
    return skate;
});
