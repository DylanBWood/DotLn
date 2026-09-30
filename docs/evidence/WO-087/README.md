# WO-087 implementation evidence

Source base: `c57fd557`. Dispatch: `resume: next`, 2026-09-30 UTC.
The executor is Codex CLI 0.159.0, gpt-6.1-sol, effort ultra (xhigh with
workflows), from current-session readback. One writer and one read-only audit
agent; no descendants.

The roadmap's candidate and capability-policy text is now in the
[planning map](../../planning/work-order-map.md#moved-from-the-roadmap-2026-09-30).
The ladder and generated release history remain byte-identical to the base.
The [decisions](decisions.md) record the move, boundary, register dispositions,
ceiling, economy decline and corrections.

## Content and size

The heading-delimited source interval was lines 299–1162: 864 lines. Its last
line was the prettier-ignore directive for the following release rung, retained
with that rung. Exactly 863 lines of candidate content moved; roadmap lines
fell from 1,613 to 750. Total bytes fell from 127,932 to 71,512; non-exempt
bytes from 96,395 to 39,975. The generated-history exemption stayed 31,537
bytes. The ceiling is now 40,775 bytes, retaining the existing two per cent
headroom rule.

[move-check.json](move-check.json) contains all twelve unchanged heading slugs
and before/after SHA-256 values for each section after reversing precisely the
two necessary product-relative link rebasings. The concatenated moved content
also compares exactly, so the check is complete rather than a sample.
Outside the removed content, the roadmap is byte-identical to its base.
[final-move-check.json](final-move-check.json) repeats the complete preservation
check against the final sources and distinguishes the later planning follow-up
from the relocation's register counts.

Six live inbound navigation destinations were updated, along with the everyday
edition's navigation and beacon pointers that previously linked the roadmap
root. The publication index removes exactly twelve rows; both edition source
locks are refreshed. Filed reports and historical decision strings remain
unchanged.

## Retained register

[register-requests.json](register-requests.json) records the seven required
former-source duplicate requests and seven requests carrying their current
dispositions to the new targets, applied in one revision-bound batch.
[link-only-requests.json](link-only-requests.json) preserves two dispositions
whose source revision changed only through inbound-link repair.

| Former row | Map row | Carried disposition |
| --- | --- | --- |
| FUP-0105 | FUP-a5b7f86d7b4d300d | deferred |
| FUP-0106 | FUP-c572465bfc1ba9c0 | deferred |
| FUP-0107 | FUP-e5fccb54a23a8af7 | deferred |
| FUP-0108 | FUP-f4779d86ca9fd593 | settled |
| FUP-0109 | FUP-5d31b4cd52b01f51 | deferred |
| FUP-0110 | FUP-7fc458de216e842a | settled |
| FUP-1aa2504e33959003 | FUP-1310872e0f04488a | deferred |

Every revision and disposition prefix of all 771 former rows compares exactly
with the base. Total rows become 778, duplicates 33→40; pending rows remain
191 and all other effective status counts remain unchanged. Deferred reopening
conditions remain exact, and the two settled candidates remain settled.

Those counts describe the relocation reconciliation. The separately diagnosed
planning-review blind spot is recorded by D011 as FUP-dc58e92c5cafc732 and deferred
from the adjacent queue to that public identifier. Its one new untriaged row
brings the final total to 779 and pending count to 192; it changes no old row's
disposition. Planning can review the wider prompt/source dependency gap there.

## Planning-check repair

The operator directed fixing the failing checks during execution (D008/D010).
The reviewed vision section includes a footer link to the moved baseline, and
the historical capability source includes a link to the moved policies. The
continuation check previously rejected these address changes. It now proves
the cited sections moved with preserved content and equivalent resolved links,
restores the original citing destinations to compare exact prose, and retains
the existing dated capability validation. Historical planning receipt bytes and
subject hashes stay unchanged.

Three grouped fixtures test dirty and committed moves and refusals for changed
meaning, ambiguous/missing/private targets and unsupported link contexts.
Whole-content comparison establishes preservation; equal byte counts alone
would not. Product documents remain editable. D009 corrects the earlier
unsupported claim that this failure was inherited and the confusing use of
immutability terminology.

## Write-backs and checks

The documentation index points readers to the candidate home. This order was
originally filed on 2026-09-08; the executor skill's pre-2026-09-09 legacy rule
substitutes this decisions file and generated decisions-index row for the
ledger-entry duty. The execution does not add a planning-synthesis ledger entry.

Passed: complete text/history preservation probe, publication coverage
and both current locks, direct links on the ten moved or updated navigation
surfaces, canonical docs check and git diff --check. The canonical docs check
reports zero new failures and 412 declared historical link occurrences; raw
links on the changed navigation surfaces have zero failures. The baseline
remains unchanged. `npm test -- --review` passed 31 suites with zero failures,
and `npm run test:docs` passed 23 with zero failures. Both canonical rows use
the same code identity, recorded in [gate-checks.json](gate-checks.json).
All four criterion judgments are recorded in [handoff.md](handoff.md).

`release prepare --local` assigned patch v0.56.3 above observed local v0.56.2.
No component package changed. This is a local target assignment; publication
and independent verification remain separate dispatches.
