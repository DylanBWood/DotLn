# Plan-refutation receipts

`npm run plan -- refute --transport <name>` asks a fresh external refuter whether the marked planning
horizon serves the vision. It defaults to the Entropy Reducer identity,
Contra-Auguste mask, architecture-and-semantics lens, and Claude Code's existing
print transport with `claude-fable-5-1` at `max`. `--transport codex-cli-exec`
uses `gpt-6-astra` and defaults to effort `unknown` (no override).
On observed Codex CLI `0.154.0`, `--effort low|medium|high|xhigh|max`
forwards an explicit `model_reasoning_effort` configuration override; for
example, `npm run plan -- refute --transport codex-cli-exec --model gpt-6-astra --effort max`.
The [five discovery rows](../../discovery/codex-effort-2026-09-11.json)
record accepted launches, with user configuration ignored. CLI `0.153.4`
retains its `unknown`-only observation. Both transports record launch selections and harness version;
effective provider model and effort readback remain unknown. `fake` is for
fixtures and cannot satisfy a planning gate.

The CLI episode has a twenty-minute deadline; Claude print retains a $5 budget cap.
A transport failure reports its actual CLI exit code and stderr. An
interrupted or invalid result produces no judgment receipt and cannot pass
the gate. A transport retry is disclosed in the executor evidence.

Run `npm run plan -- subject` to inspect the committed-only input. Commit the
draft subject before refuting it. The host reads Git blobs for `docs/planning/sequence.md` and every listed
order. Historical receipts retain the map path that existed at their revision. It hashes those exact bytes plus the five
vision thesis subtrees, exclusions, role table, and capability identifier/scope
and level cells. Dated capability assessments remain in source order. The
refuter receives only the thesis and exclusion passages, roles, capability ids
and levels, and each order's title, objective, Cost header, numbered acceptance criteria
and non-goals. A bounded subject-hashed cost table carries dated acceptances,
latest meter rows and trap signals. It refuses stale evidence; missing cost or
added process without a removal or dated acceptance is a structural hold. The map's labels, planner narrative, ledger, assumptions, rationale
and earlier verdicts are excluded. The hash includes complete order bytes even
though their narrative is not sent.

For CLI reviews, the host compiles `plan-refuter.v1` with `repo.read*` and `report.emit`, no other
grants, explicit write/remote/settings/decision denials, and a one-shot cadence.
An empty temporary working directory and the existing transports' disabled
model tools prevent repository traversal. Authentication remains the CLI
broker's responsibility. A request does not grant the model access to local
credentials, private intake or the planner's session.

`planning: refute` loads the dedicated refuter skill in either harness and
makes the receiving session the refuter. `planning: refute full` selects the
whole horizon; the default pass scope judges orders created or changed by the
latest dated pass plus the sequence, carrying each other order's latest verdict
by hash. The refuter directs no prerequisite read beyond its canonical prompt.

Run `npm run plan -- refute --direct` (add `--scope full` for full scope).
The helper checks committed/workspace equality and prints the same canonical
prompt a transport receives. Save the closed result and a public statement of
what was actually read, then run
`npm run plan -- receipt <result.json> --statement <statement.txt>` with any
required `--dispositions <file>`. It validates, screens, files and commits only
the immutable pair with a plain subject, then runs the plan check. It refuses
unrelated staged changes. The pass budget is 120 seconds from first dispatch
to filing; restarting the same pending subject does not reset the clock.
The receipt records scope, elapsed time and each carried source hash.

The following historical direct-session episode remains valid. New helper
receipts also carry a checked `review` object for scope, judged IDs, carried
verdicts and dispatch timing. Neither form claims host-enforced context
isolation or effective model/effort readback:

```json
{
  "kind": "direct-session",
  "harness": "codex",
  "harnessVersion": "unknown",
  "model": "unknown",
  "effort": "unknown",
  "settingsVerification": "unverified",
  "profileId": "plan-refutation-v1",
  "completedAt": "2030-01-02T12:00:00.000Z",
  "resultHash": "sha256:<frozen-result-digest>",
  "judgmentBasis": "canonical-subject-and-protocol",
  "independence": "session-attested",
  "contextIsolation": "not-enforced",
  "modelTools": "available",
  "statement": "Public session attestation describing the actual review and freeze."
}
```

`resultHash` is SHA-256 of `JSON.stringify(validatedResult, null, 2) + "\n"`.
`completedAt` records when that judgment was frozen, not a dispatch time.
`profileId` names the judgment rules; it does not attest execution of a compiled
loadout. Direct-session provenance contains no transport, acceptance receipt,
launch selections or compiled semantic hash. Independence and freeze timing
are session attestations, not host-verified isolation or chronology. Model
settings remain unverified; the fixed unknown fields cannot claim readback.

This extends the episode alternatives within the unchanged receipt envelope
and result schemas. Existing CLI receipt rendering stays byte-identical. A
direct-session planning write checks both the current committed subject hash
and workspace hash; the usual committed-snapshot validation, local-terms screen,
append lock, immutable pair, hold addresses, disposition chain and three-hold
stop all apply. The planning gate admits this review source and still refuses
fake reviews, stale subjects and unanswered holds. Recording a session judgment
neither overrides a hold nor certifies receipt-tooling changes made by that
session.

