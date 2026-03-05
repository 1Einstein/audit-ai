export default async function ScraperPage() {
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  
  // This fetches data for the 'nike' instagram handle as a test
  const response = await fetch("https://api.scrapecreators.com/v2/instagram/user/info?handle=nike", {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    cache: 'no-store' 
  });

  const data = await response.json();

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Audit Results</h1>
      <div style={{ marginTop: '20px', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <p><strong>Status:</strong> {response.status === 200 ? "✅ Connected" : "❌ Error"}</p>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </main>
  );
}
