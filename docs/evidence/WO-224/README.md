# WO-224 — Registered Entropy Reducer subjects

## Baseline, before implementation

The `resume: next` dispatch on 2026-10-24 selects WO-224 in the `wo-224`
worktree at `5ad686d1`. `git status --short` showed existing activation,
work-order index and sibling-observation records; they are retained. The
dispatch reserves this session as the sole writer.

Source observations, before any implementation edit:

- `sed -n '350,430p' scripts/lib/entropy-review.mjs`: `freezeSubject`
  clones the launchpad with `--no-hardlinks --no-checkout`, removes `origin`,
  checks that no remote remains and detaches at the commit. It copies installed
  dependencies when present. Its scratch lane belongs to the launchpad.
- `resolveSubject(root, revision)` resolves a launchpad commit and records
  the launchpad's tracked status. `subjectRecord` carries schema, base commit,
  `repository: "."`, frozen path, tracked-status digest, inventory digest and
  count, and a hash of the commit/status/inventory fields. The existing
  launchpad hash excludes the repository field.
- `sed -n '1110,1510p' scripts/lib/entropy-review.mjs` and
  `sed -n '1510,1835p' scripts/lib/entropy-review.mjs`: review and refutation
  both freeze the launchpad. HEAD reviews refuse tracked-status and ref
  changes; named-commit reviews bind the source tree and record drift.
  Both episodes already witness refs and untracked paths.
- `cat scripts/entropy.mjs`: review accepts a launchpad revision and actor
  flags; subject accepts no selector. No repository or workstream route exists.
- Reads of `scripts/lib/target-record-reader.mjs` and
  `scripts/lib/target-worktrees.mjs` establish clone lookup in running,
  primary, then main checkout. `scripts/kit/workstream.template.md` now
  carries the settled membership block, including implicit `self`.
- Reads of `scripts/test-entropy-review.mjs`,
  `scripts/lib/target-worktree-fixture.mjs` and
  `scripts/test-target-worktree-publish.mjs` establish the fixture conventions:
  isolated system-temp Git repositories, public synthetic identities, a
  registered target with a local bare origin, and an ignored clone map.
  New entropy cases will use those registration fields with small target
  clones alongside the existing entropy fixture launchpad. The existing
  launchpad-planning export fixture will exercise the carried command.

No live reviewer is dispatched by this order. The protocol and loadout already
admit the repository id and custom lens briefs; the planned implementation
leaves both source files unchanged. Executed results and criterion judgments
will be recorded in [handoff.md](handoff.md).
