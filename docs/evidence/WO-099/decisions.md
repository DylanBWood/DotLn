# WO-099 decisions

Dispatch: `resume: next`, 2026-09-20. Executor: Claude Opus 5 (1M context),
effort xhigh, operator-attested selection; no effective in-session readback of
model or effort exists in this harness. The installed `claude` binary reports
2.1.278, which is an observation of the binary rather than of this session; the
build's recorded profile is `claude-code-2.1.263`.

## WO-099-D001

```json
{
  "id": "WO-099-D001", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "Pin the mission-check capsule when the actor is declared and complete it with a dispatch-time observation of the contract bytes, diff and recent decisions, hashing the whole capsule.",
  "evidence": ["packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/cli-actor.ts", "docs/product/02-domain-model.md#independent-verification-v1"],
  "rejected": [{"option": "Pin the whole capsule in the resident configuration", "reason": "A configuration is immutable per store, so every pulse would judge a frozen diff and a mid-episode contract edit would be invisible."}, {"option": "Build the whole capsule at dispatch", "reason": "Nothing would then fix what the episode was told the work is, and a rewritten contract could not be observed as drift."}, {"option": "NoOp", "reason": "Leaves running work unjudged, which is the observed gap."}],
  "reopenWhen": "A pulse needs an input that cannot be read from the declared source, or the pinned/observed split produces a false drift on ordinary work."
}
```

The capsule splits in two. The pin — contract clauses, an optional story
contract, the vision theses and exclusions — is fixed when the actor is
declared. The observation — the contract as it now reads, the diff against the
base and the last N structured decisions — is read at dispatch. The subject
hash covers both. `assertMissionSubjectExtends` admits an observation that
completes the pin and refuses one that rewrites it, so a dispatch-time read
cannot quietly replace the contract the episode was given.

This is what makes a cadence meaningful: the second pulse judges the work as it
now reads. It is also what makes criterion 1's second case observable, because
a clause whose bytes changed after the pin is a difference the host can see.

## WO-099-D002

```json
{
  "id": "WO-099-D002", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "The host derives the verdict from supported findings: structural drift the capsule proves is added whatever the worker returns, an unsupported finding refuses the whole result into `unknown`, and a claimed drift naming nothing is `unknown`.",
  "evidence": ["packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/plan-refutation-protocol.ts", "packages/skeleton/test/mission-check.test.ts"],
  "rejected": [{"option": "Take the worker's verdict", "reason": "A model pass would erase an out-of-surface edit the capsule already proves; the plan refuter's structural holds exist for the same reason."}, {"option": "Drop unsupported findings and keep the rest", "reason": "Silently discarding a finding hides that the judge answered outside its evidence; refusing into `unknown` holds instead."}],
  "reopenWhen": "A recorded run shows the structural rules firing on work that is inside its contract, or an honest finding is refused for want of a supplied evidence id."
}
```

Two drifts are host-derived: a changed path outside the declared surfaces, and
a clause whose bytes differ from the pin. Both are computed from the capsule,
so `verdict: on-mission` with either present still returns `drift`. Every
model finding must name a supplied clause, thesis or exclusion and supplied
evidence — a changed path, a decision id or the observed contract hash. An
unsupported one refuses the result, and the refusal is recorded as `unknown`,
which holds. Fail-conservative in both directions: the judge cannot certify a
pass over proven drift, and it cannot manufacture a drift out of nothing.

## WO-099-D003

```json
{
  "id": "WO-099-D003", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "A verdict other than `on-mission` sets `dispatchHeld` in the resident slice, refusing every phase actor except the mission check itself; a human answer or a fresh `on-mission` judgment over a capsule with a different hash clears it.",
  "evidence": ["packages/skeleton/src/resident-state.ts", "packages/skeleton/src/resident-store.ts", "packages/skeleton/test/mission-check.test.ts", "docs/product/03-architecture.md#operator-presence-policy"],
  "rejected": [{"option": "Let the implementer clear its own hold", "reason": "Declined in the order: the actor that drifted cannot certify that it stopped. `clearMissionHold` refuses when DOTLN_RESIDENT_EPISODE_ID is set."}, {"option": "Hold the mission check too", "reason": "Nothing could then observe the repair; the check is the supervision, not the work it holds."}, {"option": "Clear on any later `on-mission`", "reason": "Re-judging the same bytes would retire a finding nothing repaired, so the clearing capsule's hash must differ."}],
  "reopenWhen": "A recorded run wedges because the only clearance path is unavailable, or a hold is cleared without either a human answer or changed work."
}
```

The hold is a gate in the resident's own slice, folded from the validated
observation rather than from a separate claim. While it stands, `residentRefusal`
returns its reason for every other actor and the resident records the ordinary
`ScriptEpisodeRefused` NoOp. An unavailable verifier holds as `unknown` without
a correction event, because nothing was observed to correct. A restart that
loses an unobserved episode stays `ScriptEpisodeLost` and does not hold:
holding on every restart would wedge unattended operation on an event that is
already modelled, and the next pulse judges again.

## WO-099-D004

```json
{
  "id": "WO-099-D004", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "Record the drift as a distinct `MissionDriftObserved` correction event rather than reusing one of the four typed operator signals, and admit it only when it matches the hold the fold already derived.",
  "evidence": ["packages/skeleton/src/resident-state.ts", "packages/skeleton/src/resident-host.ts", "docs/product/02-domain-model.md#feedback"],
  "rejected": [{"option": "Append OperatorCorrectionReceived", "reason": "Its origin is the operator; a read-only episode claiming operator intent would corrupt the correction reactor's only authenticated input."}, {"option": "Record nothing beyond the hold", "reason": "The correction surface would lose the finding itself, which is the part a human reads."}],
  "reopenWhen": "The feedback reactor gains a non-operator correction path, or the separate event proves redundant with the hold in a recorded run."
}
```

## WO-099-D005

```json
{
  "id": "WO-099-D005", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "Give the mission-check episode `repo.read` as its only effect so the Contributor build hosts the cadence inside its existing base authority, instead of widening that base with `repo.read*` and `report.emit`.",
  "evidence": ["packages/skeleton/src/loadouts/mission-check.ts", "packages/skeleton/src/loadouts/contributor.ts", "packages/compiler/src/presence.ts"],
  "rejected": [{"option": "Reuse the plan refuter's `repo.read.plan-subject` and `report.emit` shape", "reason": "`compilePresence` would report AUTHORITY WIDENING, because the Contributor base allows `repo.read` without a wildcard and no `report.emit` at all."}, {"option": "Add the two effects to the Contributor envelope", "reason": "That widens the authority of every Contributor session for one read-only judge; the operator has not authorized it and the judge does not need it."}],
  "reopenWhen": "The mission check needs an effect beyond reading its own capsule, which is then an authority question for the operator rather than a compile detail."
}
```

The judge returns its judgment through the transport; there is no emit effect
to grant. The phase declares zero file and line ceilings, `writers: 0`, and
`requiredCapabilities: ["actor.cli-worker"]`. The saved build declares no
runtime capability, so the compiled phase is an honest NoOp naming the missing
adapter until a host supplies it.

## WO-099-D006

```json
{
  "id": "WO-099-D006", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "Extract the pure SHA-256 from the discovery wire digest into `sha256.ts` and reuse it for the capsule hash, keeping `discoveryOutputSha256` behaviour byte-identical.",
  "evidence": ["packages/skeleton/src/sha256.ts", "packages/skeleton/src/work-candidate.ts", "packages/skeleton/test/discovery.test.ts"],
  "rejected": [{"option": "Import node:crypto in the protocol", "reason": "The protocol modules are pure and replay-safe; the resident folds them without process access."}, {"option": "Copy the implementation", "reason": "Two copies of a digest drift silently."}],
  "reopenWhen": "A second digest shape is needed, or the extracted function diverges from the discovery digest in a recorded run."
}
```

