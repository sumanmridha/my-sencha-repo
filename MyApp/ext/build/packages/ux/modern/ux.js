Ext.define("Ext.ux.ajax.Simlet",function(){var d=/([^?#]*)(#.*)?$/,a=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,b=/^[+-]?\d+$/,c=/^[+-]?\d+\.\d+$/;function e(g){var f;if(Ext.isDefined(g)){g=decodeURIComponent(g);if(b.test(g)){g=parseInt(g,10)}else{if(c.test(g)){g=parseFloat(g)}else{if(!!(f=a.test(g))){g=new Date(Date.UTC(+f[1],+f[2]-1,+f[3],+f[4],+f[5],+f[6]))}}}}return g}return{alias:"simlet.basic",isSimlet:true,responseProps:["responseText","responseXML","status","statusText"],status:200,statusText:"OK",constructor:function(f){Ext.apply(this,f)},doGet:function(f){var h=this,g={};Ext.Array.forEach(h.responseProps,function(i){if(i in h){g[i]=h[i]}});return g},doPost:function(f){var h=this,g={};Ext.Array.forEach(h.responseProps,function(i){if(i in h){g[i]=h[i]}});return g},doRedirect:function(f){return false},doDelete:function(f){var h=this,i=f.xhr,g=i.options.records;h.removeFromData(f,g)},exec:function(i){var h=this,f={},j="do"+Ext.String.capitalize(i.method.toLowerCase()),g=h[j];if(g){f=g.call(h,h.getCtx(i.method,i.url,i))}else{f={status:405,statusText:"Method Not Allowed"}}return f},getCtx:function(h,f,g){return{method:h,params:this.parseQueryString(f),url:f,xhr:g}},openRequest:function(l,h,g,i){var f=this.getCtx(l,h),k=this.doRedirect(f),j;if(g.action==="destroy"){l="delete"}if(k){j=k}else{j=new Ext.ux.ajax.SimXhr({mgr:this.manager,simlet:this,options:g});j.open(l,h,i)}return j},parseQueryString:function(o){var g=d.exec(o),l={},q,p,k,f;if(g&&g[1]){var j,h=g[1].split("&");for(k=0,f=h.length;k<f;++k){if((j=h[k].split("="))[0]){q=decodeURIComponent(j.shift());p=e((j.length>1)?j.join("="):j[0]);if(!(q in l)){l[q]=p}else{if(Ext.isArray(l[q])){l[q].push(p)}else{l[q]=[l[q],p]}}}}}return l},redirect:function(h,f,g){switch(arguments.length){case 2:if(typeof f=="string"){break}g=f;case 1:f=h;h="GET";break}if(g){f=Ext.urlAppend(f,Ext.Object.toQueryString(g))}return this.manager.openRequest(h,f)},removeFromData:function(f,g){var j=this,k=j.getData(f),i=(f.xhr.options.proxy&&f.xhr.options.proxy.getModel())||{},h=i.idProperty||"id";Ext.each(g,function(l){var n=l.get(h);for(var m=k.length;m-->0;){if(k[m][h]===n){j.deleteRecord(m);break}}})}}}());Ext.define("Ext.ux.ajax.DataSimlet",function(){function b(f,e){var c=f.direction,d=(c&&c.toUpperCase()==="DESC")?-1:1;return function(h,i){var g=h[f.property],k=i[f.property],j=(g<k)?-1:((k<g)?1:0);if(j||!e){return j*d}return e(h,i)}}function a(c,e){for(var f=e,d=c&&c.length;d;){f=b(c[--d],f)}return f}return{extend:"Ext.ux.ajax.Simlet",buildNodes:function(g,l){var k=this,d={data:[]},j=g.length,f,h,e,c;k.nodes[l]=d;for(h=0;h<j;++h){d.data.push(e=g[h]);c=e.text||e.title;e.id=l?l+"/"+c:c;f=e.children;if(!(e.leaf=!f)){delete e.children;k.buildNodes(f,e.id)}}},deleteRecord:function(c){if(this.data&&typeof this.data!=="function"){Ext.Array.removeAt(this.data,c)}},fixTree:function(d,c){var g=this,f=d.params.node,e;if(!(e=g.nodes)){g.nodes=e={};g.buildNodes(c,"")}f=e[f];if(f){if(g.node){g.node.sortedData=g.sortedData;g.node.currentOrder=g.currentOrder}g.node=f;g.data=f.data;g.sortedData=f.sortedData;g.currentOrder=f.currentOrder}else{g.data=null}},getData:function(k){var i=this,f=k.params,e=(f.filter||"")+(f.group||"")+"-"+(f.sort||"")+"-"+(f.dir||""),l=i.tree,c,g,h,j;if(l){i.fixTree(k,l)}g=i.data;if(typeof g==="function"){c=true;g=g.call(this,k)}if(!g||e==="--"){return g||[]}if(!c&&e==i.currentOrder){return i.sortedData}k.filterSpec=f.filter&&Ext.decode(f.filter);k.groupSpec=f.group&&Ext.decode(f.group);h=f.sort;if(f.dir){h=[{direction:f.dir,property:h}]}else{h=Ext.decode(f.sort)}if(k.filterSpec){var d=new Ext.util.FilterCollection();d.add(this.processFilters(k.filterSpec));g=Ext.Array.filter(g,d.getFilterFn())}j=a((k.sortSpec=h));if(k.groupSpec){j=a([k.groupSpec],j)}g=Ext.isArray(g)?g.slice(0):g;if(j){Ext.Array.sort(g,j)}i.sortedData=g;i.currentOrder=e;return g},processFilters:Ext.identityFn,getPage:function(d,g){var e=g,f=g.length,h=d.params.start||0,c=d.params.limit?Math.min(f,h+d.params.limit):f;if(h||c<f){e=e.slice(h,c)}return e},getGroupSummary:function(d,e,c){return e[0]},getSummary:function(m,g,h){var j=this,c=m.groupSpec.property,k,f={},i=[],d,e;Ext.each(h,function(n){d=n[c];f[d]=true});function l(){if(k){i.push(j.getGroupSummary(c,k,m));k=null}}Ext.each(g,function(n){d=n[c];if(e!==d){l();e=d}if(!f[d]){return !i.length}if(k){k.push(n)}else{k=[n]}return true});l();return i}}}());Ext.define("Ext.ux.ajax.JsonSimlet",{extend:"Ext.ux.ajax.DataSimlet",alias:"simlet.json",doGet:function(c){var f=this,h=f.getData(c),g=f.getPage(c,h),a=c.xhr.options.proxy&&c.xhr.options.proxy.getReader(),b=a&&a.getRootProperty(),e=f.callParent(arguments),d={};if(b&&Ext.isArray(g)){d[b]=g;d[a.getTotalProperty()]=h.length}else{d=g}if(c.groupSpec){d.summaryData=f.getSummary(c,h,g)}e.responseText=Ext.encode(d);return e},doPost:function(a){return this.doGet(a)}});Ext.define("Ext.ux.ajax.SimXhr",{readyState:0,mgr:null,simlet:null,constructor:function(a){var b=this;Ext.apply(b,a);b.requestHeaders={}},abort:function(){var a=this;if(a.timer){clearTimeout(a.timer);a.timer=null}a.aborted=true},getAllResponseHeaders:function(){var a=[];if(Ext.isObject(this.responseHeaders)){Ext.Object.each(this.responseHeaders,function(b,c){a.push(b+": "+c)})}return a.join("\r\n")},getResponseHeader:function(b){var a=this.responseHeaders;return(a&&a[b])||null},open:function(f,c,d,a,b){var e=this;e.method=f;e.url=c;e.async=d!==false;e.user=a;e.password=b;e.setReadyState(1)},overrideMimeType:function(a){this.mimeType=a},schedule:function(){var b=this,a=b.mgr.delay;if(a){b.timer=setTimeout(function(){b.onTick()},a)}else{b.onTick()}},send:function(a){var b=this;b.body=a;if(b.async){b.schedule()}else{b.onComplete()}},setReadyState:function(b){var a=this;if(a.readyState!=b){a.readyState=b;a.onreadystatechange()}},setRequestHeader:function(b,a){this.requestHeaders[b]=a},onreadystatechange:Ext.emptyFn,onComplete:function(){var me=this,callback;me.readyState=4;Ext.apply(me,me.simlet.exec(me));callback=me.jsonpCallback;if(callback){var text=callback+"("+me.responseText+")";eval(text)}},onTick:function(){var a=this;a.timer=null;a.onComplete();a.onreadystatechange&&a.onreadystatechange()}});Ext.define("Ext.ux.ajax.SimManager",{singleton:true,requires:["Ext.data.Connection","Ext.ux.ajax.SimXhr","Ext.ux.ajax.Simlet","Ext.ux.ajax.JsonSimlet"],defaultType:"basic",delay:150,ready:false,constructor:function(){this.simlets=[]},getSimlet:function(a){var g=this,e=a.indexOf("?"),b=g.simlets,f=b.length,c,j,h,d;if(e<0){e=a.indexOf("#")}if(e>0){a=a.substring(0,e)}for(c=0;c<f;++c){j=b[c];h=j.url;if(h instanceof RegExp){d=h.test(a)}else{d=h===a}if(d){return j}}return g.defaultSimlet},getXhr:function(e,b,a,c){var d=this.getSimlet(b);if(d){return d.openRequest(e,b,a,c)}return null},init:function(a){var b=this;Ext.apply(b,a);if(!b.ready){b.ready=true;if(!("defaultSimlet" in b)){b.defaultSimlet=new Ext.ux.ajax.Simlet({status:404,statusText:"Not Found"})}b._openRequest=Ext.data.Connection.prototype.openRequest;Ext.data.request.Ajax.override({openRequest:function(d,c,e){var f=!d.nosim&&b.getXhr(c.method,c.url,d,e);if(!f){f=this.callParent(arguments)}return f}});if(Ext.data.JsonP){Ext.data.JsonP.self.override({createScript:function(f,g,e){var c=Ext.urlAppend(f,Ext.Object.toQueryString(g)),d=!e.nosim&&b.getXhr("GET",c,e,true);if(!d){d=this.callParent(arguments)}return d},loadScript:function(d){var c=d.script;if(c.simlet){c.jsonpCallback=d.params[d.callbackKey];c.send(null);d.script=document.createElement("script")}else{this.callParent(arguments)}}})}}return b},openRequest:function(d,a,c){var b={method:d,url:a};return this._openRequest.call(Ext.data.Connection.prototype,{},b,c)},register:function(c){var b=this;b.init();function a(d){var e=d;if(!e.isSimlet){e=Ext.create("simlet."+(e.type||e.stype||b.defaultType),d)}b.simlets.push(e);e.manager=b}if(Ext.isArray(c)){Ext.each(c,a)}else{if(c.isSimlet||c.url){a(c)}else{Ext.Object.each(c,function(d,e){e.url=d;a(e)})}}return b}});Ext.define("Ext.ux.ajax.XmlSimlet",{extend:"Ext.ux.ajax.DataSimlet",alias:"simlet.xml",xmlTpl:["<{root}>\n",'<tpl for="data">',"    <{parent.record}>\n",'<tpl for="parent.fields">',"        <{name}>{[parent[values.name]]}</{name}>\n","</tpl>","    </{parent.record}>\n","</tpl>","</{root}>"],doGet:function(l){var j=this,b=j.getData(l),h=j.getPage(l,b),i=l.xhr.options.operation.getProxy(),e=i&&i.getReader(),d=e&&e.getModel(),g=j.callParent(arguments),a={data:h,reader:e,fields:d&&d.fields,root:e&&e.getRootProperty(),record:e&&e.record},f,c,k;if(l.groupSpec){a.summaryData=j.getSummary(l,b,h)}if(j.xmlTpl){f=Ext.XTemplate.getTpl(j,"xmlTpl");c=f.apply(a)}else{c=b}if(typeof DOMParser!="undefined"){k=(new DOMParser()).parseFromString(c,"text/xml")}else{k=new ActiveXObject("Microsoft.XMLDOM");k.async=false;k.loadXML(c)}g.responseText=c;g.responseXML=k;return g},fixTree:function(){this.callParent(arguments);var a=[];this.buildTreeXml(this.data,a);this.data=a.join("")},buildTreeXml:function(c,b){var a=this.rootProperty,d=this.recordProperty;b.push("<",a,">");Ext.Array.forEach(c,function(f){b.push("<",d,">");for(var e in f){if(e=="children"){this.buildTreeXml(f.children,b)}else{b.push("<",e,">",f[e],"</",e,">")}}b.push("</",d,">")});b.push("</",a,">")}});Ext.define("Ext.ux.event.Driver",{extend:"Ext.util.Observable",active:null,specialKeysByName:{PGUP:33,PGDN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40},specialKeysByCode:{},getTextSelection:function(d){var e=d.ownerDocument,c,a,f,b;if(typeof d.selectionStart==="number"){f=d.selectionStart;b=d.selectionEnd}else{if(e.selection){c=e.selection.createRange();a=d.createTextRange();a.setEndPoint("EndToStart",c);f=a.text.length;b=f+c.text.length}}return[f,b]},getTime:function(){return new Date().getTime()},getTimestamp:function(){var a=this.getTime();return a-this.startTime},onStart:function(){},onStop:function(){},start:function(){var a=this;if(!a.active){a.active=new Date();a.startTime=a.getTime();a.onStart();a.fireEvent("start",a)}},stop:function(){var a=this;if(a.active){a.active=null;a.onStop();a.fireEvent("stop",a)}}},function(){var a=this.prototype;Ext.Object.each(a.specialKeysByName,function(b,c){a.specialKeysByCode[c]=b})});Ext.define("Ext.ux.event.Maker",{eventQueue:[],startAfter:500,timerIncrement:500,currentTiming:0,constructor:function(a){var b=this;b.currentTiming=b.startAfter;if(!Ext.isArray(a)){a=[a]}Ext.Array.each(a,function(c){c.el=c.el||"el";Ext.Array.each(Ext.ComponentQuery.query(c.cmpQuery),function(g){var f={},d,h,e;if(!c.domQuery){e=g[c.el]}else{e=g.el.down(c.domQuery)}f.target="#"+e.dom.id;f.type=c.type;f.button=a.button||0;d=e.getX()+(e.getWidth()/2);h=e.getY()+(e.getHeight()/2);f.xy=[d,h];f.ts=b.currentTiming;b.currentTiming+=b.timerIncrement;b.eventQueue.push(f)});if(c.screenshot){b.eventQueue[b.eventQueue.length-1].screenshot=true}});return b.eventQueue}});Ext.define("Ext.ux.event.Player",function(d){var h={},c={},a={},g,b={},f={resize:1,reset:1,submit:1,change:1,select:1,error:1,abort:1};Ext.each(["click","dblclick","mouseover","mouseout","mousedown","mouseup","mousemove"],function(i){f[i]=h[i]=c[i]={bubbles:true,cancelable:(i!="mousemove"),detail:1,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,button:0}});Ext.each(["keydown","keyup","keypress"],function(i){f[i]=h[i]=a[i]={bubbles:true,cancelable:true,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,keyCode:0,charCode:0}});Ext.each(["blur","change","focus","resize","scroll","select"],function(i){h[i]=b[i]={bubbles:(i in f),cancelable:false,detail:1}});var e={8:function(j,k,i){if(k<i){j.value=j.value.substring(0,k)+j.value.substring(i)}else{if(k>0){j.value=j.value.substring(0,--k)+j.value.substring(i)}}this.setTextSelection(j,k,k)},46:function(j,k,i){if(k<i){j.value=j.value.substring(0,k)+j.value.substring(i)}else{if(k<j.value.length-1){j.value=j.value.substring(0,k)+j.value.substring(k+1)}}this.setTextSelection(j,k,k)}};return{extend:"Ext.ux.event.Driver",keyFrameEvents:{click:true},pauseForAnimations:true,speed:1,stallTime:0,_inputSpecialKeys:{INPUT:e,TEXTAREA:Ext.apply({},e)},tagPathRegEx:/(\w+)(?:\[(\d+)\])?/,constructor:function(i){var j=this;j.callParent(arguments);j.timerFn=function(){j.onTick()};j.attachTo=j.attachTo||window;g=j.attachTo.document},getElementFromXPath:function(s){var t=this,p=s.split("/"),u=t.tagPathRegEx,q,l,o,r,v,k,j=t.attachTo.document;j=(p[0]=="~")?j.body:j.getElementById(p[0].substring(1));for(q=1,l=p.length;j&&q<l;++q){o=u.exec(p[q]);r=o[2]?parseInt(o[2],10):1;v=o[1].toUpperCase();for(k=j.firstChild;k;k=k.nextSibling){if(k.tagName==v){if(r==1){break}--r}}j=k}return j},offsetToRangeCharacterMove:function(i,j){return j-(i.value.slice(0,j).split("\r\n").length-1)},setTextSelection:function(m,i,l){if(i<0){i+=m.value.length}if(l==null){l=i}if(l<0){l+=m.value.length}if(typeof m.selectionStart==="number"){m.selectionStart=i;m.selectionEnd=l}else{var k=m.createTextRange();var j=this.offsetToRangeCharacterMove(m,i);k.collapse(true);if(i==l){k.move("character",j)}else{k.moveEnd("character",this.offsetToRangeCharacterMove(m,l));k.moveStart("character",j)}k.select()}},getTimeIndex:function(){var i=this.getTimestamp()-this.stallTime;return i*this.speed},makeToken:function(i,l){var j=this,k;i[l]=true;i.defer=function(){i[l]=false;k=j.getTime()};i.finish=function(){i[l]=true;j.stallTime+=j.getTime()-k;j.schedule()}},nextEvent:function(j){var k=this,i=++k.queueIndex;if(k.keyFrameEvents[j.type]){Ext.Array.insert(k.eventQueue,i,[{keyframe:true,ts:j.ts}])}},peekEvent:function(){return this.eventQueue[this.queueIndex]||null},replaceEvent:function(j,m){for(var l,k=0,o=m.length;k<o;++k){if(k){l=m[k-1];delete l.afterplay;delete l.screenshot;delete m[k].beforeplay}}Ext.Array.replace(this.eventQueue,(j==null)?this.queueIndex:j,1,m)},processEvents:function(){var j=this,k=j.pauseForAnimations&&j.attachTo.Ext.fx.Manager.items,i;while((i=j.peekEvent())!==null){if(k&&k.getCount()){return true}if(i.keyframe){if(!j.processKeyFrame(i)){return false}j.nextEvent(i)}else{if(i.ts<=j.getTimeIndex()&&j.fireEvent("beforeplay",j,i)!==false&&j.playEvent(i)){j.nextEvent(i)}else{return true}}}j.stop();return false},processKeyFrame:function(i){var j=this;if(!i.defer){j.makeToken(i,"done");j.fireEvent("keyframe",j,i)}return i.done},injectEvent:function(n,m){var l=this,k=m.type,i=Ext.apply({},m,h[k]),j;if(k==="type"){j=l._inputSpecialKeys[n.tagName];if(j){return l.injectTypeInputEvent(n,m,j)}return l.injectTypeEvent(n,m)}if(k==="focus"&&n.focus){n.focus();return true}if(k==="blur"&&n.blur){n.blur();return true}if(k==="scroll"){n.scrollLeft=m.pos[0];n.scrollTop=m.pos[1];return true}if(k==="mduclick"){return l.injectEvent(n,Ext.applyIf({type:"mousedown"},m))&&l.injectEvent(n,Ext.applyIf({type:"mouseup"},m))&&l.injectEvent(n,Ext.applyIf({type:"click"},m))}if(c[k]){return d.injectMouseEvent(n,i,l.attachTo)}if(a[k]){return d.injectKeyEvent(n,i,l.attachTo)}if(b[k]){return d.injectUIEvent(n,k,i.bubbles,i.cancelable,i.view||l.attachTo,i.detail)}return false},injectTypeEvent:function(r,k){var t=this,v=k.text,p=[],j,o,q,m,l,u,s;if(v){delete k.text;u=v.toUpperCase();for(q=0,m=v.length;q<m;++q){j=v.charCodeAt(q);o=u.charCodeAt(q);p.push(Ext.applyIf({type:"keydown",charCode:o,keyCode:o},k),Ext.applyIf({type:"keypress",charCode:j,keyCode:j},k),Ext.applyIf({type:"keyup",charCode:o,keyCode:o},k))}}else{p.push(Ext.applyIf({type:"keydown",charCode:k.keyCode},k),Ext.applyIf({type:"keyup",charCode:k.keyCode},k))}for(q=0,m=p.length;q<m;++q){t.injectEvent(r,p[q])}return true},injectTypeInputEvent:function(m,k,i){var j=this,o=k.text,l,p;if(i){l=j.getTextSelection(m);if(o){p=l[0];m.value=m.value.substring(0,p)+o+m.value.substring(l[1]);p+=o.length;j.setTextSelection(m,p,p)}else{if(!(i=i[k.keyCode])){if("caret" in k){j.setTextSelection(m,k.caret,k.caret)}else{if(k.selection){j.setTextSelection(m,k.selection[0],k.selection[1])}}return j.injectTypeEvent(m,k)}i.call(this,m,l[0],l[1]);return true}}return true},playEvent:function(i){var k=this,l=k.getElementFromXPath(i.target),j;if(!l){return false}if(!k.playEventHook(i,"beforeplay")){return false}if(!i.injected){i.injected=true;j=k.translateEvent(i,l);k.injectEvent(l,j)}return k.playEventHook(i,"afterplay")},playEventHook:function(k,j){var l=this,i=j+".done",n=j+".fired",m=k[j];if(m&&!k[i]){if(!k[n]){k[n]=true;l.makeToken(k,i);if(l.eventScope&&Ext.isString(m)){m=l.eventScope[m]}if(m){m.call(l.eventScope||l,k)}}return false}return true},schedule:function(){var i=this;if(!i.timer){i.timer=setTimeout(i.timerFn,10)}},_translateAcross:["type","button","charCode","keyCode","caret","pos","text","selection"],translateEvent:function(q,m){var o=this,j={},p=q.modKeys||"",n=o._translateAcross,l=n.length,k,r;while(l--){k=n[l];if(k in q){j[k]=q[k]}}j.altKey=p.indexOf("A")>0;j.ctrlKey=p.indexOf("C")>0;j.metaKey=p.indexOf("M")>0;j.shiftKey=p.indexOf("S")>0;if(m&&"x" in q){r=Ext.fly(m).getXY();r[0]+=q.x;r[1]+=q.y}else{if("x" in q){r=[q.x,q.y]}else{if("px" in q){r=[q.px,q.py]}}}if(r){j.clientX=j.screenX=r[0];j.clientY=j.screenY=r[1]}if(q.key){j.keyCode=o.specialKeysByName[q.key]}if(q.type==="wheel"){if("onwheel" in o.attachTo.document){j.wheelX=q.dx;j.wheelY=q.dy}else{j.type="mousewheel";j.wheelDeltaX=-40*q.dx;j.wheelDeltaY=j.wheelDelta=-40*q.dy}}return j},onStart:function(){var i=this;i.queueIndex=0;i.schedule()},onStop:function(){var i=this;if(i.timer){clearTimeout(i.timer);i.timer=null}},onTick:function(){var i=this;i.timer=null;if(i.processEvents()){i.schedule()}},statics:{ieButtonCodeMap:{0:1,1:4,2:2},injectKeyEvent:function(n,j,i){var m=j.type,l=null;if(m==="textevent"){m="keypress"}i=i||window;if(g.createEvent){try{l=g.createEvent("KeyEvents");l.initKeyEvent(m,j.bubbles,j.cancelable,i,j.ctrlKey,j.altKey,j.shiftKey,j.metaKey,j.keyCode,j.charCode)}catch(k){try{l=g.createEvent("Events")}catch(o){l=g.createEvent("UIEvents")}finally{l.initEvent(m,j.bubbles,j.cancelable);l.view=i;l.altKey=j.altKey;l.ctrlKey=j.ctrlKey;l.shiftKey=j.shiftKey;l.metaKey=j.metaKey;l.keyCode=j.keyCode;l.charCode=j.charCode}}n.dispatchEvent(l)}else{if(g.createEventObject){l=g.createEventObject();l.bubbles=j.bubbles;l.cancelable=j.cancelable;l.view=i;l.ctrlKey=j.ctrlKey;l.altKey=j.altKey;l.shiftKey=j.shiftKey;l.metaKey=j.metaKey;l.keyCode=(j.charCode>0)?j.charCode:j.keyCode;n.fireEvent("on"+m,l)}else{return false}}return true},injectMouseEvent:function(m,j,i){var l=j.type,k=null;i=i||window;if(g.createEvent){k=g.createEvent("MouseEvents");if(k.initMouseEvent){k.initMouseEvent(l,j.bubbles,j.cancelable,i,j.detail,j.screenX,j.screenY,j.clientX,j.clientY,j.ctrlKey,j.altKey,j.shiftKey,j.metaKey,j.button,j.relatedTarget)}else{k=g.createEvent("UIEvents");k.initEvent(l,j.bubbles,j.cancelable);k.view=i;k.detail=j.detail;k.screenX=j.screenX;k.screenY=j.screenY;k.clientX=j.clientX;k.clientY=j.clientY;k.ctrlKey=j.ctrlKey;k.altKey=j.altKey;k.metaKey=j.metaKey;k.shiftKey=j.shiftKey;k.button=j.button;k.relatedTarget=j.relatedTarget}if(j.relatedTarget&&!k.relatedTarget){if(l=="mouseout"){k.toElement=j.relatedTarget}else{if(l=="mouseover"){k.fromElement=j.relatedTarget}}}m.dispatchEvent(k)}else{if(g.createEventObject){k=g.createEventObject();k.bubbles=j.bubbles;k.cancelable=j.cancelable;k.view=i;k.detail=j.detail;k.screenX=j.screenX;k.screenY=j.screenY;k.clientX=j.clientX;k.clientY=j.clientY;k.ctrlKey=j.ctrlKey;k.altKey=j.altKey;k.metaKey=j.metaKey;k.shiftKey=j.shiftKey;k.button=d.ieButtonCodeMap[j.button]||0;k.relatedTarget=j.relatedTarget;m.fireEvent("on"+l,k)}else{return false}}return true},injectUIEvent:function(l,j,i){var k=null;i=i||window;if(g.createEvent){k=g.createEvent("UIEvents");k.initUIEvent(j.type,j.bubbles,j.cancelable,i,j.detail);l.dispatchEvent(k)}else{if(g.createEventObject){k=g.createEventObject();k.bubbles=j.bubbles;k.cancelable=j.cancelable;k.view=i;k.detail=j.detail;l.fireEvent("on"+j.type,k)}else{return false}}return true}}}});Ext.define("Ext.ux.event.Recorder",function(c){function a(){var f=arguments,j=f.length,h={kind:"other"},g;for(g=0;g<j;++g){Ext.apply(h,arguments[g])}if(h.alt&&!h.event){h.event=h.alt}return h}function d(f){return a({kind:"keyboard",modKeys:true,key:true},f)}function b(f){return a({kind:"mouse",button:true,modKeys:true,xy:true},f)}var e={keydown:d(),keypress:d(),keyup:d(),dragmove:b({alt:"mousemove",pageCoords:true,whileDrag:true}),mousemove:b({pageCoords:true}),mouseover:b(),mouseout:b(),click:b(),wheel:b({wheel:true}),mousedown:b({press:true}),mouseup:b({release:true}),scroll:a({listen:false}),focus:a(),blur:a()};for(var d in e){if(!e[d].event){e[d].event=d}}e.wheel.event=null;return{extend:"Ext.ux.event.Driver",eventsToRecord:e,ignoreIdRegEx:/ext-gen(?:\d+)/,inputRe:/^(input|textarea)$/i,constructor:function(f){var h=this,g=f&&f.eventsToRecord;if(g){h.eventsToRecord=Ext.apply(Ext.apply({},h.eventsToRecord),g);delete f.eventsToRecord}h.callParent(arguments);h.clear();h.modKeys=[];h.attachTo=h.attachTo||window},clear:function(){this.eventsRecorded=[]},listenToEvent:function(j){var i=this,h=i.attachTo.document.body,g=function(){return i.onEvent.apply(i,arguments)},f={};if(h.attachEvent&&h.ownerDocument.documentMode<10){j="on"+j;h.attachEvent(j,g);f.destroy=function(){if(g){h.detachEvent(j,g);g=null}}}else{h.addEventListener(j,g,true);f.destroy=function(){if(g){h.removeEventListener(j,g,true);g=null}}}return f},coalesce:function(m,k){var j=this,g=j.eventsRecorded,i=g.length,f=i&&g[i-1],l=(i>1)&&g[i-2],h=(i>2)&&g[i-3];if(!f){return false}if(m.type==="mousemove"){if(f.type==="mousemove"&&m.ts-f.ts<200){m.ts=f.ts;g[i-1]=m;return true}}else{if(m.type==="click"){if(l&&f.type==="mouseup"&&l.type==="mousedown"){if(m.button==f.button&&m.button==l.button&&m.target==f.target&&m.target==l.target&&j.samePt(m,f)&&j.samePt(m,l)){g.pop();l.type="mduclick";return true}}}else{if(m.type==="keyup"){if(l&&f.type==="keypress"&&l.type==="keydown"){if(m.target===f.target&&m.target===l.target){g.pop();l.type="type";l.text=String.fromCharCode(f.charCode);delete l.charCode;delete l.keyCode;if(h&&h.type==="type"){if(h.text&&h.target===l.target){h.text+=l.text;g.pop()}}return true}}else{if(j.completeKeyStroke(f,m)){f.type="type";j.completeSpecialKeyStroke(k.target,f,m);return true}else{if(f.type==="scroll"&&j.completeKeyStroke(l,m)){l.type="type";j.completeSpecialKeyStroke(k.target,l,m);g.pop();g.pop();g.push(f,l);return true}}}}}}return false},completeKeyStroke:function(g,f){if(g&&g.type==="keydown"&&g.keyCode===f.keyCode){delete g.charCode;return true}return false},completeSpecialKeyStroke:function(h,i,f){var g=this.specialKeysByCode[f.keyCode];if(g&&this.inputRe.test(h.tagName)){delete i.keyCode;i.key=g;i.selection=this.getTextSelection(h);if(i.selection[0]===i.selection[1]){i.caret=i.selection[0];delete i.selection}return true}return false},getElementXPath:function(j){var m=this,l=false,g=[],k,i,h,f;for(h=j;h;h=h.parentNode){if(h==m.attachTo.document.body){g.unshift("~");l=true;break}if(h.id&&!m.ignoreIdRegEx.test(h.id)){g.unshift("#"+h.id);l=true;break}for(k=1,i=h;!!(i=i.previousSibling);){if(i.tagName==h.tagName){++k}}f=h.tagName.toLowerCase();if(k<2){g.unshift(f)}else{g.unshift(f+"["+k+"]")}}return l?g.join("/"):null},getRecordedEvents:function(){return this.eventsRecorded},onEvent:function(k){var j=this,h=new Ext.event.Event(k),f=j.eventsToRecord[h.type],l,m,i,g={type:h.type,ts:j.getTimestamp(),target:j.getElementXPath(h.target)},n;if(!f||!g.target){return}l=h.target.ownerDocument;l=l.defaultView||l.parentWindow;if(l!==j.attachTo){return}if(j.eventsToRecord.scroll){j.syncScroll(h.target)}if(f.xy){n=h.getXY();if(f.pageCoords||!g.target){g.px=n[0];g.py=n[1]}else{i=Ext.fly(h.getTarget()).getXY();n[0]-=i[0];n[1]-=i[1];g.x=n[0];g.y=n[1]}}if(f.button){if("buttons" in k){g.button=k.buttons}else{g.button=k.button}if(!g.button&&f.whileDrag){return}}if(f.wheel){g.type="wheel";if(f.event==="wheel"){g.dx=k.deltaX;g.dy=k.deltaY}else{if(typeof k.wheelDeltaX==="number"){g.dx=-1/40*k.wheelDeltaX;g.dy=-1/40*k.wheelDeltaY}else{if(k.wheelDelta){g.dy=-1/40*k.wheelDelta}else{if(k.detail){g.dy=k.detail}}}}}if(f.modKeys){j.modKeys[0]=h.altKey?"A":"";j.modKeys[1]=h.ctrlKey?"C":"";j.modKeys[2]=h.metaKey?"M":"";j.modKeys[3]=h.shiftKey?"S":"";m=j.modKeys.join("");if(m){g.modKeys=m}}if(f.key){g.charCode=h.getCharCode();g.keyCode=h.getKey()}if(j.coalesce(g,h)){j.fireEvent("coalesce",j,g)}else{j.eventsRecorded.push(g);j.fireEvent("add",j,g)}},onStart:function(){var h=this,i=h.attachTo.Ext.dd.DragDropManager,f=h.attachTo.Ext.EventObjectImpl.prototype,g=[];c.prototype.eventsToRecord.wheel.event=("onwheel" in h.attachTo.document)?"wheel":"mousewheel";h.listeners=[];Ext.Object.each(h.eventsToRecord,function(j,k){if(k&&k.listen!==false){if(!k.event){k.event=j}if(k.alt&&k.alt!==j){if(!h.eventsToRecord[k.alt]){g.push(k)}}else{h.listeners.push(h.listenToEvent(k.event))}}});Ext.each(g,function(j){h.eventsToRecord[j.alt]=j;h.listeners.push(h.listenToEvent(j.alt))});h.ddmStopEvent=i.stopEvent;i.stopEvent=Ext.Function.createSequence(i.stopEvent,function(j){h.onEvent(j)});h.evStopEvent=f.stopEvent;f.stopEvent=Ext.Function.createSequence(f.stopEvent,function(){h.onEvent(this)})},onStop:function(){var f=this;Ext.destroy(f.listeners);f.listeners=null;f.attachTo.Ext.dd.DragDropManager.stopEvent=f.ddmStopEvent;f.attachTo.Ext.EventObjectImpl.prototype.stopEvent=f.evStopEvent},samePt:function(g,f){return g.x==f.x&&g.y==f.y},syncScroll:function(h){var k=this,j=k.getTimestamp(),o,n,m,l,g,i;for(var f=h;f;f=f.parentNode){o=f.$lastScrollLeft;n=f.$lastScrollTop;m=f.scrollLeft;l=f.scrollTop;g=false;if(o!==m){if(m){g=true}f.$lastScrollLeft=m}if(n!==l){if(l){g=true}f.$lastScrollTop=l}if(g){k.eventsRecorded.push(i={type:"scroll",target:k.getElementXPath(f),ts:j,pos:[m,l]});k.fireEvent("add",k,i)}if(f.tagName==="BODY"){break}}}}});Ext.define("Ext.ux.google.Api",{mixins:["Ext.mixin.Mashup"],requiredScripts:["//www.google.com/jsapi"],statics:{loadedModules:{}},onClassExtended:function(c,d,a){var e=a.onBeforeCreated,b=this;a.onBeforeCreated=function(q,j){var n=this,k=[],o=Ext.Array.from(j.requiresGoogle),m=b.loadedModules,g=0,p=function(){if(!--g){e.call(n,q,j,a)}Ext.env.Ready.unblock()},l,h,f;f=o.length;for(h=0;h<f;++h){if(Ext.isString(l=o[h])){k.push({api:l})}else{if(Ext.isObject(l)){k.push(Ext.apply({},l))}}}Ext.each(k,function(t){var r=t.api,i=String(t.version||"1.x"),s=m[r];if(!s){++g;Ext.env.Ready.block();m[r]=s=[p].concat(t.callback||[]);delete t.api;delete t.version;google.load(r,i,Ext.applyIf({callback:function(){m[r]=true;for(var u=s.length;u-->0;){s[u]()}}},t))}else{if(s!==true){s.push(p)}}});if(!g){e.call(n,q,j,a)}}}});Ext.define("Ext.ux.google.Feeds",{extend:"Ext.ux.google.Api",requiresGoogle:{api:"feeds",nocss:true}});