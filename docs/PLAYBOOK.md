# Operator playbook — the canonical loop

For the human running this. The models have their own doc
(`product/07-execution-guide.md`); this one is yours. Follow it mechanically
until it's muscle memory; edit it when reality disagrees.

## Who does what

| Actor | Use for | Don't use for |
|---|---|---|
| **Fable 5** (planning session) | Plan and refine work orders; perform the end-of-work-order blueprint/lineage check | Implementation or acceptance verification |
| **Opus 5** (1M) | Blinded verification of Codex-built work orders | Implementing or repairing the work it verifies |
| **Sonnet 5** | Bounded mechanical work: test scaffolds, renames, formatting, running fixtures, small fan-outs | Anything requiring judgment about the blueprint |
| **Codex** (GPT 5.6 Sol, xhigh) | Execute and repair work orders | Acceptance verification of its own work — it reads `AGENTS.md` (symlinked to CLAUDE.md), so the same rules bind it |

Two standing rules:
- **Implementer ≠ verifier.** Codex executes and repairs; Opus 5 verifies in a
  fresh blinded session; Fable 5 plans and performs the closing check.
- **`Model:` line in the work order is law** (Principle 8). `Model: any` means
  route freely — including by which meter has budget left. Never silently
  downgrade mid-work-order; switch executors between work orders instead.

## The loop, per work order

**1. Plan (Fable, main checkout).** Pick or refine the WO in
`docs/work-orders/`. If the docs need updating first, do it here. Main
checkout is the control plane — no implementation happens here.

**2. Implement (Codex, fresh session, own worktree).**

```bash
cd ~/Projects/DotLn
npm run worktree -- start WO-002 docs/work-orders/WO-002-pure-kernel.md
cd ../DotLn-wo002

codex "Execute docs/work-orders/WO-002-pure-kernel.md"
```

Give the executor ONE line: *execute this work order*. Everything it needs is
in the repo (that's the whole design). Don't paste context; don't explain.
Ramble into the *planning* session, never into an executor.

**3. Verify (Opus 5, fresh session, blinded).** New session — not the
implementer's, no implementer narrative. Feed it: the WO + the diff.

```bash
cd ../DotLn-wo002
claude --model opus "Verify the working tree against docs/work-orders/WO-002-pure-kernel.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to the next unused docs/verifications/WO-002/VER-NNN.md number. Never replace a prior report. Do not fix anything."
```

**4. Repair or final review.** If red, don't debug in your head. The verifier saves findings as the next
unused immutable `docs/verifications/WO-00N/VER-NNN.md`. Dispatch a *repair*
session in the same worktree with both the authoritative original work order
and that specific report, then re-verify into the next number. Never update or
delete an earlier report. (Findings → fresh
repair episode → stale evidence regenerated: same shape DotLn itself will
automate at v0.5.0.)

When verification is green, dispatch final review. It reads the original work
order, complete verification sequence, diff, tests, ideation receipt, and all
affected product/ledger/schema surfaces. It may make bounded last-mile fixes
only when they are non-substantive handoff/documentation corrections. Any
acceptance-relevant change records a failed `FINAL-NNN` and goes through repair
plus a fresh independent `VER-NNN`. A pass writes the next immutable `FINAL-NNN`,
commits the clean result, and opens a PR:

```bash
cd ~/Projects/DotLn-wo002
npm run worktree -- publish WO-002 --title ':sparkles: Pure kernel' --body-file docs/final-reviews/WO-002/PR.md
```

**5. Merge, clean up, and release-close.** You review and merge the PR. Then:

First run `npm run backup:intake` from the subject worktree and reconcile any
worktree-local raw notes into the surviving main intake or another trusted
backup. `finish` deliberately refuses while ignored `docs/intake` material
remains; it will not guess whether local-only notes are disposable. Ordinary
untracked dirt also fails the clean check, while ignored `node_modules` and
generated `dist` output may be discarded with the worktree.

```bash
cd ~/Projects/DotLn
npm run worktree -- finish WO-002
```

`finish` refuses before the branch is contained in `origin/main`. If this work
completes a roadmap release, perform the release-closeout task described below.
Then use `resume: next` to select the next work order.

### Repeated code → verify → fix loops

The original `WO-00N` never becomes a verifier-owned work order. It remains the
scope authority. Each `VER-NNN` is an immutable finding artifact that can
contain a bounded repair checklist. For every additional loop:

1. Repair reads `docs/work-orders/WO-00N-*.md` plus the latest dispatched
   `docs/verifications/WO-00N/VER-NNN.md`.
2. The verifier reads the original work order, current diff, and relevant prior
   reports, then writes `VER-(NNN+1).md` without modifying older reports.
3. Final review reads the full sequence, so fixed, recurring, stale, and newly
   introduced findings remain distinguishable.

When asking Codex conversationally, use: “Repair the current work order from
`docs/verifications/WO-00N/VER-NNN.md`; read both it and the original work
order.”

## Concurrency

One writable agent per worktree, always (global rule). Two work orders in
parallel = two worktrees, two sessions, zero shared files. The main checkout
stays clean for you and the planning session.

## When things break

- **Session dies / rate-limited mid-WO:** nothing is lost — the repo + WO are
  the memory. Start a fresh session in the same worktree: "Continue executing
  WO-00X; inspect the working tree to see what's done." (Disposable
  incarnations; the workflow remembers the worker.)
