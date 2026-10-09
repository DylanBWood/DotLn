# WO-074 self-review: Adversary of the acceptance criteria

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back, unknown), given only the order and the executor's diff, read-only, on 2026-10-09 before `implementation-ready`. Findings as returned, each with the executor's disposition. Counts: 16 found; 14 fixed; 2 recorded.

## F1 (major) — Criterion 4: "the fixture finds no other license file in either export"

- **Location:** scripts/test-launchpad.mjs:565 (diff line 2214, `.filter((path) => !path.startsWith("scripts/"))`); scripts/launchpad.mjs:64 and :84 (diff lines 1001 and 1021)
- **Claim:** The fixture passes this clause only because it leaves every scripts/ path out of the search. Every default export does carry a second license-named notice, scripts/kit/LICENSE-PENDING.md. Its text is false in a default export.
- **Evidence:** KIT_FILES.trees includes "scripts" and KIT_TEMPLATE_FILES includes "LICENSE-PENDING.md", so the template travels in every export. The criterion-6 export's KIT-MANIFEST.json (scratch/kit-main, named by criterion-6-local-terms.md) lists LICENSE (line 11), LICENSE-docs (line 15) and scripts/kit/LICENSE-PENDING.md (line 383). The fixture's own regex /(?:^|\/)(?:LICEN[CS]E|COPYING|NOTICE)(?:[-.][^/]*)?$/iu matches that path. The fixture comment gives the license-surfaces scripts as the only reason for the exclusion. The file says "This launchpad was exported with `--license none`. This file grants no rights ... treat the contents as all rights reserved by their authors", and in a default export it sits beside the Apache-2.0 LICENSE.
- **Proposed fix:** Rename the template to a name that is not license-shaped (for example scripts/kit/pending-notice.template.md) and keep rendering it to LICENSE-PENDING.md under --license none. Record the deviation from step 4 in decisions.md. Narrow the fixture's exclusion to scripts/license-surfaces.mjs by name, so licenseLike() judges every other exported path in both exports.
- **Disposition:** fixed: the template is scripts/kit/pending-license.template.md and the fixture excludes only scripts/license-surfaces.mjs from its search

## F2 (major) — Criterion 6 ("it prints `present` and refuses nothing") and the fixture transcript cited for criteria 1 to 5

- **Location:** docs/evidence/WO-074/criterion-6-local-terms.md; docs/evidence/WO-074/launchpad-fixture.txt; scripts/launchpad.mjs; scripts/test-launchpad.mjs
- **Claim:** The criterion 6 run and the recorded fixture transcript both checked earlier bytes of two exported kit texts. The final scripts/launchpad.mjs and scripts/test-launchpad.mjs were never exported against the operator's list, and no recorded fixture run used them.
- **Evidence:** In the run's own export (scratch/kit-main), scripts/launchpad.mjs is 26,505 bytes and scripts/test-launchpad.mjs is 23,699 bytes. In the work tree they are 27,186 and 24,306. kit-main launchpad.mjs line 52 reads "read through the launchpad's configuration"; work-tree line 61 reads "read through the kit root's configuration". The work-tree mtimes, 00:40:38 and 00:38:54 local (04:40:38Z and 04:38:54Z), are later than the record's "Observed 2026-10-09T04:38:48Z" and the transcript's 04:38:01Z. launchpad.mjs also changed after the review diff was written (diff file mtime 00:39:23; 721 lines now against 710 in the diff; the docs/README.md seed text was rewrapped).
- **Proposed fix:** After the last kit edit, rebuild the committed copy and rerun step 10 with DOTLN_LAUNCHPAD naming the main checkout. Rerun node --test scripts/test-launchpad.mjs. In criterion-6-local-terms.md, record the new copy commit and the KIT-MANIFEST sha256 of scripts/launchpad.mjs, so the run is tied to the bytes that will merge.
- **Disposition:** fixed: the committed copy was rebuilt and criterion 6 rerun after the last kit edit; criterion-6-local-terms.md records the copy commit and the manifest hash of scripts/launchpad.mjs; the fixture transcript was refreshed

## F3 (major) — Criterion 8: "`npm test -- --review` and `npm run test:docs` green; `git diff --check` clean" (also the checks in steps 8 and 12)