The result is the closed `plan-refutation-v1` object: `orders`, `largestGap`,
`planVerdict`, and `holdReasons`. Every order appears exactly once, with
`workOrderId`, `verdict`, `thesis`, `capabilityRow`, `rolesServed`, and `reason`.
Theses use the vision's heading anchors. Exclusions use
`what-dotln-is-not:1` through the current exclusion count. Roles use the five
literal UIFA role names. An advancing order names an existing capability id or
`new:<capability.id>`. Machinery names neither a thesis nor a capability row
(`null` for both). Drift cites a thesis or exclusion and uses a null row.

`largestGap` contains a thesis anchor, reason, work-order id, and criterion id.
Each `holdReasons` entry names `workOrderId`, `criterionId` (`criterion:1`,
etc.) and a reason. The host constructs a hold when any order drifts, no order
advances a thesis, or the gap's thesis is untouched without a later-order
deferral. For an omitted model hold, the affected order's first criterion is
the deterministic repair target; a model-provided hold can name a more specific
criterion. A non-goal can explicitly defer a thesis using:

```markdown
<!-- dotln-plan-defer: the-differentiated-interface -> WO-999 -->
```

The named later order must be a committed work order strictly after the
deferring order in the same marked sequence. Earlier orders, the order itself,
and every order outside that sequence are refused, including closed orders
from past horizons. Ordinary prose remains visible to the refuter; this marker
makes the structural exception checkable without another model judgment.

Each attempt creates `<date>-<slug>-NNN.json` and `.md` with a shared immutable
receipt hash, committed subject revision/hash, global append ordinal and prior
receipt hash, review provenance, validated result, stable hold addresses, and
dated accepted dispositions. The JSON is canonical evidence; Markdown must
equal its deterministic rendering. Existing files cannot be overwritten or
deleted to reset history. `--slug <public-label>` selects the readable address.
The writer serializes publication with a checkout-local lock; an interrupted
write fails loudly, and a stale lock or incomplete pair requires inspection.

Answer a hold by changing its named criterion, committing the subject, and
passing `--dispositions <contained-json-file>` to a fresh refutation. That file
is an array such as:

```json
[
  {
    "receiptId": "2030-01-02-example-001",
    "holdId": "hold-0123456789abcdef01234567",
    "kind": "accepted",
    "date": "2030-01-02",
    "workOrderId": "WO-999",
    "criterionId": "criterion:1",
    "change": "Require the missing behavior in the named criterion."
  }
]
```

Keep input disposition files outside this receipt directory. Every prior hold
must appear either in a dated accepted disposition naming a changed criterion
or as the exact same hold in the new result. At least one held criterion must
change relative to each earlier held subject; whitespace-only changes and
edits elsewhere cannot re-roll a verdict. These are text-boundary checks, not
proof that a textual edit fixes the product judgment. A third consecutive hold
over the same ordered ids stops that pass, even if labels change. A subsequent
pass may change the criteria and carry the earlier dispositions; it does not
erase the earlier findings.

An operator may explicitly authorize an override:

```sh
npm run plan -- override <receipt-id> <hold-id> '<reason>' \
  --capture docs/intake/notes/<operator-instruction>.md \
  --capture-hash sha256:<capture-digest> \
  --harness <harness> --harness-version <version> --model <model> \
  --effort <effort> --source <source> --account-label <opaque-label>
```

The capture must be ignored, untracked and contained in local intake. The
command checks its bytes against the supplied SHA-256 without copying its
text. It appends `PlanHoldOverridden` to
`docs/control/plan-refutations.jsonl`, using the shared lifecycle actor parser
and the acting session's account label. The gate reads only that attributed,
timestamped log. Receipt prose never supplies authority. The committed tree
cannot authenticate the person behind a captured instruction; attribution
exposes a planner that writes its own override, it does not prove human consent.

Before writing, the host runs the shared local-terms screen over result,
metadata and rendered receipt. The optional operator list is
`docs/control/local/terms.txt`, one term per line, with `#` comments. Neither
the list nor hashes of its terms enter public evidence. Matching normalizes
Unicode and case and compares complete token spans with separators removed,
including phrases of any listed length and spans across line breaks. It keeps
token boundaries and checks each surface separately. A match reports only
surface, starting line and count. Missing lists are explicitly `unavailable`,
never a silent clean-room pass. Fixtures register only synthetic terms. This
realizes the small shared screen needed by WO-041 ahead of its WO-039 consumers.

`npm run plan -- check` validates the receipt chain and enforces dated
planning headings forward from the first-parent introduction commit;
`npm run test:full` includes that check for code changes, and a planning pass
runs `npm run test:docs` without building or running code suites.
Pre-existing headings and the six manual 2026-09-06 redirect receipts retain
their original standard. Every new pass needs a receipt; the current horizon
must match the current committed/workspace subject. Prior receipts retain their
committed snapshots, with holds carried forward through the chain.

The [first manual receipt](2026-09-06-phase-two-redirect.md) records the original
redirect; [receipt 006](2026-09-06-phase-two-redirect-006.md) is that historical
pass's standing verdict. The new gate does not reinterpret their result format
or retroactively impose its three-hold stop.

`--evidence-only` records an instrument run against a committed snapshot without
claiming to reopen or certify a planning pass. WO-041's live receipt uses this
mode against the activation-base sequence. Its verdict on WO-041 is advisory;
the test suite and independent verifier supply evidence about the instrument.
The executor stages the receipt with its code; the final reviewer commits it
under the work-order workflow. The historical manual receipts are not changed.
