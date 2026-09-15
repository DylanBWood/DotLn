# Planning goal-review receipts

`npm run plan -- refute` prints the canonical prompt and result schema for one
fresh background refuter in the current harness. The parent supplies only that
prompt and shared goal card, gives the worker no inherited conversation, and
remains the sole repository writer. The worker returns its frozen JSON judgment
and a truthful public statement of at most 4000 characters. `--direct` remains
an alias; `--scope full` judges the whole horizon. Default pass scope judges new
or changed orders and carries unchanged goal judgments by order and receipt
hash. The first goal review of an order replaces its older classification with
one judgment under the new standard.

## What the review answers

The prompt carries the operator's platform-first standard verbatim from product
07, its Goal-aligned decisions section with all eight system traps, the critical
path, vision passages, and each order's title, objective, Cost line, criteria
and non-goals. Recorded meter rows and trap observations have explicit source
IDs. Their freshness is labeled `current`, `stale` or `unknown`; an absent Cost
line or missing measurement creates no structural hold. Planner narrative,
private intake and earlier judgments are not part of the prompt.

For each judged order, the reviewer answers four questions:

1. Which critical-path gate does it unblock, and what is the NoOp cost in the
   records?
2. How do all eight system traps apply to the order's own process cost?
3. Does its Cost line name a removal larger than the addition?
4. Does failure of the mechanism degrade to the old behavior rather than
   refusing?

The closed result is `plan-goal-review-v1`. It contains `schemaVersion`, `orders`,
`planVerdict` and `holdReasons`. Each order supplies `workOrderId`, `verdict`,
`criticalPathAndNoOp`, `systemTraps`, `removalBalance`, `failureBehavior` and
`findings`. Verdicts are `aligned`, `aligned-with-findings` or `misaligned`.

Each finding has a `criterionId`, `kind`, `reason`, `evidence` source ID or null,
and `reopenWhen` observation or null. A hold requires **misaligned** plus an
`observed-failure` citing a supplied observation ID, or a
`vision-contradiction` citing a supplied vision passage ID. Source IDs identify
the evidence; the independent reviewer remains responsible for judging whether
it supports the finding. A hypothetical or unsupported claim becomes a
`known-issue` with a reopening observation, including when the submitted result
called it a hold. A known issue never holds. Model-supplied `holdReasons` cannot
create a hold outside those findings.

## File the judgment once

Commit the planning subject locally, run `npm run plan -- refute`, and give its
prompt/schema to the fresh worker. Save the returned result and statement in
ignored local files, then run:

```sh
npm run plan -- receipt docs/control/local/result.json \
  --statement docs/control/local/statement.txt
```

The helper validates, screens, files and commits only the immutable JSON and
Markdown pair, then checks the plan. Unrelated staged changes refuse the receipt
commit. It records elapsed dispatch-to-file time; exceeding 120 seconds does
not refuse filing. Repeating a pending dispatch retains its original time.

There is one judgment per planning pass. A criterion repair uses a disposition,
without another worker or replacement receipt. A new recorded meter observation
or changed vision evidence permits a new judgment in the same pass. A changed
criterion or refreshed observation timestamp alone does not. There is no
third-hold stop.

To accept a finding after updating its criterion, or record its disposition
without changing the criterion:

```sh
npm run plan -- dispose <receipt-id> <hold-id> '<disposition and reason>'
```

This appends `PlanHoldDisposed` to the existing
`docs/control/plan-refutations.jsonl`, binding the source and accepted criterion
text hashes, work-order ID and criterion ID. The plan check accepts the original
receipt plus this disposition, including a named criterion repair against a
historical receipt. For a goal-review hold whose Cost declaration was repaired,
the same event also records paired `sourceCostHash` and `costHash` values over
the exact old and accepted declaration bytes. This covers a changed, added or
removed Cost field only; no new command or replacement receipt is needed. Later
receipts cannot re-raise a hold against that accepted text: the finding remains
a known issue with a reopening observation. A later arbitrary criterion edit
is not covered by the disposition, nor is an unrelated Cost or Objective edit.

An operator-authorized override uses the same criterion binding:

```sh
npm run plan -- override <receipt-id> <hold-id> '<reason>' \
  --capture docs/intake/notes/<operator-instruction>.md \
  --capture-hash sha256:<capture-digest>
```

Actor flags are optional provenance and default to unknown. The capture must
remain ignored, untracked and contained in intake; its bytes must match the
supplied hash. Its text is never copied to public evidence. The command appends
`PlanHoldOverridden`; receipt prose supplies no override authority. Attribution
records the acting session and does not authenticate the human's identity.

## Execution and preservation

External CLI review runs only when the operator explicitly requests
`refute --transport claude-cli-print|codex-cli-exec`; a background-worker failure
never triggers an automatic external fallback. Claude defaults to
`claude-fable-5-1` at `max`; Codex defaults to `gpt-6-astra` with effort `unknown`.
An explicit nonempty effort selection is logged. `ultra` and `ultra code`
normalize to `xhigh` with `mode: subagents` and preserve their raw spelling.
Version and effort observations are provenance, not admission requirements.
Actual CLI failures remain failures and never silently select another model.
Effective model and effort remain unknown unless independently observed.

External transport uses the Entropy Reducer identity, Contra-Auguste mask,
architecture-and-semantics lens, one-shot cadence, and an empty temporary
working directory. It grants the planning subject and reporting only; model
tools and repository traversal remain unavailable. The CLI episode retains its
twenty-minute transport deadline and Claude's provider budget cap. `fake` is
for executable fixtures and cannot satisfy the planning gate.

Direct-session receipts record session-attested independence and a truthful
statement of what was read. They do not claim host-enforced context isolation,
a CLI launch or effective setting readback. Frozen result hashes describe the
validated result, including deterministic demotion of known or disposed issues.

The receipt envelope, global append ordinal, previous receipt hash, immutable
pair, committed snapshot validation and local-terms screen remain. Missing
local-terms lists are reported as unavailable. Interrupted writes preserve
history and report the incomplete state. Only the judgment semantics and
criterion dispositions change; historical receipt bytes, hashes and rendered
Markdown retain their original validation. Historical Cost and structural-hold
rules are replayed only for those old results, never applied to a new goal
review. Existing accepted dispositions and overrides also bind the criterion
text they accepted.

`npm run plan -- subject` shows the committed goal-review input.
`npm run plan -- check` validates the receipt chain and current continuation.
A document-only planning pass runs `npm run test:docs`. The six manual
2026-09-06 redirect receipts remain pre-mechanism evidence; the
[first receipt](2026-09-06-phase-two-redirect.md) and
[receipt 006](2026-09-06-phase-two-redirect-006.md) retain their original standard.
`--evidence-only` records an explicitly requested instrument run without
certifying a planning pass or the refutation mechanism itself.
