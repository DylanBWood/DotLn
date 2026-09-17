# WO-119 FINAL-001 — the executable discovery producer passes review; the half-landed skeleton release label is repaired and its evidence edition re-recorded

**Verdict: pass.** All five acceptance criteria hold at the reviewed tree, and I
re-derived the two that carry the order's title rather than adopting them: the
pinned six-candidate set really is produced by a program the kernel steps, and
the resident really does dispatch it as a native `script` actor under a fake
clock with no operator await anywhere on the path. VER-001 is a strong, honest
verification — it reproduced the live row byte-for-byte, disclosed its own
instrument overlap, and recorded three findings and eight observations that I
judged individually below. None of them charges a criterion.

This review made one repair, and it is the verifier's F1: the release staging was
half-landed. `packages/skeleton/package.json` declared `0.22.0` while
`packages/skeleton/src/version.ts` still read `HARNESS_HOST_VERSION = "0.21.0"`,
and every pin emitted from that constant — the manifest and all nine hooks —
still said `0.21.0`. D002, `implementation.md` and `RELEASE-NOTES.md` all state
skeleton `0.22.0`, so the delta as filed would have published a claim its own
runtime contradicted. I bumped the constant, re-emitted the bundle, and recorded
the authority evidence revision that the re-emit invalidated. Nothing behavioural
moved, and the evidence proves it: `authority.json` is byte-identical between
revisions 002 and 003.

Subject: [WO-119](../../work-orders/WO-119-executable-discovery-producer.md),
criteria 1–5 as filed, its two recorded decisions (D001–D002), its operator-review
assumption, its non-goals, and the two operator `ideation:` scope notes in its
Execution record. Branch `wo-119`, uncommitted working tree preserved by
`refs/dotln/checkpoint/WO-119/5` (`c94f241930336216bce2ed3b01654a11bab7ccf1`).
The complete verification sequence is one report,
[VER-001](../../verifications/WO-119/VER-001.md) (pass); there was no repair pass.
This operator's `resume: final review` allocated FINAL-001 at
`2026-09-17T00:39:54.567Z`. Recorded elapsed: implementation 2,954,646 ms,
verification 1,289,073 ms.

Reviewer: Claude Code, process version `2.1.274`, read back from this session's
own `CLAUDE_CODE_EXECPATH` (`…/versions/2.1.274`) and `AI_AGENT`
(`claude-code_2-1-274_agent`); `claude --version` on `PATH` agrees at `2.1.274`,
so unlike VER-001's session the installed and running versions do not differ
here. Model `claude-opus-5[1m]` as this session exposes it. Effort `xhigh` read
back from `CLAUDE_EFFORT`. The operator's phrase carried no `ultra` selector, so
no mode or raw spelling is recorded and no subagent was used — every read,
derivation and command below is this session's own. No effective-model readback
channel is claimed.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.274","model":"claude-opus-5[1m]","effort":"xhigh","source":"self-reported"}

Instrument disclosure, inherited and widened. VER-001 disclosed that the harness
bundle under verification is also the instrument that recorded its session. That
is true here and more so: my repair *rewrote* those nine hooks and the manifest
while they were enforcing this session's one-writer and live-gate invariants. I
constrained the risk the same way and checked the result rather than assuming it.
The re-emit's diff against checkpoint 5 is exactly three mechanical classes — the
runtime snapshot directory (`05aff1672fbabd53` → `d9c71d521af31eb2`), the
`skeletonVersion` literal, and the content hashes of `version.js` and of the nine
hook files themselves. No hook gained, lost or changed a line of logic, the
hand-written Clean Room floor is untouched, and `node scripts/harness.mjs check`
passes on the result. The hooks then went on to enforce their invariants against
me: they refused several of my own commands while the product gate was live.

## Integration

