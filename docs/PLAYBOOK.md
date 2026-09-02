# Operator playbook — the canonical loop

For the human running this. The models have their own doc
(`product/07-execution-guide.md`); this one is yours. Follow it mechanically
until it's muscle memory; edit it when reality disagrees.

## Who does what

| Actor                          | Use for                                                                                        | Don't use for                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Fable 5** (planning session) | Plan and refine work orders; perform the end-of-work-order blueprint/lineage check             | Implementation or acceptance verification                                                                          |
| **Opus 5** (1M)                | Blinded verification of Codex-built work orders                                                | Implementing or repairing the work it verifies                                                                     |
| **Sonnet 5**                   | Bounded mechanical work: test scaffolds, renames, formatting, running fixtures, small fan-outs | Anything requiring judgment about the blueprint                                                                    |
| **Codex** (GPT 5.6 Sol, xhigh) | Execute and repair work orders                                                                 | Acceptance verification of its own work — it reads `AGENTS.md` (symlinked to CLAUDE.md), so the same rules bind it |

Three standing rules:

- **Implementer ≠ verifier.** Codex executes and repairs; Opus 5 verifies in a
  fresh blinded session; Fable 5 plans and performs the closing check.
- **`Model:` line in the work order is law** (Principle 8). `Model: any` means
  route freely — including by which meter has budget left. Never silently
  downgrade mid-work-order; switch executors between work orders instead.
- **Effort is part of the assignment, and nothing self-reports it.** The table
  above states each actor's reasoning effort, but that is prose, not a checked
  fact. It has already been wrong: through WO-001, WO-002 and WO-003 the Codex
  executor actually ran at **low** while this table read `xhigh`, and no doc,
  script, or verification detected the drift (operator disclosure and correction
  to xHigh, 2026-08-31). The WO-003 verification's surviving findings were
  almost entirely thin-evidence defects — tests that pass without pinning what
  they claim — which is the signature that setting produces.
  `Model: any capable model` pins the family, not the effort. Until an
  executable check exists, confirm the executor's actual effort at dispatch and
  have it record model + effort in its result.

## Harness safety baseline

Before dispatching from a personal machine, verify the dated Claude Code and
Codex CLI setup in [`AI-HARNESS-SECURITY.md`](AI-HARNESS-SECURITY.md). Fable,
Opus, and Sonnet are roles or model assignments inside Claude Code, not separate
harnesses; they inherit Claude's effective settings. The same distinction
applies to future model names inside Codex.

The standing security invariant is that a discovered credential, host, open
port, connector, or capable tool is not authority to use it. Keep untrusted
execution inside the enabled shell sandbox, route boundary-crossing or
unsandboxed authority to the operator, deny unsandboxed fallback, and re-check
effective settings after upgrades.

At the 2026-09-01 Codex baseline, `.git` and a linked worktree's resolved Git
directory remain protected even under `workspace-write`. A Codex session must
therefore request outside-sandbox approval on the **first invocation** of every
state-changing `npm run resume -- ...` command so its recovery checkpoint can be
created. `status` is read-only; `next` appends no event and creates no
checkpoint but does refresh the workspace projection. Do not run a transition
sandboxed and then retry it: the transition records even when the optional
checkpoint does not. The approval unsandboxes the whole project-controlled `npm`
process, so first inspect the exact command, `package.json` mapping, and current
`scripts/resume.mjs` diff, then request a one-invocation approval—never a
persistent allow rule. The harness guide explains the warning, current Claude
asymmetry, verification steps, and rollback.

## Ideation breakout

Prefix a message with `ideation:` to dispatch the full documentation pipeline:
raw capture, clean-room review, rewritten synthesis, any warranted ledger
entries, product-doc write-back, and—when committed surfaces change during a
work order—a scope-expansion receipt for verification. Use
`ideation: capture only` when you deliberately want local intake without
synthesis. You should not need to restate the pipeline after the prefix.

During an active work order, also say whether the executor should pause or
continue after the breakout. A committed expansion needs explicit authority; the
receipt names that authority, raw batch, affected ledger/product/decision/
schema surfaces, unresolved choices, and required review. Existing worktree
changes remain intact throughout.

## The loop, per work order

**1. Plan (Fable, main checkout).** Pick or refine the WO in
`docs/work-orders/`. Use the provisional
[`planning/work-order-map.md`](planning/work-order-map.md) to distinguish what
is closed, dependency-eligible, preflight-blocked, and recommended; never choose
by the next integer. Revalidate the selected row against its work order and the
current control state before activation. If the docs need updating first, do it
here. Main checkout is the control plane — no implementation happens here.

**2. Implement (Codex, fresh session, own worktree).**

```bash
cd ~/Projects/DotLn
npm run worktree -- start WO-002 docs/work-orders/WO-002-pure-kernel.md
```

`start` creates and activates the isolated worktree, then prints an absolute,
shell-quoted `cd` command and the rest of the handoff. Run those steps yourself:

