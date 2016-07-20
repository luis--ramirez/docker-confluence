define("confluence/tree",["jquery","ajs","window","document"],function(d,r,x,l){var w=function(d){d.preventDefault()},u={tree:function(B,o){function y(a,c){for(var a=(a+"").toLowerCase(),c=(c+"").toLowerCase(),e=/(\d+|\D+)/g,i=a.match(e),e=c.match(e),b=Math.max(i.length,e.length),d=0;d<b;d++){if(d===i.length)return-1;if(d===e.length)return 1;var v=parseInt(i[d],10),f=parseInt(e[d],10);if(v==i[d]&&f==e[d]&&v!=f)return(v-f)/Math.abs(v-f);if((v!=i[d]||f!=e[d])&&i[d]!=e[d])return i[d]<e[d]?-1:1}return 0}
function z(a){this[0]=a[0];this.$=a;this.text=a.find("span").text();this.href=a.find("a").attr("href");this.linkClass=a.find("a").attr("class");this.nodeClass=a.attr("class");this.open=function(a){if(b.visibleNodes.length)return b.visibleNodes[this[0].num].open&&b.visibleNodes[this[0].num].open(a);r.log("tried to open empty node")};this.insertChild=function(a){a.$&&(a=a[0]);b.visibleNodes[this[0].num].append(a)};this.reorder=function(){b.visibleNodes[this[0].num].order(y)};this.close=function(){b.visibleNodes[this[0].num].close()};
this.getAttribute=function(a){return this[0][a]};this.setAttribute=function(a,c){this[0][a]=c};this.highlight=function(){this.$.addClass("highlighted")};this.unhighlight=function(){this.$.removeClass("highlighted")};this.makeDraggable=function(){this.setAttribute("undraggable",!1);this.$.removeClass("undraggable")};this.makeUndraggable=function(){this.setAttribute("undraggable",!0);this.$.addClass("undraggable")};this.makeClickable=function(a){this.setAttribute("unclickable",!1);this.$.removeClass("unclickable");
var c=this[0].getElementsByTagName("a"),a=a?d(c[0]):d(c);a.unbind("click",w);a.click(b.events.click)};this.makeUnclickable=function(a){this.setAttribute("unclickable",!0);this.$.addClass("unclickable");var c=this[0].getElementsByTagName("a"),a=a?d(c[0]):d(c);a.click(w);a.unbind("click",b.events.click)};this.setText=function(a){this.text=a;this[0].text=a;this.$.find("span").text(a)};this.getParent=function(){if(this.$.parent(":not(.ui-tree)").length){var a=this.$.parent().parent();if(a.length)return new z(d(a[0]))}return null};
this.append=function(a){var c=this.$.find("ul");if(!c.length){if(this[0].toBeLoaded){var e=this;this.open(function(){e.append(a)});return!1}this.$.append("<ul></ul>");c=this.$.find("ul")}var b=s(a);c.append(b);q.call(b);"undefined"===typeof this[0].closed&&(this.$.addClass("closed"),this[0].closed=!0,c.hide());j()};this.below=function(a){a=s(a);this.$.after(a);q.call(a);j()};this.above=function(a){a=s(a);this.$.before(a);q.call(a);j()};this.remove=function(){this.$.remove();j()};this.reload=function(){this[0].getElementsByTagName("ul").length&&
(this[0].removeChild(this[0].getElementsByTagName("ul")[0]),this.$.removeClass("opened").addClass("closed"),this[0].closed=!0,b.visibleNodes[this[0].num].open())};this.order=function(a){var c=d("ul",this.$),e=this[0];e.ordered=!0;if(c.length){var b=[];e.oldorder=[];d("li",this.$).each(function(){b.push(this);e.oldorder.push(this)});b.sort(function(c,e){return a(d(c).find("span").html(),d(e).find("span").html())});e.order=b;for(var f=0,k=b.length;f<k;f++)c.append(b[f])}j()};this.orderUndo=function(){this[0].ordered=
!1;var a=d("ul",this.$);if(this[0].oldorder&&a.length)for(var c=0,e=this[0].oldorder.length;c<e;c++)a.append(this[0].oldorder[c]);this[0].oldorder=null;j()};this.setOrdered=function(a){this[0].ordered=a;d("a.abc:first",this).css("display",a?"none":"block");d("a.rollback:first",this).css("display","none")};if(f.options.parameters&&f.options.parameters.length)for(var c=0,e=f.options.parameters.length;c<e;c++)a[0][f.options.parameters[c]]&&(this[f.options.parameters[c]]=a[0][f.options.parameters[c]])}
function A(a){return!("li"===a.tagName.toLowerCase()&&1>d("li:not(.tree-helper)",a).length)}function m(a){this.$li=d(a);this.height=this.$li.height()}function t(a){a=b.points[a];return"undefined"!==typeof a?{visibleNode:b.visibleNodes[a.num],where:a.where,top:a.top}:{visibleNode:new m(p),where:"append",top:b.dim.top}}function C(){var a=0,c=0;b.points=[];for(var e=0,d=b.visibleNodes.length;e<d;e++){var h=b.visibleNodes[e].$li.offset(),g=Math.round(h.top);b.visibleNodes[e].top=g;b.visibleNodes[e].left=
Math.round(h.left);var f,j;if(a){h=(g-a)/4;for(f=a;f<g;f++)j=f-a<h?"above":f-a<3*h?"append":"below",b.points[f]={num:c,where:j,top:a}}if(e==d-1){h=b.visibleNodes[e].height/4;for(f=g;f<g+b.visibleNodes[e].height;f++)j=f-g<h?"above":f-g<3*h?"append":"below",b.points[f]={num:e,where:j,top:g}}a=g;c=e}}function j(){b.visibleNodes=[];for(var a=d("li:visible",p),c=0,e=a.length;c<e;c++)d(a[c]).hasClass("tree-helper")||(a[c].num=b.visibleNodes.length,b.visibleNodes.push(new m(a[c])));C()}function q(){var a=
d(this);f.options.undraggable?a.mousedown(w):(a.draggable(E()),a[0].undraggable=a.hasClass("undraggable"));var c=d(this.getElementsByTagName("a")[0]);f.options.unclickable?(a.addClass("unclickable"),c.click(w)):c.click(b.events.click);f.options.oninsert&&f.options.oninsert.call(new z(a),c)}function s(a){var c=l.createElement("li");c.className=a.nodeClass;if(f.options.parameters&&f.options.parameters.length)for(var e=0,b=f.options.parameters.length;e<b;e++)a[f.options.parameters[e]]&&(c[f.options.parameters[e]]=
a[f.options.parameters[e]]);f.options.nodeId&&(c.id="node-"+a[f.options.nodeId]);var e=l.createElement("a"),b=l.createElement("span"),h=l.createElement("i");h.className="decorator";e.href=a.href;b.appendChild(l.createTextNode(a.text));e.appendChild(b);e.appendChild(h);e.className=a.linkClass;a=l.createElement("div");d(a).addClass("click-zone");d(a).click(F);d(c).mouseover(G).mouseout(H);c.appendChild(a);c.appendChild(e);e=l.createElement("div");e.className="button-panel";c.appendChild(e);b=l.createElement("a");
b.className="abc";b.title="Sort Alphabetically";e.appendChild(b);h=l.createElement("a");h.className="rollback";h.title="Undo Sorting";e.appendChild(h);d(b).click(I);d(h).click(J);if(f.options.isAdministrator){var g=l.createElement("a");g.className="preview-node";g.title="Preview";e.appendChild(g);d(g).click(K);g=l.createElement("a");g.className="remove-node";g.title="Delete";e.appendChild(g);d(g).click(L)}d(b).css("display","none");d(h).css("display","none");e=d(c);e.hasClass("opened")?(e.removeClass("opened").addClass("closed"),
c.closed=!0):e.hasClass("closed")?c.toBeLoaded=!0:d(a).css("display","none");return c}var k=B,f=this,D=!1,M=arguments;if(!/^[ou]l$/i.test(k[0].tagName)){D=!0;if(!o.url)return!1;k.html("<ul></ul>");k=d("ul",k)}var p=k[0];k.addClass("ui-tree");var b={list:k,visibleNodes:[],dim:k.offset(),points:[],win:d(x),timer:null,prev:0,events:{grab:function(){},click:function(){},drag:function(){},drop:function(){},append:function(){},insertabove:function(){},insertbelow:function(){},load:function(){},nodeover:function(){},
nodeout:function(){},onready:function(){},order:function(){},orderUndo:function(){},remove:function(){},preview:function(){}}};this.options=o;this.expandPath=function(a,c){c=c||function(){};if(a.length){var b=1,d,h,g=function(){if(b<a.length){for(var h in a[b])if(d=f.findNodeBy(h,a[b][h]))break;b++;d.open(g)}else c()};for(h in a[0]){d=this.findNodeBy(h,a[0][h]);break}d&&d.open(g)}else c()};this.reload=function(a){D&&k.remove();for(var c in a)this.options[c]=a[c];return new M.callee(B,this.options)};
this.append=function(a){a=s(a);k.append(a);q.call(a);j()};this.unhighlight=function(){k.find("li.highlighted").each(function(){d(this).removeClass("highlighted")})};this.findNodeBy=function(a,c){for(var b=[],i=p.getElementsByTagName("li"),h=0,g=i.length;h<g;h++)i[h][a]==c&&b.push(new z(d(i[h])));return 0===b.length?null:1===b.length?b[0]:b};for(var n in b.events)"function"===typeof o[n]&&(b.events[n]=o[n]);m.prototype.append=function(a){if(this.$li[0]==a)return!1;if(this.$li[0].toBeLoaded){var c=
this;this.load(function(){c.append(a)});return!1}if("li"===this.$li[0].tagName.toLowerCase()){var e=d("ul:first",this.$li),i=a.parentNode.parentNode;d(".rollback:first",i).css("display","none");e.length?(e.append(a),this.$li[0].ordered&&this.order(y)):(e=l.createElement("ul"),e.appendChild(a),this.$li[0].appendChild(e),this.$li.addClass("opened"),d(".click-zone:first",this.$li).css("display","inline"),d(".rollback:first",this.$li).css("display","none"));A(i)||b.visibleNodes[i.num].notaFolderAnymore();
setTimeout(j,0);b.events.append.call({source:a,target:this.$li[0]})}};m.prototype.below=function(a){var c=a.parentNode.parentNode;this.$li.after(a);d(".rollback:first",c).css("display","none");A(c)?!d(a.parentNode).hasClass("ui-tree")&&!a.parentNode.parentNode.undraggable&&(a.parentNode.parentNode.ordered=!1,d(".abc:first",a.parentNode.parentNode).css("display","block"),d(".rollback:first",a.parentNode.parentNode).css("display","none")):b.visibleNodes[c.num].notaFolderAnymore();setTimeout(j,0);b.events.insertbelow.call({source:a,
target:this.$li[0]})};m.prototype.above=function(a){var c=a.parentNode.parentNode;this.$li.before(a);d(".rollback:first",c).css("display","none");A(c)?!d(a.parentNode).hasClass("ui-tree")&&!a.parentNode.parentNode.undraggable&&(a.parentNode.parentNode.ordered=!1,d(".abc:first",a.parentNode.parentNode).css("display","block"),d(".rollback:first",a.parentNode.parentNode).css("display","none")):b.visibleNodes[c.num].notaFolderAnymore();setTimeout(j,0);b.events.insertabove.call({source:a,target:this.$li[0]})};
m.prototype.order=function(a){var b=this.$li[0];b.ordered=!0;var e=d("ul:first",this.$li);if(e.length){var i=[];b.oldorder=[];d("li",this.$li).each(function(){this.parentNode.parentNode==b&&(i.push(this),b.oldorder.push(this))});i.sort(function(b,c){var e=d("span",b).text().replace(/^\s+|\s+$/g,""),h=d("span",c).text().replace(/^\s+|\s+$/g,"");return a(e,h)});b.order=i;for(var h=0,g=i.length;h<g;h++)e.append(i[h])}j()};m.prototype.orderUndo=function(){var a=this.$li[0];a.ordered=!1;var b=d("ul:first",
this.$li);if(a.oldorder&&b.length&&b[0].parentNode==a)for(var e=0,i=a.oldorder.length;e<i;e++)b.append(a.oldorder[e]);a.oldorder=null;a.oldor=null;j()};m.prototype.open=function(a){a=a||function(){};if(this.$li.hasClass("closed")){var b=d("ul:has(li)",this.$li);return b.length?(b.show(),this.closed=!1,this.$li.removeClass("closed").addClass("opened"),j(),a(!0),!0):this.load(a)}a(!1);return!1};m.prototype.close=function(a){var a=a||function(){},c=this.$li.contents().filter("ul:has(li)");c.length&&
(c.hide(),this.closed=!0,this.$li.removeClass("opened").addClass("closed"),b.visibleNodes.splice(this.$li[0].num+1,c[0].getElementsByTagName("li").length),j(),a())};m.prototype.load=function(a){var c=f.options.url;if(!c)return!1;a=a||function(){};this.$li[0].toBeLoaded=!1;this.$li[0].closed=!0;var e={};if(o.parameters&&o.parameters.length)for(var i=0,h=o.parameters.length;i<h;i++)e[o.parameters[i]]=this.$li[0][o.parameters[i]]||"";var g=this;this.$li[0].getElementsByTagName("span");var j=d(".button-panel",
this.$li[0]);g.loading=!0;j.spin({left:"10px"});d.ajax({url:c,type:"GET",dataType:"json",data:e,success:function(c){var e=d("ul",g.$li);e.length||(e=l.createElement("ul"),g.$li[0].appendChild(e),e=d(e));g.ordered="number"!==typeof c[0].position;for(var h=0,i=c.length;h<i;h++){var f=s(c[h]);e[0].appendChild(f);q.call(f)}e.hide();g.open(a);b.events.load();j.spinStop();g.$li[0].ordered=g.ordered;d(".abc:first",g.$li[0]).css("display",g.ordered||f.undraggable?"none":"block");d(".rollback:first",g.$li[0]).css("display",
"none")}});return!0};m.prototype.notaFolderAnymore=function(){this.$li.removeClass("closed").removeClass("opened");d(".click-zone:first",this.$li).hide();d(".abc:first",this.$li).css("display","none");d(".rollback:first",this.$li).css("display","none");var a=this.$li[0].getElementsByTagName("ul");this.closed=!1;a.length&&this.$li[0].removeChild(a[0])};this.updateVisibleNodes=j;var E=function(){var a={distance:3,helper:"clone",opacity:0.7,cursorAt:{top:b.H/2,left:30},stop:function(c){clearInterval(b.timer);
clearTimeout(b.opentimer);b.opentimer=null;var e=t(b.prev);e.visibleNode.$li.removeClass("over").removeClass("above").removeClass("append").removeClass("below");e.visibleNode.$li.next().removeClass("over").removeClass("above").removeClass("append").removeClass("below");b.win.unbind("keypress",b.escape);delete b.escape;if(a.revert)return a.revert=!1;for(var e=t(c.pageY||c.originalEvent.pageY),c=e.visibleNode.$li[0],d=!0;c!=p;){if(c==this){d=!1;break}c=c.parentNode}if(d=d&&!("above"==e.where&&e.visibleNode.$li.prev()[0]==
this)&&!("append"==e.where&&e.visibleNode.$li[0]==this.parentNode.parentNode))e.visibleNode[e.where](this),b.events.drop.call({position:e.where,source:this,target:e.visibleNode.$li[0]})},start:function(c,e){var f=this;e.helper.append("<strong></strong>").addClass("tree-helper").find(".button-panel").remove();b.events.grab.call(f);this.undraggable&&(e.helper.addClass("no"),a.revert=!0);b.escape=function(c){if(c.keyCode===27){c=t(b.prev);c.visibleNode.$li.removeClass("over").removeClass("above").removeClass("append").removeClass("below");
c.visibleNode.$li.next().removeClass("over").removeClass("above").removeClass("append").removeClass("below");var g=e.helper.clone();e.helper.before(g);g.animate({left:Math.round(d(f).offset().left)+"px",top:Math.round(d(f).offset().top)+"px",opacity:0},"slow","swing",function(){g.remove()});e.helper.css("display","none");a.revert=true}};b.win.keypress(b.escape)},drag:function(c,e){c.pageY=c.pageY||c.originalEvent.pageY;c.pageX=c.pageX||c.originalEvent.pageX;var d=t(b.prev);d.visibleNode.$li.removeClass("above").removeClass("append").removeClass("below");
d.visibleNode.$li.next().removeClass("above").removeClass("append").removeClass("below");if(!a.revert||b.out){b.prev=c.pageY;var f=t(b.prev);if(f.visibleNode.$li[0]==p)a.revert=!0,b.out=!0;else{b.out&&(b.out=!1,a.revert=!1);f.visibleNode!=d.visibleNode&&(b.events.nodeout.call(d.visibleNode.$li),b.opentimer&&(clearTimeout(b.opentimer),b.opentimer=!1));b.events.nodeover.call({element:f.visibleNode.$li,position:f.where});var d=f.where,g=f.visibleNode.$li.next();"below"==d&&g.length&&!g.hasClass("tree-helper")?
g.addClass("above"):t(b.prev).visibleNode.$li.addClass(d);if("append"==f.where&&(f.visibleNode.closed||f.visibleNode.$li[0].toBeLoaded)&&!b.opentimer)d=b,g=setTimeout(function(){f.visibleNode.$li.removeClass("append");f.visibleNode.open(function(){b.opentimer=false})},500),d.opentimer=g;var j=arguments.callee;30>b.win.height()-c.pageY+b.win.scrollTop()?(clearInterval(b.timer),b.timer=setInterval(function(){x.scrollBy(0,4);e.helper.css("top",parseInt(e.helper.css("top"))+4+"px");j({pageY:c.pageY+4},
e)},b.win.height()-c.pageY+b.win.scrollTop())):0<b.win.scrollTop()&&30>c.pageY-b.win.scrollTop()?(clearInterval(b.timer),b.timer=setInterval(function(){x.scrollBy(0,-4);j({pageY:c.pageY-4},e);e.helper.css("top",parseInt(e.helper.css("top"))-4+"px")},c.pageY-b.win.scrollTop())):b.timer&&clearInterval(b.timer);b.events.drag.call({element:this,left:c.pageX,top:c.pageY})}}}};return a};u.tree.callNumber=0;var F=function(){if(!b.visibleNodes[this.parentNode.num].loading)return d(this.parentNode).hasClass("closed")?
b.visibleNodes[this.parentNode.num].open():b.visibleNodes[this.parentNode.num].close(),!1},G=function(a){d(a.target).hasClass("tree-helper")||d(".button-panel:first",this).addClass("hover");return!1},H=function(a){d(a.target).hasClass("tree-helper")||d(".button-panel:first",this).removeClass("hover");return!1},I=function(){var a=b.visibleNodes[this.parentNode.parentNode.num];a.order(y);b.events.order.call({source:a.$li[0]});d(this).hide();d("a.rollback",this.parentNode).show();return!1},J=function(){var a=
b.visibleNodes[this.parentNode.parentNode.num];a.orderUndo();b.events.orderUndo.call({source:a.$li[0],orderedChildren:d("ul:first",a.$li[0]).children()});d(this).hide();d("a.abc",this.parentNode).show();return!1},K=function(a){a.preventDefault();b.events.preview.call({source:preview,node:b.visibleNodes[this.parentNode.parentNode.num].$li[0]})},L=function(a){a.preventDefault();b.events.remove.call({source:b.visibleNodes[this.parentNode.parentNode.num].$li[0]})};n=k.contents().filter("li");if(0<n.length)b.H=
n.height(),n.each(q),j(),b.events.onready.call(this);else{n=f.options.initUrl||f.options.url;if(!n)return!1;d(k).spin({left:"0%"});var N=++u.tree.callNumber;d.getJSON(n,function(a){for(var c=0,e=a.length;c<e;c++){var f=s(a[c]);p.appendChild(f);0===c&&(b.H=d(f).height());q.call(f)}j();d(k).spinStop();N==u.tree.callNumber&&(b.events.onready.call(this),u.tree.callNumber=0)})}b.offset=p.offsetTop;setInterval(function(){p.offsetTop!=b.offset&&(C(),b.offset=p.offsetTop)},10);return this}};return{jqueryPlugin:{tree:function(d){if(!this.is(".ui-tree"))return new u.tree(this,
d)}},ui:u}});require("confluence/module-exporter").safeRequire("confluence/tree",function(d){var r=require("jquery");r.ui=r.ui||{};r.fn.extend(d.jqueryPlugin);r.ui.tree=d.ui.tree});