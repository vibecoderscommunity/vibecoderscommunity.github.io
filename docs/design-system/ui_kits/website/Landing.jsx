const {Header,Button,Card,Tag,Input,Select,MultiSelect}=window.VibeCodersDesignSystem_6b2297;
function Blink(){return <span style={{color:"var(--red)",animation:"px-blink 1s steps(1) infinite"}}>▮</span>;}
function SectionTitle({children}){return <h2 style={{fontFamily:"var(--font-heading)",fontSize:"var(--text-3xl)",margin:"0 0 var(--space-5)",textTransform:"uppercase"}}>{children}</h2>;}
function NewsletterBand(){
  const [email,setEmail]=React.useState("");
  const [city,setCity]=React.useState("");
  const [topics,setTopics]=React.useState([]);
  const [done,setDone]=React.useState(false);
  return <section style={{background:"var(--ink)",borderTop:"3px solid var(--ink)",borderBottom:"3px solid var(--ink)"}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-7) var(--space-5)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-7)",alignItems:"center"}}>
      <div>
        <h2 style={{fontFamily:"var(--font-heading)",color:"var(--paper)",fontSize:"var(--text-3xl)",margin:0,textTransform:"uppercase"}}>Get the <span style={{color:"var(--lime)"}}>newsletter</span></h2>
        <p style={{color:"var(--paper-3)",fontSize:"var(--text-sm)",maxWidth:420}}>Once a month: the next meetup, recaps, and whatever the community shipped. No spam, unsubscribe whenever.</p>
      </div>
      {done?
        <div style={{background:"var(--paper)",border:"2px solid var(--lime)",boxShadow:"4px 4px 0 var(--lime)",padding:"var(--space-5)",fontFamily:"var(--font-pixel)",fontWeight:700,textTransform:"uppercase"}}>You're in! See you at the next one<Blink/></div>:
        <form onSubmit={e=>{e.preventDefault();if(email)setDone(true)}} style={{background:"var(--paper)",border:"2px solid var(--ink)",boxShadow:"4px 4px 0 var(--lime)",padding:"var(--space-5)",display:"flex",flexDirection:"column",gap:"var(--space-4)"}}>
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-4)"}}>
            <Select label="City" placeholder="Pick one" value={city} onChange={setCity} options={[{value:"tokyo",label:"Tokyo"},{value:"singapore",label:"Singapore"},{value:"else",label:"Somewhere else"}]}/>
            <MultiSelect label="Topics" placeholder="Any" value={topics} onChange={setTopics} options={[{value:"ai",label:"AI tools"},{value:"design",label:"Design"},{value:"models",label:"Local models"},{value:"agents",label:"Agents"}]}/>
          </div>
          <Button type="submit" variant="flavor" flavor="var(--lime)">Sign me up</Button>
        </form>}
    </div>
  </section>;
}
function Footer(){
  return <footer style={{background:"var(--paper)",borderTop:"3px solid var(--ink)"}}>
    <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-5)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"var(--text-xs)",color:"var(--text-faint)"}}>
      <span style={{fontFamily:"var(--font-pixel)",fontWeight:700,color:"var(--ink)"}}>VIBE CODERS <span style={{color:"var(--red)"}}>TOKYO</span></span>
      <span style={{fontFamily:"var(--font-pixel-jp)"}}>東京 · シンガポール</span>
      <span>Cozy vibes. No pitching.</span>
    </div>
  </footer>;
}
function Landing({onOpenRecap}){
  const events=window.VBT_EVENTS;
  const next=events[2]; // Design for Vibe Coding as "featured next" demo
  return <div>
    <section style={{background:"radial-gradient(circle at 68% 35%, #efb0a0 0%, #f2cfc2 32%, var(--paper) 68%)",borderBottom:"3px solid var(--ink)"}}>
      <div style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-8) var(--space-5)",display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"var(--space-7)",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",fontWeight:700,letterSpacing:"var(--tracking-caps)",textTransform:"uppercase",marginBottom:"var(--space-3)"}}>Tokyo · Singapore · <span style={{fontFamily:"var(--font-pixel-jp)"}}>ようこそ</span></div>
          <h1 style={{fontFamily:"var(--font-pixel)",fontSize:"var(--text-4xl)",margin:0,textTransform:"uppercase",lineHeight:1.05}}>Vibe<br/>C<span style={{color:"var(--red)"}}>o</span>ders<br/>Tokyo<Blink/></h1>
          <p style={{fontSize:"var(--text-base)",maxWidth:440,margin:"var(--space-5) 0"}}>A cozy meetup for people who build things with AI — novices and enthusiasts, fun project shareouts, zero startup pitching.</p>
          <div style={{display:"flex",gap:"var(--space-4)"}}>
            <Button size="lg">RSVP next meetup</Button>
            <Button size="lg" variant="secondary" onClick={onOpenRecap}>Past events</Button>
          </div>
        </div>
        <img src="../../assets/logo.avif" alt="Vibe Coders Tokyo logo" style={{width:"78%",justifySelf:"center",imageRendering:"pixelated",border:"2px solid var(--ink)",boxShadow:"6px 6px 0 var(--ink)",background:"#fdfcfa"}}/>
      </div>
    </section>
    <section style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-7) var(--space-5)"}}>
      <SectionTitle>Next meetup</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:"var(--space-6)",alignItems:"start"}}>
        <Card image={next.img} imageAlt={next.title}/>
        <div style={{paddingTop:"var(--space-2)"}}>
          <div style={{display:"inline-block",background:"var(--gold)",border:"2px solid var(--ink)",padding:"2px 10px",fontFamily:"var(--font-mono)",fontSize:"var(--text-xs)",fontWeight:700,textTransform:"uppercase",letterSpacing:"var(--tracking-caps)"}}>Doors open 6:30</div>
          <h3 style={{fontFamily:"var(--font-heading)",fontSize:"var(--text-3xl)",margin:"var(--space-3) 0",textTransform:"uppercase"}}>{next.title}</h3>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"var(--text-sm)",fontWeight:700,letterSpacing:"var(--tracking-wide)",marginBottom:"var(--space-3)"}}>{next.meta}</div>
          <p style={{maxWidth:520,fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{next.blurb} Bring a laptop and a work-in-progress if you have one — five-minute shareouts are open to everyone.</p>
          <div style={{display:"flex",gap:"var(--space-2)",margin:"var(--space-4) 0"}}>{next.tags.map(t=><Tag key={t} flavor={next.flavor}>{t}</Tag>)}</div>
          <Button>RSVP — it's free</Button>
        </div>
      </div>
    </section>
    <NewsletterBand/>
    <section style={{maxWidth:"var(--container)",margin:"0 auto",padding:"var(--space-7) var(--space-5)"}}>
      <SectionTitle>Past events</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"var(--space-5)"}}>
        {events.slice(0,6).map(ev=><div key={ev.id} onClick={onOpenRecap} style={{cursor:"pointer"}}>
          <Card image={ev.img} imageAlt={ev.title} title={ev.title} meta={ev.meta} tags={ev.tags.map(t=>({label:t,flavor:ev.flavor}))} hoverable>{ev.blurb}</Card>
        </div>)}
      </div>
    </section>
    <Footer/>
  </div>;
}
Object.assign(window,{Landing,NewsletterBand,Footer,Blink,SectionTitle});
