# WO-251 consistency review

Independent worker: `codex-spawn-agent`, task `consistency_review`; selected
`gpt-6.1-sol`, effort `max`. Effective runtime selection was not independently
observed. Final read-only recheck completed on 2026-11-02 before the complete
gate. The worker made no edits, launched no children and ran no gates.

Reviewer-originated findings: 3 found, 3 fixed, 0 recorded or open.
Two further defects were found by gates and repaired and rechecked, bringing
the known consistency total to five fixed. Discovery provenance is retained
below.

- C1: the current startup-cost consumer still required every role to fit a
  configured or accepted ceiling. Its authorized bounded single-test probe
  failed at the planner's `breach` verdict. The corrected consumer validates
  the current growth decision's recorded optimization follow-up and preserves
  historical measurements and acceptances. The executor reran that test and
  observed a pass; the reviewer rechecked the corrected source and disposition.
- C2: the new read of `docs/planning/followups.json` was absent from the
  process-debt suite's source inventory. The declaration is now present, so a
  register-only change selects the consuming suite. The final recheck confirmed
  the producer/consumer link and D011's provenance.
- C3: the disabled-harness regression's template and removal helper were
  missing from `harness-fixtures` machinery sources. Both are now declared,
  so isolated changes select the consuming suite. The final recheck confirmed
  the declarations and D016; no new runtime dependency was introduced.

The review traced config to emitter/hook/tests, compiler inventory to hook
classification and host deny rules, shared guidance to all 14 installed role
skills and their seven pairs of hashes, the new oracle through its historical
DAG and gate selection, evidence editions through console pins, component
versions through workspace/lock/runtime constants, and kit templates through
copy/export manifests. The installed role hashes and WO-247 parent hash
matched their declarations. Authority evidence selects WO-251/002; the other
three kinds select WO-251/001. Budgets remain unchanged and the planner's
646-byte breach is deferred to FUP-ac86ee429dee2947.

The separate target adapter observation was transferred to the criteria review
and retains its stricter authority. Live desktop and host permission syntax
qualification, complete gates and independent execution of the executor's
reported repaired-test passes were outside this review. See [D011](decisions.md#wo-251-d011).

After the complete run failed, the same worker rechecked one additional
gate-reported consistency defect: the historical worker-profile hash consumed
the shared inventory without accounting for its eight desktop additions. The
repair asserts the exact entries and effects before removing only those
additions from the original hash input. The reviewer traced the compiler
prefix list through `harnessToolEffects`, contributor profiles and both target
profiles to that consumer, and searched similar JSON, hash and count consumers
across scripts and packages. No further stale pin was found. Existing source
declarations already cover the changed test and its producers; no new
dependency was introduced. D013-D014 and the unchanged generated surfaces
were rechecked without probes or gates.

That gate discovery is not attributed to the reviewer.

The document gate found the second gate-reported defect: the new template
paragraph made exported cold starts larger than core's. The template repair
preserves the rules and locked sections while reducing redundant prose; the
original comparison is unchanged. The reviewer traced its new paragraphs to
the exact removal selectors, retaining all prior forms. KIT_TEMPLATE_FILES
contains the template, EMIT_CLOSURE contains the helper, and fixture copies
already include both. The only missing registration was C3 above. Deterministic
generated outputs and evidence selections remain current, so no evidence
edition was re-minted for this repair. D015-D016 and their index entries agree.

The final recheck completed before the new complete run: three reviewer fixes
plus two gate-reported fixes, zero open and zero new findings. The repaired
export-comparison and disabled-floor probe passes were parent-reported. No
probes, gates, edits or children ran in these rechecks. Fresh complete and
exact-candidate document validation remained pending at the review cutoff.
