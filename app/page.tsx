import { AuditResult } from "./types"; // Assuming types are here

export default async function ScraperPage() {
  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";
  
  // This is the actual command that "pulls" the data
  const response = await fetch("https://api.scrapecreators.com/v2/instagram/user/info?handle=nike", {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    cache: 'no-store' // Forces Next.js 15 to get fresh data every time
  });

  const data = await response.json();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Audit Results</h1>
      <pre className="bg-gray-100 p-5 rounded mt-5">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
