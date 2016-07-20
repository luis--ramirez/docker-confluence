define("confluence/property-panel",["jquery","ajs","confluence/position","window","document"],function(d,k,q,o,m){var p=function(c,e){e=e||{};o.setTimeout(function(){var b=k.Rte.Content.offset(c.anchor),i=c.panel.width(),f=i+b.left-d(o).width()+10,a=d(c.anchor).outerHeight(),f=b.left-(0<f?f:0)-0,a=c.shouldFlip?b.top-7-c.panel.outerHeight()-4:b.top+7+a;if(c.options.anchorIframe)var g=d(c.options.anchorIframe),g=g.offset().top+g.height()-c.panel.outerHeight()-10,a=Math.min(a,g);c.panel.find(".property-panel-arrow").css({left:Math.min(Math.abs(b.left-
f)+16,i-12)});f=Math.max(0,f);b={top:a,left:f,"z-index":2975};i=c.panel.add();e.animate?i.animate(b,e.animateDuration):i.css(b)},e.delay||0)},n={shouldCreate:!0,current:null,getAnchor:function(){return d(this.current.anchor)},createFromButtonModel:function(c,e,b,i){for(var f=k("div").attr({"class":"panel-buttons"}),a=0,g=b.length;a<g;a++)if(b[a]){var h=b[a],j=h.html||'<span class="icon"></span>',l=[];h.text&&(j+='<span class="panel-button-text">'+h.text+"</span>");h.className&&l.push(h.className);
h.disabled&&l.push("disabled");h.selected&&l.push("selected");!b[a+1]&&l.push("last");!b[a-1]&&l.push("first");h.html?j=d(h.html):(j=k("a").attr({href:b[a].href||"#"}).addClass("aui-button").html(j),h.disabled?(j.attr("title",h.disabledText),j.disable(),j.click(function(a){return k.stopEvent(a)})):b[a].click&&function(a,b,c){b.click(function(d){a.click(b,c);return k.stopEvent(d)})}(b[a],j,e));h.tooltip&&j.attr("data-tooltip",h.tooltip);j.addClass(l.join(" "));f.append(j)}return this.create(c,e,f,
i)},create:function(c,e,b,i){i=i||{};k.Rte.BookmarkManager.storeBookmark();var f=d("#property-panel"),a,g=void 0==i.enableFlip||i.enableFlip;f.length&&this.destroy();f=k("div").addClass("aui-property-panel-parent").addClass(c+"-panel aui-box-shadow").attr("id","property-panel").appendTo("body");a=k("div").addClass("aui-property-panel").append(b);f.append(a).css({top:0,left:-1E4});if(a=g){var g=d(i.anchorIframe||d(e).parent()),h=d(e);a=f.outerHeight()+10;g=q.spaceAboveBelow(g[0],h);a=g.below>=a?!1:
g.above>=a}var j=this;b.find(".last:last").css({"margin-right":0});b=f;g=d('<div class="property-panel-arrow"></div>');a&&g.addClass("property-panel-bottom-arrow").css({top:b.outerHeight()});b.prepend(g);this.current={anchor:e,panel:f,hasAnchorChanged:function(a){return a&&j.hasAnchorChanged(a)},snapToElement:function(a){p(this,a)},shouldFlip:a,tip:g,options:i,updating:!0,type:c};p(this.current);a=this.current;d(m).bind("keydown.property-panel.escape",function(a){27===a.keyCode&&n.destroy()});d(m).bind("click.property-panel",
function(a){d(a.target).closest("#property-panel").length||n.destroy()});k.trigger("created.property-panel",this.current);this.current.updating=!1;return this.current},destroy:function(){this.current?this.current.updating?k.log("PropertyPanel.destroy: called while updating, returning"):(k.trigger("destroyed.property-panel",this.current),d(m).unbind(".property-panel").unbind(".contextToolbar"),this.current.panel.remove(),this.current=null):k.log("PropertyPanel.destroy: called with no current PropertyPanel, returning")},
hasAnchorChanged:function(c){var e=this.current;return e&&d(e.anchor)[0]==d(c)[0]?e.options.originalHeight&&e.options.originalHeight!=d(c).height():!0}};return n});require("confluence/module-exporter").exportModuleAsGlobal("confluence/property-panel","AJS.Confluence.PropertyPanel");