(function(){function y(a){return"function"===typeof a}function j(){for(var a=0;a<k;a+=2)(0,r[a])(r[a+1]),r[a]=void 0,r[a+1]=void 0;k=0}function s(){}function t(a,b){if(a===b)e(a,new TypeError("You cannot resolve a promise with itself"));else if("function"===typeof b||"object"===typeof b&&null!==b)if(b.constructor===a.constructor)b._state===u?l(a,b._result):b._state===m?e(a,b._result):w(b,void 0,function(b){t(a,b)},function(b){e(a,b)});else{var c;try{c=b.then}catch(d){x.error=d,c=x}if(c===x)e(a,x.error);
else if(void 0===c)l(a,b);else if(y(c)){var h=c;n(function(a){var c=!1,d;a:{d=function(d){c||(c=!0,b!==d?t(a,d):l(a,d))};var g=function(b){c||(c=!0,e(a,b))};try{h.call(b,d,g)}catch(i){d=i;break a}d=void 0}!c&&d&&(c=!0,e(a,d))},a)}else l(a,b)}else l(a,b)}function M(a){a._onerror&&a._onerror(a._result);z(a)}function l(a,b){a._state===o&&(a._result=b,a._state=u,0!==a._subscribers.length&&n(z,a))}function e(a,b){a._state===o&&(a._state=m,a._result=b,n(M,a))}function w(a,b,c,d){var h=a._subscribers,f=
h.length;a._onerror=null;h[f]=b;h[f+u]=c;h[f+m]=d;0===f&&a._state&&n(z,a)}function z(a){var b=a._subscribers,c=a._state;if(0!==b.length){for(var d,h,f=a._result,e=0;e<b.length;e+=3)d=b[e],h=b[e+c],d?D(c,d,h,f):h(f);a._subscribers.length=0}}function E(){this.error=null}function D(a,b,c,d){var h=y(c),f,g,i,j;if(h){try{f=c(d)}catch(k){A.error=k,f=A}f===A?(j=!0,g=f.error,f=null):i=!0;if(b===f){e(b,new TypeError("A promises callback cannot return that same promise."));return}}else f=d,i=!0;b._state===
o&&(h&&i?t(b,f):j?e(b,g):a===u?l(b,f):a===m&&e(b,f))}function i(a,b){this._instanceConstructor=a;this.promise=new a(s);this._validateInput(b)?(this._input=b,this._remaining=this.length=b.length,this._init(),0===this.length?l(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&l(this.promise,this._result))):e(this.promise,this._validationError())}function g(a){this._id=N++;this._result=this._state=void 0;this._subscribers=[];if(s!==a){if(!y(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
if(!(this instanceof g))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");var b=this;try{a(function(a){t(b,a)},function(a){e(b,a)})}catch(c){e(b,c)}}}var F=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},k=0,G,B,n=function(a,b){r[k]=a;r[k+1]=b;k+=2;2===k&&(B?B(j):p())},q="undefined"!==typeof window?window:void 0,v=q||{},v=v.MutationObserver||v.WebKitMutationObserver,
O="undefined"!==typeof process&&"[object process]"==={}.toString.call(process),P="undefined"!==typeof Uint8ClampedArray&&"undefined"!==typeof importScripts&&"undefined"!==typeof MessageChannel,r=Array(1E3),p;if(O)p=function(){process.nextTick(j)};else if(v){var H=0,q=new v(j),I=document.createTextNode("");q.observe(I,{characterData:!0});p=function(){I.data=H=++H%2}}else if(P){var J=new MessageChannel;J.port1.onmessage=j;p=function(){J.port2.postMessage(0)}}else if(void 0===q&&"function"===typeof require)try{var K=
require("vertx");G=K.runOnLoop||K.runOnContext;p=function(){G(j)}}catch(Q){p=function(){setTimeout(j,1)}}else p=function(){setTimeout(j,1)};var o=void 0,u=1,m=2,x=new E,A=new E;i.prototype._validateInput=function(a){return F(a)};i.prototype._validationError=function(){return Error("Array Methods must be provided an Array")};i.prototype._init=function(){this._result=Array(this.length)};i.prototype._enumerate=function(){for(var a=this.length,b=this.promise,c=this._input,d=0;b._state===o&&d<a;d++)this._eachEntry(c[d],
d)};i.prototype._eachEntry=function(a,b){var c=this._instanceConstructor;"object"===typeof a&&null!==a?a.constructor===c&&a._state!==o?(a._onerror=null,this._settledAt(a._state,b,a._result)):this._willSettleAt(c.resolve(a),b):(this._remaining--,this._result[b]=a)};i.prototype._settledAt=function(a,b,c){var d=this.promise;d._state===o&&(this._remaining--,a===m?e(d,c):this._result[b]=c);0===this._remaining&&l(d,this._result)};i.prototype._willSettleAt=function(a,b){var c=this;w(a,void 0,function(a){c._settledAt(u,
b,a)},function(a){c._settledAt(m,b,a)})};var N=0,L=g;g.all=function(a){return(new i(this,a)).promise};g.race=function(a){function b(a){t(d,a)}function c(a){e(d,a)}var d=new this(s);if(!F(a))return e(d,new TypeError("You must pass an array to race.")),d;for(var h=a.length,f=0;d._state===o&&f<h;f++)w(this.resolve(a[f]),void 0,b,c);return d};g.resolve=function(a){if(a&&"object"===typeof a&&a.constructor===this)return a;var b=new this(s);t(b,a);return b};g.reject=function(a){var b=new this(s);e(b,a);
return b};g._setScheduler=function(a){B=a};g._setAsap=function(a){n=a};g._asap=n;g.prototype={constructor:g,then:function(a,b){var c=this._state;if(c===u&&!a||c===m&&!b)return this;var d=new this.constructor(s),e=this._result;if(c){var f=arguments[c-1];n(function(){D(c,d,f,e)})}else w(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}};var q=function(){var a;if("undefined"!==typeof global)a=global;else if("undefined"!==typeof self)a=self;else try{a=Function("return this")()}catch(b){throw Error("polyfill failed because global object is unavailable in this environment");
}var c=a.Promise;if(!c||"[object Promise]"!==Object.prototype.toString.call(c.resolve())||c.cast)a.Promise=L},C={Promise:L,polyfill:q};"function"===typeof define&&define.amd?define(function(){return C}):"undefined"!==typeof module&&module.exports?module.exports=C:"undefined"!==typeof this&&(this.ES6Promise=C);q()}).call(this);