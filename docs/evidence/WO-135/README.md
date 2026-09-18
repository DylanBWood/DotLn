# WO-135 implementation evidence

The `resume: next` dispatch implements the three planning-gate corrections in
[the work order](../../work-orders/WO-135-capability-id-admission.md), plus the
operator's explicit personal command-rule and security-runbook expansions.
The session reports Codex CLI 0.154.0, GPT-6 Astra, ultra effort, from effective
session readback. Independent verification and final review are separate phases.

## Delivered behavior

| Obligation | Implementation and evidence |
| --- | --- |
| Capability write-backs | `reassessments` accepts addition/reassessment headings for a judged order. Unknown ids produce `dated-capability-addition`; existing observations keep their prior classification. Actual WO-068/WO-052 sections are replayed against receipts 014/015. Original subject construction and receipt bytes are unchanged. |
| Invalid additions | Fixtures retain rejection of unknown orders, invalid dates, stray headings, modified prior content and empty observations. The original refusal messages are preserved. |
| Dependency topology | Both public checks use one current-workspace checker over existing typed blocking projections. Unmet hard, close, release and planning-deferral edges order their sequenced endpoints; a two-entry group admits no blocking edge. Groups of three or more retain serial order. A planning deferral follows its `until` target. |
| Historical sequence | The frozen 2026-09-16 sequence exposes both WO-114→WO-120 and WO-115→WO-100. The original 2026-09-17 fourteen-pair sequence passes both public checks and is pinned against added/lost pair separators. Its closure state is frozen so future releases cannot erase the failure fixture. The subsequent WO-141 fifteen-pair sequence also passes. |
| Planning write boundary | Every generated Claude pre-tool hook checks classified writes on `planning/` branches. Repository code paths refuse with the path and override route; docs, root Markdown and external scratch remain usable. Physical aliases, shell cwd, unlink and `touch -h` symlink semantics are covered. Codex receives the same role duty. |
| Write-backs | Product 07, the security runbook, map dispositions, compiled instruction and decisions record carry the change. No capability id is introduced or level promoted. |
| Adjacent release-header repair | The exact legacy evidence-only prefix correction preserves the release type and remaining description bytes. All three release types, changed types/descriptions/status, absent legacy prefix and immutable receipts are covered. Queue item `adjacent-0001` completed after the focused suite and document gate passed. |

`plan start` already records its document-only dispatch by creating the
`planning/` branch and returning its authority metadata; this change adds no
separate start record. Opaque shell programs remain host-delegated under the
existing boundary. The guard is not an operating-system sandbox, and the Codex
role text is not an automatically invoked hook.

## Executed checks

- Plan-refutation fixture suite: 38 passed, 0 failed, including five WO-135
  cases and historical receipt/admission coverage.
- Work-order fixture suite: 16 passed, 0 failed.
- Harness fixture suite before the final `touch -h` refinement: 49 passed,
  0 failed. The final generated planning-hook fixture, including no-follow
  symlink positives and ordinary-follow/code-path negatives: passed.
  Compiler harness suite:
  5 passed, 0 failed.
- `harness check`: 28 generated surfaces current.
- Live existing feedback audit: complete, ten fixtures, Codex CLI verifier;
  current event streams and all four evidence editions are recorded under this
  order. Authority and feedback revision 002 capture the final refinements;
  artifact identity and verification retain revision 001. Earlier editions
  remain intact.
- Final `npm test`: 19 suites passed, 0 failed; 63 fresh tasks, 348.24 seconds.
  [Product transcript](product-gate.log).
- Final `npm run test:docs`: 17 passed, 0 failed; 17 fresh tasks, 163.82 seconds,
  including `plan` and `plan-refutation-current`.
  [Document transcript](document-gate.log).
- `git diff --check`, the publication check and final formatting check pass.
  The reviewer still runs and records the separate final-review product gate.

The classified local release is application `v0.29.3`, compiler `0.13.1`,
skeleton `0.25.2`, above locally observed `v0.29.2`. Kernel and console source
versions are unchanged; their generated evidence reflects the selected edition.
Skeleton's exact compiler dependency and lockfile pin also track `0.13.1`;
`npm ls @dotln/compiler --json` passes.
No new dependency, public schema, contract or hash preimage is introduced.

## Operator-expanded personal configuration and documentation

The personal SSH/SCP/SFTP rules were installed outside the repository, in
`~/.codex/rules/personal-remote-deny.rules`, on the operator's explicit request.
Combined installed rules return `forbidden` for twelve bare/argument checks of
basenames and `/usr/bin/` paths, with `git status` and `ls` as non-forbidden
controls. These checks parse commands without executing them. Codex TOML
remains unchanged; restart Codex to load the new rules into a fresh root session.

The [security runbook](../../AI-HARNESS-SECURITY.md) now preserves both
sandboxed and unsandboxed choices for Claude and Codex, command-rule versus
filesystem boundaries, and configuration/rules locations. Claude's new mode is
operator-attested; the earlier WO-136 measurement remains inconclusive. Current
vendor documentation and Codex 0.154.0 source support the configuration claims;
no private credential contents or personal settings files enter this evidence.

## Decisions and limits

[Decisions](decisions.md) record the mission comparison, alternatives, all eight
system traps, NoOp and intervention risks, historical fixture selection,
release assignment and explicit expansions. The observed result is that the
previous failure fixtures now pass their intended admission while malformed
inputs still fail. No measured reduction in future review wall time is claimed.
Executor token and cost counters were unavailable at entry; final usage remains
in ignored process receipts and the handoff response rather than this report.
