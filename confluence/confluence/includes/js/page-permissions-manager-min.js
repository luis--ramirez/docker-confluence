define("confluence/page-permissions-manager",["ajs","confluence/meta","confluence/api/event","confluence/legacy"],function(a,h,w,m){return function(c){function o(){return"0"===h.get("page-id")&&0<h.get("draft-id")?h.get("draft-id"):h.get("page-id")}function q(i){var b=d.makePermissionMap(!1),b=[].concat(b.group.view).concat(b.user.view).concat(b.group.edit).concat(b.user.edit),n=c("#page-inherited-permissions-table-desc:visible");a.trigger("edit-page-restrictions-updated",{hasExplicitRestrictions:0<
b.length,hasInheritedRestrictions:0<n.length,restrictionsHash:i})}function r(){g.validator.resetValidationErrors();d.clearHighlight();c(".button-spinner").spinStop();e.hide();window.scrollTo(f.bookmark.scrollX,f.bookmark.scrollY)}function x(){g.validator.resetValidationErrors();var i=c(".permissions-update-button").disable();c(".button-spinner").spin();var b=f.makePermissionStrings();b.pageId=a.params.pageId;b.contentId=o();c("#waitImage").show();a.safe.ajax({url:l+"/pages/setcontentpermissions.action",
data:b,dataType:"json",success:function(a){c("#waitImage").hide();a.errorMessage?(g.validator.showErrorMessage(a.errorMessage),c(".button-spinner").spinStop(),i.enable()):(k()?q(a.restrictionsHash):w.trigger("system-content-metadata.toggled-restrictions",{hasExplicitRestrictions:a.hasPermissions,hasInheritedRestrictions:a.hasPermissions}),i.enable(),r())},error:function(){g.validator.showErrorMessage(a.I18n.getText("page.restrictions.loading.error"));c(".button-spinner").spinStop();i.enable()}})}
function s(){r();k()&&d.restoreBackup();return!1}function t(i){f.bookmark={scrollX:document.documentElement.scrollLeft,scrollY:document.documentElement.scrollTop};c(".permissions-update-button").disable();c(".button-panel-cancel-link").text(a.I18n.getText("close.name"));g.setVisible(i.userCanEditRestrictions);a.setVisible(".permissions-update-button",i.userCanEditRestrictions);e.show()}function u(a,b){var e=b&&c("#newSpaceKey").val()||h.get("space-key"),g=b&&c("#parentPageString").val()||"",e={contentId:o(),
parentPageId:h.get("parent-page-id"),parentPageTitle:g,spaceKey:e},g=l+"/pages/getcontentpermissions.action";c("#waitImage").show();c.getJSON(g,e,function(b){c("#waitImage").hide();if(b.error)d.showErrorMessage(b.error);else{var e=o();d.allowEditing(b.userCanEditRestrictions);d.resetInherited();d.resetDirect();if(b){for(var g=0,h=b.permissions.length;g<h;g++){var f=b.permissions[g],n=f[0].toLowerCase(),j=f[2],j=f[1]==v?b.users[j]:b.groups[j],p=f[3],f=f[4],l=+p&&p!=e,j={owningId:p,entity:j.entity,
report:j.report};j[n]=!0;j.owningTitle=f;j.inherited=l;d.addRow(j,n)}0<b.permissions.length&&m.Binder.userHover();d.saveBackup();d.refresh()}}a(b);!b.error&&k()&&q(b.restrictionsHash)})}function y(){c(".permissions-update-button").enable();c(".button-panel-cancel-link").text(a.I18n.getText("cancel.name"))}var v="user",l=a.contextPath(),k=function(){return c("#rte-button-restrictions").parent().is(":visible")},e=null,g=null,d=null,f={addNames:function(a,b){var e=this,d=a.replace(/\s*,\s*/g,",").split(","),
f=c("#waitImage");f.show();var k={name:d,type:b||"",pageId:h.get("parent-page-id"),spaceKey:h.get("space-key")};c.getJSON(l+"/pages/getentities.action",k,function(b){f.hide();for(var a=0,i=b.length;a<i;a++){var h=b[a].entity;e.addEntity(b[a]);h=c.inArray(h.name,d);d.splice(h,1)}g.validator.handleNonExistentEntityNames(d)})},addEntity:function(a){if(a){var b=a.entity,a=a.report,c=g.getPermissionType();g.validator.isDuplicateEntityForType(b,c)?d.highlightEntityRow(b,c):(d.addRow({entity:b,view:!0,edit:!0,
report:a},c),m.Binder.userHover(),d.changedByUser(),d.highlightEntityRow(b,c),g.nameField.removeFromNameInput(b.name))}},makePermissionStrings:function(){var a=d.makePermissionMap(!1);return{viewPermissionsUsers:a.user.view.join(","),editPermissionsUsers:a.user.edit.join(","),viewPermissionsGroups:a.group.view.join(","),editPermissionsGroups:a.group.edit.join(",")}}};c.extend(a.PagePermissions,{addUserPermissions:function(a){f.addNames(a,v)},addGroupPermissions:function(a){f.addNames(a,"group")},
makePermissionStrings:f.makePermissionStrings,updateRestrictionsDialog:function(){e&&u(t,k())}});a.bind("deferred.page.permissions",function(){var i=k();if(!e){e=a.ConfluenceDialog({width:840,height:530,id:"update-page-restrictions-dialog",onCancel:s});"blogpost"==h.get("content-type")?e.addHeader(a.I18n.getText("page.perms.dialog.heading.blog")):e.addHeader(a.I18n.getText("page.perms.dialog.heading"));e.addPanel("Page Permissions Editor",m.Templates.PagePermissions.dialogPanel({currentUser:a.params.remoteUser,
currentUserAvatar:a.params.currentUserAvatarUrl}));e.addButton(a.I18n.getText("update.name"),x,"permissions-update-button");e.addCancel(a.I18n.getText("close.name"),s);e.popup.element.find(".dialog-title").prepend(m.Templates.PagePermissions.helpLink());e.popup.element.find(".dialog-button-panel").prepend("<div class='button-spinner'>&nbsp;</div>");e.popup.element.find("#userpicker-popup-link").click(function(){window.open(a.contextPath()+"/spaces/openuserpicker.action?key="+a.params.spaceKey+"&startIndex=0&onPopupSubmit=AJS.PagePermissions.addUserPermissions",
"EntitiesPicker","status=yes,resizable=yes,top=100,left=200,width=700,height=680,scrollbars=yes").focus();return!1});e.popup.element.find("#grouppicker-popup-link").click(function(){window.open(a.contextPath()+"/spaces/opengrouppicker.action?key="+a.params.spaceKey+"&startIndex=0&actionName=dosearchgroups.action&onPopupSubmit=AJS.PagePermissions.addGroupPermissions","EntitiesPicker","status=yes,resizable=yes,top=100,left=200,width=580,height=550,scrollbars=yes").focus();return!1});g=a.PagePermissions.Controls(f);
var b=c("#page-permissions-table").bind("changed",y);d=a.PagePermissions.Table(b);f.table=d}u(t,i);return!1})}});require("confluence/module-exporter").safeRequire("confluence/page-permissions-manager",function(a){require("ajs").toInit(a)});