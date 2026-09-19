# WO-084 decisions

## WO-084-D001 — Preserve history while enforcing the ledger's insertion rule

```json
{
  "id": "WO-084-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Move whole sections into stable descending date order, preserve Resolutions verbatim on its own surface, normalize six entry leads, and generate a checked section/status index in the document suite only.",
  "evidence": [
    "docs/work-orders/WO-084-ledger-order-and-index.md",
    "docs/work-orders/WO-035-documentation-structure-reset.md",
    "docs/product/01-principles.md",
    "docs/product/07-execution-guide.md#goal-aligned-decisions",
    "docs/lineage/idea-ledger.md",
    "scripts/lib/plan-subject.mjs#planningPasses"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves 31 sections below the old Resolutions boundary, defeating the declared newest-first reading order." },
    { "option": "Per-session ledger files", "reason": "Changes the founding address and consumers beyond this order's bounded scope." },
    { "option": "Rewrite statuses into the original five labels", "reason": "Would discard later recorded distinctions such as rejected, candidate and specified." },
    { "option": "Add the check to npm test", "reason": "Document checks belong to test:docs under the stand-down; the selected order explicitly preserves that boundary." }
  ],
  "reopenWhen": "A new ledger entry format or lifecycle distinction cannot be expressed by the declared tags, or the index no longer makes the needed historical section discoverable."
}
```

The selected order improves operator flow by removing a recurring insertion
choice and making misplaced sections observable. It is documentation upkeep
beside the critical path, not a claim to advance the runtime itself. The
baseline has 142 sections including Resolutions, with 31 sessions after that
boundary; the result has 141 ledger sections and a separate unchanged
Resolutions section. NoOp preserves that demonstrated reading defect.

Keep the ten lifecycle labels already used, and declare the five previously
missing labels in the header. Provenance remains separate. Six legacy leads
need tags: two Adopted and one Preserved are literal normalization; Recovered
adds adopted because WO-022's implementation and evidence establish the
metadata finding as the implemented host boundary; Implementation choice adds
adopted for the recorded reuse of existing mechanisms; the operator-directed
reversal adds adopted because the entry is the operative replacement decision,
not the superseded NoOp. All six changes preserve the entry prose. Additional
source: WO-022's order and `docs/evidence/WO-022/README.md`; the operator-reversal
entry itself. `migration.json` enumerates exact replacements.

The Images section's 38 bullets are source references, explicitly outside idea
entry counts. The prose-only WO-137 section is listed under sections lacking a
tag, not silently promoted to an idea entry. Multiple lifecycle tags remain
membership counts. Dates are read from unchanged headings; equal dates retain
existing relative order. The founding Images/Chat corpus remains at the end.
`planningPasses` hashes exact heading bytes, so heading and ID-set preservation
are separate migration checks. Live Resolutions pointers move in product 07,
the planning map, WO-109 and the docs map; historical measurements in WO-035
and the phase-two planning report remain historical.

Policy resistance/fixes that fail: document-only wiring avoids undoing the
stand-down. Commons: one read-only agent, no descendants, within cap 20;
test duration and final usage are observed rather than estimated. Drift:
fixtures reject out-of-order dates, unlabeled entries and unknown tags.
Escalation: one generator and document check, no hook or new approval step.
Success to the successful: reuse the stable ledger address because consumers
already cite its history; per-session files do not solve this bounded need.
Shifting the burden: stale index and invalid insertion become executable
diagnostics. Rule beating: tags must occur in entry leads; incidental code in
bodies cannot satisfy the check, and preservation is checked independently.
Seeking the wrong goal: readable, intact history is the outcome; counts are
navigation aids, not evidence of product progress.

Naive Interventionism: the existing ledger preserves chronology, provenance and
planning receipt identities. Whole-section moves and local regeneration are
reversible; fixture checks precede the full gates. No dependency, package source
or publication authority changes. The CLI and generated Markdown expose their
inputs and can be consumed without this session. Reopen on a new format or a
demonstrated navigation failure.

The structured decision and generated decisions-index row discharge this
pre-2026-09-09 order's ledger-entry duty under the executor's explicit legacy
substitution. The header migration note links this record; no new historical
entry is invented. Release classification remains patch, with component
versions unchanged because no component source changes.

The activation left a version placeholder, which `release prepare --local`
correctly refused. Complete the already classified patch assignment as
`v0.31.2` above the observed local `v0.31.1` tag, matching the README and roadmap.
The preparation helper then checks that target. This is activation bookkeeping,
not a work-order scope amendment. Product 07's pointer edit requires refreshing
the software-engineer edition lock; the publication check establishes it again.