**Nothing to integrate, and nothing to retime.** `HEAD`, `main` and the
merge-base are all `1a2d3095cd84119c244edf554ec2b637504776df`; `git log main..wo-119`
and `git log wo-119..main` are both empty. No upstream moved during
implementation, verification or this review, so the staged application `v0.26.0`
above the observed local `v0.25.0` remains free and correct, and the WO-048-style
retiming that a moving base would force does not arise. The three sibling
worktrees (`DotLn`, `DotLn-wo119`, `DotLn-wo121`) all sit on that same commit.

## The one repair this review made

**F1 — half-landed release staging, repaired.** The verifier established the
inconsistency and left the numbers to this stage, correctly: the internal
disagreement between the package and the constant is not a retiming question.
I established which way it should be settled from the repository rather than by
preference. At every release tag the two are in lockstep — `v0.25.0` carries
package `0.21.0` and `HARNESS_HOST_VERSION = "0.21.0"`, `v0.24.0` carries `0.20.0`
and `0.20.0` — and `scripts/release.mjs` requires a component bump whenever that
component's `src` changed, which it has. So `0.22.0` in the package is required
and the constant must follow it. The repair is:

1. `packages/skeleton/src/version.ts` → `HARNESS_HOST_VERSION = "0.22.0"`.
2. `npm run build`, then `node scripts/harness.mjs emit`, so the manifest and the
   nine hooks pin `skeletonVersion: "0.22.0"`. This is not optional cosmetics:
   `harness-host.ts:2449` throws `pins-differ` when `config.runtime.skeletonVersion`
   and `HARNESS_HOST_VERSION` disagree, so bumping the constant without re-emitting
   would have broken every hook.
3. The re-emit moved the recorded bundle diff, so
   `node scripts/authority-evidence.mjs --check` failed with `stale WO-119
   revision 002 evidence: bundle-diff.json; select a new edition or revision to
   preserve existing evidence`. I followed that instruction rather than rewriting
   002: revision **003** is recorded and `docs/evidence/current.json` selects it.
   Revision 002 is preserved untouched.

This is the established handling, not an invention. WO-048 met the same cascade
and recorded it in the same shape — "a fresh WO-048 authority edition, because
regenerating the bundle at 0.18.1 moved the recorded bundle diff", and a bundle
differing "only in runtime pins — the `skeletonVersion` literal, the runtime
snapshot identifier and each hook's content hash".

The claim that nothing behavioural changed is not an assertion, it is a
measurement: `docs/evidence/WO-119/authority/003/authority.json` is **byte-identical**
to revision 002's. The compiled authority transcript — three unchanged programs,
the WO-132 migration, four widening rejections, nine runtime denials, the
admitted and reverted grants — is exactly what it was. Only `bundle-diff.json`
moved, in the generated-surface hashes and its own edition label. A skeleton
release label and the bytes derived from it are the entire delta.

Why repair here rather than fail the review. The criteria do not charge F1, so
failing would have sent a one-line label change back through an executor repair
and a full re-verification — roughly the 21 minutes VER-001 took plus a 13-minute
gate — to settle something this stage is explicitly empowered to settle. Against
NoOp: passing it through would ship `RELEASE-NOTES.md` and D002 claiming skeleton
`0.22.0` over a runtime reporting `0.21.0`, which is precisely the unsupported
claim the shared floor forbids. Against Naive Interventionism: the change is one
literal plus mechanical regeneration, it is bounded to the paths the order already
owns, and it is checked by `harness check`, by the byte-identical authority
transcript and by a full product gate at the reviewed identity.

## Acceptance criteria

**1 — pinned candidate set and executable-only program: met.** I read
`discovery.ts` in full and traced the control flow myself. `:454-479` genuinely
drives the exported `discoveryProgram` through `stepProgram`: each stage runs only
from an intent the stepper emitted, the residual decides ordering and termination,
the loop is bounded at 32 steps, and a false Guard would reach `Done` having
emitted nothing. The fixture seeds real observables rather than injected
candidates — `checks/lint.cjs` exits 1 on a literal in `src/main.js`,
`checks/test.cjs` fails an `assert/strict`, two placements have declared homes,
one generated file's declared tokens appear nowhere else, and `.dotln/repairs.jsonl`
holds two `eventId`s sharing one `repairId` and path. Evidence references are
enforced twice, at `work-candidate.ts:120-121` and again in the test.

