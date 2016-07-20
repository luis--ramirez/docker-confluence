define("confluence/admin/audit-log","jquery ajs confluence/templates aui/templates moment confluence/api/querystring".split(" "),function(c,f,k,m,h,s){return function(q){function z(a){var b=c("#settings-dialog");b.find(".time-unit-value").on("change",{submitButton:a.data.submitButton},A);b.find("select.time-unit").on("change",{submitButton:a.data.submitButton},B);c("#auditing-settings-form").on("submit",{settingsDialog:a.data.settingsDialog,spinner:a.data.spinner,submitButton:a.data.submitButton},
t)}function C(a){a.data.settingsDialog.show()}function D(a){u(c(a.target).find(".aui-dialog2-content"))}function A(a){n.number=a.currentTarget.value;c("#settings-dialog").find(".aui-message-error").remove();a.data.submitButton.enable()}function B(a){n.units=a.currentTarget.value;c("#settings-dialog").find(".aui-message-error").remove();a.data.submitButton.enable()}function E(a){a.preventDefault();a.data.settingsDialog.hide()}function t(a){a.preventDefault();a.data.spinner.removeClass("hidden");a.data.submitButton.disable();
c.ajax({type:"PUT",url:v,contentType:"application/json",data:JSON.stringify(n)}).done(function(){a.data.settingsDialog.hide()}).fail(function(a){f.messages.error("#settings-dialog .aui-dialog2-content",{title:f.I18n.getText("logged.event.setting.error.title"),body:JSON.parse(a.responseText).message,closeable:false})}).always(function(){a.data.spinner.addClass("hidden")})}function u(a){c.get(v,function(b){n=b;b=c(k.Auditing.settingsDialogContent({currentRetention:b}));a.html(b);a.trigger("render")})}
function F(){var a=c("#export-form");a.find('input:not([type="submit"])').remove();var b=history.state;b.searchString&&a.append(c(m.form.input({name:"searchString",type:"text",extraClasses:"hidden",value:b.searchString})));b.fromDate&&a.append(c(m.form.input({name:"startDate",type:"number",extraClasses:"hidden",value:h(b.fromDate).utc().valueOf()})));b.toDate&&a.append(c(m.form.input({name:"endDate",type:"number",extraClasses:"hidden",value:h(b.toDate).add(1,"days").subtract(1,"milliseconds").utc().valueOf()})));
if(b.number&&b.units){b=h().subtract(b.number,b.units).valueOf();a.append(c(m.form.input({name:"startDate",type:"number",extraClasses:"hidden",value:b})))}a.submit()}function G(a){a.preventDefault();o({start:0,searchString:a.data.val()})}function w(){c("#bet_radio_opt").prop("checked",true)}function H(){c("#wtl_radio_opt").prop("checked",true)}function I(){c(this).find(".value-error").html("");var a,b=history.state;a=b.units?"within":b.fromDate||b.toDate?"between":"all";var e=c("#time-filter-dialog");
e.find("input[value="+a+"]").attr("checked",true);e.find(".time-unit").val(b.units);e.find(".time-unit-value").val(b.number);e.find("#from-date-picker").val(b.fromDate);e.find("#to-date-picker").val(b.toDate)}function J(a){a.preventDefault();a=c("#time-filter-dialog");K(a)&&document.querySelector("#time-filter-dialog").hide()}function L(){document.querySelector("#time-filter-dialog").hide()}function K(a){var b=a.find("input[name=auditDateFilter]:checked"),c=a.find(".value-error"),d,j;if(b.val()===
"within"){b=parseInt(a.find(".time-unit-value").val(),10);a=a.find("select.time-unit").val();if(isNaN(b)||b<1){c.html(f.I18n.getText("logged.event.filter.invalid.number.error"));return false}p({start:0,number:b,units:a,searchString:history.state.searchString})}else if(b.val()==="between"){b=a.find("#from-date-picker").val();a=a.find("#to-date-picker").val();if(!b||!a){c.html(f.I18n.getText("logged.event.filter.no.date.error"));return false}d=b.split("-");d=new Date(d[0],d[1]-1,d[2],0,0,0,0);j=a.split("-");
j=new Date(j[0],j[1]-1,j[2],23,59,59,999);if(isNaN(d.getTime())||isNaN(j.getTime())){c.html(f.I18n.getText("logged.event.filter.invalid.date.error"));return false}if(d.getTime()>j.getTime()){c.html(f.I18n.getText("logged.event.filter.date.range.error"));return false}p({start:0,fromDate:b,toDate:a,searchString:history.state.searchString})}else p({start:0,searchString:history.state.searchString});return true}function o(a){p(c.extend({},history.state,a))}function p(a){var b={};Object.keys(a).forEach(function(c){a[c]&&
(b[c]=[encodeURIComponent(a[c])])});var c="?"+s.stringify(b);history.pushState(a,"",window.location.pathname+c);r()}function r(){var a=history.state,b,e,d;if(a.units){e=h().utc().valueOf();b=e-h.duration(a.number,a.units).asMilliseconds();d=[f.I18n.getText("logged.event.filter.within"),a.number,a.units].join(" ")}else if(a.fromDate||a.toDate){a.fromDate&&(b=h(a.fromDate).valueOf());a.toDate&&(e=h(a.toDate).add(1,"days").subtract(1,"milliseconds").valueOf());d=[f.I18n.getText("logged.event.filter.between"),
a.fromDate,f.I18n.getText("and.word"),a.toDate].join(" ")}else d=f.I18n.getText("logged.event.filter.all");c("#time-filter").html(f.I18n.getText("logged.event.filter.button.text",d));c.get(M,{startDate:b,endDate:e,start:a.start,limit:i*5,searchString:a.searchString}).done(function(a){var b=c(k.Auditing.auditLogTable()),d=b.find("tbody"),e=history.state.start,g=a.results.length,l=c(".audit-table-pagination");if(g===0||e+g<i)l.empty();else{e=x(e,g);g=c(k.Auditing.paginationFooter({currentPage:e.currentPage,
startPage:e.startPage,endPage:e.endPage}));l.html(g);l.find(".auditing-page-prev").on("click",N);l.find(".auditing-page-next").on("click",O);l.find(".auditing-page-link").on("click",{currentPage:e.currentPage},P)}a.results.slice(0,i).forEach(function(a){var b=parseInt(a.creationDate,10);a.creationDate=h(b).format("D MMM, YYYY HH:mm:ss");b=c(k.Auditing.auditLogTableRow({record:a}));b.on("click",function(a){if(a.target.tagName!=="A"){var a=c(this).find(".show-details"),b=f.I18n.getText("logged.event.see.more"),
e=f.I18n.getText("logged.event.see.less"),b=a.text()===e?b:e;a.text(b);c(this).next().toggle()}});a=c(k.Auditing.recordDetails({record:a}));d.append(b);d.append(a)});c("#audit-log-container").html(b);c("#aui-message-bar").empty()}).fail(function(){f.messages.error({body:f.I18n.getText("logged.event.fetchError")})})}function x(a,b){var c=Math.ceil((a+1)/i),d=Math.ceil(b/i),f=Math.min(Math.max(1,c-y),Math.max(1,c+d-g)),d=Math.max(c+Math.min(y,d-1),Math.min(d+c-1,g));return{currentPage:c,startPage:f,
endPage:d}}function N(a){a.preventDefault();if(!a.target.getAttribute("aria-disabled")){a=Math.max(0,history.state.start-i);o({start:a})}}function O(a){a.preventDefault();a.target.getAttribute("aria-disabled")||o({start:history.state.start+i})}function P(a){a.preventDefault();o({start:history.state.start+(this.text-a.data.currentPage)*i})}var M=f.contextPath()+"/rest/api/audit",v=f.contextPath()+"/rest/api/audit/retention",i=q.pageSize,g=q.pageLimit;if(g<1||g%2!==1)throw"pageLimit should be odd positive number. Got '"+
q.pageLimit+"'";var y=Math.floor(g/2),n={};return{init:function(){var a=s.parse(window.location.search);history.replaceState({start:a.start&&a.start[0]?parseInt(a.start[0],10):0,searchString:a.searchString&&a.searchString[0]?decodeURIComponent(a.searchString[0]):void 0,number:a.number&&a.number[0]?parseInt(a.number[0],10):void 0,units:a.units?a.units[0]:void 0,fromDate:a.fromDate?a.fromDate[0]:void 0,toDate:a.toDate?a.toDate[0]:void 0},"");var a=c(".search-container form"),b=a.find(".search-entry");
b.val(history.state.searchString);a.on("submit",b,G);require(["aui/inline-dialog2"]);var a=c("#time-filter-dialog"),b=c("#from-date-picker"),e=c("#to-date-picker"),d=c("#wtl_input");a.find(".buttons input").on("click",J);a.find(".cancel").on("click",L);document.querySelector("#time-filter-dialog").addEventListener("aui-layer-show",I);b.datePicker({overrideBrowserDefault:true});e.datePicker({overrideBrowserDefault:true});b.on("click",w);e.on("click",w);d.on("click",H);a=f.dialog2("#settings-dialog");
d=c("#settings-dialog");b=c("#auditing-retention-submit");e=d.find(".aui-icon-wait");d=d.find(".aui-dialog2-content");c("#auditing-retention-setting").on("click",{settingsDialog:a},C);a.on("hide",D);b.on("click",{settingsDialog:a,spinner:e,submitButton:b},t);c("#auditing-retention-cancel").on("click",{settingsDialog:a},E);d.on("render",{settingsDialog:a,spinner:e,submitButton:b},z);u(d);c("#auditing-export-data").on("click",F);r();c(window).on("popstate",function(){r()})},getPaginationConfig:x}}});
require("confluence/module-exporter").safeRequire("confluence/admin/audit-log",function(c){c=new c({pageSize:50,pageLimit:5});require("ajs").toInit(c.init)});