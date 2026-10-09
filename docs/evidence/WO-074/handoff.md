# WO-074 executor handoff

`npm run launchpad -- export <dir>` materializes a launchpad instance from a
manifest-listed kit read as Git blobs at the HEAD commit of the checkout that
holds the running scripts: the control-plane scripts and suites, the build-free
`packages/beacons` workspace and the nine build-free package modules, a
`package.json` with core's script names and exact development pins, a lockfile
pruned to them, the execution guide and the playbook whole, the overlay
template, the kit templates, the three license files (or `LICENSE-PENDING.md`
under `--license none`), `UPSTREAM.md` and `KIT-MANIFEST.json`. Instance seeds
(the operating contract, the sanitized harness-security template, the client
README, `.gitignore`, the first order, the proposed sequence, the root
READMEs, the empty grants registry) are written once and never listed. The
local-terms check runs over every exported text before any write. The design
was refuted once before implementation (D002, D003) and reviewed by two fresh
workers before this handoff (D011); every finding is fixed or recorded.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

**Criterion 1:** met — [launchpad-fixture.txt](launchpad-fixture.txt): a non-empty destination, a file and an unreadable directory are refused before any write (the destination is created only after every refusal has passed); every `scripts/**` and `packages/beacons/**` file is byte-identical to the commit `UPSTREAM.md` names (Git blob identity and mode) and every manifest hash verifies; `npm ci --offline` against the exported lockfile installs the six pinned packages and links `@dotln/beacons`; with no TypeScript source present the kit's own `resume activate` activates the pre-drafted first order and `status --json` reports it active. The export's `npm test` is not claimed; [D007](decisions.md#wo-074-d007--the-exports-own-test-command-is-a-follow-up) records it as FUP-8fb7ae17dd0fad5b. The gate row: `npm test -- --review` at code identity 7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d, suite `launchpad` PASS 9.75 s.

**Criterion 2:** met — after activation inside the export the public and verifier control Beacons decode to codebook 2, phase active, with `packages/skeleton` holding only the six build-free `.mjs` modules the scripts import and the empty grants seed, no `.ts` anywhere under `packages/*/src` (the fixture asserts the exact skeleton contents; "package source" is TypeScript source, step 1).

**Criterion 3:** met — the negative fixture plants an intake file, `.claude/settings.local.json`, a Beacon output, a control-Beacon projection, a runtime store, a TypeScript source file of a compiled package and an evidence file of this repository's order holding the synthetic list's SHA-256, every one force-added so it is a blob at the exported commit; the export holds none of them, no exported file equals the list, the list is absent, and the manifest lists no instance path. The check runs over every exported text and the manifest: a synthetic list with no match prints `local-terms list: present (N texts checked)`, no list prints `unavailable; no text was checked against a local-terms list`, an empty list refuses, and a match refuses by file and line without the term, with no destination written.

**Criterion 4:** met — `LICENSE`, `LICENSE-docs` and `NOTICE` are byte-identical to the pins `scripts/license-surfaces.mjs` exports and manifest-listed; under `--license none` only `LICENSE-PENDING.md` exists, manifest-listed, grants no rights and names no license (and the generated `package.json` says `UNLICENSED`); the search over every exported path but `scripts/license-surfaces.mjs` finds no other license-shaped file in either export (the pending-notice template is named `pending-license.template.md` for that reason, D003).

**Criterion 5:** met — inside the activated export, `implementation-ready` attesting `claude-code 0.0.0-fixture` records the attestation as supplied with `Advisory: attestation recorded as supplied; claude-code 0.0.0-fixture effort xhigh has no matching discovery observation.`; a discovery record that lacks the version still advises and one that holds it, observed with the effort, does not; the client README says a fresh fork's attestations carry the advisory until the instance records its own discovery.

**Criterion 6:** met — [criterion-6-local-terms.md](criterion-6-local-terms.md): step 10 run from a committed copy of this work tree (commit 91e4a6be, whose exported `scripts/launchpad.mjs` hashes to the work tree's bytes) with `DOTLN_LAUNCHPAD` naming the main checkout, which holds the operator's list: `local-terms list: present (305 texts checked)`, exit 0, nothing refused; the list's contents were never read or printed. From this worktree at HEAD the same command refuses by name, as D002 and D005 record.

**Criterion 7:** met — product 03 §Platform and instance boundary carries the kit's first slice in place with no dated paragraph (178,287 bytes against the 194,488 ceiling); `docs/LEGAL.md` §Current state carries the dated observation; `docs/README.md` §Map names `scripts/kit/`; the decisions file holds D001 to D011; the two publication source locks were refreshed after each product 03 edit and `check-publication` reports both outlines current (the order's step 11 names the status index, but the locks live in the two outlines).

**Criterion 8:** met — [edition-checks.json](edition-checks.json): authority, artifact-identity and verification re-minted deterministically as WO-074 revision 001 and feedback-001 carried from WO-199 feedback-004 with no live episode, all four checks exit 0; `npm run test:docs` 29 passed in 92.23 s and `npm test -- --review` 35 suites, 85 fresh tasks, 0 failed in 1,044.00 s, both at code identity 7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d; `git diff --check` clean; `package.json` adds only the `launchpad` script and no dependency.

self-review: found 37; fixed 35; recorded 2 — [criteria adversary](adversary.md): 16 found, 14 fixed, 2 recorded (the fixture data derived from a verification report, FUP-e624167a7f6555f6; the order's step 11 wording); [design improver](improver.md): 21 found, 21 fixed. Both were fresh `dotln-worker` agents given only the order and the diff; a third worker refuted the design before implementation (D002, D003, D005). Fan-out: 3 of the 20-agent budget.

Goal alignment matched D002: the manifest names only a commit that holds every listed file's source, the dirty work tree is named rather than exported, and the launchpad supplies only the list. Direct runs recorded here: the configuration-root guard against `scripts/launchpad.mjs` passed (no literal document root, no second root derivation), and `scripts/work-orders.mjs index --check` is current. The adjacent queue is revision 0 with no running and no next item. Follow-ups: FUP-8fb7ae17dd0fad5b (the export's own test command), FUP-06de60fa5d19fe5a (the operator identity inside byte-identical kit files), FUP-e624167a7f6555f6 (fixture data derived from this repository's records). Not reopened: WO-069-D001, WO-069-D002; WO-070-D009 stays allocated to WO-075 (D008). Release prepared as v0.70.0 (D001).

Limits: the kit carries no runtime and no harness bundle, so in a Codex session `next`, `verify`, `fix`, `final-review` and `release-close` refuse until WO-075 (asserted); the offline install was shown on this host's warm cache; no bounded comparison was run, since no two-way fork on a named axis appeared. Fixture repositories live under the system temporary root and are removed by the suite; the committed copies for criterion 6 live in the ignored session scratch; no scratch repository was created inside this worktree, so nothing was declared with `worktree material`. No branch commit or publication occurred. The two background monitors this session started (the workers' wait and the gate) have exited.

Process cost (claude-transcript-message-usage, scope dispatch, cutoff 2026-10-09T05:24:48Z): totalTokens 27,951,442; outputTokens 248,418; cachedInputTokens 27,143,731; reasoning tokens and USD unknown (counter-unavailable); subagents 3 of 20. Final counters are in the ignored session receipts.
