// app/api/search/route.js
// FREE: TinyFish Search. No credits used.
//
// Try it in your browser:  /api/search?q=hackathon ideas
import { getTinyFish } from "@/lib/tinyfish";

export async function GET(request) {
  // Read the "q" value from the URL, e.g. /api/search?q=pizza
  const query = new URL(request.url).searchParams.get("q");

  // 400 = "bad request": the caller forgot to send a query.
  if (!query) {
    return Response.json({ error: "Add ?q=your search" }, { status: 400 });
  }

  try {
    const data = await getTinyFish().search.query({
      query,
      location: "US",
      language: "en",
    });

    // Each result looks like { title, url, snippet, ... }. We only send back the top 5.
    return Response.json(data.results.slice(0, 5));
  } catch (err) {
    // 500 = "server error": something went wrong (missing key, network, etc.)
    return Response.json({ error: err.message }, { status: 500 });
  }
}
