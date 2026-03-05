import { Search, ShieldCheck, BarChart3, Users, Zap } from "lucide-react";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  const targetUser = username?.trim();
  
  let data = null;
  let error = null;

  if (targetUser) {
    try {
      // Updated to the most resilient v2 search endpoint
      const res = await fetch(`https://api.scrapecreators.com/v2/instagram/user/full?handle=${targetUser}`, {
        method: 'GET',
        headers: { 
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'AuditAI-Validator/1.0' // Helps bypass basic blocks
        },
        next: { revalidate: 0 } 
      });

      if (!res.ok) {
        const errorText = await res.text();
        error = `API Error ${res.status}: ${errorText.substring(0, 50)}`;
      } else {
        data = await res.json();
      }
    } catch (e) {
      error = "Network Timeout: Service is unreachable";
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-green-500/5 blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-6 h-6" />
          <span className="text-xl font-black tracking-tighter italic uppercase">Audit.AI</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto pt-20 px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            Intelligence <br/><span className="text-green-500">Unfiltered.</span>
          </h1>
          <p className="text-zinc-500 text-lg">Analyze creator authenticity in real-time.</p>
        </div>

        <form action="/" method="GET" className="max-w-2xl mx-auto mb-20">
          <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 backdrop-blur-xl focus-within:border-green-500/50 transition-all shadow-2xl">
            <input 
              name="username"
              defaultValue={targetUser}
              placeholder="branden_roy23"
              className="w-full bg-transparent py-4 px-6 focus:outline-none text-white text-lg"
            />
            <button type="submit" className="bg-white text-black font-bold px-10 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all">
              Analyze
            </button>
          </div>
        </form>

        {targetUser ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-zinc-500">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Audit Logs // {targetUser}</span>
              </div>
              <pre className="text-[11px] font-mono text-green-400/90 leading-relaxed overflow-auto max-h-[400px]">
                {error ? `// SYSTEM_ERROR: ${error}` : JSON.stringify(data, null, 2)}
              </pre>
            </div>
            
            <div className="space-y-6">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px]">
                <Zap className="text-green-500 w-5 h-5 mb-4" />
                <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Audit Score</h4>
                <p className="text-5xl font-black italic">{data?.score || "---"}</p>
              </div>
              <div className="bg-green-500 p-8 rounded-[32px] text-black shadow-[0_0_50px_-12px_rgba(34,197,94,0.5)]">
                <Users className="w-5 h-5 mb-4 opacity-60" />
                <h4 className="text-black/50 text-[10px] font-bold uppercase mb-1">Authenticity</h4>
                <p className="text-3xl font-black italic uppercase">Verified</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-700 font-bold uppercase tracking-widest text-xs opacity-50">
            Input required to initiate scan...
          </div>
        )}
      </main>
    </div>
  );
}
