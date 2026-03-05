if (targetUser) {
    try {
      // Updated headers to bypass "Network Connection Failed"
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
      // Detailed logging to see if it's a timeout or a block
      errorDetail = "Connection Blocked: Scraper rejected the Vercel server request.";
    }
  }
