const t="0.5.7",e={state:!0,duration:!0,start_date:!0,end_date:!0,icon:!0,separator:!1,entity_name:!0},i={largest:1,labels:void 0,delimiter:void 0,units:["w","d","h","m","s"]},n={width:1,style:"solid",color:"var(--divider-color)"};function a(t,e,i,n){var a,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(r=(o<3?a(r):o>3?a(e,i,r):a(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=window,r=o.ShadowRoot&&(void 0===o.ShadyCSS||o.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),l=new WeakMap;let u=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=l.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&l.set(e,t))}return t}toString(){return this.cssText}};const d=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new u("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var c;const h=window,_=h.trustedTypes,m=_?_.emptyScript:"",p=h.reactiveElementPolyfillSupport,g={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),f={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:v},b="finalized";let y=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const n=this._$Ep(i,e);void 0!==n&&(this._$Ev.set(n,i),t.push(n))}),t}static createProperty(t,e=f){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const a=this[t];this[e]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||f}static finalize(){if(this.hasOwnProperty(b))return!1;this[b]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(d(t))}else void 0!==t&&e.push(d(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{r?t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(e=>{const i=document.createElement("style"),n=o.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)})})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=f){var n;const a=this.constructor._$Ep(t,i);if(void 0!==a&&!0===i.reflect){const o=(void 0!==(null===(n=i.converter)||void 0===n?void 0:n.toAttribute)?i.converter:g).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,a=n._$Ev.get(t);if(void 0!==a&&this._$El!==a){const t=n.getPropertyOptions(a),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:g;this._$El=a,this[a]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var $;y[b]=!0,y.elementProperties=new Map,y.elementStyles=[],y.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:y}),(null!==(c=h.reactiveElementVersions)&&void 0!==c?c:h.reactiveElementVersions=[]).push("1.6.3");const w=window,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",A=`lit$${(Math.random()+"").slice(9)}$`,E="?"+A,C=`<${E}>`,O=document,j=()=>O.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,F="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,T=/>/g,H=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,P=/"/g,L=/^(?:script|style|textarea|title)$/i,U=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),R=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),V=new WeakMap,q=O.createTreeWalker(O,129,null,!1);function B(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}class K{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,o=0;const r=t.length-1,s=this.parts,[l,u]=((t,e)=>{const i=t.length-1,n=[];let a,o=2===e?"<svg>":"",r=z;for(let e=0;e<i;e++){const i=t[e];let s,l,u=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===z?"!--"===l[1]?r=N:void 0!==l[1]?r=T:void 0!==l[2]?(L.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=H):void 0!==l[3]&&(r=H):r===H?">"===l[0]?(r=null!=a?a:z,u=-1):void 0===l[1]?u=-2:(u=r.lastIndex-l[2].length,s=l[1],r=void 0===l[3]?H:'"'===l[3]?P:I):r===P||r===I?r=H:r===N||r===T?r=z:(r=H,a=void 0);const c=r===H&&t[e+1].startsWith("/>")?" ":"";o+=r===z?i+C:u>=0?(n.push(s),i.slice(0,u)+x+i.slice(u)+A+c):i+A+(-2===u?(n.push(void 0),e):c)}return[B(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),n]})(t,e);if(this.el=K.createElement(l,i),q.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=q.nextNode())&&s.length<r;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith(x)||e.startsWith(A)){const i=u[o++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+x).split(A),e=/([.?@])?(.*)/.exec(i);s.push({type:1,index:a,name:e[2],strings:t,ctor:"."===e[1]?X:"?"===e[1]?tt:"@"===e[1]?et:G})}else s.push({type:6,index:a})}for(const e of t)n.removeAttribute(e)}if(L.test(n.tagName)){const t=n.textContent.split(A),e=t.length-1;if(e>0){n.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],j()),q.nextNode(),s.push({type:2,index:++a});n.append(t[e],j())}}}else if(8===n.nodeType)if(n.data===E)s.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(A,t+1));)s.push({type:7,index:a}),t+=A.length-1}a++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function W(t,e,i=t,n){var a,o,r,s;if(e===R)return e;let l=void 0!==n?null===(a=i._$Co)||void 0===a?void 0:a[n]:i._$Cl;const u=M(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==u&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===u?l=void 0:(l=new u(t),l._$AT(t,i,n)),void 0!==n?(null!==(r=(s=i)._$Co)&&void 0!==r?r:s._$Co=[])[n]=l:i._$Cl=l),void 0!==l&&(e=W(t,l._$AS(t,e.values),l,n)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:n}=this._$AD,a=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:O).importNode(i,!0);q.currentNode=a;let o=q.nextNode(),r=0,s=0,l=n[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new Z(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new it(o,this,t)),this._$AV.push(e),l=n[++s]}r!==(null==l?void 0:l.index)&&(o=q.nextNode(),r++)}return q.currentNode=O,a}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,n){var a;this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=null===(a=null==n?void 0:n.isConnected)||void 0===a||a}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),M(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>D(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==Y&&M(this._$AH)?this._$AA.nextSibling.data=t:this.$(O.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:n}=t,a="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=K.createElement(B(n.h,n.h[0]),this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===a)this._$AH.v(i);else{const t=new J(a,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}T(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new Z(this.k(j()),this.k(j()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}let G=class{constructor(t,e,i,n,a){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const a=this.strings;let o=!1;if(void 0===a)t=W(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const n=t;let r,s;for(t=a[0],r=0;r<a.length-1;r++)s=W(this,n[i+r],e,r),s===R&&(s=this._$AH[r]),o||(o=!M(s)||s!==this._$AH[r]),s===Y?t=Y:t!==Y&&(t+=(null!=s?s:"")+a[r+1]),this._$AH[r]=s}o&&!n&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}},X=class extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}};const Q=k?k.emptyScript:"";class tt extends G{constructor(){super(...arguments),this.type=4}j(t){t&&t!==Y?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class et extends G{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=W(this,t,e,0))&&void 0!==i?i:Y)===R)return;const n=this._$AH,a=t===Y&&n!==Y||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==Y&&(n===Y||a);a&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}}const nt=w.litHtmlPolyfillSupport;null==nt||nt(K,Z),(null!==($=w.litHtmlVersions)&&void 0!==$?$:w.litHtmlVersions=[]).push("2.8.0");const at=window,ot=at.ShadowRoot&&(void 0===at.ShadyCSS||at.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),st=new WeakMap;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let lt=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ot&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=st.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&st.set(e,t))}return t}toString(){return this.cssText}};const ut=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new lt(i,t,rt)},dt=ot?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new lt("string"==typeof t?t:t+"",void 0,rt))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ct;const ht=window,_t=ht.trustedTypes,mt=_t?_t.emptyScript:"",pt=ht.reactiveElementPolyfillSupport,gt={toAttribute(t,e){switch(e){case Boolean:t=t?mt:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},vt=(t,e)=>e!==t&&(e==e||t==t),ft={attribute:!0,type:String,converter:gt,reflect:!1,hasChanged:vt},bt="finalized";class yt extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const n=this._$Ep(i,e);void 0!==n&&(this._$Ev.set(n,i),t.push(n))}),t}static createProperty(t,e=ft){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const a=this[t];this[e]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||ft}static finalize(){if(this.hasOwnProperty(bt))return!1;this[bt]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(dt(t))}else void 0!==t&&e.push(dt(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{ot?t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(e=>{const i=document.createElement("style"),n=at.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)})})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=ft){var n;const a=this.constructor._$Ep(t,i);if(void 0!==a&&!0===i.reflect){const o=(void 0!==(null===(n=i.converter)||void 0===n?void 0:n.toAttribute)?i.converter:gt).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,a=n._$Ev.get(t);if(void 0!==a&&this._$El!==a){const t=n.getPropertyOptions(a),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:gt;this._$El=a,this[a]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||vt)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var $t,wt;yt[bt]=!0,yt.elementProperties=new Map,yt.elementStyles=[],yt.shadowRootOptions={mode:"open"},null==pt||pt({ReactiveElement:yt}),(null!==(ct=ht.reactiveElementVersions)&&void 0!==ct?ct:ht.reactiveElementVersions=[]).push("1.6.3");class kt extends yt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var n,a;const o=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let r=o._$litPart$;if(void 0===r){const t=null!==(a=null==i?void 0:i.renderBefore)&&void 0!==a?a:null;o._$litPart$=r=new Z(e.insertBefore(j(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}kt.finalized=!0,kt._$litElement$=!0,null===($t=globalThis.litElementHydrateSupport)||void 0===$t||$t.call(globalThis,{LitElement:kt});const St=globalThis.litElementPolyfillSupport;null==St||St({LitElement:kt}),(null!==(wt=globalThis.litElementVersions)&&void 0!==wt?wt:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){customElements.define(t,e)}}})(t,e),At=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Et(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):At(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ct(t){return Et({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ot;null===(Ot=window.HTMLSlotElement)||void 0===Ot||Ot.prototype.assignedElements;var jt=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,Mt="[1-9]\\d?",Dt="\\d\\d",Ft="[^\\s]+",zt=/\[([^]*?)\]/gm;function Nt(t,e){for(var i=[],n=0,a=t.length;n<a;n++)i.push(t[n].substr(0,e));return i}var Tt=function(t){return function(e,i){var n=i[t].map(function(t){return t.toLowerCase()}),a=n.indexOf(e.toLowerCase());return a>-1?a:null}};function Ht(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var n=0,a=e;n<a.length;n++){var o=a[n];for(var r in o)t[r]=o[r]}return t}var It=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Pt=["January","February","March","April","May","June","July","August","September","October","November","December"],Lt=Nt(Pt,3),Ut={dayNamesShort:Nt(It,3),dayNames:It,monthNamesShort:Lt,monthNames:Pt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},Rt=Ht({},Ut),Yt=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},Vt={D:function(t){return String(t.getDate())},DD:function(t){return Yt(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return Yt(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return Yt(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return Yt(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return Yt(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return Yt(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return Yt(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return Yt(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return Yt(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return Yt(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return Yt(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+Yt(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+Yt(Math.floor(Math.abs(e)/60),2)+":"+Yt(Math.abs(e)%60,2)}},qt=function(t){return+t-1},Bt=[null,Mt],Kt=[null,Ft],Wt=["isPm",Ft,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],Jt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}],Zt=(Tt("monthNamesShort"),Tt("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"}),Gt=function(t,e,i){if(void 0===e&&(e=Zt.default),void 0===i&&(i={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var n=[];e=(e=Zt[e]||e).replace(zt,function(t,e){return n.push(e),"@@@"});var a=Ht(Ht({},Rt),i);return(e=e.replace(jt,function(e){return Vt[e](t,a)})).replace(/@@@/g,function(){return n.shift()})};var Xt,Qt,te=Gt,ee=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e.language,{year:"numeric",month:"long",day:"numeric"})}:function(t){return te(t,"mediumDate")},ie=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e.language,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return te(t,"haDateTime")},ne=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e.language,{hour:"numeric",minute:"2-digit"})}:function(t){return te(t,"shortTime")};function ae(t){return t.substr(0,t.indexOf("."))}!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Xt||(Xt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Qt||(Qt={}));var oe=function(t,e,i){var n;switch(null==e?void 0:e.number_format){case Xt.comma_decimal:n=["en-US","en"];break;case Xt.decimal_comma:n=["de","es","it"];break;case Xt.space_comma:n=["fr","sv","cs"];break;case Xt.system:n=void 0;break;default:n=null==e?void 0:e.language}if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},!Number.isNaN(Number(t))&&Intl&&(null==e?void 0:e.number_format)!==Xt.none)try{return new Intl.NumberFormat(n,re(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,re(t,i)).format(Number(t))}return t?t.toString():""},re=function(t,e){var i=e||{};if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var n=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=n,i.maximumFractionDigits=n}return i};function se(t,e,i,n){var a=void 0!==n?n:e.state;if("unknown"===a||"unavailable"===a)return t("state.default."+a);if(e.attributes.unit_of_measurement)return oe(a,i)+" "+e.attributes.unit_of_measurement;var o=function(t){return ae(t.entity_id)}(e);if("input_datetime"===o){var r;if(!e.attributes.has_time)return r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),ee(r,i);if(!e.attributes.has_date){var s=new Date;return r=new Date(s.getFullYear(),s.getMonth(),s.getDay(),e.attributes.hour,e.attributes.minute),ne(r,i)}return r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),ie(r,i)}return"humidifier"===o&&"on"===a&&e.attributes.humidity?e.attributes.humidity+" %":"counter"===o||"number"===o?oe(a,i):e.attributes.device_class&&t("component."+o+".state."+e.attributes.device_class+"."+e.state)||t("component."+o+".state._."+e.state)||e.state}var le=["closed","locked","off"],ue=function(t,e,i,n){n=n||{},i=null==i?{}:i;var a=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return a.detail=i,t.dispatchEvent(a),a},de={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function ce(t,e){if(t in de)return de[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"hass:bookmark"}}var he=function(t){ue(window,"haptic",t)},_e=function(t,e){return function(t,e,i){void 0===i&&(i=!0);var n,a=ae(e),o="group"===a?"homeassistant":a;switch(a){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}return t.callService(o,n,{entity_id:e})}(t,e,le.includes(t.states[e].state))},me=function(t,e,i,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(he("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(i.entity||i.camera_image)&&ue(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":n.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),ue(window,"location-changed",{replace:i})}(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":i.entity&&(_e(e,i.entity),he("success"));break;case"call-service":if(!n.service)return void he("failure");var a=n.service.split(".",2);e.callService(a[0],a[1],n.service_data),he("success");break;case"fire-dom-event":ue(t,"ll-custom",n)}};function pe(t){return void 0!==t&&"none"!==t.action}var ge={humidity:"hass:water-percent",illuminance:"hass:brightness-5",temperature:"hass:thermometer",pressure:"hass:gauge",power:"hass:flash",signal_strength:"hass:wifi"},ve={binary_sensor:function(t){var e=t.state&&"off"===t.state;switch(t.attributes.device_class){case"battery":return e?"hass:battery":"hass:battery-outline";case"cold":return e?"hass:thermometer":"hass:snowflake";case"connectivity":return e?"hass:server-network-off":"hass:server-network";case"door":return e?"hass:door-closed":"hass:door-open";case"garage_door":return e?"hass:garage":"hass:garage-open";case"gas":case"power":case"problem":case"safety":case"smoke":return e?"hass:shield-check":"hass:alert";case"heat":return e?"hass:thermometer":"hass:fire";case"light":return e?"hass:brightness-5":"hass:brightness-7";case"lock":return e?"hass:lock":"hass:lock-open";case"moisture":return e?"hass:water-off":"hass:water";case"motion":return e?"hass:walk":"hass:run";case"occupancy":case"presence":return e?"hass:home-outline":"hass:home";case"opening":return e?"hass:square":"hass:square-outline";case"plug":return e?"hass:power-plug-off":"hass:power-plug";case"sound":return e?"hass:music-note-off":"hass:music-note";case"vibration":return e?"hass:crop-portrait":"hass:vibrate";case"window":return e?"hass:window-closed":"hass:window-open";default:return e?"hass:radiobox-blank":"hass:checkbox-marked-circle"}},cover:function(t){var e="closed"!==t.state;switch(t.attributes.device_class){case"garage":return e?"hass:garage-open":"hass:garage";case"door":return e?"hass:door-open":"hass:door-closed";case"shutter":return e?"hass:window-shutter-open":"hass:window-shutter";case"blind":return e?"hass:blinds-open":"hass:blinds";case"window":return e?"hass:window-open":"hass:window-closed";default:return ce("cover",t.state)}},sensor:function(t){var e=t.attributes.device_class;if(e&&e in ge)return ge[e];if("battery"===e){var i=Number(t.state);if(isNaN(i))return"hass:battery-unknown";var n=10*Math.round(i/10);return n>=100?"hass:battery":n<=0?"hass:battery-alert":"hass:battery-"+n}var a=t.attributes.unit_of_measurement;return"°C"===a||"°F"===a?"hass:thermometer":ce("sensor")},input_datetime:function(t){return t.attributes.has_date?t.attributes.has_time?ce("input_datetime"):"hass:calendar":"hass:clock"}};const fe=t=>"string"==typeof t&&t.startsWith("attributes:"),be=(t,e=0)=>{if(!t)return(t=>{const e=[{key:"state",breakAfter:!1},{key:"duration",breakAfter:!0}];for(let i=0;i<t;i++)e.push({key:`attributes:${i}`,breakAfter:i===t-1});return e.push({key:"time",breakAfter:!1}),e})(e);const i=(t=>{const e=["state","duration"];for(let i=0;i<t;i++)e.push(`attributes:${i}`);return e.push("time"),e})(e);if(Array.isArray(t.order)&&t.order.length>0){const n=[];let a=!1;t.order.forEach(t=>{if("attributes"!==t)n.push(t);else if(i.includes("attributes:0")){for(let t=0;t<e;t++)n.push(`attributes:${t}`);a=!0}});const o=n.filter(t=>i.includes(t));i.forEach(t=>{if(!o.includes(t)){if(fe(t)&&a)return;o.push(t)}});const r=Array.isArray(t.line_breaks)?t.line_breaks:[];return o.map(t=>({key:t,breakAfter:r.includes(t)}))}const n=i.map((e,i)=>{const n=fe(e)?"attributes":e,a=t[n];return"number"==typeof a?{key:e,index:i,row:a>=1?a:99,order:99}:{key:e,index:i,row:"number"==typeof(null==a?void 0:a.row)&&a.row>=1?a.row:99,order:"number"==typeof(null==a?void 0:a.order)&&a.order>=1?a.order:99}}).slice().sort((t,e)=>t.row-e.row||t.order-e.order||t.index-e.index);return n.map((t,e)=>({key:t.key,breakAfter:e<n.length-1&&n[e+1].row!==t.row}))},ye=(t,e=0)=>{const i=be(t,e),n=[];let a={left:[],right:[]};return i.forEach(e=>{var i;((t?"right"===(null===(i=t.align)||void 0===i?void 0:i[e.key]):"duration"===e.key)?a.right:a.left).push(e.key),e.breakAfter&&(n.push(a),a={left:[],right:[]})}),(a.left.length>0||a.right.length>0)&&n.push(a),n};var $e={default_no_event:"no event on the period",invalid_configuration:"Invalid configuration",invalid_max_items:"max_items must be an integer",invalid_desc:"desc must be a boolean",invalid_collapse:"collapse must be a positive integer",invalid_minimal_duration:"minimal_duration must be a positive integer",invalid_duration_units:"duration.units must be an array",invalid_duration_largest:"duration.largest must be an integer or `full`",collapse_greater_than_max_items:"collapse must be lower than max-items"},we={default_title:"{entity} History",missing_entity:"Please define an entity.",invalid_hidden_state:"hidden_state must be an array",invalid_state_map:"state_map must be an array",invalid_custom_log_map:"custom_log_map must be an array",invalid_attributes:"attributes must be an array"},ke={required_option_name:"Required",required_option_description:"Required options for this card",general_option_name:"General",general_option_description:"Title, hours to show, date format and other basics",show_option_name:"Show",appearance_option_name:"Appearance",appearance_option_description:"Element layout, styles and separator style",state_map_option_name:"State Mapping",hidden_state_option_name:"Hidden States",attributes_option_name:"Attributes",separator_option_name:"Separator Style",duration_option_name:"Duration",actions_option_name:"Actions",actions_option_description:"Configure tap, hold and double tap actions",entity_label:"Entity (Required)",entity_list_hint:"Add entities to display history. State mapping, hidden states and attributes in Data below apply to the selected entity",entity_label_label:"Display name (Optional)",data_target_entity_label:"Target entity",title_label:"Title (Optional)",hours_to_show_label:"Hours to show",max_items_label:"Max Items: Maximum of events to display (-1 to display all events)",no_event_label:"Text when no event",collapse_label:"Collapse: Number of entities to show. Rest will be available in expandable section",date_format_label:"Date format (e.g. DD/MM/YYYY HH:mm or relative)",desc_label:"Display events by date descending",minimal_duration_label:"Minimal duration (seconds): shorter entries will be squashed",display_state_label:"Display state",display_duration_label:"Display duration",display_start_date_label:"Display start date",display_end_date_label:"Display end date",display_icon_label:"Display icon",show_entity_name_label:"Show entity name",card_wide_label:"The switches below are card-wide (not affected by the appearance target)",appearance_target_label:"Appearance target",display_separator_label:"Display separator",display_custom_logs_label:"Display custom logs",show_history_label:"Display entity logbook event",scroll_label:"Use scrollbar when max height is reached",group_by_day_label:"Group entries by day",state_map_value_label:"State value (wildcards supported)",state_map_replacement_label:"Replacement",attribute_map_value_label:"Original value (wildcards supported)",attribute_map_add_label:"Add value mapping",state_map_icon_label:"Icon (e.g. mdi:lightbulb)",state_map_icon_color_label:"Icon color",attribute_value_label:"Attribute name",attribute_hide_label_label:"Hide labels (value shown in place of label)",layout_hint:"The preview shows how elements are arranged in each row. Pick a row and alignment for each element; use ◀ ▶ to reorder within the same side",layout_elem_state:"State",layout_elem_duration:"Duration",layout_elem_attributes:"Attributes",layout_elem_time:"Time",layout_option_name:"Element layout",layout_row_label:"Row",layout_align_label:"Alignment",layout_row_n:"Row {n}",layout_align_left:"Left",layout_align_right:"Right",layout_move_up:"Move earlier",layout_move_down:"Move later",styles_option_name:"Element styles",style_color_label:"Color",style_size_label:"Size",style_clear_label:"Reset",font_unit_label:"Font size unit",data_option_name:"Data",data_option_description:"State mapping, hidden states, attributes, duration labels",show_title_label:"Show title",title_placeholder:"Leave empty to hide the title",date_format_default:"Default (follow HA locale)",date_format_relative:"Relative time",date_format_custom:"Custom",date_format_custom_input:"Custom format (fecha syntax)",sep_width_default:"Default (1px)",duration_largest_default:"Default (1 unit)",duration_largest_full:"All units",unit_year:"Year",unit_week:"Week",unit_day:"Day",unit_hour:"Hour",unit_minute:"Minute",unit_second:"Second",attribute_label_label:"Replacement name (optional)",attribute_type_label:"Format type",attribute_type_none:"None",attribute_type_date:"Date",attribute_type_url:"URL",attribute_link_label:"Link label",separator_width_label:"Width",separator_style_label:"Style",separator_color_label:"Color",duration_largest_label:"Max units to display (full = no limit)",duration_delimiter_label:"Delimiter between units",duration_units_label:"Units (comma separated: y,mo,w,d,h,m,s,ms)",duration_labels_title:"Custom labels",duration_second_label:"second",duration_minute_label:"minute",duration_hour_label:"hour",duration_day_label:"day",duration_week_label:"week",duration_month_label:"month",tap_action_label:"Tap action",hold_action_label:"Hold action",double_tap_action_label:"Double tap action",action_none:"None",action_more_info:"More info",action_toggle:"Toggle",action_call_service:"Call service",action_navigate:"Navigate",action_url:"Open URL",action_navigation_path_label:"Navigation path (e.g. /lovelace/0/)",action_url_label:"URL (opens in new tab)",action_service_label:"Service (e.g. light.turn_on)",action_service_data_label:"Service data (JSON)",action_haptic_label:"Haptic feedback (success/warning/failure/light/medium/heavy/selection)",action_repeat_label:"Repeat interval for hold action (ms)",add_item_label:"+ Add",remove_item_label:"Remove",hidden_state_objects_hint:"hidden_state contains object format (with attribute matching), only editable in code editor"},Se={common:$e,logbook_card:we,editor:ke},xe=Object.freeze({__proto__:null,common:$e,default:Se,editor:ke,logbook_card:we}),Ae={default_no_event:"aucun événement sur la période",invalid_configuration:"Configuration invalide",invalid_max_items:"max_items doit être un entier",invalid_desc:"desc doit être un booléen",invalid_collapse:"collapse doit être un entier positif",invalid_minimal_duration:"minimal_duration doit être un entier positif",invalid_duration_units:"duration.units doit être un tableau",invalid_duration_largest:"duration.largest doit être un entier ou `full`",collapse_greater_than_max_items:"collapse doit être supérieur à max-items"},Ee={default_title:"Historique de {entity}",missing_entity:"Merci de définir une entité",invalid_hidden_state:"hidden_state doit être un tableau",invalid_state_map:"state_map doit être un tableau",invalid_custom_log_map:"custom_log_map doit être un tableau",invalid_attributes:"attributes doit être un tableau"},Ce={required_option_name:"Requis",required_option_description:"Options requises pour la carte",show_option_name:"Affichage",show_option_description:"Configurer les éléments à afficher",appearance_option_name:"Appareance",appearance_option_description:"Configurer le titre, nombre d'entrée à afficher, etc ...",entity_label:"Entité (Requis)",title_label:"Titre (Optionel)",hours_to_show_label:"Heures à afficher",max_items_label:"Max Items: Maximum d'entrée à afficher (-1 pour les afficher tous)",no_event_label:"Texte si aucune entrée",collapse_label:"Collapse: Nombre des entrées à afficher. Les entrées suivantes seront affichés dans une section retractable",date_format_label:"Format d'affichage des dates",desc_label:"Afficher les entrées par date décroissante",display_state_label:"Afficher l'état",display_duration_label:"Afficher la durée",display_start_date_label:"Afficher la date de début",display_end_date_label:"Afficher la date de fin",display_icon_label:"Afficher l'icône",display_separator_label:"Afficher le séparateur",display_custom_logs_label:"Afficher les entrées personnalisées du journal"},Oe={common:Ae,logbook_card:Ee,editor:Ce},je=Object.freeze({__proto__:null,common:Ae,default:Oe,editor:Ce,logbook_card:Ee}),Me={invalid_configuration:"Ikke gyldig konfiguration"},De={common:Me},Fe=Object.freeze({__proto__:null,common:Me,default:De}),ze={default_no_event:"此时间段内没有事件",invalid_configuration:"配置无效",invalid_max_items:"max_items 必须是整数",invalid_desc:"desc 必须是布尔值",invalid_collapse:"collapse 必须是正整数",invalid_minimal_duration:"minimal_duration 必须是正整数",invalid_duration_units:"duration.units 必须是数组",invalid_duration_largest:"duration.largest 必须是整数或 `full`",collapse_greater_than_max_items:"collapse 必须小于 max-items"},Ne={default_title:"{entity} 历史记录",missing_entity:"请定义一个实体",invalid_hidden_state:"hidden_state 必须是数组",invalid_state_map:"state_map 必须是数组",invalid_custom_log_map:"custom_log_map 必须是数组",invalid_attributes:"attributes 必须是数组"},Te={required_option_name:"必填",required_option_description:"此卡片的必填选项",general_option_name:"配置",general_option_description:"标题、显示时长、日期格式等基础配置",show_option_name:"显示",appearance_option_name:"外观",appearance_option_description:"元素布局、样式与分隔符样式",state_map_option_name:"状态映射",hidden_state_option_name:"隐藏状态",attributes_option_name:"属性",separator_option_name:"分隔符样式",duration_option_name:"持续时间",actions_option_name:"动作",actions_option_description:"配置点击、长按、双击卡片时执行的动作",entity_label:"实体（必填）",entity_list_hint:"添加要显示历史的实体，下方数据配置中的状态映射、隐藏状态、属性会作用于所选实体",entity_label_label:"显示名称（可选）",data_target_entity_label:"配置目标实体",title_label:"标题（可选）",hours_to_show_label:"显示小时数",max_items_label:"最大条目数：显示的最大事件数（-1 显示所有事件）",no_event_label:"无事件时显示的文本",collapse_label:"折叠：显示的条目数量。其余条目将在可展开区域中显示",date_format_label:"日期格式（如 DD/MM/YYYY HH:mm 或 relative）",desc_label:"按日期降序显示事件",minimal_duration_label:"最短持续时间（秒）：小于此值的条目将被合并",display_state_label:"显示状态",display_duration_label:"显示持续时间",display_start_date_label:"显示开始日期",display_end_date_label:"显示结束日期",display_icon_label:"显示图标",show_entity_name_label:"显示实体名",card_wide_label:"以下开关为卡片全局设置（不受配置对象影响）",appearance_target_label:"配置对象",display_separator_label:"显示分隔符",display_custom_logs_label:"显示自定义日志",show_history_label:"显示实体历史事件",scroll_label:"超出最大高度时使用滚动条",group_by_day_label:"按天分组显示",state_map_value_label:"状态值（支持通配符）",state_map_replacement_label:"替换值",attribute_map_value_label:"原始值（支持通配符）",attribute_map_add_label:"添加值映射",state_map_icon_label:"图标（如 mdi:lightbulb）",state_map_icon_color_label:"图标颜色",attribute_value_label:"属性名",attribute_hide_label_label:"隐藏标签（值显示在标签位置）",layout_hint:"预览区实时展示条目布局；为每个元素选择所在行与对齐方式，◀ ▶ 调整同行同侧的先后顺序",layout_elem_state:"状态",layout_elem_duration:"持续时间",layout_elem_attributes:"属性",layout_elem_time:"时间",layout_option_name:"元素布局",layout_row_label:"所在行",layout_align_label:"对齐方式",layout_row_n:"第 {n} 行",layout_align_left:"靠左",layout_align_right:"靠右",layout_move_up:"前移",layout_move_down:"后移",styles_option_name:"元素样式",style_color_label:"颜色",style_size_label:"字号",style_clear_label:"恢复默认",font_unit_label:"字号单位",data_option_name:"数据配置",data_option_description:"状态映射、隐藏状态、属性、持续时间标签",show_title_label:"显示标题",title_placeholder:"留空则不显示标题",date_format_default:"默认（跟随HA语言）",date_format_relative:"相对时间",date_format_custom:"自定义",date_format_custom_input:"自定义格式（fecha 语法）",sep_width_default:"默认（1px）",duration_largest_default:"默认（1个单位）",duration_largest_full:"全部单位",unit_year:"年",unit_week:"周",unit_day:"天",unit_hour:"时",unit_minute:"分",unit_second:"秒",attribute_label_label:"替换属性名（可选）",attribute_type_label:"格式类型",attribute_type_none:"无",attribute_type_date:"日期",attribute_type_url:"链接",attribute_link_label:"链接文字",separator_width_label:"宽度",separator_style_label:"样式",separator_color_label:"颜色",duration_largest_label:"最多显示的单位数（full 表示不限制）",duration_delimiter_label:"单位之间的分隔符",duration_units_label:"使用的单位（逗号分隔：y,mo,w,d,h,m,s,ms）",duration_labels_title:"自定义标签",duration_second_label:"秒",duration_minute_label:"分",duration_hour_label:"时",duration_day_label:"天",duration_week_label:"周",duration_month_label:"月",tap_action_label:"单击动作",hold_action_label:"长按动作",double_tap_action_label:"双击动作",action_none:"无",action_more_info:"更多信息",action_toggle:"切换开关",action_call_service:"调用服务",action_navigate:"导航",action_url:"打开 URL",action_navigation_path_label:"导航路径（如 /lovelace/0/）",action_url_label:"URL（新标签页打开）",action_service_label:"服务（如 light.turn_on）",action_service_data_label:"服务数据（JSON）",action_haptic_label:"触觉反馈（success/warning/failure/light/medium/heavy/selection）",action_repeat_label:"长按重复间隔（毫秒）",add_item_label:"+ 添加",remove_item_label:"删除",hidden_state_objects_hint:"当前 hidden_state 包含对象格式（含 attribute 匹配），仅可通过代码编辑器编辑"},He={common:ze,logbook_card:Ne,editor:Te},Ie=Object.freeze({__proto__:null,common:ze,default:He,editor:Te,logbook_card:Ne});const Pe={en:xe,fr:je,nb:Fe,zh:Ie,zh_Hans:Ie,zh_Hant:Ie},Le="en";let Ue=null;function Re(t){t&&(Ue=t)}const Ye=t=>Object.keys(Pe).includes(t),Ve=()=>{const t=(()=>{if(!Ue)return null;try{if(Ue.locale&&Ue.locale.language)return Ue.locale.language;if(Ue.language)return Ue.language;if(Ue.selectedLanguage)return Ue.selectedLanguage}catch(t){}return null})();if(t)return t;try{const t=localStorage.getItem("selectedLanguage");if(t)return t}catch(t){}try{if(navigator.language)return navigator.language}catch(t){}return"en"};function qe(t,e="",i=""){var n,a,o,r;const s=t.split(".")[0],l=t.split(".")[1];let u=(t=>{const e=t.replace(/['"]+/g,"").replace(/[-:]/g,"_").toLowerCase();if(Ye(e))return e;const i=e.split("_");for(let t=i.length;t>=1;t--){const e=i.slice(0,t).join("_");if(Ye(e))return e}return Le})(Ve()),d=null===(a=null===(n=Pe[u])||void 0===n?void 0:n[s])||void 0===a?void 0:a[l];return void 0===d&&u!==Le&&(d=null===(r=null===(o=Pe[Le])||void 0===o?void 0:o[s])||void 0===r?void 0:r[l]),void 0===d?t:(""!==e&&""!==i&&(d=d.replace(e,i)),d)}const Be=["required","general","appearance","dataConfig","actions"],Ke=["YYYY-MM-DD HH:mm","YYYY-MM-DD","MM-DD HH:mm","HH:mm"],We="__custom__",Je={required:!0,general:!1,appearance:!1,dataConfig:!1,actions:!1};function Ze(t){const e={required:{icon:"tune",nameKey:"editor.required_option_name",secondaryKey:"editor.required_option_description"},general:{icon:"cog",nameKey:"editor.general_option_name",secondaryKey:"editor.general_option_description"},appearance:{icon:"palette",nameKey:"editor.appearance_option_name",secondaryKey:"editor.appearance_option_description"},dataConfig:{icon:"database",nameKey:"editor.data_option_name",secondaryKey:"editor.data_option_description"},actions:{icon:"gesture-tap",nameKey:"editor.actions_option_name",secondaryKey:"editor.actions_option_description"}}[t];return{icon:e.icon,name:qe(e.nameKey),secondary:qe(e.secondaryKey),show:Je[t]}}const Ge=["tap_action","hold_action","double_tap_action"],Xe=["solid","dashed","dotted","double","none"],Qe=["second","minute","hour","day","week","month"],ti=["rem","px","em","%"],ei={rem:{min:.6,max:2,step:.05},em:{min:.6,max:2,step:.05},px:{min:10,max:40,step:1},"%":{min:60,max:200,step:5}};let ii=class extends kt{constructor(){super(...arguments),this._subOpen={show:!0,layout:!1,styles:!1,separator:!1,stateMap:!1,hiddenState:!1,attributes:!1,duration:!1},this._activeEntityIndex=0,this._appearanceTarget=0,this._dateFormatCustom=!1}set hass(t){t&&Re(t),this._hass=t,this.requestUpdate("hass",this._prevHass),this._prevHass=t}get hass(){return this._hass}_appearanceBundle(){var t,e;const i=this._config,n=(null!==(t=null==i?void 0:i.entities)&&void 0!==t?t:[])[this._appearanceTarget];return{show:(null==n?void 0:n.show)?Object.assign(Object.assign({},null==i?void 0:i.show),n.show):null==i?void 0:i.show,layout:null!==(e=null==n?void 0:n.layout)&&void 0!==e?e:null==i?void 0:i.layout,element_styles:(null==n?void 0:n.element_styles)?Object.assign(Object.assign({},null==i?void 0:i.element_styles),n.element_styles):null==i?void 0:i.element_styles}}_appearanceOwnEntity(){var t,e,i;const n=null!==(e=null===(t=this._config)||void 0===t?void 0:t.entities)&&void 0!==e?e:[];return null!==(i=n[Math.min(Math.max(this._appearanceTarget,0),Math.max(n.length-1,0))])&&void 0!==i?i:{}}_writeAppearance(t){var e;if(!this._config||!this.hass)return;const i=Object.assign({},this._config),n=[...null!==(e=i.entities)&&void 0!==e?e:[]],a=Math.min(Math.max(this._appearanceTarget,0),Math.max(n.length-1,0)),o=Object.assign({},n[a]);void 0!==t.show&&(o.show=Object.keys(t.show).length>0?t.show:void 0),void 0!==t.layout&&(o.layout=t.layout),void 0!==t.element_styles&&(o.element_styles=Object.keys(t.element_styles).length>0?t.element_styles:void 0),n[a]=o,i.entities=n,this._config=i,ue(this,"config-changed",{config:this._config})}_appearanceAttrCount(){const t=this._appearanceOwnEntity();return Array.isArray(t.attributes)?t.attributes.length:0}_attrKeyLabel(t){const e=/^attributes:(\d+)$/.exec(String(t));if(!e)return qe(`editor.layout_elem_${t}`);const i=Number.parseInt(e[1]),n=this._appearanceAttrs()[i],a=(null==n?void 0:n.label)||(null==n?void 0:n.value);return a?`${qe("editor.layout_elem_attributes")} · ${a}`:`${qe("editor.layout_elem_attributes")} ${i+1}`}_appearanceAttrs(){const t=this._appearanceOwnEntity().attributes;return Array.isArray(t)?t:[]}_normalizeConfig(t){if(Array.isArray(t.entities))return t;const e={entity:t.entity,label:void 0,attributes:t.attributes,state_map:t.state_map,hidden_state:t.hidden_state,custom_logs:t.custom_logs,custom_log_map:t.custom_log_map},i=Object.assign({},t);return delete i.entity,delete i.attributes,delete i.state_map,delete i.hidden_state,delete i.custom_logs,delete i.custom_log_map,i.entities=[e],i}get _activeEntity(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.entities;if(Array.isArray(e)&&0!==e.length)return e[Math.min(this._activeEntityIndex,e.length-1)]}readEntityField(t){var e;return null===(e=this._activeEntity)||void 0===e?void 0:e[t]}writeEntityField(t,e){var i;if(!this._config||!this.hass)return;const n=Object.assign({},this._config),a=[...null!==(i=n.entities)&&void 0!==i?i:[]];0===a.length&&a.push({});const o=Math.min(Math.max(this._activeEntityIndex,0),a.length-1),r=Object.assign({},a[o]);void 0===e?delete r[t]:r[t]=e,a[o]=r,n.entities=a,this._config=n,ue(this,"config-changed",{config:this._config})}_entityDisplayName(t,e){var i,n;if(t.label)return t.label;const a=t.entity;return(a&&(null===(i=this.hass)||void 0===i?void 0:i.states)&&a in this.hass.states?null===(n=this.hass.states[a].attributes)||void 0===n?void 0:n.friendly_name:void 0)||a||`${qe("editor.entity_label")} ${e+1}`}_addEntity(){var t;if(!this._config||!this.hass)return;const e=Object.assign({},this._config);e.entities=[...null!==(t=e.entities)&&void 0!==t?t:[],{entity:""}],this._config=e,this._activeEntityIndex=e.entities.length-1,ue(this,"config-changed",{config:this._config})}_removeEntity(t){var e;if(!this._config||!this.hass)return;const i=Object.assign({},this._config),n=[...null!==(e=i.entities)&&void 0!==e?e:[]];n.splice(t,1),i.entities=n,this._activeEntityIndex>=n.length&&(this._activeEntityIndex=Math.max(0,n.length-1)),this._appearanceTarget>n.length-1&&(this._appearanceTarget=Math.max(0,n.length-1)),this._config=i,ue(this,"config-changed",{config:this._config})}_updateEntityField(t,e,i){var n;if(!this._config||!this.hass)return;const a=Object.assign({},this._config),o=[...null!==(n=a.entities)&&void 0!==n?n:[]],r=Object.assign({},o[t]);""===i?delete r[e]:r[e]=i,o[t]=r,a.entities=o,this._config=a,ue(this,"config-changed",{config:this._config})}_renderEntitiesList(){var t;const e=Array.isArray(null===(t=this._config)||void 0===t?void 0:t.entities)?this._config.entities:[];return U`
      <p class="hint">${qe("editor.entity_list_hint")}</p>
      ${e.map((t,e)=>{var i,n;return U`
          <div class="list-row entity-row ${this._activeEntityIndex===e?"active":""}">
            <button
              class="remove-btn"
              title=${qe("editor.remove_item_label")}
              @click=${()=>this._removeEntity(e)}
            >
              ✕
            </button>
            <div class="entity-row-index">${e+1}</div>
            <ha-entity-picker
              class="full"
              .hass=${this.hass}
              .label=${qe("editor.entity_label")}
              .value=${null!==(i=t.entity)&&void 0!==i?i:""}
              .allowCustomEntity=${!1}
              @value-changed=${t=>{var i,n;return this._updateEntityField(e,"entity",null!==(n=null===(i=t.detail)||void 0===i?void 0:i.value)&&void 0!==n?n:"")}}
            ></ha-entity-picker>
            <label class="field full">
              <span class="field-label">${qe("editor.entity_label_label")}</span>
              <input
                type="text"
                .value=${null!==(n=t.label)&&void 0!==n?n:""}
                .placeholder=${this._entityDisplayName(t,e)}
                @input=${t=>this._updateEntityField(e,"label",t.target.value)}
              />
            </label>
          </div>
        `})}
      <button class="add-btn" @click=${this._addEntity}>${qe("editor.add_item_label")}</button>
    `}_toggleSub(t){const e=t.currentTarget.sub;this._subOpen=Object.assign(Object.assign({},this._subOpen),{[e]:!this._subOpen[e]})}_subSection(t,e,i){const n=this._subOpen[t];return U`
      <div class="suboption" @click=${this._toggleSub} .sub=${t}>
        <ha-icon class="suboption-chevron" .icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        <div class="suboption-title">${e}</div>
      </div>
      ${n?U`
            <div class="values sub-values">${i}</div>
          `:""}
    `}_renderShowToggles(){return U`
      <ha-formfield .label=${qe("editor.display_state_label")}>
        <ha-switch
          aria-label=${"Toggle display of state "+(this._show_state?"off":"on")}
          .checked=${!1!==this._show_state}
          .configValue=${"state"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.display_duration_label")}>
        <ha-switch
          aria-label=${"Toggle display of duration "+(this._show_duration?"off":"on")}
          .checked=${!1!==this._show_duration}
          .configValue=${"duration"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.display_start_date_label")}>
        <ha-switch
          aria-label=${"Toggle display of start date "+(this._show_start_date?"off":"on")}
          .checked=${!1!==this._show_start_date}
          .configValue=${"start_date"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.display_end_date_label")}>
        <ha-switch
          aria-label=${"Toggle display of end date "+(this._show_end_date?"off":"on")}
          .checked=${!1!==this._show_end_date}
          .configValue=${"end_date"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.display_icon_label")}>
        <ha-switch
          aria-label=${"Toggle display of icon "+(this._show_icon?"off":"on")}
          .checked=${!0===this._show_icon}
          .configValue=${"icon"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.show_entity_name_label")}>
        <ha-switch
          aria-label=${"Toggle display of entity name "+(this._show_entity_name?"off":"on")}
          .checked=${this._show_entity_name}
          .configValue=${"entity_name"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <p class="sub-hint">${qe("editor.card_wide_label")}</p>
      <ha-formfield .label=${qe("editor.show_history_label")}>
        <ha-switch
          aria-label=${"Toggle display of history "+(this._show_history?"off":"on")}
          .checked=${this._show_history}
          .configValue=${"show_history"}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.scroll_label")}>
        <ha-switch
          aria-label=${"Toggle scroll "+(this._scroll?"off":"on")}
          .checked=${this._scroll}
          .configValue=${"scroll"}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${qe("editor.group_by_day_label")}>
        <ha-switch
          aria-label=${"Toggle group by day "+(this._group_by_day?"off":"on")}
          .checked=${this._group_by_day}
          .configValue=${"group_by_day"}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
    `}_layoutKeys(){const t=this._appearanceAttrCount(),e=["state","duration"];for(let i=0;i<t;i++)e.push(`attributes:${i}`);return e.push("time"),e}_layoutAssign(){const t=this._appearanceBundle().layout,e=be(t,this._appearanceAttrCount()),i={};let n=1;return e.forEach(e=>{var a;const o=t?"right"===(null===(a=t.align)||void 0===a?void 0:a[e.key])?"right":"left":"duration"===e.key?"right":"left";i[e.key]={row:n,align:o},e.breakAfter&&n++}),i}_renderLayoutPreview(){const t=ye(this._appearanceBundle().layout,this._appearanceAttrCount()),e=t=>U`
        <span class="layout-chip">${this._attrKeyLabel(t)}</span>
      `;return U`
      <div class="layout-preview">
        ${t.map(t=>U`
            <div class="layout-preview-row">
              <div class="layout-preview-side">${t.left.map(e)}</div>
              ${t.right.length?U`
                    <div class="layout-preview-side layout-preview-right">${t.right.map(e)}</div>
                  `:""}
            </div>
          `)}
      </div>
    `}_renderLayoutEditor(){const t=this._layoutAssign(),e=this._layoutKeys();return U`
      <p class="hint">${qe("editor.layout_hint")}</p>
      ${this._renderLayoutPreview()}
      <div class="layout-config">
        ${e.map(e=>{var i;const n=null!==(i=t[e])&&void 0!==i?i:{row:1,align:"left"};return U`
            <div class="layout-config-row">
              <span class="layout-config-name">${this._attrKeyLabel(e)}</span>
              <select
                class="native-select"
                title=${qe("editor.layout_row_label")}
                @change=${t=>this._layoutRowChanged(e,Number.parseInt(t.target.value))}
              >
                ${[1,2,3,4].map(t=>U`
                    <option value=${t} ?selected=${n.row===t}
                      >${qe("editor.layout_row_n","{n}",String(t))}</option
                    >
                  `)}
              </select>
              <select
                class="native-select"
                title=${qe("editor.layout_align_label")}
                @change=${t=>this._layoutAlignChanged(e,t.target.value)}
              >
                <option value="left" ?selected=${"left"===n.align}>${qe("editor.layout_align_left")}</option>
                <option value="right" ?selected=${"right"===n.align}>${qe("editor.layout_align_right")}</option>
              </select>
              <button
                type="button"
                class="layout-btn"
                title=${qe("editor.layout_move_up")}
                @click=${()=>this._layoutOrderMove(e,-1)}
              >
                ◀
              </button>
              <button
                type="button"
                class="layout-btn"
                title=${qe("editor.layout_move_down")}
                @click=${()=>this._layoutOrderMove(e,1)}
              >
                ▶
              </button>
            </div>
          `})}
      </div>
    `}_writeLayoutAssign(t,e){if(!this._config||!this.hass)return;const i=this._layoutKeys(),n=null!=e?e:be(this._appearanceBundle().layout,this._appearanceAttrCount()).map(t=>t.key),a=t=>{const e=n.indexOf(t);return e<0?99:e},o=Array.from(new Set(i.map(e=>{var i,n;return null!==(n=null===(i=t[e])||void 0===i?void 0:i.row)&&void 0!==n?n:1}))).sort((t,e)=>t-e),r=[],s=[];o.forEach((e,n)=>{const l=i.filter(i=>{var n,a;return(null!==(a=null===(n=t[i])||void 0===n?void 0:n.row)&&void 0!==a?a:1)===e}),u=l.filter(e=>{var i,n;return"left"===(null!==(n=null===(i=t[e])||void 0===i?void 0:i.align)&&void 0!==n?n:"left")}).sort((t,e)=>a(t)-a(e)),d=l.filter(e=>{var i,n;return"right"===(null!==(n=null===(i=t[e])||void 0===i?void 0:i.align)&&void 0!==n?n:"left")}).sort((t,e)=>a(t)-a(e));r.push(...u,...d),n<o.length-1&&s.push(r[r.length-1])});const l={order:r,line_breaks:s},u={};i.forEach(e=>{var i,n;"right"===(null!==(n=null===(i=t[e])||void 0===i?void 0:i.align)&&void 0!==n?n:"left")&&(u[e]="right")}),Object.keys(u).length>0&&(l.align=u),this._writeAppearance({layout:l})}_layoutRowChanged(t,e){var i;if(Number.isNaN(e))return;const n=this._layoutAssign();n[t]=Object.assign(Object.assign({},null!==(i=n[t])&&void 0!==i?i:{row:1,align:"left"}),{row:e}),this._writeLayoutAssign(n)}_layoutAlignChanged(t,e){var i;const n=this._layoutAssign();n[t]=Object.assign(Object.assign({},null!==(i=n[t])&&void 0!==i?i:{row:1,align:"left"}),{align:e}),this._writeLayoutAssign(n)}_layoutOrderMove(t,e){const i=be(this._appearanceBundle().layout,this._appearanceAttrCount()).map(t=>t.key),n=this._layoutAssign(),a=this._layoutKeys().filter(e=>{var i,a,o,r,s,l,u,d;return(null!==(a=null===(i=n[e])||void 0===i?void 0:i.row)&&void 0!==a?a:1)===(null!==(r=null===(o=n[t])||void 0===o?void 0:o.row)&&void 0!==r?r:1)&&(null!==(l=null===(s=n[e])||void 0===s?void 0:s.align)&&void 0!==l?l:"left")===(null!==(d=null===(u=n[t])||void 0===u?void 0:u.align)&&void 0!==d?d:"left")});a.sort((t,e)=>i.indexOf(t)-i.indexOf(e));const o=a.indexOf(t),r=a[o+e];if(!r)return;const s=i.indexOf(t),l=i.indexOf(r);i[s]=r,i[l]=t,this._writeLayoutAssign(n,i)}_renderStyleRows(){return U`
      <div class="style-row style-head">
        <span class="style-label"></span>
        <span class="style-col">${qe("editor.style_color_label")}</span>
        <span class="style-col">${qe("editor.style_size_label")}</span>
        <span class="style-col"></span>
      </div>
      ${["state","duration","attributes","time"].map(t=>this._styleRow(t))}
    `}_renderSeparatorFields(){return U`
      <ha-formfield .label=${qe("editor.display_separator_label")}>
        <ha-switch
          aria-label=${"Toggle display of event separator "+(this._show_separator?"off":"on")}
          .checked=${this._show_separator}
          .configValue=${"separator"}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <div class="select-wrap">
        <label class="select-label">${qe("editor.separator_width_label")}</label>
        <select
          class="native-select"
          @change=${t=>this._separatorStyleChanged("width",t.target.value)}
        >
          ${[{v:"",l:qe("editor.sep_width_default")},{v:"1",l:"1px"},{v:"2",l:"2px"},{v:"3",l:"3px"},{v:"4",l:"4px"},{v:"5",l:"5px"}].map(t=>U`
              <option
                value=${t.v}
                ?selected=${String(this._sep_width)===t.v||""===t.v&&""===this._sep_width}
              >
                ${t.l}
              </option>
            `)}
        </select>
      </div>
      <div class="select-wrap">
        <label class="select-label">${qe("editor.separator_style_label")}</label>
        <div class="sep-styles">
          ${Xe.map(t=>{const e=(i=this._sep_style||void 0,(Xe.includes(null!=i?i:"")?i:"solid")===t);var i;return U`
              <button
                type="button"
                class="sep-style-btn ${e?"active":""}"
                title=${t}
                @click=${()=>this._separatorStyleChanged("style",t)}
              >
                <span class="sep-style-line" style=${`border-top-style: ${t}`}></span>
              </button>
            `})}
        </div>
      </div>
      <label class="field">
        <span class="field-label">${qe("editor.separator_color_label")}</span>
        <input
          type="color"
          class="style-color"
          .value=${this._sep_color||this._cssVar("--divider-color","#dddddd")}
          @change=${t=>this._separatorStyleChanged("color",t.target.value)}
        />
      </label>
    `}_renderEntityTargetSelector(t,e,i){var n;const a=Array.isArray(null===(n=this._config)||void 0===n?void 0:n.entities)?this._config.entities:[];return 0===a.length?U``:U`
      <div class="select-wrap">
        <label class="select-label">${t}</label>
        <select
          class="native-select"
          @change=${t=>{const e=Number.parseInt(t.target.value);Number.isNaN(e)||i(e)}}
        >
          ${a.map((t,i)=>U`
              <option value=${i} ?selected=${e===i}>${this._entityDisplayName(t,i)}</option>
            `)}
        </select>
      </div>
    `}_renderStateMapList(){return U`
      ${this._state_map.map((t,e)=>U`
          <div class="list-row">
            <button
              class="remove-btn"
              title=${qe("editor.remove_item_label")}
              @click=${()=>this._removeStateMapItem(e)}
            >
              ✕
            </button>
            <label class="field full">
              <span class="field-label">${qe("editor.state_map_value_label")}</span>
              <input
                type="text"
                .value=${t.value||""}
                @input=${t=>this._updateStateMapItem(e,"value",t.target.value)}
              />
            </label>
            <label class="field">
              <span class="field-label">${qe("editor.state_map_replacement_label")}</span>
              <input
                type="text"
                .value=${t.label||""}
                @input=${t=>this._updateStateMapItem(e,"label",t.target.value)}
              />
            </label>
            <ha-icon-picker
              class="icon-picker"
              .hass=${this.hass}
              .value=${t.icon||void 0}
              .label=${qe("editor.state_map_icon_label")}
              @value-changed=${t=>{var i,n;return this._updateStateMapItem(e,"icon",null!==(n=null===(i=t.detail)||void 0===i?void 0:i.value)&&void 0!==n?n:"")}}
            ></ha-icon-picker>
            <label class="field">
              <span class="field-label">${qe("editor.state_map_icon_color_label")}</span>
              <input
                type="color"
                class="style-color"
                .value=${t.icon_color||"#000000"}
                @change=${t=>this._updateStateMapItem(e,"icon_color",t.target.value)}
              />
            </label>
          </div>
        `)}
      <button class="add-btn" @click=${this._addStateMapItem}>
        ${qe("editor.add_item_label")}
      </button>
    `}_renderHiddenState(){return U`
      ${this._hidden_state_has_objects?U`
            <p class="hint">${qe("editor.hidden_state_objects_hint")}</p>
          `:""}
      <label class="field">
        <span class="field-label">${qe("editor.hidden_state_option_name")}</span>
        <textarea
          rows="4"
          .value=${this._hidden_state_text}
          ?disabled=${this._hidden_state_has_objects}
          @input=${this._hiddenStateChanged}
        ></textarea>
      </label>
    `}_renderAttributesList(){const t=this._entityAttributeNames();return U`
      <ha-formfield .label=${qe("editor.attribute_hide_label_label")}>
        <ha-switch
          aria-label=${"Toggle hide attribute labels "+(this._attribute_hide_label?"off":"on")}
          .checked=${this._attribute_hide_label}
          .configValue=${"attribute_hide_label"}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      ${this._attributes.map((e,i)=>{var n;return U`
          <div class="list-row">
            <button
              class="remove-btn"
              title=${qe("editor.remove_item_label")}
              @click=${()=>this._removeAttributeItem(i)}
            >
              ✕
            </button>
            <label class="field full">
              <span class="field-label">${qe("editor.attribute_value_label")}</span>
              <select
                class="native-select"
                @change=${t=>this._updateAttributeItem(i,"value",t.target.value)}
              >
                <option value="" ?selected=${!e.value}>—</option>
                ${t.map(t=>U`
                    <option value=${t} ?selected=${e.value===t}>${t}</option>
                  `)}
                ${e.value&&!t.includes(e.value)?U`
                      <option value=${e.value} ?selected>${e.value}</option>
                    `:""}
              </select>
            </label>
            <label class="field">
              <span class="field-label">${qe("editor.attribute_label_label")}</span>
              <input
                type="text"
                .value=${e.label||""}
                @input=${t=>this._updateAttributeItem(i,"label",t.target.value)}
              />
            </label>
            <div class="select-wrap">
              <label class="select-label">${qe("editor.attribute_type_label")}</label>
              <select
                class="native-select"
                @change=${t=>this._updateAttributeItem(i,"type",t.target.value)}
              >
                <option value="" ?selected=${!e.type}>
                  ${qe("editor.attribute_type_none")}
                </option>
                <option value="date" ?selected=${"date"===e.type}>
                  ${qe("editor.attribute_type_date")}
                </option>
                <option value="url" ?selected=${"url"===e.type}>
                  ${qe("editor.attribute_type_url")}
                </option>
              </select>
            </div>
            <label class="field">
              <span class="field-label">${qe("editor.attribute_link_label")}</span>
              <input
                type="text"
                .value=${e.link_label||""}
                @input=${t=>this._updateAttributeItem(i,"link_label",t.target.value)}
              />
            </label>
          </div>
          <div class="attr-map-block">
            ${(null!==(n=e.state_map)&&void 0!==n?n:[]).map((t,e)=>U`
                <div class="list-row attr-map-row">
                  <button
                    class="remove-btn"
                    title=${qe("editor.remove_item_label")}
                    @click=${()=>this._removeAttributeStateMapItem(i,e)}
                  >
                    ✕
                  </button>
                  <label class="field">
                    <span class="field-label">${qe("editor.attribute_map_value_label")}</span>
                    <input
                      type="text"
                      .value=${t.value||""}
                      @input=${t=>this._updateAttributeStateMapItem(i,e,"value",t.target.value)}
                    />
                  </label>
                  <label class="field">
                    <span class="field-label">${qe("editor.state_map_replacement_label")}</span>
                    <input
                      type="text"
                      .value=${t.replacement||""}
                      @input=${t=>this._updateAttributeStateMapItem(i,e,"replacement",t.target.value)}
                    />
                  </label>
                </div>
              `)}
            <button class="add-btn" @click=${()=>this._addAttributeStateMapItem(i)}>
              ${qe("editor.attribute_map_add_label")}
            </button>
          </div>
        `})}
      <button class="add-btn" @click=${this._addAttributeItem}>
        ${qe("editor.add_item_label")}
      </button>
    `}_renderDurationFields(){var t,e,n;const a=null!==(n=null===(e=null===(t=this._config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.units)&&void 0!==n?n:i.units;return U`
      <div class="select-wrap">
        <label class="select-label">${qe("editor.duration_largest_label")}</label>
        <select
          class="native-select"
          @change=${t=>this._durationFieldChanged("largest",t.target.value)}
        >
          ${[{v:"1",l:qe("editor.duration_largest_default")},{v:"2",l:"2"},{v:"3",l:"3"},{v:"4",l:"4"},{v:"full",l:qe("editor.duration_largest_full")}].map(t=>U`
              <option
                value=${t.v}
                ?selected=${this._durationLargest()===t.v||"1"===t.v&&""===this._durationLargest()}
              >
                ${t.l}
              </option>
            `)}
        </select>
      </div>
      <label class="field">
        <span class="field-label">${qe("editor.duration_delimiter_label")}</span>
        <input
          type="text"
          .value=${this._durationDelimiter()}
          @input=${t=>this._durationFieldChanged("delimiter",t.target.value)}
        />
      </label>
      <div class="units-row">
        <span class="field-label">${qe("editor.duration_units_label")}</span>
        <div class="units-list">
          ${[{code:"y",key:"editor.unit_year"},{code:"w",key:"editor.unit_week"},{code:"d",key:"editor.unit_day"},{code:"h",key:"editor.unit_hour"},{code:"m",key:"editor.unit_minute"},{code:"s",key:"editor.unit_second"}].map(t=>U`
              <label class="unit-check">
                <input
                  type="checkbox"
                  .checked=${a.includes(t.code)}
                  @change=${e=>this._durationUnitsChanged(t.code,e.target.checked)}
                />
                ${qe(t.key)}
              </label>
            `)}
        </div>
      </div>
      <p class="sub-title">${qe("editor.duration_labels_title")}</p>
      ${Qe.map(t=>U`
          <label class="field">
            <span class="field-label">${qe(`editor.duration_${t}_label`)}</span>
            <input
              type="text"
              .value=${this._durationLabel(t)}
              @input=${e=>this._durationFieldChanged(`labels.${t}`,e.target.value)}
            />
          </label>
        `)}
    `}_titleChanged(t){if(!this._config||!this.hass)return;const e=t.target.value,i=Object.assign({},this._config);""===e.trim()?delete i.title:i.title=e,this._config=i,ue(this,"config-changed",{config:this._config})}_dateFormatSelectChanged(t){this._config&&this.hass&&(t!==We?(this._dateFormatCustom=!1,this._writeDateFormat(t)):this._dateFormatCustom=!0)}_dateFormatInputChanged(t){this._writeDateFormat(t)}_writeDateFormat(t){if(!this._config||!this.hass)return;const e=Object.assign({},this._config);""===t?delete e.date_format:e.date_format=t,this._config=e,ue(this,"config-changed",{config:this._config})}_durationUnitsChanged(t,e){var n,a,o;if(!this._config||!this.hass)return;const r=null!==(o=null!==(a=null===(n=this._config.duration)||void 0===n?void 0:n.units)&&void 0!==a?a:i.units)&&void 0!==o?o:[],s=e?Array.from(new Set([...r,t])):r.filter(e=>e!==t),l=Object.assign({},this._config.duration||{});0===s.length?delete l.units:l.units=s;const u=Object.assign({},this._config);0===Object.keys(l).length?delete u.duration:u.duration=l,this._config=u,ue(this,"config-changed",{config:this._config})}setConfig(t){var e;this._config=this._normalizeConfig(t);const i=Array.isArray(null===(e=this._config)||void 0===e?void 0:e.entities)?this._config.entities.length:0;this._appearanceTarget=Math.min(Math.max(this._appearanceTarget,0),Math.max(i-1,0)),this._dateFormatCustom=this._isCustomDateFormat}get _title(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.title)&&void 0!==e?e:""}get _titlePlaceholder(){var t,e,i,n,a;const o=null===(i=(null!==(e=null===(t=this._config)||void 0===t?void 0:t.entities)&&void 0!==e?e:[])[0])||void 0===i?void 0:i.entity,r=o&&(null===(n=this.hass)||void 0===n?void 0:n.states)&&o in this.hass.states?null===(a=this.hass.states[o].attributes)||void 0===a?void 0:a.friendly_name:void 0;return r?qe("logbook_card.default_title","{entity}",r):qe("editor.title_placeholder")}get _hours_to_show(){var t;return(null===(t=this._config)||void 0===t?void 0:t.hours_to_show)?this._config.hours_to_show:120}get _desc(){return!this._config||void 0===this._config.desc||this._config.desc}get _date_format(){return this._config&&this._config.date_format||""}get _isCustomDateFormat(){const t=this._date_format;return!!t&&"relative"!==t&&!Ke.includes(t)}get _no_event(){var t;return void 0!==(null===(t=this._config)||void 0===t?void 0:t.no_event)?this._config.no_event:qe("common.default_no_event")}get _max_items(){return this._config&&this._config.max_items||-1}get _collapse(){if(this._config)return this._config.collapse}get _minimal_duration(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.minimal_duration)&&void 0!==e?e:0}_showValue(t){const i=this._appearanceBundle().show;return i&&void 0!==i[t]?i[t]:e[t]}get _show_state(){return!1!==this._showValue("state")}get _show_duration(){return!1!==this._showValue("duration")}get _show_start_date(){return!1!==this._showValue("start_date")}get _show_end_date(){return!1!==this._showValue("end_date")}get _show_icon(){return!0===this._showValue("icon")}get _show_separator(){return!1!==this._showValue("separator")}get _show_entity_name(){return!1!==this._showValue("entity_name")}get _custom_logs(){return!0===this.readEntityField("custom_logs")}get _attribute_hide_label(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.attribute_hide_label)}_entityAttributeNames(){var t,e;const i=null===(t=this._activeEntity)||void 0===t?void 0:t.entity;if(!i||!(null===(e=this.hass)||void 0===e?void 0:e.states)||!(i in this.hass.states))return[];const n=this.hass.states[i].attributes||{};return Object.keys(n).sort((t,e)=>t.localeCompare(e))}get _show_history(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_history)}get _scroll(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.scroll)}get _group_by_day(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.group_by_day)}get _state_map(){const t=this.readEntityField("state_map");return Array.isArray(t)?t:[]}get _attributes(){const t=this.readEntityField("attributes");return Array.isArray(t)?t:[]}get _hidden_state_text(){const t=this.readEntityField("hidden_state");return Array.isArray(t)&&t.every(t=>"string"==typeof t)?t.join("\n"):""}get _hidden_state_has_objects(){const t=this.readEntityField("hidden_state");return Array.isArray(t)&&t.some(t=>"string"!=typeof t)}get _sep_width(){var t,e,i;return null!==(i=null===(e=null===(t=this._config)||void 0===t?void 0:t.separator_style)||void 0===e?void 0:e.width)&&void 0!==i?i:""}get _sep_style(){var t,e,i;return null!==(i=null===(e=null===(t=this._config)||void 0===t?void 0:t.separator_style)||void 0===e?void 0:e.style)&&void 0!==i?i:""}get _sep_color(){var t,e,i;return null!==(i=null===(e=null===(t=this._config)||void 0===t?void 0:t.separator_style)||void 0===e?void 0:e.color)&&void 0!==i?i:""}_durationLargest(){var t,e;const i=null===(e=null===(t=this._config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.largest;return void 0===i?"":String(i)}_durationDelimiter(){var t,e,i;return null!==(i=null===(e=null===(t=this._config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.delimiter)&&void 0!==i?i:""}_durationLabel(t){var e,i,n,a;return null!==(a=null===(n=null===(i=null===(e=this._config)||void 0===e?void 0:e.duration)||void 0===i?void 0:i.labels)||void 0===n?void 0:n[t])&&void 0!==a?a:""}_actionConfig(t){var e;return null===(e=this._config)||void 0===e?void 0:e[t]}_actionValue(t){var e;return(null===(e=this._actionConfig(t))||void 0===e?void 0:e.action)||("tap_action"===t?"more-info":"none")}_serviceDataText(t){var e;const i=null===(e=this._actionConfig(t))||void 0===e?void 0:e.service_data;return i?JSON.stringify(i,null,2):""}render(){var e,i,n;if(!this.hass)return U``;const a=Ze("required"),o=Ze("general"),r=Ze("appearance"),s=Ze("dataConfig"),l=Ze("actions");return U`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"required"}>
          <ha-icon class="option-icon" .icon=${`mdi:${a.icon}`}></ha-icon>
          <div class="option-title">${a.name}</div>
          <div class="option-secondary">${a.secondary}</div>
        </div>
        ${a.show?U`
              <div class="values">
                ${this._renderEntitiesList()}
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"general"}>
          <ha-icon class="option-icon" .icon=${`mdi:${o.icon}`}></ha-icon>
          <div class="option-title">${o.name}</div>
          <div class="option-secondary">${o.secondary}</div>
        </div>
        ${o.show?U`
              <div class="values">
                <div class="title-row">
                  <ha-formfield .label=${qe("editor.show_title_label")}>
                    <ha-switch
                      aria-label=${"Toggle title "+(!1===(null===(e=this._config)||void 0===e?void 0:e.show_title)?"on":"off")}
                      .checked=${!1!==(null===(i=this._config)||void 0===i?void 0:i.show_title)}
                      .configValue=${"show_title"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                  ${!1===(null===(n=this._config)||void 0===n?void 0:n.show_title)?"":U`
                        <label class="field title-field">
                          <span class="field-label">${qe("editor.title_label")}</span>
                          <input
                            type="text"
                            .value=${this._title}
                            .placeholder=${this._titlePlaceholder}
                            @input=${this._titleChanged}
                          />
                        </label>
                      `}
                </div>
                <label class="field">
                  <span class="field-label">${qe("editor.hours_to_show_label")}</span>
                  <input
                    type="number"
                    min="1"
                    .value=${this._hours_to_show}
                    .configValue=${"hours_to_show"}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field">
                  <span class="field-label">${qe("editor.max_items_label")}</span>
                  <input
                    type="number"
                    min="-1"
                    .value=${this._max_items}
                    .configValue=${"max_items"}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field">
                  <span class="field-label">${qe("editor.no_event_label")}</span>
                  <input type="text" .value=${this._no_event} .configValue=${"no_event"} @input=${this._valueChanged} />
                </label>
                <label class="field">
                  <span class="field-label">${qe("editor.collapse_label")}</span>
                  <input
                    type="number"
                    .value=${this._collapse}
                    .configValue=${"collapse"}
                    @input=${this._valueChanged}
                  />
                </label>
                <div class="select-wrap">
                  <label class="select-label">${qe("editor.date_format_label")}</label>
                  <select
                    class="native-select"
                    @change=${t=>this._dateFormatSelectChanged(t.target.value)}
                  >
                    <option value="" ?selected=${""===this._date_format}>
                      ${qe("editor.date_format_default")}
                    </option>
                    <option value="relative" ?selected=${"relative"===this._date_format}>
                      ${qe("editor.date_format_relative")}
                    </option>
                    ${Ke.map(t=>U`
                        <option value=${t} ?selected=${!this._dateFormatCustom&&this._date_format===t}>${t}</option>
                      `)}
                    <option value=${We} ?selected=${this._dateFormatCustom}>
                      ${qe("editor.date_format_custom")}
                    </option>
                  </select>
                  ${this._dateFormatCustom?U`
                        <label class="field">
                          <span class="field-label">${qe("editor.date_format_custom_input")}</span>
                          <input
                            type="text"
                            .value=${this._date_format}
                            placeholder="YYYY-MM-DD HH:mm:ss"
                            @input=${t=>this._dateFormatInputChanged(t.target.value)}
                          />
                        </label>
                      `:""}
                </div>
                <label class="field">
                  <span class="field-label">${qe("editor.minimal_duration_label")}</span>
                  <input
                    type="number"
                    min="0"
                    .value=${this._minimal_duration}
                    .configValue=${"minimal_duration"}
                    @input=${this._valueChanged}
                  />
                </label>
                <ha-formfield .label=${qe("editor.desc_label")}>
                  <ha-switch
                    aria-label=${"Toggle desc "+(this._desc?"on":"off")}
                    .checked=${!1!==this._desc}
                    .configValue=${"desc"}
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <ha-icon class="option-icon" .icon=${`mdi:${r.icon}`}></ha-icon>
          <div class="option-title">${r.name}</div>
          <div class="option-secondary">${r.secondary}</div>
        </div>
        ${r.show?U`
              <div class="values">
                ${this._renderEntityTargetSelector(qe("editor.appearance_target_label"),this._appearanceTarget,t=>this._appearanceTarget=t)}
                ${this._subSection("show",qe("editor.show_option_name"),this._renderShowToggles())}
                ${this._subSection("layout",qe("editor.layout_option_name"),this._renderLayoutEditor())}
                ${this._subSection("styles",qe("editor.styles_option_name"),this._renderStyleRows())}
                ${this._subSection("separator",qe("editor.separator_option_name"),this._renderSeparatorFields())}
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"dataConfig"}>
          <ha-icon class="option-icon" .icon=${`mdi:${s.icon}`}></ha-icon>
          <div class="option-title">${s.name}</div>
          <div class="option-secondary">${s.secondary}</div>
        </div>
        ${s.show?U`
              <div class="values">
                ${this._renderEntityTargetSelector(qe("editor.data_target_entity_label"),this._activeEntityIndex,t=>this._activeEntityIndex=t)}
                <ha-formfield .label=${qe("editor.display_custom_logs_label")}>
                  <ha-switch
                    aria-label=${"Toggle display of custom logs "+(this._custom_logs?"off":"on")}
                    .checked=${this._custom_logs}
                    @change=${t=>this.writeEntityField("custom_logs",!0===t.target.checked||void 0)}
                  ></ha-switch>
                </ha-formfield>
                ${this._subSection("stateMap",qe("editor.state_map_option_name"),this._renderStateMapList())}
                ${this._subSection("hiddenState",qe("editor.hidden_state_option_name"),this._renderHiddenState())}
                ${this._subSection("attributes",qe("editor.attributes_option_name"),this._renderAttributesList())}
                ${this._subSection("duration",qe("editor.duration_option_name"),this._renderDurationFields())}
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"actions"}>
          <ha-icon class="option-icon" .icon=${`mdi:${l.icon}`}></ha-icon>
          <div class="option-title">${l.name}</div>
          <div class="option-secondary">${l.secondary}</div>
        </div>
        ${l.show?U`
              <div class="values">
                ${Ge.map(t=>this._renderActionBlock(t))}
              </div>
            `:""}
      </div>

      <p class="version">logbook-card v${t}</p>
    `}_renderActionBlock(t){var e;const i=this._actionConfig(t),n=this._actionValue(t);return U`
      <div class="action-block">
        <p class="sub-title">${qe("tap_action"===t?"editor.tap_action_label":"hold_action"===t?"editor.hold_action_label":"editor.double_tap_action_label")}</p>
        <select
          class="native-select"
          @change=${e=>this._actionFieldChanged(t,"action",e.target.value)}
        >
          <option value="none" ?selected=${"none"===n}>
            ${qe("editor.action_none")}
          </option>
          <option value="more-info" ?selected=${"more-info"===n}>
            ${qe("editor.action_more_info")}
          </option>
          <option value="toggle" ?selected=${"toggle"===n}>
            ${qe("editor.action_toggle")}
          </option>
          <option value="call-service" ?selected=${"call-service"===n}>
            ${qe("editor.action_call_service")}
          </option>
          <option value="navigate" ?selected=${"navigate"===n}>
            ${qe("editor.action_navigate")}
          </option>
          <option value="url" ?selected=${"url"===n}>
            ${qe("editor.action_url")}
          </option>
        </select>
        ${"navigate"===n?U`
              <label class="field">
                <span class="field-label">${qe("editor.action_navigation_path_label")}</span>
                <input
                  type="text"
                  .value=${(null==i?void 0:i.navigation_path)||""}
                  @input=${e=>this._actionFieldChanged(t,"navigation_path",e.target.value)}
                />
              </label>
            `:""}
        ${"url"===n?U`
              <label class="field">
                <span class="field-label">${qe("editor.action_url_label")}</span>
                <input
                  type="text"
                  .value=${(null==i?void 0:i.url)||""}
                  @input=${e=>this._actionFieldChanged(t,"url",e.target.value)}
                />
              </label>
            `:""}
        ${"call-service"===n?U`
              <label class="field">
                <span class="field-label">${qe("editor.action_service_label")}</span>
                <input
                  type="text"
                  .value=${(null==i?void 0:i.service)||""}
                  @input=${e=>this._actionFieldChanged(t,"service",e.target.value)}
                />
              </label>
              <label class="field">
                <span class="field-label">${qe("editor.action_service_data_label")}</span>
                <textarea
                  rows="3"
                  .value=${this._serviceDataText(t)}
                  @input=${e=>this._actionServiceDataChanged(t,e.target.value)}
                ></textarea>
              </label>
            `:""}
        <label class="field">
          <span class="field-label">${qe("editor.action_haptic_label")}</span>
          <input
            type="text"
            .value=${(null==i?void 0:i.haptic)||""}
            @input=${e=>this._actionFieldChanged(t,"haptic",e.target.value)}
          />
        </label>
        ${"hold_action"===t?U`
              <label class="field">
                <span class="field-label">${qe("editor.action_repeat_label")}</span>
                <input
                  type="number"
                  min="0"
                  .value=${null!==(e=null==i?void 0:i.repeat)&&void 0!==e?e:""}
                  @input=${e=>this._actionFieldChanged(t,"repeat",e.target.value)}
                />
              </label>
            `:""}
      </div>
    `}_toggleOption(t){const e=t.currentTarget;if(!e||!e.option)return;const i=e.option,n=!Je[i];Be.forEach(t=>{Je[t]=!1}),Je[i]=n,this._toggle=!this._toggle}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(e.configValue){if("HA-SWITCH"===e.tagName||"checkbox"===e.type){if(this._config[e.configValue]===e.checked)return;return this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:e.checked}),void ue(this,"config-changed",{config:this._config})}if(e.value!==this[`_${e.configValue}`]){if(""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else if("number"===e.type){const t=Number.parseInt(e.value,10);if(Number.isNaN(t))return;this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:t})}else this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:e.value});ue(this,"config-changed",{config:this._config})}}}_showOptionChanged(t){var e;if(!this._config||!this.hass)return;const i=t.target;if(i.configValue){const t=Object.assign({},null!==(e=this._appearanceOwnEntity().show)&&void 0!==e?e:{});t[i.configValue]=i.checked,this._writeAppearance({show:t})}}_styleBaseKey(t){return"attributes"===t||String(t).startsWith("attributes:")?"attributes":t}_elementStyle(t){var e;return(null===(e=this._appearanceBundle().element_styles)||void 0===e?void 0:e[this._styleBaseKey(t)])||{}}_cssVar(t,e){try{return getComputedStyle(this).getPropertyValue(t).trim()||e}catch(t){return e}}_defaultColor(t){return"time"===t?this._cssVar("--secondary-text-color","#7f8ea3"):this._cssVar("--primary-text-color","#000000")}_defaultSize(t){return"time"===t?"0.8rem":"duration"===t?"0.85rem":""}_parseFontSize(t){const e=t=>String(Math.round(100*t)/100),i=(this._elementStyle(t).font_size||"").trim(),n=/^(\d*\.?\d+)(rem|px|em|%)$/.exec(i);if(n)return{num:e(parseFloat(n[1])),unit:n[2]};const a=this._defaultSize(t)||"1rem",o=/^(\d*\.?\d+)(rem|px|em|%)$/.exec(a);return o?{num:e(parseFloat(o[1])),unit:o[2]}:{num:"1",unit:"rem"}}_styleRow(t){var e;const i=this._elementStyle(t),n=this._parseFontSize(t),a=null!==(e=ei[n.unit])&&void 0!==e?e:ei.rem,o=(e,i)=>this._styleSizeChanged(t,e,i);return U`
      <div class="style-row">
        <span class="style-label">${qe(`editor.layout_elem_${t}`)}</span>
        <input
          type="color"
          class="style-color"
          .value=${i.color||this._defaultColor(t)}
          @change=${e=>this._styleColorChanged(t,e)}
        />
        <div class="size-ctrl">
          <input
            type="range"
            class="size-slider"
            title=${qe("editor.style_size_label")}
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${n.num}
            @input=${t=>o(t.target.value,n.unit)}
          />
          <input
            type="number"
            class="size-num"
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${n.num}
            @input=${t=>o(t.target.value,n.unit)}
          />
          <select
            class="size-unit"
            title=${qe("editor.font_unit_label")}
            @change=${t=>o(n.num,t.target.value)}
          >
            ${ti.map(t=>U`
                <option value=${t} ?selected=${n.unit===t}>${t}</option>
              `)}
          </select>
        </div>
        <button
          type="button"
          class="style-clear"
          title=${qe("editor.style_clear_label")}
          @click=${()=>this._styleClear(t)}
        >
          ✕
        </button>
      </div>
    `}_writeElementStyles(t,e){if(!this._config||!this.hass)return;const i=this._styleBaseKey(t),n=Object.assign({},this._appearanceOwnEntity().element_styles||{});e&&Object.keys(e).length>0?n[i]=e:delete n[i],this._writeAppearance({element_styles:n})}_styleColorChanged(t,e){const i=e.target.value,n=this._elementStyle(t),a={};i&&(a.color=i),n.font_size&&(a.font_size=n.font_size),this._writeElementStyles(t,Object.keys(a).length>0?a:void 0)}_styleSizeChanged(t,e,i){const n=this._elementStyle(t),a={};n.color&&(a.color=n.color);const o=parseFloat(e);""!==e&&!Number.isNaN(o)&&o>0&&(a.font_size=`${Math.round(100*o)/100}${i}`),this._writeElementStyles(t,Object.keys(a).length>0?a:void 0)}_styleClear(t){this._writeElementStyles(t,void 0)}_hiddenStateChanged(t){if(!this._config||!this.hass)return;const e=String(t.target.value).split("\n").map(t=>t.trim()).filter(t=>""!==t);this.writeEntityField("hidden_state",e.length>0?e:void 0)}_addStateMapItem(){if(!this._config||!this.hass)return;const t=[...this._state_map,{value:"",label:""}];this.writeEntityField("state_map",t)}_removeStateMapItem(t){if(!this._config||!this.hass)return;const e=[...this._state_map];e.splice(t,1),this.writeEntityField("state_map",e.length>0?e:void 0)}_updateStateMapItem(t,e,i){if(!this._config||!this.hass)return;const n=this._state_map.map((n,a)=>a===t?Object.assign(Object.assign({},n),{[e]:i}):n);this.writeEntityField("state_map",n)}_addAttributeItem(){if(!this._config||!this.hass)return;const t=[...this._attributes,{value:""}];this.writeEntityField("attributes",t)}_removeAttributeItem(t){if(!this._config||!this.hass)return;const e=[...this._attributes];e.splice(t,1),this.writeEntityField("attributes",e.length>0?e:void 0)}_updateAttributeItem(t,e,i){if(!this._config||!this.hass)return;const n=this._attributes.map((n,a)=>{if(a!==t)return n;const o=Object.assign({},n);return""===i&&"value"!==e?delete o[e]:o[e]=i,o});this.writeEntityField("attributes",n)}_addAttributeStateMapItem(t){if(!this._config||!this.hass)return;const e=this._attributes.map((e,i)=>{var n;return i!==t?e:Object.assign(Object.assign({},e),{state_map:[...null!==(n=e.state_map)&&void 0!==n?n:[],{value:"",replacement:""}]})});this.writeEntityField("attributes",e)}_removeAttributeStateMapItem(t,e){if(!this._config||!this.hass)return;const i=this._attributes.map((i,n)=>{var a;if(n!==t)return i;const o=(null!==(a=i.state_map)&&void 0!==a?a:[]).filter((t,i)=>i!==e),r=Object.assign({},i);return o.length>0?r.state_map=o:delete r.state_map,r});this.writeEntityField("attributes",i)}_updateAttributeStateMapItem(t,e,i,n){if(!this._config||!this.hass)return;const a=this._attributes.map((a,o)=>{var r;if(o!==t)return a;const s=(null!==(r=a.state_map)&&void 0!==r?r:[]).map((t,a)=>a===e?Object.assign(Object.assign({},t),{[i]:n}):t);return Object.assign(Object.assign({},a),{state_map:s})});this.writeEntityField("attributes",a)}_separatorStyleChanged(t,e){if(!this._config||!this.hass)return;const i=Object.assign({},this._config.separator_style||{});if(""===e)delete i[t];else if("width"===t){const t=Number.parseInt(e);Number.isNaN(t)||(i.width=t)}else i[t]=e;const n=Object.assign({},this._config);0===Object.keys(i).length?delete n.separator_style:n.separator_style=i,this._config=n,ue(this,"config-changed",{config:this._config})}_durationFieldChanged(t,e){if(!this._config||!this.hass)return;const i=Object.assign({},this._config.duration||{});if("largest"===t)if(""===e)delete i.largest;else if("full"===e)i.largest="full";else{const t=Number.parseInt(e);Number.isNaN(t)||(i.largest=t)}else if("delimiter"===t)""===e?delete i.delimiter:i.delimiter=e;else if("units"===t){const t=e.split(",").map(t=>t.trim()).filter(t=>""!==t);t.length>0?i.units=t:delete i.units}else if(t.startsWith("labels.")){const n=t.split(".")[1],a=Object.assign({},i.labels||{});""===e?delete a[n]:a[n]=e,Object.keys(a).length>0?i.labels=a:delete i.labels}const n=Object.assign({},this._config);0===Object.keys(i).length?delete n.duration:n.duration=i,this._config=n,ue(this,"config-changed",{config:this._config})}_actionFieldChanged(t,e,i){if(!this._config||!this.hass)return;const n=this._config[t]||{};let a;if("action"===e)a={action:i},n.haptic&&(a.haptic=n.haptic);else if(""===i)a=Object.assign({},n),delete a[e];else if("repeat"===e){a=Object.assign({},n);const t=Number.parseInt(i);Number.isNaN(t)||(a.repeat=t)}else a=Object.assign(Object.assign({},n),{[e]:i});this._config=Object.assign(Object.assign({},this._config),{[t]:a}),ue(this,"config-changed",{config:this._config})}_actionServiceDataChanged(t,e){if(!this._config||!this.hass)return;const i=this._config[t]||{},n=Object.assign({},i);if(""===String(e).trim())delete n.service_data;else try{n.service_data=JSON.parse(e)}catch(t){return}this._config=Object.assign(Object.assign({},this._config),{[t]:n}),ue(this,"config-changed",{config:this._config})}static get styles(){return ut`
      .option {
        padding: 0.6rem 0.75rem;
        margin-bottom: 0.25rem;
        cursor: pointer;
        display: grid;
        grid-template-areas:
          'icon title'
          'icon secondary';
        grid-template-columns: 2rem auto;
        column-gap: 0.5rem;
        border-radius: 10px;
        transition: background 0.15s ease;
      }
      .option:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .option > * {
        pointer-events: none;
      }
      .option-title {
        grid-area: title;
        font-weight: 500;
      }
      .option-icon {
        grid-area: icon;
        align-self: center;
        color: var(--primary-color);
      }
      .option-secondary {
        grid-area: secondary;
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .values {
        padding: 0.75rem 1rem;
        margin: 0 0.25rem 0.75rem;
        border-left: 2px solid var(--primary-color);
        border-radius: 0 10px 10px 0;
        background: var(--secondary-background-color, transparent);
      }
      .suboption {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.6rem;
        margin-top: 0.5rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        background: var(--card-background-color, transparent);
        transition: background 0.15s ease;
      }
      .suboption:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .suboption > * {
        pointer-events: none;
      }
      .suboption-title {
        flex: 1;
        font-weight: 500;
        font-size: 0.9rem;
      }
      .suboption-chevron {
        color: var(--secondary-text-color);
        --mdc-icon-size: 20px;
      }
      .values.sub-values {
        margin: 0 0 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--divider-color);
        border-top: none;
        border-radius: 0 0 8px 8px;
        background: var(--card-background-color, transparent);
      }
      ha-formfield {
        display: block;
        margin-inline: 0.5rem;
        margin-block: 1rem;
      }
      ha-switch {
        --mdc-theme-secondary: var(--switch-checked-color);
      }
      .version {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        text-align: right;
        margin-top: 0.5rem;
      }
      .list-row {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 0.75rem;
        align-items: start;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.75rem;
        padding-top: 1.5rem;
        margin-bottom: 0.75rem;
        background: var(--card-background-color, transparent);
      }
      .list-row .full {
        grid-column: 1 / -1;
      }
      /* 属性值映射区块：在属性行下方缩进展示 */
      .attr-map-block {
        margin: -0.25rem 0 0.75rem 1.25rem;
      }
      /* 多实体：实体列表行 */
      .entity-row.active {
        border-color: var(--primary-color);
      }
      .entity-row-index {
        position: absolute;
        top: -10px;
        left: 12px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-radius: 999px;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 0.75rem;
        padding: 0 4px;
      }
      /* HA 原生图标选择器：与行内其他字段对齐 */
      .list-row ha-icon-picker.icon-picker {
        display: block;
        width: 100%;
        --mdc-shape-small: 8px;
      }
      .remove-btn {
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
      }
      .remove-btn:hover {
        color: var(--error-color);
        background: var(--secondary-background-color);
      }
      .add-btn {
        width: 100%;
        border: 1px dashed var(--divider-color);
        background: none;
        color: var(--primary-color);
        padding: 0.6rem;
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-weight: 500;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .add-btn:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .select-wrap {
        margin-bottom: 1rem;
      }
      .field {
        display: block;
        margin-bottom: 1rem;
      }
      .field.full {
        grid-column: 1 / -1;
      }
      .field-label {
        display: block;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        margin-bottom: 0.25rem;
      }
      .layout-preview {
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.65rem 0.75rem;
        margin-bottom: 0.75rem;
        background: var(--card-background-color, transparent);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .layout-preview-row {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        min-height: 1.5rem;
      }
      .layout-preview-side {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: baseline;
      }
      .layout-preview-right {
        margin-left: auto;
      }
      .layout-chip {
        font-size: 0.8rem;
        padding: 0.12rem 0.55rem;
        border-radius: 999px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        white-space: nowrap;
      }
      .layout-config {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
      }
      .layout-config-row {
        display: grid;
        grid-template-columns: minmax(4.5rem, auto) 1fr 1fr 2.1rem 2.1rem;
        gap: 0.5rem;
        align-items: center;
        padding: 0.3rem 0.5rem;
        border-radius: 8px;
        transition: background 0.15s ease;
      }
      .layout-config-row:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .layout-config-name {
        font-size: 0.9rem;
      }
      .layout-config-row .native-select {
        margin-bottom: 0;
        padding: 0.4rem 0.5rem;
        font-size: 0.85rem;
      }
      .layout-btn {
        border: 1px solid var(--divider-color, #ddd);
        background: transparent;
        border-radius: 6px;
        width: 28px;
        height: 26px;
        padding: 0;
        cursor: pointer;
        line-height: 1;
        font-size: 0.7rem;
        color: var(--primary-text-color);
        transition: border-color 0.15s ease, color 0.15s ease;
      }
      .layout-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .field input,
      .field textarea {
        width: 100%;
        padding: 0.55rem 0.7rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .field textarea {
        resize: vertical;
      }
      .field input:focus,
      .field textarea:focus,
      select.native-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .select-label {
        display: block;
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        margin-bottom: 0.25rem;
      }
      .sep-styles {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
      .sep-style-btn {
        flex: 1;
        height: 34px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .sep-style-btn:hover {
        border-color: var(--primary-color);
      }
      .sep-style-btn.active {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .sep-style-line {
        display: block;
        width: 70%;
        border-top: 3px solid var(--primary-text-color);
      }
      select.native-select {
        width: 100%;
        padding: 0.55rem 0.7rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .action-block {
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .sub-title {
        font-weight: bold;
        margin: 0 0 0.5rem;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        margin: 0 0 0.75rem;
      }
      .sub-hint {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        margin: 0.75rem 0.5rem 0;
        padding-top: 0.5rem;
        border-top: 1px dashed var(--divider-color);
      }
      .style-row {
        display: grid;
        grid-template-columns: minmax(6.5rem, auto) 3rem 1fr 2rem;
        gap: 0.5rem;
        align-items: center;
        padding: 0.3rem 0.5rem;
        border-radius: 8px;
      }
      .style-row:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .style-head {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }
      .style-head:hover {
        background: none;
      }
      .style-label {
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        line-height: 1.3;
      }
      .style-color {
        width: 3rem;
        height: 34px;
        padding: 2px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        box-sizing: border-box;
      }
      .style-clear {
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 0.85rem;
        padding: 0.25rem;
        border-radius: 6px;
        line-height: 1;
      }
      .style-clear:hover {
        color: var(--error-color);
        background: var(--secondary-background-color);
      }
      .title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .title-field {
        flex: 1;
      }
      .title-row ha-formfield {
        margin-block: 0;
        white-space: nowrap;
      }
      .size-ctrl {
        display: grid;
        grid-template-columns: 1fr 4.2rem 4rem;
        gap: 0.4rem;
        align-items: center;
      }
      .size-slider {
        width: 100%;
        margin: 0;
        accent-color: var(--primary-color);
        cursor: pointer;
      }
      .size-num,
      .size-unit {
        width: 100%;
        padding: 0.4rem 0.35rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 0.85rem;
        box-sizing: border-box;
        text-align: center;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .size-num:focus,
      .size-unit:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .size-unit {
        cursor: pointer;
      }
      .units-row {
        margin-bottom: 0.75rem;
      }
      .units-row > .field-label {
        display: block;
        margin-bottom: 0.35rem;
      }
      .units-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem 1rem;
      }
      .unit-check {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.9rem;
      }
    `}};a([Et({attribute:!1})],ii.prototype,"hass",null),a([Ct()],ii.prototype,"_config",void 0),a([Ct()],ii.prototype,"_toggle",void 0),a([Ct()],ii.prototype,"_subOpen",void 0),a([Ct()],ii.prototype,"_activeEntityIndex",void 0),a([Ct()],ii.prototype,"_appearanceTarget",void 0),a([Ct()],ii.prototype,"_dateFormatCustom",void 0),ii=a([xt("logbook-card-editor")],ii);const ni=(t,e,i,n=!0)=>{if("relative"===i)return U`
      <ha-relative-time .hass=${t} .datetime=${e}></ha-relative-time>
    `;if(i){const t=n?i:(t=>{const e=t.replace(/\s*LTS/g,"").replace(/\s*LT/g,""),i=/[Hh]{1,2}|[ms]{1,2}|S{1,3}|a|A/.exec(e);if(!i)return e;const n=e.slice(0,i.index).replace(/[\s,;:.\-/]+$/,"");return n.length>0?n:e})(i);return Gt(e,null!=t?t:void 0)}return n?ie(e,t.locale):ee(e,t.locale)},ai=(t,e,i,n,a=!0)=>"date"===i?ni(t,new Date(e),n,a):e,oi=(t,e,i,n,a,o,r,s=!0)=>"date"===a?ni(t,new Date(n),o,s):"url"===a?U`
      <a .href="${n}" target="_blank">${r||n}</a>
    `:t.formatEntityAttributeValue?t.formatEntityAttributeValue(e,i):n;let ri=class extends kt{render(){return this.config&&this.hass&&this.date?U`
      ${ni(this.hass,this.date,this.config.date_format)}
    `:U``}};a([Et({type:Object})],ri.prototype,"hass",void 0),a([Et({type:Object})],ri.prototype,"config",void 0),a([Et({attribute:!1})],ri.prototype,"date",void 0),ri=a([xt("logbook-date")],ri);var si=function(){function t(){var t=this;this.languages={ar:{y:function(t){return 1===t?"سنة":"سنوات"},mo:function(t){return 1===t?"شهر":"أشهر"},w:function(t){return 1===t?"أسبوع":"أسابيع"},d:function(t){return 1===t?"يوم":"أيام"},h:function(t){return 1===t?"ساعة":"ساعات"},m:function(e){return["دقيقة","دقائق"][t.getArabicForm(e)]},s:function(t){return 1===t?"ثانية":"ثواني"},ms:function(t){return 1===t?"جزء من الثانية":"أجزاء من الثانية"},decimal:","},bg:{y:function(e){return["години","година","години"][t.getSlavicForm(e)]},mo:function(e){return["месеца","месец","месеца"][t.getSlavicForm(e)]},w:function(e){return["седмици","седмица","седмици"][t.getSlavicForm(e)]},d:function(e){return["дни","ден","дни"][t.getSlavicForm(e)]},h:function(e){return["часа","час","часа"][t.getSlavicForm(e)]},m:function(e){return["минути","минута","минути"][t.getSlavicForm(e)]},s:function(e){return["секунди","секунда","секунди"][t.getSlavicForm(e)]},ms:function(e){return["милисекунди","милисекунда","милисекунди"][t.getSlavicForm(e)]},decimal:","},ca:{y:function(t){return"any"+(1===t?"":"s")},mo:function(t){return"mes"+(1===t?"":"os")},w:function(t){return"setman"+(1===t?"a":"es")},d:function(t){return"di"+(1===t?"a":"es")},h:function(t){return"hor"+(1===t?"a":"es")},m:function(t){return"minut"+(1===t?"":"s")},s:function(t){return"segon"+(1===t?"":"s")},ms:function(t){return"milisegon"+(1===t?"":"s")},decimal:","},cs:{y:function(e){return["rok","roku","roky","let"][t.getCzechOrSlovakForm(e)]},mo:function(e){return["měsíc","měsíce","měsíce","měsíců"][t.getCzechOrSlovakForm(e)]},w:function(e){return["týden","týdne","týdny","týdnů"][t.getCzechOrSlovakForm(e)]},d:function(e){return["den","dne","dny","dní"][t.getCzechOrSlovakForm(e)]},h:function(e){return["hodina","hodiny","hodiny","hodin"][t.getCzechOrSlovakForm(e)]},m:function(e){return["minuta","minuty","minuty","minut"][t.getCzechOrSlovakForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekund"][t.getCzechOrSlovakForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekund"][t.getCzechOrSlovakForm(e)]},decimal:","},da:{y:function(){return"år"},mo:function(t){return"måned"+(1===t?"":"er")},w:function(t){return"uge"+(1===t?"":"r")},d:function(t){return"dag"+(1===t?"":"e")},h:function(t){return"time"+(1===t?"":"r")},m:function(t){return"minut"+(1===t?"":"ter")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},de:{y:function(t){return"Jahr"+(1===t?"":"e")},mo:function(t){return"Monat"+(1===t?"":"e")},w:function(t){return"Woche"+(1===t?"":"n")},d:function(t){return"Tag"+(1===t?"":"e")},h:function(t){return"Stunde"+(1===t?"":"n")},m:function(t){return"Minute"+(1===t?"":"n")},s:function(t){return"Sekunde"+(1===t?"":"n")},ms:function(t){return"Millisekunde"+(1===t?"":"n")},decimal:","},el:{y:function(t){return 1===t?"χρόνος":"χρόνια"},mo:function(t){return 1===t?"μήνας":"μήνες"},w:function(t){return 1===t?"εβδομάδα":"εβδομάδες"},d:function(t){return 1===t?"μέρα":"μέρες"},h:function(t){return 1===t?"ώρα":"ώρες"},m:function(t){return 1===t?"λεπτό":"λεπτά"},s:function(t){return 1===t?"δευτερόλεπτο":"δευτερόλεπτα"},ms:function(t){return 1===t?"χιλιοστό του δευτερολέπτου":"χιλιοστά του δευτερολέπτου"},decimal:","},en:{y:function(t){return"year"+(1===t?"":"s")},mo:function(t){return"month"+(1===t?"":"s")},w:function(t){return"week"+(1===t?"":"s")},d:function(t){return"day"+(1===t?"":"s")},h:function(t){return"hour"+(1===t?"":"s")},m:function(t){return"minute"+(1===t?"":"s")},s:function(t){return"second"+(1===t?"":"s")},ms:function(t){return"millisecond"+(1===t?"":"s")},decimal:"."},es:{y:function(t){return"año"+(1===t?"":"s")},mo:function(t){return"mes"+(1===t?"":"es")},w:function(t){return"semana"+(1===t?"":"s")},d:function(t){return"día"+(1===t?"":"s")},h:function(t){return"hora"+(1===t?"":"s")},m:function(t){return"minuto"+(1===t?"":"s")},s:function(t){return"segundo"+(1===t?"":"s")},ms:function(t){return"milisegundo"+(1===t?"":"s")},decimal:","},et:{y:function(t){return"aasta"+(1===t?"":"t")},mo:function(t){return"kuu"+(1===t?"":"d")},w:function(t){return"nädal"+(1===t?"":"at")},d:function(t){return"päev"+(1===t?"":"a")},h:function(t){return"tund"+(1===t?"":"i")},m:function(t){return"minut"+(1===t?"":"it")},s:function(t){return"sekund"+(1===t?"":"it")},ms:function(t){return"millisekund"+(1===t?"":"it")},decimal:","},fa:{y:function(){return"سال"},mo:function(){return"ماه"},w:function(){return"هفته"},d:function(){return"روز"},h:function(){return"ساعت"},m:function(){return"دقیقه"},s:function(){return"ثانیه"},ms:function(){return"میلی ثانیه"},decimal:"."},fi:{y:function(t){return 1===t?"vuosi":"vuotta"},mo:function(t){return 1===t?"kuukausi":"kuukautta"},w:function(t){return"viikko"+(1===t?"":"a")},d:function(t){return"päivä"+(1===t?"":"ä")},h:function(t){return"tunti"+(1===t?"":"a")},m:function(t){return"minuutti"+(1===t?"":"a")},s:function(t){return"sekunti"+(1===t?"":"a")},ms:function(t){return"millisekunti"+(1===t?"":"a")},decimal:","},fo:{y:function(){return"ár"},mo:function(t){return 1===t?"mánaður":"mánaðir"},w:function(t){return 1===t?"vika":"vikur"},d:function(t){return 1===t?"dagur":"dagar"},h:function(t){return 1===t?"tími":"tímar"},m:function(t){return 1===t?"minuttur":"minuttir"},s:function(){return"sekund"},ms:function(){return"millisekund"},decimal:","},fr:{y:function(t){return"an"+(t>=2?"s":"")},mo:function(){return"mois"},w:function(t){return"semaine"+(t>=2?"s":"")},d:function(t){return"jour"+(t>=2?"s":"")},h:function(t){return"heure"+(t>=2?"s":"")},m:function(t){return"minute"+(t>=2?"s":"")},s:function(t){return"seconde"+(t>=2?"s":"")},ms:function(t){return"milliseconde"+(t>=2?"s":"")},decimal:","},hr:{y:function(t){return t%10==2||t%10==3||t%10==4?"godine":"godina"},mo:function(t){return 1===t?"mjesec":2===t||3===t||4===t?"mjeseca":"mjeseci"},w:function(t){return t%10==1&&11!==t?"tjedan":"tjedna"},d:function(t){return 1===t?"dan":"dana"},h:function(t){return 1===t?"sat":2===t||3===t||4===t?"sata":"sati"},m:function(t){var e=t%10;return 2!==e&&3!==e&&4!==e||!(t<10||t>14)?"minuta":"minute"},s:function(t){return 10===t||11===t||12===t||13===t||14===t||16===t||17===t||18===t||19===t||t%10==5?"sekundi":t%10==1?"sekunda":t%10==2||t%10==3||t%10==4?"sekunde":"sekundi"},ms:function(t){return 1===t?"milisekunda":t%10==2||t%10==3||t%10==4?"milisekunde":"milisekundi"},decimal:","},hu:{y:function(){return"év"},mo:function(){return"hónap"},w:function(){return"hét"},d:function(){return"nap"},h:function(){return"óra"},m:function(){return"perc"},s:function(){return"másodperc"},ms:function(){return"ezredmásodperc"},decimal:","},id:{y:function(){return"tahun"},mo:function(){return"bulan"},w:function(){return"minggu"},d:function(){return"hari"},h:function(){return"jam"},m:function(){return"menit"},s:function(){return"detik"},ms:function(){return"milidetik"},decimal:"."},is:{y:function(){return"ár"},mo:function(t){return"mánuð"+(1===t?"ur":"ir")},w:function(t){return"vik"+(1===t?"a":"ur")},d:function(t){return"dag"+(1===t?"ur":"ar")},h:function(t){return"klukkutím"+(1===t?"i":"ar")},m:function(t){return"mínút"+(1===t?"a":"ur")},s:function(t){return"sekúnd"+(1===t?"a":"ur")},ms:function(t){return"millisekúnd"+(1===t?"a":"ur")},decimal:"."},it:{y:function(t){return"ann"+(1===t?"o":"i")},mo:function(t){return"mes"+(1===t?"e":"i")},w:function(t){return"settiman"+(1===t?"a":"e")},d:function(t){return"giorn"+(1===t?"o":"i")},h:function(t){return"or"+(1===t?"a":"e")},m:function(t){return"minut"+(1===t?"o":"i")},s:function(t){return"second"+(1===t?"o":"i")},ms:function(t){return"millisecond"+(1===t?"o":"i")},decimal:","},ja:{y:function(){return"年"},mo:function(){return"月"},w:function(){return"週"},d:function(){return"日"},h:function(){return"時間"},m:function(){return"分"},s:function(){return"秒"},ms:function(){return"ミリ秒"},decimal:"."},ko:{y:function(){return"년"},mo:function(){return"개월"},w:function(){return"주일"},d:function(){return"일"},h:function(){return"시간"},m:function(){return"분"},s:function(){return"초"},ms:function(){return"밀리 초"},decimal:"."},lo:{y:function(){return"ປີ"},mo:function(){return"ເດືອນ"},w:function(){return"ອາທິດ"},d:function(){return"ມື້"},h:function(){return"ຊົ່ວໂມງ"},m:function(){return"ນາທີ"},s:function(){return"ວິນາທີ"},ms:function(){return"ມິນລິວິນາທີ"},decimal:","},lt:{y:function(t){return t%10==0||t%100>=10&&t%100<=20?"metų":"metai"},mo:function(e){return["mėnuo","mėnesiai","mėnesių"][t.getLithuanianForm(e)]},w:function(e){return["savaitė","savaitės","savaičių"][t.getLithuanianForm(e)]},d:function(e){return["diena","dienos","dienų"][t.getLithuanianForm(e)]},h:function(e){return["valanda","valandos","valandų"][t.getLithuanianForm(e)]},m:function(e){return["minutė","minutės","minučių"][t.getLithuanianForm(e)]},s:function(e){return["sekundė","sekundės","sekundžių"][t.getLithuanianForm(e)]},ms:function(e){return["milisekundė","milisekundės","milisekundžių"][t.getLithuanianForm(e)]},decimal:","},lv:{y:function(e){return["gads","gadi"][t.getLatvianForm(e)]},mo:function(e){return["mēnesis","mēneši"][t.getLatvianForm(e)]},w:function(e){return["nedēļa","nedēļas"][t.getLatvianForm(e)]},d:function(e){return["diena","dienas"][t.getLatvianForm(e)]},h:function(e){return["stunda","stundas"][t.getLatvianForm(e)]},m:function(e){return["minūte","minūtes"][t.getLatvianForm(e)]},s:function(e){return["sekunde","sekundes"][t.getLatvianForm(e)]},ms:function(e){return["milisekunde","milisekundes"][t.getLatvianForm(e)]},decimal:","},ms:{y:function(){return"tahun"},mo:function(){return"bulan"},w:function(){return"minggu"},d:function(){return"hari"},h:function(){return"jam"},m:function(){return"minit"},s:function(){return"saat"},ms:function(){return"milisaat"},decimal:"."},nl:{y:function(){return"jaar"},mo:function(t){return 1===t?"maand":"maanden"},w:function(t){return 1===t?"week":"weken"},d:function(t){return 1===t?"dag":"dagen"},h:function(){return"uur"},m:function(t){return 1===t?"minuut":"minuten"},s:function(t){return 1===t?"seconde":"seconden"},ms:function(t){return 1===t?"milliseconde":"milliseconden"},decimal:","},no:{y:function(){return"år"},mo:function(t){return"måned"+(1===t?"":"er")},w:function(t){return"uke"+(1===t?"":"r")},d:function(t){return"dag"+(1===t?"":"er")},h:function(t){return"time"+(1===t?"":"r")},m:function(t){return"minutt"+(1===t?"":"er")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},pl:{y:function(e){return["rok","roku","lata","lat"][t.getPolishForm(e)]},mo:function(e){return["miesiąc","miesiąca","miesiące","miesięcy"][t.getPolishForm(e)]},w:function(e){return["tydzień","tygodnia","tygodnie","tygodni"][t.getPolishForm(e)]},d:function(e){return["dzień","dnia","dni","dni"][t.getPolishForm(e)]},h:function(e){return["godzina","godziny","godziny","godzin"][t.getPolishForm(e)]},m:function(e){return["minuta","minuty","minuty","minut"][t.getPolishForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekund"][t.getPolishForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekund"][t.getPolishForm(e)]},decimal:","},pt:{y:function(t){return"ano"+(1===t?"":"s")},mo:function(t){return 1===t?"mês":"meses"},w:function(t){return"semana"+(1===t?"":"s")},d:function(t){return"dia"+(1===t?"":"s")},h:function(t){return"hora"+(1===t?"":"s")},m:function(t){return"minuto"+(1===t?"":"s")},s:function(t){return"segundo"+(1===t?"":"s")},ms:function(t){return"milissegundo"+(1===t?"":"s")},decimal:","},ro:{y:function(t){return 1===t?"an":"ani"},mo:function(t){return 1===t?"lună":"luni"},w:function(t){return 1===t?"săptămână":"săptămâni"},d:function(t){return 1===t?"zi":"zile"},h:function(t){return 1===t?"oră":"ore"},m:function(t){return 1===t?"minut":"minute"},s:function(t){return 1===t?"secundă":"secunde"},ms:function(t){return 1===t?"milisecundă":"milisecunde"},decimal:","},ru:{y:function(e){return["лет","год","года"][t.getSlavicForm(e)]},mo:function(e){return["месяцев","месяц","месяца"][t.getSlavicForm(e)]},w:function(e){return["недель","неделя","недели"][t.getSlavicForm(e)]},d:function(e){return["дней","день","дня"][t.getSlavicForm(e)]},h:function(e){return["часов","час","часа"][t.getSlavicForm(e)]},m:function(e){return["минут","минута","минуты"][t.getSlavicForm(e)]},s:function(e){return["секунд","секунда","секунды"][t.getSlavicForm(e)]},ms:function(e){return["миллисекунд","миллисекунда","миллисекунды"][t.getSlavicForm(e)]},decimal:","},uk:{y:function(e){return["років","рік","роки"][t.getSlavicForm(e)]},mo:function(e){return["місяців","місяць","місяці"][t.getSlavicForm(e)]},w:function(e){return["тижнів","тиждень","тижні"][t.getSlavicForm(e)]},d:function(e){return["днів","день","дні"][t.getSlavicForm(e)]},h:function(e){return["годин","година","години"][t.getSlavicForm(e)]},m:function(e){return["хвилин","хвилина","хвилини"][t.getSlavicForm(e)]},s:function(e){return["секунд","секунда","секунди"][t.getSlavicForm(e)]},ms:function(e){return["мілісекунд","мілісекунда","мілісекунди"][t.getSlavicForm(e)]},decimal:","},ur:{y:function(){return"سال"},mo:function(t){return 1===t?"مہینہ":"مہینے"},w:function(t){return 1===t?"ہفتہ":"ہفتے"},d:function(){return"دن"},h:function(t){return 1===t?"گھنٹہ":"گھنٹے"},m:function(){return"منٹ"},s:function(){return"سیکنڈ"},ms:function(){return"ملی سیکنڈ"},decimal:"."},sk:{y:function(e){return["rok","roky","roky","rokov"][t.getCzechOrSlovakForm(e)]},mo:function(e){return["mesiac","mesiace","mesiace","mesiacov"][t.getCzechOrSlovakForm(e)]},w:function(e){return["týždeň","týždne","týždne","týždňov"][t.getCzechOrSlovakForm(e)]},d:function(e){return["deň","dni","dni","dní"][t.getCzechOrSlovakForm(e)]},h:function(e){return["hodina","hodiny","hodiny","hodín"][t.getCzechOrSlovakForm(e)]},m:function(e){return["minúta","minúty","minúty","minút"][t.getCzechOrSlovakForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekúnd"][t.getCzechOrSlovakForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekúnd"][t.getCzechOrSlovakForm(e)]},decimal:","},sv:{y:function(){return"år"},mo:function(t){return"månad"+(1===t?"":"er")},w:function(t){return"veck"+(1===t?"a":"or")},d:function(t){return"dag"+(1===t?"":"ar")},h:function(t){return"timm"+(1===t?"e":"ar")},m:function(t){return"minut"+(1===t?"":"er")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},tr:{y:function(){return"yıl"},mo:function(){return"ay"},w:function(){return"hafta"},d:function(){return"gün"},h:function(){return"saat"},m:function(){return"dakika"},s:function(){return"saniye"},ms:function(){return"milisaniye"},decimal:","},th:{y:function(){return"ปี"},mo:function(){return"เดือน"},w:function(){return"อาทิตย์"},d:function(){return"วัน"},h:function(){return"ชั่วโมง"},m:function(){return"นาที"},s:function(){return"วินาที"},ms:function(){return"มิลลิวินาที"},decimal:"."},vi:{y:function(){return"năm"},mo:function(){return"tháng"},w:function(){return"tuần"},d:function(){return"ngày"},h:function(){return"giờ"},m:function(){return"phút"},s:function(){return"giây"},ms:function(){return"mili giây"},decimal:","},zh_CN:{y:function(){return"年"},mo:function(){return"个月"},w:function(){return"周"},d:function(){return"天"},h:function(){return"小时"},m:function(){return"分钟"},s:function(){return"秒"},ms:function(){return"毫秒"},decimal:"."},zh_TW:{y:function(){return"年"},mo:function(){return"個月"},w:function(){return"周"},d:function(){return"天"},h:function(){return"小時"},m:function(){return"分鐘"},s:function(){return"秒"},ms:function(){return"毫秒"},decimal:"."}}}return t.prototype.addLanguage=function(t,e){this.languages[t]=e},t.prototype.getCzechForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&t%100<10?2:3},t.prototype.getPolishForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&!(t%100>10&&t%100<20)?2:3},t.prototype.getSlavicForm=function(t){return Math.floor(t)!==t?2:t>=5&&t<=20||t%10>=5&&t%10<=9||t%10==0?0:t%10==1?1:t>1?2:0},t.prototype.getLithuanianForm=function(t){return 1===t||t%10==1&&t%100>20?0:Math.floor(t)!==t||t%10>=2&&t%100>20||t%10>=2&&t%100<10?1:2},t.prototype.getArabicForm=function(t){return t<=2?0:t>2&&t<11?1:0},t.prototype.getCzechOrSlovakForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&t%100<10?2:3},t.prototype.getLatvianForm=function(t){return 1===t||t%10==1&&t%100!=11?0:1},t}(),li=function(){function t(t){this.languageUtil=t,this.defaultOptions={language:"en",delimiter:", ",spacer:" ",conjunction:"",serialComma:!0,units:["y","mo","w","d","h","m","s"],languages:{},largest:10,decimal:".",round:!1,unitMeasures:{y:315576e5,mo:26298e5,w:6048e5,d:864e5,h:36e5,m:6e4,s:1e3,ms:1}},this.options=void 0,this.options=this.defaultOptions}return t.prototype.humanize=function(t,e){var i=void 0!==e?this.extend(this.options,e):this.defaultOptions;return this.doHumanization(t,i)},t.prototype.setOptions=function(t){this.options=void 0!==t?this.extend(this.defaultOptions,t):this.defaultOptions},t.prototype.getSupportedLanguages=function(){var t=[];for(var e in this.languageUtil.languages)this.languageUtil.languages.hasOwnProperty(e)&&t.push(e);return t},t.prototype.addLanguage=function(t,e){this.languageUtil.addLanguage(t,e)},t.prototype.doHumanization=function(t,e){var i,n,a;t=Math.abs(t);var o=e.languages[e.language]||this.languageUtil.languages[e.language];if(!o)throw new Error("No language "+o+".");var r,s,l,u=[];for(i=0,n=e.units.length;i<n;i++)r=e.units[i],s=e.unitMeasures[r],l=i+1===n?t/s:Math.floor(t/s),u.push({unitCount:l,unitName:r}),t-=l*s;var d=0;for(i=0;i<u.length;i++)if(u[i].unitCount){d=i;break}if(e.round){var c=void 0,h=void 0;for(i=u.length-1;i>=0&&((a=u[i]).unitCount=Math.round(a.unitCount),0!==i);i--)h=u[i-1],c=e.unitMeasures[h.unitName]/e.unitMeasures[a.unitName],(a.unitCount%c===0||e.largest&&e.largest-1<i-d)&&(h.unitCount+=a.unitCount/c,a.unitCount=0)}var _=[];for(i=0,u.length;i<n&&((a=u[i]).unitCount&&_.push(this.render(a.unitCount,a.unitName,o,e)),_.length!==e.largest);i++);return _.length?e.conjunction&&1!==_.length?2===_.length?_.join(e.conjunction):_.length>2?_.slice(0,-1).join(e.delimiter)+(e.serialComma?",":"")+e.conjunction+_.slice(-1):void 0:_.join(e.delimiter):this.render(0,e.units[e.units.length-1],o,e)},t.prototype.render=function(t,e,i,n){var a;a=void 0===n.decimal?i.decimal:n.decimal;var o=t.toString().replace(".",a.toString()),r=i[e](t);return o+n.spacer+r},t.prototype.extend=function(t,e){for(var i in e)t.hasOwnProperty(i)&&(t[i]=e[i]);return t},t}();let ui=class extends kt{render(){return this.config&&this.hass&&this.duration?U`
      ${this.getDuration(this.duration)}
    `:U``}getDuration(t){var e,i,n,a,o,r,s,l,u,d,c,h,_;if(!t)return"";const m=new li(new si);let p=m.getSupportedLanguages().includes(null!==(i=null===(e=this.hass)||void 0===e?void 0:e.language)&&void 0!==i?i:"en")?null===(n=this.hass)||void 0===n?void 0:n.language:"en";(null===(o=null===(a=this.config)||void 0===a?void 0:a.duration)||void 0===o?void 0:o.labels)&&(m.addLanguage("custom",{y:()=>"y",mo:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.month)&&void 0!==n?n:"mo"},w:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.week)&&void 0!==n?n:"w"},d:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.day)&&void 0!==n?n:"d"},h:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.hour)&&void 0!==n?n:"h"},m:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.minute)&&void 0!==n?n:"m"},s:()=>{var t,e,i,n;return null!==(n=null===(i=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.second)&&void 0!==n?n:"s"},ms:()=>"ms",decimal:""}),p="custom");const g={language:p,units:null===(s=null===(r=this.config)||void 0===r?void 0:r.duration)||void 0===s?void 0:s.units,round:!0};return"full"!==(null===(u=null===(l=this.config)||void 0===l?void 0:l.duration)||void 0===u?void 0:u.largest)&&(g.largest=null===(c=null===(d=this.config)||void 0===d?void 0:d.duration)||void 0===c?void 0:c.largest),void 0!==(null===(_=null===(h=this.config)||void 0===h?void 0:h.duration)||void 0===_?void 0:_.delimiter)&&(g.delimiter=this.config.duration.delimiter),m.humanize(t,g)}};a([Et({type:Object})],ui.prototype,"hass",void 0),a([Et({type:Object})],ui.prototype,"config",void 0),a([Et({type:Number})],ui.prototype,"duration",void 0),ui=a([xt("logbook-duration")],ui);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const di=1,ci=t=>(...e)=>({_$litDirective$:t,values:e});let hi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const _i="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.maxTouchPoints>0;class mi extends HTMLElement{constructor(){super(),this.holdTime=500,this.held=!1,this.ripple=document.createElement("mwc-ripple")}connectedCallback(){Object.assign(this.style,{position:"absolute",width:_i?"100px":"50px",height:_i?"100px":"50px",transform:"translate(-50%, -50%)",pointerEvents:"none",zIndex:"999"}),this.appendChild(this.ripple),this.ripple.primary=!0,["touchcancel","mouseout","mouseup","touchmove","mousewheel","wheel","scroll"].forEach(t=>{document.addEventListener(t,()=>{clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0},{passive:!0})})}bind(t,e){if(t.actionHandler)return;t.actionHandler=!0,t.addEventListener("contextmenu",t=>{const e=t||window.event;return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0,e.returnValue=!1,!1});const i=t=>{let e,i;this.held=!1,t.touches?(e=t.touches[0].pageX,i=t.touches[0].pageY):(e=t.pageX,i=t.pageY),this.timer=window.setTimeout(()=>{this.startAnimation(e,i),this.held=!0},this.holdTime)},n=i=>{i.preventDefault(),["touchend","touchcancel"].includes(i.type)&&void 0===this.timer||(clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0,this.held?ue(t,"action",{action:"hold"}):e.hasDoubleClick?"click"===i.type&&i.detail<2||!this.dblClickTimeout?this.dblClickTimeout=window.setTimeout(()=>{this.dblClickTimeout=void 0,ue(t,"action",{action:"tap"})},250):(clearTimeout(this.dblClickTimeout),this.dblClickTimeout=void 0,ue(t,"action",{action:"double_tap"})):ue(t,"action",{action:"tap"}))};t.addEventListener("touchstart",i,{passive:!0}),t.addEventListener("touchend",n),t.addEventListener("touchcancel",n),t.addEventListener("mousedown",i,{passive:!0}),t.addEventListener("click",n),t.addEventListener("keyup",t=>{13===t.keyCode&&n(t)})}startAnimation(t,e){Object.assign(this.style,{left:`${t}px`,top:`${e}px`,display:null}),this.ripple.disabled=!1,this.ripple.active=!0,this.ripple.unbounded=!0}stopAnimation(){this.ripple.active=!1,this.ripple.disabled=!0,this.style.display="none"}}customElements.define("action-handler-logbook-card",mi);const pi=(t,e)=>{const i=(()=>{const t=document.body;if(t.querySelector("action-handler-logbook-card"))return t.querySelector("action-handler-logbook-card");const e=document.createElement("action-handler-logbook-card");return t.appendChild(e),e})();i&&i.bind(t,e)},gi=ci(class extends hi{update(t,[e]){return pi(t.element,e),R}render(t){}}),vi=(t,e)=>{var i;return e.message&&e.name?e.name.test(t.name)&&e.message.test(t.message||""):e.message?null===(i=e.message)||void 0===i?void 0:i.test(t.message||""):!!e.name&&e.name.test(t.name)},fi=(t,e)=>e.find(e=>vi(t,e)),bi=(t,e)=>{var i;return null===(i=fi(t,e))||void 0===i?void 0:i.icon_color},yi=(t,e)=>e.filter(t=>(t=>"log"===t.context_service||"automation_triggered"===t.context_event_type)(t)||(t=>"automation"===t.domain)(t)||(t=>"script"===t.context_domain)(t)).filter(e=>((t,e)=>!e.filter(t=>t.hidden).some(e=>vi(t,e)))(e,t.log_map)).map(e=>{return{type:"customLog",start:new Date(e.when),name:e.name,message:e.message||"",entity:t.entity,entity_name:t.entity_name||t.entity,icon:(i=e,n=t.log_map,null===(a=fi(i,n))||void 0===a?void 0:a.icon),icon_color:bi(e,t.log_map)};var i,n,a}),$i=t=>t.toString().replace(/\\/g,"\\\\").replace(/\u0008/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/'/g,"\\'").replace(/"/g,'\\"'),wi=t=>{if(void 0!==t)return new RegExp("^"+t.split(/\*+/).map(t=>(t=>t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&"))(t)).join(".*")+"$","s")},ki=(t,e)=>t.find(t=>{var i;return(null===(i=t.value)||void 0===i?void 0:i.test(e.state))&&(void 0===t.attributes||t.attributes.every(t=>void 0===t.name||void 0===t.value||t.value.test(e.attributes[null==t?void 0:t.name])))}),Si=(t,e,i)=>{const n=ki(i,e);return void 0!==n&&n.label?n.label:t?t.formatEntityState?t.formatEntityState(e):se(t.localize,e,t.locale):e.state},xi=(t,e)=>{const i=ki(e,t);if(void 0===i||void 0===i.icon&&void 0===i.icon_color)return null;const n=void 0!==i&&i.icon?i.icon:function(t){if(!t)return"hass:bookmark";if(t.attributes.icon)return t.attributes.icon;var e=ae(t.entity_id);return e in ve?ve[e](t):ce(e,t.state)}(t);return{icon:n,color:(null==i?void 0:i.icon_color)||void 0}},Ai=(t,e,i)=>null==(null==e?void 0:e.attributes)?[]:null==e?void 0:e.attributes.reduce((n,a)=>{if(t.attributes.hasOwnProperty(a.value)){const o=t.attributes[a.value];if(null===o||"string"==typeof o&&""===o.trim())return n;if("object"!=typeof o||Array.isArray(o))if(Array.isArray(o))n.push({name:a.label?a.label:a.value,value:ai(i,o.join(","),void 0,e.date_format)});else{const r=i.formatEntityAttributeName?i.formatEntityAttributeName(t,a.value):a.value,s=a.type?void 0:((t,e)=>{if(!Array.isArray(t)||0===t.length)return;const i=String(e);for(const e of t){if(!e.value||!e.replacement)continue;const t=wi(e.value);if(t&&t.test(i))return e.replacement}})(a.state_map,o);void 0!==s?n.push({name:a.label?a.label:r,value:s}):n.push({name:a.label?a.label:r,value:oi(i,t,a.value,o,a.type,e.date_format,a.link_label)})}else{Object.keys(o).forEach(t=>{n.push({name:t,value:ai(i,o[t],void 0,e.date_format)})})}}return n},[]),Ei=(t,e)=>{const i=t[t.length-1];return!i||i.state!==e.state&&"unknown"!==e.state?t.push(e):(i.end=e.end,i.duration+=e.duration),t},Ci=(t,e,i)=>t.map(t=>({type:"history",stateObj:t,entity_name:i.entity_name||t.attributes.friendly_name||i.entity,state:t.state,label:Si(e,t,i.state_map||[]),start:new Date(t.last_changed),attributes:Ai(t,i,e),icon:xi(t,i.state_map||[])})).map((t,e,i)=>e<i.length-1?Object.assign(Object.assign({},t),{end:i[e+1].start}):Object.assign(Object.assign({},t),{end:new Date})).map(t=>Object.assign(Object.assign({},t),{duration:t.end.valueOf()-t.start.valueOf()})).filter(t=>((t,e)=>!t.minimal_duration||e.duration>=1e3*t.minimal_duration)(i,t)).reduce(Ei,[]).filter(t=>((t,e)=>0===t.hidden_state_regexp.length||!t.hidden_state_regexp.some(t=>t.attribute&&!Object.keys(e.stateObj.attributes).some(e=>{var i;return e===(null===(i=t.attribute)||void 0===i?void 0:i.name)})?t.attribute.hideIfMissing:t.state&&t.attribute?t.state.test($i(e.state))&&t.attribute.value.test($i(e.stateObj.attributes[t.attribute.name])):t.attribute?t.attribute.value.test($i(e.stateObj.attributes[t.attribute.name])):t.state.test($i(e.state))))(i,t)),Oi=t=>{var e;return null!==(e=null==t?void 0:t.map(t=>{var e,i,n;return Object.assign(Object.assign({},t),{value:wi(null!==(e=t.value)&&void 0!==e?e:""),attributes:null!==(n=null===(i=t.attributes)||void 0===i?void 0:i.map(t=>{return{name:(e=t).name,value:wi(e.value)};var e}))&&void 0!==n?n:[]})}))&&void 0!==e?e:[]},ji=t=>{var e;return null!==(e=null==t?void 0:t.map(t=>Object.assign(Object.assign({},t),{name:wi(t.name),message:wi(t.message),hidden:t.hidden||!1})))&&void 0!==e?e:[]},Mi=t=>t?t.map(t=>"string"==typeof t?{state:t}:t).map(t=>{var e;return{state:wi(t.state),attribute:t.attribute?{name:t.attribute.name,value:wi(t.attribute.value),hideIfMissing:null!==(e=t.attribute.hideIfMissing)&&void 0!==e&&e}:void 0}}):[],Di="important",Fi=" !"+Di,zi=ci(class extends hi{constructor(t){var e;if(super(t),t.type!==di||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ht){this.ht=new Set;for(const t in e)this.ht.add(t);return this.render(e)}this.ht.forEach(t=>{null==e[t]&&(this.ht.delete(t),t.includes("-")?i.removeProperty(t):i[t]="")});for(const t in e){const n=e[t];if(null!=n){this.ht.add(t);const e="string"==typeof n&&n.endsWith(Fi);t.includes("-")||e?i.setProperty(t,e?n.slice(0,-11):n,e?Di:""):i[t]=n}}return R}}),Ni=(t,e)=>t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate();class Ti extends kt{constructor(){super(...arguments),this.updateHistoryIntervalId=null,this.UPDATE_INTERVAL=5e3}showEntityName(t){var e,i,n;return!0===(null===(e=t.show)||void 0===e?void 0:e.entity_name)&&(null!==(n=null===(i=t.entities)||void 0===i?void 0:i.length)&&void 0!==n?n:0)>1}_handleAction(t){this.hass&&t.detail.action&&t.target&&t.target.entity&&function(t,e,i,n){var a;"double_tap"===n&&i.double_tap_action?a=i.double_tap_action:"hold"===n&&i.hold_action?a=i.hold_action:"tap"===n&&i.tap_action&&(a=i.tap_action),me(t,e,i,a)}(this,this.hass,{entity:t.target.entity},t.detail.action)}connectedCallback(){super.connectedCallback(),this.updateHistoryIntervalId=setInterval(()=>this.updateHistory(),this.UPDATE_INTERVAL),setTimeout(()=>this.updateHistory(),1)}disconnectedCallback(){super.disconnectedCallback(),null!==this.updateHistoryIntervalId&&clearInterval(this.updateHistoryIntervalId)}renderHistory(t,e){if(!t||0===(null==t?void 0:t.length))return U`
        <p>
          ${e.no_event}
        </p>
      `;if(e.collapse&&t.length>e.collapse){const i=`expander${Math.random().toString(10).substring(2)}`;return U`
        ${this.renderHistoryItems(t.slice(0,e.collapse),void 0,e)}
        <input type="checkbox" class="expand" id="${i}" />
        <label for="${i}"><div>&lsaquo;</div></label>
        <div>
          ${this.renderHistoryItems(t.slice(e.collapse),t[e.collapse],e)}
        </div>
      `}return this.renderHistoryItems(t,void 0,e)}renderHistoryItems(t,e,i){return U`
      ${null==t?void 0:t.map((n,a,o)=>{const r=a+1===o.length,s=this.shouldRenderDaySeparator(t,e,a);return"history"===n.type?U`
            ${s?this.renderDaySeparator(n,i):""}
            ${this.renderHistoryItem(n,r,i)}
          `:U`
          ${s?this.renderDaySeparator(n,i):""}
          ${this.renderCustomLogEvent(n,r,i)}
        `})}
    `}shouldRenderDaySeparator(t,e,i){const n=t[i];return void 0===e&&0===i||void 0!==e&&0===i&&!Ni(n.start,e.start)||i>0&&!Ni(n.start,t[i-1].start)}elementStyleInfo(t,e){var i;const n=null===(i=null==t?void 0:t.element_styles)||void 0===i?void 0:i[e],a={};return(null==n?void 0:n.color)&&(a.color=n.color),(null==n?void 0:n.font_size)&&(a["font-size"]=n.font_size),a}itemConfig(t,e){var i,n,a,o,r;const s=e,l=t instanceof Object&&"stateObj"in t?null===(i=t.stateObj)||void 0===i?void 0:i.entity_id:t.entity,u=null===(n=s.entities)||void 0===n?void 0:n.find(t=>t.entity&&t.entity===l);if(!u)return e;const d=u.show&&Object.keys(u.show).length>0,c=u.element_styles&&Object.keys(u.element_styles).length>0;return d||u.layout||c?Object.assign(Object.assign({},e),{show:d?Object.assign(Object.assign({},null!==(a=e.show)&&void 0!==a?a:{}),u.show):e.show,layout:null!==(o=u.layout)&&void 0!==o?o:e.layout,element_styles:c?Object.assign(Object.assign({},null!==(r=e.element_styles)&&void 0!==r?r:{}),u.element_styles):e.element_styles}):e}renderHistoryItem(t,e,i){var n,a,o,r,s,l,u;const d=this.itemConfig(t,i),c=new Map;(null===(n=null==d?void 0:d.show)||void 0===n?void 0:n.state)&&c.set("state",U`
          <span class="state" style=${zi(this.elementStyleInfo(d,"state"))}>${t.label}</span>
        `),(null===(a=null==d?void 0:d.show)||void 0===a?void 0:a.duration)&&c.set("duration",U`
          <span class="duration" style=${zi(this.elementStyleInfo(d,"duration"))}>
            <logbook-duration .hass="${this.hass}" .config="${d}" .duration="${t.duration}">
            </logbook-duration>
          </span>
        `),(null!==(o=t.attributes)&&void 0!==o?o:[]).forEach((t,e)=>{c.set(`attributes:${e}`,U`
          <div class="attribute" style=${zi(this.elementStyleInfo(d,"attributes"))}>
            ${(null==d?void 0:d.attribute_hide_label)?"":U`
                  <div class="key">${t.name}</div>
                `}
            <div class="value">${t.value}</div>
          </div>
        `)}),((null===(r=null==d?void 0:d.show)||void 0===r?void 0:r.start_date)||(null===(s=null==d?void 0:d.show)||void 0===s?void 0:s.end_date))&&c.set("time",this.renderHistoryDate(t,d));const h=this.showEntityName(d)?this.renderEntity(t.stateObj.entity_id,t.entity_name,i):void 0,_=ye(null==d?void 0:d.layout,null!==(u=null===(l=t.attributes)||void 0===l?void 0:l.length)&&void 0!==u?u:0).map(t=>{const e=t=>{if("state"===t&&h)return[h,c.get(t)].filter(Boolean);const e=c.get(t);return e?[e]:[]},i=t.left.flatMap(e),n=t.right.flatMap(e);return 0===i.length&&0===n.length?null:U`
          <div class="row">
            ${i}
            ${n.length?U`
                  <div class="row-right">${n}</div>
                `:""}
          </div>
        `}).filter(Boolean);return U`
      <div class="item history">
        ${this.renderHistoryIcon(t,d)}
        <div class="item-content">
          ${_}
        </div>
      </div>
      ${e?"":this.renderSeparator(d)}
    `}renderCustomLogEvent(t,e,i){const n=this.itemConfig(t,i);return U`
      <div class="item custom-log">
        ${this.renderCustomLogIcon(t,n)}
        <div class="item-content">
          ${this.showEntityName(n)?this.renderEntity(t.entity,t.entity_name,i):""}
          <span class="custom-log__name">${t.name}</span>
          <span class="custom-log__separator">-</span>
          <span class="custom-log__message">${t.message}</span>
          <div class="date">
            <logbook-date .hass=${this.hass} .date=${t.start} .config=${n}></logbook-date>
          </div>
        </div>
      </div>
      ${e?"":this.renderSeparator(n)}
    `}renderCustomLogIcon(t,e){var i;if(null===(i=null==e?void 0:e.show)||void 0===i?void 0:i.icon){const e=this.hass.states[t.entity];return this.renderIcon(e,t.icon,t.icon_color)}}renderHistoryIcon(t,e){var i,n,a;if(null===(i=null==e?void 0:e.show)||void 0===i?void 0:i.icon)return this.renderIcon(t.stateObj,null===(n=t.icon)||void 0===n?void 0:n.icon,null===(a=t.icon)||void 0===a?void 0:a.color)}renderIcon(t,e,i){return U`
      <div class="item-icon">
        <state-badge .hass=${this.hass} .stateObj=${t} .overrideIcon=${e} .color=${i} .stateColor=${!0}>
        </state-badge>
      </div>
    `}renderDaySeparator(t,e){var i,n;return e.group_by_day?U`
      <div class="date-separator">
        ${new Intl.DateTimeFormat(null!==(n=null===(i=this.hass.locale)||void 0===i?void 0:i.language)&&void 0!==n?n:"en",{year:"numeric",month:"long",day:"numeric"}).format(t.start)}
      </div>
    `:U``}renderSeparator(t){var e,i,n,a,o,r;const s=null!==(i=null===(e=null==t?void 0:t.separator_style)||void 0===e?void 0:e.width)&&void 0!==i?i:1,l=null!==(a=null===(n=null==t?void 0:t.separator_style)||void 0===n?void 0:n.style)&&void 0!==a?a:"solid",u={border:"0","border-top":`${"double"===l&&s<3?3:s}px ${l} ${null===(o=null==t?void 0:t.separator_style)||void 0===o?void 0:o.color}`};if(null===(r=null==t?void 0:t.show)||void 0===r?void 0:r.separator)return U`
        <hr class="separator" style=${zi(u)} aria-hidden="true" />
      `}renderEntity(t,e,i){return U`
      <span
        class="entity"
        .entity=${t}
        @action=${this._handleAction}
        .actionHandler=${gi({hasHold:pe(i.hold_action),hasDoubleClick:pe(i.double_tap_action)})}
        >${e}</span
      >
    `}renderHistoryDate(t,e){var i,n,a,o;const r=zi(this.elementStyleInfo(e,"time"));return(null===(i=null==e?void 0:e.show)||void 0===i?void 0:i.start_date)&&(null===(n=null==e?void 0:e.show)||void 0===n?void 0:n.end_date)?U`
        <div class="date" style=${r}>
          <logbook-date .hass=${this.hass} .date=${t.start} .config=${e}></logbook-date> -
          <logbook-date .hass=${this.hass} .date=${t.end} .config=${e}></logbook-date>
        </div>
      `:(null===(a=null==e?void 0:e.show)||void 0===a?void 0:a.end_date)?U`
        <div class="date" style=${r}>
          <logbook-date .hass=${this.hass} .date=${t.end} .config=${e}></logbook-date>
        </div>
      `:(null===(o=null==e?void 0:e.show)||void 0===o?void 0:o.start_date)?U`
        <div class="date" style=${r}>
          <logbook-date .hass=${this.hass} .date=${t.start} .config=${e}></logbook-date>
        </div>
      `:U``}static get styles(){return ut`
      .copy {
        user-select: text;
      }
      ha-card {
        overflow: clip;
      }
      .card-content-scroll {
        max-height: 345px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-gutter: stable;
      }
      .item {
        clear: both;
        padding: 5px 0;
        display: flex;
        line-height: var(--paper-font-body1_-_line-height);
      }
      .item-content {
        flex: 1;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.5rem;
      }
      .row > * {
        min-width: 0;
      }
      /* 行内右组：靠行尾对齐 */
      .row-right {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.5rem;
        margin-left: auto;
      }
      .row > .attribute {
        flex: 1 1 auto;
      }
      .item-icon {
        flex: 0 0 4rem;
        color: var(--paper-item-icon-color, #44739e);
        display: flex;
        justify-content: center;
      }
      .entity {
        color: var(--paper-item-icon-color);
        cursor: pointer;
      }
      state-badge {
        line-height: 1.5rem;
      }
      state-badge[icon] {
        height: fit-content;
      }
      .state,
      .attribute {
        white-space: pre-wrap;
      }
      .duration {
        font-size: 0.85rem;
        font-style: italic;
        float: right;
      }
      .date {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .attribute {
        display: flex;
        justify-content: space-between;
      }
      .expand {
        display: none;
      }
      .expand + label {
        display: block;
        text-align: right;
        cursor: pointer;
      }
      .expand + label > div {
        display: inline-block;
        transform: rotate(-90deg);
        font-size: 26px;
        height: 29px;
        width: 29px;
        text-align: center;
      }
      .expand + label > div,
      .expand + label + div {
        transition: 0.5s ease-in-out;
      }
      .expand:checked + label > div {
        transform: rotate(-90deg) scaleX(-1);
      }
      .expand + label + div {
        display: none;
        overflow: hidden;
      }
      .expand:checked + label + div {
        display: block;
      }
      .date-separator {
        display: block;
        border-block-end: 1px solid var(--divider-color);
        padding: 0.5rem 1rem;
        font-weight: bold;
        margin-block-end: 1rem;
      }
    `}}a([Et({attribute:!1})],Ti.prototype,"hass",void 0);const Hi=ci(class extends hi{constructor(t){var e;if(super(t),t.type!==di||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var i,n;if(void 0===this.it){this.it=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!(null===(i=this.nt)||void 0===i?void 0:i.has(t))&&this.it.add(t);return this.render(e)}const a=t.element.classList;this.it.forEach(t=>{t in e||(a.remove(t),this.it.delete(t))});for(const t in e){const i=!!e[t];i===this.it.has(t)||(null===(n=this.nt)||void 0===n?void 0:n.has(t))||(i?(a.add(t),this.it.add(t)):(a.remove(t),this.it.delete(t)))}return R}});var Ii,Pi,Li,Ui;Pi="logbook-card",Li="Logbook Card",Ui="A custom card to display entity history",window.customCards=window.customCards||[],window.customCards.push({type:Pi,name:Li,preview:!0,description:Ui});const Ri=new Map;let Yi=Ii=class extends Ti{constructor(){super(...arguments),this.history=[]}willUpdate(t){t.has("hass")&&this.hass&&(Re(this.hass),this.lastHistoryChanged||this.updateHistory())}static async getConfigElement(){return document.createElement("logbook-card-editor")}static getStubConfig(t,e){return{entities:[{entity:e[0]}]}}dataSignature(t){var e;const i=(null!==(e=t.entities)&&void 0!==e?e:[]).map(t=>Ii.ENTITY_DATA_KEYS.map(e=>t[e]));return JSON.stringify([t.entity,t.attributes,t.state_map,t.hidden_state,t.custom_logs,t.custom_log_map,t.hours_to_show,t.minimal_duration,t.show_history,t.desc,t.max_items,i])}setConfig(t){(t=>{var e,i;if(!t)throw new Error(qe("common.invalid_configuration"));if(void 0!==t.max_items&&!Number.isInteger(t.max_items))throw new Error(qe("common.invalid_max_items"));if(t.desc&&"boolean"!=typeof t.desc)throw new Error(qe("common.invalid_desc"));if(t.collapse&&!Number.isInteger(t.collapse))throw new Error(qe("common.invalid_collapse"));if(t.collapse&&t.max_items&&t.max_items>0&&t.collapse>t.max_items)throw new Error(qe("common.collapse_greater_than_max_items"));if((null===(e=t.duration)||void 0===e?void 0:e.units)&&!Array.isArray(t.duration.units))throw new Error(qe("common.invalid_duration_units"));if((null===(i=t.duration)||void 0===i?void 0:i.largest)&&!Number.isInteger(t.duration.largest)&&"full"!==t.duration.largest)throw new Error(qe("common.invalid_duration_largest"));if(t.minimal_duration&&!Number.isInteger(t.minimal_duration)&&t.minimal_duration<=0)throw new Error(qe("common.invalid_minimal_duration"))})(t);const a=Array.isArray(t.entities);if(!a&&!t.entity)throw new Error(qe("logbook_card.missing_entity"));if(a&&0===t.entities.length)throw new Error(qe("logbook_card.missing_entity"));if(!a){if(t.hidden_state&&!Array.isArray(t.hidden_state))throw new Error(qe("logbook_card.invalid_hidden_state"));if(t.state_map&&!Array.isArray(t.state_map))throw new Error(qe("logbook_card.invalid_state_map"));if(t.custom_log_map&&!Array.isArray(t.custom_log_map))throw new Error(qe("logbook_card.invalid_custom_log_map"));if(t.attributes&&!Array.isArray(t.attributes))throw new Error(qe("logbook_card.invalid_attributes"))}const o=this.config?this.dataSignature(this.config):void 0;var r;this.config=Object.assign(Object.assign({history:5,hidden_state:[],desc:!0,max_items:-1,no_event:qe("common.default_no_event"),attributes:[],scroll:!0,custom_logs:!1,show_history:!0,custom_log_map:[],allow_copy:!1},t),{hours_to_show:t.hours_to_show?t.hours_to_show:t.history?(r=t.history,24*r):void 0,hidden_state_regexp:Mi(t.hidden_state),show:Object.assign(Object.assign({},e),t.show),duration:Object.assign(Object.assign({},i),t.duration),duration_labels:Object.assign({},t.duration_labels),separator_style:Object.assign(Object.assign({},n),t.separator_style),entities:a?t.entities.map(t=>{var e;return{attributes:null!==(e=t.attributes)&&void 0!==e?e:[],entity:t.entity,label:t.label,state_map:t.state_map,hidden_state:t.hidden_state,custom_logs:t.custom_logs,custom_log_map:t.custom_log_map,show_history:t.show_history,show:t.show,layout:t.layout,element_styles:t.element_styles}}):void 0});const s=this.dataSignature(this.config),l=Ri.get(s);l&&(this.history=l.items,this.lastHistoryChanged=l.changed),o&&o===s||this.updateHistory()}resolveEntityConfigs(){return this.config.entities&&this.config.entities.length>0?this.config.entities:this.config.entity?[{entity:this.config.entity,label:void 0,attributes:this.config.attributes,state_map:this.config.state_map,hidden_state:this.config.hidden_state,custom_logs:this.config.custom_logs,custom_log_map:this.config.custom_log_map}]:[]}updateHistory(){var t,e;const i=this.hass;if(!i||!this.config)return;const n=this.resolveEntityConfigs().filter(t=>!!t.entity&&!!i.states[t.entity]);if(0===n.length)return;if(!1!==this.config.show_title&&!this.config.title){const a=n[0].entity,o=null===(e=null===(t=i.states[a])||void 0===t?void 0:t.attributes)||void 0===e?void 0:e.friendly_name;o&&(this.config.title=qe("logbook_card.default_title","{entity}",o))}const a=((t=120)=>new Date((new Date).setHours((new Date).getHours()-t)))(this.config.hours_to_show),o=n.map(t=>{const e={attributes:t.attributes,entity:t.entity,entity_name:t.label,hidden_state_regexp:Mi(t.hidden_state),state_map:Oi(t.state_map),date_format:this.config.date_format,minimal_duration:this.config.minimal_duration,show_history:this.config.show_history||!1};return((t,e,i)=>{if(!e.show_history)return Promise.resolve([]);const n="history/period/"+i.toISOString()+"?filter_entity_id="+e.entity+"&end_time="+(new Date).toISOString();return t.callApi("GET",n).then(i=>Ci(i[0]||[],t,e))})(i,e,a)}),r=n.map(t=>{var e,n,o;const r={entity:t.entity,entity_name:null!==(o=null!==(e=t.label)&&void 0!==e?e:null===(n=i.states[t.entity].attributes)||void 0===n?void 0:n.friendly_name)&&void 0!==o?o:t.entity,custom_logs:!0===t.custom_logs,log_map:ji(t.custom_log_map||[])};return((t,e,i)=>{if(e.custom_logs){const n=(new Date).toISOString();return t.callApi("GET",`logbook/${i.toISOString()}?entity=${e.entity}&end_time=${n}`).then(t=>yi(e,t))}return Promise.resolve([])})(i,r,a)});Promise.all([...o,...r]).then(t=>{var e,i;let n=t.flat().sort((t,e)=>t.start.valueOf()-e.start.valueOf());(null===(e=this.config)||void 0===e?void 0:e.desc)&&(n=n.reverse()),this.config&&this.config.max_items&&this.config.max_items>0&&(n=n.splice(0,null===(i=this.config)||void 0===i?void 0:i.max_items)),this.history=n,this.lastHistoryChanged=new Date;const a=this.dataSignature(this.config);if(Ri.set(a,{items:n,changed:this.lastHistoryChanged}),Ri.size>10){const t=Ri.keys().next().value;void 0!==t&&Ri.delete(t)}})}shouldUpdate(t){return!(!t.has("history")&&!t.has("config"))||(t.delete("history"),t.delete("config"),!1)}render(){var t,e,i;if(!this.config||!this.hass||!this.lastHistoryChanged)return U``;const n=this.config.scroll?"card-content-scroll":"",a={copy:this.config.allow_copy||!1};return U`
      <ha-card class=${Hi(a)} tabindex="0">
        ${!1!==this.config.show_title&&this.config.title?U`
              <h1
                aria-label=${`${this.config.title}`}
                class="card-header"
                .entity=${null!==(t=this.config.entity)&&void 0!==t?t:null===(i=null===(e=this.config.entities)||void 0===e?void 0:e[0])||void 0===i?void 0:i.entity}
                @action=${this._handleAction}
                .actionHandler=${gi({hasHold:pe(this.config.hold_action),hasDoubleClick:pe(this.config.double_tap_action)})}
              >
                ${this.config.title}
              </h1>
            `:""}
        <div class="card-content ${n} grid">
          ${this.renderHistory(this.history,this.config)}
        </div>
      </ha-card>
    `}};Yi.ENTITY_DATA_KEYS=["entity","label","attributes","state_map","hidden_state","custom_logs","custom_log_map","show_history"],a([Ct()],Yi.prototype,"config",void 0),a([Ct()],Yi.prototype,"history",void 0),Yi=Ii=a([xt("logbook-card")],Yi),console.info(`%c LOGBOOK-CARD %c ${t} `,"color: orange; font-weight: bold; background: black","color: darkblue; font-weight: bold; background: white");
