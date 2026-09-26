# Using the Entropy Reducer

The Entropy Reducer, first shipped in `v0.5.0`, is a compiled review loadout.
Its actor is **Claude Opus 5.5 at `xhigh` in Claude Code** (Claude Fable 5.1
at `max` through `v0.43.0`; moved by the WO-100 scope expansion). Since
`v0.42.0` (WO-151) one command family dispatches it:

```sh
npm run entropy -- subject | review | receipt | refute | refutation-receipt | dispose | check
```

`planning: entropy reducer` opens a planning pass whose subject is a review:
the pass consumes an undisposed one or runs a fresh episode, then decides its
surviving findings **in that same pass**. There is no `resume:` phrase, no
role and no role skill, and no scheduler — nothing runs a review unless the
operator opens a pass or a session runs the command, and every one of them
stops at operator disposition. `npm run skeleton` runs the deterministic Repo Gardener
demonstration, which is a different thing. The operator's GPT-6 Sol/`xhigh`
default for Codex steps does not silently replace this loadout's different
actor requirement.

## The loop

```sh
# 0. Ask what this pass should do. It consumes before it produces: a filed
#    review that carries a refutation and no disposition is a subject, not
#    a reason to pay for another episode.
npm run entropy -- subject

# 1. Freeze HEAD, compile the reviewer for that subject, launch the pinned
#    actor inside the frozen copy.
npm run entropy -- review --transport claude-cli-print

# 2. Bind the return and file REVIEW-NNN.
npm run entropy -- receipt <result.json> --statement <statement.txt>

# 3. Hand the blinded subjects to a second, fresh worker and bind its attempts.
npm run entropy -- refute REVIEW-NNN --transport claude-cli-print
npm run entropy -- refutation-receipt <attempts.json>

# 4. Decide, per surviving finding and per proposal packet.
npm run entropy -- dispose REVIEW-NNN <id> accept|defer|dismiss '<reason>'

# 5. Prove the chain and the immutability of every filed pair.
npm run entropy -- check
```

`npm run entropy -- subject` answers one of three things: `consume` with the
review to work from, `finish-pending-dispatch` with the episode to file or
discard, or `review` when no filed review is both refuted and undisposed and a
fresh episode therefore earns its cost. `planning: entropy reducer` opens with
it, so a pass never pays for a review whose predecessor nobody decided.

`--concern '<hypothesis>'` names a specific worry for the review — accumulated
startup context, fold cost, workflow handoffs, change fan-out. A concern is a
hypothesis to inspect, not a required finding. `entropy discard review` or
`entropy discard refutation` abandons a pending dispatch and removes its frozen
copy; `entropy show <receipt-id>` prints a filed receipt.

## The subject

`review` copies `HEAD` — a copy, never a link or a shared worktree, under the
granted system-temp lane — and records the tracked-path status hash, the
untracked-listing hash and a path-and-size scratch inventory before and after
the episode. A **dirty tree is refused**: the
working tree's bytes are not a subject anyone can name later. Commit them, or
name the committed subject explicitly with `npm run entropy -- review <commit>`,
which is admitted while the tree moves and records `workingTreeDirtyAtDispatch`
in the receipt so the receipt cannot be read as a review of the working tree.
A second `review`, or a second `refute`, while a dispatch of that kind is
pending is refused whatever subject it names: the command keeps one current
pointer per kind, and replacing it would leave the first episode and its frozen
copy unreachable by `receipt` or `discard`. The refusal names the open episode
and both recovery commands, and it precedes the copy, so it costs no clone.

`receipt` binds the subject before it files. On the default `HEAD` route the
tree was clean at dispatch, so any tracked change during the episode refuses
the result. On the explicit-commit route the subject is the named commit,
which the working tree cannot move: the binding is that the commit still
resolves to the tree the frozen copy was reviewed from, and the working tree's
own drift is recorded as `trackedStatusByteIdentical: false` rather than
refused. A rejected return is retained with its statement, when one was
supplied, under
`docs/control/local/entropy/rejected/`. Raw intake, settings, credentials and
unrelated untracked files are never review inputs, and the reviewer is told not
to read `docs/intake/**`.

