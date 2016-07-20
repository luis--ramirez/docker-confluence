function JsReporting(a,b){this.window=a;this.instrumenters={};this.url=b;this.originalConsoleError=a.console.error;this._bindFlushEvents()}JsReporting.prototype.DEFAULT_FLUSH_COUNT=10;JsReporting.prototype.DEFAULT_FLUSH_TIME=6E4;
JsReporting.prototype._flushAndFetch=function(){var a=this;Object.keys(a.instrumenters).map(function(b){var d=a.instrumenters[b].bufferName;try{var f=JSON.parse(a.window.sessionStorage.getItem(d));null!==f&&null!==f.records&&a._fetchLog({logRecords:f.records},function(b,c){c&&a.window.sessionStorage.removeItem(d)})}catch(c){a.originalConsoleError.apply(a.window.console,[c])}})};
JsReporting.prototype._fetchLog=function(a,b){var d=this;try{var f={method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},mode:"cors",body:JSON.stringify(a)};d.window.fetch(d.url,f).then(function(a){a.ok?b&&b(null,!0):(d.restoreAll(),d.window.console.error("Stat Reporter - Unsuccessful request",a),b&&b(Error("Unsuccessful request"),!1))}).catch(function(a){d.restoreAll();d.window.console.error(a);b&&b(a,!1)})}catch(c){d.originalConsoleError.apply(d.window.console,[c]),
b&&b(c,!1)}};JsReporting.prototype._bindFlushEvents=function(){var a=this;a.window.addEventListener&&a.window.addEventListener("beforeunload",function(){a._flushAndFetch()});document.addEventListener&&document.addEventListener("visibilitychange",function(){document.hidden&&a._flushAndFetch()}.bind(a),!1)};JsReporting.prototype.configUrl=function(a){this.url=a};
JsReporting.prototype.addInstrumenter=function(a,b){this.instrumenters[a]=b;this.instrumenters[a].bufferName=a.concat("Buffer");b.instrument({log:this.log.bind(this,a)})};
JsReporting.prototype.log=function(a,b,d,f){if("undefined"===typeof this.window.fetch)this.restoreAll(),this.window.console.log("Fetch API is not supported");else{var c=this.instrumenters[a],a=this.instrumenters[a].bufferName,k=this.DEFAULT_FLUSH_COUNT,l=this.DEFAULT_FLUSH_TIME;if("undefined"!==typeof c.config&&null!==c.config&&(c=c.config,"undefined"!==typeof c.flushAtCount&&null!==c.flushAtCount&&(k=c.flushAtCount),"undefined"!==typeof c.flushAtTime&&null!==c.flushAtTime))l=c.flushAtTime;var i=
{},c=[];b.location={href:this.window.location.href,search:this.window.location.search,pathname:this.window.location.pathname,hash:this.window.location.hash,origin:this.window.location.origin,host:this.window.location.host,hostname:this.window.location.hostname};i[d]=b;var h;a:{try{var e=JSON.parse(this.window.sessionStorage.getItem(a));null===e&&(e={},e.timestamp=(new Date).getTime());"undefined"===typeof e.records||null===e.records?e.records=[i]:e.records.push(i);try{this.window.sessionStorage.setItem(a,
JSON.stringify(e))}catch(m){this.originalConsoleError.apply(this.window.console,[m]);h=!1;break a}}catch(n){this.originalConsoleError.apply(this.window.console,[n]);h=!1;break a}h=!0}!0!==h&&(c=[i]);var j;a:{b=h;try{var g=JSON.parse(this.window.sessionStorage.getItem(a));if(null!==g&&null!==g.records){var o=(new Date).getTime()-g.timestamp;if(g.records.length>=k||o>=l||!b){c=c.concat(g.records);this.window.sessionStorage.removeItem(a);j=!0;break a}}}catch(p){this.originalConsoleError.apply(this.window.console,
[p])}j=!1}g={logRecords:c};(!0!==h||!0===j)&&this._fetchLog(g,f)}};JsReporting.prototype.restoreAll=function(){var a=this;Object.keys(a.instrumenters).map(function(b){a.instrumenters[b].restore()})};