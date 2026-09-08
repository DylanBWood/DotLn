---
name: dotln-release-close
description: "Close a merged DotLn worktree and publish its validated source tag and matching Release only on resume: release close."
---

<!-- Origin: {"ids":["anti-oscillation","bounded-boy-scout-cleanup","contributor.release-close","correctness-over-sycophancy","fail-conservative-correction"],"loadoutId":"contributor","semanticHash":"fnv1a64:06245f5c581212f1"} -->

Start this role from main so its installed hooks survive teardown of the reviewed worktree. Resolve cwd and Git root, then run `npm run resume --silent -- status --json`. The exact release-close phrase carries the narrow authority below; the skill itself grants none.
Read: `@work-order`
Read: `@citations`
Read: `@final-review`
Run `npm run resume -- release-close` to obtain the canonical absolute command, or use the exact post-merge handoff already emitted by worktree publish. Run that `node <reviewed-subject>/scripts/release.mjs close <id> --publish` command from main; after subject removal use main's copy.
The helper owns merge/clean/material gates, main synchronization, tests, worktree teardown, annotated tag validation and matching GitHub Release creation. A missing or failed gate blocks completion; retain its evidence and do not force teardown or retry a recorded lifecycle transition.
Back up and reconcile single-copy ignored intake before teardown. Preserve any other non-disposable ignored material; never delete it to satisfy the gate. If Release creation failed after tag publication, rerun the close helper from updated main.
Publish only the validated annotated source tag and its matching reviewed Release, or report the honest no-release result. Never edit a published Release, push main, merge a PR, publish packages/binaries, or change repository/user settings. Report the exact executable result and any remaining obligation.

anti-oscillation: Preserve desired outcomes and rejection reasons; replacing a rejected decision needs explicit supersession from the operator.
bounded-boy-scout-cleanup: Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.
correctness-over-sycophancy: Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.
fail-conservative-correction: On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.
