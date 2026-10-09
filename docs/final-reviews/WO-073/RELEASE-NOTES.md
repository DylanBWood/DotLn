## Release overview

This release makes a registered repository's class a layer of policy and gives a registration three new declarations. `dotln.config.json` gains a `classes` section: each class declares the checks every member order's compiled `requiredEvidence` carries and the supports every member equips, and the host adapter applies the class before the repository's own authority profile, so repositories in one class run with the same shared equipment and evidence. A registration may declare one profile document, read by the executor on demand for the order's `Repository:` id and never at cold start, and it may declare the machine logins and link hosts of its review bots, so a bot that runs as a user account is classed as automated review and a bot comment linking a declared host is stored instead of refused. The visible changes:
- `repositoryClass` must name an entry in `classes`; a class is `{ checks, supports }`, and an unknown check, an unknown support or a widening support refuses at compile time naming the class.
- A registration's optional `profile` is a launchpad-relative path; activation refuses an order against a repository whose declared profile is absent, not a contained regular file or unreadable, naming the path, and prints one advisory when none is declared.
- A registration's optional `automationLogins` and `linkHosts` reach the pull-request observer through the target request on every route, and the direct `observe-pr` command gains a `--request` flag to load them.
- The executor's generated skill states the on-demand profile read in one sentence; `docs/repositories/README.md` states the profile convention.

The release is for the operator registering target repositories in a launchpad and for the orders that run against them; WO-083's witnessed run depends on it.

## Read before upgrading

- **Every registration must name a declared class.** The loader now refuses `repositoryClass` naming no entry in `classes`, by configuration path. A registration made before this release adds `classes: { its-class: { checks: [], supports: [] } }` and keeps its behavior byte for byte; this repository ships no configuration file, so nothing here migrates. The closed WO-111 seed generator still writes the old shape and would refuse to load if run again ([D011](../../evidence/WO-073/decisions.md#wo-073-d011), FUP-785f679912b2f36c); a tree-wide search found no other writer of that shape.
- **A class only adds.** Layers compose launchpad → class → repository by union: a class check must already be declared by the launchpad's WorkOrder, envelope or support definitions, a repository profile adds its own evidence and narrows, and no layer removes a class check. The exact registered-repository grant remains the only widening route ([D008](../../evidence/WO-073/decisions.md#wo-073-d008)).
- **A declared profile is checked, not read, at activation.** Only containment and readability are judged; content is the executor's to read on demand. A profile outside the `repositoryProfiles` root still activates when its declared path is a contained regular file.
- **Known limit: malformed `linkHosts`.** A value the observer's allowlist would refuse (a wildcard, a URL, a single-label host or a host with a port) loads and then refuses the first automation observation whole with the message `pull request observation refused: observer execution failed`, naming neither the key nor the value. Declare lowercase multi-label host names until the loader refuses the rest at load ([D010](../../evidence/WO-073/decisions.md#wo-073-d010), FUP-815e8662408881f1).
- **Declarations confer no trust.** A declared login or host changes only how an item is classed and whether its body is stored; declared hosts extend only an automation comment body's allowlist, and inline paths, thread ids and check names keep the original screen. Triage and verification judge the item as before.
- **Component versions.** Application v0.73.0 is a minor release over v0.72.0. Skeleton advances from 0.56.0 to 0.57.0 for the regenerated executor skill, with the console pin and the lockfile updated; no dependency is added.

## Substantive changes

**The class layer.** `scripts/lib/config.mjs` adds `classes` to the section list, validates each class id and its `checks` and `supports` string sets, validates `repositoryClass` against the declared classes, and adds the `repositoryProfiles` document root. `scripts/lib/authority-grants.mjs` adds `applyRepositoryClass`, which unions the class checks into the active mechanic's `requiredEvidence`, links each support not already linked into the one participating link group, and refuses with `CLASS LAYER:` and the class id for an undeclared check, an undeclared support or a widening support; `registeredRepositoryInputs` applies it before the profile, `applyRegisteredRepositoryProfile` now unions the profile's evidence into the WorkOrder, and `registeredProfileMismatches` names a class check or support the compiled program omits. The resident binder and the vertical runtime pass the class table through the mismatch reader.

**The profile.** `scripts/lib/config.mjs` validates an optional `profile` as a relative normalized POSIX path. `scripts/resume.mjs` activation, after the unknown-id refusal, refuses a declared profile that is absent, not a contained regular file or unreadable, naming the path, and prints `Advisory: repository id declares no profile` for a registration without one. `packages/skeleton/src/loadouts/contributor.ts` adds one executor sentence on the on-demand read; the regenerated skill grows by 230 bytes in both roots, within its ceiling, and `packages/skeleton/fixtures/wo073-role-baseline.json` is the chained role oracle.

**The observer declarations.** `scripts/lib/config.mjs` validates `automationLogins` and `linkHosts` as string sets defaulting to empty. `scripts/lib/target-publish.mjs` attaches both from the registration to every target request it reads; `scripts/lib/pull-request-observer.mjs` lowercases declared logins, classes a comment by a declared login as automation, and extends the host allowlist for automation comment bodies only; the review loop, the vertical primitives and `worktree observe-pr --request` carry them.

**Gate rows.** `scripts/test-authority-grants.mjs` gains the two-member class fixture with its refusals, idempotence and the positive exact-grant case; `scripts/test-configuration-root.mjs` gains the class and declaration validation subtest and the seven-kind activation subtest; `scripts/test-target-publish.mjs` gains the criterion-4 observation with the metadata that must stay refused; the process-debt oracle points at the new baseline.

## Progressive polish

Product 03 §Agent enablement skills gains the on-demand profile paragraph and product 07 §Where the control plane finds its documents the section, root, class, profile and declaration text, both in place; `docs/repositories/README.md` is new; the five fixtures that declare a registration gain an empty class declaration; the authority evidence is re-minted at `WO-073/authority/001`, the feedback edition is carried from WO-188's, and the harness bundle is regenerated; the two publication source locks were refreshed.

## Evidence and compatibility

Application `v0.73.0` is a minor release over `v0.72.0`, built from WO-073 integrated with `main` at `b06c6081`, which is also the order's base; integration changed no judged byte ([D012](../../evidence/WO-073/decisions.md#wo-073-d012)). Skeleton 0.57.0 replaces 0.56.0; no other component changes and no dependency is added.

The verification sequence:
- [VER-001](../../verifications/WO-073/VER-001.md) passed every criterion with probes that varied membership, layer order, symlinked components, a FIFO, login case and host shapes, and boarded the two follow-ups above.
- [FINAL-001](FINAL-001.md) passed at the integrated tree: the three criterion suites and the role oracle fresh under the bounded runner (31 of 31), the executor's cold start measured at 28,112 of 29,246 bytes in both skill roots with the other five roles unchanged, and the harness, publication, release-surface, document-ceiling, comment and index checks. At the unchanged code identity `acc59de0…` the executor's `npm test -- --review` row passes 37 suites and 89 fresh tasks in 1,534.5 s, and the review's `npm run test:docs` passes 32 of 32 suites in 131.5 s.

Known limitations:
- Malformed `linkHosts` values load and stop an observation with a generic message ([D010](../../evidence/WO-073/decisions.md#wo-073-d010), FUP-815e8662408881f1).
- The WO-111 seed generator writes a pre-class registration ([D011](../../evidence/WO-073/decisions.md#wo-073-d011), FUP-785f679912b2f36c).
- Coverage is one macOS host on a case-insensitive file system with Node 26; there was no live forge, and no target application's profile is authored here.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-073/decisions.md) and the [handoff](../../evidence/WO-073/handoff.md).
