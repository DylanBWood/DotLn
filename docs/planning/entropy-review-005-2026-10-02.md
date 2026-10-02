# Entropy Reducer planning pass — REVIEW-005 (2026-10-02)

## 1. Subject, authority and provenance

The operator opened `planning: entropy reducer` on 2026-10-02 UTC
(2026-10-01 locally), then directed the same work to continue. The ignored
compaction-safety capture has SHA-256
`c2f9652c43ed19b08849534392ac0a5c56151eaa5334c2403eba22ae0b11d637`.
This document is planner synthesis of public repository evidence. No raw
source wording is filed as a draft; the clean-room screen found no suspect
material in the sources used.

Entry was clean `main` at `b0e11b0d`, with WO-062 closed and no active
execution obligation. `entropy subject` found no filed review both refuted
and undisposed, so this pass dispatched the pinned reviewer against that
commit. Only the parent writes this planning checkout. The pass prepares
documents and local commits; implementation and publication retain their
separate dispatches.

## 2. Entry observations and existing failures

`plan start` and `plan failures` reported 18 orders made ready and passed
final review since the previous planning receipt, four failed
verifications, three failed final reviews, seven repairs, 52 corrections
and two amendments. Its eight recent-close tracks are all unknown, so
that output supports no claim about the delivery/machinery balance. The
local records contain 16 release-close rows, all dry runs, two denials,
six interventions (one unclassified; host coverage incomplete), four long
phases and 17 repeated gate rows. Gate rows are not distinct executions.

The seven reported failures already have passing resolution evidence:

| Failure | Cause and checked resolution |
| --- | --- |
| WO-174 VER-001 | A tracked regenerator still imported a removed console fixture export, and an integration fixture consumed committed bytes. VER-002 passes the repaired consumer and a committed-copy integration run; D013/D014 preserve the separate limitations. |
| WO-059 VER-001 | The missing-browser remedy installed into the wrong cache. VER-002 follows the corrected command in a fresh copy. |
| WO-059 FINAL-001 | An empty recorded process list allowed an unrelated PID to be adopted and killed. FINAL-002 shows refusal of that shape, unchanged bytes and a live bystander. |
| WO-176 FINAL-001 | A frozen disposable-lane record ignored later contents and lacked the recovery-bundle duty. FINAL-002 passes after repair and the operator's D035 amendment, with scratch commits bundled before removal. These are amended criteria. |
| WO-178 FINAL-001 | The provenance reader missed operator words inside header paragraphs. VER-002 and FINAL-002 cover the repaired reader and injection across 168 fields. |
| WO-179 VER-001 | The compact release-close projection omitted eight shared rules. VER-002 checks every emitted role root and the negative control. |
| WO-062 VER-001 | GitHub edit history was mistaken for current summaries, and omitted comments lacked individual receipts. VER-002 confirms current-only sections/discussion, text-free history and a receipt for each omitted comment. |

These resolutions do not allocate new repair work. Separate boarded
limitations keep their own routes.

## 3. Reopening observations

`plan conditions` measured the following at entry. Slow measurements came
from three passing document-gate rows; the reviewer was running at the
same time. These are concurrent-work observations, not a causal speed
comparison; host load is not inferred from the overlap.

| Measure | Observation | Recorded threshold |
| --- | --- | --- |
| Plan check, median | 2.505 s | 8 s |
| Release table lag | 18 tags | 3 tags |
| Latest two closed orders, distinct evidence blob bytes | 45,789 and 97,211 | 1 MB in two consecutive orders |
| Evidence path growth since the start of the week | 12,523,596 bytes | 10 MB |
| collectSources | 0.792 s | 3 s |
| Uncached release listing | 2.633 s | 10 s |
| status --all --json | 4,284,934 bytes | 32 MB |
| Work-order index | 1.397 s | 10 s |
| Document gate, median of 39.410, 40.408, 39.984 s | 39.984 s | 30 s |
| docs-check task, median of 11.929, 11.794, 11.883 s | 11.883 s | 15 s |

The executor cold-start projection is 28,290 bytes, above WO-150-D003's
historic 24,576-byte predicate but below the currently configured 29,246
ceiling. The predicate holding is not a current budget breach, and the
operator-reserved ceiling route remains in force.

The document gate's critical path is build, docs-check, lineage fixtures,
then console-docs. Console-docs took 26.237, 27.359 and 26.854 s;
skeleton-docs ran concurrently at 22.096, 22.701 and 22.708 s. One focused
console-docs run passed 27 tests in 24.478 s. Four command-parity cases
took 11.603, 6.234, 3.481 and 3.013 s; current board collection took
0.780 s. WO-174 D012 already reopened ER4-005 when tagged tests moved
work to the document gate. These measurements support reassessing the
gate; they do not establish that the earlier history-parse cache would
remove its current dominant cost.

