var app=function(){"use strict";function t(){}function e(t,e){for(const o in e)t[o]=e[o];return t}function o(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(o)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let a,l;function c(t,e){return a||(a=document.createElement("a")),a.href=e,t===a.href}function u(t,e,o,n){if(t){const s=f(t,e,o,n);return t[0](s)}}function f(t,o,n,s){return t[1]&&s?e(n.ctx.slice(),t[1](s(o))):n.ctx}function h(t,e,o,n){if(t[2]&&n){const s=t[2](n(o));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],o=Math.max(e.dirty.length,s.length);for(let n=0;n<o;n+=1)t[n]=e.dirty[n]|s[n];return t}return e.dirty|s}return e.dirty}function p(t,e,o,n,s,r){if(s){const i=f(e,o,n,r);t.p(i,s)}}function d(t){if(t.ctx.length>32){const e=[],o=t.ctx.length/32;for(let t=0;t<o;t++)e[t]=-1;return e}return-1}function g(t){const e={};for(const o in t)"$"!==o[0]&&(e[o]=t[o]);return e}function m(t,e){const o={};e=new Set(e);for(const n in t)e.has(n)||"$"===n[0]||(o[n]=t[n]);return o}function b(t){return null==t?"":t}function y(t,e){t.appendChild(e)}function $(t,e,o){t.insertBefore(e,o||null)}function w(t){t.parentNode.removeChild(t)}function _(t,e){for(let o=0;o<t.length;o+=1)t[o]&&t[o].d(e)}function v(t){return document.createElement(t)}function x(t){return document.createTextNode(t)}function C(){return x(" ")}function T(){return x("")}function k(t,e,o,n){return t.addEventListener(e,o,n),()=>t.removeEventListener(e,o,n)}function R(t,e,o){null==o?t.removeAttribute(e):t.getAttribute(e)!==o&&t.setAttribute(e,o)}function q(t,e){const o=Object.getOwnPropertyDescriptors(t.__proto__);for(const n in e)null==e[n]?t.removeAttribute(n):"style"===n?t.style.cssText=e[n]:"__value"===n?t.value=t[n]=e[n]:o[n]&&o[n].set?t[n]=e[n]:R(t,n,e[n])}function E(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function S(t,e){t.value=null==e?"":e}function U(t,e,o,n){null===o?t.style.removeProperty(e):t.style.setProperty(e,o,n?"important":"")}function j(t){l=t}const B=[],N=[],A=[],P=[],D=Promise.resolve();let I=!1;function z(t){A.push(t)}const F=new Set;let L=0;function O(){const t=l;do{for(;L<B.length;){const t=B[L];L++,j(t),W(t.$$)}for(j(null),B.length=0,L=0;N.length;)N.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];F.has(e)||(F.add(e),e())}A.length=0}while(B.length);for(;P.length;)P.pop()();I=!1,F.clear(),j(t)}function W(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}const H=new Set;function M(t,e){t&&t.i&&(H.delete(t),t.i(e))}function V(t,e,o,n){if(t&&t.o){if(H.has(t))return;H.add(t),undefined.c.push((()=>{H.delete(t),n&&(o&&t.d(1),n())})),t.o(e)}}function J(t,e){const o={},n={},s={$$scope:1};let r=t.length;for(;r--;){const i=t[r],a=e[r];if(a){for(const t in i)t in a||(n[t]=1);for(const t in a)s[t]||(o[t]=a[t],s[t]=1);t[r]=a}else for(const t in i)s[t]=1}for(const t in n)t in o||(o[t]=void 0);return o}function G(t){t&&t.c()}function Y(t,e,n,i){const{fragment:a,on_mount:l,on_destroy:c,after_update:u}=t.$$;a&&a.m(e,n),i||z((()=>{const e=l.map(o).filter(r);c?c.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(z)}function K(t,e){const o=t.$$;null!==o.fragment&&(s(o.on_destroy),o.fragment&&o.fragment.d(e),o.on_destroy=o.fragment=null,o.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(B.push(t),I||(I=!0,D.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function X(e,o,r,i,a,c,u,f=[-1]){const h=l;j(e);const p=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(h?h.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:o.target||h.$$.root};u&&u(p.root);let d=!1;if(p.ctx=r?r(e,o.props||{},((t,o,...n)=>{const s=n.length?n[0]:o;return p.ctx&&a(p.ctx[t],p.ctx[t]=s)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](s),d&&Q(e,t)),o})):[],p.update(),d=!0,s(p.before_update),p.fragment=!!i&&i(p.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);p.fragment&&p.fragment.l(t),t.forEach(w)}else p.fragment&&p.fragment.c();o.intro&&M(e.$$.fragment),Y(e,o.target,o.anchor,o.customElement),O()}j(h)}class Z{$destroy(){K(this,1),this.$destroy=t}$on(t,e){const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function tt(t,e,o){return!0===o||""===o?t?"col":`col-${e}`:"auto"===o?t?"col-auto":`col-${e}-auto`:t?`col-${o}`:`col-${e}-${o}`}function et(t){let e="";if("string"==typeof t||"number"==typeof t)e+=t;else if("object"==typeof t)if(Array.isArray(t))e=t.map(et).filter(Boolean).join(" ");else for(let o in t)t[o]&&(e&&(e+=" "),e+=o);return e}function ot(t){let o,n,s;const r=t[10].default,i=u(r,t,t[9],null);let a=[t[1],{class:n=t[0].join(" ")}],l={};for(let t=0;t<a.length;t+=1)l=e(l,a[t]);return{c(){o=v("div"),i&&i.c(),q(o,l)},m(t,e){$(t,o,e),i&&i.m(o,null),s=!0},p(t,[e]){i&&i.p&&(!s||512&e)&&p(i,r,t,t[9],s?h(r,t[9],e,null):d(t[9]),null),q(o,l=J(a,[2&e&&t[1],{class:n}]))},i(t){s||(M(i,t),s=!0)},o(t){V(i,t),s=!1},d(t){t&&w(o),i&&i.d(t)}}}function nt(t,o,n){const s=["class","xs","sm","md","lg","xl","xxl"];let r=m(o,s),{$$slots:i={},$$scope:a}=o,{class:l=""}=o,{xs:c}=o,{sm:u}=o,{md:f}=o,{lg:h}=o,{xl:p}=o,{xxl:d}=o;const b=[],y={xs:c,sm:u,md:f,lg:h,xl:p,xxl:d};return Object.keys(y).forEach((t=>{const e=y[t];if(!e&&""!==e)return;const o="xs"===t;if(function(t){const e=typeof t;return null!=t&&("object"==e||"function"==e)}(e)){const n=o?"-":`-${t}-`,s=tt(o,t,e.size);(e.size||""===e.size)&&b.push(s),e.push&&b.push(`push${n}${e.push}`),e.pull&&b.push(`pull${n}${e.pull}`),e.offset&&b.push(`offset${n}${e.offset}`),e.order&&b.push(`order${n}${e.order}`)}else b.push(tt(o,t,e))})),b.length||b.push("col"),l&&b.push(l),t.$$set=t=>{o=e(e({},o),g(t)),n(1,r=m(o,s)),"class"in t&&n(2,l=t.class),"xs"in t&&n(3,c=t.xs),"sm"in t&&n(4,u=t.sm),"md"in t&&n(5,f=t.md),"lg"in t&&n(6,h=t.lg),"xl"in t&&n(7,p=t.xl),"xxl"in t&&n(8,d=t.xxl),"$$scope"in t&&n(9,a=t.$$scope)},[b,r,l,c,u,f,h,p,d,a,i]}class st extends Z{constructor(t){super(),X(this,t,nt,ot,i,{class:2,xs:3,sm:4,md:5,lg:6,xl:7,xxl:8})}}function rt(t){let o,n;const s=t[8].default,r=u(s,t,t[7],null);let i=[t[2],{class:t[1]}],a={};for(let t=0;t<i.length;t+=1)a=e(a,i[t]);return{c(){o=v("div"),r&&r.c(),q(o,a)},m(e,s){$(e,o,s),r&&r.m(o,null),t[9](o),n=!0},p(t,[e]){r&&r.p&&(!n||128&e)&&p(r,s,t,t[7],n?h(s,t[7],e,null):d(t[7]),null),q(o,a=J(i,[4&e&&t[2],(!n||2&e)&&{class:t[1]}]))},i(t){n||(M(r,t),n=!0)},o(t){V(r,t),n=!1},d(e){e&&w(o),r&&r.d(e),t[9](null)}}}function it(t,o,n){let s;const r=["class","noGutters","form","cols","inner"];let i=m(o,r),{$$slots:a={},$$scope:l}=o,{class:c=""}=o,{noGutters:u=!1}=o,{form:f=!1}=o,{cols:h=0}=o,{inner:p}=o;return t.$$set=t=>{o=e(e({},o),g(t)),n(2,i=m(o,r)),"class"in t&&n(3,c=t.class),"noGutters"in t&&n(4,u=t.noGutters),"form"in t&&n(5,f=t.form),"cols"in t&&n(6,h=t.cols),"inner"in t&&n(0,p=t.inner),"$$scope"in t&&n(7,l=t.$$scope)},t.$$.update=()=>{120&t.$$.dirty&&n(1,s=function(...t){return t.map(et).filter(Boolean).join(" ")}(c,u?"gx-0":null,f?"form-row":"row",...function(t){const e=parseInt(t);if(isNaN(e)){if("object"==typeof t)return["xs","sm","md","lg","xl"].map((e=>{const o="xs"===e?"-":`-${e}-`,n=t[e];return"number"==typeof n&&n>0?`row-cols${o}${n}`:null})).filter((t=>!!t))}else if(e>0)return[`row-cols-${e}`];return[]}(h)))},[p,s,i,c,u,f,h,l,a,function(t){N[t?"unshift":"push"]((()=>{p=t,n(0,p)}))}]}class at extends Z{constructor(t){super(),X(this,t,it,rt,i,{class:3,noGutters:4,form:5,cols:6,inner:0})}}class lt extends Error{constructor(t,e,o){const n=`${t.status||0===t.status?t.status:""} ${t.statusText||""}`.trim();super(`Request failed with ${n?`status code ${n}`:"an unknown error"}`),this.name="HTTPError",this.response=t,this.request=e,this.options=o}}class ct extends Error{constructor(t){super("Request timed out"),this.name="TimeoutError",this.request=t}}const ut=t=>null!==t&&"object"==typeof t,ft=(...t)=>{for(const e of t)if((!ut(e)||Array.isArray(e))&&void 0!==e)throw new TypeError("The `options` argument must be an object");return pt({},...t)},ht=(t={},e={})=>{const o=new globalThis.Headers(t),n=e instanceof globalThis.Headers,s=new globalThis.Headers(e);for(const[t,e]of s.entries())n&&"undefined"===e||void 0===e?o.delete(t):o.set(t,e);return o},pt=(...t)=>{let e={},o={};for(const n of t)if(Array.isArray(n))Array.isArray(e)||(e=[]),e=[...e,...n];else if(ut(n)){for(let[t,o]of Object.entries(n))ut(o)&&t in e&&(o=pt(e[t],o)),e={...e,[t]:o};ut(n.headers)&&(o=ht(o,n.headers),e.headers=o)}return e},dt="function"==typeof globalThis.AbortController,gt="function"==typeof globalThis.ReadableStream,mt="function"==typeof globalThis.FormData,bt=["get","post","put","patch","head","delete"],yt={json:"application/json",text:"text/*",formData:"multipart/form-data",arrayBuffer:"*/*",blob:"*/*"},$t=2147483647,wt=Symbol("stop"),_t=t=>bt.includes(t)?t.toUpperCase():t,vt=[413,429,503],xt={limit:2,methods:["get","put","head","delete","options","trace"],statusCodes:[408,413,429,500,502,503,504],afterStatusCodes:vt,maxRetryAfter:Number.POSITIVE_INFINITY},Ct=(t={})=>{if("number"==typeof t)return{...xt,limit:t};if(t.methods&&!Array.isArray(t.methods))throw new Error("retry.methods must be an array");if(t.statusCodes&&!Array.isArray(t.statusCodes))throw new Error("retry.statusCodes must be an array");return{...xt,...t,afterStatusCodes:vt}};class Tt{constructor(t,e={}){var o,n,s;if(this._retryCount=0,this._input=t,this._options={credentials:this._input.credentials||"same-origin",...e,headers:ht(this._input.headers,e.headers),hooks:pt({beforeRequest:[],beforeRetry:[],beforeError:[],afterResponse:[]},e.hooks),method:_t(null!==(o=e.method)&&void 0!==o?o:this._input.method),prefixUrl:String(e.prefixUrl||""),retry:Ct(e.retry),throwHttpErrors:!1!==e.throwHttpErrors,timeout:void 0===e.timeout?1e4:e.timeout,fetch:null!==(n=e.fetch)&&void 0!==n?n:globalThis.fetch.bind(globalThis)},"string"!=typeof this._input&&!(this._input instanceof URL||this._input instanceof globalThis.Request))throw new TypeError("`input` must be a string, URL, or Request");if(this._options.prefixUrl&&"string"==typeof this._input){if(this._input.startsWith("/"))throw new Error("`input` must not begin with a slash when using `prefixUrl`");this._options.prefixUrl.endsWith("/")||(this._options.prefixUrl+="/"),this._input=this._options.prefixUrl+this._input}if(dt&&(this.abortController=new globalThis.AbortController,this._options.signal&&this._options.signal.addEventListener("abort",(()=>{this.abortController.abort()})),this._options.signal=this.abortController.signal),this.request=new globalThis.Request(this._input,this._options),this._options.searchParams){const t="?"+("string"==typeof this._options.searchParams?this._options.searchParams.replace(/^\?/,""):new URLSearchParams(this._options.searchParams).toString()),e=this.request.url.replace(/(?:\?.*?)?(?=#|$)/,t);!(mt&&this._options.body instanceof globalThis.FormData||this._options.body instanceof URLSearchParams)||this._options.headers&&this._options.headers["content-type"]||this.request.headers.delete("content-type"),this.request=new globalThis.Request(new globalThis.Request(e,this.request),this._options)}void 0!==this._options.json&&(this._options.body=JSON.stringify(this._options.json),this.request.headers.set("content-type",null!==(s=this._options.headers.get("content-type"))&&void 0!==s?s:"application/json"),this.request=new globalThis.Request(this.request,{body:this._options.body}))}static create(t,e){const o=new Tt(t,e),n=async()=>{if(o._options.timeout>$t)throw new RangeError("The `timeout` option cannot be greater than 2147483647");await Promise.resolve();let t=await o._fetch();for(const e of o._options.hooks.afterResponse){const n=await e(o.request,o._options,o._decorateResponse(t.clone()));n instanceof globalThis.Response&&(t=n)}if(o._decorateResponse(t),!t.ok&&o._options.throwHttpErrors){let e=new lt(t,o.request,o._options);for(const t of o._options.hooks.beforeError)e=await t(e);throw e}if(o._options.onDownloadProgress){if("function"!=typeof o._options.onDownloadProgress)throw new TypeError("The `onDownloadProgress` option must be a function");if(!gt)throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");return o._stream(t.clone(),o._options.onDownloadProgress)}return t},s=o._options.retry.methods.includes(o.request.method.toLowerCase())?o._retry(n):n();for(const[t,n]of Object.entries(yt))s[t]=async()=>{o.request.headers.set("accept",o.request.headers.get("accept")||n);const r=(await s).clone();if("json"===t){if(204===r.status)return"";if(e.parseJson)return e.parseJson(await r.text())}return r[t]()};return s}_calculateRetryDelay(t){if(this._retryCount++,this._retryCount<this._options.retry.limit&&!(t instanceof ct)){if(t instanceof lt){if(!this._options.retry.statusCodes.includes(t.response.status))return 0;const e=t.response.headers.get("Retry-After");if(e&&this._options.retry.afterStatusCodes.includes(t.response.status)){let t=Number(e);return Number.isNaN(t)?t=Date.parse(e)-Date.now():t*=1e3,void 0!==this._options.retry.maxRetryAfter&&t>this._options.retry.maxRetryAfter?0:t}if(413===t.response.status)return 0}return.3*2**(this._retryCount-1)*1e3}return 0}_decorateResponse(t){return this._options.parseJson&&(t.json=async()=>this._options.parseJson(await t.text())),t}async _retry(t){try{return await t()}catch(e){const o=Math.min(this._calculateRetryDelay(e),$t);if(0!==o&&this._retryCount>0){await(async t=>new Promise((e=>{setTimeout(e,t)})))(o);for(const t of this._options.hooks.beforeRetry){if(await t({request:this.request,options:this._options,error:e,retryCount:this._retryCount})===wt)return}return this._retry(t)}throw e}}async _fetch(){for(const t of this._options.hooks.beforeRequest){const e=await t(this.request,this._options);if(e instanceof Request){this.request=e;break}if(e instanceof Response)return e}return!1===this._options.timeout?this._options.fetch(this.request.clone()):(async(t,e,o)=>new Promise(((n,s)=>{const r=setTimeout((()=>{e&&e.abort(),s(new ct(t))}),o.timeout);o.fetch(t).then(n).catch(s).then((()=>{clearTimeout(r)}))})))(this.request.clone(),this.abortController,this._options)}_stream(t,e){const o=Number(t.headers.get("content-length"))||0;let n=0;return new globalThis.Response(new globalThis.ReadableStream({async start(s){const r=t.body.getReader();e&&e({percent:0,transferredBytes:0,totalBytes:o},new Uint8Array),await async function t(){const{done:i,value:a}=await r.read();if(i)s.close();else{if(e){n+=a.byteLength;e({percent:0===o?0:n/o,transferredBytes:n,totalBytes:o},a)}s.enqueue(a),await t()}}()}}))}}
/*! MIT License © Sindre Sorhus */const kt=t=>{const e=(e,o)=>Tt.create(e,ft(t,o));for(const o of bt)e[o]=(e,n)=>Tt.create(e,ft(t,n,{method:o}));return e.create=t=>kt(ft(t)),e.extend=e=>kt(ft(t,e)),e.stop=wt,e};const Rt=kt().extend({credentials:"include",headers:{},hooks:{}});var qt,Et=new Uint8Array(16);function St(){if(!qt&&!(qt="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return qt(Et)}var Ut=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function jt(t){return"string"==typeof t&&Ut.test(t)}for(var Bt=[],Nt=0;Nt<256;++Nt)Bt.push((Nt+256).toString(16).substr(1));function At(t,e,o){var n=(t=t||{}).random||(t.rng||St)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,e){o=o||0;for(var s=0;s<16;++s)e[o+s]=n[s];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(Bt[t[e+0]]+Bt[t[e+1]]+Bt[t[e+2]]+Bt[t[e+3]]+"-"+Bt[t[e+4]]+Bt[t[e+5]]+"-"+Bt[t[e+6]]+Bt[t[e+7]]+"-"+Bt[t[e+8]]+Bt[t[e+9]]+"-"+Bt[t[e+10]]+Bt[t[e+11]]+Bt[t[e+12]]+Bt[t[e+13]]+Bt[t[e+14]]+Bt[t[e+15]]).toLowerCase();if(!jt(o))throw TypeError("Stringified UUID is invalid");return o}(n)}function Pt(t,e,o){const n=t.slice();return n[25]=e[o],n}function Dt(t,e,o){const n=t.slice();return n[28]=e[o],n}function It(t,e,o){const n=t.slice();return n[31]=e[o],n}function zt(t){let e,o=t[25].videos,n=[];for(let e=0;e<o.length;e+=1)n[e]=Ft(It(t,o,e));return{c(){for(let t=0;t<n.length;t+=1)n[t].c();e=T()},m(t,o){for(let e=0;e<n.length;e+=1)n[e].m(t,o);$(t,e,o)},p(t,s){if(16384&s[0]){let r;for(o=t[25].videos,r=0;r<o.length;r+=1){const i=It(t,o,r);n[r]?n[r].p(i,s):(n[r]=Ft(i),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=o.length}},d(t){_(n,t),t&&w(e)}}}function Ft(t){let e,o;return{c(){e=v("iframe"),R(e,"title","YouTube Video"),R(e,"width",300),R(e,"height",200),c(e.src,o=`https://www.youtube.com/embed/${t[31]}`)||R(e,"src",o)},m(t,o){$(t,e,o)},p(t,n){16384&n[0]&&!c(e.src,o=`https://www.youtube.com/embed/${t[31]}`)&&R(e,"src",o)},d(t){t&&w(e)}}}function Lt(t){let e,o=t[25].responses,n=[];for(let e=0;e<o.length;e+=1)n[e]=Ot(Dt(t,o,e));return{c(){for(let t=0;t<n.length;t+=1)n[t].c();e=T()},m(t,o){for(let e=0;e<n.length;e+=1)n[e].m(t,o);$(t,e,o)},p(t,s){if(147456&s[0]){let r;for(o=t[25].responses,r=0;r<o.length;r+=1){const i=Dt(t,o,r);n[r]?n[r].p(i,s):(n[r]=Ot(i),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=o.length}},d(t){_(n,t),t&&w(e)}}}function Ot(t){let e,o,n,s,r=t[28]+"";function i(){return t[22](t[28])}return{c(){e=v("button"),o=x(r),R(e,"class","chat-response svelte-sf0g8a")},m(t,r){$(t,e,r),y(e,o),n||(s=k(e,"click",i),n=!0)},p(e,n){t=e,16384&n[0]&&r!==(r=t[28]+"")&&E(o,r)},d(t){t&&w(e),n=!1,s()}}}function Wt(t){let e,o,n,s,r,i,a,l,c,u,f,h=t[25].user+"",p=t[25].text+"",d=t[25].responses&&t[25].uid===t[14].slice(-1)[0].uid,g=t[25].videos&&zt(t),m=d&&Lt(t);return{c(){e=v("div"),o=v("div"),n=v("span"),s=x(h),r=x(":\n                        "),i=v("p"),a=x(p),l=C(),g&&g.c(),u=C(),m&&m.c(),f=T(),R(n,"class","svelte-sf0g8a"),R(i,"class","svelte-sf0g8a"),R(o,"class",c=b(["chat-message",t[25].user===t[0]?"bot":"user"].join(" "))+" svelte-sf0g8a"),R(e,"class","chat-message-wrapper svelte-sf0g8a")},m(t,c){$(t,e,c),y(e,o),y(o,n),y(n,s),y(o,r),y(o,i),y(i,a),y(o,l),g&&g.m(o,null),$(t,u,c),m&&m.m(t,c),$(t,f,c)},p(t,e){16384&e[0]&&h!==(h=t[25].user+"")&&E(s,h),16384&e[0]&&p!==(p=t[25].text+"")&&E(a,p),t[25].videos?g?g.p(t,e):(g=zt(t),g.c(),g.m(o,null)):g&&(g.d(1),g=null),16385&e[0]&&c!==(c=b(["chat-message",t[25].user===t[0]?"bot":"user"].join(" "))+" svelte-sf0g8a")&&R(o,"class",c),16384&e[0]&&(d=t[25].responses&&t[25].uid===t[14].slice(-1)[0].uid),d?m?m.p(t,e):(m=Lt(t),m.c(),m.m(f.parentNode,f)):m&&(m.d(1),m=null)},d(t){t&&w(e),g&&g.d(),t&&w(u),m&&m.d(t),t&&w(f)}}}function Ht(t){let e,o,n,s,r,i,a=t[3]?`${t[0]} tippt...`:"...";return{c(){e=v("div"),o=v("div"),n=v("span"),s=x("  "),r=x(a),i=x("  "),R(n,"class","svelte-sf0g8a"),R(o,"class","chat-message bot svelte-sf0g8a"),R(e,"class","chat-message-wrapper svelte-sf0g8a")},m(t,a){$(t,e,a),y(e,o),y(o,n),y(n,s),y(n,r),y(n,i)},p(t,e){9&e[0]&&a!==(a=t[3]?`${t[0]} tippt...`:"...")&&E(r,a)},d(t){t&&w(e)}}}function Mt(e){let o,n,r,i,a,l,u,f,h,p,d,g,m,b,T,q,j,B,N,A,P,D,I,z,F,L=e[14],O=[];for(let t=0;t<L.length;t+=1)O[t]=Wt(Pt(e,L,t));let W=e[13]&&Ht(e);return{c(){o=v("div"),n=v("div"),r=v("div"),i=v("img"),l=C(),u=v("div"),f=v("div"),h=x(e[0]),p=C(),d=v("div"),g=x(e[1]),m=C(),b=v("div"),T=v("div");for(let t=0;t<O.length;t+=1)O[t].c();q=C(),W&&W.c(),j=C(),B=v("div"),N=v("textarea"),A=C(),P=v("button"),D=v("img"),c(i.src,a=e[2])||R(i,"src",a),R(i,"alt",e[0]),R(i,"class","svelte-sf0g8a"),R(r,"class","chat-header-image svelte-sf0g8a"),R(f,"class","chat-header-name svelte-sf0g8a"),R(d,"class","chat-header-info svelte-sf0g8a"),R(u,"class","chat-header-content svelte-sf0g8a"),R(n,"class","chat-header svelte-sf0g8a"),R(T,"class","chat-content svelte-sf0g8a"),R(b,"class","chat-content-wrapper svelte-sf0g8a"),R(N,"class","chat-input svelte-sf0g8a"),c(D.src,I="https://i.ibb.co/fqwq9Y2/send.png")||R(D,"src","https://i.ibb.co/fqwq9Y2/send.png"),R(D,"alt","Send"),R(D,"class","svelte-sf0g8a"),R(P,"class","chat-submit svelte-sf0g8a"),P.disabled=e[13],R(B,"class","chat-footer svelte-sf0g8a"),R(o,"id",e[16]),R(o,"class","chat svelte-sf0g8a"),U(o,"--font-family",e[4]),U(o,"--font-size",e[5]),U(o,"--font-weight",e[6]),U(o,"--font-color-bot",e[7]),U(o,"--font-color-user",e[8]),U(o,"--bubble-color-bot",e[9]),U(o,"--bubble-color-user",e[10]),U(o,"--header-background-color",e[11]),U(o,"--chat-background-color",e[12])},m(t,s){$(t,o,s),y(o,n),y(n,r),y(r,i),y(n,l),y(n,u),y(u,f),y(f,h),y(u,p),y(u,d),y(d,g),y(o,m),y(o,b),y(b,T);for(let t=0;t<O.length;t+=1)O[t].m(T,null);y(T,q),W&&W.m(T,null),y(o,j),y(o,B),y(B,N),S(N,e[15]),y(B,A),y(B,P),y(P,D),z||(F=[k(N,"input",e[23]),k(N,"keydown",e[18]),k(P,"click",e[24])],z=!0)},p(t,e){if(4&e[0]&&!c(i.src,a=t[2])&&R(i,"src",a),1&e[0]&&R(i,"alt",t[0]),1&e[0]&&E(h,t[0]),2&e[0]&&E(g,t[1]),147457&e[0]){let o;for(L=t[14],o=0;o<L.length;o+=1){const n=Pt(t,L,o);O[o]?O[o].p(n,e):(O[o]=Wt(n),O[o].c(),O[o].m(T,q))}for(;o<O.length;o+=1)O[o].d(1);O.length=L.length}t[13]?W?W.p(t,e):(W=Ht(t),W.c(),W.m(T,null)):W&&(W.d(1),W=null),32768&e[0]&&S(N,t[15]),8192&e[0]&&(P.disabled=t[13]),16&e[0]&&U(o,"--font-family",t[4]),32&e[0]&&U(o,"--font-size",t[5]),64&e[0]&&U(o,"--font-weight",t[6]),128&e[0]&&U(o,"--font-color-bot",t[7]),256&e[0]&&U(o,"--font-color-user",t[8]),512&e[0]&&U(o,"--bubble-color-bot",t[9]),1024&e[0]&&U(o,"--bubble-color-user",t[10]),2048&e[0]&&U(o,"--header-background-color",t[11]),4096&e[0]&&U(o,"--chat-background-color",t[12])},i:t,o:t,d(t){t&&w(o),_(O,t),W&&W.d(),z=!1,s(F)}}}function Vt(t,e,o){let{apiUrl:n="https://dialogflow-backend.capr.hand.group",botType:s="dev",botName:r="Max Mustermann",botStatus:i="Online",botImage:a="https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg",typingTime:l=500,typingWithName:c=!0,fontFamily:u="Helvetica",fontSize:f="16px",fontWeight:h="inherit",fontColorBot:p="black",fontColorUser:d="black",bubbleColorBot:g="lightgrey",bubbleColorUser:m="lightgreen",headerBackgroundColor:b="white",chatBackgroundColor:y="white"}=e;const $=At();let w=!1,_=[],v="";function x(t){t&&!w&&(o(15,v=""),o(14,_=[..._,{uid:At(),user:"You",text:t}]),o(13,w=!0),setTimeout((async()=>{let e=(await Rt.get(`${n}?bot=${s}&query=${t}`).json()).queryResult.fulfillmentText,i=[];e.split("responses=").length>1&&(i=e.split("responses=")[1].split(";"),e=e.split("responses=")[0]);let a=[];e.split("youtube=").length>1&&(a=e.split("youtube=")[1].split(";"),e=e.split("youtube=")[0]),o(14,_=[..._,{uid:At(),user:r,text:e,videos:!!a.length&&a,responses:!!i.length&&i}]),o(13,w=!1)}),l))}return t.$$set=t=>{"apiUrl"in t&&o(19,n=t.apiUrl),"botType"in t&&o(20,s=t.botType),"botName"in t&&o(0,r=t.botName),"botStatus"in t&&o(1,i=t.botStatus),"botImage"in t&&o(2,a=t.botImage),"typingTime"in t&&o(21,l=t.typingTime),"typingWithName"in t&&o(3,c=t.typingWithName),"fontFamily"in t&&o(4,u=t.fontFamily),"fontSize"in t&&o(5,f=t.fontSize),"fontWeight"in t&&o(6,h=t.fontWeight),"fontColorBot"in t&&o(7,p=t.fontColorBot),"fontColorUser"in t&&o(8,d=t.fontColorUser),"bubbleColorBot"in t&&o(9,g=t.bubbleColorBot),"bubbleColorUser"in t&&o(10,m=t.bubbleColorUser),"headerBackgroundColor"in t&&o(11,b=t.headerBackgroundColor),"chatBackgroundColor"in t&&o(12,y=t.chatBackgroundColor)},[r,i,a,c,u,f,h,p,d,g,m,b,y,w,_,v,$,x,function(t){"Enter"===t.key&&(t.preventDefault(),x(v))},n,s,l,t=>x(t),function(){v=this.value,o(15,v)},()=>x(v)]}class Jt extends Z{constructor(t){super(),X(this,t,Vt,Mt,i,{apiUrl:19,botType:20,botName:0,botStatus:1,botImage:2,typingTime:21,typingWithName:3,fontFamily:4,fontSize:5,fontWeight:6,fontColorBot:7,fontColorUser:8,bubbleColorBot:9,bubbleColorUser:10,headerBackgroundColor:11,chatBackgroundColor:12},null,[-1,-1])}}function Gt(e){let o,n;return o=new Jt({props:{botType:"default",botName:"Philipp Meier",botStatus:"Dekan der Fakultät Maschinenbau",botImage:"https://i.ibb.co/k4NF2wv/max.jpg",typingWithName:!1,fontFamily:"Times New Roman",fontSize:"14px",headerBackgroundColor:"lightgrey",chatBackgroundColor:"lightgrey",fontColorBot:"lightgrey",fontColorUser:"lightgrey",bubbleColorBot:"black",bubbleColorUser:"#363b3f"}}),{c(){G(o.$$.fragment)},m(t,e){Y(o,t,e),n=!0},p:t,i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){K(o,t)}}}function Yt(e){let o,n;return o=new Jt({props:{botType:"inclusive",botName:"Aylin",botImage:"https://i.ibb.co/5L02hP2/aylin.jpg",fontFamily:"Arial",fontSize:"20px",fontColorBot:"black",fontColorUser:"black",bubbleColorBot:"#bccee1",bubbleColorUser:"#b0efb0"}}),{c(){G(o.$$.fragment)},m(t,e){Y(o,t,e),n=!0},p:t,i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){K(o,t)}}}function Kt(t){let e,o,n,s;return e=new st({props:{md:6,$$slots:{default:[Gt]},$$scope:{ctx:t}}}),n=new st({props:{md:6,$$slots:{default:[Yt]},$$scope:{ctx:t}}}),{c(){G(e.$$.fragment),o=C(),G(n.$$.fragment)},m(t,r){Y(e,t,r),$(t,o,r),Y(n,t,r),s=!0},p(t,o){const s={};1&o&&(s.$$scope={dirty:o,ctx:t}),e.$set(s);const r={};1&o&&(r.$$scope={dirty:o,ctx:t}),n.$set(r)},i(t){s||(M(e.$$.fragment,t),M(n.$$.fragment,t),s=!0)},o(t){V(e.$$.fragment,t),V(n.$$.fragment,t),s=!1},d(t){K(e,t),t&&w(o),K(n,t)}}}function Qt(t){let e,o,n;return o=new at({props:{$$slots:{default:[Kt]},$$scope:{ctx:t}}}),{c(){e=v("main"),G(o.$$.fragment),R(e,"class","svelte-eld5wd")},m(t,s){$(t,e,s),Y(o,e,null),n=!0},p(t,[e]){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n)},i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){t&&w(e),K(o)}}}const Xt=new class extends Z{constructor(t){super(),X(this,t,null,Qt,i,{})}}({target:document.body});return Xt}();
//# sourceMappingURL=bundle.js.map
