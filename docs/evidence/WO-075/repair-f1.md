# WO-075 repair of VER-001-F1

The repaired export compares each tracked build/emit input's regular-file type,
executable bit and bytes with the manifest-named commit's Git blob. It walks
package inputs on disk regardless of ignore rules, excluding package-level
generated `dist` and `node_modules` trees, and refuses additional compilable
module/configuration files or nonregular entries. Git status remains an
additional diagnostic; its index flags do not establish input equality.
Every mismatch is refused before the build and before destination creation.

The regressions exercise actual export commands from a committed synthetic
source copy. They establish that status is empty for the hidden-input case,
then assert refusal with the input named and the destination absent:

| Input variation | Result |
| --- | --- |
| Synthetic compiled source export hidden by `assume-unchanged` | Refused before any destination write |
| The same source edit hidden by `skip-worktree` | Refused before any destination write |
| Root build configuration or emit script hidden by either flag | Refused before any destination write |
| Missing tracked source hidden by `skip-worktree` | Refused before any destination write |
| Nested compilable file in an ignored source or test directory with spaces | Refused before any destination write |
| Same-byte source symlink hidden by `assume-unchanged` | Refused before any destination write |
| Individually ignored compilable source | Refused before any destination write |
| Harmless ignored `.DS_Store` | Export succeeds |
| Clean export | Runtime bytes and path set equal a rebuild of the named commit |

Executed evidence:

- The six targeted guard tests passed at 2026-10-09T14:21:27.424Z in
  6.717 s: `node scripts/harness.mjs bounded -- node --test
  --test-name-pattern='VER-001-F1|a package source that differs|the emit closure'
  scripts/test-launchpad.mjs`.
- The full review first exposed an adjacent, environment-specific fixture
  assertion: actual writer source `codex-host` versus expected `thread`.
  The isolated carried-runtime lifecycle case reproduced it at exit 1.
  The gate was explicitly stopped at 654.6 s; it recorded no passing check.
  [D016](decisions.md#wo-075-d016--adjacent-fixture-codex-writer-owner-modes)
  records its diagnosis and bounded repair. The fixed assertion accepts the
  runtime's two defined Codex owner modes and checks actor identity and liveness.
  Its isolated case then passed at 2026-10-09T14:38:57.600Z.
- The complete non-document export suite passed: 21 tests, 0 failures,
  30.484 s, finished 2026-10-09T14:39:44.796Z. Command:
  `node scripts/harness.mjs bounded -- node --test
  --test-skip-pattern='\[document\]' scripts/test-launchpad.mjs`.
  This covers the clean rebuild, manifest hashes, source omission, export-owned
  harness check, drift, relative imports, bootstrap and all guard variations.

[D015](decisions.md#wo-075-d015--repair-f1-by-checking-committed-blobs-and-actual-package-paths)
records the rule, correction of the earlier status-based provenance claim,
alternatives, bounded comparison and reopening condition. Its follow-up
FUP-5d17b4e440f612e9 is settled. The adjacent assertion is completed in the
worktree queue; the earlier status-warning deferral retains its named FUP.
The filed VER-001 report and original live-smoke/cold-start evidence are preserved.
Runtime/compiler source and emitted hooks did not change in this repair.
The existing install-sharing limit in D009 remains explicit.

The final document and product gate records are in [handoff.md](handoff.md).
