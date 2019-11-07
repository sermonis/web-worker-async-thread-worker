
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.AsyncThreadWorker = {})));
}(this, (function (exports) { 'use strict';
    var AsyncThreadWorker=function(n){var t={};function o(e){if(t[e])return t[e].exports;var r=t[e]={i:e,l:!1,exports:{}};return n[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=n,o.c=t,o.d=function(e,r,n){o.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(r,e){if(1&e&&(r=o(r)),8&e)return r;if(4&e&&"object"==typeof r&&r&&r.__esModule)return r;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:r}),2&e&&"string"!=typeof r)for(var t in r)o.d(n,t,function(e){return r[e]}.bind(null,t));return n},o.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(r,"a",r),r},o.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},o.p="",o(o.s=0)}([function(e,r,n){"use strict";function t(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function o(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function s(e,r,n){return r&&o(e.prototype,r),n&&o(e,n),e}n.r(r),n.d(r,"ThreadWorker",function(){return a}),n.d(r,"Thread",function(){return i});var a=function(){function n(e){var r=this;t(this,n),(this._worker=e).onmessage=function(e){return r.onMessage(e)}}return s(n,[{key:"onMessage",value:function(e){var r=e.data,n=r.id,t=r.data;this.onRequest(n,t)}},{key:"onRequest",value:function(e,r){}},{key:"_sendResponse",value:function(e,r,n){var t=2<arguments.length&&void 0!==n?n:{},o={transferables:void 0,error:void 0},s=Object.assign({},o,t),a=s.error;this._worker.postMessage({id:e,result:{data:r,error:a}},s.transferables?s.transferables:void 0)}},{key:"sendResponse",value:function(e,r,n){var t=1<arguments.length&&void 0!==r?r:void 0,o=2<arguments.length&&void 0!==n?n:void 0;this._sendResponse(e,t,{transferables:o})}},{key:"sendError",value:function(e,r){this._sendResponse(e,void 0,{error:r})}}]),n}(),i=function(){function n(e){var l=this;t(this,n);var r=new Worker(e);this._worker=r,this._rrRequest={},r.onmessage=function(e){if(e.data.debug)console.log("debug:",e.data.debug);else{var r=e.data,n=r.id,t=r.result;console.log("result for id:",n);var o=t.data,s=t.error;if(n in l._rrRequest){var a=l._rrRequest[n],i=a.res,u=a.rej;delete l._rrRequest[n],s?u(s):i(o)}else console.log("nop; invalid request id:",n)}}}return s(n,[{key:"_sendRequest",value:function(t,e){var o=this,r=1<arguments.length&&void 0!==e?e:{},n={transferables:void 0},s=Object.assign({},n,r);return new Promise(function(e,r){for(var n;(n="req-id-".concat(Math.random()))in o._rrRequest;);console.log("sendRequest(): id:",n),o._rrRequest[n]={res:e,rej:r},o._worker.postMessage({id:n,data:t},s.transferables?s.transferables:void 0)})}},{key:"sendRequest",value:function(e,r){var n=0<arguments.length&&void 0!==e?e:void 0,t=1<arguments.length&&void 0!==r?r:void 0;return this._sendRequest(n,{transferables:t})}},{key:"getWorker",value:function(){return this._worker}},{key:"terminate",value:function(){this._worker.terminate(),this._worker=null}}]),n}()}]).default;
    exports.default = AsyncThreadWorker;
    Object.defineProperty(exports, '__esModule', { value: true });
})));