# WO-210 five-worker repair review

The operator requested five subagents to attack, verify and improve the repair
and overall change. Five distinct workers ran in two waves under the host's
three-worker concurrency limit. Root remained the only repository writer.
Each worker was requested as `gpt-6.1-sol` at `max`, with no inherited
conversation; effective provider settings are not independently observed.
The criteria and design workers were reused for the seed expansion, with no
additional spawn. No worker spawned descendants or dispatched a lifecycle role.
The earlier implementation's two workers are recorded separately in handoff.md:
seven explicit spawns across the implementation and this repair, within cap 20.

| Worker | Assignment and outcome |
| --- | --- |
| cleanup_adversary | Audited ignored-material listing, ownership, teardown and metadata. Found ignored clone metadata types, empty target metadata directories, clone writer bypass, absent-target ownership bypass and manifest-read ordering. Root reproduced the behavioral gaps and integrated the guards. |
| lifecycle_adversary | Audited the full lifecycle and publication boundaries. Found clone post-merge hook execution and planning fsmonitor execution. Root and the executable worker reproduced these; host Git flags now apply. |
| criteria_adversary | Audited the order and diff. Found metadata coverage gaps, uncommitted planning authority and missing-manifest publication. The seed follow-up caught a missing publication title and reused forge-directory collision in the new fixture, plus the same CLAUDE suffix defect found by design. Its final read found no remaining actionable criterion 26–28 source issue. |
| design_improver | Audited design and preservation. Found missing-manifest publication, recommended reuse of prepared seed bytes and historical manifest provenance, then caught the CLAUDE suffix overwrite. The implementation compares the entire contract around one strict generated block and refuses custom suffixes. |
| executable_verifier | Ran actual planning and publication commands in isolated synthetic repositories during an exclusive bounded-probe slot. Confirmed fsmonitor execution, admission of an uncommitted operator grant, and publication of a real installed file after live-manifest removal; refusal and happy controls accompanied each probe. |

Deduplicated repair findings: nine original source defects/improvements plus
three seed-expansion findings (whole-contract preservation and two fixture
errors), twelve in total. All twelve have integrated fixes. The final document
gate passed 35 results and the final review gate passed 39 suite results,
both with zero failures at the code identity recorded in handoff.md. Those
executions are the validation authority; this review is not independent
lifecycle verification or final review.

D019 and D021 record the six cleanup reproductions and three publication
reproductions, including commands, durations, effects and retained scratch
logs. The integrated fixtures check negative effects as well as success:
unchanged remote refs, preserved ownership and source bytes, absent hook
sentinels, and the exact records commit. D022 records the seed provenance
choice. The first complete legacy-recovery run passed in 131,102 ms at
2026-10-14T15:48:22.992Z; its scratch log is `repair-legacy-recovery.log`.

The recovery fixture uses exact hashed v0.81.0 seed blobs with the current
runtime, synthetic verification judgments and local forge doubles. It proves
the requested publication surface step and then requires the ordinary
missing-release-notes refusal; it does not claim successful self-order PR
publication or execution of the historical runtime. The user's live fork was
not read or changed.

Two reviewed hypotheses were rejected with source evidence in D021: same-tree
gate reuse and publication of the recorded gate snapshot are deliberate order
contracts. A shared harness refactor was unnecessary and would have changed
registered evidence inputs. The criteria worker's initial recommendation to
leave starter seeds stale was corrected against the operator's expanded scope;
the implemented refresh updates only proven prior-export copies.
