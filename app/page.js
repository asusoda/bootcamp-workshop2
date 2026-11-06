// app/page.js
// The home page. This is the file your team replaces with your MVP.
//
// "use client" means this code runs in the browser, so it can use state and
// handle clicks. It must NEVER touch your API key. It only calls our own
// /api routes, and those routes talk to TinyFish on the server.
"use client";
import { useState } from "react";

// TODO(team): change these for your MVP
const DEFAULT_URL = "https://scrapeme.live/shop";
// TODO(team): change these for your MVP
const DEFAULT_GOAL = "Extract the first 3 product names and prices. Return JSON.";

// A run is over once it reaches one of these statuses.
const FINISHED = ["COMPLETED", "FAILED", "CANCELLED"];

// Small helper: wait for `ms` milliseconds.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  // ---- Agent form state ----
  const [url, setUrl] = useState(DEFAULT_URL);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  // ---- Search form state ----
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState([]);
  const [searchError, setSearchError] = useState("");

  // Runs when the agent form is submitted.
  async function runAgent(e) {
    e.preventDefault(); // stop the browser from reloading the page
    setResult(null);
    setRunning(true);
    setStatus("Starting...");

    try {
      // 1. Ask our server to start a run. It answers right away with a runId.
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal }),
      });
      const { runId, error } = await res.json();
      if (error) return setStatus("Error: " + error);

      // 2. Poll: check on the run every 3 seconds until it finishes.
      while (true) {
        await sleep(3000);
        const run = await (await fetch(`/api/agent/${runId}`)).json();

        // The status route itself failed (e.g. network or key problem).
        if (!run.status) return setStatus("Error: " + run.error);

        setStatus(run.status);
        if (FINISHED.includes(run.status)) {
          setResult(run.result ?? run.error);
          break;
        }
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setRunning(false); // re-enable the button whatever happened
    }
  }

  // Runs when the search form is submitted.
  async function search(e) {
    e.preventDefault();
    setSearchError("");
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    // Success = an array of results. Failure = { error: "..." }.
    if (Array.isArray(data)) {
      setHits(data);
    } else {
      setHits([]);
      setSearchError(data.error);
    }
  }

  return (
    <main>
      <h1>Our Hackathon App</h1>
      {/* TODO(team): replace this page with your MVP flow */}

      {/* ---------- Agent form ---------- */}
      <h2>Web agent (uses credits)</h2>
      <form onSubmit={runAgent} style={{ display: "grid", gap: 8 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Website URL"
        />
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
          placeholder="What should the agent do?"
        />
        <button disabled={running}>{running ? "Running..." : "Run agent"}</button>
      </form>
      <p>{status}</p>
      {/* JSON.stringify(..., null, 2) pretty-prints the result */}
      {result && (
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
      )}

      {/* ---------- Search form ---------- */}
      <h2>Web search (free)</h2>
      <form onSubmit={search} style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web"
          style={{ flex: 1 }}
        />
        <button>Search</button>
      </form>
      {searchError && <p>Error: {searchError}</p>}
      <ul>
        {hits.map((h) => (
          <li key={h.url}>
            <a href={h.url} target="_blank" rel="noreferrer">
              {h.title}
            </a>
            <br />
            <small>{h.snippet}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
