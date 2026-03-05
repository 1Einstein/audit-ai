export default async function ScraperPage() {
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  let displayData;

  try {
    const response = await fetch("https://api.scrapecreators.com/v2/instagram/user/info?handle=nike", {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 } // Standard Next.js 15 way to keep data fresh
    });

    if (!response.ok) {
      displayData = { error: `API responded with status: ${response.status}` };
    } else {
      displayData = await response.json();
    }
  } catch (err) {
    displayData = { error: "Failed to connect to the scraper API" };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Audit.AI Debug Mode</h1>
      <div style={{ background: '#eee', padding: '15px', borderRadius: '5px' }}>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    </div>
  );
}
