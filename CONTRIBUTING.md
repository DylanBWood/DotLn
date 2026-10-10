# Contributing to DotLn

Outside code contributions use [Apache License 2.0](LICENSE); documentation contributions use [Creative Commons Attribution 4.0 International](LICENSE-docs). Code samples in documentation are also available under Apache-2.0. The [legal decision](docs/LEGAL.md#decision--2026-09-06) defines the scope, and [NOTICE](NOTICE) records the copyright notice. Names remain reserved; contributions do not grant affiliation or endorsement.

## Origin and sign-off

By adding a sign-off, you certify the [Developer Certificate of Origin 1.1](https://developercertificate.org/): you have the right to submit the contribution under its applicable license, and you understand that the contribution and its sign-off become part of the public record. Read the certificate before signing. There is no contributor license agreement (CLA) and no separate relicensing grant.

Every outside contributor's commit must end with a `Signed-off-by` trailer matching that commit's author name and email. For example:

```text
Signed-off-by: Example Contributor <contributor@example.invalid>
```

Use `git commit -s` to add your own sign-off when creating a commit. Certify only work you are entitled to submit; a sign-off is your attestation, not a substitute for provenance review.

The operator, Dylan Wood, does not need to sign off his own commits. The exemption uses the exact public Git author identity from the commit that landed the license decision, pinned in [the contribution check](scripts/lib/contributions.mjs). The committer identity or the publisher's Git settings do not confer an exemption. The check compares raw author fields without mailmap substitution; a different author identity requires its own matching sign-off.

`worktree publish` checks every commit on the branch that is not already reachable from the local `origin/main` ref, including commits brought in by a merge. An outside commit without the author's matching trailer refuses publication before the branch push or GitHub call. Historical commits already on the base are not rechecked. This is a provenance-attestation check, not identity authentication. Enforcement belongs to the publication command; no Git hook is installed.

## Clean-room boundary

Follow [CLAUDE.md's clean-room boundary](CLAUDE.md#clean-room--locked-floor). Submit original work with its provenance. Employer code, configuration, identifiers, internal service details, credentials, and secrets must never enter this repository. Keep raw ideation local under ignored `docs/intake/`; synthesize it into the product documents under the repository's source-treatment rules. A contribution sign-off does not relax this boundary.

## Work and review

Follow the [execution guide](docs/product/07-execution-guide.md) and [operator playbook](docs/PLAYBOOK.md). A bounded work order defines the scope, one writable coding actor owns each worktree, and relevant executable evidence precedes completion claims. Update affected product facts with the change. Independent verification and final review precede publication; the operator retains merge authority.

Run `npm test` and `git diff --check` for a change. The root and every workspace declare `license: Apache-2.0` and `private: true`; `npm run license-surfaces` checks those fields, the pinned license files, and the npm publication refusals. A source license grants reuse rights; publishing packages still requires a separate project decision.

## Toolchain and tests

Run `npm ci`, then `npm test` for a change; a reviewer runs `npm test -- --review` once after the last source edit. `npm run test:docs` checks document-only changes, `npm run test:machinery` runs the machinery inventory on demand, and `npm test -- --list` explains the operator-visible behavior each suite protects. Run `npm test` normally: if the host-confinement detector reports a denied probe and a selected suite declares `needs: outside-sandbox`, the runner refuses before any suite and prints the command to run outside that confinement, and `npm test -- --confined-partial` runs the remaining suites as a partial result that is never product-gate evidence.

The workspace targets Node 26 (`.node-version` pins 26.9.0) and TypeScript 7.0.2; `npm ci` installs the native compiler for the current platform. The shell suites use macOS utilities and fail loudly elsewhere.

`npm test` runs the product and lifecycle tasks whose latest executed result at the current code identity is not a pass, composing fresh results with carried ones that name their executing row. When any task runs, the build runs first unless its ignored output is still the one the latest passing build there recorded; when every pass is carried, nothing runs; `npm test -- --again` runs them all fresh. A new worktree with the same code can read main's passing rows without writing to main. The identity includes non-ignored untracked code and is unchanged by staging; symbolic source aliases are refused because their target bytes are outside that key. `--review` runs every selected task fresh and adds the machinery suites selected by changes from the merge base; `npm run test:full` is the alias for that same selection. The skeleton suite feeds the recorded event log through the same pure reactor used by the live host and compares complete decisions and semantic projections, including a negative verifier outcome. After `npm run build`, `npm run evidence:artifact -- --check` validates the current artifact-identity edition; `-- --write` records it during authorized evidence regeneration.

History the evidence still names: the operator's Claude Code, Codex and Copilot sessions run without a host sandbox (posture recorded 2026-09-25 in [ADR-0003](docs/decisions/0003-personal-ai-harness-security.md#amendments)); the recorded check identity `npm test -- --inside-sandbox` is no longer a command flag; the former replica/cache runner and repeated exact-tree lifecycle gates are retired, and old evidence retains its original meaning; earlier evidence keeps its recorded Node version.

## Release evidence

Releases are indexed in [docs/releases/README.md](docs/releases/README.md); the first release's [notes](docs/releases/v0.2.0-notes.md) and [compatibility manifest](docs/releases/v0.2.0.md) are kept as files, and later releases are recorded in their annotated tags.
