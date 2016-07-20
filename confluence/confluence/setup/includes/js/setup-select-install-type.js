require([
    'jquery'
],
function(
    $
) {
    "use strict";

    $(function () {
        $("#setup-next-button").attr("disabled", "disabled");
        $(".confluence-setup-choice-box").click(function (e) {
            // deselect current selected option
            $(".confluence-setup-choice-box-active").removeClass("confluence-setup-choice-box-active");

            var $target = $(e.target).closest(".confluence-setup-choice-box");
            $target.addClass("confluence-setup-choice-box-active");

            $("#setupType").val($target.attr("setup-type"));

            if ($(".confluence-setup-choice-box-active").length > 0) {
                $("#setup-next-button").removeAttr("disabled");
            } else {
                $("#setup-next-button").attr("disabled", "disabled");
            }
        });
    });
});
