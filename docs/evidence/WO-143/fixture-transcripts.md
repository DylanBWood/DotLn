# WO-143 fixture transcripts

Executed 2026-09-19. These are captured host-test outputs, not independent
verification. Focused crash matrices were run during implementation; the final
product gate then reran all resident tests on the final code identity.

The startup matrix predates the decoder wrapper/inventory correction; those
changes only add path-addressed errors and inventory coverage. The final gate
covers their integrated form. The polling matrix is from its focused run.

## Startup boundaries and repeated rounds

```text
✔ WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers (138540.627291ms)
ℹ once-lifetime-fresh: 38 deterministic SIGKILL boundaries; 28 with published guard; exact prefix; one Lost; second restart continues
ℹ once-lifetime-reclaim: 48 deterministic SIGKILL boundaries; 45 with published guard; exact prefix; one Lost; second restart continues
ℹ once-append-fresh: 38 deterministic SIGKILL boundaries; 28 with published guard; exact prefix; one Lost; second restart continues
ℹ once-append-reclaim: 48 deterministic SIGKILL boundaries; 45 with published guard; exact prefix; one Lost; second restart continues
ℹ loop-lifetime-fresh: 38 deterministic SIGKILL boundaries; 28 with published guard; exact prefix; one Lost; second restart continues
ℹ loop-lifetime-reclaim: 48 deterministic SIGKILL boundaries; 45 with published guard; exact prefix; one Lost; second restart continues
ℹ loop-append-fresh: 38 deterministic SIGKILL boundaries; 28 with published guard; exact prefix; one Lost; second restart continues
ℹ loop-append-reclaim: 48 deterministic SIGKILL boundaries; 45 with published guard; exact prefix; one Lost; second restart continues
✔ WO-143 thirty consecutive kill/restart rounds remain openable on once and loop paths (31753.908708ms)
ℹ once: 30 consecutive in-flight SIGKILL/restart rounds, one new Lost per round, final store opens
ℹ loop: 30 consecutive in-flight SIGKILL/restart rounds, one new Lost per round, final store opens
✔ WO-143 live, unreadable and legacy guards refuse unchanged; released locks remain compatible (114.71625ms)
✔ WO-143 malformed resident state preserves dead append guard and lock before reclaim (175.294458ms)
✔ WO-143 killed actors drain without further polling lock acquisitions (427.643375ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 171070.376333
```

## Running-episode polling boundaries

```text
✔ WO-143 once and loop recover kills during a running episode's polling acquisition (33314.942ms)
ℹ once: 34 running-episode polling boundaries; dispatched subprocess episode is lost once after restart
ℹ loop: 34 running-episode polling boundaries; dispatched subprocess episode is lost once after restart
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 33368.133875
```

## Final refusal, compatibility, polling and contention checks

```text
✔ WO-143 live, unreadable and legacy guards refuse unchanged; released locks remain compatible (113.699459ms)
✔ WO-143 malformed resident state preserves dead append guard and lock before reclaim (187.941209ms)
✔ WO-143 killed actors drain without further polling lock acquisitions (435.28525ms)
✔ WO-143 concurrent dead-guard starts publish exactly one reclaim claim (121.451959ms)
ℹ two starts held before the same exclusive claim: one claim, one writer, one refusal
✔ WO-143 a delayed claimant cannot unlink a successor through a retired target (209.243917ms)
ℹ delayed old-target claim refused after canonical identity changed; successor retained ownership
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1119.1745
```

## Final integrated gates

Product gate recorded at `2026-09-19T17:59:25.612Z`, exit 0.
Code identity: `60b1232823ebde601fb807c059d0d554b51696f4486d22eeca3df417493b413f`.
The handoff inspection found the same current code identity. Passing suite
stdout is transient under the existing gate recorder; these are the retained
terminal summary lines, with the full suite result in its ignored gate record.