The weekly path-growth condition also held. Against the last commit
before 2026-09-28 UTC (`6f949464`), current evidence is 165,556,039 bytes,
positive path growth is 12,523,596 bytes and distinct new blob content is
9,157,936 bytes. These are uncompressed content measures, not Git pack
growth. The largest order additions are WO-172 (1.808 MB), WO-180
(1.380 MB), WO-124 (1.012 MB), WO-066 (0.953 MB), WO-181 (0.927 MB),
WO-178 (0.883 MB) and WO-059 (0.818 MB). Authority transcript copies total
157 paths and 33 distinct blobs; their repeated bytes are 6,005,160,
3.627% of evidence, below ER4-006's 10% trigger. Existing immutable
evidence is retained.

## 4. Review and blinded refutation

[REVIEW-005](../instance/entropy-reducer/runs/REVIEW-005.md) filed two
measured minor findings and two packets. Both findings survived
[REFUTATION-006](../instance/entropy-reducer/runs/REFUTATION-006.md),
which received reproduction commands without the reviewer's narrative or
proposals. Neither worker recorded a permission denial. The review's
source status was unchanged. The refutation's source status changed
because the parent was drafting this pass; its subject was the review's
named commit, independently frozen, and its copy's inventory was
unchanged. No working-tree change is attributed to the refuter.

| Item | Evidence accepted | Decision in this pass |
| --- | --- | --- |
| ER5-001, timeout headroom | REVIEW-004 used 2,215.824 s of a 2,400 s deadline (92.3%); the deadline kills the process and no conditions row reports headroom. | Accept the finding; decline a new order and leave the limits unchanged under the NoOp below. REVIEW-005 adds 1,403.434 s (58.5%) and REFUTATION-006 115.801 s of 1,800 s (6.4%). |
| ER5-002, fired follow-up triggers | FUP-0086 still named WO-117 landing, FUP-0113 WO-062 activation, and FUP-ec75a4295bf36696 the next live harness smoke, after those events occurred. | Accept the finding; re-dispose all three rows from their current sources. Decline an order for the proposed anchored prose parser. |
| Packet `entropy-episode-timeout-headroom-listed` | Retained in REVIEW-005 | Deferred, not filed; next entropy pass reviews headroom, with an explicit reversal condition below. |
| Packet `order-lifecycle-reopen-triggers-listed` | Retained in REVIEW-005 | Deferred, not filed; reconsider if a subsequent pass again misses a named fired trigger. |

The old statement that all deferred retirement matches had unoccurred
conditions was incorrect for FUP-0086 (REVIEW-004 planning record §6).
WO-117 had closed. This pass records the correction and new disposition;
the historical review and receipt retain their bytes. Reading a row or
recording a replacement boundary in an order's decisions did not update
its register disposition, as WO-062 D002 demonstrates.

The review's census of 152 deferred rows counts last disposition values;
the entry feed's 151 is its current-status count, which can instead put a
changed source in needs-review. Neither number means every condition was
evaluated. The four bare activation/landing conditions were a bounded
syntactic sample, not the whole register.

## 5. Planning decisions and NoOp records

**No new work order is filed and no queued order is amended.** Both
findings are true; the selected response is to correct the three records,
preserve the timeout evidence and reconsider the mechanisms when their
stated evidence changes. This is a completed planning choice, not a
request that another pass decide REVIEW-005.

### 5.1 The three stale triggers

- **FUP-0086, authorship assistance:** WO-117's host exists and the old
  landing trigger occurred. Its amended scope explicitly excluded equip
  preview and build authoring; FINAL-001 proves status, audit and command
  parity. Product 04's candidate names the pattern workshop as its first
  delivery point. Defer the assistance, with the product paragraph and
  register now naming a proposed pattern-workshop/equip/build authoring
  order or a witnessed missing proposal axis. A live inspection host alone
  does not establish that this four-axis authoring interface is the next
  critical-path step.
- **FUP-0113, model-input exposure plans:** WO-062 D002 explicitly observes
  activation and keeps ModelInputPlan outside a deterministic adapter
  that invokes no model. Adopt that existing decision in the register and
  product 09. Reopen at the first consuming model invocation, including
  WO-123's composition review, or a proposed private-material reader.
  The WO-123 catalog carries this preflight reading; it adds no primitive
  or exposure guarantee to the order.
- **FUP-ec75a4295bf36696, harness re-probe:** WO-149's real session proves
  dispatch/usage behavior; WO-159's live worker proves the isolated user
  configuration boundary. These satisfy the old smoke trigger but do not
  re-qualify every hook/profile capability. Keep the dated observations
  and explicit residue, and defer a broad re-probe to a capability/role-text
  mismatch, a changed integration contract or operator direction. The
  next entropy pass reviews this choice. No fresh qualification is claimed.

