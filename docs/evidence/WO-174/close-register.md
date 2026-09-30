# WO-174 register write-back at close

The two source rows are currently revision 1, allocated to WO-174:

- ER4-001: `FUP-c494a909ca1c6017`.
- ER4-002: `FUP-4f482b75a1071ab9`.

The executor preserves those live allocations and supplies the drill and
cost records here. The order explicitly schedules their final retargeting
at close; no executor record claims that verification, final review or
close has happened.

The closing actor reads the current register revision and both source
revisions, then applies one canonical `npm run plan -- followups --apply`
batch. Set each row to `settled`, with no targets, and name the closed
WO-174 record and this evidence directory in its reason. ER4-001's reason
must limit the settled repair to the four product package suites: VER-001
and D013 already observe excluded reads in other product script suites.
Keep that remainder pending as `FUP-b28b870422a74166`; do not claim the
whole input-coverage class closed. Preserve these reopening conditions:

- ER4-001: a guarded product package case consumes an excluded tracked input
  after WO-174 closes, or the guard/document routing no longer enforces its
  recorded set. Product script-suite coverage remains D013's pending input.
- ER4-002: a mutant of a direct entry/import/literal script input a machinery
  suite executes passes review because that suite is not selected.

If judgment fails or the order is not closing, leave the allocations live.
Refresh the register's projection through the canonical command; never
edit its JSON by hand or file a disposition against a stale revision.

The integration fixture's committed-input remainder also stays pending as
`FUP-dc1335f4d10f6a75` (D014). F1's consumer repair and its committed-copy
check establish this subject's regeneration, without closing that design gap.
