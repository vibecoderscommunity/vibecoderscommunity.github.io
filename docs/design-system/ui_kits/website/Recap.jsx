const {Button,Card,Tag}=window.VibeCodersDesignSystem_6b2297;
function Recap({onBack}){
  const ev=window.VBT_EVENTS[4]; // Antigravity Workshop
  return <div>
    <div style={{maxWidth:"var(--container-text)",margin:"0 auto",padding:"var(--space-7) var(--space-5)"}}>
      <a href="#" onClick={e=>{e.preventDefault();onBack()}} style={{fontSize:"var(--text-sm)"}}>← All events</a>
      <div style={{display:"inline-block",background:ev.flavor,border:"2px solid var(--ink)",padding:"2px 10px",fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",fontWeight:700,textTransform:"uppercase",letterSpacing:"var(--tracking-caps)",margin:"var(--space-5) 0 var(--space-3)",display:"block",width:"fit-content"}}>Recap</div>
      <h1 style={{fontFamily:"var(--font-heading)",fontSize:"var(--text-3xl)",margin:"0 0 var(--space-2)",textTransform:"uppercase"}}>{ev.title}</h1>
      <div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",fontWeight:700,letterSpacing:"var(--tracking-wide)",color:"var(--text-muted)",marginBottom:"var(--space-5)"}}>{ev.meta} · 42 CODERS SHOWED UP</div>
      <img src={ev.img} alt={ev.title} style={{width:"100%",border:"2px solid var(--ink)",boxShadow:"var(--shadow-pixel)"}}/>
      <div style={{display:"flex",gap:"var(--space-2)",margin:"var(--space-5) 0"}}>{ev.tags.map(t=><Tag key={t} flavor={ev.flavor}>{t}</Tag>)}</div>
      <p>{ev.blurb} We split into small groups, broke things, fixed some of them, and ate an irresponsible amount of pizza.</p>
      <h2 style={{fontFamily:"var(--font-heading)",fontSize:"var(--text-xl)",textTransform:"uppercase",margin:"var(--space-6) 0 var(--space-3)"}}>What got shared</h2>
      <ul style={{fontSize:"var(--text-sm)",lineHeight:"var(--leading-body)",paddingLeft:"1.2em",margin:0}}>
        <li>A pixel-art sprite generator built in one prompt session</li>
        <li>Voice-controlled kitchen timer (it mostly listened)</li>
        <li>Three different takes on agent memory — all cozy, all cursed</li>
      </ul>
      <div style={{background:"var(--surface-sunken)",border:"2px solid var(--ink)",padding:"var(--space-4)",margin:"var(--space-6) 0",fontSize:"var(--text-sm)"}}>
        <span style={{fontFamily:"var(--font-pixel)",fontWeight:700,textTransform:"uppercase",fontSize:"var(--text-xs)"}}>Photos & slides → </span>
        shared in the newsletter. Not on it yet? Scroll down.
      </div>
      <Button variant="secondary" onClick={onBack}>← Back to all events</Button>
    </div>
    <NewsletterBand/>
    <Footer/>
  </div>;
}
Object.assign(window,{Recap});
