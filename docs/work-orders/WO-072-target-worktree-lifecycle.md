# WO-072 — Target worktree lifecycle: `worktree start` for a registered target creates the worktree from the declared base, emits the governed bundle into it, and `resume` commands run from that worktree select the order through the launchpad (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Control-plane lifecycle capability over
registered repositories. Assigned at activation under the standing opt-out
default.
**Cost:** adds the target path of `worktree start` (a worktree from the
registered base under the resolved parent, WO-049's target-worker bundle
emitted into it, the profile echoed), an ignored local registry, order
selection from a target worktree in `scripts/resume.mjs`, a no-release
close for target orders in `scripts/release.mjs`, a real-Git
launchpad-and-target fixture, and at most 500 bytes in product 07. Removes
nothing that runs today: `worktree start` creates sibling worktrees of this
repository only and `release close` has no target branch. WO-082 depends on
it. Re-mints: none; `scripts/worktree.mjs`, `scripts/resume.mjs` and
`scripts/release.mjs` are in no evidence inventory. A new helper in
`scripts/lib/git.mjs` or `scripts/lib/paths.mjs`, common registered
sources, would owe the deterministic re-mint of each edition it stales, and
an edit to `packages/skeleton/src/source-change-worktree.ts`, which the
feedback verifier judges, a live feedback episode the executor runs on
Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`; importing
WO-052's helper needs neither.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-033 phase 2 (the target worktree lifecycle),
cut into a bounded child at the operator's 2026-09-08 correction. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen: no
stop condition. Amended by the 2026-09-28 planning pass, which re-observed
the order on `main` at `5f3849ec`: the emit is WO-049's target-worker bundle
checked with `--target`, the setting it first reads waits for WO-123's
path-identity guard, the commit claim is bounded to the fixture's commits,
and the map's and the register's carry-ins are written in
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-071 merged (the registration it starts worktrees from;
closed, v0.38.0); WO-049 merged (the emit into the target worktree; closed,
v0.25.0); WO-030 merged (per-order segments; satisfied at `v0.7.0`); WO-167
merged (product 07 holds 9 bytes of headroom until the fold resets its
ceiling); WO-123 merged (the source-change guard refuses variant path
spellings before `repositories.<id>.worktreeParent` has a reader, register
row FUP-8369f2b4284e70a8). WO-052 (closed, v0.28.0) is a reference: its
worktree creation helper is reused where it fits.
**Recommended placement:** in the serial run after WO-075 and before
WO-073. This order edits `scripts/worktree.mjs`, `scripts/resume.mjs`,
`scripts/release.mjs`, two sections of product 07 and `docs/PLAYBOOK.md`.
WO-173 edits `scripts/resume.mjs` and WO-086 `scripts/release.mjs` earlier
in the sequence, and WO-073 edits `scripts/resume.mjs` and product 07 after
it. WO-052's worktree creation helper is reused where it fits; the executor
records the sharing. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "the registration it starts worktrees from"
  },
  {
    "workOrderId": "WO-049",
    "relation": "hard",
    "reason": "the emit into the target worktree"
  },
  {
    "workOrderId": "WO-030",
    "relation": "satisfied-by-release",
    "release": "v0.7.0",
    "reason": "per-order segments"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  },
  {
    "workOrderId": "WO-123",
    "relation": "hard",
    "reason": "the source-change guard refuses variant path spellings before worktreeParent has a reader (FUP-8369f2b4284e70a8)"
  },
  {
    "workOrderId": "WO-052",
    "relation": "reference-only",
    "reason": "the worktree creation helper this order reuses where it fits"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Session lifecycle &
resilience (the operator worktree projection; the tool never rebases,
force-deletes, auto-merges or discards) and §Platform and instance
boundary; 07-execution-guide.md §Where the control plane finds its
documents, §Workflow closeout and releases and §Discipline
(outside-project write grants); `scripts/worktree.mjs`, `scripts/resume.mjs`,
`scripts/release.mjs`; `scripts/harness.mjs` (the `--target` form);
`scripts/lib/config.mjs` (`findLaunchpad`; the `repositories` section);
`docs/work-orders/WO-052-source-change-host.md` (the programmatic worktree
creation); `docs/evidence/WO-071/decisions.md` D001 and D002;
`docs/evidence/WO-064/decisions.md` D001 and D004;
`docs/evidence/WO-069/decisions.md` D002;
`docs/evidence/WO-162/decisions.md` D004; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history only
(the Design bullet led "Phase 2 — target repositories are builds, not just
paths.").

**Objective:** For a registered target, `worktree start WO-NNN` creates the
worktree from the declared base under the configured parent, activates the
order, emits WO-049's target-worker bundle (the launchpad build's
permission guard, writer isolation and attribution pre-check; no role
skill) into the worktree's ignored local configuration, echoes the
repository's authority profile as a receipt and prints the same handoff as
today; a local ignored registry maps worktree paths to the launchpad and
order so `status`, `next`, `verify` and `final-review` run from the target
worktree select the order by branch through `DOTLN_LAUNCHPAD` or the
registry; every report lands in the launchpad; `release close` for a target
order records a no-release disposition, removes only the target worktree
and merged branch after containment, and creates no tag in either
repository.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- `worktree start` still builds `<main>-wo<NNN>` beside the main checkout
  from `origin/main`; target worktrees are created only programmatically,
  by the source-change host for a worker episode.
- `scripts/release.mjs` has no branch for a registered repository; the
  configuration's `release` toggles are validated and read by no script.
- `repositories.<id>.worktreeParent` is a relative POSIX path with no reader
  outside the parser, and nothing maps a registered id to a local clone.
  WO-071-D001 and D002 leave local path resolution to this order;
  WO-064-D001 and D004 reopen when it introduces that mapping.
- WO-162-D004 records that the source-change guard accepts a directory
  spelled in another letter case or through a volume alias and verifies a
  worktree's identity only after `git worktree add`, leaving a worktree and
  branch behind; the first disposition of its register row asks for the fix
  before an order gives `worktreeParent` a consumer. WO-123, earlier in the
  sequence, carries it.
- WO-049 emits only the target-worker projection into a foreign worktree:
  PreToolUse guards and the instruction block, no role skill. Its check is
  `harness check --target <worktree>`, which refuses `--out`.
- `DOTLN_LAUNCHPAD` shipped with WO-069 and product 07 documents it; the
  working directory never selects a launchpad.
- `scripts/worktree.mjs` was 350 lines at `33e2c25` and is 594 at
  `5f3849ec`, `scripts/resume.mjs` 1,033 and 2,108, `scripts/release.mjs`
  1,829 and 2,364; the executor re-measures at its base.

**Design (scope discipline):**

- The registry lives under the control local directory, ignored; no path
  enters a control event, the projection or the index.
- The registry selects the order only. The launchpad is found as WO-069
  defines it (`DOTLN_LAUNCHPAD`, else the scripts' own checkout), never from
  the working directory (WO-069-D002). A working directory the registry
  does not list selects no order: the command says so and changes nothing.
- Local path resolution is this order's (WO-071-D001, D002): the registered
  id resolves to a local clone through ignored local state, and the
  relative `worktreeParent` under a host boundary the decisions file names;
  no physical path enters a committed file. The executor records the
  disposition of WO-064-D001 and D004, which reopen on that mapping.
- The emit is WO-049's target-worker bundle (`harness emit --target
  <worktree> --runtime-root <launchpad>`), checked with `harness check
  --target`.
- Input the start path cannot read refuses before `git worktree add`,
  naming the id and the reason, and creates no worktree, branch or registry
  entry: an id with no local clone recorded, a recorded clone that is not a
  Git top level, a parent or clone spelled differently from the
  filesystem's identity for it. WO-123 lands that identity check in the
  source-change guard (FUP-8369f2b4284e70a8), which this order depends on
  because it gives `worktreeParent` its first reader; code of this order's
  own applies the same check.
- Carried in from the map's row (WO-144, 2026-09-19): a target worktree
  outside the roots the role is granted needs an operator-named absolute
  root on the executing role or an equipped support, since order contracts
  do not yet supply grants. The fixture writes under the system temporary
  root, which the default roles' grants cover.
- Carried in from register row FUP-0070 (the map's sibling workflow pilot,
  allocated to the WO-069 to WO-083 run): per-repository release policy
  stays open, as the declined alternatives record.
- **Declined alternatives, recorded:** committing DotLn files into the
  target (camouflage); a per-repository release ladder (out of scope); role
  skills in the target bundle (the compiler refuses skills in a target
  profile and an import root in a Contributor one; reopen with an order that
  gives target profiles role skills).

**Deliverables:** the lifecycle changes, the registry, a real-Git
launchpad-and-target fixture, the write-backs below.

**Acceptance criteria (all required)**

1. Over a real-Git fixture, `worktree start` for a target order creates the
   worktree from the declared base under the resolved parent, emits
   WO-049's target-worker bundle (`harness check --target` passes there),
   echoes the profile, and the fixture's commits in the target worktree,
   one of them made with `git add -A` after the emit, contain no DotLn
   control, work-order, evidence or harness file (a tree grep over those
   paths and `git status --porcelain`). The criterion is judged against the
   declared set; a case outside it is a follow-up, not a failure.
2. `status`, `next`, `verify` and `final-review` run from the target
   worktree through `DOTLN_LAUNCHPAD` and through the registry select the
   order and write reports only in the launchpad; from a directory the
   registry does not list they select no order and say so.
3. For an id with no local clone recorded, a recorded clone that is not a
   Git top level, and, on a case-insensitive volume, a parent spelled in
   another letter case, `worktree start` refuses before `git worktree add`
   and leaves no worktree, branch or registry entry; the fixture records
   the volume's case sensitivity and says so when it skips the last case.
   The criterion is judged against the declared set; a case outside it is
   a follow-up, not a failure.
4. `release close` for the target order records the no-release
   disposition, removes only the worktree and merged branch after
   containment, and creates no tag in either repository.
5. Write-backs land, each in place with no dated paragraph: 07 §Where the
   control plane finds its documents (the target worktree, the registry,
   reports in the launchpad) and §Workflow closeout and releases (the
   target no-release close), at most 500 bytes added to product 07, against
   9 bytes of headroom on 2026-09-28, which WO-167's fold resets first;
   WO-173, WO-172, WO-086, WO-123, WO-073, WO-113, WO-080, WO-077 and
   WO-078 also write product 07, so the executor re-measures the headroom
   at its base; where the bound does not fit, it consolidates the section
   it edits in the same change; a ceiling is raised only by a
   planning-document decision. `docs/PLAYBOOK.md` §The loop, per work order
   (the target loop); the decisions file, with the dispositions of
   WO-064-D001 and D004; the publication locks refreshed.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/resume.mjs` is a declared source of harness-fixtures, and again at
final review. No live row.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** publishing (WO-064, closed); integration (WO-079, closed,
shipped as `worktree integrate`); classes (WO-073); role skills in a target
worktree; the path-identity fix in the source-change guard (WO-123).

**Operator-review assumptions**

1. Target repositories receive only conventional branches; their DotLn
   state lives in the launchpad and ignored worktree state.
2. A session in a target worktree gets WO-049's target-worker bundle
   (guards and the instruction block) and no role skill; the resume
   commands run through the launchpad's scripts. Role skills in a target
   worktree would need a compiler change this order does not make.
