# Independent executor reviews

## Repair dispatch (resume: fix, 2026-10-13)

Two fresh Claude `dotln-worker` agents reviewed the repair: a criteria adversary
and a design improver. Each received the order, VER-001, decisions D009 to D013,
this dispatch's diff against its starting checkpoint and the retained run. They
were read-only, ran their probes under the bounded wrapper and changed no file.
They launched with the role's pin; no effective model or effort was read back.
Neither found a blocking issue. The adversary could not refute that the witnessed
run closes the live-view, status-row and carry-in findings, and it re-derived
the run's facts independently. Dispositions are recorded in
[WO-118-D014](decisions.md#wo-118-d014--independent-review-of-the-repair).

### Criteria adversary: found 11; fixed 9; recorded 2

1. The README overstated what the checker re-derives. Fixed: the checker derives
   the outward screen, the delivered-head verification, thread resolution, the
   carried conditions and the measures from retained material. The recorder
   keeps its thread read for it.
2. Several assertions passed trivially. Fixed: the restart is held between the
   bundle settlement and the contract start, the committed console and snapshot
   transcripts equal their sources, every vertical event is the vertical
   host's, and the resident audit is a prefix of the ledger.
3. D012 called the 25-row probe the test's own ledger. Fixed: the committed
   probe replays the test's ledger, giving 27 rows before and 2 after, and D012
   says so.
4. D011 rejected working outside the guard although two diagnosis runs did.
   Fixed: D011 records both direct runs, and the review gate reruns the recovery
   suite under the restored guard.
5. The README pointed at a handoff with the pre-repair identity. Fixed: the
   handoff records this dispatch's gates.
6. The capability section's audit wording was too broad. Fixed: it names the
   governed raw view.
7. The 73 frames include repaints after status requests. Fixed: the README and
   the measure give 37 change-driven, 18 status and 18 repaints, and the checker
   counts only change-driven frames as the console's report.
8. D013 said console input was only status requests, but the driver also sent
   quit. Fixed: D013 names the closing quit.
9. Setup's remote write was not inventoried. Fixed: control actions record the
   control issue's creation and that the review-fixture variable was only read.
10. Recorded: the write-back sentences still describe live status as a separate
    demonstration. They remain true, and the vision sentence is bound by its
    exact writeback route.
11. Recorded: a resolved continuation now leaves no trace in live status. This is
    a design option for WO-083's planner, not a defect.

### Design improver: found 15; fixed 12; recorded 3

1. The new checker failed the format check. Fixed by `npm run format`.
2. The checker re-derived less than claimed. Fixed as adversary item 1.
3. The committed transcripts were not tied to what the checker parses. Fixed as
   adversary item 2.
4. The console parser dropped entries it could not read. Fixed: it fails on an
   unparsed actor entry, and it scopes status frames to their actors block.
5. The export receipt's build hashes were redacted. Fixed: they are recorded
   unredacted, and the checker requires the export's runtime to equal the core
   build.
6. The checker's dependence on purgeable stores was unstated. Fixed: the README
   and the checker's header say so, and the checker exits with a plain message
   when the stores are gone.
7. One checker comment used an order identifier in place of an explanation.
   Fixed: it now lists the five carried conditions.
8. Section comments led with criterion labels. Fixed: the explanation comes
   first.
9. Constants were scattered and unnamed, the step list was deduplicated, and the
   summary printed literals. Fixed: named constants, an exact step list and
   computed summary values.
10. The restart marker in the snapshots was unnamed. Fixed in the README and
    D013, and the checker requires exactly one row without a view.
11. Recorded: naming the four awaiting-operator results in runtime-status.ts.
    This is behavior-neutral and would change the build the witnessed export
    carried.
12. Recorded: trimming the new test's admission-hold case and commenting its
    stand-in step. The compiled test ships in the kit.
13. Wording in D011, D013 and one measure method. Fixed.
14. Recorded: the kit README's hold sentence. The kit carries the file, and the
    sentence is true.
15. The discrimination probe had no reproducible command. Fixed: it is committed
    as `probe-status-retirement.mjs`, and fix-checks.json gives its command.

Both reviewers also met home-directory paths in WO-187's records at HEAD.
WO-118-D014 routes them to the planner as a follow-up.

## Implementation dispatch (resume: next)

Two fresh Codex workers received only the work order and diff, with a refreshed
final diff after the completed-loop and visibility receipts were written.
Both were launched as gpt-6.1-sol / max under the executor skill's pin; this is
launch selection, not effective-model readback. They had read-only duties and
ran no probes, changed no files and launched no descendants.

### Improver

Found 1; fixed 1; recorded 0 unresolved.

P2: the completed-run check's process-stop ordering assertion accepted `-1`
when no stop record existed. The assertion now requires a nonnegative stop
index before the replacement attempt. The strengthened checker passes against
the retained native logs. No other design or maintainability findings. The
review explicitly found that the completed loop and later visibility witness
were clearly distinguished, with efficiency and answer-consumption limits kept.

### Criterion adversary

Found 1; fixed 1; recorded 0 unresolved.

The preterminal review-control author setup appeared in the receipt but not the
control-action inventory/checker, making the completeness wording too broad.
The explicit inventory now includes its separate setup receipt. The checker
validates its purpose, no-model-judgment/no-grant scope and timing before both
publication and the planted suggestion, and checks the remaining entries against
the complete driver action list. README distinguishes driver and setup records.
The adversary judged this preparation within the order's permitted control input;
it found no implementation or authority finding and required no fresh run.

The adversary supported criteria 2–4 and 6, and criteria 1 and 5 with the above
accounting correction. Criterion 7's final gates were intentionally pending
and were not counted as a finding. Gate results are recorded in the handoff.

### Other checks

The reused research worker independently checked 13 native model launches,
final-head original-criterion coverage, two delivered commits, review resolution
and exact equality of all 29 governed audit events to the vertical log. Earlier
it found omitted terminal retry/repair holds and typed refusal display; these
were fixed and covered before the final independent reviews.

The first final document gate reported 34 passing tasks and one failure. The
new capability table header did not match the existing parser's supported
format. Restoring the established Current assessment / Evidence and remaining
gate header fixes the authored writeback without changing the reader. The final
gates, not that failed run, judge completion.