## WO-099-D007

```json
{
  "id": "WO-099-D007", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "File the capability row at the fixture-evidenced level and leave the operator-run unattended row as the named remaining gate, rather than recording a live level this dispatch did not observe.",
  "evidence": ["docs/planning/capability-table.md", "scripts/evidence-mission-check.mjs", "docs/work-orders/WO-099-mission-check.md"],
  "rejected": [{"option": "Write the live-evidenced level now", "reason": "No live judgment has been observed; the order's own review assumption is that the operator runs the row outside the sandbox."}, {"option": "Hold the whole order until the row is run", "reason": "Every other deliverable is complete and reviewable; withholding them helps nobody."}],
  "reopenWhen": "The operator records docs/evidence/WO-099/live.json, at which point the row moves to the live-evidenced level or the failure is recorded under this order.",
  "followup": "Run node scripts/evidence-mission-check.mjs from an outside terminal, then update the WO-099 capability row and this order's report with the observed row."
}
```

## WO-099-D008

```json
{
  "id": "WO-099-D008", "date": "2026-09-20", "dispatch": "resume: next; WO-145 D001 selected WO-099 as the third economy trial",
  "kind": "experiment",
  "decision": "Use `npm run build` as the single per-iteration check during implementation instead of `npx tsc --noEmit` followed by a build before each test run.",
  "question": "Does a typecheck-only feedback loop cost less per implementation iteration than the full build, once the build that a test run needs anyway is counted?",
  "alternatives": ["npx tsc --noEmit per iteration, then npm run build before each test run (the method in use when the trial started)", "npm run build as the only iteration check", "no intermediate check, relying on the test run to surface type errors"],
  "observation": "Median wall-clock of three consecutive runs of each command on this worktree, with the incremental build cache warm, compared against the number of commands each method needs before a test run.",
  "budget": { "wallSeconds": 900 },
  "execution": "run",
  "cost": { "wallSeconds": 2.73, "tokens": null, "commands": ["for i in 1 2 3; do /usr/bin/time -p npx tsc --noEmit -p packages/skeleton/tsconfig.json; done", "for i in 1 2 3; do /usr/bin/time -p npm run build --silent; done"], "source": "/usr/bin/time -p real seconds, summed over the six timed runs; the preparation and recording around them are not separately metered in this harness and are not included in this number" },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["npm run build --silent"], "summary": "Typecheck median 0.21 s (0.37, 0.21, 0.20); build median 0.65 s (0.59, 0.71, 0.65), three runs each with a warm incremental cache. A test iteration under the old method ran both, 0.86 s, because the tests execute the built dist; under the new method it runs the build alone, 0.65 s. The measured effect is 0.21 s and one command removed per test iteration. The per-order total is unknown: this dispatch did not count its test iterations, and an estimate multiplied by a measured per-iteration figure would be an invented quantity. The unmetered preparation and recording above are also not counted against it. The three-trial reading should weigh the removed command, not a seconds total." },
  "outcome": "adopted",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["docs/evidence/WO-145/decisions.md", "packages/skeleton/tsconfig.json", "package.json"],
  "rejected": [{"option": "Keep the typecheck-only loop", "reason": "It does not produce the dist the tests execute, so every test run paid for a build as well; the loop was two commands where one suffices."}, {"option": "Drop the intermediate check", "reason": "A type error would then surface as a confusing test failure against stale dist bytes, which cost this order one misread failing run already."}],
  "reopenWhen": "The build stops being incremental or grows past a few seconds, or a later trial measures the same comparison on a cold cache and finds the opposite.",
  "followup": "The `tinkerer-economy` support was not equipped in this dispatch's briefing although WO-145 D001 selected WO-099 as a trial; equip it explicitly on the next trial dispatch, or record here that the operator chose not to."
}
```

## WO-099-D009

```json
{
  "id": "WO-099-D009", "date": "2026-09-20", "dispatch": "resume: next",
  "decision": "Accept a new saved Contributor build identity: adding the mission-check presence policy changes its semantic hash from fnv1a64:06245f5c581212f1 to fnv1a64:87aa6e1263d6d74d, and the live test pin moves with it.",
  "evidence": ["packages/skeleton/test/executor-supports.test.ts", "packages/skeleton/src/loadouts/contributor.ts", "docs/work-orders/WO-042-authority-provenance.md", "docs/work-orders/WO-099-mission-check.md"],
  "rejected": [{"option": "Keep the saved build unchanged and declare the policy elsewhere", "reason": "The order places the cadence in the Contributor build's presence policy; a policy nobody's build declares is not the deliverable."}, {"option": "Edit WO-042's recorded hash or the historical receipts", "reason": "Closed orders and filed receipts are immutable; that hash is the identity of the build at its own date."}],
  "reopenWhen": "A reviewed build change is proposed that does not need a new saved identity, or the pinned hash is found to be load-bearing for something other than build identity."
}
```

The Contributor build's updateLaws already say that equipment creates a new
build and that reviewed immutable versions are proposed rather than edited.
WO-042's criterion 4 recorded that *its* change preserved the saved hash; it
did not promise the build would never gain a policy. The old hash stays in
WO-042's order text, its verifications and every authority receipt filed
before today. Only the live assertion moves, with a comment naming why.

The support text itself was not installed for this dispatch: `tinkerer-economy`
defaults to off, the briefing's equipped list omitted it, and no Tinkerer clause
appeared in the role text. The operator raised the selection mid-dispatch, so
this trial is recorded under WO-145 D001's authority with the support's own
required fields, rather than by regenerating harness artifacts mid-session.

## WO-099-D010

```json
{
  "id": "WO-099-D010", "date": "2026-09-20", "dispatch": "resume: next; operator authorized both live episodes mid-dispatch",
  "kind": "correction",
  "decision": "File the capability row at the live-evidenced level: the operator chose that this session run the unattended row, so the live judgment D007 deferred now exists.",
  "misread": "D007 treated the order's operator-review assumption as settling who runs the unattended row, so it filed the row at the fixture-evidenced level and named the live run as a remaining gate.",
  "meant": "The assumption records that the row runs outside the sandbox without a terminal, not that the executor may never run it; the operator decides who does.",
  "changed": "Asked the operator, who chose that I run both live episodes on Codex gpt-6-astra xhigh. The row is recorded in live.json, the capability row now reads live-evidenced, and its remaining gate is the unattended hour, the repair loop and the single synthetic worktree rather than the row itself.",
  "evidence": ["docs/evidence/WO-099/live.json", "docs/planning/capability-table.md", "docs/work-orders/WO-099-mission-check.md"],
  "rejected": [{"option": "Leave the row at the fixture-evidenced level", "reason": "A filed level that understates observed evidence misleads the next planning pass as much as one that overstates it."}, {"option": "Claim dependable scope", "reason": "One synthetic worktree, one planted drift and 18.8 s support demonstrable, not dependable."}],
  "reopens": {"decisionId": "WO-099-D007", "observation": "The operator authorized this session to run the unattended row, and docs/evidence/WO-099/live.json records it as observed."},
  "reopenWhen": "The unattended hour (WO-111) or a repeated live run contradicts this single observation, or a run fails and is filed under this order."
}
```

The live judge added a finding the host does not derive: beside the structural
`contract:surfaces`, it named `contract:non-goals`, the fixture contract's own
"Editing the product documents" fence. Two independent runs produced the same
pair. That is the first evidence that the episode judges rather than restates.

## WO-099-D011