I confirm VER-001's O4 qualification and its conclusion. `EVALUABLE_PROGRAM_KINDS.includes(p.kind)`
on a parameter already typed `ExecutableProgramV1` is a tautology, and `"Await"`
is itself a member of that set, so `assert.notEqual(p.kind, "Await")` is the only
load-bearing line in that walk. It is sufficient for the program as written and
latent if the program ever gains an `Emit` or `Await` node, since `walk()` has no
case for either one's `next`.

**2 — resident script episode, fake clock, no operator await: met.** The test at
`discovery.test.ts:258-366` is a real dispatch: a real `git init` scratch
repository, a real `ResidentHost` with `now: () => at`, a real native `script`
actor through `sandbox-exec`, asserting exactly one `ScriptEpisodeObserved` with
`verified === true`, a decoded report matching the pinned projection, an outside
write that never landed, a tampered log refused with `digest differs`, stable
replay, and cancellation of further dispatch.

I re-derived the hazard VER-001 identified, because it is the one that would
matter: `resident-state.ts` reaches `scriptResultVerified`, which *throws* rather
than returning false when `stdoutSha256` disagrees with
`discoveryOutputSha256(discovery)`. Could a truncated capture produce that state?
`script-episode.ts:86` skips a chunk when `bytes + data.length > 65536`, but
`:92-93` then adds the same length and trips `stop("output-limit")`, so `reason`
is no longer `"completed"` and the discovery block at `:123` never runs. The
truncation path is unreachable, and `resident-store.ts:67` validates the whole
fold before any event becomes durable, so even a hypothetical mismatch aborts the
append rather than poisoning the log. I also checked the boundary case the
arithmetic invites: at exactly 65536 bytes the chunk is kept and no stop fires,
which is correct.

**3 — live scratch row, shapes only: met.** `discovery-resident-final.tap` carries
the diagnostic row with `"live":"native-script-scratch-git"`, `"clock":"fake"`,
`"verified":true`, `"operatorAwait":false` and the six candidate shapes. VER-001
reran the suite and reproduced that line byte-for-byte, which is what establishes
the recorded evidence was generated by the code it claims. I confirmed the row
carries relative paths and kinds only — no absolute path, target content, machine
identifier or private material — and that the suite it comes from ran again inside
my own full gate.

**4 — write-backs: met.** The 05 write-back lands inside `## 5S / 6S — the
maintenance organism` and states plainly that Sort and Shine now have a
deterministic bounded producer, while scoping reference absence to declared tokens
and marking WO-073 as future work. The ledger duty is discharged by substitution,
which is legitimate for an order filed before 2026-09-09: `docs/work-orders/README.md:130`
carries the marker, and WO-119-D001 and D002 are both in the decisions index. The
separate operator `ideation:` dispatch did append the ledger under its own
authority, with provenance recorded.

**5 — gate, diff check, no dependency: met, re-established at the reviewed
identity.** I did not inherit the executor's gate row. After the last source edit
and with every intended new file staged, `npm test -- --review` ran once and
passed: **27 suites, 0 failed, 794.94 s, 71 fresh tasks, 0 reused**, exit 0,
recorded at `2026-09-17T00:57:59.444Z` against code identity
`0222a03bd74be003602ee4dc068a19c9d72279638c8c4db75721656925195cdb` and tree hash
`4a9bfbfb6057831b339056d81bed0353f185f267`. This supersedes VER-001's L1 — the
limit that the passing row had been reused rather than executed under that
dispatch — for the reviewed tree. `git diff --check` and `git diff --cached --check`
are both clean. No dependency changed; the only `package-lock.json` edit is the
skeleton version string.

