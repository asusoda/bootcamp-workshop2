# SoDA Hackathon Starter

A working Next.js app that already talks to TinyFish (a web agent API).
Your job: turn `app/page.js` into your team's MVP, then ship it to AWS.

## 1. Open it (2 min)
1. Click **Fork** (top right of this repo) to copy it to your account. One teammate does this.
2. Add teammates to your fork: **Settings → Collaborators**.
3. In your fork, click **Code → Codespaces → Create codespace on main**. `npm install` runs for you.

## 2. Add your TinyFish key (2 min)
1. Get a key at https://agent.tinyfish.ai/api-keys (it is shown once, copy it).
2. GitHub → **Settings → Codespaces → New secret**
   - Name: `TINYFISH_API_KEY`  Value: your key  Repository: your fork
3. Back in the Codespace: **Ctrl/Cmd+Shift+P → Codespaces: Rebuild Container** (or just restart it).

## 3. Run it (1 min)
```
npm run dev
```
Open the forwarded port 3000. Try **Web search** (free) and **Run agent** (uses credits).

## 4. Build your MVP with Copilot
Open Copilot Chat → **Agent** mode. One slice per prompt:

> Build [feature] for [user]. Done when [visible result]. Only touch [files].

Run it, click it, read the diff, then commit:
```
git add . && git commit -m "slice: [feature]" && git push
```

## 5. Ship to AWS Amplify (10 min)
1. AWS Console → **Amplify → Create new app → GitHub** → pick your fork, branch `main`.
2. **Advanced settings → Environment variables**: `TINYFISH_API_KEY` = your key.
3. **Save and deploy**. `amplify.yml` in this repo already has the build steps.
4. Open the `amplifyapp.com` URL on your phone. Every `git push` redeploys.

## What's where
| File | What it does |
|---|---|
| `app/page.js` | The page. **Replace this with your MVP.** |
| `app/api/search/route.js` | TinyFish Search, free |
| `app/api/agent/route.js` | Starts a TinyFish agent run (1 credit per step) |
| `app/api/agent/[id]/route.js` | Checks if the run finished |
| `lib/tinyfish.js` | TinyFish client + `MAX_STEPS` credit cap |
| `amplify.yml` | AWS Amplify build settings |

## Save your credits
- Search is free. Use it first.
- Agent runs cost 1 credit per step. `MAX_STEPS` is 15. Keep goals short and specific.
- Never put your key in a `"use client"` file or commit it to GitHub.
