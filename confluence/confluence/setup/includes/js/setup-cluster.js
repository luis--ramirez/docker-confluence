define('confluence/setup/setup-cluster', [
    'jquery'
], function(
    $
) {
    "use strict";

    return function($){
        //Hides or reveals the multicast address field when the user toggles
        //the 'generate automatically' checkbox
        $("#cluster-auto-address").change(function() {
            if($(this).is(":checked")) {
                $("#cluster-address-field").slideUp();
            }else {
                $("#cluster-address-field").slideDown();
            }
        });

        $("#useMulticast").change(function() {
            if($(this).is(":checked")) {
                $("#cluster-peers-group").slideUp(function (){
                    $("#cluster-address-group").slideDown();
                });
            }
        });

        $("#useTcpIp").change(function() {
            if($(this).is(":checked")) {
                $("#cluster-address-group").slideUp(function (){
                    $("#cluster-peers-group").slideDown();
                });
            }
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/setup/setup-cluster', function(Cluster) {
    require('ajs').toInit(Cluster);
});