## Who reviewed, as a fact

The receipt's identity line reads `entropy-reducer@1` **only** when the pinned
route passed the compiled model and effort on the command line and the harness
matches. Everything else — the background route, another transport, another
model or effort — reads `substitute reviewer` with the recorded values and the
reason. Effective model and effort are recorded as `unknown`, because no
harness reports them; a launch selection is not a readback. `--source
operator-attested` records an effort the operator supplies on the background
route, and that is still a substitute: it is an attestation, not an invocation
readback. No default silently selects another model.

Without `--transport`, `review` and `refute` print the canonical prompt and the
closed result schema for a fresh worker the session spawns, retaining the
pending dispatch; the parent stays the sole repository writer. The `fake`
transport drives the executable fixtures only and cannot produce a live
receipt.

## What the reviewer may run

The pinned `claude-cli-print` and `codex-cli-exec` routes compile the lens
briefs as the reviewer's own checklist: **lenses worked serially by the
reviewer**. Neither route supplies a delegate tool, so its envelope has no
`delegate.readonly` grant or `delegates` resource limit, and its Program uses
serial reads. Claude admits only Bash, Read, Glob and Grep; Codex disables
multi-agent tools. The background and fixture routes use the same serial
contract. A new delegating route requires a separate decision.

`compileReviewerWorkOrder` records the selected `route` in its inputs and
compiled identity; its default is `claude-cli-print`, and unknown routes
are refused. The lens briefs remain required by the dispatch protocol, with
their original file scopes, questions, output shapes, word budgets and no-fix
boundaries. New review receipts state the serial confinement; historical
receipts keep the rendering of the episode they recorded.

Unlike this repository's other inspection profiles, the review profile admits
commands, because a reviewer that cannot run anything labels findings `by
inspection` and measures almost nothing (`runs/REVIEW-001.json` recorded seven
denied shell calls and one measured finding of seven). Claude confines the file
tools to the frozen copy with `--restricted`, pre-approves only the named
tools, and denies anything else without a prompt; Codex adds a real
workspace-write sandbox rooted at the copy. **Claude does not path-confine a
shell command**, so confinement there is instructed and then checked: the
review and the refutation receipt alike record the tracked-path status hash and
the untracked, non-ignored listing hash on either side of their episode, the
frozen copy's inventory before and after with its added, removed and resized
paths (WO-157), and the observed count of denied tool calls, and on the default
`HEAD` route `receipt` refuses a return whose subject moved. The receipt names
which of the two confinements applied. REVIEW-002 measured the difference this profile
buys: 0 denied tool calls and 4 of 4 findings measured, against REVIEW-001's
7 denials and 1 measured of 7.

## Receipts, dispositions and the register

Receipts are numbered from the next unused `NNN`, never overwritten, and bound
by SHA-256 in [`docs/control/entropy-reducer.jsonl`](../../control/entropy-reducer.jsonl)
(`EntropyReviewFiled`, `EntropyRefutationFiled`, `EntropyFindingDisposed`,
`EntropyPacketFiled`). The rendered `.md` is a projection of the `.json`.
`REVIEW-001*` and `REFUTATION-001*` are pre-mechanism evidence of 2026-09-04:
their bytes are read and never re-bound, and they carry no control event. A
refutation filed since WO-157 records no separate worker statement: its receipt
renders each attempt's reason and evidence references from the bound report,
and `--statement` is accepted but not recorded; earlier refutations keep their
statement and its rendering.