```json
{
  "id": "WO-099-D011", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until the resident can dispatch a mission check over changed work and a fresh passing resident observation clears the existing hold.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "packages/skeleton/src/cli-actor.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/resident-state.ts"],
  "rejected": [{"option": "Treat the direct runMissionCheck fixture as proof of resident behavior", "reason": "That helper builds a new command from the changed subject; the cadence path replaces the subject while retaining the command bound to the old hash."}, {"option": "Treat clearMissionHold's direct unit call as an automatic re-verification path", "reason": "No resident production path calls it, and the fold returns before clearing an existing hold even when it records a fresh on-mission observation."}],
  "reopenWhen": "A resident-level regression changes the source after actor declaration, reaches the model runner with the new subject hash, and clears an existing hold from the admitted fresh on-mission observation.",
  "followup": "In resume: fix, rebuild the mission-check authorization and request from the dispatch-time subject, append a validated MissionHoldCleared event for a fresh on-mission resident observation, and add a resident-level regression covering the changed-subject repair path."
}
```

## WO-099-D012

```json
{
  "id": "WO-099-D012", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until the mission capsule either represents the complete active diff and contract or returns unknown when an explicit bound is exceeded.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts"],
  "rejected": [{"option": "Accept tracked paths 1 through 100 as the active diff", "reason": "The 101st tracked path can be the only outside-surface edit, and the host then accepts on-mission with no finding."}, {"option": "Ignore untracked files because git diff ignores them", "reason": "This repository forbids branch commits before final review, so new implementation files are ordinarily untracked while the mission check is meant to supervise them."}, {"option": "Silently truncate oversized contract clauses", "reason": "Two contracts that differ only after byte 4000 project to the same clause and defeat the promised mid-episode change finding."}],
  "reopenWhen": "Regressions prove that untracked paths are judged, overflow paths and diff bytes fail closed instead of disappearing, and contract projection refuses or faithfully represents text beyond its bound.",
  "followup": "In resume: fix, include untracked work in the capsule, replace silent path/diff/clause truncation with complete bounded input or an explicit unknown/refusal, and add adversarial regressions for an untracked outside path, the 101st tracked path, and a clause change after byte 4000."
}
```

## WO-099-D013

```json
{
  "id": "WO-099-D013", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until the current Contributor mission-policy identity and the historical saved Contributor identity both reproduce under the authority-evidence gate.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "scripts/authority-evidence.mjs", "packages/skeleton/src/loadouts/contributor.ts", "docs/evidence/WO-042/authority-baseline.json"],
  "rejected": [{"option": "Replace the historical fixture hash with the current build hash", "reason": "D009 explicitly preserves the old saved identity and immutable historical receipts while accepting a distinct current identity."}, {"option": "Remove the mission policy from the current Contributor graph", "reason": "That would discard WO-099's delivered cadence instead of repairing identity versioning."}],
  "reopenWhen": "One fresh authority-evidence run compiles the historical Contributor at fnv1a64:06245f5c581212f1 and the current live build at its reviewed new identity without editing historical receipts.",
  "followup": "In resume: fix, version or reconstruct the historical Contributor graph used by authority-evidence while retaining the current mission policy, and add a regression that proves both identities in one run."
}
```

## WO-099-D014

```json
{
  "id": "WO-099-D014", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until a new immutable feedback evidence revision validates the completed WO-099 feedback source set.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "docs/evidence/WO-099/feedback/feedback.json", "docs/evidence/current.json", "scripts/feedback-evidence.mjs", "scripts/lib/evidence-sources.mjs"],
  "rejected": [{"option": "Rewrite the selected WO-099 feedback edition", "reason": "The evidence writer and repository policy make filed editions immutable."}, {"option": "Accept the ten reproduced fixture outcomes without matching the subject", "reason": "The evidence subject hash changed because the selected source set includes WO-099 files modified after the edition was recorded."}],
  "reopenWhen": "A newly selected immutable revision records the completed source hash, reproduces all feedback regressions and passes its required self-host validation.",
  "followup": "In resume: fix, record and validate a new immutable WO-099 feedback revision after all implementation repairs, including the required self-host evidence, then update docs/evidence/current.json to select it."
}
```

## WO-099-D015

