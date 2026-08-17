import React from "react";
import {Button} from "../actions/Button.jsx";
export function Header({logoSrc,links=[],activeHref,cta,onCtaClick,style}){
  return <header style={{background:"var(--paper)",borderBottom:"var(--border-w-heavy) solid var(--ink)",fontFamily:"var(--font-mono)",...style}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"0 var(--space-5)",height:64,display:"flex",alignItems:"center",gap:"var(--space-6)"}}>
      <a href="#" style={{display:"flex",alignItems:"center",gap:"var(--space-2)",textDecoration:"none",color:"var(--ink)",background:"none"}}>
        {logoSrc?<img src={logoSrc} alt="Vibe Coders Tokyo" style={{height:44,imageRendering:"pixelated"}}/>:
        <span style={{fontFamily:"var(--font-pixel)",fontWeight:700,fontSize:"var(--text-base)"}}>VIBE CODERS <span style={{color:"var(--red)"}}>TOKYO</span></span>}
      </a>
      <nav style={{display:"flex",gap:"var(--space-4)",marginLeft:"auto",alignItems:"center"}}>
        {links.map(l=><a key={l.href} href={l.href}
          style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",fontWeight:l.href===activeHref?700:400,
            textDecoration:"none",color:"var(--ink)",padding:"4px 8px",
            background:l.href===activeHref?"var(--red-tint)":"none",
            borderBottom:l.href===activeHref?"2px solid var(--red)":"2px solid transparent"}}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--red-tint)"}}
          onMouseLeave={e=>{e.currentTarget.style.background=l.href===activeHref?"var(--red-tint)":"none"}}>{l.label}</a>)}
        {cta&&<Button size="sm" onClick={onCtaClick}>{cta}</Button>}
      </nav>
    </div>
  </header>;
}
