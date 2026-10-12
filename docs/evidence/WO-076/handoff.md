# WO-076 execution handoff

Implemented the version-1 instance build overlay selected by configuration `build.overlay`. Composition supports identity replacement, existing support switches, envelope restrictions, explicit operator/host-policy grants and `build: none`. Invalid inputs refuse before output creation or bundle writes. The manifest binds the exact overlay bytes; the hand-written floor stays intact.

**Criterion 1:** met. The narrowing fixture checks every merged and per-profile output against only the declared writers/evidence changes and their derived hashes, then checks the whole manifest. The [recorded diff and fixture transcript](fixture-transcript.txt) names both field changes and all changed paths; no unrelated change was observed.

**Criterion 2:** met. The identity fixture replaces the identity, removes two supports and equips a different communication support. The no-build fixture removes owned generated surfaces, preserves the hand-written floor, retains an empty manifest and passes check after removing its runtime snapshot. A block-only floor refuses without mutation. The [fixture transcript](fixture-transcript.txt) and passing [review gate](gates.json) record the evidence.

**Criterion 3:** met. Ungranted widening refuses with `AUTHORITY WIDENING`; operator and host-policy grants emit with provenance in every profile manifest. Granting all static denies retains the generic permission-envelope hook. The [fixture transcript](fixture-transcript.txt) records these passing cases.

**Criterion 4:** met. Missing, non-JSON, unknown-key and wrong-type overlays refuse by path without output or bundle writes. Repeated no-overlay emission is byte-identical at the same released runtime. The [pre-change comparison](no-overlay-compatibility.json) checks all 33 generated files: only compiler release metadata and derived runtime pins differ across releases, as the order's common-compiler cost alternative requires; there are no unexpected content changes. [D004](decisions.md#wo-076-d004) records that qualification, rather than claiming raw byte equality across compiler releases.

**Criterion 5:** met. The client README's first section documents the overlay schema and ownership; ADR-0006 has the dated amendment; product 10 has the overlay-schema version axis in place. Publication locks and the decisions index are current. [D001](decisions.md#wo-076-d001) records that WO-069-D001 does not reopen because the existing configuration path is sufficient. Publication checks passed in the document gate.

**Criterion 6:** met. All four selected evidence editions are WO-076 revision 001: authority, artifact identity, verification and feedback. Feedback carries the existing live audit; console self-host inputs and outputs are repinned. The harness inventory passed. `npm run test:docs` passed 35 checks in 116.50 seconds; `npm test -- --review` passed 41 suites in 1535.00 seconds at code identity `d43b5afa42bb68116270fdf7f9a4366f0df823da6e7474341e93bc0a23a54321`, with source and build output unchanged during the gate. [Gate receipts](gates.json) record both results. `git diff --check` was clean; package changes add no dependency.

self-review: found 3; fixed 3; recorded 0

The [independent reviews](self-review.md) found two criteria gaps and one design gap; all are fixed, and both workers' follow-up inspections found none remaining. The first full gate additionally exposed a fixture revision split. [D006](decisions.md#wo-076-d006) records its repair; the targeted real Git cases and the full repaired integration suite passed. The design worker also inspected that repair and found no gap. The adjacent queue has no running or queued item.

The carried Start here directive relocation remains deferred under `FUP-44639ec9a751d8d1`, as permitted by the order. [D003](decisions.md#wo-076-d003) records the default-instruction compatibility reason and reopening condition; the canonical follow-up disposition is deferred.

Release preparation is local: application v0.76.0, compiler 0.27.0 and skeleton 0.58.0, with exact dependency pins updated. No new dependency or live feedback episode was needed. The goal-alignment outcome matches the declared objective; the known identity, enforcement and authority-baseline traps are covered by the passing fixtures.

Actor: codex-cli 0.162.1; gpt-6-astra; ultra effort; source codex-session-readback. Three workers were explicitly admitted: one research worker and two independent review workers, all read-only. The root remained the only writer. The host observed no subagent admissions; that incomplete observation does not replace the explicit count.

Usage was read at entry and handoff from the Codex transcript counter, scope dispatch; the handoff observation cutoff was 2026-10-12T01:20:31.557Z. Final counters remain in the ignored receipt and the operator response; dollar cost is unavailable. Authored outputs were read, generated outputs were checked by their owning gates, and the material inventory contained no nested or scratch repository. Independent verification remains the next lifecycle role.
