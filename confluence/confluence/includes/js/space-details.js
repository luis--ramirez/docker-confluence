define('confluence/space-details', [
    'document',
    'ajs',
    'jquery',
    'confluence/templates'
], function(
    document,
    AJS,
    $,
    Templates
) {
    "use strict";

    return {
        interface: {
            setUsersToAddTextField: function(entityNames) {
                var element = document.forms.convertspace.usersToAdd;
                if (entityNames != "") {
                    if (element.value == "") {
                        element.value = entityNames;
                    }
                    else {
                        element.value = element.value + ", " + entityNames;
                    }
                }
            }
        },
        initialiser: function ($) {
            $('.spacetools-nav-secondary').on('click', '.menu-item a', function(){
                var $menuItem = $(this).parent();
                var webItemKey = $menuItem.attr('data-web-item-key');
                var webSectionKey = $menuItem.attr('data-web-section-key');
                var cookiePath = AJS.contextPath() || '/';
                $.cookie('confluence.last-web-item-clicked', webSectionKey + '/' + webItemKey, {path: cookiePath});
            });

            $('.spacetools-nav').on('click', 'li a', function(){
                var $menuItem = $(this).parent();
                var webSectionKey = $menuItem.attr('data-web-section-key');
                var webItemKey = $menuItem.attr('data-first-web-item-key');
                var cookiePath = AJS.contextPath() || '/';
                $.cookie('confluence.last-web-item-clicked', webSectionKey + '/' + webItemKey, {path: cookiePath});
            });

            function updateWatch($button, type, action, value, newText) {
                $.ajax({
                    url: AJS.contextPath() + "/spaces/" + action + "?" + $.param({
                        contentType:type,
                        key:AJS.Meta.get('space-key'),
                        atl_token: AJS.Meta.get('atl-token')
                    }),
                    success: function (xhr) {
                        if (value === true) {
                            $button.removeClass('stop-watching').addClass('watch');
                        } else {
                            $button.removeClass('watch').addClass('stop-watching');
                        }
                        $button.html(Templates.SpaceDetails.watchButton({ watch: value, text: newText }));
                    }
                });
            }
            $('.content-navigation.pages-collector').on('click', 'a.watch', function(e){
                e.preventDefault();
                updateWatch($(this), '', 'addspacenotification.action', false, AJS.I18n.getText('remove.space.notification'));
                AJS.trigger("analytics", {name: "watch-space"});
            });
            $('.content-navigation.pages-collector').on('click', 'a.stop-watching', function(e){
                e.preventDefault();
                updateWatch($(this), '', 'removespacenotification.action', true, AJS.I18n.getText('add.space.notification'));
                AJS.trigger("analytics", {name: "unwatch-space"});
            });
            $('.content-navigation.view-blogposts').on('click', 'a.watch', function(e){
                e.preventDefault();
                updateWatch($(this), 'blogpost', 'addspacenotification.action', false, AJS.I18n.getText('space.watches.blogs.stop'));
                AJS.trigger("analytics", {name: "watch-blogs"});
            });
            $('.content-navigation.view-blogposts').on('click', 'a.stop-watching', function(e){
                e.preventDefault();
                updateWatch($(this), 'blogpost', 'removespacenotification.action', true, AJS.I18n.getText('space.watches.blogs.start'));
                AJS.trigger("analytics", {name: "unwatch-blogs"});
            });
        }
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/space-details', function(SpaceDetails) {
    var AJS = require('ajs');
    AJS.Confluence.SpaceDetails = SpaceDetails.interface;
    AJS.toInit(SpaceDetails.initialiser);
});
