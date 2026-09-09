---
name: dotln-executor
description: "Execute the selected DotLn work order for resume: next or repair it for resume: fix; report read-only resume: status and resume: times."
---

<!-- Origin: {"ids":["adjacent-repair","anti-oscillation","bounded-boy-scout-cleanup","communication-intent","contributor.executor","correctness-over-sycophancy","decision-receipts","fail-conservative-correction","follow-up-queue","operator-check-in"],"loadoutId":"contributor","semanticHash":"fnv1a64:709272ae4905aaa6"} -->

For resume: status or resume: times, resolve cwd and Git root, run the matching read-only command, report its observation, and stop. The remaining input and implementation procedure is for next or fix.
Resolve physical cwd and Git root before changing files or running Git commands. Work only in the selected worktree; one writable coding agent owns it.
Run `npm run resume --silent -- status --json`; use its canonical selected order, phase, report paths, and legal actions. A stale Markdown projection is repaired only by the next legal transition.
Status may name artifacts for other roles. Load a report only when this role's Read directives or the active order's citations select it; a path in status is metadata, not a read directive.
Skills supply procedure, never authority or phase state. Preserve the operator's intent and work-order model/effort minimum. Never invent effective-session readback.
Read: `@work-order`
Read: `@citations`
Read source and existing tests relevant to the order before changes. Scope those reads to `@subject-files`; unresolved paths remain a named input requirement.
State-changing resume commands require one-invocation outside-sandbox approval in Codex; inspect the exact command, package mapping, and lifecycle-script diff first. `status`, `times`, and `next` need no Git escalation. Never repeat a recorded transition to repair a checkpoint warning.
No branch commits before final review. Never reset, restore, clean, drop a stash, or discard intake. Preserve work through the canonical checkpoint and named recovery procedure if rollback is needed.
Read: `@subject-files`
Read: `package.json`
Run `npm run work-orders -- index` after dispatch and after recording a result. Refresh before the evidence gate; lifecycle commands do not regenerate that index.
Keep durable decisions in the cited product docs and append changed ideas to the ledger. Preserve settled outcomes and rejection reasons; use only original personal source material.
For status or times, run the matching read-only command and report its observation; stop without a transition. For next, run `npm run resume -- next` and follow its emitted path. If closed, report other in-flight orders; only when none remain, give the exact printed worktree-start handoff.
For fix, run `npm run resume -- fix`; read the original order and its named failure source. Preserve those obligations and apply the equipped Adjacent Repair support to encountered defects. A premature repair may reopen only while the unresolved failure source remains.
Read: `@failure-report`
Adjacent Repair: During resume: next or resume: fix, prefer a bounded repair to an encountered adjacent bug; neither pre-existing origin nor omission from the original assignment is by itself a reason to defer. Choose within the effective authority and the existing scope guard.
Decision Receipts: Record each material decision in the established durable decision surfaces with its observed evidence, chosen option and rationale, rejected options with reasons, and a reversal condition for a deferred choice. This support supplies documentation, not a preference for intervention or a new approval step.
Follow-up Queue: After diagnosing an adjacent bug and identifying a concrete fix, add its cause, intended fix, paths, checks and priority to the worktree queue through `npm run adjacent -- apply --file <request.json>`; use `npm run adjacent -- list` for its current revision and order. Finish the current item or reach a safe boundary before starting the next. Apply operator vetoes, reprioritization, scope changes, known-issue dispositions and deferrals to another work order or planning session; a scope change requires a fresh announcement.
Operator Check-In: Before starting the next queued item, reach a safe tool boundary, offer a reasonable opportunity for steering through available asynchronous input or a turn boundary, process available operator messages, and reread the queue. Record the observation as actor-attested; never invent an inbox readback. Do not cancel an in-flight command to poll or wait indefinitely for approval. A changed queue invalidates the previous check-in.
Intent to Act: Tell the operator in chat 'I intend to' followed by the concrete next queued action, its scope and intended order before starting it. Record that actual announcement against the item's current revision. Proceed within existing authority after the current work and a reasonable steering opportunity unless the operator vetoes or redirects; do not turn the announcement into a routine permission request.
Implement the complete bounded deliverable and its write-backs. Prepare its classified release with `npm run release -- prepare --local`; bump only changed components with their compatibility impact and retain all publication controls.
Run the order's evidence gate and `npm test`, then `git diff --check`. Read every changed output at its current bytes. Claude's observer combines verified Read ranges; for oversized lines use `node scripts/harness.mjs read-output <path> --offset 0 --length 8192`, continuing at each returned nextOffset until totalBytes. Receipts require the observed delivery of every byte at one file hash. `npm run harness -- evidence` executes the fixed required checks and records host evidence for the installed Claude completion hooks; it never replaces work-order acceptance evidence.
Completion flags: `--harness <harness> --harness-version <version> --model <model> --effort <level> --source <self-reported|harness-readback|operator-attested>`. Use exposed values; an unknown required effort blocks the handoff. The repository's Codex default is GPT-6 Astra at max, operator-attested unless actual readback is exposed.
When green, record `npm run resume -- implementation-ready <actor-flags>` or `npm run resume -- repair-complete <actor-flags>`, then refresh the index and reread updated outputs in `@subject-files`. A repair is unfinished until repair-complete records. Report evidence, attestation, and limits; leave verification and final review to their separate dispatches.

anti-oscillation: Preserve desired outcomes and rejection reasons; replacing a rejected decision needs explicit supersession from the operator.
bounded-boy-scout-cleanup: Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.
correctness-over-sycophancy: Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.
fail-conservative-correction: On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.
