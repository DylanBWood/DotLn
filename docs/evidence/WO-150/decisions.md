# WO-150 decisions — Tinkerer economy on by default

Dispatch: `resume: next` on 2026-09-21, Claude Code executor, model
`claude-opus-5[1m]`, effort `xhigh` (operator-attested; the harness exposes no
effective effort readback). Authority: `docs/work-orders/WO-150-tinkerer-economy-default.md`.

## WO-150-D001

```json
{
  "id": "WO-150-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 objective and criterion 1",
  "decision": "Flip executorSupportDefaults[\"tinkerer-economy\"] to true so every executor dispatch equips the support unless its order opts out with { \"tinkerer-economy\": false }. The support's paragraph, the immutable switch mechanism, the executor's decline-with-reason path and every other role are unchanged.",
  "evidence": [
    "packages/skeleton/src/loadouts/executor-supports.ts: the one changed line; defaultExecutorSupportIds now yields six ids",
    "docs/product/05-pattern-library.md#candidate--tinkerer--scientist: the 2026-09-21 three-trial reading and the operator's same-day acceptance",
    "docs/evidence/WO-145/decisions.md#wo-145-d001: the pre-registered rule and the reason for default-off at the time",
    "Measured: the generated executor role text grows by exactly 1,173 bytes and no other role's prose changes (docs/evidence/WO-150/cold-start.json)"
  ],
  "rejected": [
    {
      "option": "NoOp — leave the support optional",
      "reason": "The pre-registered condition is met (three adopted methods, no regression) and the operator accepted the proposal on 2026-09-21. Staying optional also preserves the WO-099 D008 defect: equipment was a separate manual step, so the third trial ran unequipped."
    },
    {
      "option": "Add the adaptive pressure modifier in the same change",
      "reason": "It needs the fixed-cadence baseline that this default creates, and it is a separate candidate with its own measure. An explicit non-goal of this order."
    },
    {
      "option": "Equip the verifier, reviewer, planner or release-close as well",
      "reason": "The support is executor-only by design; no trial measured another role, and equipping one would add role text with no evidence behind it."
    },
    {
      "option": "Change the support's paragraph while flipping it",
      "reason": "The paragraph is the reviewed subject of WO-145; editing it here would put unreviewed instruction bytes into every executor dispatch under cover of a default flip."
    }
  ],
  "reopenWhen": "Ten equipped executor dispatches after this order merges have recorded their experiment or kept-current decline and the record shows no adopted saving, a regression, or a decline rate that makes the 1,173 bytes and up-to-900 s unearned; sooner if the opt-out or role isolation fails."
}
```

Goal and critical path: this is operator-prioritized process tooling, not a
dependency of the source-to-deliverable runtime path. It contributes by removing
a recurring manual step (per-trial equipment) and by making the executor's
economy question a standing prompt rather than an operator reminder.

System traps, scaled to consequence. Tragedy of the commons is the live one: the
cost is shared prompt bytes and up to 900 s per order, and it is stated and
measured here rather than assumed — 1,173 bytes against a 249-byte remaining
margin, and time the executor may decline. Escalation is bounded because the
support adds no gate, agent, schedule or approval step; the only new obligation
is one recorded decision, and "kept-current with a reason" is a valid outcome.
Rule beating is the second live one: the fixture proves configuration, not
behavior, so D005 states the reopening observation in terms of experiments and
declines, not of the switch being on. Policy resistance, drift to low
performance, success to the successful, shifting the burden and seeking the
wrong goal are immaterial here: authority, gates and outcome standards are
untouched, the change removes rather than adds operator rescue, and the
alternatives above were compared on their own evidence. Naive Interventionism:
the existing switch mechanism is reused, the intervention is one boolean, and it
is reversible per order by an opt-out and globally by flipping the same line.
NoOp is the first rejected option above.

## WO-150-D002

