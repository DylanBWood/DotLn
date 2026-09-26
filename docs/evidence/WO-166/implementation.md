# WO-166 implementation evidence

Recorded 2026-09-26 for `resume: next`. This is the executor's result, ready for independent verification; it is not a verification verdict or final review.

## Delivered

The five Codex lifecycle dispatches reserve a writer before their control transition. A verified Codex ancestor owns the reservation; an unresolved chain records a pid-less thread owner with unknown liveness. Executor, verifier and reviewer completions release the same actor after the durable result. Release-close reserves the main control-plane worktree, where its helper runs, and releases only after a successful `--publish` close. A foreign holder refuses a dispatch before its event and receives the actor prefix, owner, reservation time, age and operator release command. A missing reservation runtime refuses the dispatch.

`node scripts/harness.mjs evidence --wait [--timeout <seconds>]` terminates when the live markers clear and prints the newest current-tree check row. Its exit code follows the invocation outcome: 0 pass, 1 fail, 2 timeout or no row. The ignored outcome record is keyed after deterministic evidence preparation, so a failed npm row followed by a passing diff row remains a failure. Session start reports an override left open in the same physical worktree once; an analysis pause or cwd move does not reattribute it. The two role-text sentences are 312 UTF-8 bytes and appear in every cold-start profile. The compiled harness emitted 31 surfaces.

The fixture drives a real `npm run resume -- next` chain and all five role dispatches. It observes a live Codex-host owner or an unknown-liveness pid-less thread, refuses a foreign verifier before its control event, and checks each completion release. The release helper fixture retains ownership on failed close and dry-run and releases it on successful publish. Gate-wait fixtures cover pass, failed invocation with a later passing row, timeout, no row, and a preparation change to the checked tree. Override fixtures cover a same-worktree start, another worktree, a moved-cwd analysis pause, a subdirectory entry, and exit. The carried-feedback source fixture resolves the original live audit through `edition.liveAudit.edition`.

Product 07 records the implemented stale-writer behavior pending independent review. The follow-up register's three named rows remain for closeout retargeting at the later role. The local adjacent queue is revision 0 with no items. [Decisions D001–D006](decisions.md) retain the design choices, rejected alternatives, experiment decision, two corrections and reopening conditions. The goal-alignment result is a dispatch-to-completion writer boundary with no manual mid-phase reserve; the conservative operator-release route remains for a killed session whose liveness cannot be established. The separate economy experiment was declined before execution because it could not replace either required gate; no savings are claimed.

## Evidence and release

The final selected editions in [current.json](../current.json) are authority WO-166/004, artifact identity WO-166/001, verification WO-166/001 and feedback WO-166/002. All four selected checks pass. Feedback 002 carries the WO-070 live audit through feedback 001; no live episode ran. Earlier WO-166 authority revisions 001–003 and feedback 001 remain on disk as earlier observations. The console self-host manifest and three expected renders were re-pinned to the selected edition, and all five console fixture views pass.

The [cold-start measurement](cold-start.json) compares the installed skills with `v0.52.1`: executor 25,759→26,072, verifier 22,562→22,875, reviewer 23,644→23,957, release-close 14,668→14,981, planner 16,816→17,129 and refuter 16,391→16,704 bytes. Each rises 313 bytes. All configured ceiling verdicts remain `within`; refuter remains `unset`. This applies identically to the `.agents` and `.claude` installed skill roots.

The prepared application version is patch `v0.52.2`. Compiler is 0.19.2 and skeleton 0.44.2; the console's exact workspace pins and lockfile follow. `release prepare --local` and `release check-surfaces --local` pass. The lockfile diff changes only workspace versions and pins; no external dependency was added. Publication locks pass. No branch commit, push, PR, deployment, package publication or account-setting change was made.

## Checks and corrections

| Check | Observed result |
| --- | --- |
| Preliminary `npm test` | Stopped by this session after 57.7 s, before a check row, when read-only audit found release-close and gate-outcome defects. Those defects were fixed and covered by focused fixtures. |
| First completed `npm test` | 27 suites passed, 1 failed in 315.44 s. The compiler's embedded package version still said 0.19.1 after its manifest moved to 0.19.2; D005 records the error and correction. |
| `npm run test:docs` attempts | First found seven unformatted edited files; second found my unnecessary change to the planning-bound Cost declaration; third found the work-order index stale after restoring that declaration. D006 records the authority re-mint after formatting. The Cost text was restored exactly; D005 holds the factual correction. |
| Final `npm run test:docs` | 21 suites passed, 0 failed in 26.53 s after this report and the refreshed process meter. |
| Final `npm test` | 28 suites passed, 0 failed in 314.16 s; 72 fresh tasks. Current-tree `npm test` row: `host-gate:02c1f206eb181fa2b107162d0554021a3d0f187225b522f2b99882d3c3918c03:npm test`, recorded 2026-09-26T20:28:33.794Z, tree `5d4c919f500b2a4229a815eb8417b32b4f03d624`. `evidence --wait --timeout 0` returned that row with exit 0. |
| Other final checks | Harness check (31 surfaces), four edition checks, five console fixtures, release surfaces, publication, cold-start measurement, and `git diff --check` passed. |

The operator challenged the avoidable sequence of early evidence editions. The earlier failed checks and editions are preserved above and in D005–D006; no failure is presented as a pass. The final product gate is for the corrected source. Its receipt and usage measurements remain in ignored local harness records; the committed report preserves their identities and results. An independent verifier must judge the actual current tree, including the release-close fixture's synthetic writer adapter and the main-worktree reservation route.

## Actor and process cost

The Codex session readback reports CLI 0.157.1, `gpt-6-sol`, effort `ultra` (lifecycle-normalized `xhigh`), source `codex-session-readback`. Two read-only auditors were used and reused with no descendants; the root was the sole writing agent. The explicit count is 2 of the cap of 20. The Codex harness observed 0 subagent admissions because its spawn hook is absent; unobserved coverage remains unknown.

At 2026-09-26T20:28:46.797Z the Codex transcript counter reported 37,419,002 total tokens, including 36,980,992 cached input tokens, scoped to this dispatch; dollar cost is unknown. The current writer observation is a live `codex-host` reservation for this session. The `implementation-ready` transition is responsible for releasing it, and the handoff must inspect its result. Independent verification and final review remain separate dispatches.
