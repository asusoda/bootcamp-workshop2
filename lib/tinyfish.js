// lib/tinyfish.js
// One place to create the TinyFish client. Every API route imports from here.
//
// SERVER-ONLY: never import this file into a "use client" component.
// If you do, your secret API key could end up in the browser.
import { TinyFish } from "@tiny-fish/sdk";

// Returns a ready-to-use TinyFish client.
// We check for the key ourselves so beginners get a helpful message
// instead of a confusing stack trace.
export function getTinyFish() {
  if (!process.env.TINYFISH_API_KEY) {
    throw new Error(
      "TINYFISH_API_KEY is missing. Add TINYFISH_API_KEY as a Codespaces secret, then restart the codespace."
    );
  }
  // new TinyFish() automatically reads TINYFISH_API_KEY from the environment.
  return new TinyFish();
}

// Agent runs cost 1 credit per step. This caps how many steps one run can take.
// Keep it low while you test so you don't burn through your credits.
export const MAX_STEPS = 15;
