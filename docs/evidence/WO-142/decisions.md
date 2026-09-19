# WO-142 decisions

## WO-142-D001 — Repair the observed rows within the cleanup boundary

```json
{
  "id": "WO-142-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Re-observe the 51 cleanup row groups, implement bounded repairs with existing checks, and regenerate shared outputs after source changes.",
  "evidence": ["docs/work-orders/WO-142-outstanding-cleanup.md", "docs/planning/outstanding-cleanup-2026-09-19.md §2, §3, §6", "docs/evidence/WO-142/rows.md"],
  "rejected": ["NoOp retains the reproduced feed refill, discarded refutations, hidden advisories and stale documentation.", "A new recurring gate or receipt mechanism would violate this order's cost boundary.", "Editing immutable reports would erase the evidence this cleanup is responding to."],
  "reopenWhen": "A row needs a product decision, replay-sensitive or worker-input change, or spend beyond the authorized feedback edition; the next feed, carried-set and reviewer observations test the promised benefit."
}
```

This work reduces recurring supervision and recovery cost on the route to an
independently verified source-to-deliverable loop. It is bounded maintenance,
not delivery of the separately owned resident append-lock fix. The interfaces
are the existing commands, validators, projections and role instructions; the
repository consumes them before any export. The parent is the sole worktree
writer. Three read-only helpers inspect grouped rows and may propose patches
outside the checkout; no descendant helpers are planned (3 of cap 20).

The eight system traps inform the implementation: preserve the four refusals
to avoid policy resistance; batch generation and checks to account for shared
compute; keep required outcomes explicit to resist drift; add no recurring
mechanism that escalates process; judge alternatives from current evidence
rather than existing investment; remove recurring operator rescue rather than
shift it; use counterexamples and reverted-subject checks against rule beating;
and measure the repaired behavior rather than row or receipt volume. Naive
Interventionism favors small changes that preserve valid inputs, immutable
history, recovery refs and host authority. NoOp is inferior for reproduced
defects, but remains the correct outcome when the initial observation finds a
row absent. Product decisions outside the boundary are returned visibly.

Entry usage, dispatch scope at 2026-09-19T04:29:32Z: input/output/total tokens
and cost unavailable; no zero or estimate is substituted. The initial local
retention observation found one runtime snapshot (2,747,865 bytes), no retained
close lane in this worktree, and 97,838,994 bytes in the shared dead suite cache.
These are checkout-specific observations, not the planning main-checkout totals.

## WO-142-D002 — Preserve replay behavior when returning resident NoOp identity

```json
{
  "id": "WO-142-D002",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Fix the resident budget collision in B12(a); return B12(b) because adding phase and arm generation to NoOp identity changes a replay-sensitive route.",
  "evidence": ["packages/skeleton/src/resident-state.ts", "packages/skeleton/src/resident-host.ts", "docs/work-orders/WO-142-outstanding-cleanup.md §Design (scope discipline)", "packages/skeleton/test/resident.test.ts"],
  "rejected": ["A private host cache forgets the identity on restart and changes equivalent-log behavior.", "Changing the replay fold or event payload inside this cleanup would cross its explicit fence."],
  "followup": "Authorize a resident replay order to key NoOp deduplication by reason, phase and arm generation in resident-host.ts and resident-state.ts, with old-log replay and restart-equivalence fixtures. Priority: bounded correctness maintenance; same-reason refusals after re-arm are currently under-recorded, without permitting unauthorized dispatch.",
  "reopenWhen": "A dedicated resident replay order authorizes phase-and-generation NoOp identity and the old-log and restart-equivalence checks."
}
```

The starred obligation is B12(a) alone. Its minimum-budget repair stays inside
the existing eligibility fold. The returned subpart does not widen this order
or lose the defect in report prose: the explicit follow-up enters the repaired
register. NoOp here avoids an unauthorized replay migration and the extra
private state that would obscure the original problem.

## WO-142-D003 — Keep a durable inventory when pruning a closed lane

```json
{
  "id": "WO-142-D003",
  "date": "2026-09-19",
  "dispatch": "resume: next; operator steering: follow the spirit of the order as best you can",
  "decision": "The on-demand prune command keeps a durable regular-file byte inventory beside each deleted retained lane, previews by default, and deletes only with --apply after rechecking its subject.",
  "evidence": ["docs/work-orders/WO-142-outstanding-cleanup.md row D1", "scripts/lib/harness-prune.mjs", "scripts/test-harness.mjs", "docs/final-reviews/WO-133/FINAL-002.md"],
  "rejected": ["Retaining every lane forever because the old preservation inventory lived only in memory would miss the order's intended cleanup.", "Deleting an unproven lane or overwriting a proof would lose recovery evidence.", "A recurring retention service or gate adds cost outside this order."],
  "reopenWhen": "A real preview finds unidentified residue that materially prevents useful cleanup, or target/session ownership cannot be proved by the existing installation and process observations."
}
```

This is a durable form of the existing byte proof, emitted only by the requested
command. The proof records relative paths, file sizes, modes and SHA-256 bytes,
and remains outside the removed lane. Publication requires both an observed
non-draft Release and its remote tag matching the local attributed release.
Unknown publication or ownership retains the material. The real checkout is
previewed only; fixture roots exercise deletion.

## WO-142-D004 — Correct implementation and fixture assumptions from executed checks

```json
{
  "id": "WO-142-D004",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Correct the specific assumptions exposed by integration tests without narrowing the order's checks.",
  "evidence": ["packages/kernel/src/store.ts", "packages/kernel/test/ac2-replay-store.test.ts", "scripts/test-work-orders.sh", "scripts/test-resume.sh", "scripts/lib/harness-prune.mjs"],
  "rejected": ["Weakening envelope validation or accepting failed fixtures would hide the implementation error."],
  "reopenWhen": "A further executed check contradicts an implementation or evidence claim."
}
```

The first append implementation decoded the new line in isolation; the decoder
expects its ordinal within the full log, so the second event failed. The intended
check is the assigned envelope in the full candidate log; that is now decoded
before return. The first negative fixture treated an empty actor ID as invalid,
but the existing decoder requires a string and admits the empty string; the
fixture now uses a number. No new string constraint was introduced. Two fixture
entry points were initially invoked without their owned temporary root; they
are rerun through their shell wrappers. The prune inspection also found that
turn completion alone does not establish session death, and target installation
receipts carry pins outside the ordinary worktree manifest; the implementation
must preserve both before its deletion claim is accepted.

Further executed corrections: anchoring the amendment-heading expression also
required admitting the first line of a multiline file; an oversized amendment
length needed an explicit bound because `slice` clamps it silently. The process
caption needed a blank line after its HTML marker to pass the existing GitHub
body paragraph check. The first final document run also caught physical soft
wraps in the newly written PR draft prose; its paragraphs now use the required
single physical line. Prune now rejects malformed installed manifests as
unknown ownership and binds both publication observations to the same origin,
ignoring ambient GitHub repository/host overrides.

