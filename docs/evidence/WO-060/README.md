# WO-060 evidence — SourceBundle v1

Executor: Claude Code, model `claude-opus-5-5`, effort `max` (read from
`CLAUDE_EFFORT` in this session), dispatched by `resume: next` on 2026-09-28.
Decisions are in [decisions.md](decisions.md).

## What landed

- `packages/compiler/src/source-bundle.ts`: the `SourceBundle` v1 types,
  `decodeSourceBundle` (positive decoder and screen), `sourceBundleHash`,
  `screenSourceBundle`, `resolveSourceSpan`, and the declared data
  `SOURCE_SECRET_SHAPES` (eight shapes) and `SOURCE_URL_FORMS` (two forms)
  ([D003](decisions.md#wo-060-d003--the-contract-byte-spans-one-id-namespace-input-order-refusals-a-canonical-accepted-bundle),
  [D004](decisions.md#wo-060-d004--the-screens-declared-set-each-pattern-from-its-public-source)).
- One export line in `packages/compiler/src/index.ts`; the module registered
  in `scripts/lib/evidence-sources.mjs` ([D005](decisions.md#wo-060-d005--registration-the-harness-and-the-re-mints)).
- `packages/compiler/fixtures/wo060-source-bundles.json`: six valid bundles,
  eight malformed bundles, one refusing bundle and its clean twin for each of
  the eight shapes and two URL forms, and one bundle holding three
  secret-like strings outside the declared set. Every issue, name and
  token-shaped string is synthetic; hosts are public GitHub hosts or under the
  reserved `.example` domain.
- `packages/compiler/test/source-bundle.test.ts`: twelve tests.
- Release: application `v0.53.0`, compiler `0.19.4` to `0.20.0`
  ([D006](decisions.md#wo-060-d006--release-application-v0530-and-compiler-0200)).
- Write-backs: product 03 §Ports (+721 bytes) and product 10 §Separate
  version axes (+285 bytes), and two refreshed publication locks
  ([D007](decisions.md#wo-060-d007--write-backs-within-the-document-ceilings)).

## Criteria and their evidence

| Criterion | Evidence |
| --- | --- |
| 1. Six bundles round-trip and hash equal after canonicalization; eight malformed bundles refuse with a path | Tests `criterion 1` (two). Each valid bundle's hash equals its pinned value and an independent FNV over an independently key-sorted preimage (`corpus/harness/id-corpus-lib.mjs`). It survives a JSON round trip and a permutation of every object's keys, images and changed spans. The eight malformed fixtures refuse with the recorded path and reason. A further 28 malformed cases are covered by `positive decoding refuses every other malformed field`. |
| 2. Each declared shape and URL form refuses with the span, and the same bundle without it decodes; an empty allowlist refuses every URL form; three secret-like strings outside the set decode and are named as the limit | Tests `criterion 2` (three). The fixture cases equal the declared ids exactly. Each refusal carries the span of exactly the planted bytes and never the matched text. With an empty allowlist the valid bundles refuse at each URL occurrence (3, 1, 1 and 1). The limits bundle decodes, and the test asserts the module's documentation names the three strings. Product 03 §Ports names them in the `SourceAdapter` bullet. |
| 3. Every span in every fixture resolves to bytes inside its section or entry | Test `criterion 3`: all 64 spans (own spans, image references, changed spans and finding spans) are sliced from `Buffer.from(text)`, decoded with a fatal UTF-8 decoder, re-encoded to the same bytes, and compared with `resolveSourceSpan`. |
| 4. Write-backs | D007; `npm run publication:check` passes. |
| 5. Registration, re-mints, console re-pin | D005: `harness emit`; authority, artifact-identity and verification re-minted as WO-060 revision 001; feedback carried into `feedback-001`; four console self-host fixture files follow the label. |
| 6. Gates | `npm run test:docs` passes 23 of 23. `git diff --check` and `git diff --cached --check` are clean. No dependency was added and the kernel is unchanged. `npm test -- --review` is **not met at the final subject**: both runs after the post-gate edit passed 35 of 36, failing only on the skeleton WO-143 matrix deadline ([D009](decisions.md#wo-060-d009--the-review-gate-at-the-final-subject-the-wo-143-matrix-deadline-not-this-orders-code)); §Gates. |

## Fixture transcript

[fixture-transcript.json](fixture-transcript.json) records `decodeSourceBundle`
on every fixture with the fixture allowlist (and on each valid bundle with an
empty allowlist). It was produced after the build by this script, run from the
repository root:

```js
import { readFileSync } from "node:fs";
const { decodeSourceBundle } = await import(`${process.cwd()}/packages/compiler/dist/src/index.js`);
const f = JSON.parse(readFileSync("packages/compiler/fixtures/wo060-source-bundles.json", "utf8"));
const allowedHosts = f.allowedHosts;
const outcome = (r) => r.ok ? { ok: true, hash: r.hash } : r.refusal === "malformed" ? { refusal: r.refusal, path: r.path, reason: r.reason } : { refusal: r.refusal, findings: r.findings };
process.stdout.write(JSON.stringify({
  allowedHosts,
  valid: f.valid.map(({ name, bundle }) => ({ name, ...outcome(decodeSourceBundle(bundle, { allowedHosts })), emptyAllowlist: outcome(decodeSourceBundle(bundle, { allowedHosts: [] })) })),
  malformed: f.malformed.map(({ name, bundle }) => ({ name, ...outcome(decodeSourceBundle(bundle, { allowedHosts })) })),
  screened: f.screened.map(({ case: id, bundle, without }) => ({ case: id, with: outcome(decodeSourceBundle(bundle, { allowedHosts })), without: outcome(decodeSourceBundle(without, { allowedHosts })) })),
  limits: outcome(decodeSourceBundle(f.limits.bundle, { allowedHosts })),
}, null, 2) + "\n");
```

Summary: 6 of 6 valid bundles decode. The 8 malformed bundles refuse at `$`,
`$.assignee`, `$.discussion[1].author`, `$.images[1].bytes`,
`$.images[1].referencedBy.end`, `$.revisions[0].changedSpans[1].start`,
`$.discussion[1].id` and `$.sections[0].span.end`. Each of the 10 screen cases
refuses with one finding, and its clean twin decodes. The limits bundle decodes.

`node --test --test-reporter=spec packages/compiler/dist/test/source-bundle.test.js`
on this subject (timings removed):

```text
✔ WO-060 criterion 1: six synthetic bundles round-trip through the decoder and hash equal after canonicalization
✔ WO-060 criterion 1: eight malformed bundles refuse with a path and no input text
✔ WO-060 positive decoding refuses every other malformed field with its path
✔ WO-060 criterion 2: each declared secret shape and URL form refuses with the span, and the same bundle without it decodes
✔ WO-060 criterion 2: an empty allowlist refuses every declared URL form
✔ WO-060 criterion 2: three secret-like strings outside the declared shapes decode, and the module names them as the screen's limit
✔ WO-060 criterion 3: every span in every fixture resolves to bytes inside its section or entry
✔ WO-060 the screen reads a declared URL form's host the way a judge would try to bend it
✔ WO-060 the screen reads every string, and a string outside a section's or entry's text is located by path
✔ WO-060 the declared shapes are data, each with its boundary
✔ WO-060 the allowlist is explicit multi-label DNS host names; a caller error throws
✔ WO-060 decoding is deterministic, reads no clock or randomness and screens adversarial text in linear time
ℹ tests 12
ℹ pass 12
ℹ fail 0
```

The whole compiler suite (`packages/compiler/dist/test/*.test.js`) passes 126
of 126 with compiler `0.20.0`.

## Mutation sweep

To find tests that pass without checking the behavior, a session script (not
added to the repository) applied one hand-chosen fault at a time to the built
`packages/compiler/dist/src/source-bundle.js`. For each fault it ran the new
test file and then restored the file's bytes. The faults:

- the backslash no longer ends an authority
- extra slashes after `://` are not skipped
- the first `@` is used instead of the last
- trailing punctuation is not stripped
- the host is not lower-cased
- a port pattern swallows text
- an empty authority is read as a form
- www occurrences get any boundary
- www no longer needs a following domain character
- the Bearer minimum becomes 19
- the `ghp_` minimum becomes 35
- the own-span whole-text check is removed
- the UTF-8 boundary check is removed
- the discussion order check is removed
- images are not sorted
- the duplicate-id check is removed
- the hash domain changes
- headings are not screened
- findings lose their span

The first sweep killed 17 of 19. No test URL held two `@`, and no fixture held
two images. Adding a second image to the bug-report fixture then showed a
contract defect: a screened refusal's `$.images[i]` indexed the sorted images,
not the caller's input. The decoder now screens the value as supplied and sorts
only the accepted bundle (D003). The two-`@` case was added to the host tests.
The second sweep killed 19 of 19.

## Follow-up

[FUP-afc1bd32fa034417](../../planning/followups.json) (from D004) is deferred
in the register. It covers a later minor that declares a URL-userinfo password
and a JWT without the Bearer word, both named today as the v1 screen's limit.
[FUP-0a5c04cf5c741559](../../planning/followups.json) (from D009) is deferred
in the register: the skeleton WO-143 matrix's 240 s deadline under the shared
review gate. The worktree's adjacent queue has no items.

## Execution failure

The operator asked for this to be named as a failure in the handoff
([D008](decisions.md#wo-060-d008--correction-edits-then-formatting-then-read-back-then-the-gate)).
The executor did not work in the order edits, formatting, read-back, gate:

- It read the new test file back only after the first review gate had
  started, and its fix there (an unused parameter) forced a second full gate.
- Two earlier edits wrote escape sequences as literal characters. The line
  separators inside a regular expression broke the build's import, and a
  zero-width space went into a test string. The build and the executor's own
  byte check found them.
- The new files were left untracked, so the gate's code identity did not
  cover them.
- The first version of D008's dispatch line was longer than docs-check
  admits, and the document gate was run before docs-check. It failed, and it
  was run twice more to read the failure instead of reading the first run's
  output.

The record shows that no gate failed on formatting. The format suite passed
in the document gate, and the first review gate passed 36 of 36. The second
review gate's one failure is the skeleton WO-143 kill/restart matrix at its
240 s deadline, as WO-115-D018 recorded before; this order changes no
skeleton source.

## Gates

| Run (2026-09-28) | Subject | Result |
| --- | --- | --- |
| `npm run test:docs` 16:27:29Z | new files untracked | 23 passed |
| `npm test -- --review` 16:32:54Z | new files untracked | 36 passed, 317.38 s |
| `npm test -- --review` 16:39:52Z | after the post-gate test edit (D008) | 35 passed, 1 failed (skeleton WO-143 matrix, 240 s deadline), 380.82 s |
| `npm run test:docs` 16:44:26Z, 16:44:56Z, 16:45:23Z | after D008 was first written | each failed on docs-check (D008's dispatch line); the second and third runs only re-read the failure (D008) |
| `npm run test:docs` 16:46:36Z | staged subject | 23 passed |
| `npm test -- --review` 16:53:17Z | staged subject | 35 passed, 1 failed (the same WO-143 deadline), 395.36 s |
| focused WO-143 matrix | staged subject | passed in 179,790 ms (WO-115 recorded 180,247 ms) |

The review gate is not green at the final subject. Its only failure is a
test this order does not touch, at a deadline WO-115 also saw exceeded under
the full gate. The follow-up in D009 names it for a planner.
