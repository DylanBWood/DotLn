# WO-112 — repair of VER-002

This executor receipt addresses VER-002 F1–F4 under `resume: fix`, with
[D027–D033](decisions.md#wo-112-d027--preserve-unexplained-shared-changes-and-bind-acceptance-to-its-durable-subject).
It is not an independent verification verdict. The two successful live proof
runs and both filed VER reports retain their original bytes.

## Repaired rules and executable cases

| Finding | Rule now held | Regression evidence beyond the original counterexample |
| --- | --- | --- |
| F1 | An unexplained shared-ref change is preserved and refused; the host never restores an unattributed change. The snapshot includes resolved commits and immediate symbolic targets; alternates retain exact bytes as hexadecimal. | Independent sibling commit, tag creation, ref deletion, equal-commit symbolic retarget, newly created dangling alias and newly created cycle. |
| F2 | Alternates and inspected shared entries must be ordinary files under ordinary parents. Refusal performs no restorative write through a suspect path. | Alternates symlink, hard link and replaced parent directory preserve the outside synthetic file and suspect entry. Distinct invalid UTF-8 bytes cannot compare equal. |
| F3 | A pre-launch baseline, process identity, termination observation and integrity verdict survive host failure. Every unfinished admission checks integrity after termination; a failed verdict stays failed. | Invalid return, rejected transport, actual host SIGKILL after commit, still-living orphan group after lease expiry, ordinary descendant cancellation, and malformed durable records. Restoring a stray tag later does not erase its failed episode. |
| F4 | Each body judgment binds the full screened item, current head, repository/PR and original contract. An unchanged subject replays idempotently. | Changed body, head and contract; legacy unkeyed judgment; stale ID-only supplied judgment; explicit subject-keyed replacement. |

The ordinary-descendant fixture waits for a host-created release file. The
host cancels, awaits termination and records its integrity judgment before
creating that file. Neither the child's attempted-write marker nor its tag
appears. The newly created dangling/cyclic cases matter: merely retargeting an
already enumerated alias would let the old observer detect its disappearance.

The native transport groups writers on Unix. Other nonresident CLI consumers
retain their existing launch behavior. Recovery observes a saved group and
never signals a potentially reused identity. A live or unobservable group
prevents recovery acceptance. Established historical successful observations
retain their immutable replay semantics; an unfinished legacy attempt without
a durable baseline cannot earn a new acceptance.

## Validation

- Bounded writer, source-host and initial integrity suites: 35 passed, zero
  failed, 63.794 s, cutoff 2026-10-06T14:06:50Z.
- Final integrity suite after all review additions: eight passed, zero failed,
  17.205 s, cutoff 2026-10-06T14:45:55Z. Command:
  `node --test packages/skeleton/dist/test/source-change-integrity.test.js`.
- Expanded F4 test: one test with six scenarios passed, 2.254 s, cutoff
  2026-10-06T14:18:16Z. Command:
  `node --test --test-name-pattern='WO-112 F4' scripts/test-target-publish.mjs`.
- After integration, the F4 and malformed-evidence tests passed: two tests,
  zero failed, 4.431 s, cutoff 2026-10-06T15:45:25.370Z. The latter covers
  seven malformed shapes through supplied and callback judgments, including
  unchanged replay. Command:
  `node --test --test-name-pattern='WO-112.*review-body' scripts/test-target-publish.mjs`.
- Deterministic authority, artifact-identity, verification and feedback
  evidence revision 006 generated. The latter records ten present passes,
  ten removal assertion failures and 1,192 fewer matched instruction bytes.
  Existing revisions 001–005 remain immutable.
- `npm run publication:check` passed after the product 03 correction and both
  edition-lock updates: 29 and 45 linked sections current. Product 03 is
  176,759 bytes, 48 below its ceiling; product 06/12 retain their 201/163-byte
  increases within their 300/200-byte limits.
- Earlier repair-source live feedback audit: complete, ten fixtures, 1,192 saved instruction bytes,
  33.832 s, cutoff 2026-10-06T14:28:18Z. Selected Claude Opus 5.5/xhigh via
  `claude-cli-print`, with a 600-second timeout and a CLI-enforced USD 5 cap.
  Revision 003 retains that stream and package pins. The byte-comparison
  repair changes its judged source; revision 004 receives a fresh live audit. Selection is a launch claim;
  effective model/effort is not independently observed.
- Pre-integration live feedback audit: complete, ten fixtures, 1,192 saved
  instruction bytes, 52.570 s, cutoff 2026-10-06T14:49:54Z, on the same declared
  Claude selection and limits. Revision 004 records it; the console fixture
  followed that edition.
- Integrated-source live feedback audit: complete, ten fixtures, 1,192 saved
  instruction bytes, 30.025 s, cutoff 2026-10-06T15:31:44.759Z. Revision 005
  preserves this observation. The final grant-comment correction changes the
  judged source, so revision 006 records a fresh live audit: complete, ten
  fixtures, 1,192 saved bytes, 55.129 s, cutoff 2026-10-06T15:51:38.901Z, with
  the same declared Claude selection and limits. The current console capture
  follows revision 006.
- Combined `npm test -- --review`: 38 suites passed, zero failed, 88 fresh
  tasks, 1,422.592 s, cutoff 2026-10-06T16:19:02.790Z. Code identity:
  `02fce51f8477d5b9fcb48c9321579c8741b5da8fd197b4f3d0d3253b6e4081ec`.
  Both the source identity and built outputs remained unchanged during the run.
- Explicit `npm run test:docs`: 29 passed, zero failed, 85.124 s, cutoff
  2026-10-06T16:22:03.198Z, at the same code identity. The completion command
  also checks the final documents inline after the handoff is filled.

An initial regeneration invocation passed edition flags to the artifact and
verification generators, which accept only `--write`/`--check` and read the
manifest. It stopped at the artifact usage check without changing that
edition. The corrected manifest-selected run passed in 4.229 s. No passing
claim is attached to the failed invocation.

The prematurely started review gate was stopped through the canonical command
at 2026-10-06T14:40:44Z after 528.7 s; it recorded no check. D029 records the
model-selection correction, the byte-collision probe and that avoidable cost.
The capability table's own unfiled WO-112 row was also corrected: the amended
order does ship a runtime repair; its former no-runtime-fix sentence was stale.

## Main integration

The operator's `scope expand: merge in main` brought main at `8218616b` into
this worktree through `npm run worktree -- integrate WO-112`. Six authored
conflicts were resolved: both planning-log tails and console-capture histories
were preserved; current evidence was freshly generated; compiler 0.25.3 from
main and skeleton 0.54.0 with its console/lock pins agree. The continuation
completed with no unresolved files. Checkpoint 10 and the named integration
stash remain. No branch commit or remote write was made during this repair.

The integration check compared 78 historical evidence files and eight repaired
source/test files byte-for-byte against checkpoint 10. Publication, harness
(33 surfaces), release surfaces and planning checks passed in 5.467 s at
2026-10-06T15:35:03.024Z. The earlier full review gate passed 38 suites and
88 fresh tasks in 1,441.000 s at 2026-10-06T15:20:02.225Z. That gate belongs to
the pre-integration identity; the combined result receives its own gate.
The D032 amendment corrects remaining no-code/patch prose without changing
acceptance criteria. D030–D031 record integration authority and assessment.
Final readback caught one more stale placement sentence: it claimed no file
overlap even though the amended source and product 03 now overlap the named
orders. The same D032 amendment records its correction. This changes no
criterion or dependency.

After the combined gate, the material inventory lists all eight retained
scratch repositories with explicit preserve declarations. Temporary audit and
counterexample repositories leave no additional retained repository units.

## Requested reviews and limits

The operator requested an adversarial reviewer and a principal software
engineer reviewer at implementation's end. The first pair inherited Codex
`gpt-6-astra`/`max`. Product 07 pins spawned Codex reviewers to
`gpt-6.1-sol`/`max`, so a second pair supplied the final confirmations on that
selection (D029). All four were read-only, ran no probes and spawned no
descendants; the root executed every test. Each pair was reused for follow-up
inspection. Main's updated executor duty then required a fresh adversary
reading only the order and diff; that fifth reader used `gpt-6.1-sol`/`max`.
The principal reviewer was reused for integration and object-boundary advice.
Five direct reviewers, zero reviewer descendants, and four bounded live
feedback episodes remain within the cap of 20; unobserved descendants are
not invented.

The first reviewers' improvements were
adopted: symbolic target coverage, ordinary-descendant cancellation, a typed
termination-evidence vocabulary, and positive supplied replacement coverage.
The principal reviewer also identified the dangling-ref omission and then a
weak regression setup. The root reproduced the omission, fixed it and changed
the fixture to create absent refs. The final adversarial review then identified UTF-8 byte conflation in
alternates. The root reproduced it, changed the durable representation to
hexadecimal and added a direct regression. Both final reviewers confirmed the
last delta with no supported finding. These source reviews do not replace
`resume: verify`.

The fresh integrated adversary found two further issues. The malformed supplied
acknowledgement is fixed by common evidence-shape admission and replay checks;
the focused regressions passed and the adversary confirmed no new supported
finding in that delta. The broader object-store issue is recorded below.
The fresh review also prompted correction of the stale order prose. Its
runtime-closure hypothesis was ruled out by importing the verification protocol
from the emitted immutable snapshot in the root's bounded probe.

## Open boundary and planning handoffs

The root reproduced accepted sibling-object loss: removing a pre-existing blob
unique to an independent sibling commit left that blob unreadable while the
source host returned `observed`. The preserved
[counterexample](shared-object-counterexample.mjs) reproduced this in 1.678 s
at 2026-10-06T15:50:12.260Z. Its successful exit confirms the known defect,
not object preservation. Shared refs/alternates checks do not cover existing
object bytes. Product 03 and the grant comment now say so explicitly.

D033 and **FUP-fadd2376e82a909e** board a concrete protection order: compare
private non-shared writer storage with host admission against files-only
writing and host-owned commit; qualify candidate publication, crash recovery,
loose/packed object preservation and concurrent Git maintenance. Raw file hashes
would detect loss afterward and conflict with representation changes during
repacking. The principal assessment used the official Git repack, gc, cat-file,
fsck and clone manuals as new inputs. This architectural change exceeds the
bounded observer repair; existing-object protection remains unclaimed.

**FUP-3d2f14d1de17c607** remains open for the planner to check cited designs and
unaided criteria before filing another evidence-only order (D018).
**FUP-13c8972c4cbacdc2** remains allocated to WO-112 for independent judgment
of the repaired VER-002 defects; the executor does not settle its own verdict.

The check bounds acceptance; it is not universal filesystem confinement.
Descendants escaping the declared process group are outside this evidence.
Shared refs currently require Git's files backend; unexplained shared changes
can conservatively refuse legitimate concurrent work while preserving it.
The inspection is not a repository-wide lock. Windows process termination and
new live source-to-PR scenarios were not qualified by this repair. The original
scratch runs retain their independently verified historical outcomes.

Root actor: Codex CLI 0.160.1, `gpt-6-astra`, selected effort `max`, source
`codex-session-readback`. Entry usage was 52,047 cumulative dispatch-scope
transcript tokens at 2026-10-06T13:43:50.484Z; it includes cached input and is
not context occupancy. Final counters and cost observations remain in the
ignored usage receipt and final response. Combined reviewer/root cost is
unknown. No efficiency comparison is earned: the added reviews found and
closed real gaps but also required further inspection and regression runs.
