define('confluence/api/browser', [
], function(
) {
    "use strict";

    return function(userAgent) {
        function isFirefox() {
            return userAgent.indexOf('Firefox/') !== -1;
        }

        function notFirefox() {
            return !isFirefox();
        }

        function isMSEdge() {
            return userAgent.indexOf('Edge/') !== -1;
        }

        function notMSEdge() {
            return !isMSEdge();
        }

        function isIE() {
            return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1 || isMSEdge();
        }

        function notIE() {
            return !isIE();
        }

        function isChrome() {
            return userAgent.indexOf('Chrome/') !== -1;
        }

        function notChrome() {
            return !isChrome();
        }

        function isSafari() {
            return userAgent.indexOf('Safari/') !== -1 && userAgent.indexOf('Chrome/') === -1;
        }

        function notSafari() {
            return !isSafari();
        }

        function isPhantom() {
            return userAgent.indexOf('PhantomJS') !== -1;
        }

        function notPhantom() {
            return !isPhantom();
        }

        function version() {
            if (isIE()) {
                var versionMatch = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/rv:([\d.]+)/) || userAgent.match(/Edge\/([\d.]+)/);
                return parseInt(versionMatch[1]);
            }
            if (isChrome()) {
                return parseInt(userAgent.match(/Chrome\/([\d.]+)/)[1]);
            }
            if (isSafari()) {
                return parseInt(userAgent.match(/Version\/([\d.]+)/)[1]);
            }
            if (isFirefox()) {
                return parseInt(userAgent.match(/Firefox\/([\d.]+)/)[1]);
            }
        }

        return {
            isFirefox: isFirefox,
            notFirefox: notFirefox,
            isMSEdge: isMSEdge,
            notMSEdge: notMSEdge,
            isIE: isIE,
            notIE: notIE,
            isChrome: isChrome,
            notChrome: notChrome,
            isSafari: isSafari,
            notSafari: notSafari,
            isPhantom: isPhantom,
            notPhantom: notPhantom,
            version: version
        };
    };
});
