# WO-161 implementation evidence

The [repair evidence](repair.md) records the current subject after VER-001.

Recorded 2026-09-25 for `resume: next`. The bounded implementation is complete
and ready for independent verification. This report is executor evidence, not a
verification verdict or final review.

## Result and decisions

Generated Contributor instructions and the compiler residue now defer execution
to host permission settings. Current documentation states the operator's
selected posture: sandboxes off in all three CLIs, with DotLn refusals and host
permissions defining the boundary. ADR-0003 records the dated amendment;
ADR-0004/0005 distinguish their historical procedures and cross-reference it.

The detector is `scripts/lib/host-confinement.mjs`, its export is
`detectHostConfinement`, and its CLI selector is `--confined-partial`. New
Contributor compilations name `contributor.bounded`. Existing effects, limits,
gate-row identities and historical evidence remain intact. Real discovery
Seatbelt behavior and the worker transport's `--sandbox workspace-write` remain
in use.

[Decisions D001–D005](decisions.md) record scope, alternatives, historical
compatibility, deterministic editions and the two assertion repairs found by
the first full review selection. The one adjacent item, the skeleton README's
authority label, is completed in the local queue after an actor-attested
message-boundary check-in. No pending adjacent item remains.

Goal-alignment outcome: the required cold-start surfaces no longer make the
false confinement or unconditional approval claims. Executable comparisons
preserve the evidence contracts and authority effects. This satisfies D001's
critical-path purpose without changing host settings or adding a refusal.
The single economy experiment kept the current bounded inventory approach;
its complete measured preparation/recording interval was 117.889 seconds
against a 120-second budget. No recurring time or token saving is claimed.

## Acceptance evidence

1. The exact grep transcripts are [before](sandbox-before.txt) and
   [after](sandbox-after.txt). The latter has no matches in `CLAUDE.md` or either
   installed skill root. [Before](vocabulary-before.json) and
   [after](vocabulary-after.json) inventories record the byte measurement.
2. README, the playbook, the security note, the docs index, product 07 and the
   three ADRs now distinguish the current posture from old confined-host
   procedures. The dated reaffirmation is 2026-09-25. Publication source locks
   and their checks pass.
3. Both actual-host detector observations are `{marker: null, inForce: false}`.
   The simulated confined fixture's [before](partial-before.json) and
   [after](partial-after.json) files are byte-identical: `checkId` and the
   evidence-reference suffix retain `npm test -- --inside-sandbox`, `needs`
   retains `outside-sandbox`, and partial/excluded/required suite fields remain
   identical. The renamed selector is a CLI change, not a persisted-row schema
   migration. Eleven focused runner cases passed, covering real confinement,
   simulated denial, unconfined selection, partial evidence and fixture cleanup.
4. All 129 authority files tracked at entry match their entry SHA-256 inventory;
   `historicalAuthorityChanged` is empty in the after inventory. The new writer
   test preserves the pre-existing allow/deny effects, three outside-write
   grants and one-writer limit. All five executor-support tests pass, including
   the current identity and both historical identities reconstructed by restoring
   only the three old labels. Process-debt tests retain the old snapshot chain
   while pinning the authorized new role output in a WO-161 fixture.
5. `npm run harness -- check` passes all 31 generated surfaces. The selected
   authority, artifact-identity, verification and carried feedback editions are
   new WO-161 editions; all four deterministic edition checks pass. The console's
   current self-host fixture is re-pinned. Older editions remain unchanged;
   feedback carries the existing live audit by reference, with no new live row.
   [Cold-start evidence](cold-start.json) shows every bounded role within its
   unchanged ceiling; the refuter has no configured ceiling.
6. The final product and documentation gates pass, as detailed below.
   `git diff --check` is clean.

The counts below apply identically to `.agents/skills` and `.claude/skills`.
Cold start means UTF-8 source bytes of `CLAUDE.md` plus the selected skill.
“Sandbox-line bytes” counts entire matching lines, including line endings;
it is not the number of bytes removed or a token estimate.

| Role | Total bytes before | Total bytes after | Sandbox-line bytes before | After |
| --- | ---: | ---: | ---: | ---: |
| Executor | 25,819 | 25,789 | 1,350 | 0 |
| Verifier | 22,698 | 22,592 | 1,811 | 0 |
| Reviewer | 23,780 | 23,674 | 1,811 | 0 |
| Release close | 14,649 | 14,632 | 150 | 0 |
| Planner | 16,797 | 16,780 | 150 | 0 |
| Refuter | 16,372 | 16,355 | 150 | 0 |

## Executed checks and release preparation

| Check | Observed result |
| --- | --- |
| First `npm test -- --review` | 35 passed, 2 failed; 579.301 s. The failures exposed the stale role-output snapshot and old current-graph hash assertion; D005 records their repairs. |
| `npm test -- --only process-debt` after repair | 2 suites passed; 70.34 s. |
| Final `npm test` | 27 suites passed, zero failed; 302.442 s; 71 fresh tasks. Recorded 2026-09-25T17:09:42.661Z. |
| `npm run test:docs` | 21 suites passed, zero failed; 26.98 s; 21 fresh tasks. |
| Harness, four current edition checks, harness-context, plan, meta, publication and release surfaces | Passed. |
| Final whitespace/diff check | Passed. |

The successful product row records code identity
`e6f9dfe0721b10d775090a917a0b2ab50b2794fdeb09fcb4e35adfc7e638a300`
and tree `055a94991a9cae69d153c5d11e43381e433b96db`.
Its receipt remains in ignored `docs/control/local/harness/checks.json`.
The first review-selection failures are preserved there; they are not reported
as a passing review gate. Subsequent changes were the required assertion
repairs and reporting. Final review still runs its own required selection.

`npm run release -- prepare --local` prepared application v0.50.0 under the
existing minor classification, compiler 0.19.1 and skeleton 0.43.0, including
dependent workspace pins. `npm run release -- check-surfaces --local` passes.
The work-order heading uses the required trailing version syntax. No branch
commit, push, pull request, package publication or host-setting change was made.

## Actor, observations and limits

Session readback identifies `codex-cli` 0.157.0, `gpt-6-astra`, effort `ultra`,
source `codex-session-readback`. The lifecycle normalizes that spelling to xhigh
with subagents mode while retaining the raw input. One read-only audit worker
was used and reused, with no descendants; it found no outstanding defect in
its final review. The root remained the sole writing agent. Codex's lack of a
spawn hook means the harness's observed zero admissions is not proof of zero
agents; the explicit session count is one against the cap of twenty, with
unobserved coverage unknown.

Codex dispatch established the session but did not automatically reserve the
writer. The explicit generated pre-tool adapter subsequently reserved this
same session at 16:52:41.909Z. Its shell-ancestor liveness became unavailable;
the reservation remained owned by this session and no foreign writer was
observed. This report does not claim automatic hook enforcement or continuous
registered ownership before that observation. The completion command is
responsible for release, and the handoff response reports the resulting state.

Usage at entry was 38,037 tokens from the Codex transcript counter, scoped to
this dispatch. The final usage observation belongs in ignored receipts and the
handoff response, with its actual cutoff; monetary cost is unknown. Source
and hand-written outputs were read and reviewed; generated outputs were
validated by their deterministic checks. The report's evidence cutoff is the
completed checks above. Independent verification and final review remain the
next separately dispatched roles.
