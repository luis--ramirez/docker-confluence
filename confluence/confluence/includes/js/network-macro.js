define('confluence/network-macro', [
    'ajs',
    'jquery'
], function(
    AJS,
    $
) {
    if (typeof AJS.followCallbacks === "undefined") { AJS.followCallbacks = []; }

    function BindFollowUser(container) {
        if (container.attr("data-followuser-bound")) {
            return;
        }

        var $followUserBox = container.find(".follow-user-box");

        $followUserBox.length && $followUserBox.autocomplete(AJS.contextPath() + "/json/usersearch.action?filterDisabledUsers=true&query=", 2, function (data) {
            $("input[name=username]", $(data.input).parent()).val(data.username);
        });

        container.submit(function(e) {
            var hiddenInput = $("input[name=username]", $(this).parent());
            var user = hiddenInput.val();
            if (!user) {
                user = $followUserBox.val();
            }
            AJS.safe.post(AJS.contextPath() + "/ajax/followuser.action", { username : user },
                    function(data) {
                        var $followUserResult = container.find(".follow-user-result");
                        $followUserResult.html(data);
                        $followUserResult.show();
                        $followUserBox.val("");
                        $followUserBox.focus();
                        hiddenInput.val("");

                        AJS.trigger("analytics", { name: "confluence.user-profile.my.network.add"});
                    }
            );
            return AJS.stopEvent(e);
        });

        /**
         * follow text field place holder
         */
        if (!$followUserBox.length) {
            return;
        }

        var followUserDataKey = "followUserDataKey";
        var followUserBoxPlaceholder = AJS.params.followUserBoxPlaceholder;

        $followUserBox.each(function() {
            $followUserBox = $(this);
            $followUserBox.data(followUserDataKey, {
                placeholder: followUserBoxPlaceholder,
                placeholded: true
            });
        });

        if (!$.browser.safari) {
            $followUserBox.val($followUserBox.data(followUserDataKey).placeholder);

            $followUserBox.addClass("placeholded");

            $followUserBox.focus(function () {
                var $this = $(this);
                if ($this.data(followUserDataKey).placeholded) {
                    $this.data(followUserDataKey).placeholded = false;
                    $this.val("");
                    $this.removeClass("placeholded");
                }
            });

            $followUserBox.blur(function () {
                var $this = $(this);
                if ($this.data(followUserDataKey).placeholder && (/^\s*$/).test($this.val())) {
                    $this.val($this.data(followUserDataKey).placeholder);
                    $this.data(followUserDataKey).placeholded = true;
                    $this.addClass("placeholded");
                }
            });

        }
        else {
            $followUserBox.each(function() {
                $followUserBox = $(this);
                $followUserBox.attr("placeholder", followUserBoxPlaceholder);
            });
            $followUserBox.val("");
        }
    }

    return BindFollowUser;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/network-macro', function(BindFollowUser) {
    var $ = require('jquery');
    var Confluence = require('confluence/legacy');

    Confluence.Binder.followUser = function() {
        $(".follow-user").each(function () {
            BindFollowUser($(this), {});
        });
    };

    $.fn.followUser = function () {
        $(this).each(function () {
            BindFollowUser($(this));
        });
        return this;
    };
});
