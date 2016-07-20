/**
 * confluence/meta is used to access dynamic metadata passed from the
 * server to JavaScript via the page HTML.
 *
 * @since 3.6
 */
define('confluence/meta', [
    'jquery',
    'confluence/api/type-helpers'
], function(
    $,
    TypeHelpers
) {
    "use strict";

    // A backing map to use if the user sets data.
    var overrides = {};

    return {
        /**
         * Sets metadata with a key and value, for use when the state of the page changes after
         * loading from the server
         * @param key
         * @param value
         */
        set: function (key, value) {
            overrides[key] = value;
        },

        /**
         * Returns a value given a key. If no entry exists with the key, undefined is returned.
         * If the string value is "true" or "false" the respective boolean value is returned.
         * If the type is defined in an override, the return value will respect/have the overridden type.
         *
         * @method get
         * @param key
         * @return {String} or {boolean} or typeof overrides[key]
         */
        get: function (key) {
            if (typeof overrides[key] !== "undefined") { return overrides[key]; }

            var metaEl = $("meta[name='ajs-" + key + "']");
            if (!metaEl.length) {
                return undefined;
            }

            var value = metaEl.attr("content");
            return TypeHelpers.asBooleanOrString(value);
        },

        /**
         * Returns true if the value for the provided key is equal to "true", else returns false.
         *
         * @method getBoolean
         * @param key
         * @return {boolean}
         */
        getBoolean: function (key) {
            return this.get(key) === true;
        },

        /**
         * Returns a number if the value for the provided key can be converted to one.
         * Good for retrieving content ids to check truthiness (e.g. '0' is truthy but 0 is falsy).
         *
         * @method getNumber
         * @param key
         * @return {number}
         */
        getNumber: function (key) {
            return +this.get(key);
        },

        /**
         * Mainly for use when debugging, returns all Data pairs in a map for eyeballing.
         */
        getAllAsMap: function () {
            var map = {};
            $("meta[name^=ajs-]").each(function () {
                map[this.name.substring(4)] = this.content;
            });
            return $.extend(map, overrides);
        }
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/meta', 'AJS.Meta');