```text
PASS build 0.46 s
PASS license-surfaces 0.90 s
PASS release:prepare 0.58 s
PASS release:case:preflight 0.08 s
PASS release:case:surfaces 2.84 s
PASS release:case:surfaces_local_snapshot 0.89 s
PASS release:case:prepare_independent 0.82 s
PASS release:case:license_surfaces 3.22 s
PASS release:case:surfaces_committed_readme 1.27 s
PASS release:case:surfaces_lower 1.30 s
PASS release:case:surfaces_first 1.13 s
PASS release:case:surfaces_component 1.83 s
PASS release:case:surfaces_non_source 0.92 s
PASS release:case:surfaces_new_component 1.08 s
PASS release:case:surfaceclose 1.91 s
PASS release:case:surfaceclose_linked 1.60 s
PASS release:case:bodyclose 1.10 s
PASS release:case:dirty 2.37 s
PASS resume 24.49 s
PASS release:case:unreachable 2.43 s
PASS release:case:derived 2.21 s
PASS release:case:nonmain 0.66 s
PASS release:case:settings_scope 2.16 s
PASS release:case:divergence 1.01 s
PASS release:case:malformed 0.89 s
PASS release:case:unauthenticated 1.52 s
PASS release:case:missinggh 1.88 s
PASS release:case:splitorigin 0.81 s
PASS release:case:lower 1.24 s
PASS release:case:failures 2.15 s
PASS release:case:cadence_missing 1.67 s
PASS release:case:conflict 1.55 s
PASS release:case:localconflict 1.23 s
PASS release:case:cadence_inconsistent 3.47 s
PASS release:case:nestedtag 1.31 s
PASS release:case:prepare 1.96 s
PASS release:case:missinglocalprevious 2.00 s
PASS release:case:pushfail 2.31 s
PASS release:case:refrecovery 3.27 s
PASS release:case:stale_helpers 5.99 s
PASS release:case:createrecovery 8.02 s
PASS release:case:runtime_refresh 11.77 s
PASS release:case:success 13.22 s
PASS release:case:firstrelease 2.92 s
PASS worktree 65.86 s
PASS release:case:edition 5.58 s
PASS release:case:cached_evidence 5.58 s
PASS release:case:composed_evidence 4.99 s
PASS github-body 0.08 s
PASS release-preparation 1.72 s
PASS publication-fixtures 0.77 s
PASS backup-intake 0.33 s
PASS license-fixtures 7.06 s
PASS checkpoint 5.98 s
PASS release:case:concurrent 14.02 s
PASS adjacent-queue 0.22 s
PASS console 2.08 s
PASS authority-grants 0.12 s
PASS local-runner-double 0.91 s
PASS artifact-corpus 0.17 s
PASS codex-continuation 5.17 s
PASS work-orders-fixtures 18.25 s
PASS skeleton 244.31 s
PASS kernel 0.56 s
PASS compiler 0.54 s
npm test: 21 passed; 0 failed; 246.82 s; 65 fresh tasks
PASS build 0.47 s
PASS publication 0.16 s
PASS lineage 0.04 s
PASS index 0.66 s
PASS authority-evidence 0.50 s
PASS harness 0.14 s
PASS harness-context 0.13 s
PASS artifact-evidence 0.16 s
PASS harness-evidence 0.26 s
PASS release-surfaces 1.23 s
PASS meta 0.37 s
PASS verification-evidence 1.02 s
PASS format 3.13 s
PASS feedback-evidence 2.30 s
PASS lineage-fixtures 0.44 s
PASS plan-refutation-current 2.25 s
PASS skeleton-docs 2.37 s
PASS plan 2.27 s
PASS console-docs 11.55 s
npm run test:docs: 19 passed; 0 failed; 15.43 s; 19 fresh tasks
```

The 344 startup boundaries, 68 polling boundaries and 60 successive rounds
comprise 472 intentional crash/restart cases. This count excludes discovery
runs, second restarts and older resident tests. Boundary coverage is at completed
Node filesystem calls as explained in [implementation evidence](implementation.md).
