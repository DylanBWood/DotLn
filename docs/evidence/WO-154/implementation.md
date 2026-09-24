# WO-154 implementation — evidence editions keyed by behavior and recorded by reference (v0.46.0)

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.281","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"claude-session-readback"}

The model is the session's own identifier; the effort is Claude Code's
selected-effort readback (`CLAUDE_EFFORT=xhigh`), not an effective value. The
harness version is `claude --version` on this machine, and the live verifier
episode recorded the same `2.1.281` for the CLI it launched.

Dispatch: `resume: next`, 2026-09-24, recorded by the harness before this
procedure loaded, on the `wo-154` worktree at `75743fd6` (v0.45.0) with one
registered writer. No branch commit, push, pull request, tag or publication was
made. No subagent was spawned (0 of the cap of 20); the one live self-host
verifier episode is the order's authorized paid episode.

Application `v0.46.0` is staged under the declared minor classification (the
next minor above the local `v0.45.0` tag; WO-153, in flight in its own
worktree, targets `v0.45.1`). `@dotln/skeleton` moves 0.38.0 to 0.39.0 and
`@dotln/console` 0.1.10 to 0.1.11, with the console's exact pin and both
lockfile locations following; compiler and kernel are unchanged; no dependency
is added ([D005](decisions.md#wo-154-d005--release-assignment-v0460-skeleton-0390)).

## A corrected premise

The order's Cost line says the live episode is paid for every order whose
registered-source change is version pins only, "most" of the 59 editions in its
window. That is not what the tree does: since 2026-09-15 `--check` has retained
a live audit across a label-only change (WO-152 D004 measured it). A census over
all 81 historical re-mints found none that was label-only across the registered
list; comparing each edition's **judged** files instead found 16 whose judged
bytes differed from the previous edition only in release labels, 12 of them
since 2026-09-15, each re-minted live because an edit to a registered source the
verifier never judged coincided. That, not the pins alone, is the cost the
behavioral key removes: about one live episode in five re-mints, not most.
WO-147 D010's own case stays behavioral (`worker-store.ts` is judged), which is
why the D010 comparison alone is not the key
([D001](decisions.md#wo-154-d001--goal-alignment-a-corrected-premise-and-the-design)).

## What changed, by criterion

1. **By reference.** `--record-selfhost` projects every `{path, contents}` files
   entry of the verifier stream (the opening's subject and baseline and the
   persisted command's capsule) to `{path, blobHash, bytes}` with the Git blob
   identity of the UTF-8 bytes read, and writes it only after the references
   rebuild the store's stream byte for byte. The two synthesized
   `.feedback-source/` package projections also carry `derivedFrom` (the
   repository blob they are rebuilt from). `--check` rebuilds each body from a
   hash-matching working-tree file or any Git object with that identity (one
   `git cat-file --batch`, D002), verifies the rebuilt subject against the
   recorded revision hash, and names each unresolvable reference by path. The
   runtime store stays by value because the verifier's capsule is its only
   read projection. Fixture: `feedback-edition.test.ts` case 1 (not yet
   committed, committed then moved on, derived, candidate report, missing by
   path) and the end-to-end case's forged reference.
2. **Behavior key and pins record.** A schema 2 edition records `behavior`
   (every judged file, release labels normalized with `evidenceSourceContent`)
   and `pins` (the raw bytes of each judged file that carries a label).
   Staleness and the live episode follow the behavioral identity plus the
   regenerated report compared apart from `subject` and `policyHash`, and the
   recorded program compared apart from its compiler label (policyHash embeds
   that label, so allowing it to differ freely would hide a policy change that
   ships with a compiler bump). A pins-only change needs no action; `--carry`
   mints a deterministic edition naming the live audit it carries. The
   enumeration and its reason are in D001. Fixtures: case 3 (identities) and the
   end-to-end case (every component label moves; `--check` retains; `--carry`
   writes only `edition.json` and `feedback.json`; the carried edition checks).
3. **Regression.** A `worker-store.ts` change with the report differing only in
   `subject` (D010's comparison, asserted mechanically) is refused by the
   behavioral check; with that check bypassed by a forged identity it is
   refused because the identity does not bind the resolved judged files; with
   no identity layer at all, the live audit's own per-file judgment refuses it.
   The same refusal holds against the schema 1 edition WO-157 revision 002,
   whose entries carry `contents`: only the shape assertion differs.
4. **Existing bytes.** `git diff` over `docs/evidence/**/feedback*` and
   `docs/planning/refutations/` shows only the new edition; schema 1 editions
   keep their exact check path; `validateSelfhostEdition` serves both shapes;
   the console's self-host case is re-pinned (D006).
5. **Bytes.** WO-154 revision 001 is 177,857 bytes, against 2,231,901 for the
   same live episode by value (92% smaller), the order's 1.26 MB figure (14%)
   and a mean of 1,361,748 over the 84 editions before it (D009).
6. **Receipt subject.** Split to its own patch order: a different seam with 40
   by-value reads, a digest and a self-contained-pair contract of its own, and
   an interaction with ER2-004 (D003, `FUP-beb13d8d099d2917`).
7. **Re-mint.** Feedback re-minted with one live episode (D008); authority,
   artifact identity and verification are not stale and keep their editions,
   a recorded deviation from the criterion's letter (D004).

## The live self-host episode

`DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit --store
.runtime/feedback-audit-wo154-r001 --transport claude-cli-print --model
claude-sonnet-5 --effort xhigh`, 16:08:27Z to 16:10:41Z: complete on the first
attempt, ten fixtures, 1,192 saved instruction bytes. The verifier episode ran
130,122 ms; the usage row (claude-result-envelope) records 133,176 ms, 668,112
tokens (13,972 output) and USD 1.5389838. Effective model and effort are
unknown; the host-launch selection is `claude-sonnet-5` / `xhigh`. WO-157's
re-mint took two attempts, 313 s and USD 3.30.

## Defects met and fixed

- **Readers of committed self-host streams could not read a schema 2
  edition** (D006): `projectWorkerStatus` and the reactor's replay throw on a
  by-reference stream because the verification contract requires file
  bodies. The console's self-host stores and skeleton's WO-047 scenario test
  (the first review gate's one failure) now read through one unjudged reader,
  `packages/skeleton/src/feedback-edition-log.ts`, which follows a carried
  edition's live-audit paths and rebuilds the stream; the console's fixture
  loader, WO-032 board case and fixture recorder do the same.
- **A pins-only change could strand a reference** (D007): the console bump
  after recording rewrote the lockfile whose blob the edition's derived
  reference names, and final review's stash-merge-apply integration would do
  the same whenever main moves a pin. `--record-selfhost` now keeps a
  content-addressed pins snapshot beside the edition and stores it in the
  object database; revision 001 was repaired in place with the recorded
  lockfile rebuilt and accepted only because it hashed to the recorded
  identity. Moving the snapshot into the resolver waits for the next judged
  change (`FUP-0c86ada82f559914`).
- **Diagnosed, not a defect:** a fake-transport `feedback-audit` under
  `/var/folders` refused with "worker host refused"; the store path was a
  symlink alias (`/var` → `/private/var`) and the mount-alias guard refused it
  by design. At the real path the run completes.

## Economy experiment

One experiment (D002): per-reference `git cat-file -p` resolved 99 of 101
bodies in 379.7 ms; one `git cat-file --batch` in 6.7 ms; working-tree hashing
with a batch fallback in 6.8 ms. Adopted; the probe also found the two
synthesized entries that set the `derivedFrom` design.

## Checks

Executed on 2026-09-24 against the final tree unless stated:

- `npm test -- --review`, 16:32:13Z to 16:38:16Z: **30 passed, 0 failed,
  362.15 s**. The first run (16:25:15Z to 16:30:10Z, 294.32 s) failed one
  suite, skeleton's WO-047 "feedback verifier" replay of the committed
  stream; D006 routes it through the shared reader.
- `npm run test:docs`: 21 passed, 0 failed, 30.54 s, after the last document edit.
- `node scripts/feedback-evidence.mjs --check`: "Live feedback audit
  docs/evidence/WO-154/feedback-001 judged the current source." (2.36 s);
  `authority-evidence`, `artifact-identity-evidence` and
  `verification-evidence` `--check` exit 0.
- Regression transcripts: [fixtures/feedback-edition.tap](fixtures/feedback-edition.tap)
  (4 of 4, 0.65 s) and
  [fixtures/evidence-sources-wo154.tap](fixtures/evidence-sources-wo154.tap)
  (1 of 1, 21.8 s).
- `node --test packages/console/dist/test/*.test.js`: 21 of 21;
  `node scripts/console-fixtures.mjs --check`: five cases match.
- `npm run release -- check-surfaces --local`: every row passes (skeleton
  0.39.0 and console 0.1.11 moved; compiler and kernel unchanged).
- `npm run publication:check`: both reader editions current after their
  source locks were refreshed for the 03, 06 and 07 edits.
- `git diff --name-only` over every edition family and
  `docs/planning/refutations/`: empty; the only evidence changes are
  `docs/evidence/current.json` (the feedback selection) and the new
  `docs/evidence/WO-154/`.
- `git diff --check`: clean over tracked changes; the untracked new files carry no trailing whitespace.

## Gate step count

No suite is added, so the gate's step count is unchanged: 27 product suites
for `npm test`, 30 with `--review` on this tree. The new cases ride existing
suites: `feedback-edition.test.ts` (4 cases) in `skeleton`, and one end-to-end
case in `evidence-sources` (`evidence-sources` ran 36.27 s in the passing gate; its WO-154 case alone ran 21.8 s; the four skeleton cases add 0.65 s to a 357.74 s suite).

## Follow-ups and planning rows

`FUP-beb13d8d099d2917` (the receipt subject, D003) and
`FUP-0c86ada82f559914` (the pins snapshot into the resolver, D007) are minted
in docs/planning/followups.json. FUP-0051 (artifact growth, this order's
reopening observation) and WO-147 D010's and WO-152 D004's rows are planning's
to dispose; product 07's edition duty and product 03's evidence-growth
paragraph are rewritten here.

## Time, commands and cost

**Process cost:** entry 82,675 tokens (2026-09-24T15:37:48Z); handoff 70,566,140 tokens (2026-09-24T16:40:19Z); source claude-transcript-message-usage (scope dispatch; cost in USD unavailable from this counter)

The live verifier episode's own usage is separate (claude-result-envelope):
668,112 tokens, USD 1.5389838, 133,176 ms. Wall clock: dispatch 15:37:25Z;
live episode 16:08:27Z to 16:10:41Z; gates 16:25:15Z to 16:38:16Z. Of the
order's Cost line, the promise was one live episode of about 320 s; the
observation is one episode of 134 s. Commands, tokens and context bytes of
the order itself were promised as unknown.

## Limits

- Resolution binds content identity, not reachability: a body that exists only
  as an unreachable object resolves locally and not in a clean clone. The pins
  snapshot makes the pin-bearing bodies reachable once committed; the other
  judged bodies land in the same commit as the edition.
- The receipt subject is unchanged (D003).
- The live verifier's effective model and effort are unknown.
