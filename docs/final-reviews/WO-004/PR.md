## What this merges

WO-004's three deliverable groups, verified as one subject:

- **Environment truth addendum** (`docs/discovery/`): the gaps WO-001
  deliberately deferred, closed with `observed` evidence — both candidate
  transport launch shapes exercised end-to-end (Claude CLI print, Codex CLI
  exec) with exact commands and envelope shapes recorded, MCP as a capability
  row, full startup-context accounting for every `--safe-mode` category,
  effective settings loading and precedence (key names only), and a
  counterpart `environment.json` row for every finding. The v0.5.0 transport
  recommendation now rests on observed rows.
- **Lifecycle and release hardening** (`scripts/`): the guarded
  `release close` helper — refusal fixtures for eleven failure shapes with no
  refusal path pushing a tag, a success fixture that binds the generated
  manifest and layered notes into one annotated tag under the explicit
  `--publish` form, and validator mutations failing independently per field
  class. Both authorized pushes now carry `--no-follow-tags` with exact
  remote-ref proof (VER-001's blocking finding, closed and mutation-tested).
  `worktree publish` selects the ordinary or one-time WO-004 bootstrap
  handoff from actual main-checkout capability; `resume: next` carries both
  phase meanings; a failed checkpoint fails closed instead of advertising a
  stale destructive restore.
- **Version and documentation synchronization** (ideation batch 003): the
  dated forward retiming map (`v0.2.1` … `v0.10.0`), a public-front-door
  README that separates shipped from planned, and the skeleton banner
  restated as component identity (`@dotln/skeleton v0.2.0`).

## Evidence

- `npm test`: five shell suites (backup-intake, resume, checkpoint, worktree,
  release) plus 68/68 node tests, exit 0 — re-established at final review,
  three runs.
- `npm run skeleton`: component banner and the receipt
  `verified=true candidates=1`.
- The suite mutates no tracked or untracked file (status hash identical
  before/after).

## Verification trail

- `docs/verifications/WO-004/VER-001.md` — fail; one blocking defect (both
  authorized pushes could publish unrelated local tags), twelve non-blocking
  findings.
- Repair + `docs/verifications/WO-004/HARDENING-001.md` — implementer
  hardening receipt, honest about its during-repair timing.
- `docs/verifications/WO-004/VER-002.md` — pass; closure of the blocking
  defect verified four ways, six non-blocking findings (G1–G6) recorded.
- `docs/final-reviews/WO-004/FINAL-001.md` — pass; one major
  report-completeness finding adjudicated, two bounded wording corrections
  applied with the suite rerun.

## Known open items

Non-blocking findings are enumerated in VER-002 and FINAL-001 and carried,
not restated here — the largest are the untested ordinary release-handoff arm
(G3), the discovery JSON's undeclared two-tier encoding (G6), and the deferred
checkpoint retention/recovery root cause (O-a). After this merges,
`resume: release close` runs the **one-time WO-004 bootstrap**: use the exact
command `worktree publish` printed, since pre-merge main has no `release`
script. Tagging `v0.2.1` happens only under that separately authorized phrase.