```json
{
  "id": "WO-150-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 criteria 1 and 3",
  "decision": "Re-baseline the WO-145 process-debt case onto a new current-bytes oracle, packages/skeleton/fixtures/wo150-role-baseline.json, holding the default-on bytes this release generates; keep wo079-role-baseline.json as its byte-checked predecessor and the opt-out oracle, and leave the v0.33.2 release snapshot in wo145-role-baseline.json untouched. Read criterion 3's \"the new release's bytes\" as the bytes this release generates, not a tag that does not exist until release close.",
  "evidence": [
    "Measured with harnessInstallation(): the opt-out reproduces all twelve previous-default role files byte-for-byte, Origin comment included, so previous.roles is an exact oracle",
    "Measured: default-on differs from the opt-out by the executor's 1,173 bytes, and by the Origin comment alone in the other five roles, as WO-145 D003 distinguishes",
    "Measured: the .claude and .agents projections of every role are byte-identical",
    "docs/evidence/WO-079/decisions.md#wo-079-d004: retain historical snapshots and bind the new subject separately",
    "scripts/test-process-debt.mjs: the case now walks the fixture chain and asserts each recorded historicalSha256"
  ],
  "rejected": [
    {
      "option": "Overwrite wo079-role-baseline.json with the new hashes",
      "reason": "It is the exact oracle the opt-out must still reproduce, and overwriting a snapshot to make a check pass is what WO-079 D004 forbids."
    },
    {
      "option": "Update wo145-role-baseline.json's release and hashes to the current tag",
      "reason": "That fixture checks that the v0.33.2 released bytes in Git history are unchanged. Retargeting it would delete a historical invariant, not re-baseline anything."
    },
    {
      "option": "Assert the default-on bytes against `git show v0.39.0:<path>`",
      "reason": "The tag is created at release close, after verification and final review, so the assertion could never pass in the phase that must run it."
    },
    {
      "option": "Rename both tests to WO-150",
      "reason": "docs/verifications/WO-145/VER-001.md and docs/evidence/WO-146/decisions.md cite them by name, and WO-145 D002's adopted --test-name-pattern selection uses them. The repository's pattern is to keep the name and add a comment naming the later order, as the WO-042 case does for WO-099."
    }
  ],
  "reopenWhen": "Another authorized role edit changes the generated default bytes, or the opt-out stops reproducing its predecessor exactly; then add the next oracle beside these and keep every snapshot."
}
```

The executor-supports test now asserts the new default, that
`contributorConfiguredProgram({})` equips the support and
`{ "tinkerer-economy": false }` removes it, that
`executorSupportIds({ "tinkerer-economy": false })` equals the defaults minus
that one id, and that every other support's presence in the executor procedure
is identical on both sides of the switch. Because `defaultExecutorSupportIds`
grew from five ids to six, the WO-042 power-set loops went from 32 to 64
combinations; the measured cost of that is the file's runtime rising from 1.43 s
to 2.76 s. This is a real recurring cost of the flip and is recorded rather than
avoided by narrowing the loop, which would weaken an existing composition check.

## WO-150-D003

```json
{
  "id": "WO-150-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 criterion 2",
  "decision": "Record the equipped cold start as measured and move no ceiling: the executor reads 24,327 bytes in both generated skill roots against the 24,576-byte ceiling, within by 249 bytes, so no 4 KB step and no dated acceptance is due in this order.",
  "evidence": [
    "docs/evidence/WO-150/cold-start.json: per-role bytes for both roots, before and after, with each verdict",
    "Measured before the flip: executor 23,154 bytes, matching WO-090's after-measurement that the order's Cost paragraph cites",
    "Measured after the flip: installed CLAUDE.md 6,113 bytes unchanged plus executor SKILL.md 18,214 bytes; verifier 21,061/25,151, reviewer 22,458/24,576, release-close 13,967/16,384, planner 15,033/24,576, refuter 15,690/unset — all unchanged by this order",
    "docs/product/07-execution-guide.md: the standing 2026-09-17 route for a breach"
  ],
  "rejected": [
    {
      "option": "Raise coldStartBytes.executor pre-emptively while the change is open",
      "reason": "Nothing breaches it. The standing route raises a ceiling to the measured bytes plus one step when a reviewed rule needs it, not in advance of one."
    },
    {
      "option": "Trim other executor role text to widen the margin",
      "reason": "The 2026-09-17 direction forbids trimming around a ceiling, and no rule in the role text is unreviewed."
    }
  ],
  "reopenWhen": {
    "metric": "coldStartBytes.executor",
    "operator": ">",
    "value": 24576
  }
}
```

The margin is 249 bytes of 24,576, 1.013% of the ceiling, and it is the
smallest of any bounded role in either root. The next reviewed executor rule of
any size breaches it; under the standing route that raises the ceiling to the
measured bytes plus one 4 KB step
with the rule named, and this decision is the record that the margin was already
this thin when the support became default equipment. The reopening condition
above is the measurement, not a plan to trim.