```bash
cd '/absolute/path/printed/by/start'
codex
```

Then enter only this chat phrase:

```text
resume: next
```

In phase `active`, `next` resolves the work-order path and dispatches the
executor. Project tooling does not open or inspect Codex in this current
projection; that is a present workflow choice, not a permanent ban on later
governed worker launching. Everything the executor needs is in the repo. Don't
paste context or explain the work order again.

**3. Verify (Opus 5, fresh session, blinded).** New session — not the
implementer's, no implementer narrative. Feed it: the WO + the diff.

Open the assigned verifier in the subject worktree, then enter:

```text
resume: verify
```

The phrase allocates the immutable `VER-NNN` path and prints the authoritative
work-order path. The verifier runs the acceptance evidence, writes only that
report, and records `pass` or `fail`; it does not repair its own findings.

**4. Repair or final review.** Each state transition attempts to mint a local
checkpoint ref before it appends, so use the chat command instead of
hand-writing a checkpoint commit. If checkpoint creation fails, the projected
state says it is unavailable and must not advertise an older recovery ref. Those
refs do not include ignored `docs/intake` material; back raw intake up
separately. If verification is red, open a fresh Codex session in the same
worktree and enter:

```text
resume: fix
```

It prints both the authoritative work order and the specific immutable failing
report. When the repair evidence is green, it records `repair-complete`; open a
fresh verifier and use `resume: verify` again. Never update or delete an older
report.

If the operator catches an incomplete repair after `repair-complete` but before
the next verifier is allocated, use `resume: fix` again. It may reopen only the
preserved failed verification/final-review source; an ordinary initial
`ready-to-verify` state has no such permission. After correcting the subject,
record `repair-complete` again so the advertised recovery checkpoint contains
the actual verifier subject.

When verification is green, open the final-review session in the subject
worktree and enter:

```text
resume: final review
```

It reads the original work order, complete verification sequence, diff, tests,
ideation receipt, and all affected product/ledger/schema surfaces. It may make
only non-substantive handoff corrections. An acceptance-relevant change fails
the review and returns through repair plus fresh verification. On pass, this
phrase is explicit authority to write the immutable `FINAL-NNN`, record the
pass, commit the reviewed state, push only the WO branch, and open a mergeable
PR. It never merges the PR; that remains yours.

After the reviewed commit exists, the final reviewer invokes the bounded PR
publisher with a committed body file inside the worktree:

```bash
npm run worktree -- publish WO-NNN --title '<reviewed title>' --body-file <contained-reviewed-body-path>
```

The publisher prints the exact release-close handoff to use after you merge.

`main` requires a PR through the repository's GitHub ruleset. A 404 from the
classic `/branches/main/protection` endpoint is not evidence that the branch is
unprotected; ruleset-aware inspection is required. Project tooling therefore has
no direct-push-to-main path.

**5. Merge, clean up, and release-close.** You review and merge the PR. In the
still-open subject session, enter:

```text
resume: release close
```

That phrase is explicit authority for the agent to run the guarded close from
the main checkout with tag publication enabled. The command proves the PR is
merged, fast-forwards `main`, removes the known merged worktree/branch, and then
checks the work order's application release target. At a new boundary it runs
`npm ci`, full release evidence, manifest/notes generation and validation, and
pushes only the annotated tag. A strictly lower target records an honest
no-release close; an equal target succeeds only when the existing validated tag
names the exact commit, otherwise it refuses. Either successful path leaves
clean `main` in the closed, between-work-orders state. WO-004 is the planned
`v0.2.1` patch.

WO-004 has one bootstrap wrinkle: the old main checkout cannot run a package
script that WO-004 has not merged yet. Its PR publisher prints an exact
`cd <main>` plus `node <WO-004-worktree>/scripts/release.mjs ...` handoff. Use
that printed command after merging and after entering `resume: release close`;
the helper updates main before removing its own source worktree. Later work
orders use the ordinary main-checkout package command.

Closeout refuses rather than deleting non-disposable ignored material —
`docs/intake` notes, `.env`, or anything else hidden by `.gitignore`. If that
happens, run `npm run backup:intake` in the subject worktree, reconcile the raw
material into surviving trusted storage, and repeat the phrase. Disposable
`node_modules`, `dist`, `.DS_Store`, and `*.tsbuildinfo` may leave with the
worktree. A failed release evidence gate creates no tag and must become a patch
work order.

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
  the memory, but that memory is uncommitted working-tree state until final
  review commits. A dead session loses nothing; a reset or a clean loses
  everything not checkpointed. Start a fresh session in the same worktree and
  enter `resume: next`; the resolved work order tells the new executor to
  inspect the existing tree before continuing. (Disposable incarnations; the
  workflow remembers the worker.)
- **Out of Claude budget:** route `Model: any` work to Codex; park model-pinned
  work orders — never substitute silently.
