# WO-073 decisions

## WO-073-D001

```json
{
  "id": "WO-073-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.73.0, the next minor above the observed release baseline v0.72.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.72.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-073-repository-class-and-profile.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-073-D002

```json
{
  "id": "WO-073-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Use the classes configuration section and repositoryProfiles document root, with registered profile paths relative to the launchpad. Apply class checks and support links in the host adapter before the registered authority profile.",
  "evidence": [
    "scripts/lib/config.mjs",
    "scripts/lib/authority-grants.mjs",
    "packages/compiler/src/compile.ts",
    "scripts/test-authority-grants.mjs",
    "docs/work-orders/WO-073-repository-class-and-profile.md"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves repositoryClass opaque and cannot meet member-order evidence or equipment criteria."
    },
    {
      "option": "A second participating compiler link group",
      "reason": "The compiler currently admits at most one; extending its existing group preserves the compiler contract and adds only the necessary slots and links."
    },
    {
      "option": "Compile class checks in verification.ts or feedback.ts",
      "reason": "The host adapter already owns registered policy; moving it would expand scope and require a live edition unnecessarily."
    }
  ],
  "reopenWhen": "A class needs check removal, multiple participating link groups, or an evidence definition outside the existing launchpad declarations."
}
```

## WO-073-D003

```json
{
  "id": "WO-073-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Keep profile content as an on-demand document convention with optional dotln-discovery content, and refuse only absent, non-contained, non-regular or unreadable declared files at activation. Revisit WO-119-D001 under its named trigger and retain the existing discovery block contract; WO-071-D001 does not reopen because class ids remain local unversioned references.",
  "evidence": [
    "docs/evidence/WO-119/decisions.md#wo-119-d001",
    "docs/evidence/WO-071/decisions.md#wo-071-d001",
    "packages/skeleton/src/discovery.ts",
    "docs/repositories/README.md",
    "scripts/test-configuration-root.mjs"
  ],
  "rejected": [
    {
      "option": "Require every registration to have a profile",
      "reason": "Breaks the explicit compatibility case for older registrations with no declaration."
    },
    {
      "option": "Load or validate profile content at cold start or activation",
      "reason": "Adds unrelated context or content gates beyond the order; activation checks readability only."
    },
    {
      "option": "Invent a versioned class reference or a discovery transport",
      "reason": "Neither is required by the local configuration and existing discovery contract."
    }
  ],
  "reopenWhen": "A class must resolve outside a pinned launchpad build, or discovery needs to consume launchpad profile bytes directly rather than its existing target-relative inputs."
}
```

## WO-073-D004

```json
{
  "id": "WO-073-D004",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Read automationLogins and linkHosts from the launchpad registration through the target request, and forward them through direct, loop and vertical observers. Only automation gets the extra body link hosts; classification never admits an item past triage or verification.",
  "evidence": [
    "scripts/lib/target-publish.mjs",
    "scripts/lib/pull-request-observer.mjs",
    "scripts/lib/review-comment-loop.mjs",
    "scripts/lib/vertical-primitives.mjs",
    "scripts/worktree.mjs",
    "scripts/test-target-publish.mjs"
  ],
  "rejected": [
    {
      "option": "Trust declared accounts or allow the declared hosts for human comments",
      "reason": "Changes the source trust or screen beyond the explicit criterion."
    },
    {
      "option": "Put host and login overrides into submitted request JSON",
      "reason": "Registration is the reviewed host input; the request keeps its closed key set and only carries resolved values."
    }
  ],
  "reopenWhen": "The forge introduces a different author identity contract or an observed target needs additional scoped link handling."
}
```

## WO-073-D005

```json
{
  "id": "WO-073-D005",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Stage application v0.73.0 and bump only the changed skeleton component from 0.56.0 to 0.57.0 for its additive generated executor profile-read instruction; update its existing console dependency pin and lockfile. Keep all packages private and all publication controls.",
  "evidence": [
    "docs/work-orders/WO-073-repository-class-and-profile.md",
    "packages/skeleton/package.json",
    "packages/console/package.json",
    "package-lock.json"
  ],
  "rejected": [
    {
      "option": "Bump unchanged components",
      "reason": "Only skeleton src changes; host configuration changes belong to the application release."
    },
    {
      "option": "Keep the skeleton component version",
      "reason": "The changed generated role contract requires a component version advance."
    }
  ],
  "reopenWhen": "Final integration changes the release baseline or another component implementation enters scope."
}
```

Goal alignment: the change carries conventions and shared equipment to registered
repositories without adding a new compiler contract or profile content gate.
The traps are authority drift (retain unions and the exact-grant floor), context
growth (one on-demand sentence, measured), and shifting work into a new live
verification episode (keep checks in the existing host adapter). The NoOp leaves
the class unused and the observer unable to recognize declared automation.

New required inputs: the registered-floor reverse checks in
`scripts/resident-bind.mjs` and `scripts/lib/vertical-runtime.mjs`, the existing
kernel authorization evidence rule for the fixture, the role baseline chain,
the evidence inventories, and the release and publication preparation scripts.
`scripts/lib/config.mjs` remains excluded from every edition inventory for the
recorded loader/registration-validation reason in `scripts/lib/evidence-sources.mjs`.

Fixture corrections: the first direct configuration run inherited the session's
Codex identity and attempted a writer reservation in an intentionally minimal
fixture. The canonical suite environment excludes that metadata; bounded direct
runs now remove only `CODEX_THREAD_ID` from their test processes. Initial new
fixtures also lacked the base resource declaration and the scripts-relative
beacon layout; those fixtures were corrected. The new positive authorization
check supplies its required repository evidence, as the kernel checks it.

## WO-073-D006

```json
{
  "id": "WO-073-D006",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Add one on-demand profile-read sentence to the generated executor skill and chain the new role oracle to WO-188. Both installed roots measure 27,882 before and 28,112 after, a 230-byte increase; all other role byte counts remain unchanged. No ceiling is breached and no budget or acceptance changes.",
  "evidence": [
    "node scripts/harness-context.mjs --check before and after",
    "packages/skeleton/fixtures/wo073-role-baseline.json",
    "packages/skeleton/src/loadouts/contributor.ts",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Embed profile contents or add a Read directive",
      "reason": "The generated role is shared across orders; the declared profile belongs to on-demand order context."
    },
    {
      "option": "Replace a historical role baseline",
      "reason": "A new chained oracle preserves prior snapshots byte for byte."
    }
  ],
  "reopenWhen": "A future reviewed rule breaches its role ceiling; follow product 07 Discipline by retaining it and recording an optimization follow-up."
}
```

## WO-073-D007

```json
{
  "id": "WO-073-D007",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Re-mint authority at WO-073/authority/001, regenerate the harness bundle, and carry the selected WO-188/feedback-001 edition into WO-073/feedback. Its live audit is WO-199/feedback-004; judged behavior is unchanged and no new live episode is owed.",
  "evidence": [
    "node scripts/authority-evidence.mjs --write --edition WO-073 --revision 001",
    "node scripts/feedback-evidence.mjs --carry docs/evidence/WO-188/feedback-001 --edition WO-073",
    "node scripts/harness.mjs emit",
    "scripts/lib/evidence-sources.mjs",
    "docs/evidence/current.json"
  ],
  "rejected": [
    {
      "option": "Reuse the prior authority/bundle identity after contributor.ts changed",
      "reason": "The generated role and its declared source pins changed."
    },
    {
      "option": "Re-run a live feedback episode",
      "reason": "The successful carry checks the unchanged judged behavior; the changed contributor text is outside that verifier subject."
    }
  ],
  "reopenWhen": "A judged behavior source changes or an edition check demonstrates a stale identity."
}
```

## WO-073-D008

```json
{
  "id": "WO-073-D008",
  "date": "2026-10-09",
  "dispatch": "resume: next; independent self-review",
  "decision": "Retain the compiler's existing support permission floor. A class equips supports that satisfy that floor; the exact registered-repository widening exception remains the existing authority-profile route, including for a member with nonempty class checks and supports.",
  "evidence": [
    "docs/work-orders/WO-073-repository-class-and-profile.md Execution plan steps 3 and 5 and non-goals",
    "packages/compiler/src/authority.ts authorityDiagnostics and applyAuthorityGrants",
    "scripts/lib/authority-grants.mjs registeredProfileGrant",
    "scripts/test-authority-grants.mjs WO-073 criterion 1 positive exact-grant fixture",
    "docs/product/07-execution-guide.md#where-the-control-plane-finds-its-documents"
  ],
  "rejected": [
    {
      "option": "Enable authority-widening support claims through a new compiler grant semantic",
      "reason": "The compiler refuses those claims before grant application even with a registry; the order retains the host adapter and allows no runtime package change beyond its skill render."
    },
    {
      "option": "Read the missing registry in the early diagnostic call as a new grant refusal",
      "reason": "That call filters only AUTHORITY WIDENING; registry admission diagnostics are ignored there and the final compiler still judges all grants."
    }
  ],
  "reopenWhen": "A registered class actually requires support allow claims beyond the active base, which needs a separately authorized compiler contract change."
}
```

## WO-073-D009

```json
{
  "id": "WO-073-D009",
  "date": "2026-10-09",
  "dispatch": "resume: next; independent self-review",
  "decision": "Fix the two confirmed review defects: identify missing repository evidence in the exact WorkOrder or envelope surface, and keep declared extra hosts limited to automation comment bodies while preserving metadata and check-name screens.",
  "evidence": [
    "docs/evidence/WO-073/self-review.md",
    "scripts/test-authority-grants.mjs WorkOrder-only evidence tampering assertion",
    "scripts/test-target-publish.mjs WO-073 criterion 4 metadata refusal fixture"
  ],
  "rejected": [
    {
      "option": "Keep the combined missing-evidence message",
      "reason": "It falsely blames the compiled floor when only the WorkOrder evidence was removed."
    },
    {
      "option": "Admit configured hosts in every automation field",
      "reason": "The order permits bot comment links and explicitly leaves other screening unchanged."
    }
  ],
  "reopenWhen": "A concrete future order grants additional metadata shapes or changes the registered evidence surfaces."
}
```

## WO-073-D010

```json
{
  "id": "WO-073-D010",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record a minor, non-blocking follow-up. The configuration loader validates linkHosts only as non-empty strings, while the source screen's host allowlist accepts only lowercase multi-label DNS host names with a non-numeric top-level label and throws a caller error otherwise. A registration declaring linkHosts such as \"*\", \"https://reviews.example\", \"localhost\" or \"reviews.example:8443\" therefore loads, and the first automation item screened refuses the whole observation with the opaque message 'pull request observation refused: observer execution failed', naming neither the key nor the value. It is not blocking: criterion 4's declared-host, undeclared-host, default and unknown-key cases all hold, and linkHosts was an unknown, refused key on main, so no behavior main had changes. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-073/verify-001-probes.json criterion 4: each malformed linkHosts value loads and the observation then refuses whole",
    "scripts/lib/config.mjs validateStringSet admits any non-empty string without control characters",
    "packages/compiler/src/source-bundle.ts allowlist: HOSTNAME test throws 'allowedHosts[i] is not a multi-label DNS host name'",
    "scripts/lib/pull-request-observer.mjs screen rethrows every non-RangeError, and observePullRequest maps it to a generic ObservationRefusal"
  ],
  "goalAlignment": {
    "traps": "Severity inflation: a malformed operator declaration is not one of criterion 4's cases, so it is recorded with its rule rather than failing the order. Rule beating: the executor's fixture declares only a valid host, so the probe varied the declared value.",
    "noOp": "Leaving it unrecorded keeps a configuration typo able to stop a whole review loop mid-run, the stop this order set out to remove, with a message that does not name its cause."
  },
  "rejected": [
    {
      "option": "Fail criterion 4 on this probe",
      "reason": "Criterion 4 judges declared and undeclared hosts, defaults and unknown keys; all hold."
    },
    {
      "option": "Repair scripts/lib/config.mjs in this verifier session",
      "reason": "The verifier judges the subject read-only."
    }
  ],
  "followup": "Registration linkHosts validation matches the observer screen: scripts/lib/config.mjs refuses at load each repositories.<id>.linkHosts entry the source-bundle host allowlist would refuse (a lowercase multi-label DNS host name with a non-numeric top-level label), naming the configuration path and index, and a regression shows \"*\", a URL, a single-label host and host:port refusing at load while a valid declared host still loads and is stored.",
  "reopenWhen": "A registration declares a linkHosts value the observer refuses, or an observation is refused with 'observer execution failed' while linkHosts is declared."
}
```

## WO-073-D011

```json
{
  "id": "WO-073-D011",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record a minor, non-blocking follow-up outside the order's criteria and declared surfaces. The closed WO-111 evidence generator docs/evidence/WO-111/seed.mjs still writes a scratch launchpad whose registration declares repositoryClass scratch with no classes section, and the loader now refuses that shape with 'repositories.scratch.repositoryClass names no declared class: scratch'. A launchpad prepared again from the generator would therefore refuse every DotLn command that loads its configuration (the WO-111 receipt scripts compare only the file's bytes with its commit). Execution plan step 2 migrated the five listed fixtures; this generator was not among them. It is not blocking: the refusal is the loader contract step 1 specifies, product 07 states the migration (an earlier registration supplies an empty class declaration), WO-111 and WO-112 are closed, and no open order or script runs the generator. The verifier leaves it unchanged.",
  "evidence": [
    "docs/evidence/WO-073/verify-001-probes.json: the seed's registration shape refuses at loadConfig",
    "docs/evidence/WO-111/seed.mjs prepare: config.repositories.scratch has repositoryClass and no classes section",
    "grep for dotln.config.json under docs/evidence: seed.mjs writes it; receipt.mjs and return-receipt.mjs in docs/evidence/WO-111 only compare its bytes with git show HEAD:dotln.config.json",
    "docs/work-orders/WO-073-repository-class-and-profile.md Execution plan steps 1 and 2"
  ],
  "goalAlignment": {
    "traps": "Treating the specified loader refusal as a regression: the defect is one unmigrated generator, not the contract. Silent loss: a rerun of closed-order evidence would fail at its first configuration read with no pointer to the migration.",
    "noOp": "Leaving it unrecorded lets the next reproduction of the WO-111 scratch launchpad fail on a class declaration nobody owns."
  },
  "rejected": [
    {
      "option": "Fail the verdict as a broken behavior of main",
      "reason": "The refusal is the order's specified configuration change with a documented migration; the generator is closed-order evidence outside the declared surfaces and on no live path."
    },
    {
      "option": "Edit the WO-111 generator in this verifier session",
      "reason": "The verifier judges read-only, and the file is another order's evidence."
    }
  ],
  "followup": "Earlier registration generators declare their class: docs/evidence/WO-111/seed.mjs adds classes: { scratch: { checks: [], supports: [] } } beside its scratch registration (or an owning order records why the generator is retired), so a launchpad prepared from it loads under the class contract.",
  "reopenWhen": "The WO-111 seed is run again, or another committed generator writing a repositoryClass without a classes section is found."
}
```

## WO-073-D012

<!-- integration refs/dotln/checkpoint/WO-073/6 -->

```json
{
  "id": "WO-073-D012",
  "date": "2026-10-09",
  "dispatch": "resume: final review; worktree integrate WO-073",
  "decision": "Integration bookkeeping only. main had not moved from the order's base b06c6081, so the fast-forward changed no file and there was no authored conflict; regeneration rewrote only the meter snapshot in docs/evidence/WO-073/meta.json and the meter block in docs/final-reviews/WO-073/PR.md. The code identity VER-001 judged and the executor's review row carries, acc59de0a031256eb8c5519429f221571382aad7d575bc3c9a8b14d33b853c34, is unchanged after integration, so every acceptance claim of VER-001 and handoff.md is carried forward with its original evidence and the passing review row at that identity composes this review's gate. No component version collides: main carries skeleton 0.56.0 and this order advances it to 0.57.0 with the console pin and lockfile, which no upstream commit consumed. The evidence editions this order minted, WO-073/authority/001 and the WO-073 feedback carry of WO-188/feedback-001, remain the selected editions, and v0.73.0 remains the next minor above the observed local baseline v0.72.0.",
  "evidence": [
    "refs/dotln/checkpoint/WO-073/6",
    "base b06c60812cf7a533d9a2286479893abe6904c4b2",
    "upstream b06c60812cf7a533d9a2286479893abe6904c4b2",
    "release preparation: WO-073 target v0.73.0 remains current. Files changed: docs/evidence/WO-073/meta.json, docs/final-reviews/WO-073/PR.md. Meter snapshot: docs/evidence/WO-073/meta.json, 4047 bytes. Tag observation: local snapshot only.",
    "npm run worktree -- integrate WO-073 --intake-backup <archive>: bases b06c6081 -> b06c6081; authored conflicts none; nine projections regenerated",
    "gateCodeIdentity before and after integration: acc59de0a031256eb8c5519429f221571382aad7d575bc3c9a8b14d33b853c34",
    "git show main:packages/skeleton/package.json: 0.56.0; this worktree: 0.57.0",
    "node scripts/harness.mjs check: 34 generated surfaces, exit 0",
    "npm run publication:check: 254 of 254 headings; both outlines CURRENT",
    "npm run release -- check-surfaces --local: every license, publish-refusal and surface row passes"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-09. Original base: `b06c60812cf7a533d9a2286479893abe6904c4b2`.
Fetched main: `b06c60812cf7a533d9a2286479893abe6904c4b2`. Checkpoint: `refs/dotln/checkpoint/WO-073/6`.
Named stash retained: `91967b9d97df2ff3e0153980783f36d3e27aac10` (WO-073 integrate 2026-10-09).
Resolved projections: none.
Release preparation: WO-073 target v0.73.0 remains current. Files changed: docs/evidence/WO-073/meta.json, docs/final-reviews/WO-073/PR.md. Meter snapshot: docs/evidence/WO-073/meta.json, 4047 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim VER-001 and handoff.md record is carried forward with its original evidence, because the integrated subject is byte-identical to the one they judged (code identity acc59de0 before and after): criterion 1 on the authority-grants fixture and the verifier's class-layering probes; criterion 2 on the 27,882 to 28,112 cold-start measurement; criterion 3 on the configuration-root activation subtest and the symlink and FIFO probes; criterion 4 on the target-publish fixture and the login and host probes; criterion 5 on the product 03 and 07 write-backs, the profile README and the refreshed locks; criterion 6 on the re-mints and the executor's review row at this identity. The reviewer re-ran the focused suites, the cold-start measurement and every printed affected check at the integrated tree (FINAL-001 §Executed checks).
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.
