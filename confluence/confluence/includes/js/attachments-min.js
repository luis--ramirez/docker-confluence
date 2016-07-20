define("confluence/attachments",["ajs","confluence/templates","confluence/api/ajax","confluence/api/constants"],function(d,a,m,j){function k(b){clearTimeout(l);c&&(d.log("Preventing submit due to recent form submission."),b.preventDefault());c=!0;l=setTimeout(function(){c=false},2E3)}var i={showOlderVersions:function(b){b(".attachment-history a").click(function(h){var e=b(this).parents("table.attachments"),a=b(this).parents("tr:first")[0].id.substr(11),e=b(".history-"+a,e);b(this).toggleClass("icon-section-opened");
b(this).toggleClass("icon-section-closed");e.toggleClass("hidden");return d.stopEvent(h)})}},c=!1,l;return{component:i,initialiser:function(b){function h(d,a){return b(d).parents("["+a+"]").attr(a)}function e(a,c,e){var f=d.ConfluenceDialog({width:600,height:200,id:"attachment-removal-confirm-dialog"});f.addHeader(c);f.addPanel("",e);f.addSubmit(d.I18n.getText("ok"),function(){var c;c={};m.ajax({type:"POST",url:a,data:c,success:function(){location.reload(!0)},error:function(a){var c=null;a.responseText&&
(a=b.parseJSON(a.responseText),a.actionErrors&&(c=a.actionErrors));a=d.ConfluenceDialog({width:600,height:200,id:"attachment-removal-error-dialog"});a.addHeader(g.removalErrorTitle());a.addPanel("",g.removalErrorBody({messages:c}));a.addButton(d.I18n.getText("close.name"),function(){location.reload(true)});a.show();f.remove()}})});f.addCancel(d.I18n.getText("cancel.name"),function(){f.remove()});f.show()}b("#upload-attachments").on("submit",k);var c=b("#more-attachments-link");c.click(function(a){b(".more-attachments").removeClass("hidden");
c.addClass("hidden");return d.stopEvent(a)});i.showOlderVersions(b);var g=a.Attachments;b(".removeAttachmentLink").click(function(){i.showRemoveAttachmentConfirmDialog(this);return!1});b(".removeAttachmentLinkVersion").click(function(){e(j.CONTEXT_PATH+"/json/removeattachmentversion.action"+this.search,g.versionRemovalConfirmationTitle(),g.versionRemovalConfirmationBody({filename:h(this,"data-attachment-filename"),version:h(this,"data-attachment-version")}));return!1});i.showRemoveAttachmentConfirmDialog=
function(a){var b=j.CONTEXT_PATH+"/json/removeattachment.action"+a.search,c=g.removalConfirmationTitle(),a=g.removalConfirmationBody({filename:h(a,"data-attachment-filename")});e(b,c,a)}},submitHandler:k}});require("confluence/module-exporter").safeRequire("confluence/attachments",function(d){var a=require("ajs");a.Attachments=d.component;a.toInit(d.initialiser)});