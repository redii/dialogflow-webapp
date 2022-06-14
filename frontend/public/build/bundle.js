var app=function(){"use strict";function t(){}function e(t,e){for(const o in e)t[o]=e[o];return t}function o(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(o)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let l,a;function c(t,e){return l||(l=document.createElement("a")),l.href=e,t===l.href}function u(t,e,o,n){if(t){const s=f(t,e,o,n);return t[0](s)}}function f(t,o,n,s){return t[1]&&s?e(n.ctx.slice(),t[1](s(o))):n.ctx}function h(t,e,o,n){if(t[2]&&n){const s=t[2](n(o));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],o=Math.max(e.dirty.length,s.length);for(let n=0;n<o;n+=1)t[n]=e.dirty[n]|s[n];return t}return e.dirty|s}return e.dirty}function p(t,e,o,n,s,r){if(s){const i=f(e,o,n,r);t.p(i,s)}}function d(t){if(t.ctx.length>32){const e=[],o=t.ctx.length/32;for(let t=0;t<o;t++)e[t]=-1;return e}return-1}function m(t){const e={};for(const o in t)"$"!==o[0]&&(e[o]=t[o]);return e}function g(t,e){const o={};e=new Set(e);for(const n in t)e.has(n)||"$"===n[0]||(o[n]=t[n]);return o}function b(t){return null==t?"":t}function y(t,e){t.appendChild(e)}function $(t,e,o){t.insertBefore(e,o||null)}function w(t){t.parentNode.removeChild(t)}function _(t,e){for(let o=0;o<t.length;o+=1)t[o]&&t[o].d(e)}function v(t){return document.createElement(t)}function x(t){return document.createTextNode(t)}function C(){return x(" ")}function j(){return x("")}function T(t,e,o,n){return t.addEventListener(e,o,n),()=>t.removeEventListener(e,o,n)}function k(t,e,o){null==o?t.removeAttribute(e):t.getAttribute(e)!==o&&t.setAttribute(e,o)}function R(t,e){const o=Object.getOwnPropertyDescriptors(t.__proto__);for(const n in e)null==e[n]?t.removeAttribute(n):"style"===n?t.style.cssText=e[n]:"__value"===n?t.value=t[n]=e[n]:o[n]&&o[n].set?t[n]=e[n]:k(t,n,e[n])}function q(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function E(t,e){t.value=null==e?"":e}function U(t,e,o,n){null===o?t.style.removeProperty(e):t.style.setProperty(e,o,n?"important":"")}function S(t){a=t}const B=[],N=[],A=[],P=[],D=Promise.resolve();let I=!1;function z(t){A.push(t)}const L=new Set;let O=0;function W(){const t=a;do{for(;O<B.length;){const t=B[O];O++,S(t),F(t.$$)}for(S(null),B.length=0,O=0;N.length;)N.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];L.has(e)||(L.add(e),e())}A.length=0}while(B.length);for(;P.length;)P.pop()();I=!1,L.clear(),S(t)}function F(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}const H=new Set;function M(t,e){t&&t.i&&(H.delete(t),t.i(e))}function V(t,e,o,n){if(t&&t.o){if(H.has(t))return;H.add(t),undefined.c.push((()=>{H.delete(t),n&&(o&&t.d(1),n())})),t.o(e)}}function J(t,e){const o={},n={},s={$$scope:1};let r=t.length;for(;r--;){const i=t[r],l=e[r];if(l){for(const t in i)t in l||(n[t]=1);for(const t in l)s[t]||(o[t]=l[t],s[t]=1);t[r]=l}else for(const t in i)s[t]=1}for(const t in n)t in o||(o[t]=void 0);return o}function G(t){t&&t.c()}function Y(t,e,n,i){const{fragment:l,on_mount:a,on_destroy:c,after_update:u}=t.$$;l&&l.m(e,n),i||z((()=>{const e=a.map(o).filter(r);c?c.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(z)}function K(t,e){const o=t.$$;null!==o.fragment&&(s(o.on_destroy),o.fragment&&o.fragment.d(e),o.on_destroy=o.fragment=null,o.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(B.push(t),I||(I=!0,D.then(W)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function X(e,o,r,i,l,c,u,f=[-1]){const h=a;S(e);const p=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(h?h.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:o.target||h.$$.root};u&&u(p.root);let d=!1;if(p.ctx=r?r(e,o.props||{},((t,o,...n)=>{const s=n.length?n[0]:o;return p.ctx&&l(p.ctx[t],p.ctx[t]=s)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](s),d&&Q(e,t)),o})):[],p.update(),d=!0,s(p.before_update),p.fragment=!!i&&i(p.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);p.fragment&&p.fragment.l(t),t.forEach(w)}else p.fragment&&p.fragment.c();o.intro&&M(e.$$.fragment),Y(e,o.target,o.anchor,o.customElement),W()}S(h)}class Z{$destroy(){K(this,1),this.$destroy=t}$on(t,e){const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function tt(t,e,o){return!0===o||""===o?t?"col":`col-${e}`:"auto"===o?t?"col-auto":`col-${e}-auto`:t?`col-${o}`:`col-${e}-${o}`}function et(t){let e="";if("string"==typeof t||"number"==typeof t)e+=t;else if("object"==typeof t)if(Array.isArray(t))e=t.map(et).filter(Boolean).join(" ");else for(let o in t)t[o]&&(e&&(e+=" "),e+=o);return e}function ot(t){let o,n,s;const r=t[10].default,i=u(r,t,t[9],null);let l=[t[1],{class:n=t[0].join(" ")}],a={};for(let t=0;t<l.length;t+=1)a=e(a,l[t]);return{c(){o=v("div"),i&&i.c(),R(o,a)},m(t,e){$(t,o,e),i&&i.m(o,null),s=!0},p(t,[e]){i&&i.p&&(!s||512&e)&&p(i,r,t,t[9],s?h(r,t[9],e,null):d(t[9]),null),R(o,a=J(l,[2&e&&t[1],{class:n}]))},i(t){s||(M(i,t),s=!0)},o(t){V(i,t),s=!1},d(t){t&&w(o),i&&i.d(t)}}}function nt(t,o,n){const s=["class","xs","sm","md","lg","xl","xxl"];let r=g(o,s),{$$slots:i={},$$scope:l}=o,{class:a=""}=o,{xs:c}=o,{sm:u}=o,{md:f}=o,{lg:h}=o,{xl:p}=o,{xxl:d}=o;const b=[],y={xs:c,sm:u,md:f,lg:h,xl:p,xxl:d};return Object.keys(y).forEach((t=>{const e=y[t];if(!e&&""!==e)return;const o="xs"===t;if(function(t){const e=typeof t;return null!=t&&("object"==e||"function"==e)}(e)){const n=o?"-":`-${t}-`,s=tt(o,t,e.size);(e.size||""===e.size)&&b.push(s),e.push&&b.push(`push${n}${e.push}`),e.pull&&b.push(`pull${n}${e.pull}`),e.offset&&b.push(`offset${n}${e.offset}`),e.order&&b.push(`order${n}${e.order}`)}else b.push(tt(o,t,e))})),b.length||b.push("col"),a&&b.push(a),t.$$set=t=>{o=e(e({},o),m(t)),n(1,r=g(o,s)),"class"in t&&n(2,a=t.class),"xs"in t&&n(3,c=t.xs),"sm"in t&&n(4,u=t.sm),"md"in t&&n(5,f=t.md),"lg"in t&&n(6,h=t.lg),"xl"in t&&n(7,p=t.xl),"xxl"in t&&n(8,d=t.xxl),"$$scope"in t&&n(9,l=t.$$scope)},[b,r,a,c,u,f,h,p,d,l,i]}class st extends Z{constructor(t){super(),X(this,t,nt,ot,i,{class:2,xs:3,sm:4,md:5,lg:6,xl:7,xxl:8})}}function rt(t){let o,n;const s=t[8].default,r=u(s,t,t[7],null);let i=[t[2],{class:t[1]}],l={};for(let t=0;t<i.length;t+=1)l=e(l,i[t]);return{c(){o=v("div"),r&&r.c(),R(o,l)},m(e,s){$(e,o,s),r&&r.m(o,null),t[9](o),n=!0},p(t,[e]){r&&r.p&&(!n||128&e)&&p(r,s,t,t[7],n?h(s,t[7],e,null):d(t[7]),null),R(o,l=J(i,[4&e&&t[2],(!n||2&e)&&{class:t[1]}]))},i(t){n||(M(r,t),n=!0)},o(t){V(r,t),n=!1},d(e){e&&w(o),r&&r.d(e),t[9](null)}}}function it(t,o,n){let s;const r=["class","noGutters","form","cols","inner"];let i=g(o,r),{$$slots:l={},$$scope:a}=o,{class:c=""}=o,{noGutters:u=!1}=o,{form:f=!1}=o,{cols:h=0}=o,{inner:p}=o;return t.$$set=t=>{o=e(e({},o),m(t)),n(2,i=g(o,r)),"class"in t&&n(3,c=t.class),"noGutters"in t&&n(4,u=t.noGutters),"form"in t&&n(5,f=t.form),"cols"in t&&n(6,h=t.cols),"inner"in t&&n(0,p=t.inner),"$$scope"in t&&n(7,a=t.$$scope)},t.$$.update=()=>{120&t.$$.dirty&&n(1,s=function(...t){return t.map(et).filter(Boolean).join(" ")}(c,u?"gx-0":null,f?"form-row":"row",...function(t){const e=parseInt(t);if(isNaN(e)){if("object"==typeof t)return["xs","sm","md","lg","xl"].map((e=>{const o="xs"===e?"-":`-${e}-`,n=t[e];return"number"==typeof n&&n>0?`row-cols${o}${n}`:null})).filter((t=>!!t))}else if(e>0)return[`row-cols-${e}`];return[]}(h)))},[p,s,i,c,u,f,h,a,l,function(t){N[t?"unshift":"push"]((()=>{p=t,n(0,p)}))}]}class lt extends Z{constructor(t){super(),X(this,t,it,rt,i,{class:3,noGutters:4,form:5,cols:6,inner:0})}}class at extends Error{constructor(t,e,o){const n=`${t.status||0===t.status?t.status:""} ${t.statusText||""}`.trim();super(`Request failed with ${n?`status code ${n}`:"an unknown error"}`),this.name="HTTPError",this.response=t,this.request=e,this.options=o}}class ct extends Error{constructor(t){super("Request timed out"),this.name="TimeoutError",this.request=t}}const ut=t=>null!==t&&"object"==typeof t,ft=(...t)=>{for(const e of t)if((!ut(e)||Array.isArray(e))&&void 0!==e)throw new TypeError("The `options` argument must be an object");return pt({},...t)},ht=(t={},e={})=>{const o=new globalThis.Headers(t),n=e instanceof globalThis.Headers,s=new globalThis.Headers(e);for(const[t,e]of s.entries())n&&"undefined"===e||void 0===e?o.delete(t):o.set(t,e);return o},pt=(...t)=>{let e={},o={};for(const n of t)if(Array.isArray(n))Array.isArray(e)||(e=[]),e=[...e,...n];else if(ut(n)){for(let[t,o]of Object.entries(n))ut(o)&&t in e&&(o=pt(e[t],o)),e={...e,[t]:o};ut(n.headers)&&(o=ht(o,n.headers),e.headers=o)}return e},dt="function"==typeof globalThis.AbortController,mt="function"==typeof globalThis.ReadableStream,gt="function"==typeof globalThis.FormData,bt=["get","post","put","patch","head","delete"],yt={json:"application/json",text:"text/*",formData:"multipart/form-data",arrayBuffer:"*/*",blob:"*/*"},$t=2147483647,wt=Symbol("stop"),_t=t=>bt.includes(t)?t.toUpperCase():t,vt=[413,429,503],xt={limit:2,methods:["get","put","head","delete","options","trace"],statusCodes:[408,413,429,500,502,503,504],afterStatusCodes:vt,maxRetryAfter:Number.POSITIVE_INFINITY},Ct=(t={})=>{if("number"==typeof t)return{...xt,limit:t};if(t.methods&&!Array.isArray(t.methods))throw new Error("retry.methods must be an array");if(t.statusCodes&&!Array.isArray(t.statusCodes))throw new Error("retry.statusCodes must be an array");return{...xt,...t,afterStatusCodes:vt}};class jt{constructor(t,e={}){var o,n,s;if(this._retryCount=0,this._input=t,this._options={credentials:this._input.credentials||"same-origin",...e,headers:ht(this._input.headers,e.headers),hooks:pt({beforeRequest:[],beforeRetry:[],beforeError:[],afterResponse:[]},e.hooks),method:_t(null!==(o=e.method)&&void 0!==o?o:this._input.method),prefixUrl:String(e.prefixUrl||""),retry:Ct(e.retry),throwHttpErrors:!1!==e.throwHttpErrors,timeout:void 0===e.timeout?1e4:e.timeout,fetch:null!==(n=e.fetch)&&void 0!==n?n:globalThis.fetch.bind(globalThis)},"string"!=typeof this._input&&!(this._input instanceof URL||this._input instanceof globalThis.Request))throw new TypeError("`input` must be a string, URL, or Request");if(this._options.prefixUrl&&"string"==typeof this._input){if(this._input.startsWith("/"))throw new Error("`input` must not begin with a slash when using `prefixUrl`");this._options.prefixUrl.endsWith("/")||(this._options.prefixUrl+="/"),this._input=this._options.prefixUrl+this._input}if(dt&&(this.abortController=new globalThis.AbortController,this._options.signal&&this._options.signal.addEventListener("abort",(()=>{this.abortController.abort()})),this._options.signal=this.abortController.signal),this.request=new globalThis.Request(this._input,this._options),this._options.searchParams){const t="?"+("string"==typeof this._options.searchParams?this._options.searchParams.replace(/^\?/,""):new URLSearchParams(this._options.searchParams).toString()),e=this.request.url.replace(/(?:\?.*?)?(?=#|$)/,t);!(gt&&this._options.body instanceof globalThis.FormData||this._options.body instanceof URLSearchParams)||this._options.headers&&this._options.headers["content-type"]||this.request.headers.delete("content-type"),this.request=new globalThis.Request(new globalThis.Request(e,this.request),this._options)}void 0!==this._options.json&&(this._options.body=JSON.stringify(this._options.json),this.request.headers.set("content-type",null!==(s=this._options.headers.get("content-type"))&&void 0!==s?s:"application/json"),this.request=new globalThis.Request(this.request,{body:this._options.body}))}static create(t,e){const o=new jt(t,e),n=async()=>{if(o._options.timeout>$t)throw new RangeError("The `timeout` option cannot be greater than 2147483647");await Promise.resolve();let t=await o._fetch();for(const e of o._options.hooks.afterResponse){const n=await e(o.request,o._options,o._decorateResponse(t.clone()));n instanceof globalThis.Response&&(t=n)}if(o._decorateResponse(t),!t.ok&&o._options.throwHttpErrors){let e=new at(t,o.request,o._options);for(const t of o._options.hooks.beforeError)e=await t(e);throw e}if(o._options.onDownloadProgress){if("function"!=typeof o._options.onDownloadProgress)throw new TypeError("The `onDownloadProgress` option must be a function");if(!mt)throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");return o._stream(t.clone(),o._options.onDownloadProgress)}return t},s=o._options.retry.methods.includes(o.request.method.toLowerCase())?o._retry(n):n();for(const[t,n]of Object.entries(yt))s[t]=async()=>{o.request.headers.set("accept",o.request.headers.get("accept")||n);const r=(await s).clone();if("json"===t){if(204===r.status)return"";if(e.parseJson)return e.parseJson(await r.text())}return r[t]()};return s}_calculateRetryDelay(t){if(this._retryCount++,this._retryCount<this._options.retry.limit&&!(t instanceof ct)){if(t instanceof at){if(!this._options.retry.statusCodes.includes(t.response.status))return 0;const e=t.response.headers.get("Retry-After");if(e&&this._options.retry.afterStatusCodes.includes(t.response.status)){let t=Number(e);return Number.isNaN(t)?t=Date.parse(e)-Date.now():t*=1e3,void 0!==this._options.retry.maxRetryAfter&&t>this._options.retry.maxRetryAfter?0:t}if(413===t.response.status)return 0}return.3*2**(this._retryCount-1)*1e3}return 0}_decorateResponse(t){return this._options.parseJson&&(t.json=async()=>this._options.parseJson(await t.text())),t}async _retry(t){try{return await t()}catch(e){const o=Math.min(this._calculateRetryDelay(e),$t);if(0!==o&&this._retryCount>0){await(async t=>new Promise((e=>{setTimeout(e,t)})))(o);for(const t of this._options.hooks.beforeRetry){if(await t({request:this.request,options:this._options,error:e,retryCount:this._retryCount})===wt)return}return this._retry(t)}throw e}}async _fetch(){for(const t of this._options.hooks.beforeRequest){const e=await t(this.request,this._options);if(e instanceof Request){this.request=e;break}if(e instanceof Response)return e}return!1===this._options.timeout?this._options.fetch(this.request.clone()):(async(t,e,o)=>new Promise(((n,s)=>{const r=setTimeout((()=>{e&&e.abort(),s(new ct(t))}),o.timeout);o.fetch(t).then(n).catch(s).then((()=>{clearTimeout(r)}))})))(this.request.clone(),this.abortController,this._options)}_stream(t,e){const o=Number(t.headers.get("content-length"))||0;let n=0;return new globalThis.Response(new globalThis.ReadableStream({async start(s){const r=t.body.getReader();e&&e({percent:0,transferredBytes:0,totalBytes:o},new Uint8Array),await async function t(){const{done:i,value:l}=await r.read();if(i)s.close();else{if(e){n+=l.byteLength;e({percent:0===o?0:n/o,transferredBytes:n,totalBytes:o},l)}s.enqueue(l),await t()}}()}}))}}
/*! MIT License © Sindre Sorhus */const Tt=t=>{const e=(e,o)=>jt.create(e,ft(t,o));for(const o of bt)e[o]=(e,n)=>jt.create(e,ft(t,n,{method:o}));return e.create=t=>Tt(ft(t)),e.extend=e=>Tt(ft(t,e)),e.stop=wt,e};const kt=Tt().extend({credentials:"include",headers:{},hooks:{}});var Rt,qt=new Uint8Array(16);function Et(){if(!Rt&&!(Rt="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Rt(qt)}var Ut=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function St(t){return"string"==typeof t&&Ut.test(t)}for(var Bt=[],Nt=0;Nt<256;++Nt)Bt.push((Nt+256).toString(16).substr(1));function At(t,e,o){var n=(t=t||{}).random||(t.rng||Et)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,e){o=o||0;for(var s=0;s<16;++s)e[o+s]=n[s];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(Bt[t[e+0]]+Bt[t[e+1]]+Bt[t[e+2]]+Bt[t[e+3]]+"-"+Bt[t[e+4]]+Bt[t[e+5]]+"-"+Bt[t[e+6]]+Bt[t[e+7]]+"-"+Bt[t[e+8]]+Bt[t[e+9]]+"-"+Bt[t[e+10]]+Bt[t[e+11]]+Bt[t[e+12]]+Bt[t[e+13]]+Bt[t[e+14]]+Bt[t[e+15]]).toLowerCase();if(!St(o))throw TypeError("Stringified UUID is invalid");return o}(n)}function Pt(t,e,o){const n=t.slice();return n[26]=e[o],n}function Dt(t,e,o){const n=t.slice();return n[29]=e[o],n}function It(t,e,o){const n=t.slice();return n[32]=e[o],n}function zt(t){let e,o=t[26].videos,n=[];for(let e=0;e<o.length;e+=1)n[e]=Lt(It(t,o,e));return{c(){for(let t=0;t<n.length;t+=1)n[t].c();e=j()},m(t,o){for(let e=0;e<n.length;e+=1)n[e].m(t,o);$(t,e,o)},p(t,s){if(16384&s[0]){let r;for(o=t[26].videos,r=0;r<o.length;r+=1){const i=It(t,o,r);n[r]?n[r].p(i,s):(n[r]=Lt(i),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=o.length}},d(t){_(n,t),t&&w(e)}}}function Lt(t){let e,o;return{c(){e=v("iframe"),k(e,"title","YouTube Video"),k(e,"width",300),k(e,"height",200),c(e.src,o=`https://www.youtube.com/embed/${t[32]}`)||k(e,"src",o)},m(t,o){$(t,e,o)},p(t,n){16384&n[0]&&!c(e.src,o=`https://www.youtube.com/embed/${t[32]}`)&&k(e,"src",o)},d(t){t&&w(e)}}}function Ot(t){let e,o=t[26].responses,n=[];for(let e=0;e<o.length;e+=1)n[e]=Wt(Dt(t,o,e));return{c(){for(let t=0;t<n.length;t+=1)n[t].c();e=j()},m(t,o){for(let e=0;e<n.length;e+=1)n[e].m(t,o);$(t,e,o)},p(t,s){if(147456&s[0]){let r;for(o=t[26].responses,r=0;r<o.length;r+=1){const i=Dt(t,o,r);n[r]?n[r].p(i,s):(n[r]=Wt(i),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=o.length}},d(t){_(n,t),t&&w(e)}}}function Wt(t){let e,o,n,s,r=t[29]+"";function i(){return t[22](t[29])}return{c(){e=v("button"),o=x(r),k(e,"class","chat-response svelte-1jy5sfi")},m(t,r){$(t,e,r),y(e,o),n||(s=T(e,"click",i),n=!0)},p(e,n){t=e,16384&n[0]&&r!==(r=t[29]+"")&&q(o,r)},d(t){t&&w(e),n=!1,s()}}}function Ft(t){let e,o,n,s,r,i,l,a,c,u,f,h,p,d,m,g,_=t[26].user+"",T=t[26].text.trim()+"",R=t[26].responses&&t[26].uid===t[14].slice(-1)[0].uid,E=t[26].videos&&zt(t),U=R&&Ot(t);return{c(){e=v("div"),o=v("div"),n=v("div"),s=v("span"),r=x(_),i=x(":"),l=C(),a=v("div"),c=v("pre"),u=x("                                "),f=x(T),h=x("\n                            "),p=C(),E&&E.c(),m=C(),U&&U.c(),g=j(),k(s,"class","svelte-1jy5sfi"),k(n,"class","chat-message-name"),k(c,"class","svelte-1jy5sfi"),k(a,"class","chat-message-text"),k(o,"class",d=b(["chat-message",t[26].user===t[0]?"bot":"user"].join(" "))+" svelte-1jy5sfi"),k(e,"class","chat-message-wrapper svelte-1jy5sfi")},m(t,d){$(t,e,d),y(e,o),y(o,n),y(n,s),y(s,r),y(n,i),y(o,l),y(o,a),y(a,c),y(c,u),y(c,f),y(c,h),y(o,p),E&&E.m(o,null),$(t,m,d),U&&U.m(t,d),$(t,g,d)},p(t,e){16384&e[0]&&_!==(_=t[26].user+"")&&q(r,_),16384&e[0]&&T!==(T=t[26].text.trim()+"")&&q(f,T),t[26].videos?E?E.p(t,e):(E=zt(t),E.c(),E.m(o,null)):E&&(E.d(1),E=null),16385&e[0]&&d!==(d=b(["chat-message",t[26].user===t[0]?"bot":"user"].join(" "))+" svelte-1jy5sfi")&&k(o,"class",d),16384&e[0]&&(R=t[26].responses&&t[26].uid===t[14].slice(-1)[0].uid),R?U?U.p(t,e):(U=Ot(t),U.c(),U.m(g.parentNode,g)):U&&(U.d(1),U=null)},d(t){t&&w(e),E&&E.d(),t&&w(m),U&&U.d(t),t&&w(g)}}}function Ht(e){let o,n,s;return{c(){o=v("button"),o.textContent="Hallo 👋🏼",k(o,"class","chat-response svelte-1jy5sfi")},m(t,r){$(t,o,r),n||(s=T(o,"click",e[23]),n=!0)},p:t,d(t){t&&w(o),n=!1,s()}}}function Mt(t){let e,o,n,s,r,i,l=t[3]?`${t[0]} tippt...`:"...";return{c(){e=v("div"),o=v("div"),n=v("span"),s=x("  "),r=x(l),i=x("  "),k(n,"class","svelte-1jy5sfi"),k(o,"class","chat-message bot svelte-1jy5sfi"),k(e,"class","chat-message-wrapper svelte-1jy5sfi")},m(t,l){$(t,e,l),y(e,o),y(o,n),y(n,s),y(n,r),y(n,i)},p(t,e){9&e[0]&&l!==(l=t[3]?`${t[0]} tippt...`:"...")&&q(r,l)},d(t){t&&w(e)}}}function Vt(e){let o,n,r,i,l,a,u,f,h,p,d,m,g,b,j,R,S,B,N,A,P,D,I,z,L,O,W=e[14],F=[];for(let t=0;t<W.length;t+=1)F[t]=Ft(Pt(e,W,t));let H=!e[14].length&&Ht(e),M=e[13]&&Mt(e);return{c(){o=v("div"),n=v("div"),r=v("div"),i=v("img"),a=C(),u=v("div"),f=v("div"),h=x(e[0]),p=C(),d=v("div"),m=x(e[1]),g=C(),b=v("div"),j=v("div");for(let t=0;t<F.length;t+=1)F[t].c();R=C(),H&&H.c(),S=C(),M&&M.c(),B=C(),N=v("div"),A=v("textarea"),P=C(),D=v("button"),I=v("img"),c(i.src,l=e[2])||k(i,"src",l),k(i,"alt",e[0]),k(i,"class","svelte-1jy5sfi"),k(r,"class","chat-header-image svelte-1jy5sfi"),k(f,"class","chat-header-name svelte-1jy5sfi"),k(d,"class","chat-header-info svelte-1jy5sfi"),k(u,"class","chat-header-content svelte-1jy5sfi"),k(n,"class","chat-header svelte-1jy5sfi"),k(j,"class","chat-content svelte-1jy5sfi"),k(b,"class","chat-content-wrapper svelte-1jy5sfi"),k(A,"class","chat-input svelte-1jy5sfi"),c(I.src,z="https://i.ibb.co/fqwq9Y2/send.png")||k(I,"src","https://i.ibb.co/fqwq9Y2/send.png"),k(I,"alt","Send"),k(I,"class","svelte-1jy5sfi"),k(D,"class","chat-submit svelte-1jy5sfi"),D.disabled=e[13],k(N,"class","chat-footer svelte-1jy5sfi"),k(o,"id",e[16]),k(o,"class","chat svelte-1jy5sfi"),U(o,"--font-family",e[4]),U(o,"--font-size",e[5]),U(o,"--font-weight",e[6]),U(o,"--font-color-bot",e[7]),U(o,"--font-color-user",e[8]),U(o,"--bubble-color-bot",e[9]),U(o,"--bubble-color-user",e[10]),U(o,"--header-background-color",e[11]),U(o,"--chat-background-color",e[12])},m(t,s){$(t,o,s),y(o,n),y(n,r),y(r,i),y(n,a),y(n,u),y(u,f),y(f,h),y(u,p),y(u,d),y(d,m),y(o,g),y(o,b),y(b,j);for(let t=0;t<F.length;t+=1)F[t].m(j,null);y(j,R),H&&H.m(j,null),y(j,S),M&&M.m(j,null),y(o,B),y(o,N),y(N,A),E(A,e[15]),y(N,P),y(N,D),y(D,I),L||(O=[T(A,"input",e[24]),T(A,"keydown",e[18]),T(D,"click",e[25])],L=!0)},p(t,e){if(4&e[0]&&!c(i.src,l=t[2])&&k(i,"src",l),1&e[0]&&k(i,"alt",t[0]),1&e[0]&&q(h,t[0]),2&e[0]&&q(m,t[1]),147457&e[0]){let o;for(W=t[14],o=0;o<W.length;o+=1){const n=Pt(t,W,o);F[o]?F[o].p(n,e):(F[o]=Ft(n),F[o].c(),F[o].m(j,R))}for(;o<F.length;o+=1)F[o].d(1);F.length=W.length}t[14].length?H&&(H.d(1),H=null):H?H.p(t,e):(H=Ht(t),H.c(),H.m(j,S)),t[13]?M?M.p(t,e):(M=Mt(t),M.c(),M.m(j,null)):M&&(M.d(1),M=null),32768&e[0]&&E(A,t[15]),8192&e[0]&&(D.disabled=t[13]),16&e[0]&&U(o,"--font-family",t[4]),32&e[0]&&U(o,"--font-size",t[5]),64&e[0]&&U(o,"--font-weight",t[6]),128&e[0]&&U(o,"--font-color-bot",t[7]),256&e[0]&&U(o,"--font-color-user",t[8]),512&e[0]&&U(o,"--bubble-color-bot",t[9]),1024&e[0]&&U(o,"--bubble-color-user",t[10]),2048&e[0]&&U(o,"--header-background-color",t[11]),4096&e[0]&&U(o,"--chat-background-color",t[12])},i:t,o:t,d(t){t&&w(o),_(F,t),H&&H.d(),M&&M.d(),L=!1,s(O)}}}function Jt(t,e,o){let{apiUrl:n="https://dialogflow-backend.capr.hand.group",botType:s="dev",botName:r="Max Mustermann",botStatus:i="Online",botImage:l="https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg",typingTime:a=500,typingWithName:c=!0,fontFamily:u="Helvetica",fontSize:f="16px",fontWeight:h="inherit",fontColorBot:p="black",fontColorUser:d="black",bubbleColorBot:m="lightgrey",bubbleColorUser:g="lightgreen",headerBackgroundColor:b="white",chatBackgroundColor:y="white"}=e;const $=At();let w=!1,_=[],v="";function x(t){t&&!w&&(o(15,v=""),o(14,_=[..._,{uid:At(),user:"You",text:t}]),o(13,w=!0),setTimeout((async()=>{let e=(await kt.get(`${n}?bot=${s}&query=${t}`).json()).queryResult.fulfillmentText,i=[];e.split("responses=").length>1&&(i=e.split("responses=")[1].split(";"),e=e.split("responses=")[0]);let l=[];e.split("youtube=").length>1&&(l=e.split("youtube=")[1].split(";"),e=e.split("youtube=")[0]),o(14,_=[..._,{uid:At(),user:r,text:e,videos:!!l.length&&l,responses:!!i.length&&i}]),o(13,w=!1)}),a))}return t.$$set=t=>{"apiUrl"in t&&o(19,n=t.apiUrl),"botType"in t&&o(20,s=t.botType),"botName"in t&&o(0,r=t.botName),"botStatus"in t&&o(1,i=t.botStatus),"botImage"in t&&o(2,l=t.botImage),"typingTime"in t&&o(21,a=t.typingTime),"typingWithName"in t&&o(3,c=t.typingWithName),"fontFamily"in t&&o(4,u=t.fontFamily),"fontSize"in t&&o(5,f=t.fontSize),"fontWeight"in t&&o(6,h=t.fontWeight),"fontColorBot"in t&&o(7,p=t.fontColorBot),"fontColorUser"in t&&o(8,d=t.fontColorUser),"bubbleColorBot"in t&&o(9,m=t.bubbleColorBot),"bubbleColorUser"in t&&o(10,g=t.bubbleColorUser),"headerBackgroundColor"in t&&o(11,b=t.headerBackgroundColor),"chatBackgroundColor"in t&&o(12,y=t.chatBackgroundColor)},[r,i,l,c,u,f,h,p,d,m,g,b,y,w,_,v,$,x,function(t){"Enter"===t.key&&(t.preventDefault(),x(v))},n,s,a,t=>x(t),()=>x("Hallo 👋🏼"),function(){v=this.value,o(15,v)},()=>x(v)]}class Gt extends Z{constructor(t){super(),X(this,t,Jt,Vt,i,{apiUrl:19,botType:20,botName:0,botStatus:1,botImage:2,typingTime:21,typingWithName:3,fontFamily:4,fontSize:5,fontWeight:6,fontColorBot:7,fontColorUser:8,bubbleColorBot:9,bubbleColorUser:10,headerBackgroundColor:11,chatBackgroundColor:12},null,[-1,-1])}}function Yt(e){let o,n;return o=new Gt({props:{botType:"default",botName:"Max Meier",botImage:"https://i.ibb.co/k4NF2wv/max.jpg",typingWithName:!1,fontFamily:"Times New Roman",fontSize:"14px",headerBackgroundColor:"lightgrey",chatBackgroundColor:"lightgrey",fontColorBot:"lightgrey",fontColorUser:"lightgrey",bubbleColorBot:"black",bubbleColorUser:"#363b3f"}}),{c(){G(o.$$.fragment)},m(t,e){Y(o,t,e),n=!0},p:t,i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){K(o,t)}}}function Kt(e){let o,n;return o=new Gt({props:{botType:"inclusive",botName:"Aylin",botImage:"https://i.ibb.co/5L02hP2/aylin.jpg",fontFamily:"Arial",fontSize:"20px",fontColorBot:"black",fontColorUser:"black",bubbleColorBot:"#bccee1",bubbleColorUser:"#b0efb0"}}),{c(){G(o.$$.fragment)},m(t,e){Y(o,t,e),n=!0},p:t,i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){K(o,t)}}}function Qt(t){let e,o,n,s;return e=new st({props:{md:6,$$slots:{default:[Yt]},$$scope:{ctx:t}}}),n=new st({props:{md:6,$$slots:{default:[Kt]},$$scope:{ctx:t}}}),{c(){G(e.$$.fragment),o=C(),G(n.$$.fragment)},m(t,r){Y(e,t,r),$(t,o,r),Y(n,t,r),s=!0},p(t,o){const s={};1&o&&(s.$$scope={dirty:o,ctx:t}),e.$set(s);const r={};1&o&&(r.$$scope={dirty:o,ctx:t}),n.$set(r)},i(t){s||(M(e.$$.fragment,t),M(n.$$.fragment,t),s=!0)},o(t){V(e.$$.fragment,t),V(n.$$.fragment,t),s=!1},d(t){K(e,t),t&&w(o),K(n,t)}}}function Xt(t){let e,o,n;return o=new lt({props:{$$slots:{default:[Qt]},$$scope:{ctx:t}}}),{c(){e=v("main"),G(o.$$.fragment),k(e,"class","svelte-eld5wd")},m(t,s){$(t,e,s),Y(o,e,null),n=!0},p(t,[e]){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n)},i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){V(o.$$.fragment,t),n=!1},d(t){t&&w(e),K(o)}}}const Zt=new class extends Z{constructor(t){super(),X(this,t,null,Xt,i,{})}}({target:document.body});return Zt}();
//# sourceMappingURL=bundle.js.map