- **Location:** docs/evidence/WO-074/ (no handoff.md); docs/control/orders/WO-074.jsonl; decisions.md WO-074-D002 evidence item 5
- **Claim:** The diff shows only part of criterion 8. The re-mints and 'no new dependency' are shown. The two green gates, the clean whitespace check and `npm test -- --only launchpad` are not.
- **Evidence:** docs/evidence/WO-074 holds criterion-6-local-terms.md, decisions.md, edition-checks.json, launchpad-fixture.txt, meta.json and the edition directories, but no handoff.md. The control segment holds only WorkOrderActivated (04:02:01Z). D002 cites "direct run recorded in handoff.md", and that file does not exist. launchpad-fixture.txt says "the gate rows are the passing evidence", but the diff contains no gate row. Shown: edition-checks.json records all four --check runs at exit 0, and package.json adds only the launchpad script.
- **Proposed fix:** Finish step 12 once the running gate ends. Record the npm test -- --review result (with the launchpad suite row), npm run test:docs and git diff --check in handoff.md, then run implementation-ready. Until then, drop the handoff.md citation from D002.
- **Disposition:** fixed: handoff.md records the gates and the whitespace check; D002's citation now resolves

## F4 (major) — Design: "This order claims what runs without a build (criterion 1)"

- **Location:** scripts/kit/README.client.md:37-42 (diff lines 661-666)
- **Claim:** The client README claims more than criterion 1 shows, and part of the claim is false. In a Codex session, the later transitions refuse because the export has no build.
- **Evidence:** The README says: "The lifecycle commands run without a build: `activate`, `status`, `times`, `implementation-ready` and the later transitions". scripts/resume.mjs calls reserveCodexDispatch for verify (line 1376), fix (1471), final-review (1509), next while active (2050) and release-close (2066). When CODEX_THREAD_ID is set and packages/skeleton/dist/src/harness-host.js is absent, it throws "Codex writer reservation unavailable; harness runtime is not built. Run npm run build before retrying this dispatch." (line 1123), and the export cannot build. The fixture blanks CODEX_THREAD_ID (test-launchpad.mjs:48) and runs only activate, status and implementation-ready. The README's "`npm test` fails at its first import" also contradicts D007's "npm test in the export fails at the build". test-runner.mjs's static package imports (gate-deadlines.mjs, evidence-editions.mjs) are kit files, and no run of npm test inside an export is recorded.
- **Proposed fix:** Limit the sentence to activate, status and implementation-ready. State that verify, fix, final-review, next and release-close refuse under Codex until a kit revision carries the runtime. Replace "fails at its first import" with the failure point D007 records, or record a transcript of npm test inside an export.
- **Disposition:** fixed: the README names activate, status and implementation-ready as shown, states the Codex refusal of next, verify, fix, final-review and release-close, and no longer names a failing stage; the fixture asserts the refusal

## F5 (minor) — Criterion 5 (the client README sentence) and the Evidence-before-claims rule

- **Location:** scripts/kit/README.client.md:48-49 (diff lines 672-673)
- **Claim:** "records the harness, version, model, effort and source as supplied and never refuses them" is false for core's attestation code. The sentence the criterion requires is present.
- **Evidence:** parseActor refuses a claude-code attestation from a session that exports CLAUDE_EFFORT unless the source is claude-session-readback (resume.mjs:634). It also refuses claude-session-readback when CLAUDE_EFFORT disagrees (626) and refuses malformed flags. It records ultra or ultracode efforts as xhigh with mode subagents, not as supplied. The fixture blanks CLAUDE_EFFORT (test-launchpad.mjs:52), which avoids this refusal.
- **Proposed fix:** Reword the sentence to: "an unmatched version or effort is recorded as supplied with the advisory and is never refused for lacking discovery; a Claude Code session that exports CLAUDE_EFFORT attests that effort with --source claude-session-readback".
- **Disposition:** fixed: the attestation sentence now says an unmatched version or effort is recorded as supplied with the advisory and that a CLAUDE_EFFORT session attests with claude-session-readback

## F6 (minor) — Criterion 3: "a synthetic local-terms list in its ignored location ... the export holds none of them"

