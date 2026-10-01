## Release overview

A release close no longer stops at a scratch repository. Before this release, any nested Git repository with commits blocked worktree cleanup, even under `.runtime/`, where every other file is already discarded. WO-117's close stopped that way at its walkthrough clone, and the session then moved the repository by hand. Now a nested repository under a scratch directory (`.runtime/`, build output, the harness and cache lanes, the beacon directories) leaves with the worktree, and the close finishes. Its commits are bundled into main's ignored retained lane first. This release is for operators running `resume: release close`.

## Read before upgrading

- **No migration.** Completion events gain an additive `material` field; an event without one reads as no rows.
- **Scratch directories now take whole repositories with them.** Anything an executor needs to keep must not live under `.runtime/`, build output or the harness and cache lanes. Repositories under `docs/intake/` and content repositories under the control-local lane are preserved as before.
- **A repository elsewhere still stops cleanup after publication.** The close prints one retry command, `node MAIN/scripts/release.mjs close WO-NNN --publish --material 'WORKTREE::PATH=disposable'` (with the checkout, worktree and repository paths filled in), which finishes cleanup without publishing again.
- **Product 07 changed.** Its cleanup paragraph no longer says "never force teardown". The close passes `--force` to `git worktree remove` only when every untracked entry is a byte-verified preserved intake unit.

## Substantive changes

**The lane rule.** `describeIgnoredMaterial` (`scripts/lib/paths.mjs`) reports a nested repository with commits as disposable when it sits in an explicit scratch directory lane. Before, every nested repository with content outside intake and control blocked cleanup. File-suffix rules and linked worktrees do not extend to whole repositories.

**The close removes it.** `worktree finish` and `settle` inventory nested repositories at close, recompute each lane, bundle every commit of a disposable repository (unreachable commits included), verify the bundle by importing it into an empty repository, then remove the worktree. If inventory or the bundle cannot be proved, the source is retained.

**Also shipped, not judged by this order.** The order was amended during final review to judge only the case above ([D035](../../evidence/WO-176/decisions.md#wo-176-d035--operator-amendment-judge-the-order-on-deleting-scratch-repositories)). The rest ships as implemented and as two verifications judged it:
- `npm run worktree -- material PATH --disposable|--preserve --reason TEXT`;
- completion `material` rows bound to the worktree and repository state;
- the close's `--material` flag;
- the ignored `docs/control/local/retained/WO-NNN/release-close.json` record of each close attempt.

## Progressive polish

The Node-only staged-build fixture now copies the `browser-evidence` workspace that v0.59.0 added, and its stage assertion includes it. Derived-worktree advisories name a settle retry instead of an operator-terminal force removal.

## Evidence and compatibility

Application `v0.60.1` is a patch release over `v0.60.0`, built from WO-176 on `main` at `ee9b9db9`. No component version changes. `scripts/lib/paths.mjs` is a build-only evidence source. WO-176's deterministic revision-001 editions are committed. Main's WO-180 editions remain selected, and every edition check passes on the integrated tree.

The verification sequence:
- [VER-001](../../verifications/WO-176/VER-001.md) passed.
- [FINAL-001](FINAL-001.md) failed because a scratch repository that gained a commit was removed. The operator has since stated that removal is wanted ([D036](../../evidence/WO-176/decisions.md#wo-176-d036--correction-the-review-role-judged-scratch-deletion-as-data-loss)).
- A repair ran, then [VER-002](../../verifications/WO-176/VER-002.md) passed.
- [FINAL-002](FINAL-002.md) passed on the amended criteria. It ran WO-117's exact repository shape through the subject.

`npm test -- --review` passed at code identity `d1c1a36288d1e3fd091b4610191df9d33f915c218d858d7607a35787f03302d9`: 39 suites, 0 failed, 801.58 s. `npm run test:docs` passes.

Known limits:
- **No real close yet.** No close has run after merge; the evidence is the release fixture and the exact-shape probe.
- **Scratch elsewhere.** A scratch repository outside the scratch directories still needs the printed retry. The planner follow-up `FUP-a1e36af45f68e3ac` makes the executor and the reviewer remove scratch repositories before handoff, and the close remove any that remain without asking.
- **Shipped machinery.** Its recorded defects are in [D033](../../evidence/WO-176/decisions.md#wo-176-d033--verification-nested-object-stores-escape-the-state-binding-and-the-recovery-bundle), [D034](../../evidence/WO-176/decisions.md#wo-176-d034--verification-close-word-record-accuracy-and-hardening-defects-boarded) and [D037](../../evidence/WO-176/decisions.md#wo-176-d037--final-review-defects-in-the-shipped-machinery-the-amended-order-does-not-judge).
