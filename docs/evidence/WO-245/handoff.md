# WO-245 implementation handoff

The kit's complete guide now lives in manifest-listed `docs/KIT.md`. The
short, pinned README seed points to it. Starter refresh migrates a proven
older README once and reports customized, missing or non-regular READMEs as
kept while publishing the kit update. Kit-root releases accept a README
without release markers; present markers and core retain their validation.
This matches the order's intended ownership boundary.

Application target: **v0.108.0**, prepared by the release command. No package
source, package version, dependency or lockfile changed. Before the final
complete run, HEAD and main were both `a6665a2449eaa3631e6e7f701b8fdeffc6c9a2f6`
and their left/right counts were 0/0, so no integration was due.

This handoff becomes complete when `ImplementationReady` consumes the passing
review row and a passing document row for this file's exact candidate tree.
The final document receipt is recorded in that event's `evidence.documentGate`
in `docs/control/orders/WO-245.jsonl`; it must be produced after this file is
written, rather than borrowed from an earlier document tree.

## Acceptance judgments

**Criterion 1:** met — `scripts/test-launchpad-export.mjs` checks the guide's manifest SHA-256, all eleven required headings, absent release block, and the seed's pinned digest in its new `launchpad-docs` case. Its execution is covered by the final exact-tree document row consumed at completion.

**Criterion 2:** met — that document case checks the short seed's display name, guide pointer, exact v0.1.0 release block, manifest exclusion and exported docs README pointer. The final document row supplies its execution evidence.

**Criterion 3:** met — the complete review's `launchpad:file:test-launchpad-update.mjs` task passed. The fixture proves the one-time long-guide migration, preserved custom bytes/mode/missing/symlink entries with `keptSeeds` reasons, successful kit publication, repeat idempotency, and unchanged refusals for other seeds.

**Criterion 4:** met — `release-preparation` and the release surface cases passed in the complete review. Kit fixtures without markers assign and retime the heading without changing README bytes and record `not carried`; working and committed close checks admit the absent block. Core and malformed or present-marker cases retain their requirements.

**Criterion 5:** met — `instance-history` passed in the complete review. The historical instance replaces its README before updating; the case preserves those bytes, passes the instance document gate, and prepares its release without restoring markers.

**Criterion 6:** met — product 03's platform boundary and `docs/KIT.md` state the implemented ownership, migration and optional-block rules. `npm run publication:check` passed after source-lock regeneration; the final sync reported publication current. Decisions D002 and D003 record the rule and write-back provenance.

**Criterion 7:** met — `npm test -- --review` passed with the row below; `git diff --check` is clean and no dependency changed. Completion additionally requires `npm run test:docs` to pass on this handoff's exact tree and records that receipt alongside the complete row.

## Executed evidence and reviews

The final complete review started at `2026-11-02T02:17:13.764Z` and recorded
at `2026-11-02T02:59:52.607Z`: **42 suites passed, 0 failed; 112 fresh tasks,
0 reused, none unrun; 0 h 43 min**. The runner and canonical wait both exited
0. Cleanup removed 2,340 owned roots, retained 1 and reported 0 blockers.

- Evidence: `host-gate:9a97631541d0aa1b294fad7bf3ca87b1afc1baf3eda9699e269f5f86fdc4d49e:npm test`.
- Code identity: `9a97631541d0aa1b294fad7bf3ca87b1afc1baf3eda9699e269f5f86fdc4d49e`.
- Review candidate tree: `1bc4380c0ca0c0dc390481034cfa702676485d21`.

The earlier configuration-root and moved-guide scanner failures, their
focused reproductions and repairs are recorded in [D006 and D007](decisions.md).
The accidental stopped run supplies no pass (D004). D008 corrects an
unsupported status diagnosis. The final complete run follows all repairs and
all three workers' final rechecks; no reviewer was restarted after it passed.

self-review: found 4; fixed 3; recorded 1

The [three independent review reports](self-review.md) give criteria 1/1/0,
design 0/0/0 and consistency 3/2/1. Including the two separate gate-found
defects gives 6 found, 5 fixed and 1 recorded. The final bounded scanner
reproduction passed 1 test, 0 failures, at `2026-11-02T02:15:20.257Z`.

Current source and test changes, the guide's changed passages, short seed,
product write-back, decisions and review record were read. Generated outputs
were checked through meta, lineage/index checks, sync and publication checks;
the complete run also passed its structural checks. A final repository scan
found only this worktree's Git root outside intake, runtime, node_modules and
local control storage. The harness owns temporary-fixture retention.

## Limits and process evidence

[D005](decisions.md#wo-245-d005) boards **FUP-912adb42a652b75f**: a future
guide-only edit can reuse product task evidence because core's product code
identity excludes documentation. The selectors now include the guide; a
separate change must bind guide-sensitive reuse to its current bytes. This
handoff uses a fresh complete run and final exact-tree document validation.

The real starter migration belongs to release close; this execution rehearses
it in local fixtures. A fork that edited README before the one-time migration
may meet one Git merge conflict and keeps its own page. The guide and D002's
Read before upgrading note describe that resolution. A later deliberate seed
change must name its migration and update the digest pin.

Executor attestation: `codex-cli` **0.166.0**, **gpt-6-astra**, effort **max**,
source `codex-session-readback` from the current-session usage readback.
Three fresh `codex-spawn-agent` workers were selected as **gpt-6.1-sol / max**
and reused for repairs. Effective worker readback is unavailable. The root
launched 3 workers against the cap of 20; workers reported no descendants.
The host counter observed 0 admissions and labels its uncounted remainder
unknown, so that observation is not substituted for the explicit count of 3.

Usage source: `codex-transcript-counter`, scope `dispatch`. Entry observation
at `2026-11-02T01:23:09.788Z`: 50,136 total tokens. Handoff observation at
`2026-11-02T02:59:55.447Z`: **42,759,083 total tokens**, including
42,321,920 cached input tokens; cost and wrapped command count unavailable.
The dispatch had elapsed **1 h 37 min**, including work and gate waiting.
The failed full run cost 0 h 37 min and the successful fresh run 0 h 43 min;
focused probes reproduced the named failures but supplied no substitute for
the required complete run. Final counters stay in ignored receipts and the
operator response, so recording them cannot stale the final document row.
