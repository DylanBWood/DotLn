# WO-062 — FINAL-001

**Verdict:** pass. All six criteria are met against the original order on the integrated tree. The evidence:
- the complete verification sequence: [VER-001](../../verifications/WO-062/VER-001.md) failed into repair, the repair landed, and [VER-002](../../verifications/WO-062/VER-002.md) passed;
- my own reading of the full subject diff against the order;
- the order's affected checks, re-run after integrating current `main`;
- a fresh product gate, run after every source file was staged.

I met no defect, so nothing is repaired or boarded. Integration brought WO-107's evidence lane from `main`, and none of it touches this order's surfaces. Every claim carries forward, and the product gate re-judged criterion 6 at the integrated code identity ([D013](../../evidence/WO-062/decisions.md#wo-062-d013--final-review-main-integrated-every-claim-carried-forward)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 38954 tokens; handoff 10409499 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness before this procedure loaded. The canonical phase selected WO-062 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`;
- model `claude-opus-5-5`;
- effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order allows any effort for the reviewer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage e05c1b70-1345-4f2d-8693-fdeeab8dbaa7`, scope `dispatch`.
- **Entry:** observed at 2026-10-02T03:09:54.716Z.
- **Handoff:** observed at 2026-10-02T03:22:18.448Z (78 steps, 69 commands), before this report was filed.
- **Breakdown:** 10,203,732 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable, which means unknown, not zero.
- **Wall clock:** the largest single cost was the product gate (410.06 s).
- **Subagents:** the plan was none, out of the 20 available. The readback observed 0, and the root was the only writer.

## Subject and evidence

The verified subject is VER-002's: the uncommitted WO-062 worktree at base `2bae7d40`, checkpoint `refs/dotln/checkpoint/WO-062/8`, code identity `d05ff078…`. The numbered verification sequence is complete:
- VER-001 failed the first implementation on F1 (edit history stored as current sections, on a misread of `UserContentEdit.diff`) and F2 (role omissions not named), and routed it to repair under [D008](../../evidence/WO-062/decisions.md#wo-062-d008--verification-edit-history-carries-full-versions-so-the-mapping-is-repaired-in-the-order)'s five rules.
- The executor's repair ([D011](../../evidence/WO-062/decisions.md#wo-062-d011--current-text-only-explicit-role-omissions), [D012](../../evidence/WO-062/decisions.md#wo-062-d012--repair-outcome-and-handoff)) also integrated `main` from `a3da7127` to `2bae7d40` under the operator's `scope expand: merge in main as well` ([D009](../../evidence/WO-062/decisions.md#wo-062-d009--repair-scope-and-main-integration-authorization), [D010](../../evidence/WO-062/decisions.md#wo-062-d010)).
- VER-002 passed all six criteria and closed F1 and F2.

The SHA-256 of each report equals the control log's `reportHash`: VER-001 `92d799d7…`, VER-002 `e3eedaf9…`.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope-expansion event, which a `scope expand:` prefix never appends. D009 records the operator's words. Like VER-002, I read them as actor-attested; I did not witness them. The expansion added integration work only and left the order's text unchanged, so no `plan amend-order` was due. The order's only text change is its release label, `v0.65.0`, which `npm run plan -- check` classifies as a release assignment and passes.

**Integration.** `main` had moved to `dee4b2df` (WO-107, #179). `npm run worktree -- integrate WO-062 --intake-backup <session scratch>/DotLn-wo062-intake-20261002T031142Z.zip`:
- took the intake backup from a fresh `npm run backup:intake` of the three ignored intake files;
- checkpointed the work as `refs/dotln/checkpoint/WO-062/11`;
- retained the include-untracked stash `21b357d3` (`WO-062 integrate 2026-10-02`);
- fast-forwarded `2bae7d40` to `dee4b2df` and re-applied the stash;
- regenerated the projections, release preparation and indexes, resolving `README.md`, `docs/control/current.md`, `docs/planning/followups.json` and `docs/work-orders/README.md`;
- reported no authored conflict.

Upstream's 29 files are WO-107's `corpus/` lane, its lifecycle records, generated indexes, the README release line and one entry in `packages/kernel/test/fixtures/jsonl-protocols.json`. `git diff --cached refs/dotln/checkpoint/WO-062/8` lists only those and lifecycle records. `packages/` (apart from that fixture line), `scripts/`, product 03, the manifests and this order's smoke, fixture and observation evidence are byte-identical to what VER-002 verified. No version collides. `git ls-remote --tags origin` shows `v0.64.1` as the newest tag, so the minor target `v0.65.0` stands. `main` keeps skeleton `0.50.0`, and this order's `0.51.0` and the console pin stay above it. No evidence edition changes, because no registered source imports the adapter (D006) and upstream changes none. The follow-up register is a pure addition over `main`: WO-062's two settled entries. I completed the helper's draft record as [D013](../../evidence/WO-062/decisions.md#wo-062-d013--final-review-main-integrated-every-claim-carried-forward).

**What I reviewed.**
- The order and its cited sections: product 07 §Goal-aligned decisions and §Independent workflows and integration, and product 08 §PRs and commits and §Release-note edition.
- VER-001, VER-002, the repair handoff, `implementation.md` and decisions D001–D012.
- The whole adapter (`packages/skeleton/src/github-issue-source.ts`), its 14 tests, the replay fixture and the smoke script.
- The smoke and history-observation records, the helper's `executeGh` and the WO-060 decoder's finding type and screen.
- Every tracked change: product 03's `SourceAdapter` bullet, the order's heading, both manifests and the lockfile, the README release line and the generated projections.

The diff matches the order's design:
- The adapter reaches `executeGh` and `parseGitHubTarget` through the kit-relative bridge `dotln.ts` uses, and never calls `ensureGh`.
- `executeGh` strips `GH_REPO` and `GH_HOST`. Every query is a GraphQL `query`, and nothing writes to the forge.
- Each title, body, comment and earlier version passes `decodeSourceBundle` alone, with the parsed forge host as the whole allowlist.
- A refusal records id, shape, API path and span. The test asserts the matched string appears in no stored file.
- All reads, structural checks and screens finish before `mkdirSync`, so a read, decode or screen refusal stores nothing. The bundle and receipt are written exclusively (`wx`) under content-addressed names.
- Sections and discussion hold only current text. Earlier versions are screened in memory and never stored, which is D008's rule 1 and rule 2.

Clean-room screen: the fixture's identifiers are synthetic (`dotln-fixture/target`, `fixture-*` logins). The smoke records reduce target identifiers to shapes. The history observation names only the public `cli/cli` repository and lengths. I found no employer material, credential, private host or personal identifier. No lint or type suppression appears in the new sources.

## Criteria

**Criterion 1:** met. On the full-version replay fixture, the bundle decodes with the forge host as its only allowed host, every section, entry and revision span resolves, and two fetches give equal bytes and hash without rewriting the file. A body linking only to github.com is stored with its text. VER-002 established this on 14 passing focused tests and its own probes. The adapter, test and fixture are byte-identical on the integrated tree, where the skeleton suite that runs them passed in the product gate.

**Criterion 2:** met. The test first asserts its corpus covers exactly `SOURCE_SECRET_SHAPES` and `SOURCE_URL_FORMS`. It then runs all ten cases in a current body, a current comment and an earlier version only. Each run checks a stopped status, the shape, a span resolving to the matched string, its absence from every stored file, a decoding remainder and an `incomplete` refusal naming the item. VER-002's probes added a title, a refused comment with a clean earlier version and a secret only in an earlier body. These inputs are unchanged.

**Criterion 3:** met. The tests refuse, with a sanitized reason and no store, on each of these inputs:
- a `PATH` without `gh` and a failing `--version`;
- failing `auth status`;
- failing source and edit-page reads;
- invalid JSON and GraphQL errors;
- a malformed field, named by its API path, including a malformed earlier version.

Missing and null declared fields are recorded `missing` or `unavailable`. My own probe added one more failing `gh` case: a 17 MiB reply past the adapter's 16 MiB buffer refuses as `gh IssueSource failed (exit unavailable)`, and the store directory is never created.

**Criterion 4:** met. `smoke-repair.json` records two read-only fetches of an issue in a public repository (`isPrivate` false). Both fetches give equal bundle and receipt hashes, the bundle decodes, `currentSectionsOnly` and `historyTextFree` are true, and 8 spans resolve. Identifiers are reduced to shapes. VER-002 reproduced the script on a public `cli/cli` issue with stable hashes.

**Criterion 5:** met.
- Product 03's `SourceAdapter` bullet changes in place, with no dated paragraph. It grows 206 bytes, under the 300-byte bound and the 176,132-byte ceiling, and integration left product 03 unchanged.
- D002 records the FUP-0113 reading: no `ModelInputPlan` in the adapter's contract, because the adapter invokes no model.
- `npm run publication:check` passes on the integrated tree: 253/253 headings, and 29 and 45 linked sections current.

**Criterion 6:** met.
- `npm test -- --review` passed after staging, on the integrated tree: 30 suites, 0 failed, 410.06 s, 75 fresh tasks, recorded 2026-10-02T03:19:57.219Z at code identity `8618ab9329bdbf3f3292fe3751e6fa91d7d7e14a9c8c3b877235435c3651c0e8`. That is the current identity, recomputed with `gateCodeIdentity`.
- `npm run test:docs` passed with this report, PR.md and RELEASE-NOTES.md in place: 24 suites, 0 failed, 37.33 s. The result transition runs it again inline.
- `git diff --check` and `git diff --cached --check` are clean with every new file staged.
- The manifests and lockfile change only the skeleton version and the console's existing pin, so no dependency is added.

## Observations (not findings)

- **Large issues refuse with a generic reason.** The source query asks for up to 100 comments per page, each with its first 100 full earlier versions, in one reply. A reply past 16 MiB refuses as an unexplained `gh` failure, which my probe confirmed stores nothing. The behavior is what criterion 3 requires, so it is not a defect. WO-123 should expect it on long, heavily edited issues, and a smaller first edit page is the obvious remedy if one appears.
- **Carried from VER-002.** A secret or outside link that survives only in an earlier version stops the result, and so does a deleted revision (a null `diff`). Both are conservative and pinned by tests.
- **D003's wording slip stays.** Its repair evidence line says the superseded counts are "below" when they appear above. Editing D003 would add a new revision to `FUP-516f42831f87de8a`, which the repair settled, for no change of claim.
- **Standing meter signal.** `npm run meta` reports one reopen candidate, `WO-150-D003` (executor cold start 28,290 bytes against 24,576), as at earlier closes. It belongs to WO-150's ceiling, not this order.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run worktree -- integrate WO-062 --intake-backup …` | `2bae7d40` → `dee4b2df`; no authored conflict; checkpoint `/11`; stash `21b357d3` |
| `git diff --cached refs/dotln/checkpoint/WO-062/8` | upstream WO-107 files, one kernel fixture line and lifecycle records only |
| `npm test -- --review` | 30 passed, 0 failed, 410.06 s, 75 fresh tasks, identity `8618ab93…` |
| `npm run test:docs` | 24 passed, 0 failed, 37.33 s, with this report, PR.md and RELEASE-NOTES.md in place; rerun inline at the result transition |
| `npm run publication:check` | passed: 253/253 headings; 29 and 45 linked sections current |
| `node scripts/harness.mjs check` | 32 generated surfaces |
| `npm run release -- check-surfaces --local` | exit 0 |
| `npm run plan -- check` | exit 0 |
| `git diff --check`, `git diff --cached --check` | clean |
| `git ls-remote --tags origin` | newest `v0.64.1`; `v0.65.0` stands |
| `shasum -a 256` of VER-001 and VER-002 | equal to the control log's `reportHash` values |
| Oversized-reply probe through a fake `gh` | `gh` refusal; store not created |
| `npm run meta` | D013 indexed; one standing reopen candidate (WO-150-D003) |

## Judgment and publication

The order promised WO-123 a screened, stable and honest source input, and the integrated subject delivers it. Current text only, every omission named, a typed stop, stable hashes and no forge writes all hold on executable evidence. The composed source-to-deliverable loop remains WO-123's to show. Policy resistance and success-to-the-successful were tested by VER-001 itself: it overturned the executor's documentation-based reading with observed API output, and the repair followed the observation. Rule beating is answered by store-wide searches for withheld text rather than decode checks alone. The review spent one product gate and no subagents; re-verifying byte-identical claims would have added cost without evidence (D013).

The result is `final-review-result pass`. The reviewed state is then committed and published with the title `:sparkles: Read a GitHub issue into screened, stable source input, with a typed stop naming anything left out`, using [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md).
