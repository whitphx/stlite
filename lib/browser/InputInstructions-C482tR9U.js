import{k as g,c as d,j as c,bG as h,bH as p}from"./index-DDFagdcg.js";const b=g`
  50% {
    color: rgba(0, 0, 0, 0);
  }
`,$=d("span",{target:"edlqvik0"})(({includeDot:n,shouldBlink:o,theme:t})=>({...n?{"&::before":{opacity:1,content:'"\u2022"',animation:"none",color:t.colors.gray,margin:`0 ${t.spacing.twoXS}`}}:{},...o?{color:t.colors.red,animationName:`${b}`,animationDuration:"0.5s",animationIterationCount:5}:{}}),""),f=({dirty:n,value:o,inForm:t,maxLength:s,className:m,type:i="single",allowEnterToSubmit:u=!0})=>{const e=[],l=(a,r=!1)=>{e.push(c.jsx($,{includeDot:e.length>0,shouldBlink:r,children:a},e.length))};if(u){const a=t?"submit form":"apply";if(i==="multiline"){const r=p()?"\u2318":"Ctrl";l(`Press ${r}+Enter to ${a}`)}else i==="single"&&l(`Press Enter to ${a}`)}return s&&(i!=="chat"||n)&&l(`${o.length}/${s}`,n&&o.length>=s),c.jsx(h,{"data-testid":"InputInstructions",className:m,children:e})};export{f as I};