## WO-142-D005 — Defer the pre-existing append serialization divergence

```json
{
  "id": "WO-142-D005",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Keep B11's assigned-envelope validation and defer the adjacent live/replay value-normalization change to a replay-scoped planning item.",
  "evidence": ["packages/kernel/src/store.ts", "packages/kernel/test/ac2-replay-store.test.ts", "docs/evidence/WO-142/counterfactuals.md §Adjacent observation", "docs/work-orders/WO-142-outstanding-cleanup.md §Design (scope discipline)"],
  "rejected": ["Returning a canonical decoded payload now would change live behavior for previously admitted values.", "Rejecting additional nested payload shapes would change input admission beyond the specified assigned-envelope check.", "Leaving the defect only in report prose would repeat the B17 ownership gap."],
  "followup": "Next planning session: authorize append serialization/live-replay compatibility in packages/kernel/src/store.ts and ac2-replay-store.test.ts. Choose canonical decoded return values or explicit JSON-value admission; test nested non-finite numbers, supported JSON payloads and old-log replay. Priority: bounded correctness maintenance. The worktree adjacent queue records adjacent-0001 deferred to this decision.",
  "reopenWhen": "A separately judged order authorizes the payload-admission or returned-value change and its live/replay and historical-log equivalence checks."
}
```

The same executable probe against activation HEAD and current source returned
`NaN` in the live event but replayed `null` from JSON bytes. B11's envelope
validation succeeds because those serialized bytes are a valid envelope. This
is a pre-existing adjacent issue, not an unfulfilled B11 obligation. NoOp on
the additional semantic change respects the replay fence while a concrete
follow-up preserves ownership.

## WO-142-D006 — Keep the assigned minor release and measure the actual cost

```json
{
  "id": "WO-142-D006",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Prepare local application v0.32.0 with the assigned minor classification, source-appropriate component bumps, a Node 22.1.0 floor, and one final observation of feed, instruction bytes and retention.",
  "evidence": ["docs/work-orders/WO-142-outstanding-cleanup.md", "package.json", "packages/kernel/package.json", "packages/compiler/package.json", "packages/skeleton/package.json", "packages/console/package.json", "docs/evidence/WO-142/harness-context.json", "docs/evidence/WO-142/prune-preview.json"],
  "rejected": ["A patch classification understates the four newly refused input forms and added command.", "A new dependency is unnecessary for these repairs.", "Repeating live feedback or full product gates to copy counters would add cost without a changed product subject."],
  "reopenWhen": "Final review integrates a newer application release, a required check contradicts the prepared surface, or the next feed/refutation/reviewer observations fail to show the promised benefit."
}
```

