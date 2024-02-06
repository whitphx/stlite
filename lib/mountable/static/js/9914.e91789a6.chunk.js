"use strict";(self.webpackChunkstlite=self.webpackChunkstlite||[]).push([[9914,5422],{9914:(e,t,r)=>{r.r(t),r.d(t,{FileHandle:()=>h});var n=r(25422),s=r(25068);const{WritableStream:a,TransformStream:i,DOMException:o,Blob:l}=s.Z,{GONE:c}=n.errors,d=/constructor/i.test(window.HTMLElement)||window.safari||window.WebKitPoint;class h{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"unkown";this.name=e,this.kind="file"}async getFile(){throw new o(...c)}async isSameEntry(e){return this===e}async createWritable(){var e;let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const r=await(null===(e=navigator.serviceWorker)||void 0===e?void 0:e.getRegistration()),n=document.createElement("a"),s=new i,o=s.writable;if(n.download=this.name,d||!r){let e=[];s.readable.pipeTo(new a({write(t){e.push(new l([t]))},close(){const t=new l(e,{type:"application/octet-stream; charset=utf-8"});e=[],n.href=URL.createObjectURL(t),n.click(),setTimeout((()=>URL.revokeObjectURL(n.href)),1e4)}}))}else{const{writable:e,readablePort:n}=new u(a),o=encodeURIComponent(this.name).replace(/['()]/g,escape).replace(/\*/g,"%2A"),l={"content-disposition":"attachment; filename*=UTF-8''"+o,"content-type":"application/octet-stream; charset=utf-8",...t.size?{"content-length":t.size}:{}},c=setTimeout((()=>r.active.postMessage(0)),1e4);s.readable.pipeThrough(new i({transform(e,t){if(e instanceof Uint8Array)return t.enqueue(e);const r=new Response(e).body.getReader(),n=e=>r.read().then((e=>e.done?0:n(t.enqueue(e.value))));return n()}})).pipeTo(e).finally((()=>{clearInterval(c)})),r.active.postMessage({url:r.scope+o,headers:l,readablePort:n},[n]);const d=document.createElement("iframe");d.hidden=!0,d.src=r.scope+o,document.body.appendChild(d)}return o.getWriter()}}class p{constructor(e){e.onmessage=e=>this._onMessage(e.data),this._port=e,this._resetReady()}start(e){return this._controller=e,this._readyPromise}write(e){const t={type:0,chunk:e};return this._port.postMessage(t,[e.buffer]),this._resetReady(),this._readyPromise}close(){this._port.postMessage({type:2}),this._port.close()}abort(e){this._port.postMessage({type:1,reason:e}),this._port.close()}_onMessage(e){0===e.type&&this._resolveReady(),1===e.type&&this._onError(e.reason)}_onError(e){this._controller.error(e),this._rejectReady(e),this._port.close()}_resetReady(){this._readyPromise=new Promise(((e,t)=>{this._readyResolve=e,this._readyReject=t})),this._readyPending=!0}_resolveReady(){this._readyResolve(),this._readyPending=!1}_rejectReady(e){this._readyPending||this._resetReady(),this._readyPromise.catch((()=>{})),this._readyReject(e),this._readyPending=!1}}class u{constructor(e){const t=new MessageChannel;this.readablePort=t.port1,this.writable=new e(new p(t.port2))}}},25422:(e,t,r)=>{r.r(t),r.d(t,{config:()=>s,errors:()=>n,fromDataTransfer:()=>a,getDirHandlesFromInput:()=>i,getFileHandlesFromInput:()=>o});const n={INVALID:["seeking position failed.","InvalidStateError"],GONE:["A requested file or directory could not be found at the time an operation was processed.","NotFoundError"],MISMATCH:["The path supplied exists, but was not an entry of requested type.","TypeMismatchError"],MOD_ERR:["The object can not be modified in this way.","InvalidModificationError"],SYNTAX:e=>["Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ".concat(e),"SyntaxError"],SECURITY:["It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources.","SecurityError"],DISALLOWED:["The request is not allowed by the user agent or the platform in the current context.","NotAllowedError"]},s={writable:globalThis.WritableStream};async function a(e){console.warn("deprecated fromDataTransfer - use `dt.items[0].getAsFileSystemHandle()` instead");const[t,n,s]=await Promise.all([r.e(258).then(r.bind(r,20258)),r.e(9655).then(r.bind(r,79655)),Promise.resolve().then(r.bind(r,73372))]),a=new t.FolderHandle("",!1);return a._entries=e.map((e=>e.isFile?new n.FileHandle(e,!1):new n.FolderHandle(e,!1))),new s.FileSystemDirectoryHandle(a)}async function i(e){const{FolderHandle:t,FileHandle:n}=await r.e(258).then(r.bind(r,20258)),{FileSystemDirectoryHandle:s}=await Promise.resolve().then(r.bind(r,73372)),a=Array.from(e.files),i=a[0].webkitRelativePath.split("/",1)[0],o=new t(i,!1);return a.forEach((e=>{const r=e.webkitRelativePath.split("/");r.shift();const s=r.pop();r.reduce(((e,r)=>(e._entries[r]||(e._entries[r]=new t(r,!1)),e._entries[r])),o)._entries[s]=new n(e.name,e,!1)})),new s(o)}async function o(e){const{FileHandle:t}=await r.e(258).then(r.bind(r,20258)),{FileSystemFileHandle:n}=await Promise.resolve().then(r.bind(r,64156));return Array.from(e.files).map((e=>new n(new t(e.name,e,!1))))}}}]);
//# sourceMappingURL=9914.e91789a6.chunk.js.map