## WO-150-D004

```json
{
  "id": "WO-150-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 objective, the carried three-trial history",
  "decision": "Carry the three trials forward as the starting history every later experiment record reads: lastAdoptedImprovementAt 2026-09-20 and experimentsSinceAdoption 0, with regression false in all three. Implement no adaptive modifier, cadence or schedule.",
  "evidence": [
    "docs/evidence/WO-145/decisions.md#wo-145-d002: 2026-09-20, adopted, regression false, history 2026-09-20/0; equipped; 58.7 s per decision-record development iteration",
    "docs/evidence/WO-110/decisions.md#wo-110-d001: 2026-09-20, adopted, regression false, history 2026-09-20/0; equipped; 238.4 s per skeleton test iteration",
    "docs/evidence/WO-099/decisions.md#wo-099-d008: 2026-09-20, adopted, regression false, history null/null; RAN UNEQUIPPED by its own follow-up; 0.21 s and one command removed per test iteration",
    "docs/product/05-pattern-library.md#candidate--tinkerer--scientist: the reading, its two qualifications and the operator's acceptance"
  ],
  "rejected": [
    {
      "option": "Carry WO-099 D008's null history values forward",
      "reason": "They are null because that dispatch was unequipped and had no support paragraph telling it to fill them, not because no improvement was adopted. Its record states an adopted method on 2026-09-20 with regression false."
    },
    {
      "option": "Set experimentsSinceAdoption above zero to reflect the trial count",
      "reason": "The field counts experiments since the last adoption; all three adoptions are dated 2026-09-20 and nothing has been run since, so zero is the observed value."
    },
    {
      "option": "Implement the adaptive pressure modifier or its bad-luck protection now",
      "reason": "An explicit non-goal; it needs the fixed-cadence record this default begins to produce."
    }
  ],
  "reopenWhen": "A later experiment record adopts an improvement, which moves lastAdoptedImprovementAt, or runs without adopting one, which increments experimentsSinceAdoption."
}
```

