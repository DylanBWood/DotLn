# WO-065 implementation and repair evidence

The executor implemented an on-demand reader for a pull request previously
opened by DotLn. This gives WO-066 stored feedback to consume; it does not
resolve comments or schedule polling. Application release `v0.55.0` is staged
locally, with no component package or dependency change.

## Command and event

```sh
npm run worktree -- observe-pr --store <episode-store> --number <N>
```

Add `--repository HOST/OWNER/REPO` when the store records the same number in
multiple repositories. The store is the episode directory, not its
`publication/` child. Exactly one `PullRequestOpened` from `target-publish-host`
must match. The observer locks that publication log, reads GitHub through `gh`
GraphQL queries, and appends `PullRequestStateObserved` with the opening event's
workstream/correlation and its event ID as causation. Identical normalized state
appends nothing; a change back to an earlier state still appends.

The payload is `{ repositoryId, number, headSha, checks[], comments[] }`.
Checks carry name/state. Failed check states `FAILURE`, `ERROR`, `TIMED_OUT`,
`STARTUP_FAILURE` and `ACTION_REQUIRED` also produce `ci-failure` items.
Conversation comments, submitted review bodies and submitted inline comments
are included; pending drafts are omitted. Resolved threads produce `resolved`
items. Other comments are `automated-review` or `human-review`.

Every author query selects `__typename` and `login`. A `Bot` is `automation`,
even when it authored the PR. `User`, `Mannequin`, `Organization` and
`EnterpriseUserAccount` are explicitly admitted non-bots; matching PR actor
type and case-folded login makes a non-bot `reporter`. Others and deleted
authors are `reviewer`. Missing or unknown types refuse with a field path.
This corrects VER-001 F1; the fixture now uses unsuffixed Bot logins.
All connections paginate, including comments within each review thread.
Check reads are pinned to the observed commit; head/author changes refuse
the observation. Paged API reads are not an atomic snapshot.

Every stored comment body passes WO-060's declared source-bundle screen,
with only the forge host allowed. A refused body becomes the first finding's
shape, source field path and UTF-8 byte span within the one-entry `comment`
bundle for that field. Invalid controls or Unicode become `malformed-text`
without a span. Its text and text hash are absent; safe peers survive.
Persisted metadata is screened too: refused paths and their line are omitted,
and refused ids use collision-avoiding local `refused:<ordinal>` placeholders.
They are not forge identifiers and must be reread before any disposition.
Any field refusal omits the whole item's body. Refused check names become
`[refused]` while preserving state, with a refused automation item classified
`ci-failure` only for a failing state, otherwise `automated-review`.

Unknown shapes outside WO-060's declared set can pass. No raw API failure text
is logged. Invalid forge hosts refuse through the screen's host rule before
any `gh` call. Structural decode errors, unknown enum values, duplicate nodes,
stalled pagination or an API failure append nothing. Each `gh` response has
a 16 MiB buffer bound. Refusal paths address the current response page;
placeholder identity and refusal positions do not promise stability after
remote reordering or pagination changes.

## Executed repair evidence

Repair dispatch: `resume: fix`, addressing VER-001 F1 and operator-confirmed
F2/F3 (adjacent-0001). Actor: Codex CLI 0.158.0, gpt-6-astra, effort max,
source codex-session-readback. One writable agent; no subagents were spawned
in this repair. Numeric effort does not establish workflow mode; D008 remains
a specified policy with its separate implementation follow-up.

| Check | Result |
| --- | --- |
| `npm test -- --review` | 30 passed, 0 failed; 74 fresh tasks; 320.69 s. Recorded 2026-09-29T01:35:55.843Z. |
| `node --test scripts/test-target-publish.mjs` | 17 passed, 0 failed; 21.72 s; [repair transcript](repair-fixtures.txt). |
| `npm run test:docs` | 23 passed, 0 failed; 23 fresh tasks; 13.44 s. Runs again inline at repair completion after final write-backs. |
| `npm run plan -- check` | Passed; recognizes the existing authorized D008 order amendment. |
| `npm run publication:check` | Passed; both source locks current, 267/267 headings covered. |
| Existing live scratch PR | [Repair re-observation](repair-smoke.json): unchanged on both reads, independent head/number match and opening-event correlation. |

The full gate's code identity is `ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d`;
evidence reference `host-gate:ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d:npm test`.
The [subject receipt](repair-subject.json) independently hashes the actual
source/test/fixture bytes, including untracked additions. Documentation and
evidence outputs were finalized afterward; no code changed.

The F1 regression first failed on the missing typename query selection. The
F2/F3 regressions first failed on malformed body and metadata whole-refusals
and a forge read before host validation. The passing repair exercises all
five Actor types, Bot PR-author precedence, same-login non-bots, paginated Bot
comments, unknown/missing types, controls including DEL, invalid Unicode,
refused metadata and colliding placeholder-shaped safe ids. It preserves the
original privacy matrix, safe peers, role/class/resolution, pending-draft
omission, correlation, pagination and deduplication. Structural failures
still append nothing. No dependency or component package changed.

The live Actor schema introspection independently returned Bot, User,
Mannequin, Organization and EnterpriseUserAccount. Source: GitHub's public
[Actor reference](https://docs.github.com/en/graphql/reference/users#actor)
and read-only schema query on 2026-09-29; Context7 /github/docs supplied the
typed Bot/User query example. The original classification fixture's suffix
assumption was wrong and is corrected in D003/D011.

The live smoke used the operator-authorized scratch repository and a fresh
publication through DotLn's publisher. It had zero checks/comments, so the
fixture evidence establishes classification and screening. For a fresh
published episode, the observe-only smoke is:

```sh
node docs/evidence/WO-065/smoke.mjs --store <episode-store> --number <N>
```

It expects its first observation to append and refuses to overwrite the
existing receipt. The actual episode and locator are retained in session
scratch; committed evidence reduces identifiers to shapes. No model worker
was invoked for the synthetic publication.

## Authorized ideation breakout

[D008](decisions.md#wo-065-d008), the newest ledger section and product 05
specify the operator's personal delegation profile: at least three distinct
contributing subagents with the respective workflow setting enabled; willing
delegation when disabled, with roughly zero to three as an expectation.
One root workflow task is the stated synthesis of counting scope. Existing
authority, No Fan-Out, concurrency, descendant budget and writer constraints
remain. This is a specification, with implementation tracked by open
`FUP-e62d0d2771185a38`; no runtime enforcement or setting change is claimed.

The read-only policy lookup and authored-text review found no material
problem. Three distinct subagents contributed in the original implementation task,
including the implementation reviewer; no descendants were launched.
That is actor-attested. Instrument-observed admissions were zero with an
unknown remainder and do not establish the actual count.

The goal-alignment outcome is a tested reader that makes PR feedback
available without remote writes, plus preservation of the delegation
direction without adding an untested runtime gate. The economy decision
kept the existing fixture harness; no measured per-order saving is claimed.
The repair restores typed automation and isolates unreadable strings without
retaining rejected content. Product 02 now gains 433 bytes within its 450-byte
bound (148268 bytes against ceiling 150611). See [decisions D001–D013](decisions.md) for alternatives, correction,
authority, limits and reopening conditions. Verification and final review
must digest the breakout as the amended order specifies.