- **Out of Claude budget:** route `Model: any` work to Codex; park
  model-pinned work orders — never substitute silently.
- **Executor asks you a question it shouldn't** ("should I run the tests?"):
  the answer is in the WO's evidence gate. Say "follow the work order" and
  note it — that's a future compiled feedback unit.
- **Executor went sideways:** kill it, don't argue with it. Fix the WO or the
  doc that misled it (that's the real bug), reset the worktree, redispatch
  cold. Arguing pollutes; redispatching is free.

## Weekly hygiene (until DotLn does it for you)

- `npm run backup:intake` — create a validated, owner-only ZIP of the local raw
  intake beside the project, then move it to the trusted backup location.
- `git worktree list` — remove strays.
- Skim `docs/lineage/idea-ledger.md` Session additions — anything learned this
  week that belongs there?
- Ask: does the current rung still ship a visible payoff? If not, re-cut it.

## Resume command surface

The append-only control log replaces the per-work-order copy/paste ledger. In a fresh session, use one operator phrase:

```text
resume: status
resume: fix
resume: verify
resume: final review
resume: next
```

The agent reads `docs/control/current.md`, runs the matching `npm run resume -- <action>` when the action is a state transition, and follows the emitted authoritative paths. `status` is read-only. `next` confirms the current WO is closed; after selecting the next roadmap work order, activate it with:

```bash
npm run resume -- activate WO-00N docs/work-orders/WO-00N-name.md
npm run resume -- implementation-ready   # executor, after evidence is green
npm run resume -- verify                 # allocates the next immutable VER-NNN
npm run resume -- verification-result pass|fail
npm run resume -- fix                    # emits original WO + failing VER paths
npm run resume -- repair-complete
npm run resume -- final-review
npm run resume -- final-review-result pass|fail
```

Verifiers write the exact report path allocated by `verify`, then record its verdict. Repair and final-review completion actions are recorded only after their evidence exists. Illegal transitions refuse without appending. The JSONL log is canonical; `docs/control/current.md` is regenerated projection.

## End-of-workflow release task

After final review opens the PR, you review and merge it. Then run the guarded
worktree `finish` action from the main checkout. The final task is release
closeout: if the merged work order completes a roadmap version, rerun its full
evidence on the exact merged `origin/main` commit, generate and validate the
release manifest, and ask for operator authorization before creating or
pushing the annotated tag. WO-003 proposes the first source-only boundary,
`v0.2.0`. Do not backfill `v0.1.0` unless its exact commit and evidence are
reconstructable; do not treat a Git tag as an npm or binary publication.

This task is currently a documented gate, not a hidden side effect of
`worktree finish`. A later work order may add a `release prepare` projection;
tag creation and publication must remain separately authorized.