The local baseline release was v0.31.1. Changed components are kernel 0.6.0,
compiler 0.15.0, skeleton 0.28.0 and console 0.1.7. The workspace's used
`--test-skip-pattern` flag was added in Node 22.1.0 (and backported in 20.14.0),
per the [official Node CLI reference](https://nodejs.org/api/cli.html#--test-skip-pattern).
The supported floor follows this repository's Node 22 line. No external
dependency was added; linked workspace metadata and release pins changed.

Activation-HEAD instruction comparison (`cb932c845354ec871fd34e14dec859bb869776ef`),
identical for `.agents/skills` and `.claude/skills`:

| Role | Before, including CLAUDE.md | After | Change | Existing ceiling |
| --- | ---: | ---: | ---: | ---: |
| executor | 20,849 | 21,076 | +227 | 24,576 |
| verifier | 17,891 | 18,118 | +227 | 20,480 |
| reviewer | 19,109 | 19,336 | +227 | 20,480 |

The other three roles changed by zero bytes. `harness-context.json` also keeps
the tool's distinct historical v0.16.0 comparison; its historical deltas must
not be read as this order's delta. The shared instruction file is 5,474 bytes.
The live feedback comparison saved 1,192 bytes within its matched fixture,
not from these cold-start totals. Root token and dollar counters were unknown
at entry; final usage readback is separate. Three helpers were used, with no
descendants or additional live refutation.

Final worktree feed observation after the one index regeneration,
`npm run plan -- followups` on 2026-09-19: **419 total, 83 pending, 2 untriaged**.
The two new untriaged entries are D002 and D005's explicit actions. The four
ordinary decisions add none. The comparison remains **364 before settlement,
0 after the planning settlement, 2 after this implementation**. Five existing
source revisions now need review because the required live-document write-backs
changed their source; their prior dispositions/history remain. This is the
current worktree observation; final review must repeat the observation on its
integrated subject as criterion 2 requests.

Final prune observation at 2026-09-19T05:23:24Z: four snapshots total
**11,098,502 bytes before and after**, dead cache **97,838,994 before and after**,
retained lanes **0 before and after**. Complete sorted inventories have identical
digests across the preview. Eligible bytes total **100,586,859**: one unpinned
snapshot (2,747,865) and the dead cache (97,838,994); the three pinned snapshots
remain. Real deletion is **0 bytes**. The first three-snapshot observation was
an earlier cutoff, not the final retained count. The final preview exposed that
normal snapshots contain internal package symlinks; their relative target bytes
are now inventoried without traversal for snapshots only. Absolute/escaping
links and lane/cache symlinks remain conservative refusals. Five temporary-root
fixtures pass, and removing this snapshot-link support fails the new fixture.

This outcome removes the reproduced collector and visibility defects while
keeping the two replay questions owned. It spends one live feedback edition,
one normal generation per owned projection and bounded fixture/counterfactual
work; no new recurring process is added. Savings beyond the measured 1,192
fixture bytes and removable residue are not inferred.

## WO-142-D007 — Board up the Node 26 beacon timestamp failure met during verification

```json
{
  "id": "WO-142-D007",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record, without fixing, the Node 26 beacon timestamp failure that VER-001 met. It fails identically at the activation commit, so it is not a WO-142 regression and lies outside the order's rows.",
  "evidence": ["docs/verifications/WO-142/VER-001.md", "packages/skeleton/src/beacon-io.mjs", "package.json"],
  "rejected": ["Fixing beacon timestamp writes during verification would edit the implementation under verification.", "Counting the three Node 26 suite failures against WO-142 contradicts the identical failure at the activation commit.", "Leaving the failure only in the report would repeat the ownership gap row B17 closes."],
  "followup": "Authorize a bounded order that makes beacon size and mtime writes exact under Node 26, or narrows the declared supported Node range. On v26.9.0, utimesSync with fractional seconds reads back 1726700000123 ms as 1726700000122 ms, and beacon-io refuses the result. Run the beacon-fs, senses, worker, resume and worktree fixtures under both Node 22 and Node 26. Priority: the host's default Node fails npm test in the skeleton, resume and worktree suites, both at the activation commit and on current source. Until this is fixed, each final review must run its gate under Node 22.",
  "reopenWhen": "npm test passes under Node 26, or the engines range excludes the Node versions that fail."
}
```

The operator upgraded this host from Node 22 to Node 26.9.0 after WO-142's
implementation handoff. Under v26.9.0, `npm test` fails the skeleton, resume
and worktree suites, with 18 passed and 3 failed, both inside and outside this
session's sandbox. The activation commit fails the same beacon-fs cases, 6 of
7. Under Node 22.2.0 the current subject passes all 21 suites. Row A20's
`engines.node >=22.1.0` admits Node 26.

## WO-142-D008 — Board up the retained WO-042 mutation tool's broken check

```json
{
  "id": "WO-142-D008",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record, without fixing, that the retained evidence tool named by row A7 already fails its own check mode at the activation commit.",
  "evidence": ["docs/verifications/WO-142/VER-001.md", "scripts/authority-mutation-evidence.mjs", "docs/evidence/WO-042/README.md"],
  "rejected": ["Repairing a retained evidence tool during verification would edit implementation.", "Treating A7 as not reproduced does not establish that the retained tool still runs."],
  "followup": "Decide whether `node scripts/authority-mutation-evidence.mjs --check` should be regenerated against current source or its reproduction command removed from docs/evidence/WO-042/README.md. At the activation commit it exits 1 with 'mutation evidence executable subject drift'. Priority: low, because it is an evidence reproduction path and no gate runs it.",
  "reopenWhen": "The WO-042 reproduction command passes again, or it is marked historical beside its evidence."
}
```

## WO-142-D009 — Board up two lexical module-entry guards outside row A13's ten scripts

```json
{
  "id": "WO-142-D009",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record, without fixing, that corpus/mutation/mutate.mjs and corpus/harness/generator-runtime.mjs still compare the entry path lexically. That is the defect class row A13 fixed for its ten scripts.",
  "evidence": ["docs/verifications/WO-142/VER-001.md", "corpus/mutation/mutate.mjs", "corpus/harness/generator-runtime.mjs", "scripts/lib/paths.mjs"],
  "rejected": ["Editing corpus sources during verification would edit implementation.", "Folding them into A13 after the fact would widen the row's named ten scripts without a decision."],
  "followup": "Route corpus/mutation/mutate.mjs and corpus/harness/generator-runtime.mjs through the shared isMainModule realpath helper, with the existing symlink fixture pattern. Priority: low, because neither runs when invoked through a symlink but no current caller does that.",
  "reopenWhen": "Either script is invoked through a symlinked path, or the next order that edits either file."
}
```

## WO-142-D010 — Integrate main and upgrade Node and TypeScript

```json
{
  "id": "WO-142-D010",
  "date": "2026-09-19",
  "dispatch": "resume: fix; scope expand: can you also update the app to node 26 and typescript 7; i also merged a parallel work order to main so you'll need to update",
  "decision": "Integrate fetched main's WO-084 changes while preserving WO-142, repair VER-001 F1-F4 and N1-N14, and expand the order with Node 26 and TypeScript 7 including required API, build and beacon compatibility changes.",
  "evidence": ["docs/verifications/WO-142/VER-001.md", "docs/work-orders/WO-142-outstanding-cleanup.md Part E", "package.json", "https://github.com/microsoft/typescript/blob/v7.0.2/packages/typescript/package.json"],
  "rejected": ["NoOp leaves the host's Node 26 gate red and omits the operator's explicit upgrade.", "Keeping TypeScript 5 as the build compiler would not satisfy TypeScript 7.", "Discarding uncommitted work or rewriting immutable verification would lose the original subject and its evidence."],
  "reopenWhen": "A required compatibility change alters a replay or product contract, the upgraded compiler cannot run the supported build, or executable checks contradict a repaired claim."
}
```

The repair continues D001's goal and all eight system-trap comparisons. It
removes repeated dispatch, read-command and timestamp failures from the route
to a verified source-to-deliverable loop. For policy resistance and rule beating,
the existing refusals and causal negative cases remain; for shared-resource
cost, escalation and shifting the burden, three grouped read-only helpers
(no descendants) support one writer and one final integrated gate. Drift and
seeking the wrong goal are checked by real input forms and executable outcomes.
Success-to-the-successful does not justify retaining an obsolete compiler.
Naive Interventionism favors retaining exact beacon bytes, public interfaces,
and the existing compiler package name where supported; no new recurring
mechanism is authorized. Tests determine compatibility, not the version label.

The old base was `cb932c84`; fetched `origin/main` fast-forwarded to `c5b2b0e7`
(WO-084). `refs/dotln/checkpoint/WO-142/5` and the named stash
`WO-142 repair preservation before integrating WO-084 main 2026-09-19`
preserve the pre-integration work. The stash is retained. Follow-up entries
were unioned by id with both revision and disposition histories preserved.
Conflicts affected release prose, generated control/index/lock projections and
the register; source changes to the test runner merged cleanly. WO-084's ledger
and immutable reports are carried forward unchanged. Node reports `v26.9.0`;
npm reports TypeScript `7.0.2`. Entry usage at 13:40:21Z is unavailable for
all token and cost counters (dispatch scope); the explicit helper plan is 3
of cap 20, with unobserved remainder unknown.

## WO-142-D012 — Retain existing Git admission with an explicit effects follow-up

```json
{
  "id": "WO-142-D012",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Restore the harmless read forms identified by VER-001 F3, add a constrained Git prefix that disables optional locks and fsmonitor, and board N7's pre-existing metadata exception instead of silently narrowing it during an allowlist widening.",
  "evidence": ["docs/verifications/WO-142/VER-001.md F3 and N7", "packages/skeleton/src/harness-command.ts", "packages/skeleton/src/harness-host.ts metadataCommand", "scripts/test-harness.mjs"],
  "rejected": ["Calling metadata admission side-effect-free is contradicted by an isolated Git 2.55.0 probe.", "Rewriting the operator's commands or removing old metadata admission would add a different enforcement change to this bounded widening."],
  "followup": "Next planning session: choose and implement live-gate Git metadata admission covering both metadataCommand exceptions and shellWriteTargets. Test index bytes and mtime, configured fsmonitor, clean/process filters and signature verification programs across status/log/diff. The existing --no-optional-locks -c core.fsmonitor=false prefix protected status in a Git 2.55.0 fixture, but prefixed diff still refreshed the index and ran a clean filter, and log.showSignature=true invoked gpg.program. Preserve useful reads without claiming that the prefix alone closes these effects. Priority: bounded correctness; admitted commands can touch a gate input or run a configured program.",
  "reopenWhen": "A separately authorized enforcement change covers both adapters with index-byte/mtime, fsmonitor, clean/process-filter and signature-program negative fixtures."
}
```

An external synthetic repository showed ordinary `git status --short` both
refreshing its index and invoking fsmonitor. `--no-optional-locks` prevented
only the index change; adding `-c core.fsmonitor=false` prevented both. The
new prefix is additive, and old forms still have the recorded limitation.
Host delegation is not evidence that gate inputs remain unchanged. D001's
policy-resistance and Naive Interventionism comparison favors a visible,
owned enforcement decision over disguising a narrowed contract as cleanup.

## WO-142-D013 — Correct the repair's claims and preserve causal evidence

```json
{
  "id": "WO-142-D013",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Correct the four overstated row claims and distinguish committed regressions, source inspection, and session-local counterfactual history. Restore the original kernel coupling assertion beside the new AST checks.",
  "evidence": ["docs/verifications/WO-142/VER-001.md F1-F4 and N1-N14", "docs/evidence/WO-142/rows.md", "packages/kernel/test/ac2-replay-store.test.ts", "scripts/test-observed-facts.mjs", "scripts/test-work-orders.mjs"],
  "rejected": ["Relabeling the failed verification would erase the judged subject.", "Claiming temporary helper scripts are committed checks is false.", "Dropping the original coupling assertion loses nested-state access coverage even when alias fixtures pass."],
  "reopenWhen": "A real envelope or dispatch does not satisfy its new regression, an old accepted read form still regresses, or a claimed source check has no retained executable evidence."
}
```

Specific corrections to the earlier executor text: B2's Bash id was read from
the wrong key and its completion parser missed queued/attachment envelopes;
B3 did not start with every read command opaque; A16 left the named unused
import and invented a source-definition assertion; B14 replaced rather than
preserved the nested-state assertion. Each is repaired explicitly. Native
Claude shape inspection was restricted to this worktree's transcript keys,
value types and known envelope discriminators, with no transcript content or
identifiers copied: notices occur as `queue-operation`/`enqueue` with `content`
and `attachment`/`queued_command` with `prompt`. Remove records are ignored;
duplicate terminal notices do not extend elapsed time. The regression uses
synthetic values of those observed shapes, and tests the actual PostToolUse
scope stamp.

For N12, old `/tmp` references are dated session-local observations. They are
not available committed reproduction commands. A16, A19, A20(a)(b)(d) and A22's
non-baseline portions are checked source inspections, corroborated by
VER-001, rather than invented committed source assertions. The normal
functional suites still establish those behaviors where applicable. The
repair's retained causal commands and outcomes are listed in `repair-001.md`.

## WO-142-D011 — Preserve encoded milliseconds under Node 26 and migrate the native parser

```json
{
  "id": "WO-142-D011",
  "date": "2026-09-19",
  "dispatch": "resume: fix; operator-authorized Node 26 and TypeScript 7 scope expansion",
  "decision": "Pin Node 26 and TypeScript 7.0.2, migrate compiler API consumers to native virtual-file parsing, explicitly request TAP for machine-read test results, and verify beacon timestamps within less than one microsecond above the encoded integer millisecond.",
  "evidence": ["docs/evidence/WO-142/decisions.md#wo-142-d010--integrate-main-and-upgrade-node-and-typescript", "packages/skeleton/src/beacon-io.mjs", "packages/skeleton/src/feedback-source-comments.ts", "packages/skeleton/src/feedback-audit.ts", "packages/skeleton/test/control-beacon.test.ts", "https://github.com/nodejs/node/blob/main/doc/api/fs.md", "https://github.com/microsoft/typescript/blob/v7.0.2/packages/typescript/package.json"],
  "rejected": ["Exact nanosecond equality is not representable for every epoch millisecond through Node's binary64-seconds setter: 1726700000123 ms reads back 94 ns early on Node 26.9.0.", "Symmetric tolerance admits the preceding millisecond and corrupts the encoded timestamp.", "Adding a Python or native-extension runtime dependency solely to set timestamps is unnecessary for the documented integer-millisecond codeword.", "Keeping TypeScript 5 for parsing would retain a second compiler API and omit the requested migration.", "Changing observation or replay normalization would conceal actual host precision."],
  "reopenWhen": "A supported filesystem cannot retain the integer millisecond within the stated bound, TypeScript's pinned native API changes, or the contextual literal/comment and purity regressions fail."
}
```

The write edge accepts `[targetNs, targetNs + 1000ns)`, retains an acceptable
direct write, and otherwise retries once at +0.5 microseconds. Refusal leaves
the published bytes, inode and timestamp untouched. The former exact-nanosecond
assertion is intentionally replaced by this explicit host precision contract.
Fine Spectrum records actual nanoseconds. Its existing skew and age rules stay
unchanged: a positive offset can be skewed in the requested millisecond and
still fresh at the nominal stale boundary, until the next millisecond. Same-host
live/replay emissions retain identical raw metadata; cross-runtime nanosecond
identity is not claimed. Product 02 and the skeleton README state the bound.
This closes D007's host-upgrade defect without changing a codebook or reactor.

The native compiler no longer exports the TypeScript 5 parser API. Three test
consumers use a short-lived virtual project; the product's suppression boundary
batches before/after files in one native parse and closes it in `finally`.
Context-sensitive literal spans remain protected from comment interpretation.
Runtime loading stays lazy for hooks that do not need parsing. The dependency
is exactly pinned, including the platform binary in the lockfile. Pure kernel
and compiler runtime dependencies remain zero. TypeScript 7 also exposed
optional disconnect callbacks and an optional assertion message; the fixes
preserve their behavior. Node 26 changes the default test reporter, so the
feedback audit now explicitly asks for the TAP format it parses.

The upgraded dependency and parser are new evidence inputs. E1 therefore owns
one replacement feedback edition and its independent live verifier; the earlier
edition remains unchanged. The repair uses three reused read-only helpers and
one live feedback verifier, with no helper descendants planned (4 of cap 20).
This is the necessary validation cost of the authorized upgrade, not a new
recurring gate or a retry of unchanged evidence. Other synthetic editions and
console goldens are regenerated once after all source repairs.

## WO-142-D014 — Complete runtime compatibility after the integrated gate

```json
{
  "id": "WO-142-D014",
  "date": "2026-09-19",
  "dispatch": "resume: fix; operator-authorized Node 26 and TypeScript 7 expansion and main integration",
  "decision": "Disable Node's binary compile cache only in discovery check subprocesses, update remaining timestamp fixtures to D011's precision contract, explicitly select TAP in the gate runner, and describe WO-084's two imported lineage checks. Preserve the failed gate and first replacement live edition; record a second replacement after the discovered runtime fix.",
  "evidence": ["docs/evidence/WO-142/repair-001.md", "packages/skeleton/test/discovery.test.ts repo-default/profile fixture", "packages/skeleton/src/discovery.ts", "scripts/test-beacon-fixture.mjs", "packages/skeleton/test/senses-v3.test.ts", "scripts/test-runner.test.mjs", "scripts/test-process-debt.mjs"],
  "rejected": ["Ignoring binary files would weaken discovery's bounded corpus guarantee.", "Deleting npm cache files after checks would add cleanup effects and hide the cause.", "Keeping exact-nanosecond assertions contradicts D011's explicitly changed write precision.", "Relabeling revision 001 as current after discovery source changes would invent evidence."],
  "reopenWhen": "A supported runtime adds undeclared check artifacts, alters the machine reporter contract, or the final integrated gate finds another incompatible assumption."
}
```

The first integrated gate ran 79 fresh tasks in 296.93 seconds: 30 suites
passed and five failed (process-debt, resume, worktree, skeleton, runner-fixtures).
It is retained as a failed observation. The discovery fixture reproduces the
binary-corpus failure because installed npm calls `enableCompileCache()` and
`TMPDIR` is the target root. Setting `NODE_DISABLE_COMPILE_CACHE=1` in that
subprocess environment makes the existing fixture pass; removing it fails.
The source inventory, binary refusal, sandbox and target files are unchanged.

The first repair live audit was run before this broader compatibility check.
That sequencing was premature: its successful revision 001 remains historical,
but discovery is a declared source, so it cannot attest the repaired subject.
The operator's requested upgrade already authorizes completing its required
validation. This amendment records one additional independent live verifier
and a new immutable revision 002 after focused compatibility checks. The
explicit session plan is three reused helpers plus two live verifiers total
(five of cap 20), with no helper descendants and unobserved counts unknown.

D010's mission and eight-trap comparisons still apply. This bounded adjustment
removes a measured runtime failure without shifting cleanup to the operator;
NoOp leaves the requested upgrade incomplete. Preserving binary refusal and
source identity avoids rule beating and drift. Stopping cache creation at its
owned subprocess boundary is the smaller intervention; leaving runtime source
unchanged or weakening the corpus would pursue the wrong goal. The extra live
check is a stated cost of the newly changed subject, not a repeat of unchanged
passing evidence or a new recurring gate. Final results judge the outcome.

Repair outcome for D010–D014 (2026-09-19): the final integrated gate passed
35 suites / 79 fresh tasks in 307.65 seconds, and the document gate passed
19 / 19 in 15.24 seconds under Node 26.9.0 with TypeScript 7.0.2. D007 is
settled through its existing follow-up disposition; D002, D005, D008, D009
and D012 retain their named future actions. The integrated feed reports
424 total / 87 pending / 6 untriaged, against the historical 364-before /
zero-after planning settlement. Installed role context grew 327 bytes for
executor, verifier and reviewer against activation in each harness root;
other role deltas are zero and all set ceilings pass. The measured index
reduction and executable compatibility checks establish current benefit;
future feed, refutation and reviewer observations still decide durability.
The failed first gate and superseded live revision remain recorded costs.

## WO-142-D015 — Board up the optional-chaining gap in the kernel coupling tripwire met during VER-002

```json
{
  "id": "WO-142-D015",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record, without fixing, that the kernel AC3 coupling check in packages/kernel/test/ac2-replay-store.test.ts does not catch a reserved-state read written with optional chaining. The gap exists identically at the activation commit, so it is not a WO-142 weakening; row B14 named only the alias and destructure forms.",
  "evidence": ["docs/verifications/WO-142/VER-002.md", "packages/kernel/test/ac2-replay-store.test.ts", "packages/kernel/src/core.ts"],
  "rejected": ["Extending the tripwire during verification would edit the subject under verification.", "Counting the gap against B14 contradicts its identical result at cb932c84.", "Leaving it only in the report would repeat the ownership gap row B17 closes."],
  "followup": "Extend the AC3 reserved-state coupling check so an optional-chained read such as `(context.state as { policy?: unknown } | undefined)?.policy` inside packages/kernel/src/core.ts fails it, with a planted-mutant fixture. VER-002 planted that line after core.ts line 352: the current test passed 20/20, and the activation test passed 18/18 with the same line, while the cast form `(context.state as any).policy` and the computed form `(context as any)[\"state\"].policy` already fail the current test. Priority: low; no such read exists in core.ts today.",
  "reopenWhen": "A reserved-state read is added to kernel source in any form, or the next order that edits the AC3 coupling check."
}
```

VER-002 met this while re-checking VER-001 F4. The repaired assertion and the
new alias and destructure checks hold. This record owns the one remaining form
that neither the original regular expression nor the new syntax check detects.

## WO-142-D016 — Repair terminal observations and restore the admitted read class

```json
{
  "id": "WO-142-D016",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair VER-002's terminal-task and read-admission failures as classes: recognize observed terminal statuses and background metadata, scope and order task observations, index the journal once per transcript scan, and restore the activation classifier's literal arguments for its nine legacy read programs. Repair the accompanying stale evidence and active toolchain documentation within their existing surfaces.",
  "evidence": ["docs/verifications/WO-142/VER-002.md F1-F2 and N1-N10", "packages/skeleton/src/observed-facts.ts", "packages/skeleton/src/harness-command.ts", "scripts/test-observed-facts.mjs", "scripts/test-harness.mjs", "corpus/harness/wo101-generators.test.mjs"],
  "rejected": ["Adding only killed and the thirteen quoted command strings repeats the previous partial class repair.", "Adding a new observer cache, gate or dependency imposes recurring machinery for a local defect.", "Changing immutable verification reports or the recorded WO-101 toolchain would erase the evidence being corrected.", "Claiming the Git prefix prevents all effects contradicts VER-002 N4 and an independent synthetic Git 2.55.0 reproduction."],
  "reopenWhen": "A native task form remains unobserved, retrospective journal ingestion changes a newer terminal fact, literal read forms regress against activation, or the repaired checks fail on the selected subject."
}
```

Mission and critical path: accurate background facts and usable reads remove
recurring operator rescue while the source-to-deliverable loop is verified.
NoOp leaves two recorded acceptance failures and repeat verification work.
Policy resistance is addressed by retaining the activation read boundary and
all destination screening; the separate Git enforcement change remains D012.
Commons cost is three read-only helpers, no descendants, and one writer, with
unknown token/cost counters. Drift and rule beating are checked by terminal,
negative, scope and activation-parity fixtures, including tests against the
pre-repair implementation. Escalation and shifting the burden are reduced by
repairing the existing adapter rather than adding a recurring intervention.
Success to the successful does not justify preserving the newer incomplete
flag lists; the simpler activation behavior is the evidenced alternative.
Seeking the wrong goal would optimize a green fixture list instead of actual
terminal facts and usable reads. Naive Interventionism favors reversible,
local changes that preserve native IDs as hashes, read destinations, immutable
history, and all four refusals. Current checks and final handoff judge benefit.

Specific correction to repair 001: accepting only the seven quoted read forms
did not repair the previously admitted class; accepting completed/failed/stopped
did not cover the observed killed terminal state. The evidence, implementation
and row claims are corrected together here. N4 extends D012's existing owned
limitation; its prefix alone is not a complete no-effect guarantee for diff/log.


VER-002 N4 correction to D012 (2026-09-19): its earlier prefix proposal was
incomplete. The verifier and a repair helper independently reproduced the
remaining diff index refresh, clean-filter execution and log signature-program
execution in synthetic repositories. Product 07 now states that narrower
observation; D012 owns all three paths, not just optional locks and fsmonitor.


Adjacent item `adjacent-0002` (same dispatch, 2026-09-19): the synthetic
observation probe found that a terminal task's one-minute lifetime replaced
its current dispatch age in an advisory. The Git batch probe found that Buffer
diagnostics caused a `trim` exception. Fix the calculation at its existing
consumer and decode the diagnostic before choosing it; name a missing batch
object in the framing error. Existing observation/work-order suites pin these
results. D016's mission, eight-trap and NoOp comparison applies: these local,
reversible corrections restore factual diagnostics without a new mechanism,
changing Git admission, or changing replay. Reopen if an actual binary error
or terminal task again reports a different quantity from its recorded source.

## WO-142-D017 — Retain the remaining observation improvements with explicit scope

```json
{
  "id": "WO-142-D017",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Keep VER-002's non-failing presentation, compatibility and capacity observations outside this terminal/read-admission correction, with named follow-up work. Repair O5's actual Buffer diagnostic failure and missing-object diagnostic now through adjacent-0002.",
  "evidence": ["docs/verifications/WO-142/VER-002.md O2-O5 and O9", "scripts/test-runner.mjs", "scripts/lib/git.mjs", "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS", "docs/evidence/WO-142/repair-002.md"],
  "rejected": ["Changing a declared feedback test source only to replace a functioning deprecated compatibility alias would require new live evidence for a presentation-only cleanup.", "Broadening the Git batch transport beyond its measured current-data headroom is unnecessary to repair the reported diagnostic failure.", "Reworking parser performance or beacon semantics would exceed this bounded correction."],
  "followup": "At the next order opening these consumers: select TAP for remaining Node suites started through node() so progress counts appear (O2); replace deprecated openProject aliases in the three test consumers alongside their next authorized feedback edition (O4); evaluate streaming/chunking Git object batches and reducing per-tag ls-tree calls, with aggregate-size and slow-Git fixtures (O5); decide whether surrounding whitespace should normalize effort aliases while retaining raw input (O9). Priority: low until an actual progress, supported-input or capacity failure occurs. Large-file TypeScript 7 parser timing (O3) should be profiled when a real source-change workload reaches the reported sizes, before changing its boundary.",
  "reopenWhen": "An order next opens these consumers, a supported input exceeds the batch limit, or a real source-change workload reproduces the reported parser/progress cost."
}
```

D016's eight-trap comparison applies: NoOp here preserves working compatibility
and the validated evidence subject, while the actual observation/diagnostic bugs
are repaired. The follow-up makes potential performance and presentation work
visible without turning every reported observation into a new mechanism or
live-model expense. The current Git batch buffer has the verifier's measured
headroom on real data; this is a capacity limitation, not an unbounded claim.


Repair-002 documentation reconciliation also corrects VER-002 O6: inspection
of release.mjs's pre-surface-check fetch shows that a missing latest remote tag
is fetched locally before close-path selection. Roadmap, playbook and release
README now describe all paths, while retaining the no-publication boundary.
After reconciliation, the feed reports 426 total, 89 pending and 8 untriaged,
against VER-002's 425 / 88 / 7 and the planning pass's historical 364-before /
zero-after untriaged count. The new action is D017; D016 creates no feed row.


Authority evidence reconciliation (same dispatch): the first document run
failed its old bundle-diff comparison after observer/read-adapter changes
regenerated the hooks. Record and select authority revision 003 with the
existing authority-evidence command; preserve revision 002 and every other
kind's current revision. This is the order's existing evidence-regeneration
duty, not another live feedback run. The feedback source projection did not
change and its current check passed. Reopen if the selected evidence no longer
matches its declared source or bundle.


D016/D017 handoff outcome (2026-09-19): integrated review selection passed
35/35 in 310.77 seconds and the document selection passed 19/19 in 15.31
seconds, with the manual corpus check 5/5. The new observation regression
reduced two boundaries from 408 journal reads to 8 (804 hashes on the repaired
subject). All 47 prior report/evidence files outside the four mutable receipt
surfaces retain their entry-checkpoint bytes. These executed outcomes support
the promised local correctness and cost benefit; live verification and D012's
separately owned Git enforcement decision remain explicitly distinguished.

## WO-142-D018 — Board up the live-gate refusal of quoted glob characters and input redirects met during VER-003

```json
{
  "id": "WO-142-D018",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record, without fixing, that the live-gate shell destination adapter refuses two harmless read shapes: any word containing `*`, `?` or `[`, even when single- or double-quoted, and any `<` input redirect. The activation build (cb932c84) refuses the same commands, so this is not a WO-142 weakening; row B3 named the program and flag vocabulary, not word screening.",
  "evidence": ["docs/verifications/WO-142/VER-003.md", "packages/skeleton/src/harness-command.ts shellWriteTargets", "live refusals during the VER-003 review gate: a double-quoted grep pattern containing `\\*\\*` and `N[0-9]`, and `wc -l </dev/null`"],
  "rejected": ["Widening word screening during verification would edit the subject under verification.", "Counting it against B3 contradicts its identical result at cb932c84.", "Leaving it only in the report would repeat the ownership gap row B17 closes."],
  "followup": "Next order that opens the live-gate shell adapter: admit quoted words whose glob characters cannot expand (`grep -n 'N[0-9]' a.md`, `grep -n \"a*\" a.md`) and a literal read-only input redirect (`wc -l < a.md`), while still refusing unquoted globs, parameter or command expansion, and read-write `<>` redirects. Each needs an admitted/refused fixture pair and an activation-parity check. VER-003 measured both builds refusing `grep -n \"a*\"`, `grep -n 'N[0-9]'`, `grep -n '\\*\\*'`, `wc -l < a.md` and `cat < a.md`, while admitting `grep -n \"a\\|b\"` and `grep -n \"plain text\"`. Priority: low to moderate; review sessions commonly grep for regular-expression patterns during a live gate.",
  "reopenWhen": "The next order that edits shellWriteTargets word or redirect screening, or a live-gate session reports another refused read that contains a quoted glob character or an input redirect."
}
```

VER-003 met this while probing the repaired read vocabulary during its own
review gate. Every program-level form VER-002 F2 named is now admitted; this
record owns the separate word-level screening that refused two of the
verifier's own read commands.

## WO-142-D019 — Keep terminal task facts stable across later observations

```json
{
  "id": "WO-142-D019",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair VER-003 F1 and N1-N2 in row B2: retain the chronologically earliest terminal state and time, independently retain the earliest dispatch, and parse the prompt's native notice through the same scoped parser even before transcript flush. Pin dispatch selection and transcript journal scope with discriminating regressions.",
  "evidence": ["docs/verifications/WO-142/VER-003.md F1, N1 and N2", "packages/skeleton/src/observed-facts.ts observedFacts and transcriptTasks", "packages/skeleton/src/harness-host.ts UserPromptSubmit", "scripts/test-observed-facts.mjs", "scripts/test-harness.mjs"],
  "rejected": ["NoOp preserves the starred row's reproduced terminal-state demotion and idle-delivery gap.", "Ignoring statusless tool observations alone does not preserve the first terminal time when killed is followed by stopped.", "Waiting for another prompt leaves the reported idle-delivery failure in place.", "Adding a persisted cache or recurring poll is unnecessary for facts already present in the hook input."],
  "reopenWhen": "A later task observation restarts terminal elapsed time, native prompt delivery remains unobserved before transcript flush, or a different dispatch's journal aliases or event IDs affect the current task facts."
}
```

Correction, 2026-09-19: D016's chronological-fold claim was insufficient.
VER-003 showed that a later statusless TaskOutput or failed TaskStop demotes a
terminal task, and a later successful TaskStop moves its terminal time.
Chronology applies to the earliest terminal evidence; later non-terminal facts
cannot undo it. Earlier dispatch evidence remains independent. The current
prompt supplies an observation time until an earlier transcript timestamp is
available; learning an earlier terminal time may shorten elapsed, never restart
it. Immutable reports and earlier repair receipts remain as recorded.

Mission and critical path: dependable task facts reduce operator rescue during
the independently verified source-to-deliverable loop. Policy resistance is
limited by sharing the existing native-envelope parser and retaining scope and
privacy filtering. Commons cost is one writer, no helpers, bounded fixtures
and one integrated gate; usage counters are unavailable at entry. Drift and
rule beating are judged with the reported native sequences, replay and mutants,
not only assertions against helper return values. Escalation and shifting the
burden favor using delivered facts over another recurring check or operator
poll. Success to the successful does not justify preserving a fold contradicted
by real task sequences. Seeking the wrong goal would optimize journal recency
instead of stable task state and elapsed time. Naive Interventionism keeps the
append-only journal, hashed identifiers, dispatch scope, optional-source failure
behavior and existing hook boundaries; the local changes are reversible. The
handoff records executed outcomes against this expected benefit.

D019 outcome (2026-09-19): the observer suite passes 41/41, the two generated
B2 hook checks pass, and all four targeted mutation probes fail as intended.
Sanitized replay of 185 local transcripts covers 647 terminal tasks: the entry
fold misstates 41 terminal states and 62 terminal times; the repaired fold
misstates none. The integrated review selection passes 35/35 in 307.99 seconds.
The journal-cost fixture remains 8 reads and 804 hashes across two boundaries.
These observations support the claimed local benefit; live Claude interleaving
remains for independent verification. The final document checks are recorded
in repair-003.md.

## WO-142-D020 — Board up the release-preparation write-reporting mismatch

```json
{
  "id": "WO-142-D020",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Preserve the reviewer draft's entry bytes after release prepare --local unexpectedly refreshed its metrics despite printing no files changed. Record the helper's diagnostic and ownership mismatch separately from the terminal-observation repair.",
  "evidence": ["scripts/release.mjs prepare branch unconditionally writes the process-meter block before testing plan.edits.length", "docs/evidence/WO-142/repair-003.md", "docs/verifications/WO-142/VER-003.md O5"],
  "rejected": ["Trusting the no-files-changed message contradicts the four-line comparison with the repair-entry checkpoint.", "Changing release preparation's draft-generation policy during this observation repair crosses into the separate reviewer handoff contract."],
  "followup": "Next release-tooling order: report actual writes from release prepare, including its process-meter block, and reconcile executor-time draft creation/refresh with reviewer ownership. Pin an unchanged-version invocation against an existing PR draft and an absent draft. Priority: low; the four generated changes were undone and no publication occurred.",
  "reopenWhen": "The next order opening release preparation, or another repair observes its no-files-changed message alongside a changed reviewer draft."
}
```

D019's mission and trap comparison applies to the bounded preservation action:
NoOp would keep an unrequested draft refresh hidden by an inaccurate diagnostic;
restoring only this invocation's four generated lines preserves the prior
review surface without changing release behavior. The follow-up makes the
separate ownership policy visible without adding a gate or recurring step.

Repair 003 handoff: the final document selection passes 19/19 in 15.34 seconds;
53 prior report/evidence files, including the PR draft, match entry checkpoint
13 exactly. The feed reads 428 total, 91 pending and 10 untriaged, against
427 / 90 / 9 after VER-003 and the planning pass's historical 364-before /
zero-after untriaged count. D020 is the new action; D019 creates no feed row.

## WO-142-D021 — Record the operator's prune apply and the integrated-tree observations

```json
{
  "id": "WO-142-D021",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Record criterion 5's operator clause from the operator's statement during final review together with this review's own filesystem observations, and record criterion 2's feed figure on the integrated tree. The recorded previews stay as history; nothing is rewritten.",
  "evidence": ["Operator message during resume: final review, 2026-09-19 (operator-attested): the operator ran harness prune with --apply on this worktree after VER-004 and plans to run it on main after release close", "docs/evidence/WO-142/prune-preview.json", "docs/verifications/WO-142/VER-002.md executed checks (real-checkout preview)", "docs/verifications/WO-142/VER-004.md O3", "scripts/lib/harness-prune.mjs", "npm run plan -- followups"],
  "rejected": ["Treating the operator clause as waived without looking: the listing and the two named paths were observable, so they were observed.", "Running --apply on main from this review: main does not carry the command until merge, and deleting the operator's local material is the operator's action (operator-review assumption 3).", "Editing prune-preview.json or D006 to show the later state: both are dated observations."],
  "reopenWhen": "The post-close run on main removes anything other than its listed paths, or its listing differs in kind from the read-only plan recorded here."
}
```

Before, as recorded: the executor's preview at 2026-09-19T05:23:24Z listed
**100,586,859 bytes** (snapshot `05243f7f3687b59a`, 2,747,865; the dead cache,
97,838,994) and VER-002's preview listed **100,589,334 bytes** (the same two
plus fifteen markers). Both deleted nothing.

After, observed by this review at about 16:55Z: `<git-common>/dotln/suite-success`
is absent, `.runtime/harness/05243f7f3687b59a` is absent, and the listing shows
**660 bytes** (four markers of sessions that ended since). Seven snapshots
remain, all retained as pinned (26 MB by `du`); fourteen markers remain, ten
retained (one current session, nine with no observed session end). The
operator's own apply output was not captured, so the exact deleted total is
**unknown**; the two absent paths alone account for 100,586,859 bytes.

The dead cache lived in the shared Git common directory, so this worktree's
apply removed it for `main` as well. A read-only plan against the `main`
checkout at about 17:03Z, computed from this worktree's module, lists **58
candidates, 96,451,379 bytes** (26 snapshots, 32 retained lanes) and retains
one pinned snapshot, one unrecognized name, all 18 markers (legacy format with
no session ownership) and two lanes that hold nested repositories. `main`'s
pinned snapshot shares the deleted snapshot's name and is intact: a pin resolves
under its own checkout. Together with the cache this exceeds the 176 MB the
order's Cost line names.

Criterion 2 on the integrated subject (`origin/main` = `main` = `HEAD` =
`c5b2b0e7` after a fetch; nothing newer to integrate): **428 total, 91 pending,
10 untriaged**, equal to repair 003 and VER-004, beside the planning pass's
364 before settlement and zero after. D022 and D023 below each add one action
by design and this record adds none, which is row A1 observed on real input:
after `npm run meta` the feed reads **430 total, 93 pending, 12 untriaged**.

## WO-142-D022 — Board up two prune limits met at final review

```json
{
  "id": "WO-142-D022",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Pass row D1 on its criteria and board two limits that no check exercised: an apply recomputes the whole plan, publication lookups included, once per candidate; and the product gate leaves target lanes and installation receipts in the real checkout, where every receipt counts as a snapshot pin.",
  "evidence": ["scripts/lib/harness-prune.mjs pruneHarness (one planHarnessPrune per candidate) and publishedRelease (gh release view and git ls-remote per unregistered lane)", "Read-only plan on the main checkout, 2026-09-19 about 17:03Z: 21,827 ms, 58 candidates", "docs/control/local/harness/targets counted before and after this review's gate: 362 to 389 directories, 271 to 291 installation receipts", "scripts/test-target-harness.mjs (temporary launchpad, removed afterwards; unchanged by this order)"],
  "rejected": ["Failing the review: criterion 5 and the row's required result hold, both limits are fail-safe and on demand, and a fifth repair cycle would be spent on a command's speed.", "A reviewer rewrite of the pre-delete re-check: it is deletion-safety code and would ship without independent verification.", "Saying nothing: the operator plans the main run, where the first limit is about twenty minutes."],
  "followup": "Next order opening scripts/lib/harness-prune.mjs: (a) observe publication once per apply, or re-plan only the candidate about to be deleted, keeping the pre-delete inventory comparison, and pin it with a fixture that counts publication lookups for several lanes; (b) find which product-gate suite writes docs/control/local/harness/targets in the real checkout by counting that directory around each suite, then point it at a temporary launchpad or let prune list a target lane whose target root is gone. Priority: low.",
  "reopenWhen": "The post-close apply on main runs materially longer than twenty minutes, stops with 'Prune subject changed' or meets a rate limit; or a worktree's snapshots pass product 07's retention threshold because gate-written receipts pin them."
}
```

An apply on `main` runs 59 plans at the measured plan time, so about twenty
minutes and on the order of 1,500 `gh release view` calls with as many
`git ls-remote` calls; later plans shrink as lanes are deleted, so this is an
upper estimate, not a measurement of an apply. It stays fail-safe: each
deletion follows a fresh matching inventory, and a failed lookup retains the
lane and stops the run. The fixtures inject the publication observer and this
worktree had no retained lane, which is why four verifications never met it.

The receipts here pin six of seven snapshots (26 MB). The writer is
unidentified: the target-harness suite uses a temporary launchpad, and neither
`source-change-host.test.ts` nor `source-change-command.ts` changed in this
order, so this is probably older than WO-142 (inference from unchanged
sources; `main` holds three receipts because gates run in worktrees). The
residue ends with the worktree at release close.

Mission and critical path: a residue command the operator can trust on the
checkout that holds the residue. NoOp leaves a twenty-minute surprise; Naive
Interventionism edits deletion code after verification ended. Policy
resistance, rule beating and seeking the wrong goal do not apply: no check is
loosened and the criteria are judged as written. Commons cost is one feed row
against a repair, verification and review cycle. Drift and shifting the burden
are limited by the measured reopening conditions. Escalation and success to
the successful have no bearing on an on-demand local command.

## WO-142-D023 — Board up two items that lived only in report sentences

```json
{
  "id": "WO-142-D023",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Give an owner to two items this order's own row B17 says may not stay as report prose: row B4's result schema has never been accepted live by either worker CLI, and a comment in the live-gate adapter was stranded above the wrong function.",
  "evidence": ["docs/verifications/WO-142/VER-001.md L4, VER-002.md L2, VER-003.md L4, VER-004.md L5", "packages/skeleton/src/plan-refutation-protocol.ts planResultSchema (anyOf under findings items)", "packages/skeleton/src/harness-command.ts:319-327 and :417"],
  "rejected": ["Buying a live refutation to observe acceptance: the order allows one live spend, the feedback edition.", "Moving the comment now: the file feeds the generated hook bundle, so a comment edit would regenerate it and need a fifth authority evidence revision and a new gate."],
  "followup": "(a) At the next paid planning refutation, record whether each CLI accepts the result schema at launch; a launch refusal reopens row B4. (b) Whoever takes D012's or D018's follow-up moves the 'Bounded destination adapter' comment at packages/skeleton/src/harness-command.ts:319-322 back above shellWriteTargets. Priority: low.",
  "reopenWhen": "A planning refutation fails at launch with a schema error from either CLI."
}
```

The schema's shape is the conservative one: the root stays a closed object,
`anyOf` sits under the `findings` array's `items`, and every branch is closed
with all keys required. That is an inference from structure, not an observed
acceptance. If a CLI refuses it, the failure is a launch error before spend,
and row B4 now retains a rejected result either way.