The gate found my repair's cascade rather than my reading it: the first two
attempts failed, 19 suites reporting `Required preflight or fixture preparation
failed` because `authority-evidence` runs as a preflight task and had gone stale.
Recording revision 003 cleared it. I am recording that the failure happened,
because a report that showed only the passing run would misrepresent how the
result was reached.

## Judgment of the verification sequence

VER-001 is sound and I adopt its verdict. It did the things that distinguish
verification from re-reading: it ran the producer itself, reproduced the live row
byte-for-byte, reproduced F2's and F3's aborts at their exact thresholds, executed
the sandbox-profile probe that D002 cited but no artifact recorded, and disclosed
the instrument overlap instead of leaving it implicit. Its one resolved dispute —
O1, D002's unrecorded "bounded profile-comparison probe" — is resolved in the
executor's favour on executed evidence, which is the right disposition: the claim
was true and only its evidence was missing.

Its three findings, judged:

- **F1** — repaired above. It is the one finding that this stage could and should
  settle, and the verifier said so.
- **F2 — a repair group of 129–256 occurrences aborts the whole report.** I
  confirm it by inspection of the bounds. `discovery.ts:440` passes `eventIds:
  group.ids` as an evidence fact; `work-candidate.ts` `strings()` rejects a list
  longer than 128; the repair history admits up to 256 lines (`discovery.ts:406`).
  So an admissible target refuses entirely. Carried forward, not repaired.
- **F3 — an over-long repair key aborts the whole report.** Confirmed by
  inspection. `discovery.ts:427` stores `repairKey` as an evidence fact and
  `text()` caps a fact at 1024 characters, while the key is `repairId` (up to 80)
  plus the JSON of the sorted path list. One narration detail: VER-001 cites "the
  128-entry list limit" for those paths, but the cap that applies to a repair
  line's `paths` is `array()`'s 64 (`discovery.ts:42`), not 128. The finding is
  unaffected — its reproduction used 40 paths, well inside either bound — and the
  defect is real. Carried forward.

I agree with the verifier's disposition of both: the failure is conservative, the
producer emits nothing rather than something false, and neither is reachable from
the fixture, the defaults path, or any repository this project observes today.
They are repairs for a later order, not blockers, and both are nominated below.

Its eight observations, judged. O1 is resolved as above. O2, O4, O5 and O6 I
independently confirm from source and carry forward as nominations. O3 is accurate
and its effect is a missing candidate rather than a false one, with the behaviour
pinned by a test, so it is known rather than latent. O7 is explicitly advisory
under both the executor skill and the CLAUDE.md harness block, and is not a
violation. O8 is a property of the platform, not of this work: macOS will not
install a nested sandbox, so the discovery suite cannot run inside Claude Code's
own Seatbelt. It bound my session too — my gate runs used the authorized
outside-sandbox host, and the first `harness emit` was refused with `EPERM` on
`.claude/hooks/` until I did the same.

Its five limits: L1 is discharged for the reviewed tree by my own fresh 71-suite
gate. L2 I inherit and widen, as disclosed above. L3 (macOS only, failing rather
than skipping elsewhere), L4 (WO-100 is unimplemented, so the typed output and its
schema are verified but no consumer is) and L5 (process cost) all stand unchanged
and are correctly stated.

## Findings carried forward, nominated not repaired

None of these is a criterion failure, and each is a behavioural change outside
what a reviewer should make to a verified tree. Nominating them separately keeps
this diff legible, which is the whole point of the bound.

- **F2 and F3** — two reachable inputs that abort a whole discovery report rather
  than emitting the observations already gathered. The right repair is to bound
  or summarise the offending fact, not to widen the wire limits.
