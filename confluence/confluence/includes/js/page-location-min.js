define("confluence/page-location",["ajs","confluence/meta"],function(c,a){var b=null;return{get:function(){return b?b:{spaceName:a.get("space-name"),spaceKey:a.get("space-key"),parentPageTitle:a.get("parent-page-title")}},set:function(a){b=a}}});require("confluence/module-exporter").exportModuleAsGlobal("confluence/page-location","Confluence.PageLocation");