/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.2.0 - 2016-10-10
 * License: MIT
 */angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.modal","ui.bootstrap.stackedMap","ui.bootstrap.position"]),angular.module("ui.bootstrap.tpls",["uib/template/modal/window.html"]),angular.module("ui.bootstrap.modal",["ui.bootstrap.stackedMap","ui.bootstrap.position"]).factory("$$multiMap",function(){return{createNew:function(){var t={};return{entries:function(){return Object.keys(t).map(function(e){return{key:e,value:t[e]}})},get:function(e){return t[e]},hasKey:function(e){return!!t[e]},keys:function(){return Object.keys(t)},put:function(e,o){t[e]||(t[e]=[]),t[e].push(o)},remove:function(e,o){var n=t[e];if(n){var r=n.indexOf(o);-1!==r&&n.splice(r,1),n.length||delete t[e]}}}}}}).provider("$uibResolve",function(){var t=this;this.resolver=null,this.setResolver=function(t){this.resolver=t},this.$get=["$injector","$q",function(e,o){var n=t.resolver?e.get(t.resolver):null;return{resolve:function(t,r,i,a){if(n)return n.resolve(t,r,i,a);var l=[];return angular.forEach(t,function(t){l.push(angular.isFunction(t)||angular.isArray(t)?o.resolve(e.invoke(t)):angular.isString(t)?o.resolve(e.get(t)):o.resolve(t))}),o.all(l).then(function(e){var o={},n=0;return angular.forEach(t,function(t,r){o[r]=e[n++]}),o})}}}]}).directive("uibModalBackdrop",["$animate","$injector","$uibModalStack",function(t,e,o){function n(e,n,r){r.modalInClass&&(t.addClass(n,r.modalInClass),e.$on(o.NOW_CLOSING_EVENT,function(o,i){var a=i();e.modalOptions.animation?t.removeClass(n,r.modalInClass).then(a):a()}))}return{restrict:"A",compile:function(t,e){return t.addClass(e.backdropClass),n}}}]).directive("uibModalWindow",["$uibModalStack","$q","$animateCss","$document",function(t,e,o,n){return{scope:{index:"@"},restrict:"A",transclude:!0,templateUrl:function(t,e){return e.templateUrl||"uib/template/modal/window.html"},link:function(r,i,a){i.addClass(a.windowTopClass||""),r.size=a.size,r.close=function(e){var o=t.getTop();o&&o.value.backdrop&&"static"!==o.value.backdrop&&e.target===e.currentTarget&&(e.preventDefault(),e.stopPropagation(),t.dismiss(o.key,"backdrop click"))},i.on("click",r.close),r.$isRendered=!0;var l=e.defer();r.$$postDigest(function(){l.resolve()}),l.promise.then(function(){var l=null;a.modalInClass&&(l=o(i,{addClass:a.modalInClass}).start(),r.$on(t.NOW_CLOSING_EVENT,function(t,e){var n=e();o(i,{removeClass:a.modalInClass}).start().then(n)})),e.when(l).then(function(){var e=t.getTop();if(e&&t.modalRendered(e.key),!n[0].activeElement||!i[0].contains(n[0].activeElement)){var o=i[0].querySelector("[autofocus]");o?o.focus():i[0].focus()}})})}}}]).directive("uibModalAnimationClass",function(){return{compile:function(t,e){e.modalAnimation&&t.addClass(e.uibModalAnimationClass)}}}).directive("uibModalTransclude",["$animate",function(t){return{link:function(e,o,n,r,i){i(e.$parent,function(e){o.empty(),t.enter(e,o)})}}}]).factory("$uibModalStack",["$animate","$animateCss","$document","$compile","$rootScope","$q","$$multiMap","$$stackedMap","$uibPosition",function(t,e,o,n,r,i,a,l,s){function d(t){var e="-";return t.replace(D,function(t,o){return(o?e:"")+t.toLowerCase()})}function u(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)}function c(){for(var t=-1,e=C.keys(),o=0;o<e.length;o++)C.get(e[o]).value.backdrop&&(t=o);return t>-1&&M>t&&(t=M),t}function p(t,e){var o=C.get(t).value,n=o.appendTo;C.remove(t),T=C.top(),T&&(M=parseInt(T.value.modalDomEl.attr("index"),10)),h(o.modalDomEl,o.modalScope,function(){var e=o.openedClass||k;E.remove(e,t);var r=E.hasKey(e);n.toggleClass(e,r),!r&&y&&y.heightOverflow&&y.scrollbarWidth&&(n.css(y.originalRight?{paddingRight:y.originalRight+"px"}:{paddingRight:""}),y=null),f(!0)},o.closedDeferred),m(),e&&e.focus?e.focus():n.focus&&n.focus()}function f(t){var e;C.length()>0&&(e=C.top().value,e.modalDomEl.toggleClass(e.windowTopClass||"",t))}function m(){if(w&&-1===c()){var t=$;h(w,$,function(){t=null}),w=void 0,$=void 0}}function h(e,o,n,r){function a(){a.done||(a.done=!0,t.leave(e).then(function(){n&&n(),e.remove(),r&&r.resolve()}),o.$destroy())}var l,s=null,d=function(){return l||(l=i.defer(),s=l.promise),function(){l.resolve()}};return o.$broadcast(S.NOW_CLOSING_EVENT,d),i.when(s).then(a)}function g(t){if(t.isDefaultPrevented())return t;var e=C.top();if(e)switch(t.which){case 27:e.value.keyboard&&(t.preventDefault(),r.$apply(function(){S.dismiss(e.key,"escape key press")}));break;case 9:var o=S.loadFocusElementList(e),n=!1;t.shiftKey?(S.isFocusInFirstItem(t,o)||S.isModalFocused(t,e))&&(n=S.focusLastFocusableElement(o)):S.isFocusInLastItem(t,o)&&(n=S.focusFirstFocusableElement(o)),n&&(t.preventDefault(),t.stopPropagation())}}function v(t,e,o){return!t.value.modalScope.$broadcast("modal.closing",e,o).defaultPrevented}function b(){Array.prototype.forEach.call(document.querySelectorAll("["+x+"]"),function(t){var e=parseInt(t.getAttribute(x),10),o=e-1;t.setAttribute(x,o),o||(t.removeAttribute(x),t.removeAttribute("aria-hidden"))})}var w,$,y,k="modal-open",C=l.createNew(),E=a.createNew(),S={NOW_CLOSING_EVENT:"modal.stack.now-closing"},M=0,T=null,x="data-bootstrap-modal-aria-hidden-count",N="a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]",D=/[A-Z]/g;return r.$watch(c,function(t){$&&($.index=t)}),o.on("keydown",g),r.$on("$destroy",function(){o.off("keydown",g)}),S.open=function(e,i){function a(t){function e(t){var e=t.parent()?t.parent().children():[];return Array.prototype.filter.call(e,function(e){return e!==t[0]})}if(t&&"BODY"!==t[0].tagName)return e(t).forEach(function(t){var e="true"===t.getAttribute("aria-hidden"),o=parseInt(t.getAttribute(x),10);o||(o=e?1:0),t.setAttribute(x,o+1),t.setAttribute("aria-hidden","true")}),a(t.parent())}var l=o[0].activeElement,u=i.openedClass||k;f(!1),T=C.top(),C.add(e,{deferred:i.deferred,renderDeferred:i.renderDeferred,closedDeferred:i.closedDeferred,modalScope:i.scope,backdrop:i.backdrop,keyboard:i.keyboard,openedClass:i.openedClass,windowTopClass:i.windowTopClass,animation:i.animation,appendTo:i.appendTo}),E.put(u,e);var p=i.appendTo,m=c();if(!p.length)throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");m>=0&&!w&&($=r.$new(!0),$.modalOptions=i,$.index=m,w=angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'),w.attr({"class":"modal-backdrop","ng-style":"{'z-index': 1040 + (index && 1 || 0) + index*10}","uib-modal-animation-class":"fade","modal-in-class":"in"}),i.backdropClass&&w.addClass(i.backdropClass),i.animation&&w.attr("modal-animation","true"),n(w)($),t.enter(w,p),s.isScrollable(p)&&(y=s.scrollbarPadding(p),y.heightOverflow&&y.scrollbarWidth&&p.css({paddingRight:y.right+"px"})));var h;i.component?(h=document.createElement(d(i.component.name)),h=angular.element(h),h.attr({resolve:"$resolve","modal-instance":"$uibModalInstance",close:"$close($value)",dismiss:"$dismiss($value)"})):h=i.content,M=T?parseInt(T.value.modalDomEl.attr("index"),10)+1:0;var g=angular.element('<div uib-modal-window="modal-window"></div>');g.attr({"class":"modal","template-url":i.windowTemplateUrl,"window-top-class":i.windowTopClass,role:"dialog","aria-labelledby":i.ariaLabelledBy,"aria-describedby":i.ariaDescribedBy,size:i.size,index:M,animate:"animate","ng-style":"{'z-index': 1050 + $$topModalIndex*10, display: 'block'}",tabindex:-1,"uib-modal-animation-class":"fade","modal-in-class":"in"}).append(h),i.windowClass&&g.addClass(i.windowClass),i.animation&&g.attr("modal-animation","true"),p.addClass(u),i.scope&&(i.scope.$$topModalIndex=M),t.enter(n(g)(i.scope),p),C.top().value.modalDomEl=g,C.top().value.modalOpener=l,a(g)},S.close=function(t,e){var o=C.get(t);return b(),o&&v(o,e,!0)?(o.value.modalScope.$$uibDestructionScheduled=!0,o.value.deferred.resolve(e),p(t,o.value.modalOpener),!0):!o},S.dismiss=function(t,e){var o=C.get(t);return b(),o&&v(o,e,!1)?(o.value.modalScope.$$uibDestructionScheduled=!0,o.value.deferred.reject(e),p(t,o.value.modalOpener),!0):!o},S.dismissAll=function(t){for(var e=this.getTop();e&&this.dismiss(e.key,t);)e=this.getTop()},S.getTop=function(){return C.top()},S.modalRendered=function(t){var e=C.get(t);S.focusFirstFocusableElement(S.loadFocusElementList(e)),e&&e.value.renderDeferred.resolve()},S.focusFirstFocusableElement=function(t){return t.length>0?(t[0].focus(),!0):!1},S.focusLastFocusableElement=function(t){return t.length>0?(t[t.length-1].focus(),!0):!1},S.isModalFocused=function(t,e){if(t&&e){var o=e.value.modalDomEl;if(o&&o.length)return(t.target||t.srcElement)===o[0]}return!1},S.isFocusInFirstItem=function(t,e){return e.length>0?(t.target||t.srcElement)===e[0]:!1},S.isFocusInLastItem=function(t,e){return e.length>0?(t.target||t.srcElement)===e[e.length-1]:!1},S.loadFocusElementList=function(t){if(t){var e=t.value.modalDomEl;if(e&&e.length){var o=e[0].querySelectorAll(N);return o?Array.prototype.filter.call(o,function(t){return u(t)}):o}}},S}]).provider("$uibModal",function(){var t={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$rootScope","$q","$document","$templateRequest","$controller","$uibResolve","$uibModalStack",function(e,o,n,r,i,a,l){function s(t){return t.template?o.when(t.template):r(angular.isFunction(t.templateUrl)?t.templateUrl():t.templateUrl)}var d={},u=null;return d.getPromiseChain=function(){return u},d.open=function(r){function d(){return g}var c=o.defer(),p=o.defer(),f=o.defer(),m=o.defer(),h={result:c.promise,opened:p.promise,closed:f.promise,rendered:m.promise,close:function(t){return l.close(h,t)},dismiss:function(t){return l.dismiss(h,t)}};if(r=angular.extend({},t.options,r),r.resolve=r.resolve||{},r.appendTo=r.appendTo||n.find("body").eq(0),!r.component&&!r.template&&!r.templateUrl)throw new Error("One of component or template or templateUrl options is required.");var g;g=r.component?o.when(a.resolve(r.resolve,{},null,null)):o.all([s(r),a.resolve(r.resolve,{},null,null)]);var v;return v=u=o.all([u]).then(d,d).then(function(t){function o(e,o,n,r){e.$scope=a,e.$scope.$resolve={},n?e.$scope.$uibModalInstance=h:e.$uibModalInstance=h;var i=o?t[1]:t;angular.forEach(i,function(t,o){r&&(e[o]=t),e.$scope.$resolve[o]=t})}var n=r.scope||e,a=n.$new();a.$close=h.close,a.$dismiss=h.dismiss,a.$on("$destroy",function(){a.$$uibDestructionScheduled||a.$dismiss("$uibUnscheduledDestruction")});var s,d,u={scope:a,deferred:c,renderDeferred:m,closedDeferred:f,animation:r.animation,backdrop:r.backdrop,keyboard:r.keyboard,backdropClass:r.backdropClass,windowTopClass:r.windowTopClass,windowClass:r.windowClass,windowTemplateUrl:r.windowTemplateUrl,ariaLabelledBy:r.ariaLabelledBy,ariaDescribedBy:r.ariaDescribedBy,size:r.size,openedClass:r.openedClass,appendTo:r.appendTo},g={},v={};r.component?(o(g,!1,!0,!1),g.name=r.component,u.component=g):r.controller&&(o(v,!0,!1,!0),d=i(r.controller,v,!0,r.controllerAs),r.controllerAs&&r.bindToController&&(s=d.instance,s.$close=a.$close,s.$dismiss=a.$dismiss,angular.extend(s,{$resolve:v.$scope.$resolve},n)),s=d(),angular.isFunction(s.$onInit)&&s.$onInit()),r.component||(u.content=t[0]),l.open(h,u),p.resolve(!0)},function(t){p.reject(t),c.reject(t)})["finally"](function(){u===v&&(u=null)}),h},d}]};return t}),angular.module("ui.bootstrap.stackedMap",[]).factory("$$stackedMap",function(){return{createNew:function(){var t=[];return{add:function(e,o){t.push({key:e,value:o})},get:function(e){for(var o=0;o<t.length;o++)if(e===t[o].key)return t[o]},keys:function(){for(var e=[],o=0;o<t.length;o++)e.push(t[o].key);return e},top:function(){return t[t.length-1]},remove:function(e){for(var o=-1,n=0;n<t.length;n++)if(e===t[n].key){o=n;break}return t.splice(o,1)[0]},removeTop:function(){return t.pop()},length:function(){return t.length}}}}}),angular.module("ui.bootstrap.position",[]).factory("$uibPosition",["$document","$window",function(t,e){var o,n,r={normal:/(auto|scroll)/,hidden:/(auto|scroll|hidden)/},i={auto:/\s?auto?\s?/i,primary:/^(top|bottom|left|right)$/,secondary:/^(top|bottom|left|right|center)$/,vertical:/^(top|bottom)$/},a=/(HTML|BODY)/;return{getRawNode:function(t){return t.nodeName?t:t[0]||t},parseStyle:function(t){return t=parseFloat(t),isFinite(t)?t:0},offsetParent:function(o){function n(t){return"static"===(e.getComputedStyle(t).position||"static")}o=this.getRawNode(o);for(var r=o.offsetParent||t[0].documentElement;r&&r!==t[0].documentElement&&n(r);)r=r.offsetParent;return r||t[0].documentElement},scrollbarWidth:function(r){if(r){if(angular.isUndefined(n)){var i=t.find("body");i.addClass("uib-position-body-scrollbar-measure"),n=e.innerWidth-i[0].clientWidth,n=isFinite(n)?n:0,i.removeClass("uib-position-body-scrollbar-measure")}return n}if(angular.isUndefined(o)){var a=angular.element('<div class="uib-position-scrollbar-measure"></div>');t.find("body").append(a),o=a[0].offsetWidth-a[0].clientWidth,o=isFinite(o)?o:0,a.remove()}return o},scrollbarPadding:function(t){t=this.getRawNode(t);var o=e.getComputedStyle(t),n=this.parseStyle(o.paddingRight),r=this.parseStyle(o.paddingBottom),i=this.scrollParent(t,!1,!0),l=this.scrollbarWidth(a.test(i.tagName));return{scrollbarWidth:l,widthOverflow:i.scrollWidth>i.clientWidth,right:n+l,originalRight:n,heightOverflow:i.scrollHeight>i.clientHeight,bottom:r+l,originalBottom:r}},isScrollable:function(t,o){t=this.getRawNode(t);var n=o?r.hidden:r.normal,i=e.getComputedStyle(t);return n.test(i.overflow+i.overflowY+i.overflowX)},scrollParent:function(o,n,i){o=this.getRawNode(o);var a=n?r.hidden:r.normal,l=t[0].documentElement,s=e.getComputedStyle(o);if(i&&a.test(s.overflow+s.overflowY+s.overflowX))return o;var d="absolute"===s.position,u=o.parentElement||l;if(u===l||"fixed"===s.position)return l;for(;u.parentElement&&u!==l;){var c=e.getComputedStyle(u);if(d&&"static"!==c.position&&(d=!1),!d&&a.test(c.overflow+c.overflowY+c.overflowX))break;u=u.parentElement}return u},position:function(o,n){o=this.getRawNode(o);var r=this.offset(o);if(n){var i=e.getComputedStyle(o);r.top-=this.parseStyle(i.marginTop),r.left-=this.parseStyle(i.marginLeft)}var a=this.offsetParent(o),l={top:0,left:0};return a!==t[0].documentElement&&(l=this.offset(a),l.top+=a.clientTop-a.scrollTop,l.left+=a.clientLeft-a.scrollLeft),{width:Math.round(angular.isNumber(r.width)?r.width:o.offsetWidth),height:Math.round(angular.isNumber(r.height)?r.height:o.offsetHeight),top:Math.round(r.top-l.top),left:Math.round(r.left-l.left)}},offset:function(o){o=this.getRawNode(o);var n=o.getBoundingClientRect();return{width:Math.round(angular.isNumber(n.width)?n.width:o.offsetWidth),height:Math.round(angular.isNumber(n.height)?n.height:o.offsetHeight),top:Math.round(n.top+(e.pageYOffset||t[0].documentElement.scrollTop)),left:Math.round(n.left+(e.pageXOffset||t[0].documentElement.scrollLeft))}},viewportOffset:function(o,n,r){o=this.getRawNode(o),r=r!==!1?!0:!1;var i=o.getBoundingClientRect(),a={top:0,left:0,bottom:0,right:0},l=n?t[0].documentElement:this.scrollParent(o),s=l.getBoundingClientRect();if(a.top=s.top+l.clientTop,a.left=s.left+l.clientLeft,l===t[0].documentElement&&(a.top+=e.pageYOffset,a.left+=e.pageXOffset),a.bottom=a.top+l.clientHeight,a.right=a.left+l.clientWidth,r){var d=e.getComputedStyle(l);a.top+=this.parseStyle(d.paddingTop),a.bottom-=this.parseStyle(d.paddingBottom),a.left+=this.parseStyle(d.paddingLeft),a.right-=this.parseStyle(d.paddingRight)}return{top:Math.round(i.top-a.top),bottom:Math.round(a.bottom-i.bottom),left:Math.round(i.left-a.left),right:Math.round(a.right-i.right)}},parsePlacement:function(t){var e=i.auto.test(t);return e&&(t=t.replace(i.auto,"")),t=t.split("-"),t[0]=t[0]||"top",i.primary.test(t[0])||(t[0]="top"),t[1]=t[1]||"center",i.secondary.test(t[1])||(t[1]="center"),t[2]=e?!0:!1,t},positionElements:function(t,o,n,r){t=this.getRawNode(t),o=this.getRawNode(o);var a=angular.isDefined(o.offsetWidth)?o.offsetWidth:o.prop("offsetWidth"),l=angular.isDefined(o.offsetHeight)?o.offsetHeight:o.prop("offsetHeight");n=this.parsePlacement(n);var s=r?this.offset(t):this.position(t),d={top:0,left:0,placement:""};if(n[2]){var u=this.viewportOffset(t,r),c=e.getComputedStyle(o),p={width:a+Math.round(Math.abs(this.parseStyle(c.marginLeft)+this.parseStyle(c.marginRight))),height:l+Math.round(Math.abs(this.parseStyle(c.marginTop)+this.parseStyle(c.marginBottom)))};if(n[0]="top"===n[0]&&p.height>u.top&&p.height<=u.bottom?"bottom":"bottom"===n[0]&&p.height>u.bottom&&p.height<=u.top?"top":"left"===n[0]&&p.width>u.left&&p.width<=u.right?"right":"right"===n[0]&&p.width>u.right&&p.width<=u.left?"left":n[0],n[1]="top"===n[1]&&p.height-s.height>u.bottom&&p.height-s.height<=u.top?"bottom":"bottom"===n[1]&&p.height-s.height>u.top&&p.height-s.height<=u.bottom?"top":"left"===n[1]&&p.width-s.width>u.right&&p.width-s.width<=u.left?"right":"right"===n[1]&&p.width-s.width>u.left&&p.width-s.width<=u.right?"left":n[1],"center"===n[1])if(i.vertical.test(n[0])){var f=s.width/2-a/2;u.left+f<0&&p.width-s.width<=u.right?n[1]="left":u.right+f<0&&p.width-s.width<=u.left&&(n[1]="right")}else{var m=s.height/2-p.height/2;u.top+m<0&&p.height-s.height<=u.bottom?n[1]="top":u.bottom+m<0&&p.height-s.height<=u.top&&(n[1]="bottom")}}switch(n[0]){case"top":d.top=s.top-l;break;case"bottom":d.top=s.top+s.height;break;case"left":d.left=s.left-a;break;case"right":d.left=s.left+s.width}switch(n[1]){case"top":d.top=s.top;break;case"bottom":d.top=s.top+s.height-l;break;case"left":d.left=s.left;break;case"right":d.left=s.left+s.width-a;break;case"center":i.vertical.test(n[0])?d.left=s.left+s.width/2-a/2:d.top=s.top+s.height/2-l/2}return d.top=Math.round(d.top),d.left=Math.round(d.left),d.placement="center"===n[1]?n[0]:n[0]+"-"+n[1],d},adjustTop:function(t,e,o,n){return-1!==t.indexOf("top")&&o!==n?{top:e.top-n+"px"}:void 0},positionArrow:function(t,o){t=this.getRawNode(t);var n=t.querySelector(".tooltip-inner, .popover-inner");if(n){var r=angular.element(n).hasClass("tooltip-inner"),a=t.querySelector(r?".tooltip-arrow":".arrow");if(a){var l={top:"",bottom:"",left:"",right:""};if(o=this.parsePlacement(o),"center"===o[1])return void angular.element(a).css(l);var s="border-"+o[0]+"-width",d=e.getComputedStyle(a)[s],u="border-";u+=i.vertical.test(o[0])?o[0]+"-"+o[1]:o[1]+"-"+o[0],u+="-radius";var c=e.getComputedStyle(r?n:t)[u];switch(o[0]){case"top":l.bottom=r?"0":"-"+d;break;case"bottom":l.top=r?"0":"-"+d;break;case"left":l.right=r?"0":"-"+d;break;case"right":l.left=r?"0":"-"+d}l[o[1]]=c,angular.element(a).css(l)}}}}}]),angular.module("uib/template/modal/window.html",[]).run(["$templateCache",function(t){t.put("uib/template/modal/window.html","<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n")}]),angular.module("ui.bootstrap.position").run(function(){!angular.$$csp().noInlineStyle&&!angular.$$uibPositionCss&&angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'),angular.$$uibPositionCss=!0});