var AmdUsageReporting=function(a,b){this.amdInstrumenter=a;this.configObject=b};AmdUsageReporting.prototype.enable=function(){var a=document.querySelector('meta[name="ajs-enabled-dark-features"]');null!==a&&(a=a.getAttribute("content"),null!==a&&(a=a.split(","),-1<a.indexOf("confluence.frontend.stats")&&-1<a.indexOf("confluence.frontend.amd.stats")&&(a=new this.amdInstrumenter(this.configObject),window.jsReporting?window.jsReporting.addInstrumenter("amdInstrument",a):window.console.warn("Js Reporting plugin is undefined."))))};
if("undefined"!==typeof AmdInstrumenter){var amdUsageReporter=new AmdUsageReporting(AmdInstrumenter,{flushAtCount:50,flushAtTime:6E4});amdUsageReporter.enable()};