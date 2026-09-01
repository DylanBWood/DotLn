# WO-004 implementer hardening receipt HARDENING-001

**Status:** implementer-owned pre-verification evidence, not an independent
`VER-NNN` and not a control-state transition.
**Authority:** WO-004 acceptance-evidence bullet 9 as clarified by its VER-001
repair authority and receipt contract.
**Timing:** 2026-08-31, during the repair following VER-001. This receipt did
not exist before WO-004's first `implementation-ready`; it records the repair
review honestly rather than backfilling a fictional earlier artifact.

## Executable evidence and adversarial probes

- `bash scripts/test-resume.sh`, `bash scripts/test-checkpoint.sh`,
  `bash scripts/test-worktree.sh`, and `bash scripts/test-release.sh` all
  passed after repair.
- The worktree and release success fixtures set `push.followTags=true`, create
  reachable unrelated annotated local tags, exercise the authorized pushes,
  and enumerate the remote refs. The PR path leaves exactly `main` plus the
  work-order branch; the release path leaves exactly `v0.2.0` plus the
  authorized `v0.2.1` tag.
- A separate release fixture creates a conflicting local-only candidate tag.
  Closeout refuses it, preserves its object, and leaves the remote candidate
  ref absent.
- The release success fixture exercises the WO-004 bootstrap shape: main is
  behind the merged PR, the reviewed release helper is loaded from the subject
  worktree with main as its working directory, main is fast-forwarded, and the
  helper safely removes that source worktree.
- A checkpoint fixture first creates a valid recovery ref, then forces the
  next Git checkpoint command to fail. The projected state removes the old
  restore command, prints that the latest checkpoint is unavailable, and the
  event records `checkpointUnavailable:true`.
- A discovery parity probe parsed `environment.json` and confirmed that the
  observed `mcp` command, locally documented MCP flags, and observed Codex
  ignored-user-config row match the Markdown classifications.
- Two temporary-copy mutation probes independently removed
  `--no-follow-tags` from the tag push and branch push. `test-release.sh` and
  `test-worktree.sh` each failed under their corresponding mutation; both
  mutations were therefore detected by executable evidence.
- `npm test` passed the shell suites and all 68 Node tests. A SHA-256 over
  `git status --porcelain=v1 --untracked-files=all` was identical before and
  after the run
  (`1f26662bb0b26721744f8da4d4ff59ac4dd77dfb60f5db5432e98b5d4c724605`).
- `git diff --check` passed.

## Senior code-quality review

The review traced both push argument arrays, mutation order, error paths,
shell quoting, path containment, and fixture assertions. It found the VER-001
tag-following defect and repaired both sites with an explicit Git override,
then strengthened the tests from existence checks to exact remote-ref checks.
It also made the final-review result name the bounded PR publisher and made
the publisher choose between the ordinary and bootstrap closeout commands
from actual main-checkout capability. No raw stack trace or uncontained-body
regression was introduced; the focused suites cover both.

## Staff workflow and failure-mode review

The review followed final-review pass through commit, branch publication, PR
merge, main synchronization, merged-worktree removal, evidence, tag creation,
remote rejection, local-ref creation, and idempotent rerun. GitHub CLI is still
preflighted before the first branch mutation. Tag publication still happens
only after evidence and manifest validation, and the local tag ref is still
created only after the remote accepts the tag object. The one-time WO-004
bootstrap is now both printed and exercised. Non-publish closeout is documented
as mutating local lifecycle state rather than mislabeled read-only validation.
The stale-checkpoint failure mode now fails closed instead of advertising a
destructive older restore target.

## Principal architecture, authority, and compatibility review

The repair preserves the authority envelope: final review may push only the
work-order branch and open its PR; release close may push only the validated
annotated tag; neither path pushes `main`, merges a PR, publishes a package, or
changes repository settings. The release manifest remains bound to the exact
merged commit and retains separate application, component, schema, cadence,
toolchain, and evidence axes. The release docs now state the real local effects
of both closeout forms and restore the duty to record an intentional defer.
The work order explicitly authorizes its previously omitted compatibility
surface and this receipt without converting implementer evidence into
independent verification.

## VER-001 non-blocking dispositions

- F5, F8, F9, F10, F11, and F12 were repaired in this episode.
- F6 is historical local-ref provenance that cannot be made authentic
  retroactively; the existing verifier disclosure remains the durable record.
- F7's source-text cadence derivation remains a follow-on hardening candidate.
  Its current result was independently confirmed by VER-001, manifest-field
  mutation remains covered, and replacing the compatibility extractor is an
  architecture-level change not required by the bounded repair.
- The remaining observations require no repair and do not weaken the repaired
  external-effect boundary.

No independent-pass claim is made here. The next verifier must allocate
`VER-002`, rerun the evidence, and judge this repaired subject from the
original work order and the full immutable verification sequence.
