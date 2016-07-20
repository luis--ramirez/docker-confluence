/**
 * Provides utility functions for publishing analytics in Confluence, including support for adding
 * and removing the 'src' parameter from URLs once an equivalent analytics event has been published.
 *
 * NOTE - there are plugins that access these utility functions on the global AJS.Confluence variable
 * at the moment, once this is no longer true this code should be refactored to stop exposing functionality
 * globally.
 */
define('confluence/analytics-support', [
    'jquery',
    'ajs',
    'confluence/meta',
    'window',
    'document',
    'confluence/api/url'
], function(
    $,
    AJS,
    Meta,
    window,
    document,
    url
) {
    "use strict";

    var Analytics = {};

    var hasAnalyticsHandler;

    function srcAppendedUrl(urlString, analyticsSource) {
        var parsedUrl = url.parse(urlString);

        if (!$.isEmptyObject(parsedUrl)) {
            parsedUrl.queryParams.src = [analyticsSource];
        }
        return url.format(parsedUrl);
    }

    function analyticsHandlerExists() {
        if (typeof hasAnalyticsHandler === "undefined") {
            var eventsData = $._data(window, 'events');
            hasAnalyticsHandler = eventsData && eventsData.analytics && eventsData.analytics.length > 0;
        }
        return hasAnalyticsHandler;
    }

    function replaceStateAfterCleaningUpAnalyticsParameters() {
        var cleanUrl = Analytics.srcRemovedUrl(document.URL);
        if (document.URL !== cleanUrl) {
            window.history.replaceState(null, '', cleanUrl);
        }
    }

    /**
     * Returns true if the provided name (components[0].components[1].components[2]) is a valid analytics attribute.
     *  This is true if the attribute name matches the pattern /src\.[^.]+\.[^.]+/
     * @param {Array.<String>} components
     */
    function isAnalyticsAttribute(components) {
        return components.length === 3 && components[0] === 'src';
    }

    /**
     * Updates the href of the array of links to include a src parameter. The value of the src parameter is specified in analyticsSource
     * @param {jQuery} links
     * @param {string} analyticsSource
     */
    Analytics.setAnalyticsSource = function(links, analyticsSource) {
        if (analyticsHandlerExists()) {
            links.attr('href', function(i, href) {
                return srcAppendedUrl(href, encodeURIComponent(analyticsSource));
            });
        }
    };

    Analytics.srcRemovedUrl = function(urlString) {
        var parsedUrl = url.parse(urlString);
        delete parsedUrl.queryParams.src;

        //Remove all analytics attributes (i.e. query params of the form src.*.*)
        for (var props = Object.keys(parsedUrl.queryParams), i = 0; i < props.length; i++) {
            var property = props[i];

            var components = property.split(".");
            if (isAnalyticsAttribute(components)) {
                delete parsedUrl.queryParams[property];
            }

            // CONFDEV-37685
            // We add a jwt token to email's links, after verifying it, the analytics params are removed,
            // lead to the URL change, lead to 401 error, the solution is removing the jwt token param too.
            // This code is for removing jwt token param
            var isJwtTokenParam = property === 'jwt';
            if (isJwtTokenParam) {
                delete parsedUrl.queryParams[property];
            }

        }

        return url.format(parsedUrl);
    };

    /**
     * Returns values of the src parameter from the specified URL as an array.
     * @param urlString String that represents a URL to parse.
     * @returns {src|*|string|Array} Array containing all 'src' parameter values.
     */
    Analytics.srcParamValues = function(urlString) {
        var params = url.parse(urlString).queryParams;
        return params && params.src ? params.src : [];
    };

    /**
     * Decodes the analytics attributes from the url
     * Analytics attributes should be of the form <code>src.SOURCE.ATTRIBUTE_NAME=ATTRIBUTE_VALUE</code>
     *
     * We only take the first occurrence of a particular <code>src.SOURCE.ATTRIBUTE_NAME=ATTRIBUTE_VALUE</code> query param.
     *
     * @param {String} urlString String that represents a URL to parse.
     * @returns {object} Map containing all 'src' attributes.
     */
    Analytics.srcAttrParamValues = function(urlString) {
        var params = url.parse(urlString).queryParams;

        var sourceAttributes = {};

        for (var props = Object.keys(params), i = 0; i < props.length; i++) {
            var property = props[i];

            var components = property.split(".");
            if (isAnalyticsAttribute(components)) {
                var source = components[1];
                var attributeName = components[2];

                //If this source object does not already exist we add it, and then put in the value
                sourceAttributes[source] = sourceAttributes[source] || {};
                sourceAttributes[source][attributeName] = decodeURIComponent(params[property][0]);
            }

        }

        return sourceAttributes;
    };

    /**
     * Extract analytics data from a url
     * @param urlString String that represents the url to parse
     * @returns {Array.<{src:String,attr:Object}>}
     */
    Analytics.extractAnalyticsData = function(urlString) {
        var analyticsData = [];

        var values = Analytics.srcParamValues(urlString);
        var srcAttributes = Analytics.srcAttrParamValues(urlString);

        for (var i = 0; i < values.length; i++) {
            var source = values[i];
            var attributes = srcAttributes[source] || {};
            analyticsData.push({src : source, attr : attributes });
        }

        return analyticsData;
    };

    /**
     * Publishes a client-side analytics event. The event being published must adhere to our privacy policy, and also
     * needs to be added to a plugin or product whitelist as per the instructions here:
     * https://extranet.atlassian.com/display/AA/The+Developer%27s+Guide+to+Atlassian+Analytics
     * @param name Name of the analytics event
     * @param data Additional attributes
     */
    Analytics.publish = function(name, data) {
        AJS.trigger('analytics', { name: name, data: data || {} });
    };

    Analytics.init = function() {
        var analyticsData = Analytics.extractAnalyticsData(document.URL);

        var defaultData = {
            userKey: Meta.get('remote-user-key'),
            pageID: Meta.get('page-id')
        };

        if (analyticsData.length > 0) {
            for (var i = 0; i < analyticsData.length; i++) {
                // Events are published with a set of attributes, however individual
                // attributes need to be added to the white list to be of any use
                var analyticsEvent = analyticsData[i];
                var data = $.extend({}, defaultData, analyticsEvent.attr);
                Analytics.publish('confluence.viewpage.src.' + analyticsEvent.src, data);
            }

            // Check if browser supports HTML5 replaceState()
            if (window.history && window.history.replaceState) {
                replaceStateAfterCleaningUpAnalyticsParameters();
            }
        } else {
            // CONFDEV-33536 - Confluence simplify journeys
            // Adding generic event when src isn't available
            Analytics.publish('confluence.viewpage.src.empty', defaultData);
        }
    };

    return Analytics;
});

/* istanbul ignore next */
require('confluence/module-exporter').exportModuleAsGlobal('confluence/analytics-support', 'AJS.Confluence.Analytics', function(AnalyticsSupport) {
    var AJS = require('ajs');

    AJS.toInit(AnalyticsSupport.init);
});
