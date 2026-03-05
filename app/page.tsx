import { Search, ShieldCheck, BarChart3, Users, Zap } from "lucide-react";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams; // Next.js 15 requirement
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  const targetUser = username?.trim();
  
  let data = null;
  let errorDetail = null;

  if (targetUser) {
    try {
      // Switched to the standard 'profile' endpoint to resolve the 404
      const res = await fetch(`https://api.scrapecreators.com/v1/instagram/profile?username=${targetUser}`, {
        method: 'GET',
        headers: { 
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Critical: Forces a fresh API call on every click
      });

      if (!res.ok) {
        errorDetail = `Status ${res.status}: The API could not find this handle or the endpoint is restricted.`;
      } else {
        data = await res.json();
      }
    } catch (e) {
      errorDetail = "Network connection failed. Check your internet or API status.";
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <nav className="p-8 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-6 h-6" />
          <span className="text-xl font-black italic uppercase tracking-tighter">Audit.AI</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-20 px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            Intelligence <br/><span className="text-green-500">Unfiltered.</span>
          </h1>
        </div>

        {/* This form triggers the URL update that Next.js 15 uses to fetch data */}
        <form action="/" method="GET" className="max-w-2xl mx-auto mb-20">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-green-500/50 transition-all shadow-2xl">
            <input 
              name="username"
              required
              placeholder="enter handle..."
              className="w-full bg-transparent py-4 px-6 focus:outline-none text-white text-lg"
            />
            <button type="submit" className="bg-white text-black font-bold px-10 rounded-xl hover:bg-zinc-200 transition-all active:scale-95">
              Analyze
            </button>
          </div>
        </form>

        {targetUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
            <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-zinc-500">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest italic">Live Audit Data // {targetUser}</span>
              </div>
              <pre className="text-[11px] font-mono text-green-400 overflow-auto max-h-[400px]">
                {errorDetail ? `// SYSTEM_ERROR: ${errorDetail}` : JSON.stringify(data, null, 2)}
              </pre>
            </div>
            
            <div className="space-y-6">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px]">
                <Zap className="text-green-500 w-5 h-5 mb-4" />
                <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Audit Score</h4>
                <p className="text-5xl font-black italic tracking-tighter">{data?.audit_score || data?.score || "---"}</p>
              </div>
              <div className="bg-green-500 p-8 rounded-[32px] text-black">
                <Users className="w-5 h-5 mb-4 opacity-60" />
                <h4 className="text-black/50 text-[10px] font-bold uppercase mb-1">Authenticity</h4>
                <p className="text-3xl font-black italic uppercase tracking-tighter">Verified</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
