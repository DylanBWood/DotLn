# WO-074 self-review: Improver of design, simplicity and maintainability

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back, unknown), given only the order and the executor's diff, read-only, on 2026-10-09 before `implementation-ready`. Findings as returned, each with the executor's disposition. Counts: 21 found; 21 fixed; 0 recorded.

## F01 (major) — exported wording / fixture passes for a narrower reason than the text claims

- **Location:** scripts/kit/README.client.md:33-42 ('dispatch `resume: next`'; 'The lifecycle commands run without a build: ... and the later transitions'); scripts/test-launchpad.mjs:48 (CODEX_THREAD_ID: "")
- **Claim:** Under Codex the kit's dispatch refuses, and its suggested remedy cannot run in the kit. The client README says the lifecycle runs without a build, and its step 6 tells the reader to dispatch `resume: next`. The fixture sees neither failure because it blanks CODEX_THREAD_ID.
- **Evidence:** scripts/resume.mjs:1117-1125: when CODEX_THREAD_ID is set and packages/skeleton/dist/src/harness-host.js is absent, reserveCodexDispatch throws 'Codex writer reservation unavailable; harness runtime is not built. Run npm run build before retrying this dispatch.' It is called by verify (1376), fix (1471), final-review (1509), next (2050) and release-close (2066). The kit carries no dist. `npm run build` copies tsconfig.json and runs tsc -b over package source (scripts/build.mjs:71,112), and the kit has neither. activate, status and implementation-ready are unaffected: executor-handoff.mjs:15-24 returns a no-op when there is no runtime and no writer file.
- **Proposed fix:** In 'What runs here', say that in a Codex session (`CODEX_THREAD_ID` set) `next`, `verify`, `fix` and `final-review` refuse until a kit revision carries the runtime (WO-075), and that `npm run build` cannot run in this kit. Next to the blanked CODEX_THREAD_ID in the fixture, add a one-line comment saying the case judges a non-Codex session. Alternatively, add one assertion that `resume next` with the variable set refuses with that message.
- **Disposition:** fixed: README wording and a fixture assertion that verify refuses under CODEX_THREAD_ID with the runtime message

## F02 (major) — misleading write-back

- **Location:** docs/product/03-architecture.md:179 ('from the launchpad's HEAD commit and never its work tree'); scripts/test-runner.mjs:642 (protects: '... from the launchpad's commit ...')
- **Claim:** The product write-back and the suite's protects string both say the kit is read from the launchpad's commit. D002 decided the opposite: the kit is the HEAD of the checkout that holds the running scripts (TOOL_ROOT), and only the local-terms list belongs to the launchpad.
- **Evidence:** scripts/launchpad.mjs:700-704 calls exportKit(TOOL_ROOT, destination, { termsRoot: findLaunchpad() }). D002 rejects 'One root, findLaunchpad(), for kit files' because 'a DOTLN_LAUNCHPAD naming another repository would export that repository's HEAD as the kit'. criterion-6-local-terms.md shows the kit commit 1e0f56fd differing from the launchpad commit 28d32e26. In config.mjs:15-21 and 704-718, TOOL_ROOT and the launchpad are distinct roots. A maintainer of WO-077 or WO-078 reading product 03 would build on the rejected root.
- **Proposed fix:** In 03, replace with: 'from the HEAD commit of the checkout that holds the running scripts, never its work tree; only the local-terms list is read from the launchpad (`DOTLN_LAUNCHPAD` or the ascent)'. In the protects string, change "from the launchpad's commit" to "from the scripts' checkout's commit".
- **Disposition:** fixed: product 03 and the protects string corrected

## F03 (major) — fixture passes for the wrong reason (criterion 4)

