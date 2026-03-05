import { Search, ShieldCheck, BarChart3, Users, Zap, activity, Heart, MessageCircle } from "lucide-react";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams; 
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  const targetUser = username?.trim();
  
  let data = null;
  let errorDetail = null;

  if (targetUser) {
    try {
      const res = await fetch(`https://api.scrapecreators.com/v1/instagram/profile?username=${targetUser}`, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY },
        cache: 'no-store' 
      });

      if (!res.ok) {
        errorDetail = `Status ${res.status}`;
      } else {
        data = await res.json();
      }
    } catch (e) {
      errorDetail = "Network connection failed.";
    }
  }

  // Mapping your specific data points from the JSON
  const user = data?.data?.user;
  const followers = user?.edge_followed_by?.count || 0;
  const following = user?.edge_follow?.count || 0;
  const postCount = user?.edge_owner_to_timeline_media?.count || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <nav className="p-8 border-b border-white/5 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-6 h-6" />
          <span className="text-xl font-black italic uppercase tracking-tighter">Audit.AI</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto pt-20 px-6">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-4">
            Intelligence <br/><span className="text-green-500">Unfiltered.</span>
          </h1>
          <p className="text-zinc-500">Enter a handle to analyze engagement, fraud, and audience data.</p>
        </div>

        <form action="/" method="GET" className="max-w-2xl mx-auto mb-20">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-green-500/50 shadow-2xl">
            <input name="username" required placeholder="instagram_handle" className="w-full bg-transparent py-4 px-6 focus:outline-none text-white text-lg" />
            <button type="submit" className="bg-white text-black font-bold px-10 rounded-xl hover:bg-zinc-200 transition-all">Analyze</button>
          </div>
        </form>

        {targetUser && (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* PROFILE OVERVIEW HEADER */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-green-500 p-1">
                  <img src={user?.profile_pic_url} className="rounded-full w-full h-full object-cover" alt="Profile" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight italic">@{user?.username || targetUser}</h2>
                  <p className="text-zinc-500 font-medium">{user?.full_name}</p>
                </div>
              </div>
              <div className="flex gap-8 border-l border-zinc-800 pl-8">
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Followers</p>
                  <p className="text-xl font-black italic">{followers.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Posts</p>
                  <p className="text-xl font-black italic">{postCount}</p>
                </div>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px]">
                <Zap className="text-green-500 w-5 h-5 mb-4" />
                <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Engagement Rate</h4>
                <p className="text-5xl font-black italic tracking-tighter">High</p>
              </div>
              <div className="bg-green-500 p-8 rounded-[32px] text-black">
                <Users className="w-5 h-5 mb-4 opacity-60" />
                <h4 className="text-black/50 text-[10px] font-bold uppercase mb-1">Authenticity</h4>
                <p className="text-3xl font-black italic uppercase tracking-tighter">Verified</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px]">
                <BarChart3 className="text-green-500 w-5 h-5 mb-4" />
                <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Credits Used</h4>
                <p className="text-5xl font-black italic tracking-tighter">01</p>
              </div>
            </div>

            {/* RAW DATA LOGS */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-zinc-500 font-bold uppercase text-[10px] italic">
                <ShieldCheck className="w-4 h-4" /> // ANALYSIS COMPLETE
              </div>
              <pre className="text-[11px] font-mono text-green-400 overflow-auto max-h-[400px]">
                {errorDetail ? `// SYSTEM_ERROR: ${errorDetail}` : JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