- **Executor asks you a question it shouldn't** ("should I run the tests?"): the
  answer is in the WO's evidence gate. Say "follow the work order" and note it —
  that's a future compiled feedback unit.
- **Executor went sideways:** kill it, don't argue with it. Fix the WO or the
  doc that misled it (that's the real bug), then preserve the entire dirty tree
  with a named stash, for example
  `git stash push --include-untracked -m 'WO-NNN recovery'`; never drop that
  stash. The stash stack is shared across every worktree of this repository, so
  a concurrent session can reorder or consume entries — re-find yours by its
  `-m` tag, never by `stash@{n}` position, and restore with `git stash apply`,
  not `pop`. Check `npm run resume -- status`. If it advertises a checkpoint for
  the latest transition, a fresh agent may use that exact restore command only
  after the stash succeeds; otherwise repair from the parked diff instead of
  guessing at an older ref. Do not create a hand-written checkpoint commit on
  the work-order branch: valid transitions already mint local
  `refs/dotln/checkpoint/...` commits, while branch commits wait for final
  review. Never `git checkout .`, `git restore .`, `git reset --hard`, or
  `git clean -fd` here without a current recoverable copy — those can destroy
  the deliverable, every `VER-NNN` written so far, and
  `docs/control/resume.jsonl`. Never `git clean -fdx`/`-fdX` at all: it also
  deletes gitignored `docs/intake`, which is single-copy and in no commit. The
  stash includes untracked files, not ignored intake or `.env`; back those up
  separately.

## Weekly hygiene (until DotLn does it for you)

- `npm run backup:intake` — run this whenever you capture new intake, not only
  at `finish`. `docs/intake` is gitignored and single-copy: no commit, no
  checkpoint, and no branch contains it, so a `git clean -fdx` or a forced
  worktree removal ends it. Creates a validated, owner-only ZIP beside the
  project; move it to the trusted backup location.
- `git worktree list` — remove strays.
- Skim `docs/lineage/idea-ledger.md` Session additions — anything learned this
  week that belongs there?
- Ask: does the current rung still ship a visible payoff? If not, re-cut it.

## Resume command surface

The append-only control log replaces the per-work-order copy/paste ledger. In a
fresh session, use one operator phrase:

```text
resume: status
resume: fix
resume: verify
resume: final review
resume: release close
resume: next
```

The agent reads `docs/control/current.md`, runs the matching transition, and
follows the emitted authoritative paths. `status` is read-only. `next` means
“execute the active order” in phase `active`; in phase `closed` it reports the
between-work-orders state and gives the start syntax. `release close` is a
guarded lifecycle command rather than a control-log transition, so successful
closeout does not dirty `main` with transient release state.

The raw command surface remains available for debugging. In the normal loop, the
operator-owned shell steps are worktree start, the printed `cd`, and the Codex
launch; agents run the remaining commands after their chat dispatches:

```bash
npm run worktree -- start WO-00N docs/work-orders/WO-00N-name.md
npm run resume -- implementation-ready   # executor, after evidence is green
npm run resume -- verify                 # allocates the next immutable VER-NNN
npm run resume -- verification-result pass|fail
npm run resume -- fix                    # emits original WO + failing VER paths
npm run resume -- repair-complete
npm run resume -- final-review
npm run resume -- final-review-result pass|fail
npm run worktree -- publish WO-00N --title '<title>' --body-file <contained-reviewed-body-path>
npm run release -- close WO-00N           # closes/prepares; creates no tag
npm run release -- close WO-00N --publish # explicit annotated-tag authority
```

Verifiers write the exact report path allocated by `verify`, then record its
verdict. Repair and final-review completion actions are recorded only after
their evidence exists. Illegal transitions refuse without appending. The JSONL
log is canonical; `docs/control/current.md` is regenerated projection.

## End-of-workflow release task

The canonical operator interface is `resume: release close` after you merge the
final-review PR. That phrase authorizes the agent to run
`npm run release -- close WO-NNN --publish` from the main checkout. The tool
integrates guarded worktree finish, exact-main synchronization, lockfile
installation, evidence, manifest/notes validation, and annotated-tag
publication. It pushes no main commit and publishes no npm, binary, container,
or hosted artifact.

The form without `--publish` is not read-only: it still performs guarded
merged-worktree cleanup and fast-forwards local main. At a new eligible boundary
it also installs the lockfile and runs release evidence; lower or
already-published targets return after their own validation. The form withholds
only tag creation/publication. If you deliberately defer an otherwise eligible
release, require a reviewed durable reason rather than leaving publication state
ambiguous.

Forward manifests and layered notes live in the annotated tag message; the
checked-in `v0.2.0` files remain the immutable historical exception. A rerun
accepts the same validated remote tag as already complete, but conflicting or
moved tags refuse. Do not backfill `v0.1.0` without a reconstructable reviewed
commit and evidence.
