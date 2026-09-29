# WO-065

DotLn could publish a pull request but never read one back. WO-064 records `PullRequestOpened`, and nothing read that event, so a failing check or a review comment on a DotLn pull request stayed outside the episode store until someone copied it in by hand. This pull request lands WO-065. `npm run worktree -- observe-pr` reads a pull request DotLn opened and records its checks and review comments as one typed, classified and screened event. WO-066 will act on that feedback, and WO-123 will compose the step into the source-to-deliverable vertical.

- **`observe-pr --store <episode-store> --number <N> [--repository HOST/OWNER/REPO]`.** The command requires exactly one `PullRequestOpened` from `target-publish-host` in the store's `publication/` log. It takes that log's lock and reads the pull request's head, its status-check rollup at that head, conversation comments, reviews and review threads through read-only `gh api graphql` queries. It then appends `PullRequestStateObserved { repositoryId, number, headSha, checks[], comments[] }` with the opening event's correlation and its id as causation. Identical state, including a reordered page, appends nothing; any change, including a return to an earlier state, appends one. Nothing polls ([D002](../../evidence/WO-065/decisions.md#wo-065-d002)).
- **Roles and classes come from the API's types.** A GraphQL `Bot` author is `automation`, the pull request's author is `reporter`, and other people are `reviewer`. Comments in a resolved thread are `resolved`, other comments are `automated-review` or `human-review`, and a failing check also appears as an `automation` item of class `ci-failure` whose text is the check name. Pending drafts are omitted. An unknown actor type refuses at its field path instead of being guessed ([D003](../../evidence/WO-065/decisions.md#wo-065-d003), [D011](../../evidence/WO-065/decisions.md#wo-065-d011)).
- **Nothing refused is kept.** Every stored string passes WO-060's source-bundle screen with the forge host as the only allowed host; that covers bodies, paths, ids and check names. A refused comment keeps its shape, source field path and, for a declared finding, its UTF-8 span, and loses its text. A refused id becomes a local `refused:N` placeholder, a refused check name becomes `[refused]`, and the other comments are stored. No hash of refused text and no raw response is written ([D005](../../evidence/WO-065/decisions.md#wo-065-d005), [D012](../../evidence/WO-065/decisions.md#wo-065-d012)).
- **Unreadable input appends nothing.** Each of the following refuses with the reason and leaves the log byte-identical:
  - a number the store does not record;
  - output that does not decode, named by its field path;
  - GraphQL errors;
  - a failing `gh`;
  - a head or author that changes mid-read;
  - duplicate nodes;
  - stalled pagination.

  A forge host the screen cannot admit is refused before any `gh` call.
- **Write-backs in place.** Product 02 names the event, its log and the command in WO-064's event paragraph, in 433 added bytes (limit 450). The publication locks are refreshed.
- **An ideation breakout, as a specification.** The operator's `ideation:` message during execution adds product 05's "Personal workflow profile (specified)", two ledger entries and an order amendment. With a harness's workflow setting on, it asks for at least three contributing subagents per root workflow task; with the setting off, delegation stays willing. It claims no runtime enforcement, and its implementation is a planning row ([D008](../../evidence/WO-065/decisions.md#wo-065-d008)).

**What a reviewer should know.**

- **Two hostile-input defects are left for planning.**
  - A NUL byte in a pagination cursor or paged thread id makes `spawnSync` throw, and the CLI prints the value's leading bytes on stderr. This contradicts the evidence README's "No raw API failure text is logged" for that input.
  - A single token run of several million characters overflows WO-060's screen and refuses the whole observation.

  Both fail closed with nothing stored. They are behavioral repairs, which a final reviewer does not write, so they are filed as a planning row due before WO-123 runs the command unattended ([D014](../../evidence/WO-065/decisions.md#wo-065-d014), `FUP-7a8e67d555cccc01`).
- **Synthetic ids are not forge ids.** `ci:<id>`, `check:<id>` and `refused:N` are local, and a refused item must be read again before anything acts on it. The payload's `refused` is `{ shape, path, span? }`; the path was added by the repair, and the span is absent only for `malformed-text`.
- **An observation is paged, not atomic.** Changes between pages are recorded by the next observation. With a refused item present, a remote reordering appends a new event, because refusal paths are positional.
- **The live smoke's pull request is empty.** The operator-authorized scratch pull request has no checks or comments. Classification therefore rests on the fixtures, VER-002's schema check and this review's run against populated public pull requests (Validation).
- **Real bot feedback mostly arrives without text, and a machine user reads as a person.** On three public pull requests, 12 of 21 bot review items were stored as `scheme-authority` refusals because they link off `github.com`, including to `docs.github.com`. This is the order's forge-host-only allowlist working as written. A merge bot registered as a `User` account was stored as `human-review`, because automation is the GraphQL `Bot` type. Neither fails a criterion. Both matter to WO-066, so planning judges admitted hosts and declared machine-user logins first ([D015](../../evidence/WO-065/decisions.md#wo-065-d015), `FUP-b20c90983e966131`).

**How the review went.**

- A Codex executor built the observer, command and fixtures, ran the authorized live smoke and recorded D001 to D008, including the breakout.
- [VER-001](../../verifications/WO-065/VER-001.md) failed criterion 1: the observer keyed automation to a `[bot]` login suffix that GraphQL never returns, so no real bot comment could be classified `automated-review`. It also boarded two cases where one bad string blocked a whole observation.
- The Codex repair decoded the actor type and made malformed and screened strings per-item refusals, recording D011 to D013.
- [VER-002](../../verifications/WO-065/VER-002.md) passed all six criteria and boarded F4 and F5.
- [FINAL-001](FINAL-001.md) read the full diff against the order and ran the observer against populated public pull requests. It recorded D015, staged the work and ran the review gate once at the staged identity. It opened two planning rows, one for F4 and F5 and one for D015's limits, and routed nothing to repair.

**Validation.** The reviewer's `npm test -- --review` passed **30 passed, 0 failed, 351.96 s, 74 fresh tasks, exit 0** at code identity `354e9846…`, after the order's two new source files were staged; that row binds the released bytes. The staged source equals, byte for byte, the subject VER-002 passed.

The review also ran the observer read-only against `pytorch/pytorch#198710`, `SharpMUSH/SharpMUSH#1390` and `sydlexius/stillwater#3275`:

- It read 283, 19 and 74 checks (the first over three pages) and 21, 12 and 13 comments.
- Failing checks were stored as `ci-failure`, `Bot` authors as `automation` and resolved threads as `resolved`.
- The stored items matched a separate raw GraphQL read item for item.
- Each second run appended nothing.

`npm run test:docs` and `publication:check` pass after the review records, and `git diff --check` is clean. No dependency or component version changes, and no lint, type or format suppression is introduced.

This prepares application `v0.55.0`, a minor release over `v0.54.0`, the classification the order declared. Every addition is script-side; no component package, dependency or evidence edition changes.

Full evidence: [decisions D001 to D015](../../evidence/WO-065/decisions.md), the [evidence README](../../evidence/WO-065/README.md), the [handoff ledger](../../evidence/WO-065/handoff.md), the [smoke record](../../evidence/WO-065/smoke.json), [VER-001](../../verifications/WO-065/VER-001.md), [VER-002](../../verifications/WO-065/VER-002.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-065-pull-request-state-observation.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-29T02:33:53.414Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-162 | 13,503,324 (Δ unavailable) / 5 | 1,916,979 (Δ unavailable) | 3 (Δ unavailable) / 22,104 (Δ unavailable) | 92,198,379 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-060 | 6,799,386 (Δ -6,703,938) / 3 | 1,775,953 (Δ -141,026) | 21 (Δ 18) / 292,085 (Δ 269,981) | 103,210,110 (Δ 11,011,731) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-167 | 11,439,453 (Δ 4,640,067) / 5 | 3,044,426 (Δ 1,268,473) | 14 (Δ -7) / 232,580 (Δ -59,505) | 168,489,088 (Δ 65,278,978) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 1) | 0 (Δ 0) |
| WO-173 | 10,679,133 (Δ -760,320) / 5 | 2,587,931 (Δ -456,495) | 9 (Δ -5) / 118,695 (Δ -113,885) | 88,392,150 (Δ -80,096,938) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 1 (Δ 1) |
| WO-116 | 5,621,918 (Δ -5,057,215) / 3 | 961,856 (Δ -1,626,075) | 0 (Δ -9) / 0 (Δ -118,695) | 120,263,202 (Δ 31,871,052) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 0 (Δ -1) |
| WO-065 | 5,395,121 (Δ -226,797) / 4 | 1,624,996 (Δ 663,140) | 4 (Δ 4) / 68,105 (Δ 68,105) | 50,042,507 (Δ -70,220,695) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-065/executor | 3,154,893 (-1,305,200) | unavailable (unavailable) | unavailable (unavailable) | 16,482,163 (-94,262,271) | 122 (-1,114) | unavailable (unavailable) / 1,019 |
| WO-065/verifier | 2,240,228 (1,951,827) | 278,499 (unavailable) | 263 (unavailable) | 22,968,897 (20,919,568) | 313 (291) | unavailable (unavailable) / unavailable |
| WO-065/reviewer | 780,895 (-92,529) | 51,260 (-12,976) | 92 (29) | 10,591,447 (3,122,008) | 125 (53) | unavailable (unavailable) / unavailable |
| WO-065/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-065/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-065/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
