# WO-175 executable evidence

The predicate negative control runs the same assertion against current source
and the exact cited baseline, loading the old meter module at its original
module URL so its dependencies still resolve:

```sh
node docs/evidence/WO-175/predicate-reproduction.mjs --baseline
node docs/evidence/WO-175/predicate-reproduction.mjs
```

Baseline: exit 1, `AssertionError: Missing expected exception`, expected
`WO-999-D001.*coldStartBytes.misspelled`. Current: exit 0. The integrated
process-debt fixture also covers budget and order observations, unavailable
values, consecutive samples, candidate/health agreement and a later `reopens`.

The three WO-175 cases pass. All 22 entropy fixtures pass, including actual
fake review/refutation launch observations, instruction paths, temporary-file
bytes/counts, read-only directory removal, a one-line cleanup warning and
parent-environment restoration after a thrown launch. The unchanged historical
entropy check passes seven mechanism receipts and two earlier receipts.

The first full review gate passed 40 suites and failed one stale exact field
expectation. D009 records the correction. The corrected planning-refutation
suite passes 80/80, preserving the failures-block assertions and checking the
new conditions block's command, unavailable wording and 1 KB ceiling.
The release-close adjacent fixture's required WO-132 selection passes 13/13.
The final full review gate passes 41 suites / 85 fresh tasks in 921.04 seconds; [checks.json](checks.json) records its code identity and cutoff.

[Portfolio transcript](portfolio.txt): canonical frozen dispatch of
`60eeecdccc3f3717da492a7416435d2227639bc5`, sibling TMPDIR, build exit 0 and
portfolio 3/3. This is fixture-level capability evidence; the next live entropy
review/refutation is reserved for `planning: entropy reducer`.

[Default listing](conditions.txt): 23.843 seconds; one holding predicate and
two unknown slow rows. [Slow listing](conditions-slow.txt): 133.359 seconds;
document-gate median 35.994 seconds and docs-check 9.85 seconds. The slow flag
preserves the under-60-second default while retaining every named row.
[Planning-entry block](planning-entry.json): 228 bytes, one hold, two unknown.
[Meter](meter.json): WO-150-D003 is listed and the computed health count is 1.
The separate canonical CLI call exits 0 and reports 23.159 seconds.

The explicit document gate passes 24 suites / 24 fresh tasks in 37.42 seconds;
the three gates used for slow timing also pass. The completion command runs
that gate again on the finalized handoff. Four current deterministic editions,
the generated harness check and console pins retain earlier evidence; the
required fresh live feedback audit completes on ten fixtures. D008/D010 record
its source identity, byte accounting, duration and reported cost.
