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
git worktree add ../DotLn-wo002 -b wo-002
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
claude --model opus "Verify the working tree against docs/work-orders/WO-002-pure-kernel.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-002-verification.md. Do not fix anything."
```

**4. Review + merge (you, five minutes).** Read the result envelope and the
verifier's per-criterion report. Skim the diff like you'd skim a PR title +
summary. If green:

```bash
cd ~/Projects/DotLn
git merge wo-002
git worktree remove ../DotLn-wo002
git branch -d wo-002
git push
```

If red: don't debug in your head — save the findings at
`docs/work-orders/WO-00N-verification.md`, then dispatch a *repair* session in
the same worktree with that file and re-verify. (Findings → fresh
repair episode → stale evidence regenerated: same shape DotLn itself will
automate at v0.5.0.)

**5. Close (Fable 5, main checkout).** Check the completed work order against
the plan: did anything supersede or transform a blueprint idea? Ledger + doc
updates ride in this closing pass. Then pick the next WO.

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

- `git worktree list` — remove strays.
- Skim `docs/lineage/idea-ledger.md` Session additions — anything learned this
  week that belongs there?
- Ask: does the current rung still ship a visible payoff? If not, re-cut it.

## Copy/paste command ledger

Append one block here whenever a work order is added. Run each block from the
main checkout unless it begins with a worktree `cd`. WO-002 also includes the
operator-authorized additions of this ledger and the execution guide's
PR-title/gitmoji rule beyond its original repair scope.

### WO-001 — environment truth (completed)

```bash
codex "Execute docs/work-orders/WO-001-environment-truth.md"
```

### WO-002 — pure kernel

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-002-pure-kernel.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo002 -b wo-002 origin/main
cd ../DotLn-wo002
codex "Execute docs/work-orders/WO-002-pure-kernel.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-002-pure-kernel.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-002-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo002
codex "Execute fixes in docs/work-orders/WO-002-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-002-pure-kernel.md and replace docs/work-orders/WO-002-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-002
git worktree remove ../DotLn-wo002
git branch -d wo-002
git push
claude --model fable "Close docs/work-orders/WO-002-pure-kernel.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-003 — walking skeleton

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-003-walking-skeleton.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo003 -b wo-003 origin/main
cd ../DotLn-wo003
codex "Execute docs/work-orders/WO-003-walking-skeleton.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-003-walking-skeleton.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-003-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo003
codex "Execute fixes in docs/work-orders/WO-003-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-003-walking-skeleton.md and replace docs/work-orders/WO-003-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-003
git worktree remove ../DotLn-wo003
git branch -d wo-003
git push
claude --model fable "Close docs/work-orders/WO-003-walking-skeleton.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-004 — environment truth addendum

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-004-environment-truth-addendum.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo004 -b wo-004 origin/main
cd ../DotLn-wo004
codex "Execute docs/work-orders/WO-004-environment-truth-addendum.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-004-environment-truth-addendum.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-004-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo004
codex "Execute fixes in docs/work-orders/WO-004-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-004-environment-truth-addendum.md and replace docs/work-orders/WO-004-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-004
git worktree remove ../DotLn-wo004
git branch -d wo-004
git push
claude --model fable "Close docs/work-orders/WO-004-environment-truth-addendum.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-005 — capability table v1

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-005-capability-table.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo005 -b wo-005 origin/main
cd ../DotLn-wo005
codex "Execute docs/work-orders/WO-005-capability-table.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-005-capability-table.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-005-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo005
codex "Execute fixes in docs/work-orders/WO-005-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-005-capability-table.md and replace docs/work-orders/WO-005-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-005
git worktree remove ../DotLn-wo005
git branch -d wo-005
git push
claude --model fable "Close docs/work-orders/WO-005-capability-table.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-006 — publication bootstrap

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-006-publication-bootstrap.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo006 -b wo-006 origin/main
cd ../DotLn-wo006
codex "Execute docs/work-orders/WO-006-publication-bootstrap.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-006-publication-bootstrap.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-006-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo006
codex "Execute fixes in docs/work-orders/WO-006-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-006-publication-bootstrap.md and replace docs/work-orders/WO-006-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-006
git worktree remove ../DotLn-wo006
git branch -d wo-006
git push
claude --model fable "Close docs/work-orders/WO-006-publication-bootstrap.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-007 — audit-record baseline

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-007-audit-record-baseline.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo007 -b wo-007 origin/main
cd ../DotLn-wo007
codex "Execute docs/work-orders/WO-007-audit-record-baseline.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-007-audit-record-baseline.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-007-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo007
codex "Execute fixes in docs/work-orders/WO-007-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-007-audit-record-baseline.md and replace docs/work-orders/WO-007-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-007
git worktree remove ../DotLn-wo007
git branch -d wo-007
git push
claude --model fable "Close docs/work-orders/WO-007-audit-record-baseline.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-008 — composition compiler v1

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-008-composition-compiler.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo008 -b wo-008 origin/main
cd ../DotLn-wo008
codex "Execute docs/work-orders/WO-008-composition-compiler.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-008-composition-compiler.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-008-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo008
codex "Execute fixes in docs/work-orders/WO-008-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-008-composition-compiler.md and replace docs/work-orders/WO-008-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-008
git worktree remove ../DotLn-wo008
git branch -d wo-008
git push
claude --model fable "Close docs/work-orders/WO-008-composition-compiler.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-009 — real disposable worker

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-009-real-disposable-worker.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo009 -b wo-009 origin/main
cd ../DotLn-wo009
codex "Execute docs/work-orders/WO-009-real-disposable-worker.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-009-real-disposable-worker.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-009-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo009
codex "Execute fixes in docs/work-orders/WO-009-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-009-real-disposable-worker.md and replace docs/work-orders/WO-009-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-009
git worktree remove ../DotLn-wo009
git branch -d wo-009
git push
claude --model fable "Close docs/work-orders/WO-009-real-disposable-worker.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-010 — independent verification

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-010-independent-verification.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo010 -b wo-010 origin/main
cd ../DotLn-wo010
codex "Execute docs/work-orders/WO-010-independent-verification.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-010-independent-verification.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-010-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo010
codex "Execute fixes in docs/work-orders/WO-010-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-010-independent-verification.md and replace docs/work-orders/WO-010-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-010
git worktree remove ../DotLn-wo010
git branch -d wo-010
git push
claude --model fable "Close docs/work-orders/WO-010-independent-verification.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```

