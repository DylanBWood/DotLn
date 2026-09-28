# WO-060 FINAL-001 — final review

**Verdict:** pass. WO-060 asked for `SourceBundle` v1: the types, a positive decoder, a canonical hash and a screen that refuses the secret shapes it declares and every declared URL form whose host is not allowed, with fixtures, the registration, the re-mints and two bounded product write-backs. The subject lands one compiler module and its export, twelve tests over a synthetic fixture file, the registry line, the compiler release with its consumer pins, four re-minted or carried editions with the console re-pin, and 721 and 285 bytes in products 03 and 10. [VER-001](../../verifications/WO-060/VER-001.md) passed all six criteria on the staged subject. This review read the full subject diff against the original order, ran the review gate once on the unchanged code identity, recorded one decision ([D010](../../evidence/WO-060/decisions.md#wo-060-d010--final-review-the-review-gate-passed-twice-at-the-final-subject-so-d009s-criterion-6-statement-is-superseded-and-the-matrix-deadline-stays-with-the-planner)) and disposed the eight register rows the change touches. It changed no source.

**Subject:** [`docs/work-orders/WO-060-source-bundle-contract.md`](../../work-orders/WO-060-source-bundle-contract.md) on branch `wo-060`, uncommitted, over `main` at `ddb58d268126e5b9efb5f481ff5f9d9d320b28d6`. `git ls-remote origin refs/heads/main`, `origin/main`, local `main` and the merge base all name `ddb58d26`, so no integration was needed or run. The dispatch checkpoint is `refs/dotln/checkpoint/WO-060/5` (`00b3e0b0`).

- The recorded `reportHash` of VER-001 (`sha256:e00cd538…`) equals the report's current SHA-256.
- The order's text differs from `main` only in its heading's `(v0.53.0)` label, written at activation. The six criteria are the original ones, as amended by the 2026-09-28 planning pass before activation.
- The review gate ran at code identity `32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee`, the identity of VER-001's gate row and of the working tree at this review, so the tracked non-generated code is the code VER-001 judged. What this review wrote is documents and local state only: D010, the decisions index, the register and its ignored request file, the refreshed meter snapshot and PR meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice about the verdict. The harness version is what `claude --version` reports in this session; the model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry (exact-observed). The executor's mutation sweep and one independent verification had already read this subject, the code diff is one module, one test file and one fixture file, and the rest is generated; none was spawned.

**Process cost:** entry 90078 tokens; handoff 4009284 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 37b9b28d-be68-4118-83fb-a8e1039d4319`. The entry reading was observed at 2026-09-28T17:32:34.251Z, before the order was read. The handoff reading was observed at 2026-09-28T17:52:48.906Z, after D010, the PR body, the release notes and this report's judgment text were written and before `test:docs` and the result transition. Both readings count reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. The largest wait was the review gate, 367.01 s, during which repository writes are refused; the reads for this report ran beside it and every write followed it.

## Goal-aligned judgment

WO-060 is gate G of the critical path: WO-061 and WO-062 depend on the bundle and WO-065 on its screen, and until this order the `SourceAdapter` port was prose. The questions for this review were whether the screen claims exactly what its fixtures prove, whether the contract is one its consumers can use unchanged, and whether the release and its re-mints were paid for deterministically.

- **Rule beating** was the planning receipt's named risk: a passed screen must not imply universal secret detection. It did not happen. The criterion 2 test asserts that the fixture's screened cases equal the exported shape and form ids exactly, so a shape cannot be added to the code without a fixture or claimed by a fixture without code; the module header, product 03 §Ports and the limits fixture name three strings that decode by design. The 41 host-reading cases cover the bends a judge would try, and every refusal's span is sliced back to the planted bytes without the module.
- **Policy resistance:** the screen and the decoder do not undo each other. Screening runs on the value as supplied, so a finding's path names the field the caller sent; the executor's mutation sweep found the earlier version indexing sorted images and D003 records the fix. A consumer chooses what to do with a refusal: WO-062 drops the item and records its id, shape and span.
- **Drift to low performance:** the limit is fixed as data and fixtures, not prose, so a later reader cannot mistake the screen for a detector. D004's follow-up names the next two shapes for a later minor rather than widening the claim now.
- **Tragedy of the commons:** the compiler release moved the feedback policy hash. The authority, artifact-identity and verification editions were re-minted deterministically, the feedback edition was carried, and the console was re-pinned in the four files WO-162 D012 named; no live episode was spent. This review's own cost to the shared gate was one 367 s run.
- **Escalation, success to the successful, shifting the burden:** no new gate and no refusal outside the decoder; the hash follows the compiler's fnv1a64 convention with the SHA-256 alternative recorded and its reopening condition named (D003); a refusal carries path, offsets and span, so an adapter or operator acts without re-reading the artifact.
- **Seeking the wrong goal:** the deliverable is a contract WO-061 can consume; its criterion 1 reuses these six valid bundles, which hold struck text, headings, questions, images and revisions.
- **Naive Interventionism:** nothing runs today that this could break; no code carries a tracked-work artifact. The second-order effect, the policy-hash move, is handled by the carry, and the change reverses by removing the module and its export.
- **NoOp** leaves gate G closed and the port prose, with no evidence that waiting would help.

## Criteria

**Criterion 1:** met

`packages/compiler/test/source-bundle.test.ts` decodes the six valid bundles, compares each hash with its pinned value and with an independent FNV over an independently key-sorted preimage from `corpus/harness/id-corpus-lib.mjs`, round-trips each through JSON, permutes every object's keys and reverses the images and changed spans, and checks that the six hashes differ and that reordering sections or editing text changes a hash. The eight malformed fixtures refuse with exactly the recorded path and reason, and 28 further malformed cases refuse with their path. The fixture transcript agrees: 6 of 6 valid bundles decode and the 8 malformed bundles refuse at the paths the README lists. The compiler suite passed in this review's gate.

**Criterion 2:** met

The fixture's ten screened cases equal the eight `SOURCE_SECRET_SHAPES` and two `SOURCE_URL_FORMS` ids exactly; each refuses with one finding whose span resolves to the planted string, the refusal's JSON does not contain the matched text, and the clean twin decodes. With an empty allowlist both URL forms refuse, and the valid bundles refuse at each URL occurrence the test expects (3, 1, 1 and 1) and decode otherwise. The limits bundle holds three strings outside the declared set (an unprefixed 40-hex token, a JWT without the Bearer word and a password in an allowed URL's userinfo), decodes to its pinned hash, and the test asserts the module's documentation names them; product 03 §Ports names them in the `SourceAdapter` bullet. I read the screen: the authority ends at the declared delimiters less trailing punctuation, the host follows the last `@` and precedes a `:port` and is compared in ASCII lower case, the `www.` form applies GFM's boundary and skips an authority already read, and the shapes run on every string of the bundle, including ids, hashes, headings and alt text. The declared patterns match the sources D004 cites; I did not re-fetch the vendor pages and rely on VER-001's independent comparison for that.

**Criterion 3:** met

The criterion 3 test slices all 64 fixture spans (own spans, image references, changed spans and finding spans across the valid, screened, clean-twin and limits bundles) from `Buffer.from(owner.text)`, decodes each with a fatal UTF-8 decoder, re-encodes to the same bytes and compares with `resolveSourceSpan`; the multibyte fixture's changed spans resolve to `🙂`, `„Größe“` and the empty string, and an offset inside a character throws. Malformed fixtures deliberately hold invalid spans and are judged under criterion 1.

**Criterion 4:** met

Measured against `main` at this review: product 03 §Ports gained 721 bytes and product 10 §Separate version axes gained 285, inside the existing `SourceAdapter` bullet and the existing section with no dated paragraph, against limits of 800 and 300; the documents stand at 173,569 and 25,603 bytes against ceilings of 176,132 and 25,825. The roadmap's release-boundary section gains a dated activation paragraph in that section's own form, which is not a criterion 4 write-back. `docs/evidence/WO-060/decisions.md` holds D001 to D009 and now D010. Both publication locks are refreshed and `npm run publication:check` passes (Checks).

**Criterion 5:** met

`packages/compiler/src/index.ts` exports the module and `scripts/lib/evidence-sources.mjs` registers it with a one-line reason. `docs/evidence/current.json` points authority, artifact-identity, verification and feedback to WO-060 revision 001; the first three are deterministic re-mints and the fourth is the carry from WO-162, each recorded in D005 with its check output. The console manifest and the three expected self-host outputs follow the label and the carried edition, the four files WO-162 D012 named. The fourteen regenerated files under `.claude/` change only in the runtime snapshot path, the pinned compiler file hashes, the compiler label and the policy hash; `npm run harness -- check` reports the 31 generated surfaces. The edition and registration suites passed in this review's gate.

**Criterion 6:** met

`npm test -- --review` passed: 36 passed, 0 failed, 367.01 s, 80 fresh tasks, exit 0, at code identity `32e2cc1c…` (Checks); VER-001's run passed on the same identity. `npm run test:docs` passed after this report, the PR body and the release notes were written (Checks). `git diff --check` and `git diff --cached --check` are clean. The manifests and lockfile change only the compiler label and its consumer pins, so no dependency is added; `packages/kernel/` has no diff against `main`; the two new files carry no lint, type or format suppression. The executor's handoff recorded this gate as not met at the final subject, on the WO-143 matrix deadline alone; D010 reopens D009 with the two passing runs and keeps the deadline with the planner.

## Rows

`npm run plan -- followups --touching` returned eight rows at register revision `fdd6840e…` before D010 and at `d6d0869c…` after `npm run meta` synced it, where D010's `reopens` object had moved this order's D009 row to revision 3. One batch through `followups --apply` disposed all eight, and the register moved to `0f86f04bd9bf5a1b2cb3d6348e522efe4854c6c3eb16f6dabcbed7cb64fd0046`. Each reason cites this report.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-0a5c04cf5c741559 (D009) | WO-060 | deferred at revision 3, same condition | Criterion 6 is met on two passing gates (D010); the executor's two deadline failures are unchanged observations for the planner. |
| FUP-afc1bd32fa034417 (D004) | source-bundle.ts, WO-060 | deferred, same condition | The next two shapes are a later minor under operator-review assumption 2; the limit is named in three places. |
| FUP-5e2f4ce16f9e8be1 | bundle-diff.json | deferred with the measurement | WO-060 commits 374,344 bytes under `docs/evidence/WO-060`, under the row's 1 MB trigger. |
| FUP-50cda1c03ecd8ea8 | meta.json | deferred, same condition | The byte-proof writer in `harness-prune.mjs` is untouched. |
| FUP-56b599e15f97e666 | evidence-sources.mjs | deferred, same condition | `resident-state.ts` is unchanged; the feedback edition is carried, not fresh. |
| FUP-acfe4bfda716d8fb | current.md | deferred, same condition | Generated projection only; usage attribution is untouched. |
| FUP-e55e258d37cb3f20 | product 03 | deferred, same condition | The feed modules are untouched; the feed found every row this review disposed. |
| FUP-fd05316b6030ef73 | README.md, evidence README, product 03, index | deferred, same condition | The writer text and the named sentences are untouched. |

The worktree's adjacent queue has no items.

## Findings

No finding is routed to repair, and no criterion fails.

- **The evidence README's Criteria table and Gates section say the review gate is not green at the final subject.** That was the executor's observation at handoff (D009). VER-001 and this review both passed the gate on the same code identity; [D010](../../evidence/WO-060/decisions.md#wo-060-d010--final-review-the-review-gate-passed-twice-at-the-final-subject-so-d009s-criterion-6-statement-is-superseded-and-the-matrix-deadline-stays-with-the-planner) reopens D009 with that observation. The README is the executor's record and is left as written; a reader of D009 alone now reaches D010 through the decisions index.
- **The mutation sweep is actor-attested.** The README records 19 of 19 hand-chosen faults killed by a session script that is not in the repository. I did not reproduce it; no criterion depends on it, and the tests I read cover each fault it lists.
- **The meter reports one standing budget breach**, `current/sequenceBytes` 13,965 against a ceiling of 8,192, on `docs/planning/sequence.md`, which this order does not touch. It predates the order and is not a finding against the subject.
- **The meter's verifier row and VER-001's cost line differ.** The meter shows 4,771,509 tokens for the verifier dispatch and VER-001 records a handoff of 3,722,015. Inference, labelled as such: the meter's reading is later than the report's handoff cutoff and includes the result transition. Neither number is this review's to correct.

## Reviewer errors in this session

- I started the review gate in the background and then issued nine read commands in forms the live-gate hook refuses (pipes into `node`, a shell expansion, a `2>&1 | head` stage). Each was refused with nothing written, and I reissued them as single-stage reads. The gate's own row is unaffected.
- My first listing of the gate rows crashed on a row without a code identity (an inline `git diff --check` row). I reissued it with a guard.

## Verification sequence

1. **Implementation** (executor, Claude Code 2.1.283, `claude-opus-5-5`, effort max, `claude-session-readback`): activated at 2026-09-28T15:39:44Z; `ImplementationReady` at 17:00:39Z, checkpoint 2. D001 to D009. D008 records the operator's correction of the executor's working order and names the lapse as a failure. Its gate passed 36 of 36 before the new files were staged and 35 of 36 twice after, each failure the WO-143 matrix at its 240 s deadline (D009).
2. **[VER-001](../../verifications/WO-060/VER-001.md)** (Codex CLI 0.158.0, `gpt-6-sol`, effort max, `codex-session-readback`): requested at 17:04:35Z; pass at 17:15:05Z, checkpoint 4. All six criteria met. It sliced every fixture span independently, compared the GitHub shapes with the vendor's published formats, and ran the full gate on the staged subject: 36 of 36 in 315.38 s at code identity `32e2cc1c…`.
3. **FINAL-001** (this report): dispatched at 17:32:24Z, checkpoint 5. No finding routed to repair; D010 records the gate outcome and reopens D009.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, merge base | all `ddb58d26`; no integration at review |
| Tags | local and `origin` end at `v0.52.10`; `v0.53.0` is free on both |
| `npm test -- --review` | 36 passed, 0 failed, 367.01 s, 80 fresh tasks, exit 0; recorded 2026-09-28T17:44:17.836Z; code identity `32e2cc1c…`, tree `86fd9255`; row `host-gate:32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee:npm test` |
| `gateCodeIdentity` of the working tree | `32e2cc1c…`, equal to VER-001's row and this review's |
| SHA-256 of VER-001 | equals the recorded `reportHash` |
| Product write-back bytes against `main` | 03 §Ports +721 (limit 800; document 173,569 of 176,132); 10 §Separate version axes +285 (limit 300; 25,603 of 25,825) |
| Fixture transcript | 6 valid decode; 8 malformed refuse at the listed paths; 10 screened cases refuse with one finding and their twins decode; 14 screened refusals in all with the 4 valid bundles under an empty allowlist; limits decodes |
| `npm run harness -- check` | 31 generated surfaces; local-terms list unavailable |
| `npm run publication:check` | 30 and 45 linked source sections match; publication bootstrap checks pass |
| `npm run meta` | index gains D010; register synced; one standing breach, `current/sequenceBytes`, outside this order |
| `npm run plan -- followups --touching`, then `--apply` of an 8-request batch | 8 rows at `d6d0869c…`; all applied; register `0f86f04b…` |
| `node scripts/adjacent-work.mjs list` | no items |
| `git diff --check`, `git diff --cached --check` | clean |
| Dependency, kernel, suppressions | manifests and lockfile change only the compiler label and pins; no diff under `packages/kernel`; no suppression in the new files |
| `npm run release -- prepare --local` | `v0.53.0` remains current; wrote the meter snapshot (3,773 bytes) and the PR meter block at cutoff 2026-09-28T17:52:51.489Z |
| `npm run test:docs` | 23 passed, 0 failed, 13.07 s, 23 fresh tasks, exit 0, after this report, the PR body and the release notes were written; a second run on the final bytes of this report also passed 23 of 23 |
