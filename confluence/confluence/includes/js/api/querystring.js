/**
 * Converts querystrings from a string to an object and back again.
 * @module confluence/api/querystring
 */
define('confluence/api/querystring', [
],
function(
) {
    "use strict";

    return {
        /**
         * Parse an object and returns a querystring.
         *
         * @example
         * // Returns "max-result=10&project-key=CONF"
         * querystring.stringify({ "max-result" : [ "10" ], "project-key" : [ "CONF" ] })
         *
         * @param queryParams Parameters from which to build the query string. These parameters should already be
         * URL encoded as buildQueryString does not add additional encoding
         *
         * @returns {String}
         *
         */
        stringify: function(queryParams) {
            var queryString = '';

            for (var param in queryParams) {
                for (var i = 0; i < queryParams[param].length; i++) {
                    queryString += '&' + param;
                    if (queryParams[param][i]) {
                        queryString += '=' + queryParams[param][i];
                    }
                }
            }

            return queryString.substring(1);
        },
        /**
         * Parses a querystring and returns an object. Return an empty object if the querystring is an empty string or
         * undefined.
         *
         * @example
         * // Returns { "max-result" : [ "10" ], "project-key" : [ "CONF" ] }
         * querystring.parse("max-result=10&project-key=CONF");
         *
         * // Returns { "params" : [ "firstName", "lastName" ]}
         * querystring.parse("params=firstName&params=lastName");
         *
         * // Returns { "search" : [ "My%20favourites" ] } when executed on
         * // page http://www.mywebsite.com/?search=My%20Favourites
         * querystring.parse(window.location.search);
         *
         * @param querystring The querystring that will be converted to an object.
         * @returns {Object}
         */
        parse: function (querystring) {
            var queryParams = {};

            if (querystring) {
                if (querystring.substr(0, 1) === "?") {
                    querystring = querystring.substr(1);
                }

                var parsedQueryString = querystring.split('&');

                for (var i = 0; i < parsedQueryString.length; i++) {
                    var parsedParamString = parsedQueryString[i].split('=');

                    if (!queryParams[parsedParamString[0]]) {
                        queryParams[parsedParamString[0]] = [];
                    }
                    // Don't use parsedParamString[1] to retrieve the parameter value in case of query strings such as "src=something=something"
                    // The '=' in the value will cause the string to be split
                    queryParams[parsedParamString[0]].push(parsedQueryString[i].substring(parsedParamString[0].length+1));
                }
            }

            return queryParams;
        }
    };
});