- **O2 — `outputContract` relaxes the digest pin on any absolute command.**
  `actor-contract.ts:116` accepts `outputContract: "work-candidates-v1"` on any
  script spec and, when set, requires `expectedStdoutSha256` to be absent. Only
  the *sandbox selection* in `script-episode.ts:53-60` is pinned to the discovery
  CLI invocation; an arbitrary actor carrying that contract still has its stdout
  parsed as a discovery report and can reach `verified === true` on its own
  output. AC2 does not require command pinning and D002 claims only the sandbox
  selection is pinned, so the code matches its stated contract — but the
  relaxation is wider than the pinned producer the order describes, and the
  configuration that could exploit it is trusted today only by convention.
- **O5 — the observation-only producer can write to the observed tree.**
  `discovery.ts:316-318` runs checks with `HOME` and `TMPDIR` set to the target
  root, so anything a check caches lands in the tree and re-enters the second
  inventory at `:342`. Deliberate and bounded, and the comment at `:341` says so,
  but neither the order, `RELEASE-NOTES.md` nor the skeleton runbook tells a
  reader that "discovery" can add files to their repository. That is a
  documentation gap worth closing wherever it is settled.
- **O6 — `discovery-cli.ts` is registered in one inventory of three.** It is
  pinned as a harness runtime file in `scripts/lib/harness.mjs` but is in neither
  `scripts/lib/evidence-sources.mjs` nor `feedback-audit.ts`, while
  `decisions.md:104` states that new transitive runtime/evidence inputs are named
  in the existing inventories. The other four new modules are in every list they
  belong to. I deliberately did not add it here: `evidence-sources.mjs` decides
  when a recorded edition goes stale, so editing it would have invalidated the
  editions again and pulled a machinery judgment into a review whose repair was
  meant to be a release label. It needs an owner who can decide whether a process
  entry point belongs in those two inventories at all.
- **A latent cleanliness defect I found while repairing F1, previously unrecorded.**
  `packages/skeleton/src/evidence-editions.mjs:147` masks `HARNESS_HOST_VERSION`
  by rewriting `packages/skeleton/src/harness-host.ts`, but that file no longer
  declares the constant — it re-exports it from `version.ts` (`harness-host.ts:74-75`),
  and the regex cannot match. The mask is dead for its purpose. It happens not to
  matter today, because `version.ts` is in neither `commonSources` nor
  `authoritySources`, so its bytes are never compared; the intended effect and the
  actual effect coincide by accident. Worth pointing the mask at `version.ts`, or
  deleting it, before something starts comparing that file.

## The operator's ideation scope notes

The order's Execution record adds two `ideation:` breakouts, and the dispatch
directs this stage to read them. I read the receipt, both dated ledger entries,
product 03 §Candidate — DotLn-owned authority with minimal native harness
restrictions, product 03's session-lifecycle addition and product 05's Context
Continuity extension, against the four tests the receipt itself names.

**Clean-room treatment: sound.** The source capture lives at
`docs/intake/notes/WO-119-expanded-ideation-2026-09-16.md` and is ignored —
`git check-ignore` resolves it to `.gitignore:4 docs/intake/**`, and the only
tracked paths under `docs/intake` are three `.gitkeep` files. No raw source text
appears on any committed surface; the promoted sections are synthesis in public
vocabulary. The receipt records the strategy (Shape-First Synthesis), the screen
result, and that no direct-filing exception applies.

**Traceability: sound.** All four operator messages are accounted for, including
that the first ended mid-sentence and that message 2 supplied the missing
assurance clause. Each promoted surface names its provenance and its reopening
condition.

**Separation of future goals from current capability: sound, and this is the test
that mattered most.** Every promoted surface is marked a candidate and repeatedly
denies itself authority: no settings change, no launch-default change, no
implemented wake mechanism, no claim that instruction text enforces effects. The
receipt states the current evidence *against* the candidate as plainly as the
direction for it — WO-133 leaves most hook judgments advisory, and WO-051 records
that sandbox flags alone did not establish sibling-write containment. My session
is direct evidence for that framing: the hooks refused my commands while a gate
was live and the sandbox refused my hook writes, so today's boundaries are
demonstrably host-owned, exactly as the candidate says.

