import React from "react";
export function Input({label,hint,error,prefix,type="text",placeholder,value,onChange,disabled,style}){
  const [focus,setFocus]=React.useState(false);
  return <label style={{display:"block",fontFamily:"var(--font-mono)",...style}}>
    {label&&<span style={{display:"block",fontFamily:"var(--font-pixel)",fontWeight:700,fontSize:"var(--text-xs)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"var(--space-2)"}}>{label}</span>}
    <span style={{display:"flex",alignItems:"center",background:disabled?"var(--surface-sunken)":"var(--white)",
      border:`var(--border-w) solid ${error?"var(--error)":"var(--ink)"}`,
      boxShadow:focus?`inset 3px 3px 0 ${error?"var(--red-tint)":"var(--paper-3)"}`:"none"}}>
      {prefix&&<span style={{padding:"0 0 0 12px",color:"var(--text-faint)",fontSize:"var(--text-sm)"}}>{prefix}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{flex:1,minWidth:0,fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",padding:"10px 12px",border:"none",outline:"none",background:"transparent",color:"var(--text-body)"}}/>
    </span>
    {(error||hint)&&<span style={{display:"block",marginTop:"var(--space-1)",fontSize:"var(--text-xs)",color:error?"var(--error)":"var(--text-faint)"}}>{error||hint}</span>}
  </label>;
}
