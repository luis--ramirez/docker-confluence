define("confluence/api/navigator-context",["confluence/meta","document"],function(g,b){var h=function(a){a=d(a);return"undefined"!==typeof a&&0!==a},d=function(a){a=g.get(a);return isNaN(a)?void 0:Number(a)},i=function(){return!!b.querySelector(".page.view")||!!b.querySelector(".blogpost.view")},e=function(){return!!b.querySelector(".page.edit")||!!b.querySelector(".blogpost.edit")},f=function(){return g.get("content-type")},c=function(){return d("page-id")};return{getCurrent:function(){return e()&&
0===c()&&h("draft-id")?{target:"contentcreate",context:{contentId:d("draft-id"),contentType:f()}}:e()&&!i()&&0!==c()?{target:"contentedit",context:{contentId:c(),contentType:f()}}:!e()&&i()&&h("page-id")?{target:"contentview",context:{contentId:c(),contentType:f()}}:{target:"unknown",context:{}}}}});