```json
{
  "id": "WO-099-D015", "date": "2026-09-20", "dispatch": "resume: fix",
  "kind": "correction",
  "decision": "Rebuild the mission-check command, authorization and request from the capsule observed at dispatch, and let the resident append `MissionHoldCleared { origin: \"verified-repair\" }` itself when an admitted `on-mission` covers a capsule the held judgment did not.",
  "misread": "The first implementation completed the capsule at dispatch but reused the command built when the actor was declared, and read the fold's early return on a pass as sufficient for the promised repair clearance.",
  "meant": "A cadence exists to judge work as it now reads, so the authorization must be bound to the capsule each pulse observed; and a clearance that no production path can append is not a clearance.",
  "changed": "`startCliEpisode` now calls `buildMissionCheckRequest` with the observed subject and this episode's identity, `cliActorRequest` no longer swaps a subject into a stale command, and the resident host appends the validated clearance from the verdict the fold derived. A resident-level regression drives the whole path and keeps a negative control that the stale request shape is still refused.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "packages/skeleton/src/cli-actor.ts", "packages/skeleton/src/resident-host.ts", "packages/skeleton/test/mission-check.test.ts"],
  "rejected": [{"option": "Relax `validateMissionCheckRequest` so a request may carry a subject its command does not name", "reason": "The payload binding is what stops a capsule being swapped under an authorization; loosening it to fix a dispatch bug would trade the guarantee for the convenience."}, {"option": "Clear the hold inside `foldMissionJudgment`", "reason": "The fold is a pure reducer over recorded events; a hold retired without its own event would leave the clearance unauditable and unreplayable."}, {"option": "Also let an `on-mission` over unchanged bytes clear an `unknown` hold", "reason": "D003 requires a different capsule hash so that re-judging the same bytes cannot retire a finding. A recovered verifier that judges unchanged work therefore still waits for a human; that is the accepted cost, not an oversight."}],
  "reopens": {"decisionId": "WO-099-D003", "observation": "The clearance D003 describes had no resident path: the cadence refused every changed capsule and the fold returned before appending the event."},
  "reopenWhen": "A recorded run shows the rebuilt authorization refusing honest work, or an `unknown` hold over unchanged work wedges a real session because the recovered verifier cannot clear it."
}
```

The cadence and the clearance were two halves of one promise. The episode
observed the work as it now reads and then asked for permission to judge the
work it was declared with, so every pulse over real change was refused before a
model ran; and the only function that could retire a hold had no caller outside
the tests. The repair joins both to the capsule the pulse actually observed.

## WO-099-D016

```json
{
  "id": "WO-099-D016", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Make the capsule complete or make it say so: every changed path, tracked or untracked, is named or the observation refuses; diff text is carried a whole path at a time with the unfitted paths listed in `omittedPaths`; and the host cannot record `on-mission` while any path is listed there.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts"],
  "rejected": [{"option": "Keep the silent first-100-paths and first-100,000-character caps", "reason": "The 101st path can be the only out-of-surface edit, and the evidence-id list is built from the same truncated array, so no finding could even name it."}, {"option": "Let a pass stand over named omissions", "reason": "Naming what the judge could not read makes the gap visible but does not close it; certifying work nobody read is the false negative this episode exists to prevent."}, {"option": "Raise the diff bound until every worktree fits", "reason": "This worktree alone carries 1.97 MB of generated evidence logs beside a 379,845-character source diff; there is no bound that both fits every session and remains a prompt."}, {"option": "Cut oversized contract clauses as before", "reason": "Two contracts differing only after the bound projected to identical clauses, which defeats the mid-episode change rule outright; parts keep the whole clause."}],
  "reopenWhen": "A recorded run holds as `unknown` on an ordinary session because generated evidence crowds the capsule, which is the signal that the source needs a declared selection policy rather than a larger bound.",
  "followup": "Known limitation for planning, not repaired here: on a worktree whose untracked generated evidence exceeds the diff bound the cadence holds as `unknown` every pulse until a human answers. The bounded fix is a declared selection policy on `MissionSource` (surface-first, generated evidence excluded) rather than a larger bound; it changes what the judge is shown, so it is a product decision for a separate order."
}
```

The bounds are now named in one place and none of them drops evidence quietly.
Untracked work is carried as the new file it is, which matters here more than
elsewhere: branch commits are forbidden before final review, so new work is
ordinarily untracked during the exact interval the check supervises. Sections
are chosen smallest first so that one generated log cannot crowd every source
change out of the capsule, and the text is still emitted in the order git
listed the paths. What does not fit is named, and a pass over it is `unknown`,
which holds and asks a human. The cost is real and recorded: on an
evidence-heavy worktree the cadence will hold rather than pass, and the
reopening condition above is the signal to give the source a selection policy.

## WO-099-D017

```json
{
  "id": "WO-099-D017", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Reconstruct the pre-WO-099 Contributor graph as `contributorLoadoutBeforeMissionCheck` and compile both identities in one authority-evidence run, then record the current build in a new authority edition (WO-099 revision 001) rather than rewriting WO-146's.",
  "evidence": ["docs/verifications/WO-099/VER-001.md", "packages/skeleton/src/loadouts/contributor.ts", "scripts/authority-evidence.mjs", "docs/evidence/WO-099/authority/001/authority.json", "docs/evidence/current.json"],
  "rejected": [{"option": "Move WO-042's saved hash to the new build", "reason": "D009 keeps the old identity with its own date and every receipt filed under it; the gate exists to prove that build still compiles to it."}, {"option": "Drop the mission policy from the Contributor graph", "reason": "The order places the cadence in the Contributor build's presence policy; removing it would discard the deliverable to satisfy a hash."}, {"option": "Rewrite the WO-146 authority edition in place", "reason": "Filed editions are immutable, and the script's own failure names selecting a new edition as the remedy."}],
  "reopenWhen": "The two graphs diverge by anything other than the mission-check presence policy, which the gate asserts directly, or a later build needs a second historical reconstruction and the pattern should become a versioned list."
}
```

The historical graph is derived from the current one by removing the single
policy WO-099 added, and the gate asserts that this is the only difference
before compiling it — so the reconstruction cannot quietly become a hand-edited
graph that happens to hash correctly. Both identities are now proved in one
run, in the script and again in `executor-supports.test.ts`.

## WO-099-D018

```json
{
  "id": "WO-099-D018", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until the resident preserves host-derived structural drift when the model episode fails after the dispatch-time capsule was observed, so the drift still records its finding and semantic correction instead of becoming an empty unknown hold.",
  "evidence": ["docs/verifications/WO-099/VER-002.md", "packages/skeleton/src/cli-actor.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/resident-state.ts"],
  "rejected": [{"option": "Treat every unavailable verifier as unknown even when the host already proved an outside-surface or changed-contract finding", "reason": "The structural finding is derived from the capsule without model judgment; discarding it changes a known drift into an unsupported unknown and suppresses the correction event."}, {"option": "Rely on runMissionCheck's failure normalization", "reason": "The cadence uses startCliEpisode and foldMissionJudgment, whose failure path carries the subject but no normalized judgment; the direct helper's correct result is not the resident's behavior."}],
  "reopenWhen": "A resident-level regression combines an outside-surface or changed-contract capsule with an unavailable or invalid verifier and records drift, the supported structural finding and exactly one MissionDriftObserved event.",
  "followup": "In resume: fix, normalize a failed CLI mission episode that has an observed subject through validateMissionCheckResult with an unknown model result before folding it, preserve the failure detail separately, and add resident-level unavailable and invalid-result regressions over host-provable drift."
}
```

The host already has enough evidence to decide this case. The same outside-
surface subject normalizes to `drift` through `validateMissionCheckResult`, but
the resident's failure path skips that function and folds the absence of a
worker result as `unknown`. The repair must join those two paths without
turning a genuinely unobserved capsule into a claimed drift.

## WO-099-D019

```json
{
  "id": "WO-099-D019", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until every mission-source read stays inside the canonical worktree and untracked symlinks are represented as links or fail closed, never followed into outside-worktree bytes that a model can receive under an on-mission capsule.",
  "evidence": ["docs/verifications/WO-099/VER-002.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts"],
  "rejected": [{"option": "Treat a repository-relative symlink path as proof that its bytes are repository-contained", "reason": "readFileSync follows the link; the path passes missionPath while the bytes can come from any readable host file."}, {"option": "Trust the model not to use outside bytes", "reason": "The privacy and capsule boundary is a host obligation, and the current validator admits a claimed on-mission result with no omission or finding."}],
  "reopenWhen": "A regression places a symlink inside a declared surface with a target outside the worktree and proves that no target bytes enter the capsule, while ordinary untracked regular files remain represented and judged.",
  "followup": "In resume: fix, lstat and containment-check every MissionSource file read, encode an untracked symlink from its link target and Git mode or list it in omittedPaths/refuse, bound reads before allocation, and add inside/outside symlink plus oversized-file regressions."
}
```

The probe used only a synthetic marker in system temporary storage. An
untracked link under the declared fixture surface caused that outside marker to
appear in `diff.text`; `omittedPaths` stayed empty and a claimed pass was
admitted as `on-mission`. No real private file was read.

## WO-099-D020

```json
{
  "id": "WO-099-D020", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Fold a mission episode that failed after observing its capsule through the same `validateMissionCheckResult` normalization an `unknown` model result takes, so a structural finding the host already proved still records `drift`, appends `MissionDriftObserved` and raises the hold; the hold's reason then names both the finding and the missing model judgment.",
  "evidence": ["docs/verifications/WO-099/VER-002.md", "packages/skeleton/src/resident-state.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts", "docs/evidence/WO-099/mission-fixtures.tap"],
  "rejected": [{"option": "Attach the derived judgment to the worker observation in `startCliEpisode`", "reason": "The CLI observation contract is result exclusive-or failure, and recording a host-derived verdict as a worker result would claim a model judged what no model saw."}, {"option": "Leave the failure branch at `unknown` and wait for the human answer", "reason": "That is the defect: it downgrades a drift the capsule proves into an empty hold, drops the correction event and hands the finding back to the person the cadence exists to protect."}, {"option": "Derive the verdict but keep the old unavailable-verifier wording", "reason": "A returning human must be able to tell a proved drift from a silent verifier, so the reason carries both rather than one."}, {"option": "Let the absent judgment fail the fold instead of holding", "reason": "The fold is replayed over recorded events; an unusable capsule must still hold as `unknown` rather than make the log unreplayable."}],
  "reopenWhen": "A recorded run derives a drift from a capsule its episode did not really observe, or the fold's normalization is reached with a subject that no longer validates and the hold stops being raised at all."
}
```

The host and the model are two different sources of a finding, and only one of
them failed. `runMissionCheck` already preserved the distinction; the cadence's
own path did not, so the same normalization now sits in the fold, where every
recorded observation passes through it. A capsule that was never observed is
still genuinely unjudged and still holds as `unknown` with no correction: the
in-surface unavailable-verifier fixture proves that case is untouched.

## WO-099-D021

```json
{
  "id": "WO-099-D021", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Bound the capsule by the worktree as well as by size: every mission-source read must resolve to a regular file inside the canonical worktree and is size-checked before allocation, and an untracked symlink is carried as the link Git records — mode 120000 with its target as the content — rather than followed.",
  "evidence": ["docs/verifications/WO-099/VER-002.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/test/mission-check.test.ts", "docs/evidence/WO-099/mission-fixtures.tap"],
  "rejected": [{"option": "Treat a repository-relative name that passed `missionPath` as proof the bytes are repository-contained", "reason": "The name says nothing about where the bytes live; the verifier's probe put a file from outside the worktree into `diff.text` under a claimed pass."}, {"option": "List every untracked symlink in `omittedPaths` instead", "reason": "It fails closed but holds any session containing an ordinary link as `unknown`; representing the link keeps the diff complete and still carries no outside bytes."}, {"option": "Refuse a declared contract, story or vision path that is a symlink", "reason": "A contained link is ordinary in this repository — `AGENTS.md` is a tracked 120000 link to `CLAUDE.md` — so containment of the resolved bytes is the property worth checking, not the spelling of the path."}, {"option": "Keep measuring the size after `readFileSync`", "reason": "The bound would then apply after the allocation it exists to prevent, and a device or fifo has no size that reading it respects."}],
  "reopenWhen": "An ordinary session's untracked link or contained symlinked document is refused or omitted where Git would have shown it, or a recorded capsule is found carrying bytes from a path outside the worktree."
}
```

The privacy and boundary obligation is the host's, not the judge's: the capsule
is the only thing the episode is allowed to see, so what enters it has to be
what the worktree holds. Representing the link rather than refusing it keeps
the complete-diff rule D016 established — the judge still sees that a link was
added, and where it points — while the bytes behind it stay where they are.

## WO-099-D022

```json
{
  "id": "WO-099-D022", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until every admitted mission capsule can carry its host-normalized structural findings through resident observation and replay without losing the hold at the result-admission boundary.",
  "evidence": ["docs/verifications/WO-099/VER-003.md", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/cli-actor-contract.ts", "packages/skeleton/src/resident-state.ts", "packages/skeleton/src/resident-host.ts"],
  "rejected": [{"option": "Accept the green eight-case fixture suite as sufficient", "reason": "A 102-path capsule inside the declared 400-path limit produced 101 structural findings; readmission rejected the normalized result, the tick threw, and no hold or correction was recorded."}, {"option": "Silently truncate structural findings to the model's 100-finding input limit", "reason": "This would discard host-proved evidence rather than make the result contract closed under its own normalization."}],
  "reopenWhen": "A resident-level regression with more than 100 supported structural findings records drift, its hold and correction, and replays successfully while retaining the unavailable-verifier behavior.",
  "followup": "In resume: fix, separate model-input bounds from normalized host-result admission or otherwise make the admitted capsule/result bounds consistent; ensure a host-generated result revalidates and the resident cannot lose the hold before recording the observation. Cover model-answer and unavailable paths plus combined path/clause finding bounds, without silently dropping findings."
}
```

The unavailable-runner control on the same 101-outside-path worktree recorded
drift and one correction, confirming D020's repair. The answered path failed
earlier: transport normalization added 101 findings, and `assertCliObservation`
rejected them under the 100-supplied-finding limit. VER-003 F1 records the exact
observed/expected distinction and reproduction. This is a bounded repair to the
existing episode contract, not an authorization to change the worktree source
from the verifier session.

## WO-099-D023

```json
{
  "id": "WO-099-D023", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until decision-history projection distinguishes a genuinely absent optional file from a present file it cannot safely read, and honors the declared last-N window including zero.",
  "evidence": ["docs/verifications/WO-099/VER-003.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts", "docs/work-orders/WO-099-mission-check.md"],
  "rejected": [{"option": "Treat every decision read failure as an empty history", "reason": "An existing committed history over 200000 bytes lost its final valid decision with no incompleteness marker; an empty model pass was admitted as on-mission and the omitted decision was not present in the diff."}, {"option": "Interpret decisionLimit zero as the whole history", "reason": "Zero is an admitted last-N window, while slice(-0) returns all rows and defeats that declared bound."}],
  "reopenWhen": "Regression evidence shows bounded complete last-N input or explicit refusal/incompleteness for present unreadable histories, and zero decisions for a zero window, while an absent optional history remains supported.",
  "followup": "In resume: fix, preserve the reason for existing decision-source failures instead of swallowing size/containment/read errors as absence; refuse or mark incomplete so no pass is certified without the required history. Correct the zero-window slice and cover missing versus oversized or outside-resolving histories and limits zero/one/N."
}
```

VER-003 F2 used only synthetic committed fixture history. Its final valid JSON
decision was absent from both `observation.decisions` and the diff, yet the
claimed pass remained admissible. The separate zero-window probe returned one
decision when none was requested. The repair should retain the filesystem
containment and pre-allocation checks D021 established.

## WO-099-D024

```json
{
  "id": "WO-099-D024", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Make the mission-check result contract closed under its own normalization: the hundred-finding bound counts only findings the judge adds beyond the host's own, every host-derived reason is cut to one admitted line, and a normalized result therefore passes `validateMissionCheckResult` again unchanged at admission and on replay.",
  "evidence": ["docs/verifications/WO-099/VER-003.md", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts", "docs/evidence/WO-099/mission-fixtures.tap"],
  "rejected": [{"option": "Raise the single bound to the sum of the capsule's path and clause bounds", "reason": "One number would then bound the judge at 800 findings and still fail on a host reason longer than a line; the defect is that one bound served two inputs, not its value."}, {"option": "Skip revalidation of a host-normalized result at admission", "reason": "Admission and replay must not take any producer's word for a hold; the same contract judges every recorded observation, so it has to admit what the host itself produces."}, {"option": "Truncate host findings to the judge's bound", "reason": "Discards evidence the capsule proves, which D022 already rejected."}],
  "reopenWhen": "A normalized result fails its own revalidation for any admitted capsule, or a judge's finding is refused because it repeats a host finding."
}
```

The judge and the host are two producers with two bounds. The judge's is a
model-input limit and stays at a hundred, now counted as what the judge adds
beyond the findings the host derives itself; the host's findings are bounded by
the capsule's own path and clause bounds and by the one-line rule every finding
already meets. `validateMissionCheckResult(validateMissionCheckResult(x))` is
therefore the identity, which is exactly what `assertCliObservation`, the fold
and the verified-repair clearance require of it. The regression holds 203 host
findings — one of them with a reason that would have run past the line — and
100 of the judge's through the direct validator, and 400 through the resident
with an answering and an unavailable judge.

## WO-099-D025

```json
{
  "id": "WO-099-D025", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "The resident records a CLI judgment the actor contract refuses as the failed episode it is — `invalid-result` with its launch and the capsule the episode observed — instead of letting the refusal throw out of the observation transaction, so the fold still derives and holds whatever the capsule proves.",
  "evidence": ["docs/verifications/WO-099/VER-003.md", "packages/skeleton/src/resident-host.ts", "packages/skeleton/src/cli-actor-contract.ts", "packages/skeleton/test/mission-check.test.ts"],
  "rejected": [{"option": "Rely on D024's closure alone", "reason": "Closure removes the reproduced cause, but any future representational refusal would again leave the episode dispatched and nothing held; the fold already holds a capsule without a judgment (D020), so the host should reach it."}, {"option": "Record the refused result as if it were the judgment", "reason": "The observation contract is result exclusive-or failure, and a refused result is not a judgment the host may act on."}, {"option": "Absorb every admission error", "reason": "A refused launch or script observation is a contract violation the log must not absorb; only a refused CLI result with an observed capsule is replaced, and the replacement must pass the same contract or the original refusal stands."}],
  "reopenWhen": "A recorded `invalid-result` observation is found whose result would have been admissible, or the replacement itself is refused on an ordinary run."
}
```

VER-003's expectation was that a representational failure must not leave the
episode pending without its hold. D024 makes the reproduced failure impossible;
this decision makes the class impossible: whatever refuses a CLI result at
admission, the episode is recorded, the capsule is kept, and the hold's reason
says `no model judgment: invalid-result` beside any drift the host proved.

## WO-099-D026

```json
{
  "id": "WO-099-D026", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Carry the decision history's incompleteness in the capsule: `observation.omittedDecisions` names why a declared history that exists could not be read inside the boundary, an absent optional history stays an empty whole window, a zero window reads nothing, and no pass is certified while the field is set. The capsule keeps `mission-check-v1`: the shape has not shipped.",
  "evidence": ["docs/verifications/WO-099/VER-003.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts", "docs/product/03-architecture.md"],
  "rejected": [{"option": "Refuse the whole observation when the history cannot be read", "reason": "Fails closed but judges nothing: the structural findings are never derived, the judge never sees the diff, and the hold's only word is `profile-refused`; naming the omission keeps the diff judged and the hold explicit, exactly as `omittedPaths` does."}, {"option": "Read only the tail of an oversized history", "reason": "A block cut at the head of the tail is skipped by the parser, which is the same silent loss in a smaller window; a named omission is honest at the declared bound."}, {"option": "Bump the schema version for the added field", "reason": "`mission-check-v1` is unreleased and no recorded capsule exists outside fixtures; the order classifies the release as minor with no schema version change."}],
  "reopenWhen": "An ordinary order's decisions file passes the 200,000-byte bound and holds every pulse as `unknown`, in which case a larger bound or a tail read with explicit incompleteness is the next decision; or a capsule recorded before this change must be replayed."
}
```

Absence is never inferred from a failed read: the source `lstat`s the declared
path first, and only `ENOENT`/`ENOTDIR` mean the history does not exist yet.
Everything else the bounded reader refuses — size, containment, a special
file — becomes the named reason. The judge is told in the capsule and in its
instructions, the direct validator turns a claimed pass into `unknown`, a named
drift still stands, and the resident regression holds an in-surface diff over
an uncarried history with no correction event.

## WO-099-D027

```json
{
  "id": "WO-099-D027", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Defer correcting the hold reason for an `unknown` verdict the host derived from a judge's answer: the fold words it `returned no judgment (verifier unavailable)` although the judge answered and the capsule was incomplete. The wording lives in `resident-state.ts`, a registered feedback behavior source, so the correction needs a fresh live feedback edition this repair should not spend on a parenthetical.",
  "evidence": ["packages/skeleton/src/resident-state.ts", "packages/skeleton/test/mission-check.test.ts", "scripts/lib/evidence-sources.mjs", "docs/product/07-execution-guide.md#independent-workflows-and-integration"],
  "rejected": [{"option": "Reword the fold now", "reason": "Changes a registered feedback source and demands another paid live self-host audit for a wording fix; the verdict, the hold and the correction rule are correct, only the reason's parenthetical is wrong."}, {"option": "Leave it unrecorded", "reason": "A returning human reads the reason and would look at the transport rather than the capsule."}],
  "reopenWhen": "The next order that changes `resident-state.ts` and records a feedback edition, or an operator reads a misleading `verifier unavailable` on a hold over an incomplete capsule.",
  "followup": "When `resident-state.ts` next changes with a fresh feedback edition, word the `unknown` hold from an answered judge as an incomplete capsule — naming the omitted paths and the omitted decision history — rather than `verifier unavailable`, and cover it with a resident regression over an uncarried history."
}
```

The same wording already served a pass over omitted paths before this repair,
so the defect is inherited rather than introduced; the new `omittedDecisions`
case makes it reachable one more way. It is boarded up here and in the
follow-up register rather than left as a report sentence.

## WO-099-D028

```json
{
  "id": "WO-099-D028", "date": "2026-09-20", "dispatch": "scope expand: merge it now",
  "decision": "Integrate `main` into the WO-099 worktree during this repair on the operator's explicit scope expansion, and retime the order's release and component bump under their recorded classification: the uncommitted work was preserved in the retained stash `9e50af828bfe82b57d8c01c0f61e98a70104ad36` (`wo-099-integrate-main-2026-09-20`), `wo-099` fast-forwarded from `920c5fd2` to `47910753` (WO-110) without a commit, the stash was re-applied with 22 conflicts resolved — 18 generated surfaces regenerated, the follow-up register and control projection unioned by id, the evidence selection re-pointed, and `actor-contract.ts` keeping both the `local` and `missionSource` slots — the unpublished release moved from `v0.36.0` to `v0.37.0` because `v0.36.0` is the observed baseline, and the skeleton bump WO-110 consumed at `0.32.0` moved to `0.33.0` with its declared additive impact, in the package manifest, the console workspace pin, the lockfile and `HARNESS_HOST_VERSION`.",
  "evidence": ["docs/product/07-execution-guide.md#independent-workflows-and-integration", "docs/evidence/WO-099/repair-003.md", "docs/evidence/WO-099/authority/004/authority.json", "docs/evidence/WO-099/feedback-005/feedback.json", "docs/evidence/current.json", "docs/product/06-roadmap.md", "packages/skeleton/package.json"],
  "rejected": [{"option": "Leave integration to the final-review session as product 07 assigns it", "reason": "The operator expanded this dispatch's scope explicitly; the checklist product 07 names is what ran, and the reviewer still records both bases and the carried-forward claims."}, {"option": "Merge with a work-in-progress commit on the branch", "reason": "The branch had no commits beyond the merge base, so a fast-forward moves it without a commit authored before final review; the stash preserves the pre-integration tree as a retained recovery entry."}, {"option": "Keep the skeleton at 0.32.0 and let the reviewer retime", "reason": "The documentation gate's release-surfaces check fails on the integrated tree until the consumed bump is retimed, and an unmet check at handoff would route straight back to repair."}],
  "reopenWhen": "The final review finds a claim this integration changed that the fresh evidence editions do not cover, or the retained stash is needed to reconstruct the pre-integration tree."
}
```

Both evidence editions were stale on the integrated tree, since WO-110 changed
seven of the same registered sources this order changes. The selections are
now authority revision 004 and feedback revision 005, the latter over a fresh
live Codex self-host audit the operator authorized in this dispatch. Two
editions minted in this session are residue: authority 003 and feedback 004
were recorded before the documentation gate surfaced the version collision,
and the retimed bump moved both the runtime snapshot and the lockfile's console
pin, which the feedback projection deliberately keeps. The ordering cost is
recorded in the repair report rather than hidden; the residue is the
repository's normal shape and nothing selects it.

## WO-099-D029

```json
{
  "id": "WO-099-D029", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until work the repository's own ignore rules exclude can no longer be certified `on-mission`: an out-of-surface entry Git reports as ignored must either become a host-derived finding or be named as an omission over which no pass is admitted, and the judge's instructions must describe the list it is actually given.",
  "evidence": ["docs/verifications/WO-099/VER-004.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts", ".gitignore", "docs/product/03-architecture.md#operator-presence-policy"],
  "rejected": [{"option": "Accept the exclusion as the ordinary meaning of `the work`", "reason": "Nothing in the order, the product documents or D001-D028 records it, while the capsule's own contract and the judge's instructions both assert the path list is complete, tracked or untracked; a judge told the list is complete cannot compensate for it."}, {"option": "Carry every ignored path into the capsule", "reason": "`node_modules/` and `dist/` exhaust the 400-path bound immediately, so the observation would refuse on every ordinary pulse and the check would hold forever."}, {"option": "Reword the judge's instructions and leave the observation as it is", "reason": "Criterion 1 asks for a `drift` naming the clause over an out-of-surface edit; disclaiming the gap leaves that case unmet for `docs/intake/**`, `.env`, `/docs/control/local/` and `/.claude/settings.local.json`."}],
  "reopenWhen": "An ignored out-of-surface entry is observed as a finding or named as an omission that forbids a pass, a boundary regression covers both the ignored and the control case, and the capsule's completeness wording matches what the observation collects.",
  "followup": "In resume: fix, collect ignored entries with the bounded `git ls-files --others --ignored --exclude-standard --directory` form the repository already uses in `source-change-worktree.ts`, decide per entry between a structural finding and a named omission, keep the result closed under the VER-003 F1 normalization, and add a regression that plants out-of-surface work behind the repository's own rules beside the unignored control."
}
```

## WO-099-D030

```json
{
  "id": "WO-099-D030", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "Fail verification until a judge that repeats a host-derived finding can no longer replace the host's own reason in the normalized result, the hold and the `MissionDriftObserved` correction event.",
  "evidence": ["docs/verifications/WO-099/VER-004.md", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/src/resident-state.ts", "docs/product/02-domain-model.md#feedback"],
  "rejected": [{"option": "Treat it as harmless because the verdict and the hold still stand", "reason": "02 §Feedback describes the correction event as the record that carries the finding itself; the sentence a returning human reads is the host's proof that the path is outside the declared surfaces, and model prose asserting a standing exception stands in its place."}, {"option": "Reject any judge finding whose key matches a host finding", "reason": "Agreement is legitimate and costs the judge nothing under the repaired bound; refusing the whole result would turn ordinary agreement into `unknown` and hold on it."}],
  "reopenWhen": "A regression returns the host's own findings from the judge with altered reasons and observes the host's text in the normalized result, the hold's findings and the correction payload, with the result still closed under its own normalization.",
  "followup": "In resume: fix, let the host's entry win its own (kind, reference, evidence) key in `validateMissionCheckResult` — or keep a judge's agreement in a separate field — without changing the finding order or breaking the readmission the VER-003 F1 regressions assert."
}
```

## WO-099-D031

```json
{
  "id": "WO-099-D031", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Detect ignored work without exporting private ignored material: pin Git's directory-collapsed ignored inventory as SHA-256 path ids keyed by a random per-pin salt plus hashes of lstat kind/mode/size/mtime metadata, then expose only entries added, removed or metadata-changed since that pin and whether each lies outside the declared surfaces. Any changed ignored entry prevents an on-mission pass; an outside-surface entry is a host-derived drift naming contract:surfaces. Existing ignored entries remain baseline. The pin persists the salt, salted ids and metadata hashes, while ignored names, bytes and the salt are never sent to the judge.",
  "evidence": ["docs/verifications/WO-099/VER-004.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts", "docs/product/03-architecture.md#operator-presence-policy"],
  "rejected": [{"option": "Treat every currently ignored entry as changed work", "reason": "Installed dependencies, build output and resident state already exist in ordinary worktrees; counting the baseline would make every pulse hold forever."}, {"option": "Enumerate and carry every ignored file or its contents", "reason": "The current worktree has thousands of ignored leaves, and ignored material includes clean-room intake, environment files and operator-owned settings whose names or bytes must not cross the model boundary."}, {"option": "Hash ignored file contents", "reason": "A content hash would improve same-metadata detection but requires reading credentials and private intake that the mission episode has no need or authority to inspect."}, {"option": "Only correct the prompt's completeness wording", "reason": "That leaves the executable VER-004 counterexample certified on-mission and does not meet criterion 1's required out-of-surface drift."}],
  "reopenWhen": "A relevant ignored mutation preserves the collapsed entry's lstat metadata, a nested change under one collapsed directory must be distinguished, or a repository needs more than 400 collapsed changed entries; then add a local provenance source or a stronger privacy-preserving inventory rather than reading ignored contents into the capsule."
}
```

This is the smallest intervention that preserves the useful existing behavior:
tracked and ordinary untracked bytes still reach the judge, existing ignored
build/runtime roots do not create a permanent hold, and the two private ignored
fixture payloads are absent from both the subject and the prompt. NoOp retains a
false pass; carrying all ignored leaves consumes shared context and creates a
self-defeating supervisor. The metadata boundary is explicit and reversible.

**Correction, 2026-09-20 (WO-099 VER-005 F1).** The clause above — that existing
ignored build and runtime roots do not create a permanent hold — described the
intent, not the shipped code: the kind/mode/size/mtime fingerprint applied to
collapsed directories as well, and one ordinary build moved `.runtime/` and each
`dist/` off the baseline for good. The decision's reopen condition anticipated
exactly this case and [D034](#wo-099-d034) settles it by fingerprinting a
collapsed directory with its kind and mode alone. D031's privacy boundary — no
ignored names, bytes or salt across the model boundary — is unchanged.

## WO-099-D032

```json
{
  "id": "WO-099-D032", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "When the judge repeats a host-derived finding's exact kind/reference/evidence key, keep the host entry and reason, preserve structural-first order, and drop the duplicate agreement. The normalized result, resident hold and MissionDriftObserved payload therefore retain the host's proof while remaining closed under readmission.",
  "evidence": ["docs/verifications/WO-099/VER-004.md", "packages/skeleton/src/mission-check-protocol.ts", "packages/skeleton/test/mission-check.test.ts", "docs/product/02-domain-model.md#feedback"],
  "rejected": [{"option": "Let the later judge entry replace the host entry", "reason": "That is the reproduced defect: model prose can assert an exception where the host's proof belongs in the correction record."}, {"option": "Reject the whole judgment on a duplicate key", "reason": "Agreement is ordinary and already costs no model-finding capacity; turning it into unknown adds a hold without improving evidence."}, {"option": "Keep both reasons as two findings", "reason": "The finding key defines one observation, and duplication would change ordering, counts and every consumer without adding a separately typed field."}],
  "reopenWhen": "A consumer needs to preserve judge agreement as separately typed commentary; add a field with its own trust semantics rather than replacing or duplicating the host finding."
}
```

## WO-099-D033

```json
{
  "id": "WO-099-D033", "date": "2026-09-20", "dispatch": "resume: verify",
  "decision": "A metadata-only move of an ignored entry already present in the mission baseline must not by itself prevent an on-mission pass or raise a host-derived drift. The fourth repair fingerprints a git directory-collapsed ignored root by lstat kind/mode/size/mtime, and two ordinary build effects move a collapsed root's own metadata: atomicBuild creates and removes a staging directory directly under .runtime/, and publishBuildTree renames tsconfig.tsbuildinfo into each dist/. The pin is fixed at actor declaration, so after one npm run build the entries never match the baseline again and every later pulse holds: drift outside the declared surfaces, unknown inside them. Neither a human answer nor a verified repair retires it, because the next pulse re-raises it over no new work. Product 03 lines 1952-1953, repair-004's retained limits and D031's rejected-option rationale all assert the opposite property and must state what the code does.",
  "evidence": ["docs/verifications/WO-099/VER-005.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/src/cli-actor.ts", "scripts/build.mjs", "docs/product/03-architecture.md#operator-presence-policy"],
  "rejected": [{"option": "Accept the hold as fail-conservative and close the order", "reason": "The cadence exists to let unattended work continue and stop only on real drift; a supervisor that holds after every build stops all unattended work and floods MissionDriftObserved, the one record 02 Feedback says a returning human reads."}, {"option": "Read ignored file contents to distinguish a real change", "reason": "D031 already refused this: ignored material includes clean-room intake, environment files and operator-owned settings the episode has no authority to inspect."}, {"option": "Correct only the three documents to describe the hold", "reason": "That makes the claim honest but leaves the instrument unusable on the repository it supervises; the operator selected repair over that disposition."}, {"option": "Drop the ignored inventory and return to VER-004's state", "reason": "That reinstates a certified pass over unseen out-of-surface work, the more dangerous defect."}],
  "followup": "WO-099 repair five: stop a metadata-only move of a baselined ignored entry from forcing a hold - ignore such a move, re-pin the baseline when a hold is cleared, or classify declared rebuildable roots - add a fixture worktree that carries ignore rules and performs a build so the suite can reach a collapsed ignored root, and bring product 03 lines 1952-1953, repair-004 and D031 into line with the behaviour the code has.",
  "reopenWhen": "A repository needs a metadata-only move of a baselined ignored root to be treated as work, or the chosen rule proves to hide a real out-of-surface change; then distinguish the cases by provenance rather than by widening the capsule."
}
```

The defect is new code, not a five-round miss: checkpoints 15 and 17 contain no
reference to `ignoredInventory` or `ignoredEntries` and checkpoint 19 contains
three and eleven, so no earlier verification could reach it. VER-004 named this
as the repair's hard part — deciding which ignored entries matter rather than
enumerating them — and the boundary it chose is right in substance; only its
treatment of a baselined entry's own metadata is wrong. The repair is bounded and
needs no new capsule content, no ignored bytes and no operator ritual.

## WO-099-D034

```json
{
  "id": "WO-099-D034", "date": "2026-09-20", "dispatch": "resume: fix",
  "decision": "Fingerprint a git directory-collapsed ignored entry by kind and mode alone, and keep kind, mode, size and mtime for files, symlinks and other kinds. A collapsed directory's own mtime moves whenever a direct child is created, removed or renamed, which is what atomicBuild does under .runtime/ and publishBuildTree does in each dist/, so the previous fingerprint took one ordinary build to move every build and runtime root off a pin fixed at actor declaration and held every later pulse over the tooling's own residue. Under this rule a collapsed root still drifts when it appears, disappears, changes kind or changes mode, a baselined ignored file whose bytes move is still work, and what happens inside a collapsed root is the disclosed supervision boundary.",
  "evidence": ["docs/verifications/WO-099/VER-005.md", "packages/skeleton/src/mission-check-source.ts", "packages/skeleton/test/mission-check.test.ts", "packages/skeleton/test/mission-check.fixture.ts", "docs/product/03-architecture.md#operator-presence-policy", "docs/evidence/WO-099/repair-005.md"],
  "rejected": [{"option": "Ignore every metadata-only move of a baselined entry, whatever its kind", "reason": "VER-005's first named option, but it also blinds a baselined ignored file whose bytes change - a rotated .env or a rewritten operator note - which git reports as its own entry and which the collapsed-directory argument does not cover."}, {"option": "Re-pin the baseline when a hold is cleared", "reason": "The first build after every pin still raises a false hold and floods MissionDriftObserved; it makes the hold survivable rather than correct, and a cleared hold would also adopt real ignored work as the new baseline."}, {"option": "Classify declared rebuildable roots", "reason": "It preserves more detection, but it needs a new declared field on MissionSource that an over-declaration silently turns into a blind spot, and the classification would have to be pinned to resist a mid-episode edit. The kind rule needs no new capsule content, no configuration and no operator ritual."}, {"option": "Hash one level of child names under a collapsed root", "reason": "Ordinary builds change the published file set whenever a source file is added, so the false hold returns; it also reads ignored names D031 refused to inspect."}, {"option": "Correct only the three documents and keep the hold", "reason": "VER-005 records that the operator selected repair over that disposition, and a supervisor that stops all unattended work after the first build defeats the order's objective."}],
  "reopenWhen": "A change under a collapsed ignored root must be observed as work - private material dropped into an ignored directory, or an out-of-surface edit that only that directory records - or a repository needs a rebuildable root treated as sensitive; then add a local provenance source or pin a declared rebuildable classification rather than reading ignored bytes into the capsule."
}
```

The widened boundary is the price paid and is stated on all three surfaces the
verifier named: product 03 §Operator-presence policy, repair-004's corrected
limits and D031's corrected prose. Two regressions hold the repair — a source
probe over a worktree that carries ignore rules and performs the build's own two
filesystem effects, and a resident probe where an ordinary build during the
cadence raises no hold and records no correction event. Both fail against the
previous fingerprint and pass against this one, and the fourteen prior mission
regressions pass either way, which is why no earlier suite could reach it.

## WO-099-D035

```json
{
  "id": "WO-099-D035", "date": "2026-09-20", "dispatch": "resume: final review",
  "decision": "Record, and do not repair under this order, that the process-cost counter is structurally unavailable on codex-cli and always available on claude-code. measureHarnessUsage throws \"Begin the harness session before measuring usage\" unless a begun session record exists at docs/control/local/harness/<sha256>.json; the Claude hooks write that record at dispatch, and no Codex path ever calls harness begin, because .codex/hooks carries only continuation.mjs and the Codex duties are role text without automatic enforcement. Across every VER and FINAL report in the repository that carries a cost line the split is exact and without exception: claude-code 13 real readings and 0 unknown, codex-cli 0 real readings and 8 unknown. On this order VER-001, VER-002, VER-003 and VER-006 ran on Codex and record unknown; VER-004, VER-005 and every repair ran on Claude and record real counters. The recorded no-session cause code is therefore accurate rather than mislabelled, and the reports are honest about a real gap.",
  "evidence": ["packages/skeleton/src/harness-host.ts", "docs/verifications/WO-099/VER-006.md", "docs/verifications/WO-099/VER-004.md", "docs/planning/r1-replan-2026-09-16.md", "docs/verifications/WO-121/VER-002.md"],
  "rejected": [{"option": "Fix it inside this final review by adding a Codex session begin or a Copilot-style degradation", "reason": "WO-099's non-goals exclude any source change, and editing harness-host.ts or the Codex dispatch would invalidate the passing npm test row this review has to cite; the operator scales scope, not the reviewer."}, {"option": "Change the recorded cause code to harness-no-readback", "reason": "The two codes assert different facts. harness-no-readback means the harness exposes no counter; here the tool's own message proves no session record existed, which is exactly what no-session means. Rewriting accurate history to look tidier would be a false correction."}, {"option": "Leave it only as a sentence in the final-review report", "reason": "A defect met and not fixed has to carry a named follow-up in this file rather than a report sentence, or it stays invisible to the next planning pass and keeps resurfacing as reader friction."}],
  "followup": "Give codex-cli a working process-cost reading: either call harness begin from the Codex dispatch path so a session record exists before usage is measured, or give Codex the graceful branch Copilot already has in measureHarnessUsage, which returns an unknown observation with a one-line advisory instead of throwing. Prefer the first, because it yields real counters rather than a tidier unknown. This is a source change and needs its own work order.",
  "reopenWhen": "Codex gains an automatic session-begin hook, or the counter source changes so that a begun session is no longer the precondition for measuring usage."
}
```

This is a harness defect met while reviewing the verification sequence, not a
defect in the mission check. It is recorded here because four of this order's
six verification reports carry no counters because of it, and because it is
already the third recorded sighting: `r1-replan-2026-09-16.md` and WO-121
VER-002 both name the same message. The operator raised it during this review
as recurring reader friction. Naive Interventionism is the trap to avoid on the
other side: the fix touches a shared measurement path used by every role, so it
belongs in an order with its own verification rather than in a reviewer's
closing commit.
