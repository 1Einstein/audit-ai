"use client";
import { useState, useCallback } from "react";

const S = {
  bg:"#080808",surface:"#0f0f0f",surface2:"#161616",
  border:"rgba(255,255,255,0.07)",text:"#f0ede8",
  muted:"rgba(240,237,232,0.4)",accent:"#c8f135",orange:"#ff6b35",
};

const PLATFORMS = ["instagram","tiktok","youtube","twitter"] as const;
type Platform = typeof PLATFORMS[number];

interface Result {
  handle:string;platform:string;profileName:string;profileImage?:string;
  followers:number;followersFormatted:string;engagementRate:number;
  fakeFollowerPercent:number;auditScore:number;estimatedPostRate:number;
  audienceAge:string;topCountry:string;topCountryPercent:number;
  fraudFlagged:boolean;fraudReason?:string;
}
interface AuditError { code:string;message:string;suggestion?:string; }

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [handle, setHandle] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result|null>(null);
  const [error, setError] = useState<AuditError|null>(null);

  const runAudit = useCallback(async (h?: string) => {
    const target = (h||handle).replace("@","").trim();
    if (!target||loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/audit", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({handle:target,platform}),
      });
      const data = await res.json();
      if (!res.ok||data.code) setError(data); else setResult(data);
    } catch { setError({code:"API_ERROR",message:"Connection failed.",suggestion:"Check your internet and try again."}); }
    finally { setLoading(false); }
  },[handle,platform,loading]);

  const sc = result ? (result.auditScore>=80?"#4ade80":result.auditScore>=60?S.accent:S.orange) : S.accent;

  return (
    <div style={{background:S.bg,minHeight:"100vh",color:S.text,fontFamily:"system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .chip:hover{border-color:rgba(200,241,53,0.4)!important;color:#c8f135!important}
        .feat:hover{background:#0f0f0f!important}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 40px",backdropFilter:"blur(12px)",borderBottom:`1px solid ${S.border}`,background:"rgba(8,8,8,0.85)"}}>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.3rem",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:S.accent,boxShadow:`0 0 12px ${S.accent}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
          Audit<span style={{color:S.accent}}>.</span>AI
        </div>
        <div style={{display:"flex",gap:20,fontSize:"0.78rem",fontFamily:"'DM Mono',monospace",color:S.muted,alignItems:"center"}}>
          <a href="#" style={{color:S.muted,textDecoration:"none"}}>Pricing</a>
          <a href="#" style={{color:S.muted,textDecoration:"none"}}>Docs</a>
          <a href="#" style={{color:S.text,textDecoration:"none",border:`1px solid ${S.border}`,padding:"6px 16px",borderRadius:6}}>Sign in</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 60px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:800,height:500,background:"radial-gradient(ellipse,rgba(200,241,53,0.06),transparent 70%)",pointerEvents:"none"}}/>

        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",color:S.accent,border:"1px solid rgba(200,241,53,0.3)",padding:"6px 16px",borderRadius:100,marginBottom:32,background:"rgba(200,241,53,0.05)",animation:"fadeUp 0.6s 0.2s both"}}>
          Influencer Intelligence Platform
        </div>

        <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(2.8rem,8vw,6rem)",lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:24,maxWidth:900,animation:"fadeUp 0.7s 0.35s both"}}>
          Know <em style={{fontStyle:"italic",color:"transparent",WebkitTextStroke:"1px rgba(240,237,232,0.45)"}}>exactly</em> who<br/>
          you&apos;re <span style={{color:S.accent}}>paying for</span>
        </h1>

        <p style={{fontSize:"0.95rem",color:S.muted,maxWidth:460,lineHeight:1.7,marginBottom:52,fontWeight:300,animation:"fadeUp 0.7s 0.5s both"}}>
          Paste any Instagram or TikTok handle. Get a full audit — fake followers, engagement rate, audience data, and a fraud score in seconds.
        </p>

        {/* SEARCH */}
        <div style={{width:"100%",maxWidth:620,animation:"fadeUp 0.8s 0.65s both"}}>
          <div style={{borderRadius:16,background:S.surface,border:`1px solid ${focused?"rgba(200,241,53,0.4)":S.border}`,boxShadow:focused?"0 0 0 1px rgba(200,241,53,0.15),0 20px 60px rgba(0,0,0,0.5)":"none",transition:"all 0.3s"}}>
            <div style={{display:"flex",gap:4,padding:"10px 14px 0",borderBottom:`1px solid ${S.border}`,overflowX:"auto"}}>
              {PLATFORMS.map(p=>(
                <button key={p} onClick={()=>setPlatform(p)} style={{fontFamily:"'DM Mono',monospace",fontSize:"0.63rem",letterSpacing:"0.05em",textTransform:"uppercase",padding:"5px 12px",borderRadius:"6px 6px 0 0",border:"none",cursor:"pointer",background:platform===p?S.surface2:"transparent",color:platform===p?S.accent:S.muted,borderBottom:platform===p?`2px solid ${S.accent}`:"2px solid transparent",transition:"all 0.2s",whiteSpace:"nowrap"}}>
                  {p}
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px"}}>
              <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.5rem",color:S.accent,opacity:0.8,flexShrink:0}}>@</span>
              <input type="text" value={handle} onChange={e=>setHandle(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onKeyDown={e=>e.key==="Enter"&&runAudit()} placeholder="enter handle to audit..." autoComplete="off" spellCheck={false}
                style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:"1rem",color:S.text,caretColor:S.accent,fontFamily:"system-ui,sans-serif"}}/>
              <button onClick={()=>runAudit()} disabled={loading||!handle.trim()}
                style={{flexShrink:0,display:"flex",alignItems:"center",gap:8,background:loading?S.surface2:S.accent,color:loading?S.muted:"#080808",border:"none",padding:"10px 20px",borderRadius:10,fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.05em",cursor:loading?"default":"pointer",transition:"all 0.2s",opacity:!handle.trim()&&!loading?0.5:1}}>
                {loading?<><span style={{width:13,height:13,border:"2px solid rgba(200,241,53,0.2)",borderTopColor:S.accent,borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/> AUDITING</>:<>→ AUDIT</>}
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 18px 12px",fontFamily:"'DM Mono',monospace",fontSize:"0.63rem",color:S.muted}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80",display:"inline-block",animation:"pulse 1.5s infinite"}}/>
                Live data · ⚡ ~2.4s avg
              </span>
              <span>ScrapeCreators API</span>
            </div>
          </div>

          <div style={{marginTop:16,display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            <div style={{width:"100%",textAlign:"center",fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",color:S.muted,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Recently audited</div>
            {["kyliejenner","charlidamelio","mrbeast","cristiano"].map(h=>(
              <button key={h} className="chip" onClick={()=>{setHandle(h);runAudit(h);}}
                style={{fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",padding:"5px 14px",borderRadius:100,border:`1px solid ${S.border}`,color:S.muted,background:S.surface,cursor:"pointer",transition:"all 0.2s"}}>
                @{h}
              </button>
            ))}
          </div>
        </div>

        {/* RESULT */}
        {result&&(
          <div style={{width:"100%",maxWidth:620,marginTop:20,background:S.surface,border:`1px solid ${S.border}`,borderRadius:16,overflow:"hidden",animation:"fadeUp 0.4s ease both"}}>
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"18px 22px",borderBottom:`1px solid ${S.border}`}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Instrument Serif',serif",fontSize:"1.2rem",flexShrink:0,overflow:"hidden"}}>
                {result.profileImage?<img src={result.profileImage} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:result.profileName[0].toUpperCase()}
              </div>
              <div>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.15rem",letterSpacing:"-0.02em"}}>{result.profileName}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",color:S.muted,marginTop:2}}>@{result.handle} · {result.platform}</div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"2.2rem",color:sc,lineHeight:1}}>{result.auditScore}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Audit Score</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
              {[
                {label:"Followers",value:result.followersFormatted,sub:"Live count",color:"#4ade80"},
                {label:"Eng. Rate",value:`${result.engagementRate}%`,sub:result.engagementRate>=2?"↑ Above avg":"↓ Below avg",color:result.engagementRate>=2?"#4ade80":S.orange},
                {label:"Fake Followers",value:`${result.fakeFollowerPercent}%`,sub:result.fakeFollowerPercent>25?"⚠ High risk":"✓ Acceptable",color:result.fakeFollowerPercent>25?S.orange:"#4ade80"},
                {label:"Est. Post Rate",value:`$${result.estimatedPostRate.toLocaleString()}`,sub:"per sponsored post",color:S.muted},
                {label:"Core Audience",value:result.audienceAge,sub:"Age range",color:S.muted},
                {label:"Top Country",value:result.topCountry,sub:`${result.topCountryPercent}% of audience`,color:S.muted},
              ].map((m,i)=>(
                <div key={i} style={{padding:"16px 18px",borderRight:i%3!==2?`1px solid ${S.border}`:"none",borderBottom:i<3?`1px solid ${S.border}`:"none"}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.3rem",letterSpacing:"-0.02em"}}>{m.value}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2}}>{m.label}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.63rem",color:m.color,marginTop:3}}>{m.sub}</div>
                </div>
              ))}
            </div>
            {result.fraudFlagged&&(
              <div style={{margin:"0 16px 16px",padding:"11px 16px",background:"rgba(255,107,53,0.08)",border:"1px solid rgba(255,107,53,0.2)",borderRadius:10,fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:S.orange,display:"flex",alignItems:"center",gap:8}}>
                ⚠ {result.fraudReason}
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {error&&!loading&&(
          <div style={{width:"100%",maxWidth:620,marginTop:20,padding:"28px",background:S.surface,border:"1px solid rgba(255,107,53,0.2)",borderRadius:16,textAlign:"center",animation:"fadeUp 0.3s ease both"}}>
            <div style={{fontSize:"2rem",marginBottom:12}}>🔍</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.1rem",marginBottom:8}}>{error.code==="NOT_FOUND"?"Handle not found":"Something went wrong"}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",color:S.muted,lineHeight:1.7}}>
              {error.message}<br/>
              {error.suggestion&&<span style={{color:S.accent,opacity:0.8}}>{error.suggestion}</span>}
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{marginTop:72,display:"flex",width:"100%",maxWidth:760,borderTop:`1px solid ${S.border}`,borderBottom:`1px solid ${S.border}`,animation:"fadeUp 0.6s 1s both"}}>
          {[{num:"12M+",label:"Profiles Audited"},{num:"$2.4B",label:"Ad Spend Protected"},{num:"98.2%",label:"Bot Detection Accuracy"},{num:"2.4s",label:"Avg Audit Time"}].map((s,i)=>(
            <div key={s.label} style={{flex:1,textAlign:"center",padding:"24px 12px",borderRight:i<3?`1px solid ${S.border}`:"none"}}>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"2rem",letterSpacing:"-0.03em"}}>{s.num}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",letterSpacing:"0.15em",textTransform:"uppercase",color:S.accent,marginBottom:16}}>What we detect</div>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(2rem,4vw,3.2rem)",letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:52,maxWidth:560}}>
          Don&apos;t get <em style={{fontStyle:"italic",color:"transparent",WebkitTextStroke:"1px rgba(240,237,232,0.4)"}}>burned</em><br/>by fake influence
        </h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:1,background:S.border,border:`1px solid ${S.border}`,borderRadius:16,overflow:"hidden"}}>
          {[
            {icon:"🤖",title:"Bot & Ghost Detection",desc:"ML model surfaces inauthentic audiences before you sign a contract."},
            {icon:"💰",title:"Fair Rate Calculator",desc:"Benchmarked against 50,000+ deals for honest post valuations."},
            {icon:"📊",title:"Audience Demographics",desc:"Real age, gender, and location data from live follower analysis."},
            {icon:"📈",title:"Growth Trend Analysis",desc:"Spot suspicious spikes and bulk follower purchases over 24 months."},
            {icon:"✍️",title:"Sentiment Analysis",desc:"AI reads recent comments to gauge how audiences really feel."},
            {icon:"⚡",title:"Real-Time Data",desc:"Every audit pulls live data. No cached results. Ever."},
          ].map(f=>(
            <div key={f.title} className="feat" style={{background:S.bg,padding:"32px 28px",transition:"background 0.2s"}}>
              <div style={{fontSize:"1.8rem",marginBottom:16}}>{f.icon}</div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.1rem",marginBottom:8,letterSpacing:"-0.02em"}}>{f.title}</div>
              <div style={{fontSize:"0.84rem",color:S.muted,lineHeight:1.7,fontWeight:300}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"60px 24px 100px",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.8rem,5vw,3.5rem)",letterSpacing:"-0.03em",marginBottom:16}}>Start auditing free.<br/>No card required.</h2>
        <p style={{color:S.muted,fontSize:"0.9rem",marginBottom:36,fontWeight:300}}>10 free audits per month. Unlimited on Pro.</p>
        <a href="#" style={{display:"inline-flex",alignItems:"center",gap:10,background:S.accent,color:"#080808",padding:"14px 32px",borderRadius:12,fontFamily:"'DM Mono',monospace",fontSize:"0.82rem",fontWeight:600,letterSpacing:"0.04em",textDecoration:"none"}}>GET STARTED FREE →</a>
      </section>

      <footer style={{borderTop:`1px solid ${S.border}`,padding:"28px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'DM Mono',monospace",fontSize:"0.66rem",color:S.muted,flexWrap:"wrap",gap:12}}>
        <div>Audit<span style={{color:S.accent}}>.</span>AI — Influencer Intelligence</div>
        <div style={{display:"flex",gap:20}}>
          <a href="#" style={{color:S.muted,textDecoration:"none"}}>Privacy</a>
          <a href="#" style={{color:S.muted,textDecoration:"none"}}>Terms</a>
          <span>© 2025</span>
        </div>
      </footer>
    </div>
  );
}
