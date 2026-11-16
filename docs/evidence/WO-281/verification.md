# WO-281 independent verification evidence

Recorded for VER-001 on 2026-11-16 UTC. The subject is the working tree over
`5edc7798b9eccaa880467d41a28b6a43f4b54226`, with code identity
`63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796`.
The verifier changed only its report, evidence and generated projections.

## Independent checks

Each command below completed with exit zero under
`node scripts/harness.mjs bounded --`. Tests name individual cases, not
reruns of the full suites. No workers were launched.

| Command after the bounded wrapper | Observed result |
| --- | --- |
| `npm run format:check` | All matched implementation files use Prettier formatting. |
| `node --test --test-name-pattern='WO-281 criterion 4' scripts/test-docs-check.mjs` | One passing advisory case. |
| `node --test --test-name-pattern='WO-281 criterion 3' scripts/test-harness.mjs` | One passing installed-rule case. |
| `node --test --test-name-pattern='WO-281: the budgets loader' scripts/test-dispatch-bound.mjs` | One passing case: an unusable paragraph figure does not refuse dispatch. |
| `node --test --test-name-pattern='WO-281: the documentation map' scripts/test-launchpad-seeds.mjs` | One passing map-link case. |
| `node --test --test-name-pattern='WO-258 criterion 6' scripts/test-launchpad-seeds.mjs` | Two passing export and absent-seed cases. |
| `node --test --test-name-pattern='document gate forwards explicit success diagnostics' scripts/test-docs-check.mjs` | One passing diagnostic-relay case. |
| `node scripts/harness.mjs check` | 37 generated surfaces match. |
| `node scripts/lib/operator-commands.mjs --check` | The generated commands page is current. |
| `node docs/evidence/WO-276/part-f/rule-table.mjs --check` | 33 rules, six roles; recorded rule table current. |
| `node docs/evidence/WO-281/verification-probes.mjs` with the session scratch directory as its sole argument | Five probes pass; see the script and [results](verification-results.json). |

The five probes independently reproduce the inventory and detect a deliberately
removed code span; reproduce five historical maps from 28 source revisions;
check the final reader's guide against its retained checkpoint; exercise a
paragraph formed only by deleting its separator, the strict threshold, quotes,
fences, invalid figures and null opt-out; and prove that an unmodified map from
an older template advances while an owner-edited map stays. They use disposable
repositories and copies in session scratch. The intentional inventory refusal
is the expected negative control, not a subject failure.

A final scratch script ran `node scripts/docs-check.mjs --long-paragraphs`
and compared its output byte-for-byte with
[long-paragraphs-candidate.txt](long-paragraphs-candidate.txt): all 308 lines
matched. It then called `requireGateClaims` for the plain and review product
claims; no advisory or missing row was returned. This ran to completion at
2026-11-16T02:09:54Z.

The guide's 63 paragraphs above 120 words at the base became zero. This is a
measurement of the advisory, not a proof of usefulness. The full guide and the
map were read for whether a person can find and carry out the named tasks.

## Product gate consumed

The executor's complete `npm test -- --review` row is still current:

- Code identity: `63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796`.
- Recorded at: `2026-11-16T01:06:46.448Z`; executed, exit zero.
- Evidence: `host-gate:63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796:npm test`.
- Complete review selection: 45 passed, zero failed, 122 fresh tasks,
  0 h 56 min. It includes the plain selection and the declared Preflight.

`requireGateClaims` accepted this row against the current review selection.
Reusing it avoids an equivalent complete run while the focused probes supply
independent adversarial evidence. A fresh document gate over VER-001 and the
new records is required before recording VerificationCompleted; its result is
appended below after execution, within this order's own evidence directory.

## Review and limits

Both rounds' criteria, design, consistency and combined reports were read,
along with both rounds' usability and filler reports. The first round's stale
rule-table output, missing criterion-3 case and invalid-figure refusal are
fixed in the subject; the checks above confirm them. The later guide changes
were read in their final context, including the setup commit, named-release
continuation, target-record default caveat and starter-update eligibility.

The inventory accounts for all base headings, command lines and link targets.
Its three absent code spans have individual reasons in D022. It is a lexical
inventory; source reading and the executable cases establish the relevant
facts beyond literal presence.

The first reader saw both texts, and its intermediate candidate survives as a
hash rather than retained bytes. The second reader read the final guide alone:
SHA-256 `2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7`,
blob `5e61a637f6f3b776711959d2d0326e17c12ff37c`, retained in
`refs/dotln/checkpoint/WO-281/3`. The independent probe confirms those exact
bytes. Its remaining usability observations are preserved in D026; this is
not a blinded timing study or evidence that every passage is easy for every
reader.

The guide inventory and historical-map scripts replace their output records
when rerun. VER-001 records this as a low-priority follow-up in D027 and ran
them only in scratch. Existing map-regression coverage and guide usability
follow-ups stay in D020, D021 and D026. No criterion or reproduced existing
behavior makes these blocking.

The advisory implementation under review also runs inside the document gate
that records this verification. Direct fixture assertions, the separately
executed paragraph parser and the independent comparisons supplement that
self-observation. The lifecycle and evidence-row readers were inspected and
have no implementation diff in this order.

Goal-alignment outcome: preserve implementation and current complete evidence
when no supported attack fails; judge readability by tasks and source reading,
not word totals alone. That outcome matches D027's NoOp. Output truncation,
an unretained early command handle and an empty stdin probe were corrected as
D028 records; none supplies a passing claim.

## Final document gate

`npm run test:docs` passed: 29 tasks, zero failures, 29 fresh tasks,
0 h 3 min. The host process returned exit zero. The row was recorded at
`2026-11-16T02:15:56.273Z`; its tree hash is
`eb39b790ca10166de51ecdc1382e9b6b405e4eb4`. Both `requireDocumentRow` and
`requireGateClaims` accepted the current tree without advisories when
given the phase start, as the lifecycle completion does. The row also binds
the tree excluding this order's own evidence directory, so this result can
be appended without discarding the document check. Machine-readable
identities are in [verification-gates.json](verification-gates.json).

Immediately before the gate, `node scripts/terms.mjs branch` screened
92 changed files: zero refuse lines and zero context lines. Zero listed
lines needed contextual reading. The private list was not printed or copied.
The gate relayed the long-paragraph advisory and reported no changed standing
paragraph above its figure.

An initial direct accounting read omitted `handoffStart`, counted the
executor's required document run alongside this phase's required run and
therefore failed the verifier's no-advisories assertion. The reader's source
and `handoffStartedAt` establish the correct boundary: this verification's
request at `2026-11-16T01:59:05.784Z`. Repeating the read with that
recorded boundary accepted both rows with no advisory; no gate was repeated
and no product bytes changed. This is a corrected probe-call omission, not
a subject failure.

The final report, new probe, result records and D027/D028 were read; the
decisions index and follow-up feed contain the new decisions. The complete
product row remains current. VerificationCompleted consumes these rows and
runs no further gate.
