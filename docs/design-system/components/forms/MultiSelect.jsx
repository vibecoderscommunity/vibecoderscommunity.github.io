import React from "react";
import {Tag} from "../display/Tag.jsx";
export function MultiSelect({label,options=[],value=[],onChange,placeholder="Pick some…",disabled,style}){
  const [open,setOpen]=React.useState(false);
  const ref=React.useRef(null);
  React.useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);
  const items=options.map(o=>typeof o==="string"?{value:o,label:o}:o);
  const toggle=v=>{if(!onChange)return;onChange(value.includes(v)?value.filter(x=>x!==v):[...value,v])};
  return <div ref={ref} style={{position:"relative",fontFamily:"var(--font-mono)",...style}}>
    {label&&<span style={{display:"block",fontFamily:"var(--font-pixel)",fontWeight:700,fontSize:"var(--text-xs)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"var(--space-2)"}}>{label}</span>}
    <div onClick={()=>!disabled&&setOpen(o=>!o)}
      style={{display:"flex",flexWrap:"wrap",gap:"var(--space-1)",alignItems:"center",minHeight:41,padding:"5px 12px 5px 6px",
        background:disabled?"var(--surface-sunken)":"var(--white)",border:"var(--border-w) solid var(--ink)",
        cursor:disabled?"not-allowed":"pointer",boxShadow:open?"var(--shadow-pixel-sm)":"none",position:"relative"}}>
      {value.length===0&&<span style={{color:"var(--text-faint)",fontSize:"var(--text-sm)",paddingLeft:6}}>{placeholder}</span>}
      {value.map(v=>{const i=items.find(x=>x.value===v);return <Tag key={v} onRemove={e=>{e.stopPropagation();toggle(v)}}>{i?i.label:v}</Tag>})}
      <span style={{marginLeft:"auto",fontSize:10}}>{open?"▴":"▾"}</span>
    </div>
    {open&&<div style={{position:"absolute",zIndex:20,top:"calc(100% + 4px)",left:0,right:0,background:"var(--white)",
      border:"var(--border-w) solid var(--ink)",boxShadow:"var(--shadow-pixel)",maxHeight:220,overflowY:"auto"}}>
      {items.map(i=>{const on=value.includes(i.value);return <div key={i.value} onClick={()=>toggle(i.value)}
        onMouseEnter={e=>{e.currentTarget.style.background="var(--red-tint)"}} onMouseLeave={e=>{e.currentTarget.style.background="var(--white)"}}
        style={{padding:"9px 12px",fontSize:"var(--text-sm)",cursor:"pointer",display:"flex",gap:"var(--space-2)",alignItems:"center",background:"var(--white)"}}>
        <span style={{width:16,height:16,flex:"0 0 16px",border:"2px solid var(--ink)",background:on?"var(--red)":"var(--white)",
          color:"var(--white)",fontSize:11,lineHeight:"12px",textAlign:"center",fontWeight:700}}>{on?"✕":""}</span>
        <span>{i.label}</span>
      </div>})}
    </div>}
  </div>;
}
