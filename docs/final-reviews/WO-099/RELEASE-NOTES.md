## Release overview

DotLn now supervises work while it runs, not only before and after it. A `mission-check` episode reads the active work order's contract, the current diff, the recent decisions and the vision theses, and returns a typed verdict: `on-mission`, `drift` or `unknown`. When it finds drift it holds every unattended dispatch and records one correction event, and only a human answer or a fresh passing judgment over changed work releases the hold. The resident fires it on a cadence, so this runs with nobody at the terminal.

This matters to anyone who leaves an agent working unattended. Until now the failure mode was silent: work could wander outside its declared surfaces, or away from what the project is for, and nothing noticed until a human read the diff. The cadence turns that into a stop.

## Read before upgrading

The hold is fail-conservative and it will stop dispatch. A `drift` or `unknown` verdict refuses every phase actor except the mission check itself. Clearing it requires a human answer, or a fresh `on-mission` judgment over a capsule whose hash differs from the held one — a re-judgment of the same bytes is refused by design. Plan for a held resident to wait rather than to continue.

The Contributor build has a new saved identity. Adding the mission-check presence policy changes its semantic hash from `fnv1a64:06245f5c581212f1` to `fnv1a64:87aa6e1263d6d74d`, and the live test pin moves with it. The pre-WO-099 graph is retained as `contributorLoadoutBeforeMissionCheck` and both identities compile in one authority-evidence run, so historical receipts are not rewritten.

A new correction event type exists. `MissionDriftObserved` is the first non-operator producer of a correction. It does not retire a feedback unit, confers no decision authority, and leaves the four typed operator signals, their reactor and their policy unchanged.

Privacy boundary, stated explicitly because it is easy to get wrong: ignored material is detected but never exported. The ignored inventory is pinned as salted SHA-256 path ids plus lstat metadata hashes. Ignored names, ignored bytes and the per-pin salt never cross the model boundary. Clean-room intake, environment files and operator-owned settings are not read into the capsule.

No migration step is required, and no schema version changes. One episode kind, one event type, one hold rule.

## Substantive changes

**Mission-check episode and protocol.** A read-only inspection profile whose capsule is pinned at actor declaration, completed with a dispatch-time observation, and hashed whole, so a contract edited mid-episode still differs from its pin. The host derives the verdict from supported findings rather than trusting the worker: proved structural drift is added whatever the model returns, an unsupported finding refuses the whole result into `unknown`, and a claimed drift that names nothing is `unknown`. A judge that restates a host-derived finding keeps the host's proof in the hold and in the correction record. A failed model episode no longer erases host-proved drift.

**Capsule completeness.** Every changed path is named, tracked or untracked, or the observation refuses. Diff text is carried a whole path at a time, with unfitted paths listed in `omittedPaths`, and no `on-mission` verdict can be recorded while that list is non-empty. Reads stay inside the canonical worktree; an untracked symlink is represented as a link rather than followed. A decision history that exists but cannot be carried is named, with no pass certified over it.

**Resident hold and cadence.** `dispatchHeld` in the resident slice refuses every phase actor except the mission check, and the refusal names the hold. The resident appends `MissionHoldCleared` itself when an admitted `on-mission` covers a capsule the held judgment did not. A `mission-check` cadence is added to the Contributor presence policy, and the episode holds `repo.read` as its only effect, so the cadence runs inside the build's existing base authority.

**First unattended judgment.** The operator ran one live row with no terminal attached and away before and after: a Codex `gpt-6-astra` episode judged a session whose diff edited a file outside its declared surfaces, returned `drift` over two findings, raised the hold, recorded one correction, refused the next dispatch, and released on the human answer, in 18.8 s. `runtime.resident` moves to demonstrable, live-evidenced.

## Progressive polish

Internal component bump of `@dotln/skeleton` to `0.33.0` with the matching console pin, regenerated harness surfaces and manifest hashes, a pure SHA-256 extracted into `sha256.ts` and reused for the capsule hash with `discoveryOutputSha256` behaviour byte-identical, and the routine regenerated documentation indexes. No dependency was added, removed or re-ranged. Full detail is in the diff rather than here.

## Evidence and compatibility

Source tag `v0.37.0`, over the published baseline `v0.36.0`, retimed from the collided unpublished `v0.36.0` target under the order's existing minor classification; scope, acceptance and component versions are unchanged by that retiming. `@dotln/skeleton` ships at `0.33.0`.

Verification result: six independent judgments, [VER-001](../../verifications/WO-099/VER-001.md) through [VER-005](../../verifications/WO-099/VER-005.md) failing and [VER-006](../../verifications/WO-099/VER-006.md) passing, each repair carrying its own regression. Final review is [FINAL-001](FINAL-001.md). The product gate at final review passed 29 suites, 0 failed, in 431.44 s over 73 fresh tasks, with `git diff --cached --check` clean. A fresh feedback evidence edition (WO-099 revision 005) and authority edition (revision 004) were minted because runtime source changed.

Known limitations, stated as the capability row states them: one synthetic worktree and one planted drift, a single 18.8 s live observation whose structural finding was host-derived, no unattended hour ([WO-111](../../work-orders/WO-111-unattended-live-proof.md)), and no repair loop (WO-055, WO-100). A judgment is an observation about a diff, never verification of the work, and this release makes no dependable-scope claim.

One known harness defect, recorded and not fixed here: process-cost token counters are structurally unavailable on `codex-cli`, because no Codex path begins the harness session that the counter requires, so Codex-run reports record `unknown; cause no-session` while Claude-run reports carry real figures. It is boarded up as [WO-099-D035](../../evidence/WO-099/decisions.md#wo-099-d035) with a named follow-up and needs its own work order.
