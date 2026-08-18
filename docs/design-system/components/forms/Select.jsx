import React from "react";
export function Select({label,options=[],value,onChange,placeholder="Select…",disabled,style}){
  const [open,setOpen]=React.useState(false);
  const ref=React.useRef(null);
  React.useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);
  const items=options.map(o=>typeof o==="string"?{value:o,label:o}:o);
  const sel=items.find(i=>i.value===value);
  return <div ref={ref} style={{position:"relative",fontFamily:"var(--font-mono)",...style}}>
    {label&&<span style={{display:"block",fontFamily:"var(--font-pixel)",fontWeight:700,fontSize:"var(--text-xs)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"var(--space-2)"}}>{label}</span>}
    <button type="button" disabled={disabled} onClick={()=>setOpen(o=>!o)}
      style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"var(--space-2)",
        fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",padding:"10px 12px",textAlign:"left",
        background:disabled?"var(--surface-sunken)":"var(--white)",color:sel?"var(--text-body)":"var(--text-faint)",
        border:"var(--border-w) solid var(--ink)",cursor:disabled?"not-allowed":"pointer",
        boxShadow:open?"var(--shadow-pixel-sm)":"none"}}>
      <span>{sel?sel.label:placeholder}</span><span style={{fontSize:10}}>{open?"▴":"▾"}</span>
    </button>
    {open&&<div style={{position:"absolute",zIndex:20,top:"calc(100% + 4px)",left:0,right:0,background:"var(--white)",
      border:"var(--border-w) solid var(--ink)",boxShadow:"var(--shadow-pixel)",maxHeight:220,overflowY:"auto"}}>
      {items.map(i=><div key={i.value} onClick={()=>{onChange&&onChange(i.value);setOpen(false)}}
        onMouseEnter={e=>{e.currentTarget.style.background="var(--red-tint)"}} onMouseLeave={e=>{e.currentTarget.style.background=i.value===value?"var(--paper-2)":"var(--white)"}}
        style={{padding:"9px 12px",fontSize:"var(--text-sm)",cursor:"pointer",display:"flex",justifyContent:"space-between",background:i.value===value?"var(--paper-2)":"var(--white)"}}>
        <span>{i.label}</span>{i.value===value&&<span style={{color:"var(--red)"}}>▮</span>}
      </div>)}
    </div>}
  </div>;
}
