define("confluence/aui-draft","jquery ajs confluence/meta window document confluence/api/regexes".split(" "),function(c,b,g,i,l,j){var d={};c.ajaxSetup({traditional:true});d.defaultIfUndefined=function(a,b){var e=null,c=i;if(typeof b!=="undefined"){if(typeof b.defaultValue==="object")e=b.defaultValue;if(typeof b.rootObject!=="undefined")if(typeof b.rootObject==="object"&&b.rootObject)c=b.rootObject;else return e}if(typeof a!=="string")return e;for(var d=a.split("."),f=0;f<d.length;f++){if(!Object.prototype.hasOwnProperty.call(c,
d[f]))return e;c=c[d[f]]}return c};var f,k=false;f=function(a){var b=!!i.localStorage;if(typeof a!=="boolean")return b?localStorage["debug-switch-enabled"]=="true":k;b?localStorage.setItem("debug-switch-enabled",a):k=a};d.debug=function(){if(f()){var a=Array.prototype.slice.call(arguments);a.splice(0,0,"DEBUG: "+(new Date).toLocaleTimeString());b.log.apply(b,a)}};d.debugEnabled=function(a){if(typeof a!=="boolean")return f();f(a);b.log("STICKY FLAG DEBUG ENABLED: "+a)};d.logError=function(a,d){var e=
[];if(c.browser.webkit)e.push(d);else for(var f in d)e.push(f+": "+d[f]);b.log(a+e.join(", "))};if(g.getBoolean("log-rendered")){var m=b.log,h=c('<div id="ajs-log" class="log"><h3>AJS Log</h3>\n</div>'),n=c("head");h.toggleClass("hidden",!g.getBoolean("log-visible"));b.log=function(a){var d=typeof a==="undefined"?"undefined":a,e=l.createElement("script");e.type="text/x-log";e.text=d;n.append(e);h.append(c("<p></p>").text("\n"+d));m.apply(b,arguments)};b.toInit(function(){c("body").append(h)})}d.getJSONWrap=
function(a){var d=b.contextPath(),e=a.url;e.indexOf(d)!==0&&e.indexOf("http")!==0&&(e=d+e);a.loadingElement&&b.setVisible(a.loadingElement,true);var f=a.messageHandler;f.clearMessages();c.ajax({type:"GET",url:e,dataType:"json",data:a.data,error:function(){a.loadingElement&&b.setVisible(a.loadingElement,false);f.displayMessages(a.errorMessage||b.I18n.getText("unknown.server.error"));a.errorCallback&&a.errorCallback()},success:function(c){a.loadingElement&&b.setVisible(a.loadingElement,false);f.handleResponseErrors(c)?
a.errorCallback&&a.errorCallback():a.successCallback&&a.successCallback(c)}})};d.Validate=c.extend({email:function(a){return j.EMAIL.test(a)},url:function(a){return j.URL.test(a)}},b.Validate);d.Meta=b.Data||g;return d});
require("confluence/module-exporter").safeRequire("confluence/aui-draft",function(c){var b=require("ajs");"function"!==typeof b.defaultIfUndefined&&(b.defaultIfUndefined=c.defaultIfUndefined);b.debug=c.debug;b.debugEnabled=c.debugEnabled;b.logError=c.logError;b.getJSONWrap=c.getJSONWrap;b.Validate=c.Validate;b.Data=c.Meta});