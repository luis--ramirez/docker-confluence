define("confluence/object-cache",[],function(){var a=function(d){if(!(this instanceof a))return new a(d);this.cache={};this.cacheStack=[];this.cacheSize=d||30};a.prototype.get=function(d){var a=this.cache[d];if(a){var b=this.cacheStack[this.cacheStack.length-1][0]+1;a.weight=b;this.cacheStack.push([b,d]);return a.value}};a.prototype.put=function(a,e){var b=this.cacheStack.length?this.cacheStack[this.cacheStack.length-1][0]+1:0;this.cache[a]={weight:b,value:e};this.cacheStack.push([b,a]);for(var c;this.cacheStack.length>
this.cacheSize;)c=this.cacheStack.shift(),b=c[0],c=c[1],b===this.cache[c].weight&&delete this.cache[c]};a.prototype.clear=function(){this.cache={};this.cacheStack=[]};return a});require("confluence/module-exporter").exportModuleAsGlobal("confluence/object-cache","AJS.Confluence.cacheManager");