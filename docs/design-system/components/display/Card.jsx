import React from "react";
import {Tag} from "./Tag.jsx";
export function Card({image,imageAlt="",eyebrow,title,meta,children,tags,footer,flavor,hoverable,style}){
  const [hover,setHover]=React.useState(false);
  return <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{background:"var(--surface-card)",border:"var(--border-w) solid var(--ink)",
      boxShadow:hoverable&&hover?"var(--shadow-pixel-lg)":"var(--shadow-pixel)",
      transform:hoverable&&hover?"translate(-2px,-2px)":"none",
      transition:"transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap)",
      display:"flex",flexDirection:"column",...style}}>
    {image&&<img src={image} alt={imageAlt} style={{display:"block",width:"100%",aspectRatio:"1",objectFit:"cover",borderBottom:"var(--border-w) solid var(--ink)"}}/>}
    <div style={{padding:"var(--space-4)",display:"flex",flexDirection:"column",gap:"var(--space-2)",flex:1}}>
      {eyebrow&&<div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",fontWeight:700,textTransform:"uppercase",letterSpacing:"var(--tracking-caps)",color:flavor?"var(--ink)":"var(--red)",background:flavor||"transparent",alignSelf:"flex-start",padding:flavor?"1px 6px":0}}>{eyebrow}</div>}
      {title&&<div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"var(--text-xl)",lineHeight:"var(--leading-tight)"}}>{title}</div>}
      {meta&&<div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",color:"var(--text-faint)"}}>{meta}</div>}
      {children&&<div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",color:"var(--text-muted)",lineHeight:"var(--leading-body)"}}>{children}</div>}
      {tags&&tags.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-1)",marginTop:"auto",paddingTop:"var(--space-2)"}}>{tags.map(t=><Tag key={typeof t==="string"?t:t.label} flavor={typeof t==="string"?undefined:t.flavor}>{typeof t==="string"?t:t.label}</Tag>)}</div>}
      {footer&&<div style={{marginTop:"var(--space-2)"}}>{footer}</div>}
    </div>
  </div>;
}
