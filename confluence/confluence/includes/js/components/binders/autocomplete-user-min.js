define("confluence/autocomplete-user",["jquery","ajs","document"],function(b,e,i){return function(h){var h=h||i.body,m=function(f){if(!f||!f.result)throw Error("Invalid JSON format");b.each(f.result,function(a,b){b.key=b.username||b.name;"group"===b.type&&(b.title=b.name,b.link=[],b.thumbnailLink={href:e.contextPath()+"/images/icons/avatar_group_48.png"})});var c=[];c.push(f.result);return c};b.each(["user","group","user-or-group"],function(f,c){b("input.autocomplete-"+c+'[data-autocomplete-user-or-group-bound!="true"]',
h).each(function(){var a=b(this).attr("data-autocomplete-user-or-group-bound","true").attr("autocomplete","off"),f=a.attr("data-max")||10,h=a.attr("data-alignment")||"left",j=a.attr("data-dropdown-target"),d=null,k=a.attr("data-target"),i=a.attr("data-show-unlicensed"),l=k&&b(k);j?d=b(j):(d=b("<div></div>"),a.after(d));a.attr("data-resize-to-input")&&(d.width(a.outerWidth()),d.addClass("resize-to-input"));d.addClass("aui-dd-parent autocomplete");a.quicksearch(e.REST.getBaseUrl()+"search/"+c+".json",
function(){a.trigger("open.autocomplete-user-or-group");c==="user"&&a.trigger("open.autocomplete-user")},{makeParams:function(a){return{"max-results":f,query:a,"show-unlicensed":i}},dropdownPlacement:function(a){d.append(a)},makeRestMatrixFromData:m,addDropdownData:function(b){if(!b.length){var c=a.attr("data-none-message");c&&b.push([{name:c,className:"no-results",href:"#"}])}return b},ajsDropDownOptions:{alignment:h,displayHandler:function(a){return a.restObj&&a.restObj.username?a.name+" ("+e.escapeHtml(a.restObj.username)+
")":a.name},selectionHandler:function(f,d){if(d.find(".search-for").length){a.trigger("selected.autocomplete-user-or-group",{searchFor:a.val()});c==="user"&&a.trigger("selected.autocomplete-user",{searchFor:a.val()})}else{if(!d.find(".no-results").length){var g=b("span:eq(0)",d).data("properties");if(l){var e=g.restObj.title;g.restObj.username&&(e=e+(" ("+g.restObj.username+")"));a.val(e);l.val(g.restObj.key)}else a.val(g.restObj.key);a.trigger("selected.autocomplete-user-or-group",{content:g.restObj});
c==="user"&&a.trigger("selected.autocomplete-user",{content:g.restObj})}this.hide();f.preventDefault()}}}})})})}});require("confluence/module-exporter").safeRequire("confluence/autocomplete-user",function(b){var e=require("confluence/legacy");e.Binder.autocompleteUserOrGroup=b;e.Binder.autocompleteUser=function(){}});