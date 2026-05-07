/* ── Routing demo data ──────────────────────────────────── */

const ROUTES = {
  "hermes-pref": {
    system: "hermes",
    label: "Hermes Local Memory",
    reason: "Behavioral preference detected — store locally for this agent.",
    action: `→ Writing to: ~/.hermes/memories/USER.md

type: user
content: "Prefer tabs over spaces in this project."

→ Memory saved locally (0ms network latency)
→ Next session in this project will auto-apply this preference.`,
    timing: "Local write: <1ms | No network call"
  },

  "hermes-correction": {
    system: "hermes",
    label: "Hermes Local Memory",
    reason: "Agent behavior correction — persist as feedback memory.",
    action: `→ Writing to: ~/.hermes/memories/MEMORY.md

type: feedback
description: Don't add comments explaining obvious code
Why: User correction from 2026-05-07
How to apply: On all future edits in this project

→ Feedback memory saved locally
→ Agent will suppress obvious code comments going forward.`,
    timing: "Local write: <1ms | No network call"
  },

  "supabase-fact": {
    system: "supabase",
    label: "Open Brain Vector Memory",
    reason: "Recall of a past project decision — query shared vector store.",
    action: `→ Embedding query: "API auth strategy decision"
→ Searching pgvector store (cosine similarity ≥ 0.78)

  Match (0.94): "Auth migration uses JWT rotation with
  15-min expiry. Refresh tokens stored httpOnly.
  Decided 2026-04-28 in architecture review."

→ Source: project_decision | Project: core-api
→ API key: [REDACTED]
→ Retrieved 1 high-confidence result from shared memory.`,
    timing: "Embedding: ~120ms | Vector search: ~45ms | Total: ~165ms"
  },

  "session-recall": {
    system: "session",
    label: "Session Search",
    reason: "Reference to a past debugging session — search Hermes transcript index.",
    action: `→ Full-text search: "bug debugged last Tuesday"
→ Scanning Hermes local SQLite transcript index

  Match (0.91): "The timeout bug was caused by the
  connection pool not releasing sockets under
  high load. Fixed by adding idle_timeout_ms = 5000."

→ Session ID: sess_2026-05-02_a3f8
→ Found in transcript at 14:32 UTC`,
    timing: "SQLite index scan: ~60ms | Rank: ~20ms | Total: ~80ms"
  },

  "tasks-create": {
    system: "tasks",
    label: "Google Tasks",
    reason: "Actionable to-do with a deadline — create a tracked task.",
    action: `→ Creating Google Task:
  Title:    "Update deploy docs"
  Due:      2026-05-09 (Friday)
  Notes:    "Requested during agent session 2026-05-07"
  List:     "Agent Tasks"

→ Task created via Google Tasks API
→ Task ID: task_7b2c...
→ Confirmation: Task "Update deploy docs" added to your list.`,
    timing: "API call: ~220ms | Synced to Google Tasks"
  },

  "skills-run": {
    system: "skills",
    label: "Hermes Skills",
    reason: "Named skill invocation — load and execute procedure.",
    action: `→ Loading skill: "PR Review"
→ Location: ~/.hermes/skills/pr-review.md

  Steps:
  1. Detect current branch & diff
  2. Parse changed files
  3. Run lint/type checks
  4. Summarize changes
  5. Flag potential issues

→ Executing on branch: feature/auth-migration
→ Skill loaded from local file, no network call needed.`,
    timing: "Skill load: <1ms | Execution varies by skill"
  },

  "multi-route": {
    system: "multi",
    label: "Multi-Route",
    reason: "Status query requires context from multiple systems.",
    action: `→ Querying 3 systems in parallel:

  [Hermes]    → Local project config for auth migration
              Found: "Use JWT strategy, not session cookies"

  [Open Brain]→ Vector search "auth migration status"
              Found: "Migration 70% complete, JWT rotation
              done, refresh token flow in progress."

  [Session]   → Search recent transcripts for "auth migration"
              Found: "Last discussed 2026-05-05 — blocking
              on cookie-domain config for staging."

→ Merged 3 results into unified response.
→ All queries ran concurrently.`,
    timing: "Hermes: <1ms | Open Brain: ~165ms | Session: ~80ms | Total: ~170ms (parallel)"
  }
};

/* ── Interactive demo logic ─────────────────────────────── */

function initDemo() {
  const buttons = document.querySelectorAll(".prompt-btn");
  const resultBox = document.getElementById("result-box");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.prompt;
      const route = ROUTES[key];
      if (!route) return;

      // Update active button
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Build result HTML
      const dotClass = route.system === "multi" ? "supabase" : route.system;
      resultBox.innerHTML = `
        <div class="result-route ${dotClass}">
          <span class="route-dot"></span>
          <span>→ ${route.label}</span>
        </div>
        <div class="result-detail">${route.action}</div>
        <div class="result-timing">${route.timing}</div>
      `;
    });
  });
}

/* ── Scroll-triggered reveal ────────────────────────────── */

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── Nav scroll state ───────────────────────────────────── */

function initNav() {
  const nav = document.querySelector("nav");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        nav.classList.toggle("scrolled", window.scrollY > 32);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Init ───────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  initDemo();
  initReveal();
  initNav();
});