### WO-011 — feedback compiler v1

```bash
cd ~/Projects/DotLn
claude --model fable "Plan or refine docs/work-orders/WO-011-feedback-compiler.md. Update the durable product docs first if the plan changes them."
git fetch origin main
git worktree add ../DotLn-wo011 -b wo-011 origin/main
cd ../DotLn-wo011
codex "Execute docs/work-orders/WO-011-feedback-compiler.md"
claude --model opus "Verify the working tree against docs/work-orders/WO-011-feedback-compiler.md. Run every acceptance criterion yourself. Write the per-criterion pass/fail report with evidence to docs/work-orders/WO-011-verification.md. Do not fix anything."
```

Only if verification is red:

```bash
cd ~/Projects/DotLn-wo011
codex "Execute fixes in docs/work-orders/WO-011-verification.md"
claude --model opus "Re-verify the repaired working tree against docs/work-orders/WO-011-feedback-compiler.md and replace docs/work-orders/WO-011-verification.md with the current per-criterion report. Do not fix anything."
```

After verification is green:

```bash
cd ~/Projects/DotLn
git merge wo-011
git worktree remove ../DotLn-wo011
git branch -d wo-011
git push
claude --model fable "Close docs/work-orders/WO-011-feedback-compiler.md: check the completed work against the plan, update blueprint or lineage docs for any transformed decisions, and identify the next work order."
```
