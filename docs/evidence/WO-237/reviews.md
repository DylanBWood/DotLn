# WO-237 independent reviews

Three independent reviewers judged this order's implementation: the criteria
adversary, the design improver and the consistency reviewer. Each ran as a
read-only Codex session (model `gpt-6.1-sol`, reasoning effort `max`), launched
from this executor's Claude Code session on the operator's direction, as
[WO-237-D011](decisions.md#wo-237-d011--the-independent-reviews-ran-on-codex-and-what-they-changed)
records. Each session was kept and resumed for every recheck, so the same
reviewer judged every repair of its own findings. No reviewer ran a test or a
gate. Their reports stay in the executor session's scratch directory, which is
local and not committed. This page records what they found and what became of
each finding.

## Rounds

| Round | Criteria adversary | Design improver | Consistency reviewer | Distinct new findings |
| --- | --- | --- | --- | --- |
| Initial review | 10 (5 blocking) | 9 (1 note) | 6 (2 blocking) | 19 |
| First recheck | 9 (3 blocking) | 6 (2 notes) | 6 (2 notes) | 12 |
| Second recheck | 4 (2 blocking) | 3 | 2 | 3 |
| Third recheck | 5 (2 blocking) | 6 (1 blocking) | 5 (1 note) | 13 |
| Fourth recheck | 4 (2 blocking) | 6 (1 note) | 5 (1 note) | 12 |

In total: found 59, fixed 55, recorded 4. A finding that several reviewers
reported counts once. The removal window, between a root's last identity check
and its deletion, was reported in each of the first three rounds until it was
fixed, and it counts once, in the initial review.

Two operator directions shaped the last rounds. At 17:04Z the operator wrote
"ok make the changes then run the fucking gates stop fucking procrastinating".
At 17:53Z the operator wrote "FIXES SHOULD ONLY BE RELATED TO THE FUCKING
CRITERIA. WHAT IS ALL THIS OTHER BULLSHIT YOURE DOING". After that, only a
finding that bears on an acceptance criterion was fixed. The fourth recheck's
fixes were not rechecked again
([D011](decisions.md#wo-237-d011--the-independent-reviews-ran-on-codex-and-what-they-changed)).

## Recorded, not fixed

Each of these needs two interrupted removals in a row, a cross-repository
ledger, or a process ending between two system calls. None bears on an
acceptance criterion, so each is recorded under the operator's 17:53Z
direction.

- **Two stopped removals in a row.** A child root whose own removal stopped
  inside a parent's aside, after the parent's removal also stopped, is neither
  bound nor held for retirement. The child and its parent are retained for the
  operator (design improver 2 and 3, criteria adversary 4, fourth recheck).
- **A finished child, ledgered under the wrong path.** A child found inside a
  parent's aside and removed on its own is ledgered under the path where it
  was found, not under the path it was registered at (design improver 4,
  fourth recheck).
- **The window before the final directory removal.** A stop between deleting
  the owner record and removing the empty aside leaves an empty, unmarked
  `dotln-removing-<token>` directory that no prune finishes (design improver 5,
  fourth recheck).
- **A parent registered in another repository's ledger.** The segment of a
  root nested in a parent that another repository registered is not held
  while that parent is aside (criteria adversary 3, fourth recheck).

## Fixed

### Initial review

- A marker whose device matched skipped the ledger binding (criteria): fixed,
  [D004](decisions.md#wo-237-d004--a-root-is-its-token-and-its-inode).
- A replacement between a root's identity read and its removal could be
  deleted (criteria). Narrowed here, recorded in the first recheck, and fixed
  in the second by a removal that moves the root aside and verifies it there
  (D004, control c05).
- Links planted in an existing lane could redirect the move's writes
  (criteria): fixed,
  [D001](decisions.md#wo-237-d001--a-closed-orders-journals-move-into-its-retained-lane).
- A retried merge appended a log twice after a failed source removal (criteria,
  design): fixed, D001.
- The retained usage lookup was unreachable with a Copilot session in the
  environment (criteria): fixed,
  [D007](decisions.md#wo-237-d007--harness-usage-reads-a-closed-session-from-its-lane).
- A failed ledger append lost a device transition (criteria, design): fixed;
  the transition is ledgered before the marker changes, D004.
- The retained reader ignored the state's usage key (criteria) and dropped
  Copilot credits measured apart from tokens (design): fixed, D007.
- An unrelated or unreadable host directory stopped the retained readback
  (design): fixed, D007.
- An unreadable lane stopped the failure feed instead of counting as
  unreadable (criteria, design): fixed,
  [D006](decisions.md#wo-237-d006--plan-failures-reads-the-lanes-the-start-blocks-bound-is-compact-and-unlimited-reads-as-unlimited).
- Three suites kept an inherited host-wide prune scope (criteria, design):
  fixed,
  [D005](decisions.md#wo-237-d005--plan-start-is-where-expired-roots-outside-every-close-leave).
- A partial apply was reported as deferred with no removals (all three):
  fixed, D005.
- A failed retention preview read as a successful removal preview (design):
  fixed, D001.
- The combined refusal test hid which case admitted its root (design, note):
  fixed.
- The release case inventory omitted the new case (consistency): fixed.
- The instance-history oracle rejected the containing gate's protection
  (consistency): fixed.
- Helper declarations missed their consumers (consistency): fixed.
- The starter-refresh preview message said it writes nothing (consistency):
  fixed.
- The lane metadata was unbounded in the failure feed (consistency): fixed,
  D006.

### First recheck

- An owner repository without a ledger admitted a foreign record (criteria):
  fixed, D004.
- A source log that grew after a failed attempt re-appended rows (criteria,
  design): fixed, D001.
- An inaccessible order directory stopped lane discovery (criteria, design):
  fixed, D006.
- A deletion whose bookkeeping then failed was not reported (all three): fixed,
  D005.
- Previews skipped the destination checks (criteria, consistency): fixed, D001.
- An earlier device pair suppressed a later transition (criteria): fixed, D004.
- Candidate metadata errors stopped the retained readback (criteria, design):
  fixed, D007.
- The page selected the highest order numbers, not the newest lanes (all
  three): fixed, D006.
- A comment overstated the final identity check (design, note): fixed.
- The stopped-apply case lacked its helper declaration (consistency): fixed.
- The starter-refresh message omitted the ledger write (consistency, note):
  fixed.
- Decisions cited an absent D011 (consistency, note): fixed.

### Second recheck

- The overlap search took the shortest run of repeated rows (all three):
  fixed, then replaced by merge records, D001.
- An inaccessible candidate was counted as removed (criteria, design): fixed,
  D005.
- Removal progress was lost when the fallback census or the Codex home listing
  failed (all three): fixed, D005.

### Third recheck

- Legacy backfill could delete a replacement stranded under the aside name
  (design, blocking): fixed; the owner record is deleted last instead, D004.
- A root already aside skipped the parent check (design): fixed, D004.
- Nested roots moved with their parent lost their bindings (design,
  consistency): fixed, D004.
- A reused path hid an earlier aside (design, consistency): fixed, D004.
- Retirement read an inaccessible aside as absent (design): fixed, D004.
- Session-scratch asides were missing from the census walk (design,
  consistency): fixed, D004.
- An adopted legacy root's token was missing from a stopped apply's report
  (consistency): fixed, D004.
- controls.json lacked c05 and c06 (consistency, note): resolved by running
  them.
- Nested roots were deleted before their parent was verified (criteria,
  blocking): fixed, D004.
- A byte rule cannot establish merge progress (criteria, blocking): fixed with
  merge records, D001, control c06.
- A finished aside left its registration on a reused path (criteria): fixed,
  D004.
- A close dropped captured roots left aside (criteria): fixed, D004.
- An unrelated order's lane stopped the usage readback (criteria): fixed, D007.

### Fourth recheck

- A relocated child was unbound when its original path was reused
  (consistency): fixed, D004.
- Logs with equal bytes skipped the merge records (consistency): fixed, D001.
- An unpublished merge record was proven by another worktree's later append of
  the same bytes (consistency): fixed, D001.
- A torn last record swallowed the next (consistency): fixed, D001.
- controls.json held the earlier c06 (consistency, note): resolved by running
  the controls again.
- An earlier failed merge intent invalidated a later successful append
  (criteria, blocking; design): fixed; only a later record disproves an
  earlier one, D001.
- A parent moved anywhere but its own aside still let its child be deleted
  (criteria, blocking): fixed; the ancestor must be its own aside with its
  recorded inode, D004.
- Two test comments described replaced implementations (design, note): fixed.
