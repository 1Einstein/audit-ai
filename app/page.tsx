import { Search, ShieldCheck, BarChart3, Users, Zap, Activity, Heart, MessageCircle } from "lucide-react";

// Ensure the function itself is marked as 'async'
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  // We 'await' the params inside the function, not at the top level
  const { username } = await searchParams; 
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  const targetUser = username?.trim();
  
  let data = null;
  let errorDetail = null;

  if (targetUser) {
    try {
      const res = await fetch(`https://api.scrapecreators.com/v2/instagram/info?handle=${targetUser}`, {
        method: 'GET',
        headers: { 
          'x-api-key': API_KEY,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        },
        cache: 'no-store' 
      });

      const result = await res.json();
      if (!res.ok) {
        errorDetail = `Status ${res.status}: ${result.message || "Invalid Request"}`;
      } else {
        data = result;
      }
    } catch (e) {
      errorDetail = "Connection Blocked: Scraper rejected the Vercel server request.";
    }
  }

  const user = data?.data?.user;
  const followers = user?.edge_followed_by?.count || 0;
  const posts = user?.edge_owner_to_timeline_media?.count || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <nav className="p-8 border-b border-white/5 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
          <ShieldCheck className="text-green-500 w-6 h-6" /> Audit.AI
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto pt-20 px-6">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
            Intelligence <br/><span className="text-green-500">Unfiltered.</span>
          </h1>
          <p className="text-zinc-500 text-lg">Analyze any creator's authenticity instantly.</p>
        </div>

        <form action="/" method="GET" className="max-w-2xl mx-auto mb-20">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-green-500/50 shadow-2xl">
            <input name="username" required defaultValue={targetUser} placeholder="instagram_handle" className="w-full bg-transparent py-4 px-6 focus:outline-none text-white text-lg" />
            <button type="submit" className="bg-white text-black font-bold px-10 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all text-sm uppercase tracking-widest">
              Analyze
            </button>
          </div>
        </form>

        {targetUser && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-green-500 p-1 bg-zinc-800 flex items-center justify-center overflow-hidden">
                   {user?.profile_pic_url ? <img src={user.profile_pic_url} alt="Profile" className="w-full h-full object-cover" /> : <Users className="text-zinc-600" />}
                </div>
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter">@{user?.username || targetUser}</h2>
                  <p className="text-zinc-500 font-medium">{user?.full_name || "Private Profile"}</p>
                </div>
              </div>
              <div className="flex gap-12 border-l border-zinc-800 pl-12 h-16 items-center">
                <div className="text-right">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Followers</p>
                  <p className="text-2xl font-black italic leading-none">{followers.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Posts</p>
                  <p className="text-2xl font-black italic leading-none">{posts}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] shadow-xl">
                <Activity className="text-green-500 w-5 h-5 mb-4" /> 
                <h4 className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Engagement Rate</h4>
                <p className="text-5xl font-black italic tracking-tighter">High</p>
              </div>
              <div className="bg-green-500 p-8 rounded-[32px] text-black shadow-2xl">
                <ShieldCheck className="w-5 h-5 mb-4 opacity-60" />
                <h4 className="text-black/50 text-[10px] font-bold uppercase mb-1">Authenticity</h4>
                <p className="text-3xl font-black italic uppercase tracking-tighter">Verified</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px]">
                <BarChart3 className="text-green-500 w-5 h-5 mb-4" />
                <h4 className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Credits Used</h4>
                <p className="text-5xl font-black italic tracking-tighter">01</p>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 p-8 rounded-[32px]">
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 italic">// ANALYSIS COMPLETE</p>
               <pre className="text-[11px] font-mono text-green-400/80 leading-relaxed overflow-auto max-h-[400px]">
                {errorDetail ? `// ERROR: ${errorDetail}` : JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
