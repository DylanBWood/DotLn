# WO-001 — Environment truth (bounded), v0.0.1

**Model:** any capable model.
**Depends on:** nothing (first executable work order).

**Objective:** Establish, with epistemic labels, what this personal machine
actually supports, so v0.1.0+ mechanism choices are evidence, not assumption.
This is the bounded inspection, not the comprehensive audit (that variant is
preserved in the ledger for wrapped/managed environments). Timebox: ~45 min.

**Authority:** Read-only inspection plus writes under `docs/discovery/` only.
One smoke invocation per model surface IS permitted (a trivial print-mode call
to verify structured output works) — that is inspection, not work. No package
installation, no config mutation, no secrets in output (env var NAMES only,
never values). Do not probe for rate limits by repeated invocation; report
only limits observed incidentally.

**Capability checklist (each item gets a classification):**
1. Toolchain: node, npm/pnpm/yarn, tsc, git (+ worktree behavior), sqlite3,
   available browsers / Playwright, localhost HTTP serving, OS/shell versions.
2. Claude Code surface *as installed*: version; print mode + JSON/schema
   output; **model and effort selection flags**; session persistence controls;
   auto-memory controls; subagents / workflows / background execution;
   worktree flag; hooks; settings sources actually loaded; startup-context
   accounting (what a fresh session auto-loads, by file, line/byte metadata
   only).
3. Codex CLI surface *as installed*: version; noninteractive mode; output
   formats; **model selection**; sandboxing; config file locations; AGENTS.md
   handling.
4. Classification labels: observed / documented locally / untested / blocked /
   not found / ambiguous. Unknown is an acceptable result.

**Deliverables:** `docs/discovery/environment.md` (human-readable, every
command recorded) + `docs/discovery/environment.json` (machine-readable).

**Evidence gate:** every checklist item above carries a classification; a
recommendation section names the first two WorkOrderTransport adapters to
build (v0.4.0), from observed evidence.

**Non-goals:** benchmarking, rate-limit probing, work-machine anything,
package/framework selection.