Equipped-or-unequipped provenance, since the reading depends on it: two of the
three trials ran with the support equipped (WO-145, WO-110) and one ran without
it (WO-099 D008's own follow-up says so). On the equipped-only subset the
pre-registered rule still passes as written: WO-110's adopted 238.4 s per
skeleton test iteration exceeds the whole recorded trial cost of 253 s after two
iterations in the next ten orders, and neither equipped trial recorded a
regression. Dropping WO-099 removes an adopted method and 0.21 s plus one
command, and changes no part of the arithmetic that carries the rule. The token
side cannot be compared on any subset: only WO-145 recorded a token count, and
that count is a broad-scope transcript counter, not a causal allocation.

What the record does not establish: no trial counted its iterations, so there is
no measured per-order saving, and none is estimated here. The adopted methods
are development loops an executor could keep without the support; what the
default buys is that the question is asked and the answer recorded every time,
which is exactly what the reopening observation in D005 measures.

## WO-150-D005

```json
{
  "id": "WO-150-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next; work-order map receipt 023 known issues carried into this order",
  "decision": "State the served order classes and the reopening observation: the support serves operator-launched executor dispatches on next and fix. It travels in the compiled executor role text to every dispatch of that role, including a runtime-derived or unattended one, and on those the expected and valid outcome is a kept-current decline naming the absent operator session. The reopening observation is ten equipped executor dispatches after merge, each recording an experiment or a kept-current decline in its own decisions file.",
  "evidence": [
    "packages/skeleton/src/loadouts/executor-supports.ts: the paragraph is scoped to \"Before implementation on next or fix\" and is projected into the executor role alone",
    "Measured: the five non-executor role projections carry no support text on either side of the switch (scripts/test-process-debt.mjs, packages/skeleton/test/executor-supports.test.ts)",
    "docs/work-orders/WO-100-preauthorized-portfolio.md, WO-111-unattended-live-proof.md, WO-120-derived-work-identity.md: the three unattended and runtime-derived classes, all queued, none implemented",
    "docs/evidence/WO-099/decisions.md#wo-099-d008: a trial that ran unequipped had to say so, which is the ambiguity the default removes"
  ],
  "rejected": [
    {
      "option": "Exclude runtime-derived and unattended orders from the default in code",
      "reason": "It would add a second selection rule to the loadout for three orders that are all still queued and whose executor path does not exist yet. The existing per-order opt-out already covers any such order that wants it, and a decline with a reason covers the rest."
    },
    {
      "option": "Leave the question open as a report sentence",
      "reason": "The order's write-back duty and the boy-scout rule require a named disposition here rather than prose in a report."
    },
    {
      "option": "Count the switch being on as the reopening observation",
      "reason": "The fixture proves configuration, not behavior; an evidence that passes without the intended behavior occurring is the rule-beating trap this record has to avoid."
    }
  ],
  "reopenWhen": "Ten equipped executor dispatches after merge have completed; if fewer than half recorded either an experiment or an explicit kept-current decline, the default has not changed behavior and the flip is reconsidered. Sooner if WO-100, WO-111 or WO-120 lands an unattended executor path, which reopens the exclusion question above."
}
```

Experiment time and the meter, the second carried question: the up-to-900 s is
spent inside the executor dispatch, so it is already inside the
`elapsed.implementation` figure the meter reads from
`docs/control/orders/WO-NNN.jsonl`; it is not separately metered and this order
adds no per-order token accounting for experiments, which is an explicit
non-goal. No criterion caps the horizon total, and none is invented here: the
observable is the per-order 900 s bound in the paragraph itself, and the
recorded `cost.wallSeconds` in each experiment decision.

## WO-150-D006

```json
{
  "id": "WO-150-D006",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 deliverable \"the regenerated bundle\"",
  "decision": "Re-mint the authority and feedback evidence editions as WO-150 revision 001 and repoint docs/evidence/current.json at them; keep the artifact-identity and verification editions at WO-146, which their own checks still pass.",
  "evidence": [
    "Measured: packages/skeleton/src/loadouts/executor-supports.ts is a registered source of both the authority and the feedback editions, so sameEvidenceSourceContent refuses to preserve either",
    "Measured: artifact-identity and verification see only component-release changes, and both --check runs pass unchanged",
    "Measured: the only difference between the WO-079 feedback report and the newly generated one is the subject hash; the ten passing regressions, ten removal failures and 1,192 saved instruction bytes are identical",
    "docs/evidence/WO-145/decisions.md#wo-145-d003: the same order regenerated new authority and feedback editions for the same reason"
  ],
  "rejected": [
    {
      "option": "Keep the WO-079 feedback edition and relax the staleness check",
      "reason": "The check is the mechanism that stops a source change from silently inheriting an older live audit. Its verdict here is correct even though the report's behavior fields are unchanged."
    },
    {
      "option": "Copy the WO-079 self-host logs into the new edition directory",
      "reason": "They are the record of one live verifier run against one subject hash; copying them forward would present an older run as this edition's evidence."
    }
  ],
  "reopenWhen": "A later order changes a registered evidence source again, which requires the next edition and its own live self-host recording."
}
```

The self-host recording requires a live CLI verifier by construction
(`validateSelfhost` refuses a `fake` transport), so the edition was minted with
the documented `DOTLN_LIVE_WORKERS=1 … --transport claude-cli-print` path that
WO-110 and WO-140 used. Three self-host runs were made in total: a `fake`
transport run against a store at the printed session scratch path, refused by
`runFeedbackSelfhost`'s mount-alias check; the same `fake` run against the
resolved path, which completed but was correctly refused at `--record-selfhost`
because a `fake` verifier is not admissible evidence; and the live
`claude-cli-print` run that was recorded, 244 s, phase complete, with a verifier
usage observation of 588,789 tokens and USD 1.503. The alias refusal is a real
trip hazard for any executor told to keep temporary work in the printed scratch
path, because macOS resolves `/var/folders/…` to `/private/var/folders/…`. It is
recorded here rather than boarded up: the refusal is correct — it is an alias
check — and the fix is to pass the resolved path.

## WO-150-D007

```json
{
  "id": "WO-150-D007",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-150 objective, \"the briefing names the equipped supports\"; Adjacent Repair",
  "decision": "Add the missing tinkerer-economy branch to executorEntryBriefing in scripts/lib/executor-readiness.mjs, so a dispatch under the new default names the support in its Executor entry duties as it already names the other six, and extend the existing bare-dispatch test to require it on and absent under the opt-out.",
  "evidence": [
    "scripts/lib/executor-readiness.mjs: every other executor support had an `ids.includes(...)` branch; tinkerer-economy had none, so the flip alone would have left the objective's briefing clause unmet",
    "Measured: .claude/harness-manifest.json origin.ids now contains tinkerer-economy, so the branch fires without any further plumbing",
    "scripts/test-process-debt.mjs \"bare executor next/fix project installed defaults…\": passes with the new assertions, 1.23 s",
    "This dispatch's own briefing, which listed five supports and not this one"
  ],
  "rejected": [
    {
      "option": "Leave the briefing silent and rely on the role text alone",
      "reason": "The role paragraph is the instruction, but the entry briefing is what names equipment at dispatch; leaving one support out of an otherwise complete list reads as not equipped, which is the exact ambiguity WO-099 D008 recorded."
    },
    {
      "option": "Restate the whole support paragraph in the briefing",
      "reason": "The paragraph is already in the role text; duplicating it would add dispatch bytes for no new instruction, against the cost this order is measuring."
    },
    {
      "option": "Queue it as a follow-up for another order",
      "reason": "It is inside this order's objective and one branch in a file the same change already makes stale; Adjacent Repair prefers the bounded repair."
    }
  ],
  "reopenWhen": "A later support is added to the executor loadout without a matching briefing branch, which is the same omission again; a test that asserts every equipped id has a briefing line would close the class."
}
```

The briefing line is deliberately shorter than the role paragraph: it names the
obligation and the 900 s bound and points at the two valid outcomes, leaving the
record's required fields to the paragraph the executor has already loaded.

## WO-150-D008

```json
{
  "id": "WO-150-D008",
  "date": "2026-09-21",
  "dispatch": "resume: final review; the per-dispatch cost of D007's briefing line, measured",
  "decision": "Record the briefing line's size beside the role text rather than leaving the order's Cost line as the only account: D007's Executor entry duties line is 306 UTF-8 bytes, so a non-opted-out executor dispatch carries 1,479 bytes for this support, 1,173 of compiled role text and 306 of briefing output. Change no code and move no ceiling: briefing output is not a cold-start instruction file, so criterion 2's executor measurement of 24,327 against 24,576 and its 249-byte margin stand as recorded in D003.",
  "evidence": [
    "scripts/lib/executor-readiness.mjs: the one added `ids.includes(\"tinkerer-economy\")` branch and its single pushed string",
    "Measured at final review: Buffer.byteLength of that string is 306 UTF-8 bytes; 1,173 + 306 = 1,479",
    "docs/evidence/WO-150/cold-start.json: the executor profile measures CLAUDE.md plus the installed role skill, and contains no briefing text on either side of the switch",
    "docs/work-orders/WO-150-tinkerer-economy-default.md: the Cost line accounts one paragraph of role text and the 900 s bound, and names no briefing increment"
  ],
  "rejected": [
    {
      "option": "Amend the order's Cost line to 1,479 bytes",
      "reason": "The order is the planner's authority text; a reviewer amends it only under an explicit operator scope expansion, which this dispatch has none of. The measurement belongs in this record and in the product write-back."
    },
    {
      "option": "Shorten or remove the briefing line to keep the accounted figure exact",
      "reason": "The briefing clause is in this order's objective and D007 is the reviewed repair that meets it; trimming reviewed instruction text to fit a number is the move the 2026-09-17 direction forbids."
    },
    {
      "option": "Add the briefing bytes to the cold-start measurement",
      "reason": "Cold start is defined as the instruction file plus the role skill a session loads before any dispatch output; folding dispatch output into it would silently redefine every ceiling and every earlier acceptance."
    },
    {
      "option": "Leave it as a sentence in the final-review report",
      "reason": "A measured recurring cost that no durable record carries is exactly what the write-back duty and the boy-scout rule exist to prevent."
    }
  ],
  "reopenWhen": "A later order adds or removes an executor support and its Cost line accounts only compiled role text, or a briefing line grows past the paragraph it points at, which is the same unaccounted increment again.",
  "followup": "Account a support's briefing-line bytes beside its role-text bytes when a Cost line states the per-dispatch cost of equipping it; the per-dispatch cost is both."
}
```

Why this is a measurement and not a finding: the briefing line is inside this
order's objective, the executor's D007 repaired the omission that would have
left the objective unmet, and nothing in the subject is wrong. What was missing
is the number. The two figures answer different questions — 1,173 bytes is what
the cold-start ceiling governs, and 1,479 bytes is what a non-opted-out dispatch
actually carries — and an order that opts out carries neither.