- **Location:** scripts/test-launchpad.mjs:524 (diff line 2173) and the criterion 3 absence loop (diff lines 2133-2145)
- **Claim:** No assertion checks that the planted list itself is absent, and the only assertion about the list's term can never fail.
- **Evidence:** The term is built as ["term","synthetic","wvut","zyx"].reverse().join("-"), which gives "zyx-wvut-synthetic-term". The regex /zyxwvut/u cannot match that hyphenated text. The absence loop covers only the seven `planted` paths and not docs/control/local/terms.txt. The needles are the markers and syntheticHash, and they detect only the evidence plant that holds the hash. The list's absence follows only indirectly: the present-status export succeeded, and terms.mjs would refuse any exported text containing the term.
- **Proposed fix:** Assert !existsSync(join(kit, "docs/control/local/terms.txt")). Assert that no exported file's sha256 equals syntheticHash. Replace /zyxwvut/u with a pattern built from the same parts, for example new RegExp(synthetic.trim()).
- **Disposition:** fixed: the fixture asserts the list is absent from the export, that no exported file hashes to the list, and matches the term's own parts

## F7 (minor) — Criterion 3: "A negative fixture plants one of each ... the export holds none of them"

- **Location:** scripts/test-launchpad.mjs:154-158 (diff lines 1802-1808)
- **Claim:** Four of the six declared plant kinds are removed by .gitignore before the exporter sees them. For those kinds the fixture tests Git's ignore rules, not the KIT_FILES allowlist.
- **Evidence:** The fixture asserts that the intake plant, settings.local.json, both Beacon plants and the runtime store are ignored. The exporter reads only blobs at HEAD. Only the .ts and evidence plants are committed. A tracked or force-added intake file, Beacon or store would rely on the allowlist alone, and the fixture never tests that.
- **Proposed fix:** Force-add the ignored plants into the fixture commit (git add -f). Every plant is then a blob at the exported commit, and the allowlist alone has to keep it out.
- **Disposition:** fixed: every plant is force-added so it is a blob at the exported commit and the allowlist alone keeps it out

## F8 (minor) — Criterion 7: "03 §Platform and instance boundary (the kit's first slice)"

- **Location:** docs/product/03-architecture.md:178-196 (diff lines 91-109); scripts/test-runner.mjs launchpad protects string (diff line 185)
- **Claim:** The write-back says the export reads "from the launchpad's HEAD commit" and seeds "one README per document root". The implementation and the decisions file contradict both statements.
- **Evidence:** The launchpad.mjs header says "Only the local-terms list is the launchpad's". D002 says the kit commit is TOOL_ROOT's HEAD. The criterion 6 run used the launchpad (main) at 28d32e26 but exported kit commit 1e0f56fd. The seeds omit docs/work-orders/README.md and docs/lineage/README.md (D003; the fixture asserts both are absent), and intake gets only .gitkeep. The suite's protects string repeats "from the launchpad's commit".
- **Proposed fix:** In product 03 and the protects string, write "from the HEAD commit of the checkout that holds the running scripts" and "one README per seeded document root". Refresh the publication locks after the 03 edit.
- **Disposition:** fixed: product 03 and the protects string say the HEAD commit of the checkout that holds the running scripts and one README per seeded document root; the publication locks were refreshed

## F9 (minor) — Criterion 5: "(a fixture attests a version the export's discovery record lacks)"

- **Location:** scripts/test-launchpad.mjs, criteria 1, 2 and 5 test (diff lines 2084-2112)
- **Claim:** The fixture tests attestation with no discovery record at all. It never tests a record that exists but lacks the attested version.
- **Evidence:** The test asserts that docs/discovery/environment.json does not exist, then attests 0.0.0-fixture. harnessEvidence returns undefined at its existsSync check (resume.mjs:483-484), so the version-matching path (recordedHarnessVersions, effortHarnessEvidence) never runs inside the export.
- **Proposed fix:** Add a case that writes docs/discovery/environment.json with effortReadbackProbe.harnesses["claude-code"].versions [{"classification":"observed","value":"9.9.9"}] and an observed effort selector. Attest 0.0.0-fixture and expect the advisory, then attest 9.9.9 and expect no advisory.
- **Disposition:** fixed: a discovery record that lacks the attested version advises and one that holds it, observed with the effort, does not

