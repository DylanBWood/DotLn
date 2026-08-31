# WO-004 — Environment truth addendum (transports observed), v0.0.2

**Model:** any capable model.
**Depends on:** WO-001 (this order extends its deliverable under
`docs/discovery/`). Unblocks the v0.4.0 adapter choice, whose recommendation
currently rests on `documented locally` rows only.

**Cites (read these sections):** WO-001-environment-truth.md (authority model
and classification labels); docs/discovery/environment.md §Recommendations for
v0.4.0 and §Corrections and known gaps (the deferred-gap list this order
closes); 01-principles.md Principle 15; 06-roadmap.md v0.4.0.

**Objective:** Close the gaps WO-001 recorded and deliberately left open, so
the v0.4.0 transport recommendation rests on `observed` evidence: the two
candidate transport launch shapes exercised for real, MCP as a capability row,
full startup-context accounting, effective settings loading, and the
user-level `model` key. Timebox: ~45 min. Unknown remains an acceptable
result; every claim carries an epistemic label.

**Authority:** read-only inspection plus writes under `docs/discovery/` only.
One smoke invocation per transport shape IS permitted and required to attempt
— run from a normal authenticated session, not a network- or keychain-denied
sandbox (the established cause of WO-001's blocked rows). No package
installation, no config mutation, no secret values (env var and settings KEY
NAMES only), no rate-limit probing.

**Checklist (each item gets a classification):**
1. Claude CLI print transport observed end-to-end with the canonical launch
   shape: print mode, explicit model + effort, JSON output + schema, no
   session persistence, project+local setting sources, ambient auto-memory
   disabled. Record the exact command, the result envelope shape, and which
   flags behaved as their locally documented help states.
2. Codex CLI exec transport observed end-to-end: ephemeral, sandbox level,
   JSONL events, output schema, explicit model. Same recording duty.
3. MCP as a capability: `mcp`, `--mcp-config`, `--strict-mcp-config`,
   connected servers by name.
4. Startup-context accounting completed beyond `CLAUDE.md`: every auto-loaded
   category the `--safe-mode` help enumerates (skills, plugins, hooks, MCP
   servers, commands, agents, output styles, workflows, themes, keybindings),
   per file, line/byte metadata only.
5. Effective settings loading: which sources actually load and in what
   precedence (`--setting-sources`), including the managed/policy source and
   `~/.claude.json`; the user-level `model` key recorded (key names only).
6. `environment.json` gains a counterpart row for every finding, including
   the missing Codex feature-surface row.

**Deliverables:** a dated addendum section in `docs/discovery/environment.md`
(correction-log style, every command recorded) plus the updated
`environment.json`.

**Evidence gate:** every checklist item classified; the v0.4.0 recommendation
re-stated over `observed` rows (or explicitly re-labeled still
documented-only, with cause — an acceptable finding); 06-roadmap.md's v0.0.2
line already points at this order.

**Non-goals:** building adapters; benchmarking; rate-limit probing;
background/workflow/MCP transport prototypes; changing the ADR-0002 executor
decision; package/framework selection; work-machine anything.
