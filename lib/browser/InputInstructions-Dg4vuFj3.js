import{c as g,k as d,j as c,cT as h,cU as p}from"./index-C08LT-R7.js";const $=d`
  50% {
    color: rgba(0, 0, 0, 0);
  }
`,f=g("span",{target:"edlqvik0"})(({includeDot:n,shouldBlink:o,theme:t})=>({...n?{"&::before":{opacity:1,content:'"\u2022"',animation:"none",color:t.colors.gray,margin:`0 ${t.spacing.twoXS}`}}:{},...o?{color:t.colors.red,animationName:`${$}`,animationDuration:"0.5s",animationIterationCount:5}:{}}),""),b=({dirty:n,value:o,inForm:t,maxLength:s,className:m,type:i="single",allowEnterToSubmit:u=!0})=>{const e=[],l=(a,r=!1)=>{e.push(c.jsx(f,{includeDot:e.length>0,shouldBlink:r,children:a},e.length))};if(u){const a=t?"submit form":"apply";if(i==="multiline"){const r=p()?"\u2318":"Ctrl";l(`Press ${r}+Enter to ${a}`)}else i==="single"&&l(`Press Enter to ${a}`)}return s&&(i!=="chat"||n)&&l(`${o.length}/${s}`,n&&o.length>=s),c.jsx(h,{"data-testid":"InputInstructions",className:m,children:e})};export{b as I};
