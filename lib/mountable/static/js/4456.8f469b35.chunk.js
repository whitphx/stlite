"use strict";(self.webpackChunkstlite=self.webpackChunkstlite||[]).push([[4456],{64456:(e,t,o)=>{o.r(t),o.d(t,{default:()=>j});var n=o(30969),r=o(21543),l=o(40551),i=o(68754);let d=function(e){return e.ASCENDING="ascending",e.DESCENDING="descending",e}({});var a=o(83405);const c=(0,a.Z)("div",{target:"epzu5vs8"})((e=>{let{width:t,theme:o}=e;return{width:t,border:"1px solid ".concat(o.colors.fadedText05),boxSizing:"content-box","& .table-top-right":{overflow:"hidden !important",paddingRight:"6px"},"& .table-bottom-left":{overflow:"hidden !important",paddingBottom:"6px"},"& .table-bottom-right":{overflow:"overlay !important"},"& .table-bottom-right:focus-visible":{outline:"none"},"& .table-bottom-right:focus":{outline:"none"}}}),""),s=(0,a.Z)("div",{target:"epzu5vs7"})((e=>{let{theme:t}=e;return{padding:"".concat(t.spacing.twoXS," ").concat(t.spacing.xs),borderBottom:"1px solid ".concat(t.colors.fadedText05),borderRight:"1px solid ".concat(t.colors.fadedText05),fontSize:t.fontSizes.md,fontFamily:t.genericFonts.bodyFont,lineHeight:t.lineHeights.table,display:"flex",alignItems:"center",justifyContent:"flex-start"}}),""),h=e=>({color:e.colors.fadedText60,borderBottom:"1px solid ".concat(e.colors.fadedText05),borderRight:"1px solid ".concat(e.colors.fadedText05),zIndex:1}),u=e=>({overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",lineHeight:e.lineHeights.table}),m=(0,a.Z)(s,{target:"epzu5vs6"})((e=>{let{theme:t}=e;return h(t)}),""),f=(0,a.Z)(s,{target:"epzu5vs5"})((e=>{let{theme:t}=e;return{userSelect:"none",...h(t),...u(t)}}),""),g=(0,a.Z)(s,{target:"epzu5vs4"})((e=>{let{theme:t}=e;return{userSelect:"none",...h(t),...u(t)}}),""),w=(0,a.Z)(s,{target:"epzu5vs3"})((e=>{let{theme:t}=e;return u(t)}),""),p=(0,a.Z)("div",{target:"epzu5vs2"})((e=>{let{verticalLocator:t,horizontalLocator:o,width:n,height:r}=e;return{position:"absolute",[t]:"0px",[o]:"0px",width:n,height:r}}),""),x=(0,a.Z)("div",{target:"epzu5vs1"})((e=>{let{theme:t}=e;return{fontFamily:t.genericFonts.codeFont,color:t.colors.fadedText60,fontStyle:"italic",fontSize:t.fontSizes.md,textAlign:"center"}}),""),b=(0,a.Z)("span",{target:"epzu5vs0"})((e=>{let{theme:t}=e;return{color:t.colors.fadedText05,verticalAlign:"top"}}),"");var v=o(22115),C=o(1561);const y=!("undefined"===typeof window||!window.document||!window.document.createElement);let S;function N(e){if((!S&&0!==S||e)&&y){const e=document.createElement("div");e.style.position="absolute",e.style.top="-9999px",e.style.width="50px",e.style.height="50px",e.style.overflow="scroll",document.body.appendChild(e),S=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return S}var I=o(13926);const D=2*I.CH.smPx,E=(e,t,o,n)=>{const{headerRows:r,headerCols:l,dataRows:d,cols:a,rows:c}=(0,i.kG)(o),s=D*r,h=t-2-N(),u=function(e,t,o,n,r,l){const i=25,d=e>2?200:400,a=e=>{let{index:o}=e;const r=o,d=8*10/10,a=24,c=100;let s=i;for(let i=0;i<Math.min(t,c);i++){let e=-1;e=i<n?i:t>c?Math.floor(Math.random()*t):i;const{contents:o}=l(r,e),h=(o?o.length:0)*d+a;h>s&&(s=h)}return s};let c=[];const s=Array.from(Array(e),((e,t)=>a({index:t}))),h=s.reduce(((e,t)=>e+t),0),u=r-h,m=e=>e.filter((e=>e>d));if(u<0)c=s.map((e=>e>d?d:e));else{const e=m(s),t=u/e.length;c=s.map(((o,n)=>n in e.keys()?o+t:o))}let f=c.reduce(((e,t)=>e+t),0);if(f>r*(2/3)&&f<r){const t=(r-f)/e;c=c.map((e=>e+t)),f=c.reduce(((e,t)=>e+t),0)}const g=Math.min(f,r),w=e=>{let{index:t}=e;return c[t]},p=c.slice(0,o).reduce(((e,t)=>e+t));return{elementWidth:g,columnWidth:w,headerWidth:p}}(a,c,l,r,h,n);let{elementWidth:m,columnWidth:f,headerWidth:g}=u;if(0===d&&m<60){m=60,g=60;let e=0;for(let t=0;t<a;t++)e+=f({index:t});e<60&&(f=()=>60/a)}const w=c*D,p=(e||300)-2;e=Math.min(w,p);return m+=w>p?N():0,{rowHeight:D,headerHeight:s,border:2,columnWidth:f,headerWidth:g,elementWidth:m,height:e}},R={corner:m,"col-header":f,"row-header":g,data:w};var z=o(7896),G=o(67801),A=n.forwardRef((function(e,t){return n.createElement(G.D,(0,z.Z)({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 8 8"},e,{ref:t}),n.createElement("path",{d:"M4 1L0 5l1.5 1.5L4 4l2.5 2.5L8 5 4 1z"}))}));A.displayName="ChevronTop";var W=n.forwardRef((function(e,t){return n.createElement(G.D,(0,z.Z)({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 8 8"},e,{ref:t}),n.createElement("path",{d:"M1.5 1L0 2.5l4 4 4-4L6.5 1 4 3.5 1.5 1z"}))}));W.displayName="ChevronBottom";var k=o(77746),Z=o(37574);function T(e){let t,o,n,{CellType:r,columnIndex:l,contents:i,rowIndex:a,sortedByUser:c,style:s,columnSortDirection:h,headerClickedCallback:u}=e,m=i;const f=h===d.DESCENDING;null!=u&&0===a&&(t=()=>u(l),o="button",n=0,m=null==h?'Sort by column "'.concat(i,'"'):'Sorted by column "'.concat(i,'" (').concat(f?"descending":"ascending",")"));const g=0===a?function(e){switch(e){case d.ASCENDING:return(0,Z.jsx)(b,{"data-testid":"sortIcon",children:(0,Z.jsx)(k.Z,{content:A,size:"xs",margin:"0 0 0 twoXS"})});case d.DESCENDING:return(0,Z.jsx)(b,{"data-testid":"sortIcon",children:(0,Z.jsx)(k.Z,{content:W,size:"xs",margin:"0 0 0 twoXS"})});default:return null}}(h):void 0;return(0,Z.jsxs)(r,{style:s,onClick:t,role:o,tabIndex:n,title:m,"data-testid":r.displayName,"data-test-sort-direction":h,children:[i,c?g:""]})}const j=(0,l.Z)((function(e){let{element:t,height:o,width:l}=e;const a=n.useRef(null),[s,h]=(0,n.useState)(!1),[u,m]=(0,n.useState)(0),[f,g]=(0,n.useState)(d.ASCENDING),[,w]=(0,i.oo)(t.get("data")),{headerRows:b,headerCols:y,dataRows:S,cols:N,rows:I}=(0,i.kG)(t),D=e=>{let t=d.ASCENDING;u===e&&(t=f===d.ASCENDING?d.DESCENDING:d.ASCENDING),m(e),g(t),h(!0)},z=(e=>{const{headerCols:o,dataRows:n}=(0,i.kG)(t),r=f!==d.DESCENDING;if(u<o||u-o>=e){const e=new Array(n);for(let t=0;t<n;t+=1)e[t]=r?t:n-(t+1);return e}return(0,i.X_)(t,u-o,r)})(w),G=function(e){let{element:t,headerRows:o,sortedDataRowIndices:n}=e;return(e,r)=>{if(null!=n&&r>=o){const e=r-o;e>=0&&e<n.length?(r=n[e],r+=o):(0,C.KE)("Bad sortedDataRowIndices ("+"rowIndex=".concat(r,", ")+"headerRows=".concat(o,", ")+"sortedDataRowIndices.length=".concat(n.length))}const{contents:l,styles:d,type:a}=(0,i.me)(t,e,r);return{Component:R[a],styles:d,contents:(0,v.H7)(l)}}}({element:t,headerRows:b,sortedDataRowIndices:z}),A=function(e){return t=>{let{columnIndex:o,key:n,rowIndex:r,style:l}=t;const{Component:i,styles:d,contents:a}=e(o,r),c=0===r?D:void 0,h=o===u?f:void 0,m={...l,...d,borderBottom:r===S?"none":void 0,borderRight:o===N-y?"none":void 0};return(0,Z.jsx)(T,{CellType:i,columnIndex:o,rowIndex:r,style:m,contents:a,sortedByUser:s,columnSortDirection:h,headerClickedCallback:c},n)}}(G),{rowHeight:W,headerHeight:k,border:j,height:B,elementWidth:L,columnWidth:H,headerWidth:F}=E(o,l,t,G);return setTimeout((()=>{null!=a.current&&a.current.recomputeGridSize()}),0),(0,n.useEffect)((()=>{u-y>=w&&(m(0),g(d.ASCENDING),h(!1))}),[u,y,w]),(0,Z.jsxs)(c,{width:L,className:"stDataFrame",children:[(0,Z.jsx)(r.yR,{cellRenderer:A,fixedColumnCount:y,fixedRowCount:b,columnWidth:H,columnCount:N,enableFixedColumnScroll:!1,enableFixedRowScroll:!1,height:B,rowHeight:W,rowCount:I,width:L,classNameBottomLeftGrid:"table-bottom-left",classNameBottomRightGrid:"table-bottom-right",classNameTopRightGrid:"table-top-right",ref:a}),(0,Z.jsx)(p,{verticalLocator:"top",horizontalLocator:"right",width:j,height:k}),(0,Z.jsx)(p,{verticalLocator:"bottom",horizontalLocator:"left",width:F,height:j}),0===S?(0,Z.jsx)(x,{children:"empty"}):null]})}))}}]);
//# sourceMappingURL=4456.8f469b35.chunk.js.map