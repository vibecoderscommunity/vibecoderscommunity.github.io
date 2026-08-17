const {Header,Button,Card,Tag,Input,Select}=window.VibeCodersDesignSystem_6b2297;
function Blink(){return <span style={{color:"var(--red)",animation:"px-blink 1s steps(1) infinite"}}>▮</span>;}
function SectionTitle({children}){return <h2 style={{fontFamily:"var(--font-heading)",fontSize:"var(--text-3xl)",margin:"0 0 var(--space-5)",textTransform:"uppercase"}}>{children}</h2>;}
function SiteHeader({prefix=""}){
  // Header component's wordmark is hardcoded "VIBE CODERS TOKYO"; replicates its exact styles with the group name.
  const links=[{label:"Next meetups",href:prefix+"#chapters"},{label:"Past events",href:prefix+"#events"},{label:"Sign up",href:prefix+"#newsletter"}];
  return <header style={{background:"var(--paper)",borderBottom:"var(--border-w-heavy) solid var(--ink)",fontFamily:"var(--font-mono)"}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"0 var(--space-5)",height:64,display:"flex",alignItems:"center",gap:"var(--space-6)"}}>
      <a href={prefix||"index.html"} style={{display:"flex",alignItems:"center",gap:"var(--space-2)",textDecoration:"none",color:"var(--ink)",background:"none"}}>
        <span style={{fontFamily:"var(--font-pixel)",fontWeight:700,fontSize:"var(--text-base)"}}>VIBE C<span style={{color:"var(--red)"}}>O</span>DERS MEETUP</span>
      </a>
      <nav style={{display:"flex",gap:"var(--space-4)",marginLeft:"auto",alignItems:"center"}}>
        {links.map(l=><a key={l.href} href={l.href} style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",textDecoration:"none",color:"var(--ink)",padding:"4px 8px",background:"none",borderBottom:"2px solid transparent"}} onMouseEnter={e=>{e.currentTarget.style.background="var(--red-tint)"}} onMouseLeave={e=>{e.currentTarget.style.background="none"}}>{l.label}</a>)}
      </nav>
    </div>
  </header>;
}
function NewsletterBand(){
  const [email,setEmail]=React.useState("");
  const [city,setCity]=React.useState("");
  const [done,setDone]=React.useState(()=>{try{return localStorage.getItem("vbt-subscribed")==="1"}catch(e){return false}});
  const subscribe=e=>{e.preventDefault();if(!email)return;try{localStorage.setItem("vbt-subscribed","1")}catch(err){}setDone(true);};
  return <section id="newsletter" style={{background:"var(--ink)",borderTop:"3px solid var(--ink)",borderBottom:"3px solid var(--ink)"}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-7) var(--space-5)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-7)",alignItems:"center"}}>
      <div>
        <h2 style={{fontFamily:"var(--font-heading)",color:"var(--paper)",fontSize:"var(--text-2xl)",margin:0,textTransform:"uppercase"}}>Sign up to be <span style={{color:"var(--lime)"}}>notified</span> of future events</h2>
        <p style={{color:"var(--paper-3)",fontSize:"var(--text-sm)",maxWidth:420}}>The next meetup in Tokyo and Singapore, straight to your inbox. No spam, unsubscribe whenever.</p>
      </div>
      {done?
        <div style={{background:"var(--paper)",border:"2px solid var(--lime)",boxShadow:"4px 4px 0 var(--lime)",padding:"var(--space-5)",fontFamily:"var(--font-pixel)",fontWeight:700,textTransform:"uppercase"}}>You're in! See you at the next one<Blink/></div>:
        <form onSubmit={subscribe} style={{background:"var(--paper)",border:"2px solid var(--ink)",boxShadow:"4px 4px 0 var(--lime)",padding:"var(--space-5)",display:"flex",flexDirection:"column",gap:"var(--space-4)"}}>
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          <Select label="City" placeholder="Pick one" value={city} onChange={setCity} options={[{value:"tokyo",label:"Tokyo"},{value:"singapore",label:"Singapore"},{value:"else",label:"Somewhere else"}]}/>
          <Button type="submit" variant="flavor" flavor="var(--lime)">Sign me up</Button>
        </form>}
    </div>
  </section>;
}
function SiteFooter({prefix=""}){
  return <footer style={{background:"var(--paper)",borderTop:"3px solid var(--ink)"}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-6) var(--space-5)",display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"var(--space-6)"}}>
      <div>
        <div style={{fontFamily:"var(--font-pixel)",fontWeight:700,textTransform:"uppercase"}}>VIBE C<span style={{color:"var(--red)"}}>O</span>DERS MEETUP <span style={{color:"var(--text-faint)"}}>Tokyo & Singapore</span></div>
        <p style={{fontSize:"var(--text-sm)",color:"var(--text-muted)",maxWidth:480,margin:"var(--space-3) 0 0"}}>A cozy meetup for vibe-coding novices and enthusiasts. Fun project shareouts, AI-tool discussions, workshops, and free pizza.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",justifySelf:"end"}}>
        <a href={window.VBT_LINKS.tokyo} target="_blank" rel="noopener">▸ Tokyo on lu.ma</a>
        <a href={window.VBT_LINKS.sg} target="_blank" rel="noopener">▸ Singapore on lu.ma</a>
        <a href={prefix+"#events"}>▸ Past events</a>
        <a href={prefix+"#newsletter"}>▸ Sign up</a>
      </div>
    </div>
    <div style={{borderTop:"2px solid var(--ink)",padding:"var(--space-3) var(--space-5)",textAlign:"center",fontSize:"var(--text-xs)",color:"var(--text-faint)"}}>Cozy vibes.<Blink/></div>
  </footer>;
}
function EventCard({ev}){
  return <a href={ev.href||"event.html"} style={{textDecoration:"none",color:"inherit",display:"block",background:"none"}}>
    <Card image={ev.img} imageAlt={ev.title} title={ev.title} meta={ev.meta} tags={ev.tags.map(t=>({label:t,flavor:ev.flavor}))} hoverable>{ev.blurb}</Card>
  </a>;
}
Object.assign(window,{Blink,SectionTitle,SiteHeader,NewsletterBand,SiteFooter,EventCard});
