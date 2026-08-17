import React from "react";
export function Button({variant="primary",size="md",flavor,disabled,children,onClick,type="button",style}){
  const pal={primary:{bg:"var(--red)",fg:"var(--white)"},secondary:{bg:"var(--white)",fg:"var(--ink)"},inverse:{bg:"var(--ink)",fg:"var(--paper)"},flavor:{bg:flavor||"var(--lime)",fg:"var(--ink)"}}[variant]||{bg:"var(--red)",fg:"var(--white)"};
  const sz={sm:{padding:"6px 12px",fontSize:"var(--text-xs)"},md:{padding:"10px 20px",fontSize:"var(--text-sm)"},lg:{padding:"14px 28px",fontSize:"var(--text-base)"}}[size];
  const [state,setState]=React.useState("idle");
  const lift=state==="hover"?{transform:"translate(-2px,-2px)",boxShadow:"var(--shadow-pixel-lg)"}:state==="press"?{transform:"translate(2px,2px)",boxShadow:"none"}:{boxShadow:"var(--shadow-pixel)"};
  return <button type={type} disabled={disabled} onClick={onClick}
    onMouseEnter={()=>setState("hover")} onMouseLeave={()=>setState("idle")}
    onMouseDown={()=>setState("press")} onMouseUp={()=>setState("hover")}
    style={{fontFamily:"var(--font-pixel)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",
      background:pal.bg,color:pal.fg,border:"var(--border-w) solid var(--ink)",borderRadius:0,cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?0.45:1,transition:"transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap)",
      ...sz,...(disabled?{boxShadow:"var(--shadow-pixel-sm)"}:lift),...style}}>{children}</button>;
}