## F10 (minor) — Design local-terms rule: "with no list it reports `unavailable`, which the export prints and never counts as a pass"

- **Location:** scripts/launchpad.mjs:706 (diff line 1632)
- **Claim:** When there is no list, the summary line still says "N texts checked", which reads as a check that ran.
- **Evidence:** The CLI prints `${result.surfaces} texts checked.` whatever the status. When the list is absent, checkLocalTerms returns {status: "unavailable"} before it reads any surface (terms.mjs:15), and the export exits 0.
- **Proposed fix:** Print "N texts checked" only when the status is present. Otherwise print "no text was checked against a local-terms list" next to `local-terms list: unavailable`.
- **Disposition:** fixed: the texts-checked count prints only with status present; unavailable says no text was checked

## F11 (note) — Cost line ("at most 400 bytes in product 03") and criterion 7

- **Location:** docs/product/03-architecture.md new paragraph; decisions.md WO-074-D010
- **Claim:** The product 03 addition is more than three times the Cost line's byte bound, and no decision reconciles the two.
- **Evidence:** The new paragraph is 1,345 bytes. The Cost line still says "at most 400 bytes in product 03". Known issues say the 2026-10-07 pass "removed byte bounds". D010 cites only the 194,488-byte ceiling.
- **Proposed fix:** Add to D010 that the Known-issues correction supersedes the Cost line's 400-byte bound.
- **Disposition:** fixed: D010 records that the 2026-10-07 ceiling reset supersedes the Cost line's 400-byte bound

## F12 (note) — Criterion 2: "without any `packages/skeleton` source present"

- **Location:** scripts/test-launchpad.mjs (diff lines 2037-2041); scripts/launchpad.mjs BUILD_FREE_MODULES
- **Claim:** The criterion's literal words are met only under Execution plan step 1's reading. The export does carry packages/skeleton source modules.
- **Evidence:** The export carries six packages/skeleton/src/*.mjs modules and seeds packages/skeleton/loadouts/grants.json. The fixture asserts only that no packages/*/src/**/*.ts exists. Step 1 says "package source" in criterion 2 means TypeScript source, but criterion 2 actually says "packages/skeleton source". This is a wording gap in the order, not an executor deviation.
- **Proposed fix:** The reviewer should confirm step 1's reading. Optionally, assert that packages/skeleton holds exactly the six listed .mjs files and the grants seed.
- **Disposition:** fixed as an assertion (packages/skeleton holds exactly the six build-free modules and the grants seed); the criterion's wording gap is noted for the next amendment

## F13 (note) — Operator-review assumption 4 (LICENSE-PENDING.md grants no rights and names no license)

- **Location:** scripts/kit/LICENSE-PENDING.md (diff lines 614-622)
- **Claim:** The wording grants no rights and names no license, so the assumption is met. Its "treat the contents as all rights reserved by their authors" conflicts with an Apache-2.0 label carried in the same --license none export.
- **Evidence:** In a --license none export, packages/beacons/package.json still says "license": "Apache-2.0", which byte identity requires. The generated lockfile copies core's packages/beacons entry unchanged, also "license": "Apache-2.0" (package-lock.json:462); kitLockfile does not rewrite it.
- **Proposed fix:** The reviewer should judge the wording. One option is to replace the all-rights-reserved clause with "files that carry their own license label keep it" and keep "grants no rights".
- **Disposition:** fixed: the notice says a file that carries its own license label keeps it and that the notice adds and takes no grant

## F14 (note) — Design: "The export never includes ... this repository's evidence" (outside criterion 3's declared set, so a follow-up)