- **Location:** scripts/test-launchpad.mjs:565 (.filter((path) => !path.startsWith("scripts/"))); scripts/kit/LICENSE-PENDING.md
- **Claim:** The criterion-4 scan skips everything under scripts/. That hides `scripts/kit/LICENSE-PENDING.md`, which every export carries as a verbatim kit file, the default Apache export included. Its first sentence, 'This launchpad was exported with `--license none`. This file grants no rights', is false there and conflicts with LICENSE.
- **Evidence:** KIT_FILES.trees includes "scripts" (launchpad.mjs:64), so every scripts/kit template is manifest-listed (D003: 'scripts/** with the templates under scripts/kit'). The fixture regex `(?:^|\/)(?:LICEN[CS]E|COPYING|NOTICE)(?:[-.][^/]*)?$`/i matches exactly two names under scripts/ (checked with ls -R): scripts/license-surfaces.mjs and scripts/kit/LICENSE-PENDING.md. Criterion 4: 'the fixture finds no other license file in either export.'
- **Proposed fix:** Rename the template to `scripts/kit/pending-license.template.md`, matching the other templates' naming. Update KIT_TEMPLATE_FILES and the template() call; the root output name LICENSE-PENDING.md stays. Narrow the fixture's exclusion from all of `scripts/` to the single path `scripts/license-surfaces.mjs`.
- **Disposition:** fixed: pending-license.template.md; the search excludes only scripts/license-surfaces.mjs

## F04 (minor) — seam WO-077 must cut through

