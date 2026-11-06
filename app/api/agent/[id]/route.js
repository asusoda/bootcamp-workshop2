// app/api/agent/[id]/route.js
// Checks on a run. The page calls this every 3 seconds until the run finishes.
//
// The [id] folder name means this route matches /api/agent/<anything>,
// and that <anything> shows up as params.id.
import { getTinyFish } from "@/lib/tinyfish";

export async function GET(_request, { params }) {
  // In Next.js 15, params is a Promise, so we await it.
  const { id } = await params;

  try {
    const run = await getTinyFish().runs.get(id);

    // status is one of: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
    return Response.json({
      status: run.status,
      result: run.result, // the agent's answer (when COMPLETED)
      error: run.error?.message ?? null, // what went wrong (when FAILED)
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