`accept` on a finding requires that it **survived** its blinded refutation; a
refuted, blocked, unselected or unknown identifier is refused, and every one of
those stays visible in the refutation report. An acceptance appends a list item
under a formal `## Candidates — accepted Entropy Reducer findings` heading in
`docs/planning/entropy-reviews/REVIEW-NNN.md`, which the follow-up collector
harvests and `npm run meta` lists as a register row. `accept` on a proposal
packet files it at `docs/proposals/<suggestionId>/packet.json`. Filing is not
promotion: turning a candidate into a work order remains an operator-authorized
planning act.

`entropy check` runs in `npm run test:docs`. It fails on a hand-edited receipt,
on a rendering that is not its JSON's projection, on a filed pair with no
control event, and on a committed fixture receipt. A control event whose pair
never landed — a crash between the two writes — is reported as an interrupted
filing to complete, not as a gate failure for unrelated work.

## The manual path, retained

The command family replaces these five host steps, which remain the recorded
fallback when a session cannot run the commands. They are retained, not
removed:

1. Read the execution guide and subject authority, then compile
   `compileReviewerWorkOrder()` from
   [`entropy-reducer.ts`](../../../packages/skeleton/src/loadouts/entropy-reducer.ts)
   against the actual repository/base, a fresh episode ID, dispatch time, and
   finite episode end, and the selected `route`. Retain its inputs, semantic hash, WorkOrder, authority
   envelope, Program, actor requirement, and residue with the new episode.
   The IDs and times in `runs/REVIEW-001-COMPILED-PROGRAM.json` belong to the
   historical example; they are not a reusable live grant.
2. Follow the compiled manual Program: census, bounded lenses, isolated probes,
   findings, and suggestions. Authorize each operation and thread the returned
   resource envelope. The 32-probe ceiling is a maximum, not required usage or blanket filesystem
   permission. Work the at-most-four lens checklist items serially; the plan
   has no delegate grant or `Program.All`. A compiled plan does not launch
   models or enforce a shell sandbox.
3. Validate the output using `validateReviewerOutput()` or
   `prepareReportEmit()` with this episode's exact WorkOrder and episode IDs
   before report emission. Preserve the clean-room result, evidence labels,
   reproductions, and a summary under 200 words. New receipts get new IDs;
   never overwrite `REVIEW-001` or treat old evidence as a fresh run.
4. Dispatch a **fresh blinded** Opus 5.5/xhigh episode using
   [REFUTATION-PLAN.md](REFUTATION-PLAN.md). Supply only the subjects selected by
   `selectFindingsForRefutation()` and the frozen repository, then bind its
   attempts with `buildRefutationReport()`. Refuted, blocked, and unsampled
   findings remain visible; only surviving selected findings advance for
   consideration. This refutation does not replace a work order's independent
   lifecycle verification.
5. Review the surviving findings and choose accept, defer, dismiss with reason,
   or a separately authorized implementation/planning step. The reviewer stops
   at disposition. Suggestion output does not file or activate its own work.

The command family performs exactly these steps through the same typed APIs;
it adds numbering, immutability, an attestation and a disposition record, and
it selects the route at compilation and retains that route's authority.

[RESIDUE.md](RESIDUE.md) is generated from the typed loadout, not an editable
skill or the entry point of an automatic scheduler. The
[first run](runs/REVIEW-001.json) and
[refutation](runs/REFUTATION-001.md) demonstrate the manual workflow that
preceded the command. Sustain, recurring observation and automatic review
dispatch during operator absence remain future capabilities and are explicit
non-goals of WO-151.

**Shape-First v2 (WO-142, 2026-09-19):** the typed support now extracts the
intended relationship first and evaluates literal details only when a claim
uses them. This implements the operator's 2026-09-04 correction, preserved in
the [WO-028 ideation synthesis](../../lineage/idea-ledger.md#wo-028-expanded-ideation--cumulative-context-success-under-growth-and-entropy-reducer-use-2026-09-04).
The residue, compiler fixture and console input are regenerated from this
version; `runs/REVIEW-001*` and `runs/REFUTATION-001*` remain unchanged historical
evidence of their recorded programs, not observations of v2.
