# Open Brain Memory Demo

A static demo website showing how Hermes Agent's built-in memory, Open Brain shared-agent memory, and session search work together as a unified memory layer for AI agents.

No build step — just HTML, CSS, and vanilla JS.

## Local Preview

Option A — Python (built-in):

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

Option B — Node:

```bash
npx serve .
# Open http://localhost:3000
```

## GitHub Pages Deployment

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose **main** branch, root (`/`), and click **Save**.
5. Your site will be live at `https://<username>.github.io/<repo>/` within a minute or two.

No build pipeline needed — the root directory contains the complete static site.

## Project Structure

```
index.html   — Page structure, sections, sample memory payloads
styles.css   — Dark theme, responsive layout, animations
script.js    — Interactive routing demo, scroll reveal, nav state
```

## Memory Systems Covered

| System | Storage | Access |
|---|---|---|
| Hermes Local Memory | `~/.hermes/memories/` | File-based, private |
| Hermes Skills | `~/.hermes/skills/` | Local procedures |
| Session Search | Hermes local SQLite transcript index | Full-text recall |
| Open Brain Vector Memory | Supabase pgvector | Shared, semantic search |
| Google Tasks | Google Tasks API | Actionable to-do items |
