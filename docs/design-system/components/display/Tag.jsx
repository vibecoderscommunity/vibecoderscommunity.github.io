import React from "react";
export function Tag({flavor="var(--paper-2)",onRemove,children,style}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",fontWeight:500,
    padding:"3px 8px",background:flavor,color:"var(--ink)",border:"2px solid var(--ink)",borderRadius:"var(--radius-px)",...style}}>
    {children}
    {onRemove&&<button type="button" onClick={onRemove} aria-label="Remove"
      style={{all:"unset",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700,lineHeight:1}}>✕</button>}
  </span>;
}
