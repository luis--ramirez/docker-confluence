define("confluence/help-panel",["jquery","window"],function(a,c){return{initialize:function(){a(".help-panel-content a").click(function(){var b=a(this).attr("href");if(!a(this).attr("onClick")&&b&&0!==b.indexOf("#")&&-1===b.indexOf(c.location))return c.open(b,"_blank").focus(),!1})}}});require("confluence/module-exporter").safeRequire("confluence/help-panel",function(a){require("ajs").toInit(a.initialize)});