- **Location:** scripts/launchpad.mjs:561-563 (addKit("dotln.config.example.json" ...), addKit(".gitignore" ...), addKit("README.md" ...)); scripts/kit/README.client.md:58-65
- **Claim:** Root README.md, .gitignore and dotln.config.example.json are manifest-listed, but these are paths a fork routinely edits. Their kit-owned copies are already manifest-listed under scripts/kit/, so listing the root copies adds nothing. It does mean WO-077's update refuses a fork's edited README.md or .gitignore on every update.
- **Evidence:** WO-077 step 2 replaces a kit file only when its bytes match the prior hash, and 'a refused, locally modified file keeps its prior hash in the manifest ... so the next update refuses it again'. scripts/kit/README.client.md, gitignore.template and dotln.config.example.json are kit files through the scripts/** tree.
- **Proposed fix:** Write those three root files with addSeed instead of addKit; the scripts/kit/ copies stay the upstream-refreshed source. Then update the README's 'Kit files' list, D003 and the criterion-1 unlisted-path assertion. package.json and package-lock.json stay kit files.
- **Disposition:** fixed: README.md and .gitignore are seeds; dotln.config.example.json stays a kit file (a fork copies it); D003, the README's lists and the fixture updated

## F05 (minor) — seam WO-077 / dead check

- **Location:** scripts/kit/CLAUDE.template.md:38 ('export of commit {{commit}} ({{tagLine}}) from {{remote}}'); scripts/launchpad.mjs:121-130 (render), 566-574
- **Claim:** The generated block in the seeded CLAUDE.md repeats the commit, tag and remote that UPSTREAM.md already records. After WO-077's first update that block is permanently stale. The second check in render() is effectively dead code with a misleading error message.
- **Evidence:** WO-077 steps 2 and 4: an update rewrites UPSTREAM.md and KIT-MANIFEST.json, and 'After export the fork's CLAUDE.md is an instance file, so a change-phrase action edits it only under the opt-in'. In render(), the replace callback already throws for any {{key}} without a value. The later /\{\{\w+\}\}/ test can fire only when a substituted value itself contains braces, and then reports 'placeholder left unrendered'.
- **Proposed fix:** Make the block placeholder-free: 'Kit provenance (commit, tag, remote): UPSTREAM.md; kit files and hashes: KIT-MANIFEST.json; ...'. Seed CLAUDE.md verbatim with addSeed("CLAUDE.md", template("CLAUDE.template.md")), delete render and tagLine, and change the fixture to assert that the block names UPSTREAM.md.
- **Disposition:** fixed: the CLAUDE block is placeholder-free and points at UPSTREAM.md and KIT-MANIFEST.json; render() deleted; the fixture asserts no placeholder and no commit in the block

## F06 (minor) — dead code / duplicated rule / error path

- **Location:** scripts/launchpad.mjs:358-369 (enclosingRepository), 684-685 (dirty/enclosing computed in the return after the writes)
- **Claim:** The ascent loop in enclosingRepository never runs, because its only call happens after the destination exists. The function also approximates config.mjs's launchpad rule with a Git subprocess. Both post-write probes can turn a complete export into 'error:' with exit 1.
- **Evidence:** enclosingRepository(target) runs after mkdirSync(target), so `while (!existsSync(probe))` is never entered. The exported scripts resolve their launchpad with config.mjs ascend() (stop at dotln.config.json or .git, lines ~683-718), not with `git rev-parse --show-toplevel`. An ancestor that holds dotln.config.json but no .git therefore gets no advisory. dirtyKitPaths runs `git status` after the writes; runGitPathList throws on failure.
- **Proposed fix:** Compute both before mkdirSync(target). Replace enclosingRepository with config's own rule: `const resolved = findLaunchpad({ toolRoot: target, env: {} }); const enclosing = resolved === target ? null : resolved;`. This drops a subprocess and the loop. WO-075 step 1 also needs a pre-write porcelain query of kit paths, so it can reuse the pre-write dirty query.
- **Disposition:** fixed: both probes run before the destination is created; the enclosing launchpad uses findLaunchpad's own ascent

## F07 (note) — fragile parsing

- **Location:** scripts/launchpad.mjs:378-391 (dirtyKitPaths: `.map((entry) => entry.slice(3)).filter(Boolean)`)
- **Claim:** With `--porcelain -z`, a staged rename yields two NUL fields ('R  new', 'old'). slice(3) mangles the second field and counts the rename twice. Only `.length` is ever used, so the slice is otherwise dead.
- **Evidence:** runGitPathList splits on NUL (scripts/lib/git.mjs:79-93). The CLI prints only result.dirty.length (launchpad.mjs:~708).
- **Proposed fix:** Add `--no-renames` to the status arguments, drop the map and filter, and return the count.
- **Disposition:** fixed: --no-renames and a count

## F08 (minor) — regex fragility; prefer scripts/lib helpers

- **Location:** scripts/launchpad.mjs:346-353 (originRemote), 371-374 (repositorySlug), 325-344 (describeTag spawnGit)
- **Claim:** Two ad-hoc regexes re-implement remote parsing that scripts/lib/github-repository.mjs already provides. repositorySlug turns a local-path or file:// origin into a bogus owner/repo, and originRemote writes that whole local path into the seeded CLAUDE.md and UPSTREAM.md.
- **Evidence:** `/[/:]([^/:]+\/[^/]+?)(?:\.git)?\/?$/` applied to `/home/<user>/src/DotLn` yields `src/DotLn`. The userinfo strip only covers scheme:// URLs. parseGitHubTarget (github-repository.mjs:41-82) parses both the scp and URL forms, refuses passwords, https usernames and non-owner/repo paths, and throws for local paths. The library's form for an optional Git read is runGit(root, args, { onFailure: () => null }) (scripts/lib/meta.mjs:50-55), not raw spawnGit followed by a status check.
- **Proposed fix:** Use `let target = null; try { target = parseGitHubTarget(url) } catch {}` and print target?.selector, or 'unknown'. Derive the pointer slug from it and delete both regexes. Replace the spawnGit calls in describeTag and originRemote with runGit(..., { onFailure: () => null }).
- **Disposition:** fixed: parseGitHubTarget supplies host/owner/repo or null; runGit with onFailure replaces the raw spawns; both regexes deleted

## F09 (minor) — exported wording a stranger would misread

- **Location:** scripts/launchpad.mjs:606-607 (docs/README.md seed); scripts/kit/README.client.md:71-73
- **Claim:** The seeded docs/README.md tells the reader to run `npm run lineage -- index`, but no such npm script exists. Both texts also say the work-order index is generated 'at the first executor completion', when it is actually generated at activation.
- **Evidence:** package.json has no 'lineage' script (grep is empty), and kitPackage copies core's scripts verbatim; the runner calls `node scripts/lineage.mjs index`. resume.mjs:2081-2092 calls refreshExecutorIndex after every action except status, times, usage, briefing, next and release-close, so activate is included. executor-handoff.mjs:52-63 runs it whenever package.json has a work-orders script, and the kit's does.
- **Proposed fix:** Use `node scripts/lineage.mjs index`, and say 'at the first lifecycle transition (activate)' in both places.
- **Disposition:** fixed: node scripts/lineage.mjs index; the index is generated at the first lifecycle transition (activate); the fixture asserts the index exists after activate

## F10 (minor) — exported wording

- **Location:** scripts/kit/README.client.md:18-19, 37-42
- **Claim:** The 'what runs' text overstates or contradicts the evidence. It says `npm run build` 'needs the compiled runtime', but build needs the TypeScript source and tsconfig instead. It says `npm test` 'fails at its first import', while D007's decision says it fails at the build. 'The later transitions' were never exercised. 'Nothing else' contradicts D004's six packages plus the workspace link, and `--offline` comes first even though it fails on a cold cache.
- **Evidence:** build.mjs:71 and 112 (cpSync tsconfig.json; tsc -b). D007 decision: 'npm test in the export fails at the build', while its followup says 'fails at its first import'. The fixture runs only activate, status and implementation-ready. D004: 'npm ci --offline ... (6 packages) and links @dotln/beacons'; 'a cold host runs npm ci with network'.
- **Proposed fix:** Say that `npm run build` needs the TypeScript source core keeps, and that `npm test` and `npm run harness` need its output, without naming the failing stage. Name only the exercised transitions. Write step 2 as '`npm ci` (or `npm ci --offline` with a warm cache)' and drop 'and nothing else'.
- **Disposition:** fixed: npm ci first with --offline as the warm-cache form; build needs the TypeScript source and npm test and npm run harness need its output; only the exercised transitions named

## F11 (minor) — exported wording a stranger would misread

- **Location:** scripts/kit/first-order.template.md:12 (Authority), 56-60 (Deliverables)
- **Claim:** The pre-drafted first order allows writes only under docs/discovery/ and docs/control/local/, which forbids the handoff its own lifecycle reads. Its Deliverables also leave the effort-selector keys unnamed, so criterion 2 is unreachable without reading resume.mjs.
- **Evidence:** The seeded evidence README (SEEDED_ROOTS.evidence) says handoff.md is written at implementation-ready, and the fixture writes docs/evidence/WO-001/handoff.md first. resume.mjs:482-548 counts only versions[] entries classified 'observed', plus one of sessionEffortSelector {classification, values}, persistedEffortSelector {classification, value}, effectiveEffortReadback or selectedSessionReadback. A version labeled 'documented officially', or an invented key, keeps the advisory.
- **Proposed fix:** Add `docs/evidence/WO-001/` to Authority. In Deliverables, name the four selector keys and state that only versions classified `observed` count.
- **Disposition:** fixed: docs/evidence/WO-001/ in the first order's Authority; the four selector keys and the observed classification named in its Deliverables

## F12 (minor) — fixture brittleness / dead code / misleading name

- **Location:** scripts/test-launchpad.mjs:83 (const exportKit), 136 (duplicate intake write), 203-206 (let exported set inside test 2), 526-551 (terms mutations without finally)
- **Claim:** Later tests depend on the export that test 2 creates, and test 4 mutates that shared export before criterion 3 scans it. The terms test restores terms.txt only on success, so one failed assertion makes every later export refuse on the 'attestations' term and hides the real cause. Line 136 rewrites a file the loop just wrote. The local name `exportKit` shadows the module function of the same name with a CLI subprocess runner.
- **Evidence:** Lines 131-135 already write planted.intake with `${marker("intake")}\n`. Test 4 runs git init, activate and commits in `kit` before criterion 3 runs files(kit). The dirty-tree test (lines ~608-636) already uses try/finally; the terms test does not.
- **Proposed fix:** Delete line 136. Run the default export in the top-level setup beside the source commit. Wrap the terms-list mutations in try/finally. Rename the helper to `runExport`.
- **Disposition:** fixed: the default export runs in the setup, the duplicate write is gone, the terms mutations sit in try/finally, the helper is runExport

## F13 (note) — check weaker than its criterion

- **Location:** scripts/test-launchpad.mjs:504 ("docs/workstreams/WS-"); instance list 497-511
- **Claim:** Criterion 3's instance-path check would pass a manifest that re-listed docs/workstreams/README.md or docs/repositories/README.md, which is the exact defect D003 says the refutation caught. Only criterion 1's exact unlisted-path assertion catches it.
- **Evidence:** The prefix is 'docs/workstreams/WS-' and 'docs/repositories/' is missing. D003: 'the first design manifest-listed docs/workstreams/README.md and docs/repositories/README.md'.
- **Proposed fix:** Use 'docs/workstreams/' and add 'docs/repositories/'.
- **Disposition:** fixed: docs/workstreams/ and docs/repositories/ prefixes

## F14 (minor) — write-back wording

- **Location:** docs/LEGAL.md:59-60 ('The kit package.json keeps private: true, the Apache-2.0 label and the publication guard.')
- **Claim:** The sentence is unqualified, but under --license none the generated package.json says UNLICENSED.
- **Evidence:** kitPackage sets license to UNLICENSED when license === "none", and the fixture asserts it for both package.json and package-lock.json.
- **Proposed fix:** '... the Apache-2.0 label (`UNLICENSED` under `--license none`) ...'.
- **Disposition:** fixed: LEGAL names UNLICENSED under --license none

## F15 (minor) — exported wording describes unshipped behavior

- **Location:** scripts/kit/workstream.template.md:4-12; scripts/kit/repository-profile.template.md:5; scripts/kit/CLAUDE.template.md ('Whole phrases select the control-plane dispatch')
- **Claim:** These templates describe behavior the exported scripts do not have. The workstream template says the index 'groups members' and 'refuses a differing block'. The repository-profile template says 'the role skill loads it on demand'. The contract implies the resume phrases dispatch to a role, but the kit carries no role skills.
- **Evidence:** grep finds no 'Workstream:' or 'dotln-workstream' handling in scripts/work-orders.mjs or scripts/lib. .claude/harness-manifest.json lists .claude/skills/* and .agents/skills/* as emitted surfaces, and KIT_FILES carries no .claude or .agents path. WO-073, WO-080 and WO-075 are unexecuted.
- **Proposed fix:** Rephrase those sentences as the intended behavior once WO-080 or WO-073 lands, or remove them and keep only the document shape. In the CLAUDE template, say the role skills arrive with the harness emit of a later kit revision.
- **Disposition:** fixed: the workstream and profile templates say what this kit revision's scripts do not yet read and what lands with WO-080 and WO-073; the contract says the role skills arrive with a later revision's harness emit

## F16 (note) — seam WO-075 must cut through

- **Location:** scripts/launchpad.mjs:250 (workspaces: ["packages/*"]), 295-317 (beacons special case in kitLockfile)
- **Claim:** kitLockfile special-cases packages/beacons and never visits its dependencies, while package.json declares a glob. WO-075 step 2 adds three more workspaces and their links.
- **Evidence:** WO-075 step 2: 'extend kitLockfile with packages/kernel, packages/compiler, packages/skeleton and their node_modules/@dotln/<name> links'. In visit(), resolveDependency already handles a workspace key, since lastIndexOf('/node_modules/') < 0 falls back to the root.
- **Proposed fix:** Add one KIT_WORKSPACES constant (['packages/beacons']), used both for kitPackage.workspaces and in kitLockfile: for each entry, visit the workspace and visit `node_modules/@dotln/<basename>`, then delete the special case. WO-075 becomes a one-array edit.
- **Disposition:** fixed: KIT_WORKSPACES drives the lockfile's workspace and link entries

## F17 (note) — wording / seam WO-075

- **Location:** scripts/launchpad.mjs:482 (UPSTREAM.md: 'read as Git blobs at the commit below; nothing in it was read from a work tree')
- **Claim:** The sentence is already loose, because package.json, package-lock.json and UPSTREAM.md are generated. WO-075 makes it false: the runtime is copied from a fresh build, and emitted surfaces are added after the write, while exportKit fixes the manifest and the terms surfaces before writing.
- **Evidence:** WO-075 step 1 says copyRuntime runs after atomicBuild(). Step 4 says to spawn `harness.mjs emit` after writing and list the emitted surfaces in the manifest. Here kitManifest and checkLocalTerms run before mkdirSync(target).
- **Proposed fix:** Scope the sentence: 'Verbatim kit files are Git blobs at this commit; package.json, package-lock.json and this file are generated from them.' Record in D002's reopenWhen that WO-075's post-write additions need a manifest step after emit.
- **Disposition:** fixed: UPSTREAM.md scopes the sentence to verbatim files; D002's reopenWhen names WO-075's post-write additions

## F18 (note) — name that will mislead

- **Location:** scripts/launchpad.mjs:518-525 (termsRoot parameter)
- **Claim:** `termsRoot` is the launchpad, not a terms-specific root. WO-078 step 3 adds sibling receipts written into the launchpad's evidence 'inside the manifest step of export', so this parameter will carry more than terms.
- **Evidence:** WO-078 Execution plan step 3 writes docPath(<root>, "evidence", "siblings/<id>/<stamp>.json"). config.mjs:15-18 resolves document roots from a launchpad.
- **Proposed fix:** Rename `termsRoot` to `launchpad` in exportKit, its doc comment and the CLI call.
- **Disposition:** fixed: the parameter is launchpad

## F19 (note) — duplicated helper / simpler shape

- **Location:** scripts/launchpad.mjs:119 (const sha256), 135-162 (checkDestination with existsSync plus the isSymbolicLink helper)
- **Claim:** sha256 duplicates the sha256Hex helper in scripts/lib/helpers.mjs, and checkDestination uses three calls where one lstat would do.
- **Evidence:** helpers.mjs:76 exports sha256Hex. Node's lstatSync(path, { throwIfNoEntry: false }) returns undefined for ENOENT, covers a dangling symlink, and throws EACCES up front, where today an unreadable parent surfaces only later at mkdir.
- **Proposed fix:** Import sha256Hex. Write `const stat = lstatSync(path, { throwIfNoEntry: false }); if (!stat) return path;` and delete isSymbolicLink.
- **Disposition:** fixed: sha256Hex from helpers; lstatSync with throwIfNoEntry; isSymbolicLink deleted

## F20 (note) — unneeded coupling

- **Location:** scripts/test-runner.mjs:640-643 (launchpad row; nodeTests defaults needsBuild: true at line 95)
- **Claim:** The suite reads no compiled output, and its claim is a no-build export, yet `npm test -- --only launchpad` (the order's step 8 check) builds first.
- **Evidence:** The fixture imports only ./lib/config.mjs and ./license-surfaces.mjs and runs build-free scripts. outward-lint, docs-check-fixtures and lineage-fixtures set needsBuild: false.
- **Proposed fix:** Add `needsBuild: false` to the row.
- **Disposition:** fixed: needsBuild false on the row

## F21 (note) — exported wording (operator-review assumption 4)

- **Location:** scripts/kit/LICENSE-PENDING.md:7-8 ('Upstream's own terms govern upstream's repository and are not restated here.')
- **Claim:** A stranger can read this sentence two ways: that upstream's grant reaches the verbatim copies, or that the copies carry no terms. The paragraph before it already says the file grants nothing and names no license.
- **Evidence:** The kit's scripts are byte-identical upstream files, and this notice sits in their place under --license none.
- **Proposed fix:** Delete the sentence, since the notice is complete without it, or let the reviewer settle a plainer wording.
- **Disposition:** fixed: the upstream sentence is gone; the notice states what a labeled file keeps

## Worker notes

Scope: I read the whole order (353 lines) and the whole diff (2311 lines, including the tail saved to the tool-results file). I checked claims read-only against scripts/lib/{git,config,terms,helpers,github-repository,suite-evidence,executor-handoff,lifecycle-evidence,meta}.mjs, scripts/resume.mjs, scripts/build.mjs, scripts/test-runner.mjs, scripts/test-beacon-portability.mjs, package.json, packages/beacons/package.json, .gitignore, .claude/harness-manifest.json, product 03 §Platform and instance boundary, docs/LEGAL.md headings, core WO-001, and WO-075, WO-077 and WO-078 (their execution plans, for the seams).

A product gate (scripts/test-runner.mjs) was active the whole time. The harness refused one diff command and one find command as gate-input writes, so I used only cat, sed -n, grep and ls. I wrote no files, changed no Git state and ran no tests or exports. Because I ran nothing, I did not claim which stage `npm test` fails at in the export (F10 only reports that README.client.md and D007 disagree), and I did not check the operator's global Git config (signing).

On-disk scripts/launchpad.mjs differs slightly from the diff text: the docs/README.md seed was reflowed. Line numbers cite the files on disk.

Clean-room screen of the exported templates: the four audit questions in first-order.template.md are generic, and AI-HARNESS-SECURITY.template.md names no host, gateway or policy. Nothing suspect found.

Model: claude-opus-5-5 per this session's system prompt. Effort was not read back from the host, so it is unknown.

Most important: F01-F03 mislead a maintainer or verifier (Codex dispatch versus the README's 'runs without a build', the 'launchpad's commit' wording against D002, the criterion-4 scan hiding scripts/kit/LICENSE-PENDING.md). F04 and F05 are the WO-077 seams (fork-edited README.md and .gitignore refused on every update; a stale commit in the seeded CLAUDE.md). The rest are smaller removals and wording fixes.