**The inferred causal claim, as the receipt asks the reviewer to challenge.** The
continuity entry reports stale post-compaction answers followed by idle unfinished
work, and separately records the executor ending a turn with WO-119 incomplete. It
does *not* conclude that compaction caused either. It says the mechanism and the
host's wake coverage remain unverified, that the compacted handoff retained the
obligations so missing task state is not established, and that the broader claim
needs a bounded live probe with event evidence. The Codex app-server documentation
is cited as protocol discovery evidence and explicitly not as a guarantee. I find
no unsupported causal claim and no implied implementation promotion to correct.

One obligation this breakout leaves open and release close must not lose: the
receipt and the ledger both record that the provisional intake capture is backed
up outside the repository and **must be reconciled into main's ignored intake
before this worktree is removed**. It is outside this session's writable roots,
so I could not discharge it and do not claim to have.

## Evidence

| Check | Result |
| --- | --- |
| `npm test -- --review` (this review, after the last edit) | exit 0; 27 suites, 0 failed, 794.94 s, 71 fresh, 0 reused |
| Recorded gate row | code identity `0222a03bd74be003602ee4dc068a19c9d72279638c8c4db75721656925195cdb`, tree `4a9bfbfb6057831b339056d81bed0353f185f267`, `2026-09-17T00:57:59.444Z` |
| Earlier gate attempts | 2 failures, 19 suites on the `authority-evidence` preflight; cleared by recording revision 003 |
| `git diff --check` / `git diff --cached --check` | clean, exit 0 |
| `node scripts/harness.mjs check` | 24 generated surfaces, after the re-emit |
| `node scripts/authority-evidence.mjs --check` | verified, 27 bundle comparisons, at revision 003 |
| `authority.json` 002 vs 003 | byte-identical (`diff` empty) |
| `bundle-diff.json` 002 vs 003 | generated-surface hashes and the edition label only |
| Base vs `main` | `HEAD` = `main` = merge-base = `1a2d309`; both `log` ranges empty |
| Version lockstep precedent | `v0.25.0`: package `0.21.0` / constant `0.21.0`; `v0.24.0`: `0.20.0` / `0.20.0` |
| Dependency delta | none; lockfile changes only the skeleton version string |
| Intake containment | `git check-ignore` → `.gitignore:4`; no tracked intake but three `.gitkeep` |

## Limits

- **L1 — F2 and F3 are confirmed by inspection, not by my own re-execution.** I
  read the bounds and the call sites and agree with both findings and their
  thresholds; VER-001 reproduced them at runtime and I did not repeat that.
- **L2 — instrument overlap, widened.** This review rewrote the nine hooks and the
  manifest that were enforcing its own session's invariants. Mitigated by the
  mechanical-diff check, `harness check`, the byte-identical authority transcript
  and the full gate, but not eliminated.
- **L3 — outside-sandbox execution.** The gate and the harness re-emit ran on the
  authorized outside-sandbox host, because macOS refuses a nested sandbox (O8) and
  `.claude/hooks/` is denied to this session's Seatbelt. Every other command ran
  sandboxed.
- **L4 — macOS only,** inherited from VER-001 L3: `discovery.ts:299` fails closed
  on any other platform and the tests fail rather than skip there.
- **L5 — WO-100's consumption is still untested,** inherited from VER-001 L4. The
  order's phrase "yields candidates the portfolio (WO-100) consumes" is verified as
  far as the typed output and its schema; WO-100 is unimplemented, and derivation
  is an explicit non-goal.
- **L6 — process cost.** `node scripts/harness.mjs usage` reported only this
  session's dispatch-scoped counters and no cost figure at entry
  (`claude-transcript-message-usage`, scope `dispatch`). Final counters belong in
  the ignored usage receipt and the response, not here. The two failed gate
  attempts are real, observed cost of this repair and are named above rather than
  netted out.
