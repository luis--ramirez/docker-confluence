/**
 * Utility functions for converting between URL objects and strings.
 * @module confluence/api/url
 */
define('confluence/api/url', [
    'confluence/api/querystring',
    'jquery'
],
function(
    querystring,
    $
) {
    "use strict";

    var parseUriPattern = /([^\?|#]+)[\?]?([^#]*)[#]?(.*)/;
    var urlKeys = ['source', 'urlPath', 'queryParams', 'anchor'];

    return {
        /** Converts a URL to an object representing the URL. */
        parse: function (url) {
            var urlComponents = {};
            var parsedUrl = parseUriPattern.exec(url);

            if (parsedUrl) {
                for (var i = 0; i < urlKeys.length; i++) {
                    urlComponents[urlKeys[i]] = parsedUrl[i];
                }
                urlComponents.queryParams = querystring.parse(urlComponents.queryParams);
            }

            return urlComponents;
        },
        /** Converts a URL object to a string. */
        format: function (urlComponents) {
            if ($.isEmptyObject(urlComponents)) {
                return "";
            } else {
                return (!urlComponents.urlPath ? "" : urlComponents.urlPath) +
                        ($.isEmptyObject(urlComponents.queryParams) ? "" : "?" + querystring.stringify(urlComponents.queryParams)) +
                        (!urlComponents.anchor ? "" : "#" + urlComponents.anchor);
            }
        }
    };
});