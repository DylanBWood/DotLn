# WO-226 executor handoff

The implementation covers the export runtime and update route, publication
admission diagnostics, pasted dispatch prefixes and the optional Fable worker.
Release preparation assigns application v0.90.0; compiler 0.30.0, skeleton
0.65.0 and console 0.4.5 are staged. No dependency was added.

## Acceptance judgments

**Criterion 1:** met — The fast-forwarded-export fixture in scripts/test-launchpad-export.mjs changes the hook pin and leaves its snapshot absent. Its base-build control withholds on missing tsconfig.json; the emitted recovery restores the carried runtime and dispatches without a source build. The existing WO-195 core case passes.

**Criterion 2:** met — That export fixture exercises worktree finish, npm run harness -- check, the release-close refusal and both Codex resume advisories, then scans the shipped scripts and emitted hooks. Export paths name the carried restore or bootstrap; remaining source-build advice is confined to core branches. The process-debt refresh cases also pass.

**Criterion 3:** met — The update fixture fast-forwards and bootstraps clean main through both absolute and checkout-relative origins. Dirty, non-main, divergent and missing-origin controls preserve working files, Git metadata and runtime bytes. The client README describes update --finish, explicit --tags precedence and the literal host-rule fallback; product 03 records the finish route.

**Criterion 4:** met — The registered-target fixture admits gate-only registration edits in either checkout while changes to baseBranch, authorityProfile, release, roots or the grants bytes withhold and name the field. Existing grant, registry, phase and source-closure controls remain exercised.

**Criterion 5:** met — The shell-syntax fixture records near-miss advisories for pipes, redirects and prefixes around recognizable helpers without a permission decision. Plain helpers, raw git/gh/npm and quoted prose retain their existing treatment.

**Criterion 6:** met — The pasted-prefix fixture records one prefix, class, role and zero-based prefixLine from the first content line after admitted blank/fence framing. Later prefixes, ordinary prose and a second opening fence do not dispatch.

**Criterion 7:** met — Generation and drift checks cover the default worker and the Fable definition. Role instructions and product 07 preserve the default and Codex pins and require dispatch opt-in. Direct receipts cover default, Fable and codex-spawn-agent provenance without invented effective settings; the instance digest binds both generated files and rejects unknown worker filenames.

**Criterion 8:** met — The complete npm test -- --review row passes at the code identity below; git diff --check is clean, dependency changes are absent and versions and editions are recorded below. The npm run test:docs claim is finalized by its passing current-tree row after this handoff's last edit; implementation-ready consumes that row and refuses a missing or stale result.

The paired controls, commands and source cases are in [controls.json](controls.json).
The baseline limits and validation record are in [README.md](README.md).

## Executed evidence

- `npm test -- --review`: pass; 41 required suites, 106 fresh tasks, zero reused tasks and zero unrun suites.
- Recorded `2026-10-22T04:47:12.952Z`; duration 1581147 ms; identity unchanged through the run.
- Code identity: `3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241`.
- Evidence source: the canonical `node scripts/harness.mjs evidence --wait` completion row.
- `git diff --check`: clean. A nested-repository scan excluding intake found only the worktree’s own `.git` entry.

Regeneration selected authority WO-226/003 and artifact-identity, verification
and feedback WO-226/001. Historical editions remain intact. Publication
validation passed after the product write-backs; sync reported all artifacts
current. The final document selection judges these report bytes before readiness.

The complete-run repairs and their checked causes are recorded in
[D017](decisions.md#wo-226-d017), [D018](decisions.md#wo-226-d018),
[D019](decisions.md#wo-226-d019) and [D020](decisions.md#wo-226-d020).
The focused reproductions confirm the instruction-cost regression, both export
planning/update flows and the complete export recovery/finish case; they do
not substitute for the passing complete row.

## Review and limits

self-review: found 2; fixed 2; recorded 0

The [two independent reviews](self-review.md) found a relative-origin
resolution bug and missing Codex worker-type provenance. Both were fixed
and each worker reviewed its repair with zero outstanding findings. Workers
used codex-spawn-agent, gpt-6.1-sol, max, fork_turns none: two direct workers,
zero descendants, cap 20. Their effective settings were not independently
read back.

[D018](decisions.md#wo-226-d018) and [role-costs.json](role-costs.json) record
the required shared guidance's 310-byte addition per role, executor's
114-byte headroom and reviewer's 29-byte overrun against unchanged ceilings.
Equivalent-usefulness optimization is boarded on `FUP-957602bc42e32e1d`.
The host classifier and a live Fable planning pass remain unqualified as
the order specifies; this fixture evidence does not claim either observation.

Goal alignment: the outcome matches the authorized scope. Core retains its
build route; exports prepare their carried runtime, publication authority
continues to be checked and Fable remains an explicit opt-in.

Executor attestation: codex-cli 0.163.0, gpt-6-astra, max;
source codex-session-readback. Handoff usage is read through harness usage;
the available final counters, source, scope and cutoff remain in ignored
receipts and the operator response, with unavailable cost reported as unknown.
