define("confluence/page-history",["jquery","ajs"],function(e,b){return function(c){c("#page-history-container").click(function(b){if(!c(b.target).is("a")){var a=c(b.target).closest("tr"),d=a.find("input")[0];d&&(b.target!=d&&(d.checked=!d.checked),d.checked?2>=c("input:checked",this).length?a.addClass("page-history-item-selected"):d.checked=!1:a.removeClass("page-history-item-selected"))}});c(".remove-historical-version-trigger").click(function(){var e=c(this),a;a=new b.Dialog({width:400,height:210,
id:"remove-historical-version-dialog",closeOnOutsideClick:!1,keypressListener:function(b){a&&27===b.keyCode&&a.remove()}});a.addHeader(b.I18n.getText("remove.historical.version.confirm.remove.title"));a.addPanel("SinglePanel","<div>"+b.I18n.getText("remove.historical.version.confirm.remove.description",e.data("version"),b.Meta.get("page-title"))+"</div>");a.addButton(b.I18n.getText("remove.name"),function(){c("#remove-historical-version-pageid").val(e.data("pageid"));c("#remove-historical-version-form").submit()});
a.addCancel(b.I18n.getText("close.name"),function(){a.remove();return!1});a.gotoPanel(0);a.show();return!1})}});require("confluence/module-exporter").safeRequire("confluence/page-history",function(e){require("ajs").toInit(e)});