### 5.2 Declined mechanisms and alternatives

These are prose records in the `NoOpIntent` shape: `kind: NoOp`, a
`reason`, cited `evidence`, `reevaluation` cadence and `usefulWhen`
condition. Each reason includes what happens if the mechanism is left
unchanged. The records are planning decisions, not executable predicates.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| Timeout listing, larger limits or a gate-avoidance instruction | No automatic headroom warning is added. The successful five-review series contains one 92.3% outlier; this run is 58.5%. That is not proof a future timeout cannot occur. The current receipts already expose duration, while raising the limit widens spend and changing the review instructions affects evidence editions. A new order's implementation, independent checks and release have no measured avoided loss yet. No restriction on useful review probes is added. Evidence: REVIEW-005, REFUTATION-006, the protocol constants and transport deadline read in this pass. | Every entropy pass compares completed durations of each kind with its limit. | An observed deadline loss, or two successive review episodes or two successive refutation episodes above 80% of their respective limit. A recorded transport loss is considered even without a filed success receipt. |
| Anchored prose parser or mandatory typed lifecycle predicates | Conditions outside the table remain unevaluated and are labeled so. Fixing the three observed records removes the current stale-trigger examples. The proposed parser covers four rows, cannot cover the live-smoke case, and can miss wording variants; a typed schema plus migration has a larger surface. This pass claims neither mechanism unnecessary forever nor the rest of the register correct. Evidence: both workers' four-row reproduction, `planning-conditions.mjs`, the three source readings in §5.1. | The next planning pass and closes that carry a named trigger. | A subsequent pass again leaves a named fired lifecycle trigger unchanged; compare an explicit typed condition with the anchored parser using that example. |
| Four-axis authorship implementation now | The candidate remains specified and unavailable. WO-117 supplies inspection/commands, while its amended scope left build/equip authoring out; the source-to-deliverable composition is the current missing outcome. Evidence: WO-117 scope and FINAL-001; product 04 candidate. | At the next authoring order proposal or witnessed authoring task. | A pattern-workshop/equip/build authoring order is proposed, or the task identifies a missing proposal axis. |
| ModelInputPlan in the source adapter | No preview/enforcement claim is added to the deterministic read/store port. Implementing a model-boundary contract there would not witness a model invocation. Evidence: WO-062 D002 and its explicit non-goal; product 09 candidate. | WO-123's composition preflight, then any proposed model/private-material boundary. | The first consuming model invocation or a proposed private-material reader. |
| Broad harness profile requalification now | The existing dated profile observations and limits remain visible. The two live receipts are narrower than the proposed whole-profile judgment; neither supplies an observed mismatch to repair. A comprehensive re-probe spends live episodes away from the vertical without a demonstrated behavior change. Evidence: WO-149 live dispatch and WO-159 live-codex receipt; current manifest. | Next entropy pass and any integration contract change. | Observed capability/role-text mismatch on a newer CLI, a changed harness integration contract, or operator-directed requalification. |
| History-parse cache as the document-gate repair | The 30 s gate trigger occurred and remains acknowledged. The current critical path is dominated by console document cases, not only history parsing. Adding a cache to a correctness check would not by itself remove those cases. Decline the specific cache packet; retain FUP-fb8cbeabbddef397 open for a measured broader latency design. Evidence: §3's three passing gates, focused 27-test run, WO-174 D012 and WO-178's 1.14–1.21 s provenance-scan observation on that row. | Next standard planning pass and next edit of the document selection/parity tests or docs-check. | A bounded prototype shows lower end-to-end gate cost at the same coverage, or docs-check exceeds 15 s or plan check exceeds 8 s. The existing open row is not relabeled resolved. |
| Evidence ceiling, pruning or transcript-reference migration | Immutable reports keep their referenced bytes. The weekly trigger occurred: 12.524 MB positive path growth, 9.158 MB distinct new content, and no two latest orders above 1 MB. A hard ceiling can trade useful evidence for a proxy; pruning needs separate authority and a reference migration has only 3.627% repeated authority bytes to address now. The Codex session-identity join on FUP-8a4e201d861208ad remains unexamined. Evidence: §3 and the retained row history. | Every planning-entry weekly measurement; the authority writer's next edit. | Another week exceeds 10 MB, two consecutive orders exceed 1 MB distinct evidence blobs, a measured reading/storage problem occurs, or the authority-reference row's existing writer-edit/10% trigger occurs. This week's breach is consumed by this reassessment, not denied. |
| A release-lifecycle step for the roadmap table | The table was stale at two consecutive entropy entries, so the prior revisit trigger occurred. This pass regenerates it with the existing command (138 local annotated tags). A new lifecycle mutation has no observed consumer error to remove; the public table identifies its snapshot. Evidence: entry lag 18 and the successful `release list --markdown --write` result. | Each planning entry, using the existing lag listing and refresh. | A reader acts on a stale table, or the one-command refresh fails to restore it. This explicitly replaces the now-consumed two-entry trigger for adding lifecycle machinery. |

