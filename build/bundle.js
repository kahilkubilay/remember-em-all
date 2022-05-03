var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function l(e){e.forEach(t)}function a(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i,s;function o(e,t){return i||(i=document.createElement("a")),i.href=t,e===i.href}function c(t,n,l){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const l=t.subscribe(...n);return l.unsubscribe?()=>l.unsubscribe():l}(n,l))}function u(e,t,n){return e.set(n),t}function d(e,t){e.appendChild(t)}function p(e,t,n){e.insertBefore(t,n||null)}function m(e){e.parentNode.removeChild(e)}function g(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function h(e){return document.createElement(e)}function f(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function v(e){return document.createTextNode(e)}function k(){return v(" ")}function y(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function b(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function $(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function w(e,t){e.value=null==t?"":t}function z(e,t,n){e.classList[n?"add":"remove"](t)}function x(e){s=e}function S(){const e=function(){if(!s)throw new Error("Function called outside component initialization");return s}();return(t,n)=>{const l=e.$$.callbacks[t];if(l){const a=function(e,t,n=!1){const l=document.createEvent("CustomEvent");return l.initCustomEvent(e,n,!1,t),l}(t,n);l.slice().forEach((t=>{t.call(e,a)}))}}}const T=[],_=[],L=[],C=[],j=Promise.resolve();let M=!1;function N(e){L.push(e)}const H=new Set;let E=0;function P(){const e=s;do{for(;E<T.length;){const e=T[E];E++,x(e),A(e.$$)}for(x(null),T.length=0,E=0;_.length;)_.pop()();for(let e=0;e<L.length;e+=1){const t=L[e];H.has(t)||(H.add(t),t())}L.length=0}while(T.length);for(;C.length;)C.pop()();M=!1,H.clear(),x(e)}function A(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}const D=new Set;let J;function B(){J={r:0,c:[],p:J}}function q(){J.r||l(J.c),J=J.p}function U(e,t){e&&e.i&&(D.delete(e),e.i(t))}function O(e,t,n,l){if(e&&e.o){if(D.has(e))return;D.add(e),J.c.push((()=>{D.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}}function R(e){e&&e.c()}function K(e,n,r,i){const{fragment:s,on_mount:o,on_destroy:c,after_update:u}=e.$$;s&&s.m(n,r),i||N((()=>{const n=o.map(t).filter(a);c?c.push(...n):l(n),e.$$.on_mount=[]})),u.forEach(N)}function G(e,t){const n=e.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function I(e,t){-1===e.$$.dirty[0]&&(T.push(e),M||(M=!0,j.then(P)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Y(t,a,r,i,o,c,u,d=[-1]){const p=s;x(t);const g=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:o,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(p?p.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:a.target||p.$$.root};u&&u(g.root);let h=!1;if(g.ctx=r?r(t,a.props||{},((e,n,...l)=>{const a=l.length?l[0]:n;return g.ctx&&o(g.ctx[e],g.ctx[e]=a)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](a),h&&I(t,e)),n})):[],g.update(),h=!0,l(g.before_update),g.fragment=!!i&&i(g.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);g.fragment&&g.fragment.l(e),e.forEach(m)}else g.fragment&&g.fragment.c();a.intro&&U(t.$$.fragment),K(t,a.target,a.anchor,a.customElement),P()}x(p)}class F{$destroy(){G(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function V(t){let n,l,a;return{c(){n=h("div"),l=h("img"),o(l.src,a="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png")||b(l,"src","https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"),b(l,"class","single-poke"),b(l,"alt",t[0]),b(n,"class","back svelte-awkf73")},m(e,t){p(e,n,t),d(n,l)},p(e,[t]){1&t&&b(l,"alt",e[0])},i:e,o:e,d(e){e&&m(n)}}}function Q(e,t,n){let{pokemonNumber:l}=t;return e.$$set=e=>{"pokemonNumber"in e&&n(0,l=e.pokemonNumber)},[l]}class W extends F{constructor(e){super(),Y(this,e,Q,V,r,{pokemonNumber:0})}}function X(t){let n,l,a;return{c(){n=h("div"),l=h("img"),o(l.src,a="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+t[0]+".png")||b(l,"src",a),b(l,"alt","card on the playing field"),b(l,"class","single-poke"),b(l,"pokemondetail",t[0]),b(n,"class","front svelte-od8hra")},m(e,t){p(e,n,t),d(n,l)},p(e,[t]){1&t&&!o(l.src,a="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+e[0]+".png")&&b(l,"src",a),1&t&&b(l,"pokemondetail",e[0])},i:e,o:e,d(e){e&&m(n)}}}function Z(e,t,n){let{pokemonNumber:l}=t;return e.$$set=e=>{"pokemonNumber"in e&&n(0,l=e.pokemonNumber)},[l]}class ee extends F{constructor(e){super(),Y(this,e,Z,X,r,{pokemonNumber:0})}}function te(e){let t,n,l,a,r;return n=new W({props:{pokemonNumber:e[0]}}),a=new ee({props:{pokemonNumber:e[0]}}),{c(){t=h("div"),R(n.$$.fragment),l=k(),R(a.$$.fragment),b(t,"class","flipper svelte-d4nmyx")},m(e,i){p(e,t,i),K(n,t,null),d(t,l),K(a,t,null),r=!0},p(e,[t]){const l={};1&t&&(l.pokemonNumber=e[0]),n.$set(l);const r={};1&t&&(r.pokemonNumber=e[0]),a.$set(r)},i(e){r||(U(n.$$.fragment,e),U(a.$$.fragment,e),r=!0)},o(e){O(n.$$.fragment,e),O(a.$$.fragment,e),r=!1},d(e){e&&m(t),G(n),G(a)}}}function ne(e,t,n){let{pokemonNumber:l}=t;return e.$$set=e=>{"pokemonNumber"in e&&n(0,l=e.pokemonNumber)},[l]}class le extends F{constructor(e){super(),Y(this,e,ne,te,r,{pokemonNumber:0})}}class ae{constructor(e){this.level=e}list(){const e=[],t=5*this.level;let n=t-5+1;for(;n<=t;n++)e.push(n);return e}shakeList(e){const t=[],n=e.concat(e),l=n.length-1;for(let e=0;e<l+1;e++){const e=Math.trunc(Math.random()*n.length);t.push(n[e]),n.splice(n.indexOf(n[e]),1)}return t}}const re=[];function ie(t,n=e){let l;const a=new Set;function i(e){if(r(t,e)&&(t=e,l)){const e=!re.length;for(const e of a)e[1](),re.push(e,t);if(e){for(let e=0;e<re.length;e+=2)re[e][0](re[e+1]);re.length=0}}}return{set:i,update:function(e){i(e(t))},subscribe:function(r,s=e){const o=[r,s];return a.add(o),1===a.size&&(l=n(i)||e),r(t),()=>{a.delete(o),0===a.size&&(l(),l=null)}}}}const se=new class{constructor(e=ie(""),t=ie(""),n=ie(1),l=ie(0),a=ie(!1)){this.name=e,this.avatar=t,this.level=n,this.score=l,this.isStart=a}};function oe(t){let n,l,a,r;return{c(){n=h("div"),l=h("input"),b(l,"type","text"),b(l,"name","name"),b(l,"placeholder","pika pika"),b(l,"class","name svelte-fbtkw3"),b(n,"class","user")},m(e,i){p(e,n,i),d(n,l),w(l,t[0]),a||(r=y(l,"input",t[2]),a=!0)},p(e,[t]){1&t&&l.value!==e[0]&&w(l,e[0])},i:e,o:e,d(e){e&&m(n),a=!1,r()}}}function ce(e,t,n){let l;const{name:a}=se;return c(e,a,(e=>n(0,l=e))),[l,a,function(){l=this.value,a.set(l)}]}class ue extends F{constructor(e){super(),Y(this,e,ce,oe,r,{})}}function de(t){let n;return{c(){n=h("div"),n.innerHTML="<h2>select your pokemon and start the battle!</h2>",b(n,"class","header svelte-1tuqxk")},m(e,t){p(e,n,t)},p:e,i:e,o:e,d(e){e&&m(n)}}}class pe extends F{constructor(e){super(),Y(this,e,null,de,r,{})}}function me(t){let n,l,a,r;return{c(){n=h("img"),o(n.src,l=t[0])||b(n,"src",l),b(n,"alt","avatar"),b(n,"class","avatar unpicked svelte-186co7w")},m(e,l){p(e,n,l),a||(r=y(n,"click",t[2]),a=!0)},p(e,[t]){1&t&&!o(n.src,l=e[0])&&b(n,"src",l)},i:e,o:e,d(e){e&&m(n),a=!1,r()}}}function ge(e,t,n){let l;const{avatar:a}=se;c(e,a,(e=>n(3,l=e)));let{userSelectAvatar:r}=t;return e.$$set=e=>{"userSelectAvatar"in e&&n(0,r=e.userSelectAvatar)},[r,a,e=>{const t=document.querySelector(".picked");null!==t&&(t.classList.add("unpicked"),t.classList.remove("picked")),e.target.classList.add("picked"),e.target.classList.remove("unpicked");const n=r.match(/\w*(?=.\w+$)/)[0];u(a,l=n,l)}]}class he extends F{constructor(e){super(),Y(this,e,ge,me,r,{userSelectAvatar:0})}}function fe(e,t,n){const l=e.slice();return l[1]=t[n],l}function ve(t){let n,l;return n=new he({props:{userSelectAvatar:t[1]}}),{c(){R(n.$$.fragment)},m(e,t){K(n,e,t),l=!0},p:e,i(e){l||(U(n.$$.fragment,e),l=!0)},o(e){O(n.$$.fragment,e),l=!1},d(e){G(n,e)}}}function ke(e){let t,n,l=e[0],a=[];for(let t=0;t<l.length;t+=1)a[t]=ve(fe(e,l,t));const r=e=>O(a[e],1,1,(()=>{a[e]=null}));return{c(){t=h("div");for(let e=0;e<a.length;e+=1)a[e].c();b(t,"class","avatars svelte-se4ogx")},m(e,l){p(e,t,l);for(let e=0;e<a.length;e+=1)a[e].m(t,null);n=!0},p(e,[n]){if(1&n){let i;for(l=e[0],i=0;i<l.length;i+=1){const r=fe(e,l,i);a[i]?(a[i].p(r,n),U(a[i],1)):(a[i]=ve(r),a[i].c(),U(a[i],1),a[i].m(t,null))}for(B(),i=l.length;i<a.length;i+=1)r(i);q()}},i(e){if(!n){for(let e=0;e<l.length;e+=1)U(a[e]);n=!0}},o(e){a=a.filter(Boolean);for(let e=0;e<a.length;e+=1)O(a[e]);n=!1},d(e){e&&m(t),g(a,e)}}}function ye(e){return[["/images/pasa.jpg","/images/mohito.jpg","/images/sabuha.jpg","/images/limon.jpg","/images/susi.jpg"]]}class be extends F{constructor(e){super(),Y(this,e,ye,ke,r,{})}}function $e(t){let n,l,a,r,i,s,o,c;return{c(){n=h("div"),l=h("button"),l.textContent="Start",a=k(),r=h("div"),r.innerHTML='<span class="unvisible svelte-182xn3u">please, select a avatar..</span>',i=k(),s=h("div"),s.innerHTML='<span class="unvisible svelte-182xn3u">enter a name..</span>',b(l,"class","svelte-182xn3u"),b(r,"class","avatarError visible svelte-182xn3u"),b(s,"class","nameError visible svelte-182xn3u"),b(n,"class","start svelte-182xn3u")},m(e,u){p(e,n,u),d(n,l),d(n,a),d(n,r),d(n,i),d(n,s),o||(c=y(l,"click",t[3]),o=!0)},p:e,i:e,o:e,d(e){e&&m(n),o=!1,c()}}}function we(e,t,n){let l,a,r;const{name:i,avatar:s,isStart:o}=se;c(e,i,(e=>n(5,a=e))),c(e,s,(e=>n(6,r=e))),c(e,o,(e=>n(4,l=e)));return[i,s,o,()=>{""!==r?""!==a?(u(o,l=!0,l),console.log("::: start game :::"),console.log("enjoy")):document.querySelector(".nameError span").classList.remove("unvisible"):document.querySelector(".avatarError span").classList.remove("unvisible")}]}class ze extends F{constructor(e){super(),Y(this,e,we,$e,r,{})}}function xe(t){let n,l,a,r,i,s,o,c,u;return l=new pe({}),r=new be({}),s=new ue({}),c=new ze({}),{c(){n=h("main"),R(l.$$.fragment),a=k(),R(r.$$.fragment),i=k(),R(s.$$.fragment),o=k(),R(c.$$.fragment),b(n,"class","svelte-15vmz98")},m(e,t){p(e,n,t),K(l,n,null),d(n,a),K(r,n,null),d(n,i),K(s,n,null),d(n,o),K(c,n,null),u=!0},p:e,i(e){u||(U(l.$$.fragment,e),U(r.$$.fragment,e),U(s.$$.fragment,e),U(c.$$.fragment,e),u=!0)},o(e){O(l.$$.fragment,e),O(r.$$.fragment,e),O(s.$$.fragment,e),O(c.$$.fragment,e),u=!1},d(e){e&&m(n),G(l),G(r),G(s),G(c)}}}class Se extends F{constructor(e){super(),Y(this,e,null,xe,r,{})}}const Te=ie([]),_e=ie([]),Le=ie(0);function Ce(e,t,n){let l,a,r,i;c(e,_e,(e=>n(2,l=e))),c(e,Te,(e=>n(4,r=e))),c(e,Le,(e=>n(5,i=e)));const{level:s}=se;c(e,s,(e=>n(3,a=e)));const o=(e,t)=>{document.querySelectorAll(".hover").forEach((e=>{e.classList.remove("hover")}))},d=()=>{u(s,a++,a)};return[s,e=>{const t=e.currentTarget,n=e.target.getAttribute("alt");if(null!==n&&(t.classList.add("hover"),l.push(parseInt(n)),2===l.length)){const e=l[0],t=l[1];e===t?(r.push(e),u(Le,i++,i),r.length===5*a&&(setTimeout(o,500),setTimeout(d,750))):setTimeout((()=>{document.querySelector(`.flip-container.hover [pokemonDetail="${e}"]`).closest(".flip-container").classList.remove("hover"),document.querySelector(`.flip-container.hover [pokemonDetail="${t}"]`).closest(".flip-container").classList.remove("hover")}),750),u(_e,l=[],l)}}]}class je extends F{constructor(e){super(),Y(this,e,Ce,null,r,{openCard:1})}get openCard(){return this.$$.ctx[1]}}function Me(t){let n,l,a;return{c(){n=h("h3"),l=v("Score: "),a=v(t[0]),b(n,"class","svelte-12o01yi")},m(e,t){p(e,n,t),d(n,l),d(n,a)},p(e,[t]){1&t&&$(a,e[0])},i:e,o:e,d(e){e&&m(n)}}}function Ne(e,t,n){let l;return c(e,Le,(e=>n(0,l=e))),[l]}class He extends F{constructor(e){super(),Y(this,e,Ne,Me,r,{})}}function Ee(t){let n,l;return{c(){n=h("h3"),l=v(t[0]),b(n,"class","svelte-5vegqh")},m(e,t){p(e,n,t),d(n,l)},p(e,[t]){1&t&&$(l,e[0])},i:e,o:e,d(e){e&&m(n)}}}function Pe(e,t,n){let l;const{name:a}=se;return c(e,a,(e=>n(0,l=e))),[l,a]}class Ae extends F{constructor(e){super(),Y(this,e,Pe,Ee,r,{})}}function De(t){let n,l,a,r,i;return{c(){var e,s,o;n=f("svg"),l=f("defs"),a=f("pattern"),r=f("image"),i=f("circle"),b(r,"x","0"),b(r,"y","0"),b(r,"height","150"),b(r,"width","150"),e=r,s="xlink:href",o=t[2],e.setAttributeNS("http://www.w3.org/1999/xlink",s,o),b(a,"id","image"),b(a,"patternUnits","userSpaceOnUse"),b(a,"height","150"),b(a,"width","150"),b(i,"id","top"),b(i,"cx","75"),b(i,"cy","60"),b(i,"r","50"),b(i,"fill","url(#image)"),b(i,"stroke","#112B3C"),b(i,"stroke-width","8"),b(n,"width","150"),b(n,"height","120"),b(n,"stroke-dashoffset",t[0]),b(n,"class","svelte-1cs56u2")},m(e,t){p(e,n,t),d(n,l),d(l,a),d(a,r),d(n,i)},p(e,[t]){1&t&&b(n,"stroke-dashoffset",e[0])},i:e,o:e,d(e){e&&m(n)}}}function Je(e,t,n){let l,a,r,i;c(e,Le,(e=>n(4,r=e)));const{avatar:s}=se;c(e,s,(e=>n(5,i=e)));const o=`images/${i}.jpg`;return e.$$.update=()=>{24&e.$$.dirty&&n(0,a=l(r))},n(3,l=e=>e%5==0?314:314-e%5*62.8),[a,s,o,l,r]}class Be extends F{constructor(e){super(),Y(this,e,Je,De,r,{})}}function qe(t){let n,l,a,r,i,s,o;return l=new Be({}),r=new Ae({}),s=new He({}),{c(){n=h("main"),R(l.$$.fragment),a=k(),R(r.$$.fragment),i=k(),R(s.$$.fragment),b(n,"class","svelte-1jkt6zl")},m(e,t){p(e,n,t),K(l,n,null),d(n,a),K(r,n,null),d(n,i),K(s,n,null),o=!0},p:e,i(e){o||(U(l.$$.fragment,e),U(r.$$.fragment,e),U(s.$$.fragment,e),o=!0)},o(e){O(l.$$.fragment,e),O(r.$$.fragment,e),O(s.$$.fragment,e),o=!1},d(e){e&&m(n),G(l),G(r),G(s)}}}class Ue extends F{constructor(e){super(),Y(this,e,null,qe,r,{})}}function Oe(e,t,n){const l=e.slice();return l[11]=t[n],l}function Re(t){let n,l;return n=new Se({}),{c(){R(n.$$.fragment)},m(e,t){K(n,e,t),l=!0},p:e,i(e){l||(U(n.$$.fragment,e),l=!0)},o(e){O(n.$$.fragment,e),l=!1},d(e){G(n,e)}}}function Ke(e){let t,n,l,a=e[1],r=[];for(let t=0;t<a.length;t+=1)r[t]=Ge(Oe(e,a,t));const i=e=>O(r[e],1,1,(()=>{r[e]=null}));return n=new Ue({}),{c(){for(let e=0;e<r.length;e+=1)r[e].c();t=k(),R(n.$$.fragment)},m(e,a){for(let t=0;t<r.length;t+=1)r[t].m(e,a);p(e,t,a),K(n,e,a),l=!0},p(e,n){if(11&n){let l;for(a=e[1],l=0;l<a.length;l+=1){const i=Oe(e,a,l);r[l]?(r[l].p(i,n),U(r[l],1)):(r[l]=Ge(i),r[l].c(),U(r[l],1),r[l].m(t.parentNode,t))}for(B(),l=a.length;l<r.length;l+=1)i(l);q()}},i(e){if(!l){for(let e=0;e<a.length;e+=1)U(r[e]);U(n.$$.fragment,e),l=!0}},o(e){r=r.filter(Boolean);for(let e=0;e<r.length;e+=1)O(r[e]);O(n.$$.fragment,e),l=!1},d(e){g(r,e),e&&m(t),G(n,e)}}}function Ge(e){let t,n,l,a,r,i,s,o;function c(...t){return e[9](e[11],...t)}return t=new je({props:{}}),e[8](t),a=new le({props:{pokemonNumber:e[11]}}),{c(){R(t.$$.fragment),n=k(),l=h("div"),R(a.$$.fragment),b(l,"class",r="flip-container "+((e[3]||[]).some(c)&&"hover")+" svelte-1wzhztw")},m(r,c){K(t,r,c),p(r,n,c),p(r,l,c),K(a,l,null),i=!0,s||(o=y(l,"click",e[10]),s=!0)},p(n,s){e=n;t.$set({});const o={};2&s&&(o.pokemonNumber=e[11]),a.$set(o),(!i||10&s&&r!==(r="flip-container "+((e[3]||[]).some(c)&&"hover")+" svelte-1wzhztw"))&&b(l,"class",r)},i(e){i||(U(t.$$.fragment,e),U(a.$$.fragment,e),i=!0)},o(e){O(t.$$.fragment,e),O(a.$$.fragment,e),i=!1},d(r){e[8](null),G(t,r),r&&m(n),r&&m(l),G(a),s=!1,o()}}}function Ie(e){let t,n,l,a;const r=[Ke,Re],i=[];function s(e,t){return e[2]?0:1}return n=s(e),l=i[n]=r[n](e),{c(){t=h("main"),l.c(),b(t,"class","pokemon-cards svelte-1wzhztw")},m(e,l){p(e,t,l),i[n].m(t,null),a=!0},p(e,[a]){let o=n;n=s(e),n===o?i[n].p(e,a):(B(),O(i[o],1,1,(()=>{i[o]=null})),q(),l=i[n],l?l.p(e,a):(l=i[n]=r[n](e),l.c()),U(l,1),l.m(t,null))},i(e){a||(U(l),a=!0)},o(e){O(l),a=!1},d(e){e&&m(t),i[n].d()}}}function Ye(e,t,n){let l,a,r,i,s,o;c(e,Te,(e=>n(3,s=e)));const{isStart:u,level:d}=se;c(e,u,(e=>n(2,i=e))),c(e,d,(e=>n(7,r=e)));return e.$$.update=()=>{128&e.$$.dirty&&n(6,l=new ae(r)),64&e.$$.dirty&&n(1,a=l.shakeList(l.list()))},[o,a,i,s,u,d,l,r,function(e){_[e?"unshift":"push"]((()=>{o=e,n(0,o)}))},(e,t)=>t===e,e=>o.openCard(e)]}class Fe extends F{constructor(e){super(),Y(this,e,Ye,Ie,r,{})}}function Ve(t){let n,l,a,r,i,s,o,c,u,d,g,f,v,y,$,w,z,x,S,T,_,L,C,j,M,N,H,E,P,A,D,J,B,q,U,O,R,K,G,I,Y,F,V,Q,W,X,Z,ee,te,ne,le,ae,re,ie,se,oe,ce,ue,de,pe,me,ge,he,fe,ve,ke,ye,be,$e,we,ze,xe,Se;return{c(){n=h("span"),l=k(),a=h("h2"),a.textContent="Hi :wave:",r=k(),i=h("p"),i.innerHTML='Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte&#39;in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım &#39;Game&#39; bağlantısında\ngörebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı\nadımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.\nSvelte içeriği iyi ayrıntılanmış\n<a href="https://svelte.dev/docs" title="Svelte Documentation">dökümantasyona</a> sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsiniz.',s=k(),o=h("p"),o.innerHTML='<img src="./assets/svelte-logo.PNG" alt="Svelte logo" style="width:400px"/>',c=k(),u=h("span"),d=k(),g=h("h2"),g.textContent="Proje Hakkında",f=k(),v=h("p"),v.textContent="Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartların üzerlerine click yapıldığında\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken bu başarılı eşleşme\nkullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları\nyerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir sonraki\nseviyede yer alan kartar arayüze kapalı olarak yeniden gelecektir.",y=k(),$=h("p"),$.innerHTML='<img src="./assets/cards.PNG" alt="view of cards on the playground" style=""/>',w=k(),z=h("p"),z.textContent="Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun\narayüzünde kartların yer aldığı bölümün altında score ile birlikte\ngösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\nkalacaktır, score değeri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.",x=k(),S=h("p"),S.textContent="image 1.2 ---\x3e kullanıcı bilgileri ve score tutulduğu alan",T=k(),_=h("span"),L=k(),C=h("h2"),C.textContent="Svelte nedir?",j=k(),M=h("p"),M.textContent="Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak\ndaha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı\namaçlayan bir araçtır. Svelte Javascript dünyasında fikir olarak benzer\nframework/library önlerine geçiyor. Modern framework/library ile birlikte geride\nbıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya\nçıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir\nsüre sonrasında bir bezginlik halinin doğmasına sebep oluyor.\nSvelte'in bu döngünün dışına çıkarak modern framework bağımlılıklarını\nazalttı.",N=k(),H=h("span"),E=k(),P=h("h2"),P.textContent="Svelte nasıl çalışır?",A=k(),D=h("p"),D.innerHTML="Svelte bileşenleri <code>.svelte</code> uzantılı dosyalar ile oluşturulur. HTML&#39;de benzer\nolarak <code>script, style, html</code> kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure\nJavascript kodlarına dönüştürülür.",J=k(),B=h("p"),B.innerHTML='<img src="./assets/build-map.PNG" alt="Svelte Build map" style="width: 800px"/>',q=k(),U=h("p"),U.textContent="Svelte'in derleme işlemini runtime üzerinde sağlayarak benzer framework/library\ndaha hızlı çalışıyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığı\nortadan kalkıyor.",O=k(),R=h("span"),K=k(),G=h("h2"),G.textContent="Svelte projesi oluşturma",I=k(),Y=h("p"),Y.textContent="Npx ile yeni bir proje oluşturma:",F=k(),V=h("pre"),V.innerHTML="<code>npx degit sveltejs/template svelte-typescript-app\n</code>",Q=k(),W=h("p"),W.textContent="Yazdığımız kodun tiplemesini TypeScript ile kontrol edeceğiz.",X=k(),Z=h("pre"),Z.innerHTML="<code>cd svelte-typescript-app\nnode scripts/setupTypeScript.js\n</code>",ee=k(),te=h("span"),ne=k(),le=h("h2"),le.textContent="Proje bağımlılıkları",ae=k(),re=h("ul"),re.innerHTML="<li><h4>Typescript</h4>\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte\n<code>.svelte</code> uzantılı dosyaların yanısıra <code>.ts</code> dosyaları da destekler.</li> \n<li><h4>Rollup</h4>\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının\nanlayabileceği şekilde ayrıştırır.</li>",ie=k(),se=h("span"),oe=k(),ce=h("h2"),ce.textContent="Dizin ve Component Yapısı",ue=k(),de=h("span"),pe=k(),me=h("h2"),me.textContent="GitHub Pages ile Deploy",ge=k(),he=h("h2"),he.textContent="Kaynak",fe=k(),ve=h("ul"),ve.innerHTML='<li><p>Svelte nedir?</p> \n<ul><li><a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity">https://svelte.dev/blog/svelte-3-rethinking-reactivity</a></li></ul></li> \n<li><p>Svelte Documentation:</p> \n<ul><li><a href="https://svelte.dev/examples/hello-world">https://svelte.dev/examples/hello-world</a></li> \n<li><a href="https://svelte.dev/tutorial/basics">https://svelte.dev/tutorial/basics</a></li> \n<li><a href="https://svelte.dev/docs">https://svelte.dev/docs</a></li> \n<li><a href="https://svelte.dev/blog">https://svelte.dev/blog</a></li> \n<li><a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity">https://svelte.dev/blog/svelte-3-rethinking-reactivity</a></li></ul></li>',ke=k(),ye=h("ul"),ye.innerHTML='<li><p>Svelte Projesi Oluşturma</p> \n<ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript">https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript</a></li></ul></li>',be=k(),$e=h("ul"),$e.innerHTML='<li>Bağımlılıklar<ul><li><a href="https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/">https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/</a></li></ul></li>',we=k(),ze=h("ul"),ze.innerHTML='<li><p>Deploy:</p> \n<ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next">https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next</a></li></ul></li> \n<li><p>md files importing</p></li>',xe=k(),Se=h("ul"),Se.innerHTML='<li><a href="https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project">https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project</a></li>',b(n,"id","hi-to-you"),b(o,"align","center"),b(u,"id","about-the-project"),b($,"align","center"),b(_,"id","#what-is-svelte"),b(H,"id","how-does-svelte-work"),b(B,"align","center"),b(R,"id","create-a-svelte-project"),b(te,"id","dependencies"),b(se,"id","directory-and-component-structure"),b(de,"id","deploy-with-github-pages")},m(e,t){p(e,n,t),p(e,l,t),p(e,a,t),p(e,r,t),p(e,i,t),p(e,s,t),p(e,o,t),p(e,c,t),p(e,u,t),p(e,d,t),p(e,g,t),p(e,f,t),p(e,v,t),p(e,y,t),p(e,$,t),p(e,w,t),p(e,z,t),p(e,x,t),p(e,S,t),p(e,T,t),p(e,_,t),p(e,L,t),p(e,C,t),p(e,j,t),p(e,M,t),p(e,N,t),p(e,H,t),p(e,E,t),p(e,P,t),p(e,A,t),p(e,D,t),p(e,J,t),p(e,B,t),p(e,q,t),p(e,U,t),p(e,O,t),p(e,R,t),p(e,K,t),p(e,G,t),p(e,I,t),p(e,Y,t),p(e,F,t),p(e,V,t),p(e,Q,t),p(e,W,t),p(e,X,t),p(e,Z,t),p(e,ee,t),p(e,te,t),p(e,ne,t),p(e,le,t),p(e,ae,t),p(e,re,t),p(e,ie,t),p(e,se,t),p(e,oe,t),p(e,ce,t),p(e,ue,t),p(e,de,t),p(e,pe,t),p(e,me,t),p(e,ge,t),p(e,he,t),p(e,fe,t),p(e,ve,t),p(e,ke,t),p(e,ye,t),p(e,be,t),p(e,$e,t),p(e,we,t),p(e,ze,t),p(e,xe,t),p(e,Se,t)},p:e,i:e,o:e,d(e){e&&m(n),e&&m(l),e&&m(a),e&&m(r),e&&m(i),e&&m(s),e&&m(o),e&&m(c),e&&m(u),e&&m(d),e&&m(g),e&&m(f),e&&m(v),e&&m(y),e&&m($),e&&m(w),e&&m(z),e&&m(x),e&&m(S),e&&m(T),e&&m(_),e&&m(L),e&&m(C),e&&m(j),e&&m(M),e&&m(N),e&&m(H),e&&m(E),e&&m(P),e&&m(A),e&&m(D),e&&m(J),e&&m(B),e&&m(q),e&&m(U),e&&m(O),e&&m(R),e&&m(K),e&&m(G),e&&m(I),e&&m(Y),e&&m(F),e&&m(V),e&&m(Q),e&&m(W),e&&m(X),e&&m(Z),e&&m(ee),e&&m(te),e&&m(ne),e&&m(le),e&&m(ae),e&&m(re),e&&m(ie),e&&m(se),e&&m(oe),e&&m(ce),e&&m(ue),e&&m(de),e&&m(pe),e&&m(me),e&&m(ge),e&&m(he),e&&m(fe),e&&m(ve),e&&m(ke),e&&m(ye),e&&m(be),e&&m($e),e&&m(we),e&&m(ze),e&&m(xe),e&&m(Se)}}}class Qe extends F{constructor(e){super(),Y(this,e,null,Ve,r,{})}}function We(t){let n,l,a,r,i,s,o,c,u,d,g,f,v,y,$,w,z,x,S,T,_,L,C,j,M,N,H,E,P,A,D,J,B,q,U,O,R,K,G,I,Y,F,V,Q,W,X,Z,ee,te,ne,le,ae,re,ie,se,oe,ce,ue,de,pe,me,ge,he,fe,ve,ke,ye,be,$e,we,ze,xe,Se;return{c(){n=h("span"),l=k(),a=h("h2"),a.textContent="Selam :wave:",r=k(),i=h("p"),i.innerHTML='Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte&#39;in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım &#39;Game&#39; bağlantısında\ngörebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı\nadımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.\nSvelte içeriği iyi ayrıntılanmış\n<a href="https://svelte.dev/docs" title="Svelte Documentation">dökümantasyona</a> sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsiniz.',s=k(),o=h("p"),o.innerHTML='<img src="./assets/svelte-logo.png" alt="Svelte logo" style="width:400px"/>',c=k(),u=h("span"),d=k(),g=h("h2"),g.textContent="Proje Hakkında",f=k(),v=h("p"),v.textContent="Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartların üzerlerine click yapıldığında\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken bu başarılı eşleşme\nkullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları\nyerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir sonraki\nseviyede yer alan kartar arayüze kapalı olarak yeniden gelecektir.",y=k(),$=h("p"),$.innerHTML='<img src="./assets/cards.png" alt="view of cards on the playground" style=""/>',w=k(),z=h("p"),z.textContent="Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun\narayüzünde kartların yer aldığı bölümün altında score ile birlikte\ngösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\nkalacaktır, score değeri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.",x=k(),S=h("p"),S.textContent="image 1.2 ---\x3e kullanıcı bilgileri ve score tutulduğu alan",T=k(),_=h("span"),L=k(),C=h("h2"),C.textContent="Svelte nedir?",j=k(),M=h("p"),M.textContent="Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak\ndaha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı\namaçlayan bir araçtır. Svelte Javascript dünyasında fikir olarak benzer\nframework/library önlerine geçiyor. Modern framework/library ile birlikte geride\nbıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya\nçıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir\nsüre sonrasında bir bezginlik halinin doğmasına sebep oluyor.\nSvelte'in bu döngünün dışına çıkarak modern framework bağımlılıklarını\nazalttı.",N=k(),H=h("span"),E=k(),P=h("h2"),P.textContent="Svelte nasıl çalışır?",A=k(),D=h("p"),D.innerHTML="Svelte bileşenleri <code>.svelte</code> uzantılı dosyalar ile oluşturulur. HTML&#39;de benzer\nolarak <code>script, style, html</code> kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure\nJavascript kodlarına dönüştürülür.",J=k(),B=h("p"),B.innerHTML='<img src="./assets/build-map.png" alt="Svelte Build map" style="width: 800px"/>',q=k(),U=h("p"),U.textContent="Svelte'in derleme işlemini runtime üzerinde sağlayarak benzer framework/library\ndaha hızlı çalışıyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığı\nortadan kalkıyor.",O=k(),R=h("span"),K=k(),G=h("h2"),G.textContent="Svelte projesi oluşturma",I=k(),Y=h("p"),Y.textContent="Npx ile yeni bir proje oluşturma:",F=k(),V=h("pre"),V.innerHTML="<code>npx degit sveltejs/template svelte-typescript-app\n</code>",Q=k(),W=h("p"),W.textContent="Yazdığımız kodun tiplemesini TypeScript ile kontrol edeceğiz.",X=k(),Z=h("pre"),Z.innerHTML="<code>cd svelte-typescript-app\nnode scripts/setupTypeScript.js\n</code>",ee=k(),te=h("span"),ne=k(),le=h("h2"),le.textContent="Proje bağımlılıkları",ae=k(),re=h("ul"),re.innerHTML="<li><h4>Typescript</h4>\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte\n<code>.svelte</code> uzantılı dosyaların yanısıra <code>.ts</code> dosyaları da destekler.</li> \n<li><h4>Rollup</h4>\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının\nanlayabileceği şekilde ayrıştırır.</li>",ie=k(),se=h("span"),oe=k(),ce=h("h2"),ce.textContent="Dizin ve Component Yapısı",ue=k(),de=h("span"),pe=k(),me=h("h2"),me.textContent="GitHub Pages ile Deploy",ge=k(),he=h("h2"),he.textContent="Kaynak",fe=k(),ve=h("ul"),ve.innerHTML='<li><p>Svelte nedir?</p> \n<ul><li><a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity">https://svelte.dev/blog/svelte-3-rethinking-reactivity</a></li></ul></li> \n<li><p>Svelte Documentation:</p> \n<ul><li><a href="https://svelte.dev/examples/hello-world">https://svelte.dev/examples/hello-world</a></li> \n<li><a href="https://svelte.dev/tutorial/basics">https://svelte.dev/tutorial/basics</a></li> \n<li><a href="https://svelte.dev/docs">https://svelte.dev/docs</a></li> \n<li><a href="https://svelte.dev/blog">https://svelte.dev/blog</a></li> \n<li><a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity">https://svelte.dev/blog/svelte-3-rethinking-reactivity</a></li></ul></li>',ke=k(),ye=h("ul"),ye.innerHTML='<li><p>Svelte Projesi Oluşturma</p> \n<ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript">https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript</a></li></ul></li>',be=k(),$e=h("ul"),$e.innerHTML='<li>Bağımlılıklar<ul><li><a href="https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/">https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/</a></li></ul></li>',we=k(),ze=h("ul"),ze.innerHTML='<li><p>Deploy:</p> \n<ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next">https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next</a></li></ul></li> \n<li><p>md files importing</p></li>',xe=k(),Se=h("ul"),Se.innerHTML='<li><a href="https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project">https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project</a></li>',b(n,"id","selam-sana"),b(o,"align","center"),b(u,"id","proje-hakkinda"),b($,"align","center"),b(_,"id","svelte-nedir"),b(H,"id","svelte-nasil-calisir"),b(B,"align","center"),b(R,"id","svelte-projesi-olusturma"),b(te,"id","bagimliliklar"),b(se,"id","dizin-ve-component-yapisi"),b(de,"id","github-page-ile-deploy")},m(e,t){p(e,n,t),p(e,l,t),p(e,a,t),p(e,r,t),p(e,i,t),p(e,s,t),p(e,o,t),p(e,c,t),p(e,u,t),p(e,d,t),p(e,g,t),p(e,f,t),p(e,v,t),p(e,y,t),p(e,$,t),p(e,w,t),p(e,z,t),p(e,x,t),p(e,S,t),p(e,T,t),p(e,_,t),p(e,L,t),p(e,C,t),p(e,j,t),p(e,M,t),p(e,N,t),p(e,H,t),p(e,E,t),p(e,P,t),p(e,A,t),p(e,D,t),p(e,J,t),p(e,B,t),p(e,q,t),p(e,U,t),p(e,O,t),p(e,R,t),p(e,K,t),p(e,G,t),p(e,I,t),p(e,Y,t),p(e,F,t),p(e,V,t),p(e,Q,t),p(e,W,t),p(e,X,t),p(e,Z,t),p(e,ee,t),p(e,te,t),p(e,ne,t),p(e,le,t),p(e,ae,t),p(e,re,t),p(e,ie,t),p(e,se,t),p(e,oe,t),p(e,ce,t),p(e,ue,t),p(e,de,t),p(e,pe,t),p(e,me,t),p(e,ge,t),p(e,he,t),p(e,fe,t),p(e,ve,t),p(e,ke,t),p(e,ye,t),p(e,be,t),p(e,$e,t),p(e,we,t),p(e,ze,t),p(e,xe,t),p(e,Se,t)},p:e,i:e,o:e,d(e){e&&m(n),e&&m(l),e&&m(a),e&&m(r),e&&m(i),e&&m(s),e&&m(o),e&&m(c),e&&m(u),e&&m(d),e&&m(g),e&&m(f),e&&m(v),e&&m(y),e&&m($),e&&m(w),e&&m(z),e&&m(x),e&&m(S),e&&m(T),e&&m(_),e&&m(L),e&&m(C),e&&m(j),e&&m(M),e&&m(N),e&&m(H),e&&m(E),e&&m(P),e&&m(A),e&&m(D),e&&m(J),e&&m(B),e&&m(q),e&&m(U),e&&m(O),e&&m(R),e&&m(K),e&&m(G),e&&m(I),e&&m(Y),e&&m(F),e&&m(V),e&&m(Q),e&&m(W),e&&m(X),e&&m(Z),e&&m(ee),e&&m(te),e&&m(ne),e&&m(le),e&&m(ae),e&&m(re),e&&m(ie),e&&m(se),e&&m(oe),e&&m(ce),e&&m(ue),e&&m(de),e&&m(pe),e&&m(me),e&&m(ge),e&&m(he),e&&m(fe),e&&m(ve),e&&m(ke),e&&m(ye),e&&m(be),e&&m($e),e&&m(we),e&&m(ze),e&&m(xe),e&&m(Se)}}}class Xe extends F{constructor(e){super(),Y(this,e,null,We,r,{})}}const Ze=ie("TR");var et={Turkish:[{title:"selam",target:"#selam-sana"},{title:"proje hakkında",target:"#proje-hakkinda"},{title:"svelte nedir?",target:"#svelte-nedir"},{title:"svelte nasıl çalışır?",target:"#svelte-nasil-calisir"},{title:"Svelte projesi oluşturma",target:"#svelte-projesi-olusturma"},{title:"bağımlılıklar",target:"#bagimliliklar"},{title:"dizin ve component yapısı",target:"#dizin-ve-component-yapisi"},{title:"github page ile deploy",target:"#github-page-ile-deploy"}],English:[{title:"hi",target:"#hi-to-you"},{title:"about the project",target:"#about-the-project"},{title:"what is svelte?",target:"#what-is-svelte"},{title:"how does Svelte work?",target:"#how-does-svelte-work"},{title:"create a Svelte project",target:"#create-a-svelte-project"},{title:"dependencies",target:"#dependencies"},{title:"directory and component structure",target:"directory-and-component-structure"},{title:"deploy with github page",target:"deploy-with-github-pages"}]};function tt(e,t,n){const l=e.slice();return l[4]=t[n],l}function nt(e){let t,n;return t=new Xe({}),{c(){R(t.$$.fragment)},m(e,l){K(t,e,l),n=!0},i(e){n||(U(t.$$.fragment,e),n=!0)},o(e){O(t.$$.fragment,e),n=!1},d(e){G(t,e)}}}function lt(e){let t,n;return t=new Qe({}),{c(){R(t.$$.fragment)},m(e,l){K(t,e,l),n=!0},i(e){n||(U(t.$$.fragment,e),n=!0)},o(e){O(t.$$.fragment,e),n=!1},d(e){G(t,e)}}}function at(e){let t,n,l,a,r=e[4].title+"";return{c(){t=h("li"),n=h("a"),l=v(r),b(n,"href",a=e[4].target),b(n,"class","svelte-1gtod6n"),b(t,"class","svelte-1gtod6n")},m(e,a){p(e,t,a),d(t,n),d(n,l)},p(e,t){2&t&&r!==(r=e[4].title+"")&&$(l,r),2&t&&a!==(a=e[4].target)&&b(n,"href",a)},d(e){e&&m(t)}}}function rt(e){let t,n,a,r,i,s,c,u,f,v,$,w,z,x,S,T,_,L;const C=[lt,nt],j=[];function M(e,t){return"EN"===e[1]?0:1}n=M(e),a=j[n]=C[n](e);let N="EN"===e[1]?e[3]:e[2],H=[];for(let t=0;t<N.length;t+=1)H[t]=at(tt(e,N,t));return{c(){t=h("main"),a.c(),r=k(),i=h("ul");for(let e=0;e<H.length;e+=1)H[e].c();s=k(),c=h("li"),u=h("div"),f=h("img"),w=k(),z=h("img"),f.hidden=v="TR"===e[1],o(f.src,$="./assets/tr.svg")||b(f,"src","./assets/tr.svg"),b(f,"alt","TR Flag"),b(f,"class","flag svelte-1gtod6n"),z.hidden=x="EN"===e[1],o(z.src,S="./assets/gb.svg")||b(z,"src","./assets/gb.svg"),b(z,"alt","EN Flag"),b(z,"class","flag svelte-1gtod6n"),b(u,"class","switch-lang svelte-1gtod6n"),b(c,"class","svelte-1gtod6n"),b(i,"class","content-map svelte-1gtod6n"),b(t,"class","container svelte-1gtod6n")},m(l,a){p(l,t,a),j[n].m(t,null),d(t,r),d(t,i);for(let e=0;e<H.length;e+=1)H[e].m(i,null);d(i,s),d(i,c),d(c,u),d(u,f),d(u,w),d(u,z),T=!0,_||(L=[y(f,"click",e[0]),y(z,"click",e[0])],_=!0)},p(e,[l]){let o=n;if(n=M(e),n!==o&&(B(),O(j[o],1,1,(()=>{j[o]=null})),q(),a=j[n],a||(a=j[n]=C[n](e),a.c()),U(a,1),a.m(t,r)),14&l){let t;for(N="EN"===e[1]?e[3]:e[2],t=0;t<N.length;t+=1){const n=tt(e,N,t);H[t]?H[t].p(n,l):(H[t]=at(n),H[t].c(),H[t].m(i,s))}for(;t<H.length;t+=1)H[t].d(1);H.length=N.length}(!T||2&l&&v!==(v="TR"===e[1]))&&(f.hidden=v),(!T||2&l&&x!==(x="EN"===e[1]))&&(z.hidden=x)},i(e){T||(U(a),T=!0)},o(e){O(a),T=!1},d(e){e&&m(t),j[n].d(),g(H,e),_=!1,l(L)}}}function it(e,t,n){let l;c(e,Ze,(e=>n(1,l=e)));let{Turkish:a,English:r}=et;return[()=>{u(Ze,l="EN"===l?"TR":"EN",l)},l,a,r]}class st extends F{constructor(e){super(),Y(this,e,it,rt,r,{switchLanguages:0})}get switchLanguages(){return this.$$.ctx[0]}}function ot(e,t,n){const l=e.slice();return l[4]=t[n],l}function ct(e){let t,n,l,a,r,i,s=e[4]+"";function o(){return e[3](e[4])}return{c(){t=h("li"),n=h("div"),l=v(s),a=k(),z(n,"active",e[4]===e[1]),b(t,"class","svelte-135x94x")},m(e,s){p(e,t,s),d(t,n),d(n,l),d(t,a),r||(i=y(t,"click",o),r=!0)},p(t,a){e=t,1&a&&s!==(s=e[4]+"")&&$(l,s),3&a&&z(n,"active",e[4]===e[1])},d(e){e&&m(t),r=!1,i()}}}function ut(t){let n,l,a=t[0],r=[];for(let e=0;e<a.length;e+=1)r[e]=ct(ot(t,a,e));return{c(){n=h("div"),l=h("ul");for(let e=0;e<r.length;e+=1)r[e].c();b(l,"class","svelte-135x94x"),b(n,"class","contents svelte-135x94x")},m(e,t){p(e,n,t),d(n,l);for(let e=0;e<r.length;e+=1)r[e].m(l,null)},p(e,[t]){if(7&t){let n;for(a=e[0],n=0;n<a.length;n+=1){const i=ot(e,a,n);r[n]?r[n].p(i,t):(r[n]=ct(i),r[n].c(),r[n].m(l,null))}for(;n<r.length;n+=1)r[n].d(1);r.length=a.length}},i:e,o:e,d(e){e&&m(n),g(r,e)}}}function dt(e,t,n){const l=S();let{pages:a,activePage:r}=t;return e.$$set=e=>{"pages"in e&&n(0,a=e.pages),"activePage"in e&&n(1,r=e.activePage)},[a,r,l,e=>l("switchPage",e)]}class pt extends F{constructor(e){super(),Y(this,e,dt,ut,r,{pages:0,activePage:1})}}function mt(e){let t,n;return t=new Fe({}),{c(){R(t.$$.fragment)},m(e,l){K(t,e,l),n=!0},i(e){n||(U(t.$$.fragment,e),n=!0)},o(e){O(t.$$.fragment,e),n=!1},d(e){G(t,e)}}}function gt(e){let t,n;return t=new st({}),{c(){R(t.$$.fragment)},m(e,l){K(t,e,l),n=!0},i(e){n||(U(t.$$.fragment,e),n=!0)},o(e){O(t.$$.fragment,e),n=!1},d(e){G(t,e)}}}function ht(e){let t,n,l,a,r,i;n=new pt({props:{pages:e[1],activePage:e[0]}}),n.$on("switchPage",e[2]);const s=[gt,mt],o=[];function c(e,t){return"about"===e[0]?0:"game"===e[0]?1:-1}return~(a=c(e))&&(r=o[a]=s[a](e)),{c(){t=h("main"),R(n.$$.fragment),l=k(),r&&r.c()},m(e,r){p(e,t,r),K(n,t,null),d(t,l),~a&&o[a].m(t,null),i=!0},p(e,[l]){const i={};1&l&&(i.activePage=e[0]),n.$set(i);let u=a;a=c(e),a!==u&&(r&&(B(),O(o[u],1,1,(()=>{o[u]=null})),q()),~a?(r=o[a],r||(r=o[a]=s[a](e),r.c()),U(r,1),r.m(t,null)):r=null)},i(e){i||(U(n.$$.fragment,e),U(r),i=!0)},o(e){O(n.$$.fragment,e),O(r),i=!1},d(e){e&&m(t),G(n),~a&&o[a].d()}}}function ft(e,t,n){let l="about";return[l,["about","game"],e=>{n(0,l=e.detail)}]}return new class extends F{constructor(e){super(),Y(this,e,ft,ht,r,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
