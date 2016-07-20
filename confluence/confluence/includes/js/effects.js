/**
 * @tainted Effect
 */
define('confluence/effects', [
    'document'
], function(
    document
) {
    "use strict";

    function setCookie(name, value, exp_y, exp_m, exp_d, path, domain, secure)
    {
        var cookie_string = name + "=" + escape(value);

        if (exp_y)
        {
            var expires = new Date(exp_y, exp_m, exp_d);
            cookie_string += "; expires=" + expires.toGMTString();
        }

        if (path) {
            cookie_string += "; path=" + escape(path);
        }
        else {
            cookie_string += "; path=/";
        }

        if (domain) {
            cookie_string += "; domain=" + escape(domain);
        }

        if (secure) {
            cookie_string += "; secure";
        }

        document.cookie = cookie_string;
    }

    function getCookie(cookie_name)
    {
        var results = document.cookie.match(cookie_name + '=(.*?)(;|$)');

        if (results) {
            return ( unescape(results[1]) );
        }
        else {
            return null;
        }
    }

    function highlight(element)
    {
        new Effect.Highlight(element,{endcolor:"#f0f0f0"});
    }

    return {
        setCookie: setCookie,
        getCookie: getCookie,
        highlight: highlight
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/effects', function(Effects) {
    window.setCookie = Effects.setCookie;
    window.getCookie = Effects.getCookie;
    window.highlight = Effects.highlight;
});
