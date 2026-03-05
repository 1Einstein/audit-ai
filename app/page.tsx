export default async function ScraperPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  const targetUser = username || ""; // Starts empty for a clean look

  let displayData = null;

  if (targetUser) {
    try {
      const response = await fetch(`https://api.scrapecreators.com/v1/instagram/info?username=${targetUser}`, {
        headers: { 'x-api-key': API_KEY },
        next: { revalidate: 0 }
      });
      displayData = await response.json();
    } catch (e) {
      displayData = { error: "Failed to load data" };
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER / NAVIGATION */}
      <nav className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter">AUDIT.AI</h1>
        <div className="px-4 py-1 bg-zinc-900 rounded-full text-xs text-zinc-400 border border-zinc-800">
          Influencer Intelligence
        </div>
      </nav>

      {/* MAIN SEARCH INTERFACE */}
      <main className="max-w-4xl mx-auto pt-20 px-6 text-center">
        <h2 className="text-5xl font-bold mb-4 tracking-tight">Audit any creator.</h2>
        <p className="text-zinc-500 mb-10">Enter a handle to analyze engagement, fraud, and audience data.</p>

        <form action="/" method="GET" className="relative max-w-lg mx-auto mb-20">
          <input 
            name="username"
            placeholder="instagram_handle"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <button type="submit" className="absolute right-2 top-2 bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-zinc-200 transition-colors">
            Analyze
          </button>
        </form>

        {/* RESULTS SECTION */}
        {displayData && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h3 className="text-sm font-mono text-green-500 mb-4">// ANALYSIS COMPLETE</h3>
            <pre className="text-xs text-zinc-400 overflow-auto max-h-96 custom-scrollbar">
              {JSON.stringify(displayData, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