The earlier authority-reference packet keeps its existing reopening
condition; no immutable evidence is rewritten. Unrelated open register
items remain the next standard pass's subject. No research worker was
needed: the two entropy workers and the scoped source reads answered the
questions used for these choices.

## 6. Sequence, map and retained follow-ups

Fourteen closed entries leave the sequence: WO-058, WO-174, WO-059,
WO-175, WO-180, WO-176, WO-181, WO-178, WO-182, WO-177, WO-061,
WO-179, WO-124 and WO-062. WO-123 remains the next delivery order.
The dated REVIEW-004 note leaves with its last placed order. The standard
2026-09-30 note retains WO-183's placement after WO-118.

The entry register has 852 entries, 223 pending: 13 open, two
needs-review, 57 untriaged and 151 deferred. The complete retirement
touching query matched 50 pending rows. This pass's subject is the
Entropy Reducer review. A row merely matching a retired identifier keeps
its status and reopening condition unless the review or retirement
actually settles it; this is not a second standard queue drain.

The two accepted findings receive explicit register dispositions: ER5-001
deferred under the headroom NoOp, and ER5-002 deferred as an automation
proposal after its three observed records are corrected. FUP-0086,
FUP-0113 and FUP-ec75a4295bf36696 get the new source-bound dispositions
above; both weekly-evidence rows acknowledge this week's occurred
trigger. FUP-fb8cbeabbddef397 remains open with the narrower cache
decline and current measurements. No accepted finding or packet is left
without a decision.

The map records these routes and the WO-123 preflight. No new order means
no new catalog or track assignment and no lane pair to insert. The
remaining 26 entries retain their order and typed dependencies. The
generated index records the closed orders and the current release.

## 7. Goal alignment and cost

The mission contribution is reliable operator flow along WO-123,
WO-112 and WO-118: the source-to-deliverable loop. NoOp at entry would
leave the requested fresh assessment undone after 18 additional final
reviews. Consume-before-produce ruled out paying twice for an
undisposed review. The prior review and refutation cost 2,916 s and
USD 13.79; these were comparison evidence, not a prediction.

The fan-out plan is one reviewer, one blinded entropy refuter and one
batch planning refuter against the cap of 20, with no descendant work
planned. No per-finding workers, new gate or implementation is added in
this pass. Policy resistance and rule beating are addressed by preserving
the lifecycle and subject bindings and judging behavior. Commons and
escalation are addressed by the bounded fan-out and by comparing an
order's full phase cost with the recurring work it removes. Drift and
seeking the wrong goal require an operator outcome beyond lower byte or
receipt counts. Success to the successful requires comparison with
existing orders and NoOp. Shifting the burden requires dispositions in
this pass. Naive Interventionism preserves authority, recovery and
immutable evidence; document decisions are reversible, and any
implementation needs its own execution dispatch.

Candidate comparisons are in §5. Not filing a machinery order keeps the
next delivery step at WO-123; no threshold is a mandate to create a
mechanism. The chosen changes remove stale decisions and sequence
entries, with no added runtime branch, schema, gate, command or live
episode requirement. The tradeoff is continued human judgment over
qualitative triggers and no automatic timeout warning. The recurrence
conditions make that choice reversible rather than a completeness claim.

The two entropy episodes cost 1,519.235 s in total (25 min 19 s) and
USD 9.3190456, from their result envelopes; their filed receipts label
token counts unknown. Their two findings produce three corrected
follow-up dispositions and two declined mechanisms. The reviewer's
23-minute duration is less than REVIEW-004's 37 minutes, but different
probes and host load prevent a causal saving claim.

New inputs beyond the entry set: REVIEW-005 and REFUTATION-006 in full;
the three trigger rows and their product/map sources; WO-117's amended
scope and FINAL-001; WO-062 D002; WO-149 and WO-159's live receipts; the
protocol limits, worker deadline and conditions table; product 04's
authorship and product 09's exposure-plan candidate. The base sources,
seven failure pairs, retirement feed and document timing sources were
read as scoped inputs. All measurements and commands use personal/public
repository material. Local episode copies and the completion observer
were cleaned by their existing completion paths.

## 8. Validation and independent judgment

The product write-backs passed `npm run publication:check` after both
edition source locks were refreshed. `node scripts/docs-check.mjs`
passed with 15 product documents and zero failures; `entropy check`
passed with no interrupted filings. The prior document timing runs all
passed; they are measurement evidence, not a claim that the final edited
subject passed. The final document gate and independent planning receipt
are recorded here after the committed subject is judged.
