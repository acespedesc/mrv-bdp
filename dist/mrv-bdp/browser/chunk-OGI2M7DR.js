import{a as fe,b as qe,c as Qe,d as T,j as Q,q as He,s as H,u as ee}from"./chunk-6XSUGG7T.js";import{$ as E,$a as We,A as Le,Aa as ue,Ba as Be,Ca as S,Ea as he,Fa as C,G as ke,Ga as x,Ha as ze,Ia as Ve,Ja as $e,Ka as Ge,La as Xe,Ma as Je,Na as Ke,O as Ce,Oa as L,S as A,Ua as V,V as g,Y as w,_ as d,c as ae,ca as z,ha as le,ia as xe,j as Ie,ja as je,k as ce,ka as Fe,nc as Ze,o as B,oc as Ye,ta as Ue,va as I,wa as de,x as Se,za as _e}from"./chunk-XFA5AQSA.js";import{a as _,b as Pe,g as ie}from"./chunk-TSRGIXR5.js";var G=class{},X=class{},b=class r{constructor(e){this.normalizedNames=new Map,this.lazyUpdate=null,e?typeof e=="string"?this.lazyInit=()=>{this.headers=new Map,e.split(`
`).forEach(s=>{let t=s.indexOf(":");if(t>0){let n=s.slice(0,t),o=n.toLowerCase(),a=s.slice(t+1).trim();this.maybeSetNormalizedName(n,o),this.headers.has(o)?this.headers.get(o).push(a):this.headers.set(o,[a])}})}:typeof Headers<"u"&&e instanceof Headers?(this.headers=new Map,e.forEach((s,t)=>{this.setHeaderEntries(t,s)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(e).forEach(([s,t])=>{this.setHeaderEntries(s,t)})}:this.headers=new Map}has(e){return this.init(),this.headers.has(e.toLowerCase())}get(e){this.init();let s=this.headers.get(e.toLowerCase());return s&&s.length>0?s[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(e){return this.init(),this.headers.get(e.toLowerCase())||null}append(e,s){return this.clone({name:e,value:s,op:"a"})}set(e,s){return this.clone({name:e,value:s,op:"s"})}delete(e,s){return this.clone({name:e,value:s,op:"d"})}maybeSetNormalizedName(e,s){this.normalizedNames.has(s)||this.normalizedNames.set(s,e)}init(){this.lazyInit&&(this.lazyInit instanceof r?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(e=>this.applyUpdate(e)),this.lazyUpdate=null))}copyFrom(e){e.init(),Array.from(e.headers.keys()).forEach(s=>{this.headers.set(s,e.headers.get(s)),this.normalizedNames.set(s,e.normalizedNames.get(s))})}clone(e){let s=new r;return s.lazyInit=this.lazyInit&&this.lazyInit instanceof r?this.lazyInit:this,s.lazyUpdate=(this.lazyUpdate||[]).concat([e]),s}applyUpdate(e){let s=e.name.toLowerCase();switch(e.op){case"a":case"s":let t=e.value;if(typeof t=="string"&&(t=[t]),t.length===0)return;this.maybeSetNormalizedName(e.name,s);let n=(e.op==="a"?this.headers.get(s):void 0)||[];n.push(...t),this.headers.set(s,n);break;case"d":let o=e.value;if(!o)this.headers.delete(s),this.normalizedNames.delete(s);else{let a=this.headers.get(s);if(!a)return;a=a.filter(i=>o.indexOf(i)===-1),a.length===0?(this.headers.delete(s),this.normalizedNames.delete(s)):this.headers.set(s,a)}break}}setHeaderEntries(e,s){let t=(Array.isArray(s)?s:[s]).map(o=>o.toString()),n=e.toLowerCase();this.headers.set(n,t),this.maybeSetNormalizedName(e,n)}forEach(e){this.init(),Array.from(this.normalizedNames.keys()).forEach(s=>e(this.normalizedNames.get(s),this.headers.get(s)))}};var ye=class{encodeKey(e){return et(e)}encodeValue(e){return et(e)}decodeKey(e){return decodeURIComponent(e)}decodeValue(e){return decodeURIComponent(e)}};function Rt(r,e){let s=new Map;return r.length>0&&r.replace(/^\?/,"").split("&").forEach(n=>{let o=n.indexOf("="),[a,i]=o==-1?[e.decodeKey(n),""]:[e.decodeKey(n.slice(0,o)),e.decodeValue(n.slice(o+1))],l=s.get(a)||[];l.push(i),s.set(a,l)}),s}var bt=/%(\d[a-f0-9])/gi,Mt={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function et(r){return encodeURIComponent(r).replace(bt,(e,s)=>Mt[s]??e)}function te(r){return`${r}`}var O=class r{constructor(e={}){if(this.updates=null,this.cloneFrom=null,this.encoder=e.encoder||new ye,e.fromString){if(e.fromObject)throw new Error("Cannot specify both fromString and fromObject.");this.map=Rt(e.fromString,this.encoder)}else e.fromObject?(this.map=new Map,Object.keys(e.fromObject).forEach(s=>{let t=e.fromObject[s],n=Array.isArray(t)?t.map(te):[te(t)];this.map.set(s,n)})):this.map=null}has(e){return this.init(),this.map.has(e)}get(e){this.init();let s=this.map.get(e);return s?s[0]:null}getAll(e){return this.init(),this.map.get(e)||null}keys(){return this.init(),Array.from(this.map.keys())}append(e,s){return this.clone({param:e,value:s,op:"a"})}appendAll(e){let s=[];return Object.keys(e).forEach(t=>{let n=e[t];Array.isArray(n)?n.forEach(o=>{s.push({param:t,value:o,op:"a"})}):s.push({param:t,value:n,op:"a"})}),this.clone(s)}set(e,s){return this.clone({param:e,value:s,op:"s"})}delete(e,s){return this.clone({param:e,value:s,op:"d"})}toString(){return this.init(),this.keys().map(e=>{let s=this.encoder.encodeKey(e);return this.map.get(e).map(t=>s+"="+this.encoder.encodeValue(t)).join("&")}).filter(e=>e!=="").join("&")}clone(e){let s=new r({encoder:this.encoder});return s.cloneFrom=this.cloneFrom||this,s.updates=(this.updates||[]).concat(e),s}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(e=>this.map.set(e,this.cloneFrom.map.get(e))),this.updates.forEach(e=>{switch(e.op){case"a":case"s":let s=(e.op==="a"?this.map.get(e.param):void 0)||[];s.push(te(e.value)),this.map.set(e.param,s);break;case"d":if(e.value!==void 0){let t=this.map.get(e.param)||[],n=t.indexOf(te(e.value));n!==-1&&t.splice(n,1),t.length>0?this.map.set(e.param,t):this.map.delete(e.param)}else{this.map.delete(e.param);break}}}),this.cloneFrom=this.updates=null)}};var me=class{constructor(){this.map=new Map}set(e,s){return this.map.set(e,s),this}get(e){return this.map.has(e)||this.map.set(e,e.defaultValue()),this.map.get(e)}delete(e){return this.map.delete(e),this}has(e){return this.map.has(e)}keys(){return this.map.keys()}};function At(r){switch(r){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function tt(r){return typeof ArrayBuffer<"u"&&r instanceof ArrayBuffer}function nt(r){return typeof Blob<"u"&&r instanceof Blob}function rt(r){return typeof FormData<"u"&&r instanceof FormData}function Dt(r){return typeof URLSearchParams<"u"&&r instanceof URLSearchParams}var $=class r{constructor(e,s,t,n){this.url=s,this.body=null,this.reportProgress=!1,this.withCredentials=!1,this.responseType="json",this.method=e.toUpperCase();let o;if(At(this.method)||n?(this.body=t!==void 0?t:null,o=n):o=t,o&&(this.reportProgress=!!o.reportProgress,this.withCredentials=!!o.withCredentials,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),this.transferCache=o.transferCache),this.headers??=new b,this.context??=new me,!this.params)this.params=new O,this.urlWithParams=s;else{let a=this.params.toString();if(a.length===0)this.urlWithParams=s;else{let i=s.indexOf("?"),l=i===-1?"?":i<s.length-1?"&":"";this.urlWithParams=s+l+a}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||tt(this.body)||nt(this.body)||rt(this.body)||Dt(this.body)?this.body:this.body instanceof O?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||rt(this.body)?null:nt(this.body)?this.body.type||null:tt(this.body)?null:typeof this.body=="string"?"text/plain":this.body instanceof O?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?"application/json":null}clone(e={}){let s=e.method||this.method,t=e.url||this.url,n=e.responseType||this.responseType,o=e.transferCache??this.transferCache,a=e.body!==void 0?e.body:this.body,i=e.withCredentials??this.withCredentials,l=e.reportProgress??this.reportProgress,c=e.headers||this.headers,u=e.params||this.params,p=e.context??this.context;return e.setHeaders!==void 0&&(c=Object.keys(e.setHeaders).reduce((y,R)=>y.set(R,e.setHeaders[R]),c)),e.setParams&&(u=Object.keys(e.setParams).reduce((y,R)=>y.set(R,e.setParams[R]),u)),new r(s,t,a,{params:u,headers:c,context:p,reportProgress:l,responseType:n,withCredentials:i,transferCache:o})}},N=function(r){return r[r.Sent=0]="Sent",r[r.UploadProgress=1]="UploadProgress",r[r.ResponseHeader=2]="ResponseHeader",r[r.DownloadProgress=3]="DownloadProgress",r[r.Response=4]="Response",r[r.User=5]="User",r}(N||{}),J=class{constructor(e,s=200,t="OK"){this.headers=e.headers||new b,this.status=e.status!==void 0?e.status:s,this.statusText=e.statusText||t,this.url=e.url||null,this.ok=this.status>=200&&this.status<300}},ne=class r extends J{constructor(e={}){super(e),this.type=N.ResponseHeader}clone(e={}){return new r({headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},K=class r extends J{constructor(e={}){super(e),this.type=N.Response,this.body=e.body!==void 0?e.body:null}clone(e={}){return new r({body:e.body!==void 0?e.body:this.body,headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},D=class extends J{constructor(e){super(e,0,"Unknown Error"),this.name="HttpErrorResponse",this.ok=!1,this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${e.url||"(unknown url)"}`:this.message=`Http failure response for ${e.url||"(unknown url)"}: ${e.status} ${e.statusText}`,this.error=e.error||null}},at=200,Ot=204;function pe(r,e){return{body:e,headers:r.headers,context:r.context,observe:r.observe,params:r.params,reportProgress:r.reportProgress,responseType:r.responseType,withCredentials:r.withCredentials,transferCache:r.transferCache}}var Nt=(()=>{let e=class e{constructor(t){this.handler=t}request(t,n,o={}){let a;if(t instanceof $)a=t;else{let c;o.headers instanceof b?c=o.headers:c=new b(o.headers);let u;o.params&&(o.params instanceof O?u=o.params:u=new O({fromObject:o.params})),a=new $(t,n,o.body!==void 0?o.body:null,{headers:c,context:o.context,params:u,reportProgress:o.reportProgress,responseType:o.responseType||"json",withCredentials:o.withCredentials,transferCache:o.transferCache})}let i=ce(a).pipe(Le(c=>this.handler.handle(c)));if(t instanceof $||o.observe==="events")return i;let l=i.pipe(Se(c=>c instanceof K));switch(o.observe||"body"){case"body":switch(a.responseType){case"arraybuffer":return l.pipe(B(c=>{if(c.body!==null&&!(c.body instanceof ArrayBuffer))throw new Error("Response is not an ArrayBuffer.");return c.body}));case"blob":return l.pipe(B(c=>{if(c.body!==null&&!(c.body instanceof Blob))throw new Error("Response is not a Blob.");return c.body}));case"text":return l.pipe(B(c=>{if(c.body!==null&&typeof c.body!="string")throw new Error("Response is not a string.");return c.body}));case"json":default:return l.pipe(B(c=>c.body))}case"response":return l;default:throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)}}delete(t,n={}){return this.request("DELETE",t,n)}get(t,n={}){return this.request("GET",t,n)}head(t,n={}){return this.request("HEAD",t,n)}jsonp(t,n){return this.request("JSONP",t,{params:new O().append(n,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(t,n={}){return this.request("OPTIONS",t,n)}patch(t,n,o={}){return this.request("PATCH",t,pe(o,n))}post(t,n,o={}){return this.request("POST",t,pe(o,n))}put(t,n,o={}){return this.request("PUT",t,pe(o,n))}};e.\u0275fac=function(n){return new(n||e)(d(G))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),Pt=/^\)\]\}',?\n/,It="X-Request-URL";function st(r){if(r.url)return r.url;let e=It.toLocaleLowerCase();return r.headers.get(e)}var ge=(()=>{let e=class e{constructor(){this.fetchImpl=E(ve,{optional:!0})?.fetch??fetch.bind(globalThis),this.ngZone=E(I)}handle(t){return new ae(n=>{let o=new AbortController;return this.doRequest(t,o.signal,n).then(Te,a=>n.error(new D({error:a}))),()=>o.abort()})}doRequest(t,n,o){return ie(this,null,function*(){let a=this.createRequestInit(t),i;try{let v=this.ngZone.runOutsideAngular(()=>this.fetchImpl(t.urlWithParams,_({signal:n},a)));St(v),o.next({type:N.Sent}),i=yield v}catch(v){o.error(new D({error:v,status:v.status??0,statusText:v.statusText,url:t.urlWithParams,headers:v.headers}));return}let l=new b(i.headers),c=i.statusText,u=st(i)??t.urlWithParams,p=i.status,y=null;if(t.reportProgress&&o.next(new ne({headers:l,status:p,statusText:c,url:u})),i.body){let v=i.headers.get("content-length"),j=[],h=i.body.getReader(),f=0,M,k,m=typeof Zone<"u"&&Zone.current;yield this.ngZone.runOutsideAngular(()=>ie(this,null,function*(){for(;;){let{done:P,value:U}=yield h.read();if(P)break;if(j.push(U),f+=U.length,t.reportProgress){k=t.responseType==="text"?(k??"")+(M??=new TextDecoder).decode(U,{stream:!0}):void 0;let Ne=()=>o.next({type:N.DownloadProgress,total:v?+v:void 0,loaded:f,partialText:k});m?m.run(Ne):Ne()}}}));let F=this.concatChunks(j,f);try{let P=i.headers.get("Content-Type")??"";y=this.parseBody(t,F,P)}catch(P){o.error(new D({error:P,headers:new b(i.headers),status:i.status,statusText:i.statusText,url:st(i)??t.urlWithParams}));return}}p===0&&(p=y?at:0),p>=200&&p<300?(o.next(new K({body:y,headers:l,status:p,statusText:c,url:u})),o.complete()):o.error(new D({error:y,headers:l,status:p,statusText:c,url:u}))})}parseBody(t,n,o){switch(t.responseType){case"json":let a=new TextDecoder().decode(n).replace(Pt,"");return a===""?null:JSON.parse(a);case"text":return new TextDecoder().decode(n);case"blob":return new Blob([n],{type:o});case"arraybuffer":return n.buffer}}createRequestInit(t){let n={},o=t.withCredentials?"include":void 0;if(t.headers.forEach((a,i)=>n[a]=i.join(",")),t.headers.has("Accept")||(n.Accept="application/json, text/plain, */*"),!t.headers.has("Content-Type")){let a=t.detectContentTypeHeader();a!==null&&(n["Content-Type"]=a)}return{body:t.serializeBody(),method:t.method,headers:n,credentials:o}}concatChunks(t,n){let o=new Uint8Array(n),a=0;for(let i of t)o.set(i,a),a+=i.length;return o}};e.\u0275fac=function(n){return new(n||e)},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),ve=class{};function Te(){}function St(r){r.then(Te,Te)}function Lt(r,e){return e(r)}function kt(r,e,s){return(t,n)=>Fe(s,()=>e(t,o=>r(o,n)))}var Ee=new w(""),Ct=new w(""),xt=new w("",{providedIn:"root",factory:()=>!0});var ot=(()=>{let e=class e extends G{constructor(t,n){super(),this.backend=t,this.injector=n,this.chain=null,this.pendingTasks=E(Ue),this.contributeToStability=E(xt)}handle(t){if(this.chain===null){let n=Array.from(new Set([...this.injector.get(Ee),...this.injector.get(Ct,[])]));this.chain=n.reduceRight((o,a)=>kt(o,a,this.injector),Lt)}if(this.contributeToStability){let n=this.pendingTasks.add();return this.chain(t,o=>this.backend.handle(o)).pipe(ke(()=>this.pendingTasks.remove(n)))}else return this.chain(t,n=>this.backend.handle(n))}};e.\u0275fac=function(n){return new(n||e)(d(X),d(je))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})();var jt=/^\)\]\}',?\n/;function Ft(r){return"responseURL"in r&&r.responseURL?r.responseURL:/^X-Request-URL:/m.test(r.getAllResponseHeaders())?r.getResponseHeader("X-Request-URL"):null}var it=(()=>{let e=class e{constructor(t){this.xhrFactory=t}handle(t){if(t.method==="JSONP")throw new A(-2800,!1);let n=this.xhrFactory;return(n.\u0275loadImpl?Ie(n.\u0275loadImpl()):ce(null)).pipe(Ce(()=>new ae(a=>{let i=n.build();if(i.open(t.method,t.urlWithParams),t.withCredentials&&(i.withCredentials=!0),t.headers.forEach((h,f)=>i.setRequestHeader(h,f.join(","))),t.headers.has("Accept")||i.setRequestHeader("Accept","application/json, text/plain, */*"),!t.headers.has("Content-Type")){let h=t.detectContentTypeHeader();h!==null&&i.setRequestHeader("Content-Type",h)}if(t.responseType){let h=t.responseType.toLowerCase();i.responseType=h!=="json"?h:"text"}let l=t.serializeBody(),c=null,u=()=>{if(c!==null)return c;let h=i.statusText||"OK",f=new b(i.getAllResponseHeaders()),M=Ft(i)||t.url;return c=new ne({headers:f,status:i.status,statusText:h,url:M}),c},p=()=>{let{headers:h,status:f,statusText:M,url:k}=u(),m=null;f!==Ot&&(m=typeof i.response>"u"?i.responseText:i.response),f===0&&(f=m?at:0);let F=f>=200&&f<300;if(t.responseType==="json"&&typeof m=="string"){let P=m;m=m.replace(jt,"");try{m=m!==""?JSON.parse(m):null}catch(U){m=P,F&&(F=!1,m={error:U,text:m})}}F?(a.next(new K({body:m,headers:h,status:f,statusText:M,url:k||void 0})),a.complete()):a.error(new D({error:m,headers:h,status:f,statusText:M,url:k||void 0}))},y=h=>{let{url:f}=u(),M=new D({error:h,status:i.status||0,statusText:i.statusText||"Unknown Error",url:f||void 0});a.error(M)},R=!1,v=h=>{R||(a.next(u()),R=!0);let f={type:N.DownloadProgress,loaded:h.loaded};h.lengthComputable&&(f.total=h.total),t.responseType==="text"&&i.responseText&&(f.partialText=i.responseText),a.next(f)},j=h=>{let f={type:N.UploadProgress,loaded:h.loaded};h.lengthComputable&&(f.total=h.total),a.next(f)};return i.addEventListener("load",p),i.addEventListener("error",y),i.addEventListener("timeout",y),i.addEventListener("abort",y),t.reportProgress&&(i.addEventListener("progress",v),l!==null&&i.upload&&i.upload.addEventListener("progress",j)),i.send(l),a.next({type:N.Sent}),()=>{i.removeEventListener("error",y),i.removeEventListener("abort",y),i.removeEventListener("load",p),i.removeEventListener("timeout",y),t.reportProgress&&(i.removeEventListener("progress",v),l!==null&&i.upload&&i.upload.removeEventListener("progress",j)),i.readyState!==i.DONE&&i.abort()}})))}};e.\u0275fac=function(n){return new(n||e)(d(ee))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),ct=new w(""),Ut="XSRF-TOKEN",_t=new w("",{providedIn:"root",factory:()=>Ut}),Bt="X-XSRF-TOKEN",zt=new w("",{providedIn:"root",factory:()=>Bt}),re=class{},Vt=(()=>{let e=class e{constructor(t,n,o){this.doc=t,this.platform=n,this.cookieName=o,this.lastCookieString="",this.lastToken=null,this.parseCount=0}getToken(){if(this.platform==="server")return null;let t=this.doc.cookie||"";return t!==this.lastCookieString&&(this.parseCount++,this.lastToken=Q(t,this.cookieName),this.lastCookieString=t),this.lastToken}};e.\u0275fac=function(n){return new(n||e)(d(T),d(S),d(_t))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})();function $t(r,e){let s=r.url.toLowerCase();if(!E(ct)||r.method==="GET"||r.method==="HEAD"||s.startsWith("http://")||s.startsWith("https://"))return e(r);let t=E(re).getToken(),n=E(zt);return t!=null&&!r.headers.has(n)&&(r=r.clone({headers:r.headers.set(n,t)})),e(r)}var we=function(r){return r[r.Interceptors=0]="Interceptors",r[r.LegacyInterceptors=1]="LegacyInterceptors",r[r.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",r[r.NoXsrfProtection=3]="NoXsrfProtection",r[r.JsonpSupport=4]="JsonpSupport",r[r.RequestsMadeViaParent=5]="RequestsMadeViaParent",r[r.Fetch=6]="Fetch",r}(we||{});function lt(r,e){return{\u0275kind:r,\u0275providers:e}}function Sn(...r){let e=[Nt,it,ot,{provide:G,useExisting:ot},{provide:X,useFactory:()=>E(ge,{optional:!0})??E(it)},{provide:Ee,useValue:$t,multi:!0},{provide:ct,useValue:!0},{provide:re,useClass:Vt}];for(let s of r)e.push(...s.\u0275providers);return le(e)}function Ln(r){return lt(we.Interceptors,r.map(e=>({provide:Ee,useValue:e,multi:!0})))}function kn(){return lt(we.Fetch,[ge,{provide:X,useExisting:ge}])}var Me=class extends Qe{constructor(){super(...arguments),this.supportsDOMEvents=!0}},Ae=class r extends Me{static makeCurrent(){qe(new r)}onAndCancel(e,s,t){return e.addEventListener(s,t),()=>{e.removeEventListener(s,t)}}dispatchEvent(e,s){e.dispatchEvent(s)}remove(e){e.remove()}createElement(e,s){return s=s||this.getDefaultDocument(),s.createElement(e)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(e){return e.nodeType===Node.ELEMENT_NODE}isShadowRoot(e){return e instanceof DocumentFragment}getGlobalEventTarget(e,s){return s==="window"?window:s==="document"?e:s==="body"?e.body:null}getBaseHref(e){let s=Xt();return s==null?null:Jt(s)}resetBaseElement(){W=null}getUserAgent(){return window.navigator.userAgent}getCookie(e){return Q(document.cookie,e)}},W=null;function Xt(){return W=W||document.querySelector("base"),W?W.getAttribute("href"):null}function Jt(r){return new URL(r,document.baseURI).pathname}var Kt=(()=>{let e=class e{build(){return new XMLHttpRequest}};e.\u0275fac=function(n){return new(n||e)},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),se=new w(""),ft=(()=>{let e=class e{constructor(t,n){this._zone=n,this._eventNameToPlugin=new Map,t.forEach(o=>{o.manager=this}),this._plugins=t.slice().reverse()}addEventListener(t,n,o){return this._findPluginFor(n).addEventListener(t,n,o)}getZone(){return this._zone}_findPluginFor(t){let n=this._eventNameToPlugin.get(t);if(n)return n;if(n=this._plugins.find(a=>a.supports(t)),!n)throw new A(5101,!1);return this._eventNameToPlugin.set(t,n),n}};e.\u0275fac=function(n){return new(n||e)(d(se),d(I))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),Z=class{constructor(e){this._doc=e}},Re="ng-app-id",pt=(()=>{let e=class e{constructor(t,n,o,a={}){this.doc=t,this.appId=n,this.nonce=o,this.platformId=a,this.styleRef=new Map,this.hostNodes=new Set,this.styleNodesInDOM=this.collectServerRenderedStyles(),this.platformIsServer=H(a),this.resetHostNodes()}addStyles(t){for(let n of t)this.changeUsageCount(n,1)===1&&this.onStyleAdded(n)}removeStyles(t){for(let n of t)this.changeUsageCount(n,-1)<=0&&this.onStyleRemoved(n)}ngOnDestroy(){let t=this.styleNodesInDOM;t&&(t.forEach(n=>n.remove()),t.clear());for(let n of this.getAllStyles())this.onStyleRemoved(n);this.resetHostNodes()}addHost(t){this.hostNodes.add(t);for(let n of this.getAllStyles())this.addStyleToHost(t,n)}removeHost(t){this.hostNodes.delete(t)}getAllStyles(){return this.styleRef.keys()}onStyleAdded(t){for(let n of this.hostNodes)this.addStyleToHost(n,t)}onStyleRemoved(t){let n=this.styleRef;n.get(t)?.elements?.forEach(o=>o.remove()),n.delete(t)}collectServerRenderedStyles(){let t=this.doc.head?.querySelectorAll(`style[${Re}="${this.appId}"]`);if(t?.length){let n=new Map;return t.forEach(o=>{o.textContent!=null&&n.set(o.textContent,o)}),n}return null}changeUsageCount(t,n){let o=this.styleRef;if(o.has(t)){let a=o.get(t);return a.usage+=n,a.usage}return o.set(t,{usage:n,elements:[]}),n}getStyleElement(t,n){let o=this.styleNodesInDOM,a=o?.get(n);if(a?.parentNode===t)return o.delete(n),a.removeAttribute(Re),a;{let i=this.doc.createElement("style");return this.nonce&&i.setAttribute("nonce",this.nonce),i.textContent=n,this.platformIsServer&&i.setAttribute(Re,this.appId),t.appendChild(i),i}}addStyleToHost(t,n){let o=this.getStyleElement(t,n),a=this.styleRef,i=a.get(n)?.elements;i?i.push(o):a.set(n,{elements:[o],usage:1})}resetHostNodes(){let t=this.hostNodes;t.clear(),t.add(this.doc.head)}};e.\u0275fac=function(n){return new(n||e)(d(T),d(ue),d(he,8),d(S))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),be={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},Oe=/%COMP%/g,yt="%COMP%",Wt=`_nghost-${yt}`,Zt=`_ngcontent-${yt}`,Yt=!0,qt=new w("",{providedIn:"root",factory:()=>Yt});function Qt(r){return Zt.replace(Oe,r)}function Ht(r){return Wt.replace(Oe,r)}function mt(r,e){return e.map(s=>s.replace(Oe,r))}var dt=(()=>{let e=class e{constructor(t,n,o,a,i,l,c,u=null){this.eventManager=t,this.sharedStylesHost=n,this.appId=o,this.removeStylesOnCompDestroy=a,this.doc=i,this.platformId=l,this.ngZone=c,this.nonce=u,this.rendererByCompId=new Map,this.platformIsServer=H(l),this.defaultRenderer=new Y(t,i,c,this.platformIsServer)}createRenderer(t,n){if(!t||!n)return this.defaultRenderer;this.platformIsServer&&n.encapsulation===z.ShadowDom&&(n=Pe(_({},n),{encapsulation:z.Emulated}));let o=this.getOrCreateRenderer(t,n);return o instanceof oe?o.applyToHost(t):o instanceof q&&o.applyStyles(),o}getOrCreateRenderer(t,n){let o=this.rendererByCompId,a=o.get(n.id);if(!a){let i=this.doc,l=this.ngZone,c=this.eventManager,u=this.sharedStylesHost,p=this.removeStylesOnCompDestroy,y=this.platformIsServer;switch(n.encapsulation){case z.Emulated:a=new oe(c,u,n,this.appId,p,i,l,y);break;case z.ShadowDom:return new De(c,u,t,n,i,l,this.nonce,y);default:a=new q(c,u,n,p,i,l,y);break}o.set(n.id,a)}return a}ngOnDestroy(){this.rendererByCompId.clear()}};e.\u0275fac=function(n){return new(n||e)(d(ft),d(pt),d(ue),d(qt),d(T),d(S),d(I),d(he))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),Y=class{constructor(e,s,t,n){this.eventManager=e,this.doc=s,this.ngZone=t,this.platformIsServer=n,this.data=Object.create(null),this.throwOnSyntheticProps=!0,this.destroyNode=null}destroy(){}createElement(e,s){return s?this.doc.createElementNS(be[s]||s,e):this.doc.createElement(e)}createComment(e){return this.doc.createComment(e)}createText(e){return this.doc.createTextNode(e)}appendChild(e,s){(ut(e)?e.content:e).appendChild(s)}insertBefore(e,s,t){e&&(ut(e)?e.content:e).insertBefore(s,t)}removeChild(e,s){s.remove()}selectRootElement(e,s){let t=typeof e=="string"?this.doc.querySelector(e):e;if(!t)throw new A(-5104,!1);return s||(t.textContent=""),t}parentNode(e){return e.parentNode}nextSibling(e){return e.nextSibling}setAttribute(e,s,t,n){if(n){s=n+":"+s;let o=be[n];o?e.setAttributeNS(o,s,t):e.setAttribute(s,t)}else e.setAttribute(s,t)}removeAttribute(e,s,t){if(t){let n=be[t];n?e.removeAttributeNS(n,s):e.removeAttribute(`${t}:${s}`)}else e.removeAttribute(s)}addClass(e,s){e.classList.add(s)}removeClass(e,s){e.classList.remove(s)}setStyle(e,s,t,n){n&(V.DashCase|V.Important)?e.style.setProperty(s,t,n&V.Important?"important":""):e.style[s]=t}removeStyle(e,s,t){t&V.DashCase?e.style.removeProperty(s):e.style[s]=""}setProperty(e,s,t){e!=null&&(e[s]=t)}setValue(e,s){e.nodeValue=s}listen(e,s,t){if(typeof e=="string"&&(e=fe().getGlobalEventTarget(this.doc,e),!e))throw new Error(`Unsupported event target ${e} for event ${s}`);return this.eventManager.addEventListener(e,s,this.decoratePreventDefault(t))}decoratePreventDefault(e){return s=>{if(s==="__ngUnwrap__")return e;(this.platformIsServer?this.ngZone.runGuarded(()=>e(s)):e(s))===!1&&s.preventDefault()}}};function ut(r){return r.tagName==="TEMPLATE"&&r.content!==void 0}var De=class extends Y{constructor(e,s,t,n,o,a,i,l){super(e,o,a,l),this.sharedStylesHost=s,this.hostEl=t,this.shadowRoot=t.attachShadow({mode:"open"}),this.sharedStylesHost.addHost(this.shadowRoot);let c=mt(n.id,n.styles);for(let u of c){let p=document.createElement("style");i&&p.setAttribute("nonce",i),p.textContent=u,this.shadowRoot.appendChild(p)}}nodeOrShadowRoot(e){return e===this.hostEl?this.shadowRoot:e}appendChild(e,s){return super.appendChild(this.nodeOrShadowRoot(e),s)}insertBefore(e,s,t){return super.insertBefore(this.nodeOrShadowRoot(e),s,t)}removeChild(e,s){return super.removeChild(null,s)}parentNode(e){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))}destroy(){this.sharedStylesHost.removeHost(this.shadowRoot)}},q=class extends Y{constructor(e,s,t,n,o,a,i,l){super(e,o,a,i),this.sharedStylesHost=s,this.removeStylesOnCompDestroy=n,this.styles=l?mt(l,t.styles):t.styles}applyStyles(){this.sharedStylesHost.addStyles(this.styles)}destroy(){this.removeStylesOnCompDestroy&&this.sharedStylesHost.removeStyles(this.styles)}},oe=class extends q{constructor(e,s,t,n,o,a,i,l){let c=n+"-"+t.id;super(e,s,t,o,a,i,l,c),this.contentAttr=Qt(c),this.hostAttr=Ht(c)}applyToHost(e){this.applyStyles(),this.setAttribute(e,this.hostAttr,"")}createElement(e,s){let t=super.createElement(e,s);return super.setAttribute(t,this.contentAttr,""),t}},en=(()=>{let e=class e extends Z{constructor(t){super(t)}supports(t){return!0}addEventListener(t,n,o){return t.addEventListener(n,o,!1),()=>this.removeEventListener(t,n,o)}removeEventListener(t,n,o){return t.removeEventListener(n,o)}};e.\u0275fac=function(n){return new(n||e)(d(T))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),tn=(()=>{let e=class e extends Z{constructor(t){super(t),this.delegate=E(Ye,{optional:!0})}supports(t){return this.delegate?this.delegate.supports(t):!1}addEventListener(t,n,o){return this.delegate.addEventListener(t,n,o)}removeEventListener(t,n,o){return this.delegate.removeEventListener(t,n,o)}};e.\u0275fac=function(n){return new(n||e)(d(T))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})(),ht=["alt","control","meta","shift"],nn={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},rn={alt:r=>r.altKey,control:r=>r.ctrlKey,meta:r=>r.metaKey,shift:r=>r.shiftKey},sn=(()=>{let e=class e extends Z{constructor(t){super(t)}supports(t){return e.parseEventName(t)!=null}addEventListener(t,n,o){let a=e.parseEventName(n),i=e.eventCallback(a.fullKey,o,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>fe().onAndCancel(t,a.domEventName,i))}static parseEventName(t){let n=t.toLowerCase().split("."),o=n.shift();if(n.length===0||!(o==="keydown"||o==="keyup"))return null;let a=e._normalizeKey(n.pop()),i="",l=n.indexOf("code");if(l>-1&&(n.splice(l,1),i="code."),ht.forEach(u=>{let p=n.indexOf(u);p>-1&&(n.splice(p,1),i+=u+".")}),i+=a,n.length!=0||a.length===0)return null;let c={};return c.domEventName=o,c.fullKey=i,c}static matchEventFullKeyCode(t,n){let o=nn[t.key]||t.key,a="";return n.indexOf("code.")>-1&&(o=t.code,a="code."),o==null||!o?!1:(o=o.toLowerCase(),o===" "?o="space":o==="."&&(o="dot"),ht.forEach(i=>{if(i!==o){let l=rn[i];l(t)&&(a+=i+".")}}),a+=o,a===n)}static eventCallback(t,n,o){return a=>{e.matchEventFullKeyCode(a,t)&&o.runGuarded(()=>n(a))}}static _normalizeKey(t){return t==="esc"?"escape":t}};e.\u0275fac=function(n){return new(n||e)(d(T))},e.\u0275prov=g({token:e,factory:e.\u0275fac});let r=e;return r})();function or(r,e){return Ze(_({rootComponent:r},on(e)))}function on(r){return{appProviders:[...un,...r?.providers??[]],platformProviders:dn}}function an(){Ae.makeCurrent()}function cn(){return new de}function ln(){return _e(document),document}var dn=[{provide:S,useValue:He},{provide:Be,useValue:an,multi:!0},{provide:T,useFactory:ln,deps:[]}];var un=[{provide:xe,useValue:"root"},{provide:de,useFactory:cn,deps:[]},{provide:se,useClass:en,multi:!0,deps:[T,I,S]},{provide:se,useClass:sn,multi:!0,deps:[T]},{provide:se,useClass:tn,multi:!0},dt,pt,ft,{provide:We,useExisting:dt},{provide:ee,useClass:Kt,deps:[]},[]];var ir=(()=>{let e=class e{constructor(t){this._doc=t}getTitle(){return this._doc.title}setTitle(t){this._doc.title=t||""}};e.\u0275fac=function(n){return new(n||e)(d(T))},e.\u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"});let r=e;return r})();var hn=(()=>{let e=class e{};e.\u0275fac=function(n){return new(n||e)},e.\u0275prov=g({token:e,factory:function(n){let o=null;return n?o=new(n||e):o=d(fn),o},providedIn:"root"});let r=e;return r})(),fn=(()=>{let e=class e extends hn{constructor(t){super(),this._doc=t}sanitize(t,n){if(n==null)return null;switch(t){case L.NONE:return n;case L.HTML:return x(n,"HTML")?C(n):Ke(this._doc,String(n)).toString();case L.STYLE:return x(n,"Style")?C(n):n;case L.SCRIPT:if(x(n,"Script"))return C(n);throw new A(5200,!1);case L.URL:return x(n,"URL")?C(n):Je(String(n));case L.RESOURCE_URL:if(x(n,"ResourceURL"))return C(n);throw new A(5201,!1);default:throw new A(5202,!1)}}bypassSecurityTrustHtml(t){return ze(t)}bypassSecurityTrustStyle(t){return Ve(t)}bypassSecurityTrustScript(t){return $e(t)}bypassSecurityTrustUrl(t){return Ge(t)}bypassSecurityTrustResourceUrl(t){return Xe(t)}};e.\u0275fac=function(n){return new(n||e)(d(T))},e.\u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"});let r=e;return r})();export{Nt as a,Sn as b,Ln as c,kn as d,dt as e,or as f,ir as g,hn as h};