- **Location:** scripts/fixtures/wo138-local-role-qualification.json (a kit file through scripts/**)
- **Claim:** Every kit carries outcome data derived from one of this repository's verification reports.
- **Evidence:** The file holds "source": "docs/verifications/WO-052/VER-001.md" with that report's verdict, criteria counts and gateDurationSeconds "515.40".
- **Proposed fix:** Register a follow-up to decide whether scripts/fixtures data derived from this repository's records belongs in the kit.
- **Disposition:** recorded: WO-074-D011's follow-up (FUP minted at sync) on fixture data derived from this repository's records; outside criterion 3's declared set

## F15 (note) — Criterion 1: refuses a destination "that it cannot read"

- **Location:** scripts/test-launchpad.mjs:187
- **Claim:** When the suite runs as root, the unreadable-destination case is skipped without any record.
- **Evidence:** The case is guarded by `if (typeof process.getuid === "function" && process.getuid() !== 0)` and has no skip report.
- **Proposed fix:** Use the test context's skip with a reason, so a root gate shows that the case did not run.
- **Disposition:** fixed: the unreadable case is its own test, skipped with a reason under root

## F16 (note) — Execution plan step 11 (publication locks)

- **Location:** docs/publication/everyday-ai-user-toc.md and software-engineer-toc.md (diff lines 114-139)
- **Claim:** Step 11 says to write the locks into audience-status-index.md, but the locks live in the two outlines. The executor updated the correct files. This is an error in the order's wording, not an executor defect.
- **Evidence:** check-publication.mjs:506 reads `Source lock:` lines from the outlines, and audience-status-index.md contains no Source lock line.
- **Proposed fix:** None for the executor. Correct the step's wording when the order is next amended.
- **Disposition:** recorded: the order's step 11 names the wrong file for the locks; noted in D010 and the handoff for the next amendment

## Worker notes

The review diff is older than the current work tree. scripts/launchpad.mjs changed at 00:40:38, after the diff file was written at 00:39:23, and now has 721 lines against 710 in the diff. A check (prettier or test-runner) is running in this worktree, so a hook blocked shasum and `git diff --check`. I compared file sizes and one changed comment line instead, and did not judge `git diff --check` myself. To show F1 and F2 I also read the criterion 6 export at scratch/kit-main, which criterion-6-local-terms.md names as `<session-scratch>/kit-main`; that directory is outside the assigned read paths. I wrote nothing and changed nothing.

Per criterion:
- **C1:** met by the fixture. It covers the non-empty, file and unreadable refusals, byte identity against the commit UPSTREAM.md names, manifest hash verification, offline `npm ci`, and activate plus `status --json`. The recorded transcript predates the final code (F2). The `npm test` follow-up is in D007.
- **C2:** met under step 1's reading (F12).
- **C3:** met for the declared set, with weak fixture assertions (F6, F7).
- **C4:** only partly shown (F1).
- **C5:** met. The README is too broad (F5), and the fixture covers only the case with no discovery record (F9).
- **C6:** the run is recorded, but for earlier kit bytes (F2).
- **C7:** all write-backs landed. Product 03 is inaccurate in two places (F8; byte note F11). LEGAL §Current state follows that section's "**Title — date (WO).**" form, and docs/README §Map gains one line.
- **C8:** re-mints and no new dependency are shown; the gates are not (F3).

Design bullets:
- No seed is manifest-listed.
- Package source: the nine build-free modules match the .mjs set the scripts import (grep of scripts/lib, resume, terms, test-runner, harness and work-orders).
- The local-terms check runs over writes plus the manifest before the destination is created; empty or malformed lists and matches throw (terms.mjs:24 and :55).
- launchpad.mjs has no quoted `docs/` literal. test-configuration-root.mjs exempts test-*.mjs, and all document roots go through docRelative and defaultDocRelative.
- Grants.json is an unlisted seed because authority-grants.mjs needs the file.

Execution plan:
- Steps 1 to 4, 6 and 9 match.
- Step 5's check was run and refused at HEAD, which is recorded.
- Step 7: see F1, F6, F7 and F9.
- Step 8: the suite row is added; its check is not shown.
- Step 10: stale (F2).
- Step 11: see F16.
- Step 12: still pending.

Assumption 1: I read every exported text in the diff (the nine templates, the launchpad.mjs root conventions and UPSTREAM strings, test-launchpad.mjs) and grepped for gateway, managed, proxy, enterprise, internal, vendor, policy and cloud-provider names. Nothing describes a specific managed host, gateway, vendor policy or internal service. The first order's four audit topics are generic, and it tells the fork to name none.

Assumption 4: met (F13 note). The kit `package.json` keeps core's exact pins (@types/node 26.6.2, prettier 3.9.6, typescript 7.0.2) and the prepublishOnly guard. LEGAL.md's three hashes match licenseHashes.
