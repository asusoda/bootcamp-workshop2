// app/api/agent/route.js
// USES CREDITS: starts a TinyFish web agent run (1 credit per step).
//
// We "queue" the run instead of waiting for it to finish. That returns a
// runId right away, so this request never hits a serverless timeout.
// The page then checks on the run using /api/agent/[id].
import { getTinyFish, MAX_STEPS } from "@/lib/tinyfish";

export async function POST(request) {
  // The page sends JSON like { "url": "https://...", "goal": "..." }
  const { url, goal } = await request.json();

  if (!url || !goal) {
    return Response.json({ error: "Send { url, goal }" }, { status: 400 });
  }

  try {
    const queued = await getTinyFish().agent.queue({
      url, // the website the agent starts on
      goal, // plain-English instructions for the agent
      agent_config: { max_steps: MAX_STEPS }, // credit cap
    });

    // TinyFish returns either { run_id } or { error: { message } }
    if (queued.error) {
      return Response.json({ error: queued.error.message }, { status: 502 });
    }

    return Response.json({ runId: queued.run_id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
