define('confluence/view-my-drafts', [
    'jquery',
    'ajs',
    'backbone',
    'confluence/templates'
], function(
    $,
    AJS,
    Backbone,
    Templates
){
    "use strict";

    return Backbone.View.extend({
        events : {
            "click .view-legacy-draft" : "open"
        },

        initialize: function(){
            this.$el.append(Templates.LegacyDrafts.render());

            var dialog = AJS.dialog2("#legacy-draft-dialog");

            this.model.set({dialog: dialog});

            var that = this;
            dialog.$el.find(".close").on("click", function() {
                dialog.hide();
            });

            dialog.on("hide", function() {
                that.close(that);
            });
        },

        render: function(){
            var dialog = this.model.get("dialog");
            dialog.$el.find(".aui-dialog2-header-main").html(this.model.get("title"));
            dialog.$el.find(".aui-dialog2-content").html(this.model.get("content"));
        },

        open: function(event){
            event.preventDefault();
            AJS.trigger("analytics", {name: "confluence.viewsource.resume.legacy.draft"});

            var that = this;
            var draftId = $(event.target).data("draftid");
            var draftTitle = $(event.target).data("drafttitle");

            var dfd = this.model.getPage(draftId);

            dfd.done(function(data) {
                that.model.get("dialog").show();
                that.model.set({title: draftTitle, content: data});
                that.render();
                $("body").addClass("no-select");
            });

            dfd.fail(function() {
                that.model.get("dialog").show();
                that.model.set({title: AJS.I18n.getText("view.draft.error"), content: ""});
            });
        },

        close: function(view){
            view.model.set({title: "", content: ""});
            $("body").removeClass("no-select");
        }

    });
});

require('confluence/module-exporter').safeRequire('confluence/view-my-drafts', function(ViewMyDrafts){
    var AJS = require('ajs');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var model = new Backbone.Model();
    model.getPage = function(draftId){
            return AJS.safe.ajax({
                type: "GET",
                url: AJS.contextPath() + "/plugins/viewsource/viewpagesrc.action",
                data: {pageId: draftId}
            });
    };

    AJS.toInit(function(){
        new ViewMyDrafts({el: $(".view-my-drafts"), model: model});
    });
});