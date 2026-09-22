# WO-064 decisions

## WO-064-D001 — Publish a target order only from its bound source-change receipt and an operator grant

```json
{
  "id": "WO-064-D001",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Add `worktree publish WO-NNN --target <request.json>` beside the unchanged self-publication path. The host-owned request names the operator's loadout, its compilation environment, the source-change store, the pull-request base branch and an optional verification store. The host recompiles the loadout with the host registry, requires the compiled WorkOrder id to equal WO-NNN, and binds the episode's persisted command to the writer compilation of the same loadout (D002): equal artifact identity, WorkOrder and envelope. Repository, base and branch come from the store's SourceChangeRequested and SourceChangeObserved events and the immutable receipt; the target branch must still name the observed commit and the recomputed binary diff digest must match. repo.push and pr.open must each be allowed by the effective envelope and WorkOrder, authorized by the kernel guard (persisted authority evidence, store events as revocation input) and named in both effects and operations by an admitted grant with grantedBy operator. Branch, every pushed commit message, title and body pass the WO-063 lint; unavailable local terms refuse. Only then does the host push the observed commit to refs/heads/<branch> with no tags and no upstream configuration, open the pull request through the existing gh helper, and record PullRequestOpened.",
  "evidence": [
    "docs/work-orders/WO-064-target-publish.md",
    "docs/product/02-domain-model.md §Authority grants and trusted admission",
    "docs/work-orders/WO-033-compiled-starter-export.md §Phase 2",
    "scripts/worktree.mjs publish: DCO, release notes and product gate are self-publication controls",
    "scripts/lib/authority-grants.mjs: compileRegisteredLoadout reads only host-owned registries",
    "packages/skeleton/src/source-change-host.ts: CommandPersisted carries workOrder, authorityEnvelope, authorityEvidence and artifactIdentity",
    "packages/skeleton/src/source-change-worktree.ts effect(): diff digest over git diff --binary --no-ext-diff --no-textconv --no-renames base commit",
    "WO-072 is not closed: no registry maps a registered repository id to a local clone, so today's target is the episode's Git root"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves the source-to-deliverable loop without any remote effect; WO-065 and the parity items stay blocked." },
    { "option": "Extend the self-publication branch lookup to target repositories", "reason": "Self-publication requires a launchpad worktree on wo-NNN plus launchpad release notes, DCO and product-gate records, none of which a target branch has." },
    { "option": "Trust a compiled-program JSON supplied with the request", "reason": "Grant provenance would then be request text. Recompilation admits grants only through the host registry." },
    { "option": "Accept an effective allowance with no grant", "reason": "The objective requires the allowance to come through an operator-provenance grant; a base allowance carries no provenance." },
    { "option": "Treat unavailable local terms as a pass", "reason": "WO-063 defines unavailable as not passed; an outward artifact would leave unscreened." },
    { "option": "Push the branch name with -u", "reason": "Pushing the ref name races later local commits, and -u writes upstream configuration into the target clone." }
  ],
  "reopenWhen": "WO-072 introduces a registered-id-to-clone mapping, WO-061 supplies a StoryContract, or review finds a remote effect reachable before any refusal."
}
```

The mission contribution is the first remote effect under compiled authority:
the publication step of the source-to-deliverable loop (critical-path gate H),
which WO-065 observes. Policy resistance is bounded by reusing the kernel guard,
the registry adapter and the lint instead of adding a parallel policy. Commons
cost: no dependency or agent; three real fixture episodes cost about 3.4 s
(D005). Drift to low performance is resisted because each refusal runs before
the first network call and each one has a fixture. Escalation is bounded: no merge, release,
retry loop or daemon. Success to the successful: the self-publication path is
not generalized to targets whose policy it cannot know. Shifting the burden:
the operator still authors the grant and owns merge. Rule beating is addressed
by binding the persisted episode to the writer compilation of the same loadout,
so an edited contract cannot be published as the one that produced the change. Seeking the wrong goal:
the claim is a correctly authorized pull request, not a verified change; an
absent acceptance matrix is shown as absent. Naive Interventionism would add a
new publish command family and policy language; this reuses the existing
command, helper and guard. NoOp leaves the loop unfinished.

The order was filed 2026-09-08, before 2026-09-09: this decisions file and its
generated index row discharge the ledger write-back under the executor skill.

## WO-064-D002 — The writer runs the order's loadout without its publication grants

```json
{
  "id": "WO-064-D002",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Export writerLoadout(source) from scripts/lib/target-publish.mjs: the order's loadout with every grant whose effects and operations are only repo.push and pr.open removed. The source-change host receives that loadout compiled with no grant registry, so the writer never holds a publication effect. Publish recompiles both forms from the one source: the writer form must equal the persisted command's artifact identity, WorkOrder and envelope, and the grant-bearing form supplies the operator-provenance authority. Adding the publication grant after reviewing a change is therefore allowed; changing the contract is not.",
  "evidence": [
    "packages/skeleton/src/worker-protocol.ts validateWriterRequest: every allowed effect must be a writer effect and repo.push must be denied",
    "packages/skeleton/src/artifact-identity.ts isCompilationEnvironment: exact five keys, so a registry-bearing identity is refused (D006)",
    "Executed probe 2026-09-22: a grant-bearing identity fails isArtifactIdentityV1, a grant-free one passes, and LiveReactorDriver.equip of the grant-bearing loadout records ArtifactCompilationRefused",
    "docs/evidence/WO-053/fixture.mjs: hosts pass program.workOrder and program.authorityEnvelope directly today"
  ],
  "rejected": [
    { "option": "Give the writer the grant-bearing program narrowed by a projection", "reason": "Its artifact identity carries the grant registry and the source-change host refuses it (D006); the first implementation attempt failed on exactly this." },
    { "option": "Relax validateWriterRequest to admit publication effects", "reason": "Widens the worker's authority for an effect it never exercises." },
    { "option": "Bind by contract text alone", "reason": "The writer compilation's identity also covers the envelope, the components and the environment." }
  ],
  "reopenWhen": "D006's follow-up admits registry-bearing identities (then the writer could run the grant-bearing program's narrowed projection), or a writer loadout needs a non-publication grant, which today makes the writer compilation refuse as unadmitted."
}
```

## WO-064-D003 — Generate the title from the host commit subject and the body from contract, diff and matrix

```json
{
  "id": "WO-064-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "generateTargetPullRequest is pure over artifacts. The title is the first line of the host-authored commit message persisted in the command, required to equal the observed commit's subject; the lint enforces its conventional shape. The body has three sections: the WorkOrder objective and non-goals (contract), a table of the WorkOrder acceptance criteria with the acceptance-matrix status for the observed commit or an explicit 'not independently verified' when no matrix is supplied, the host's before/after focused-test exit outcomes, and a diff summary of changed target paths with line counts and the base/head identities. Contract prose is collapsed to one physical line and Markdown-escaped. No field of the worker result envelope, no test command, no store or launchpad path and no free-text request input reaches the output.",
  "evidence": [
    "packages/kernel/src/types.ts WorkOrder fields",
    "packages/skeleton/src/verification.ts projectAcceptanceEvidenceMatrices rows: criterion x status",
    "packages/skeleton/src/source-change-host.ts: the commit message is host input written to the host message path",
    "docs/evidence/WO-053/README.md: focused-test commands contain the machine's Node path",
    "scripts/github-body.mjs assertGitHubBodyProfile: one physical line per prose paragraph"
  ],
  "rejected": [
    { "option": "Derive a conventional type from the objective", "reason": "The WorkOrder has no type field; any mapping would invent one." },
    { "option": "Require a passing acceptance matrix before publishing", "reason": "Not in the order; the pull request is a proposal the operator reviews, and the body states verification status explicitly." },
    { "option": "Include the worker's summary or the focused-test command", "reason": "The first is narrative the order excludes; the second can carry a machine path." }
  ],
  "reopenWhen": "WO-061's StoryContract provides a typed title or summary, or a target's review policy requires a different body layout."
}
```

## WO-064-D004 — Record PullRequestOpened in a host-owned publication log; the live smoke supplies its scratch grant explicitly

```json
{
  "id": "WO-064-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "PullRequestOpened is a schema-1 kernel event with payload exactly { repositoryId, number, headSha }, actor target-publish-host, the source-change workstream and command as correlation. It is appended under the store lock to <store>/publication/events.jsonl, never to the source-change host's own log, whose preflight refuses foreign actors. repositoryId is the gh selector HOST/OWNER/REPO already validated from origin; the pull-request URL is parsed for its number and discarded. A second run with the event present for the same head reports the recorded pull request, exits successfully and pushes nothing. Because the live smoke's target is a scratch path that the committed registry cannot name without a private path, the smoke compiles with an explicit operator entry passed to the same publish function; the committed registry stays empty and the CLI path is proven by fixtures over the gh stub.",
  "evidence": [
    "packages/skeleton/src/source-change-host.ts preflight: every event must carry the source-change host actor",
    "packages/skeleton/src/worker-store.ts acquire(): unrecognized entries in the store directory are ignored",
    "docs/product/02-domain-model.md: the local registry admits only host-policy entries",
    "docs/work-orders/WO-065-pull-request-state-observation.md: observePullRequest(repo, number)"
  ],
  "rejected": [
    { "option": "Append to the source-change events.jsonl", "reason": "The next source-change host preflight or finish on that store would refuse it." },
    { "option": "Add a reactor slice for PullRequestOpened", "reason": "No consumer folds it yet; a slice is runtime source with reactor-identity and edition obligations. WO-065 owns the first consumer." },
    { "option": "Record the pull-request URL", "reason": "The order admits no URL host beyond the repository id." },
    { "option": "Commit an operator grant naming a scratch path", "reason": "Publishes a private local path and a disposable grant into reviewed authority." }
  ],
  "reopenWhen": "WO-065 needs a fold over the event, WO-072 gives targets registered ids usable in the committed registry, or a crash between pull-request creation and the append is observed (today it needs manual inspection)."
}
```

## WO-064-D005

```json
{
  "id": "WO-064-D005",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Drive the publish fixtures with real SourceChangeHost episodes over the existing double transport instead of hand-built stores.",
  "question": "Is one real fixture source-change episode cheap enough (at most 3 s) to back each publish fixture, so the fixtures read the store bytes the host actually writes?",
  "alternatives": [
    "Run the real SourceChangeHost with the existing source-change-cli double for each fixture episode",
    "Hand-construct events.jsonl and the effect receipt with kernel appendEvent"
  ],
  "observation": "Three consecutive codex-double episodes from the built skeleton took 1103, 1124 and 1120 ms of host time; the whole script took 3539 ms including fixture creation and cleanup.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 95,
    "tokens": null,
    "commands": [
      "node <session-scratch>/episode-timing.mjs <worktree>"
    ],
    "source": "Measured script wall time plus preparation and this record; token allocation unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test scripts/test-target-publish.mjs"
    ],
    "summary": "Three episodes add about 3.4 s per suite run in exchange for fixtures that cannot drift from the host's store format; no saving against a prior method is claimed."
  },
  "outcome": "adopted",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "packages/skeleton/test/source-change-fixture.ts",
    "docs/evidence/WO-145/decisions.md"
  ],
  "rejected": [
    {
      "option": "Hand-built stores",
      "reason": "Cheaper by about 3 s but would test publish against a format the fixture author wrote, not the host."
    }
  ],
  "reopenWhen": "The target-publish suite becomes a measurable gate bottleneck or the host episode cost rises above 3 s."
}
```

## WO-064-D006 — Board up: a grant-bearing artifact identity is refused by the skeleton

```json
{
  "id": "WO-064-D006",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Record and do not repair here. compileLoadout keeps the whole host environment, including an optional authorityGrantRegistry, in ArtifactIdentityV1.compilationEnvironment, and the reactor recompiles from that field on equip. The skeleton's isCompilationEnvironment admits exactly five keys, so every identity compiled with a registry is refused: SourceChangeHost throws 'compiled artifact identity is invalid' and LiveReactorDriver.equip records ArtifactCompilationRefused. WO-064 avoids the path (D002). The repair is to admit the optional registry in isCompilationEnvironment, validated with normalizeAuthorityGrants, and to state the optional field in 02 section Artifact identity v1.",
  "evidence": [
    "packages/compiler/src/artifact-identity.ts deriveArtifactIdentity: compilationEnvironment is the canonical environment",
    "packages/compiler/src/types.ts CompilationEnvironment: optional host-owned authorityGrantRegistry",
    "packages/skeleton/src/artifact-identity.ts isCompilationEnvironment exact keys",
    "packages/skeleton/src/reactor.ts equip: compileArtifact(graph, pin.compilationEnvironment)",
    "docs/product/02-domain-model.md section Artifact identity v1 names five retained fields",
    "Executed probe 2026-09-22 recorded in D002"
  ],
  "rejected": [
    { "option": "Repair it in this order", "reason": "The two-line validator change edits a file pinned by the artifact-identity, verification and feedback evidence sources; a fresh feedback edition requires a live CLI verifier run, which is outside this order's bounded scripts-only change and its cost declaration." },
    { "option": "Strip the registry from the identity in the compiler", "reason": "Equip recompiles from the identity's environment; without the registry a grant-bearing loadout would then fail recompilation as unadmitted." }
  ],
  "followup": "Admit the optional authorityGrantRegistry in the skeleton's isCompilationEnvironment (validated by normalizeAuthorityGrants), add a grant-bearing equip and SourceChangeHost fixture, document the optional field in 02 section Artifact identity v1, and regenerate the pinned evidence editions. Priority: before any production dispatch of a grant-bearing loadout (WO-072 or the resident).",
  "reopenWhen": "A grant-bearing loadout must be equipped or dispatched to a source-change host."
}
```

## WO-064-D007 — Repair the integration fixture's overlay split

```json
{
  "id": "WO-064-D007",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Extend scripts/test-worktree-integration.mjs's working-tree overlay from worktree.mjs and resume.mjs to also carry the root-level peers worktree.mjs imports statically: github-body.mjs, github-repository.mjs and release-notes.mjs.",
  "evidence": [
    "First WO-064 npm test run, 2026-09-22: 25 suites passed, worktree-integration failed four cases; the fixture's worktree.mjs could not import ensureGh because its github-repository.mjs came from the committed clone",
    "scripts/test-worktree-integration.mjs: the overlay comment says a working-tree module and its peers must never split across committed copies, but only scripts/lib was carried whole",
    "node --test scripts/test-worktree-integration.mjs after the change: 6 passed, 0 failed"
  ],
  "rejected": [
    { "option": "Keep ensureGh private to worktree.mjs and duplicate it in the target publish host", "reason": "Two copies of the remote-mutation preflight would drift; the fixture defect would remain for the next export change." },
    { "option": "Overlay every root-level script", "reason": "Wider than the modules the overlaid entry points load." }
  ],
  "reopenWhen": "worktree.mjs or resume.mjs gains another static root-level import, or the fixture is generalized to derive its overlay from the import graph."
}
```

## WO-064-D008 — Verification finding: bind the acceptance matrix to the published WorkOrder

```json
{
  "id": "WO-064-D008",
  "date": "2026-09-22",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails the acceptance-body claim. Target publication selects a replayed acceptance matrix only by subjectRevision equal to the observed commit, then copies its row descriptions and statuses into the pull-request generator. The generator accepts a matrix with the same revision but criteria unrelated to the compiled WorkOrder, and can label that unrelated criterion verified in the target pull request. Do not change implementation during independent verification; return the finding for repair.",
  "evidence": [
    "scripts/lib/target-publish.mjs acceptanceMatrix: filters only by subjectRevision and forwards current[0].rows",
    "scripts/github-body.mjs generateTargetPullRequest: matrix.rows replace WorkOrder acceptanceCriteria in the table without a correspondence check",
    "packages/skeleton/src/verification.ts projectAcceptanceEvidenceMatrices: each matrix carries workstreamId, subjectRevision and rows; no WorkOrder binding is projected",
    "Verifier probe 2026-09-22: for a one-criterion WorkOrder and same-revision matrix with an unrelated verified row, generateTargetPullRequest printed the unrelated row as verified and counted one verified"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "A pull request could present an unrelated verification as acceptance evidence for the published contract." },
    { "option": "Treat a matching commit hash as a matching contract", "reason": "A revision identifies source bytes, not the criterion set supplied to a verification workstream." }
  ],
  "followup": "On resume: fix, require a replayed acceptance matrix to correspond to the current compiled WorkOrder's acceptance criteria before using its statuses; refuse before the first remote call on a mismatch or render the current criteria explicitly unverified. Add a same-head, different-criteria fixture through the target publication path and a direct generator case, then rerun the relevant gate.",
  "reopenWhen": "The repair binds matrix criteria to the current WorkOrder and an independent verifier reproduces the same-head mismatch refusal or safe unverified output."
}
```

## WO-064-D009 — Repair: a supplied acceptance matrix must carry exactly the WorkOrder's criteria, or publish refuses

```json
{
  "id": "WO-064-D009",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 finding F1",
  "decision": "Add acceptanceStatuses(criteria, rows) to scripts/github-body.mjs: a matrix speaks for a contract only when its row descriptions are exactly the contract's acceptance criteria as a multiset, and it then yields each criterion's status in contract order. The generator throws on a mismatch and renders the WorkOrder's own criteria with the matched statuses. The host's acceptanceMatrix applies the same rule to the one replayed matrix for the published head and refuses with 'the acceptance matrix for the published head does not verify this WorkOrder's acceptance criteria', after authorization and target observation and before lint and the first remote call. The absent-matrix path and its pinned body are unchanged.",
  "evidence": [
    "docs/verifications/WO-064/VER-001.md finding F1 and WO-064-D008",
    "packages/compiler/src/verification.ts compileVerificationTask: a snapshot-backed verification admits a criterion only when contract.acceptanceCriteria includes its description, and requires every contract criterion to be covered by one; description equality is the project's existing contract-to-criterion binding",
    "packages/kernel/src/types.ts WorkOrder.acceptanceCriteria is readonly string[]: the contract has no criterion ids to bind by",
    "Probe 2026-09-22 (session scratch): rewriting the verification demo's whole log to another revision fails replay with 'verification state: persisted compilation drift'; the host's VerificationHostConfigured and VerificationOpened events alone, moved to another revision, replay as an opened workstream with three incomplete rows",
    "node --test scripts/test-github-body.mjs: 16 pass, 0 fail, including VER-001's exact probe (one criterion 'Input is rejected safely', a same-head row 'Unrelated behavior works' verified), a missing criterion, an extra row, a one-character description difference, and a reordered matching matrix rendered in contract order",
    "node --test scripts/test-target-publish.mjs: 5 pass, 0 fail in 8.90 s; the new case moves the real opening event to the published head and refuses the demo's unrelated criteria before any gh call, push or publication log, then publishes a matching reordered matrix whose body lists the three WorkOrder criteria in contract order as incomplete with the count line '0 verified, 0 failed, 0 stale, 3 incomplete' and passes the outward lint",
    "Negative control executed the same day: with acceptanceStatuses returning row statuses unconditionally, exactly the two new cases fail (15/1 and 4/1); the file was restored byte-identical from a session-scratch copy"
  ],
  "rejected": [
    { "option": "Render the current criteria 'not independently verified' on a mismatch", "reason": "An operator who names a verification store asserts it verifies this order; silently dropping it hides the wrong store in an outward artifact. The existing host already refuses a store with no single matrix for the head, so refusal keeps one behavior for a store that does not speak for this publication." },
    { "option": "Render matched rows and mark the rest unverified", "reason": "A partial overlap is still a verification of a different criterion set; mixing its statuses into this contract's table restates the defect for the overlapping rows." },
    { "option": "Bind by the snapshot contract's workOrderId", "reason": "The worktree snapshot is optional on a VerificationSubject and the projected matrix does not carry it, so the check would refuse every snapshot-free matrix or need a skeleton projection change outside this order's scripts-only scope." },
    { "option": "Normalize whitespace or case before comparing", "reason": "The compiler's rule is exact equality; a looser comparison would admit a criterion the verifier was not given." },
    { "option": "Choose, among several matrices at the head, the one whose criteria match", "reason": "Widens selection beyond the finding. A store with two workstreams at the published head stays ambiguous and keeps refusing." },
    { "option": "NoOp", "reason": "A pull request could present an unrelated verification as acceptance evidence for the published contract." }
  ],
  "reopens": {
    "decisionId": "WO-064-D008",
    "observation": "The binding D008's follow-up named is implemented at both the generator and the host, and the same-head mismatch is exercised through the CLI publish path and the direct generator, each with a negative control."
  },
  "reopenWhen": "The verification projection gains a WorkOrder identity or a snapshot contract (bind by it instead), WorkOrder acceptance criteria gain ids, or a legitimate matrix for the published WorkOrder is refused because its descriptions differ from the contract text."
}
```

The mission contribution is unchanged from D001: a correctly authorized pull
request whose outward acceptance table now describes only the contract being
published. Rule beating and seeking the wrong goal were the traps F1 exposed; a
revision match satisfied the letter of "a matrix for this head" without the
matrix speaking for this contract. The repair reuses the compiler's own
description-coverage rule at the existing generator and host seam, so policy
resistance meets no second policy. Commons cost: no dependency, agent or
runtime change; one more fixture episode and one demo run add about 2.5 s to
the suite. Drift is resisted by the negative control. Escalation: no retry, no
new command. Success to the successful: the absent-matrix path is untouched.
Shifting the burden: the operator still chooses whether to supply a store and
now learns immediately when it is the wrong one. Naive Interventionism would add
a verification-to-WorkOrder identity to the skeleton projection; that is the
reopening condition, not this repair. NoOp leaves the outward claim false.
Economy: D005 is this order's one experiment decision, so no second experiment
was started for the repair.

## WO-064-D010 — Board up: the publish push runs the target repository's Git hooks with the operator's credentials

```json
{
  "id": "WO-064-D010",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Record and do not repair in review. publishTargetOrder pushes with `git -C <repo> push --no-follow-tags origin <commit>:refs/heads/<branch>` from the target's Git root with no hook override, so Git runs any `pre-push` (and `reference-transaction`) hook in the target's common Git directory, in the operator's process, with the operator's Git and gh credentials, after every refusal has passed. No host step between the writer's exit and this push executes a target hook, so publish is the first host-privileged step to do so. Whether a target writer can create such a hook is not established: the writer runs `git commit` in a linked worktree whose objects and refs live in that same common directory, and the product records that neither native sandbox confined a sibling write, but no probe has written the common directory's hooks or config from a sandboxed writer. WO-064's five criteria do not cover this, and every refusal still precedes the push, so the order passes; the gap is carried as a follow-up rather than patched by the reviewer, because suppressing hooks also skips a target's legitimate operator-installed pre-push checks, a policy choice no verifier has judged.",
  "evidence": [
    "scripts/lib/target-publish.mjs publishTargetOrder: git(repo, [\"push\", \"--no-follow-tags\", \"origin\", `${commit}:refs/heads/${branch}`]) with neither `-c core.hooksPath=` nor `--no-verify`",
    "Reviewer probe 2026-09-22 in the DotLn session scratch: a repository with a linked worktree on fix/x and an executable `pre-push` in the main repository's `.git/hooks`; `git -C repo push --no-follow-tags origin <sha>:refs/heads/fix/x` exited 0 and the hook ran (marker written); the same push with `-c core.hooksPath=/dev/null` exited 0 and the hook did not run",
    "packages/skeleton/src/source-change-command.ts: the admitted writer command is `git commit -F <messagePath>`, run by the writer inside the linked worktree, so the writer's process writes the target's common Git directory",
    "packages/skeleton/src/source-change-worktree.ts effect() and finish(): post-exit checks cover the worktree diff's surfaces, dirtiness and ignored residue, not the common directory's hooks or config; the host's own later Git calls (rev-parse, merge-base, diff, rev-list, log, status, ls-files) run no hook",
    "docs/product/03-architecture.md: 'The sandbox is not the containment boundary: C-W6 and X-W6 observed sibling writes'; WO-136's matrix observed a sandbox-off Claude script writing outside the worktree and did not establish sandbox-on confinement",
    "packages/skeleton/src/verification-demo.ts and worker-demo.ts already run host Git with `core.hooksPath=/dev/null`, the project's existing idiom for host Git in a worker-touched repository"
  ],
  "rejected": [
    { "option": "Fail the order and route a repair", "reason": "No acceptance criterion or stated claim is false: the grant, lint and binding refusals all precede the push, and the order claims no containment against a compromised target repository. The exposure is conditional on a writer capability that is recorded as possible but not observed for this path." },
    { "option": "Add `-c core.hooksPath=/dev/null` to the push during review", "reason": "It also disables a target's legitimate pre-push checks, a behavior change no verification judged; the reviewer would be the only judge of its own source edit." },
    { "option": "NoOp without a record", "reason": "The first remote effect under compiled authority would silently run code the writer may have placed, with credentials wider than the repo.push and pr.open the grant names." }
  ],
  "followup": "Establish by probe whether a sandboxed target writer (Claude and Codex writer profiles) can create or change files in the target's common Git directory outside its worktree, specifically hooks and config. Until that is disproved, make target publication run its push with hooks disabled or refuse when the hooks directory, core.hooksPath or other hook-relevant configuration differs from a host snapshot taken before the writer ran, and add a fixture that plants a pre-push hook in the target and observes that it does not run. Priority: before the first target publication of a model-written episode.",
  "reopenWhen": "A probe shows neither writer profile can write the target's common Git directory, a containment mode confines writer sibling writes, or a target's operator requires its pre-push hook to run during publication."
}
```

The mission contribution is keeping the first remote effect under compiled
authority bounded to the effect the grant names. Rule beating is the trap: the
grant, lint and binding checks are all satisfied while code the grant never
names runs with the operator's wider credentials. Seeking the wrong goal would be
treating "every refusal precedes the first remote call" as containment; it is
ordering only. Naive Interventionism would patch the push in review and silently
change a target's hook policy; NoOp would leave the path unrecorded. Shifting the
burden is bounded by naming the probe and the fixture the next owner needs.

## WO-064-D011 — The deferred adjacent item still targets prose instead of its public follow-up

```json
{
  "id": "WO-064-D011",
  "date": "2026-09-22",
  "dispatch": "resume: final review; the adjacent-queue advisory carried on ImplementationReady and RepairCompleted",
  "decision": "Leave WO-064 adjacent-0001 disposed as deferred with its prose target and carry the advisory forward rather than retarget it at final review. Its public follow-up already exists as FUP-a829a8799711b2ea, keyed to WO-064-D006; only the link from the queue item is missing, and the queue refuses mutation outside the executor and fixer phases.",
  "evidence": [
    "docs/control/orders/WO-064.jsonl: ImplementationReady and RepairCompleted each carry the advisory 'Planning follow-ups: adjacent-0001: deferred work needs a current public FUP identifier as its target'",
    "npm run adjacent -- list, 2026-09-22: adjacent-0001 is deferred with target 'WO-064-D006 follow-up: admit registry-bearing identities before any production dispatch of a grant-bearing loadout (WO-072 or the resident)'",
    "docs/planning/followups.json: FUP-a829a8799711b2ea is keyed to decision:docs/evidence/WO-064/decisions.md#wo-064-d006",
    "scripts/adjacent-work.mjs main(): `apply --file` throws 'adjacent queue: mutation requires the selected executor/fixer phase' unless the phase is active or repairing; the canonical phase is final-review",
    "docs/evidence/WO-152/decisions.md WO-152-D011 recorded the same advisory with the literal target `planning` and named its reopening condition as a later order repeating it"
  ],
  "rejected": [
    { "option": "Retarget the item from this phase", "reason": "The queue refuses it, and repeating a recorded transition to re-enter the executor phase is not available to any role." },
    { "option": "Fail the order on it", "reason": "It is a queue link, not a defect in the delivered work; the item's substance is D006 and its public follow-up row already exists." }
  ],
  "followup": "The advisory has now recurred in a second order (WO-152, WO-064) because the executor disposes a deferred adjacent item before `plan followups --sync` has minted the decision's public identifier. Planning: either let the executor sync follow-ups before disposing, or admit a reviewer-phase retarget that changes only a deferred item's target to an existing FUP identifier. Until then, the next executor to reach the active phase re-disposes WO-064 adjacent-0001 onto FUP-a829a8799711b2ea. Priority: low.",
  "reopenWhen": "The adjacent queue's target check becomes blocking, the queue admits a reviewer-phase retarget, or a third order repeats the advisory."
}
```

## WO-064-D012 — Repair two defects already on main that the review gate selected, at the operator's direction

```json
{
  "id": "WO-064-D012",
  "date": "2026-09-22",
  "dispatch": "resume: final review; operator selected 'Fix both here' when asked how to proceed after the review gate failed",
  "decision": "Repair, in this review and as a commit separate from WO-064's own change, the two configuration-root cases that fail on main independently of WO-064. First, reword a JSDoc sentence in scripts/lib/entropy-review.mjs that named the planning root as a backtick path literal, which the no-literal-root guard counts; the code already resolves the root through config.mjs, so only the comment changes. Second, pin the committer date of the planning-scope fixture's introduction commit in scripts/test-configuration-root.mjs to 2026-09-21T12:00:00+00:00, the day its ledger heading names. planningPassScope admits only passes dated on or after the introduction commit's date, so the hard-coded heading has failed on every day after 2026-09-21. WO-064 changes neither file, and neither failure affects any WO-064 criterion. The suite runs under --review only because WO-064 edits scripts/worktree.mjs, one of its declared sources.",
  "evidence": [
    "Reviewer gate `npm test -- --review`, 2026-09-22T19:18:40Z: 27 passed, 1 failed (configuration-root), 72 fresh tasks, 284.24 s; the two failing cases were 'no control-plane script keeps a literal document root or a second root derivation' (offence: the backticked planning-root path in scripts/lib/entropy-review.mjs) and 'configured lineage and planning consumers use the launchpad ledger' (0 !== 1 at scripts/test-configuration-root.mjs:447)",
    "The same two cases fail against `git archive HEAD` (15fa8a79, no WO-064 bytes) extracted in session scratch and run with `node --test scripts/test-configuration-root.mjs`: 10 pass, 3 fail (the two cases plus their parent)",
    "git log -S: the backticked literal entered scripts/lib/entropy-review.mjs in 789d687f (2026-09-22); the dated fixture heading entered scripts/test-configuration-root.mjs in 7315f7b9 (2026-09-21)",
    "scripts/lib/plan-receipts.mjs planningPassScope: filters passes by `date >= at.slice(0, 10)`, where `at` is the %cI date of the first-parent commit that introduced scripts/refute-plan.mjs",
    "scripts/test-runner.mjs: configuration-root is a machinery suite whose declared sources include scripts/worktree.mjs; executor and verifier ran plain `npm test`, which does not select it",
    "After the edits: `node --test scripts/test-configuration-root.mjs` 13 pass, 0 fail; `prettier --check` clean on both files"
  ],
  "rejected": [
    { "option": "Hold WO-064 until a separate change repairs main", "reason": "Offered to the operator; not selected. It would leave the two defects failing every gate that selects this suite." },
    { "option": "Fail WO-064 to repair", "reason": "Offered to the operator; not selected. The defects are not WO-064's, and routing them through its repair costs a full verification cycle." },
    { "option": "Record the pass on a plain `npm test` row instead", "reason": "That is rule beating: --review selects this suite because WO-064 changed one of its declared sources, and release requires the reviewer's passing row." },
    { "option": "Derive the fixture heading from the wall-clock date", "reason": "The UTC and local dates can straddle midnight against the committer's zone; pinning the committer date is deterministic." },
    { "option": "Exempt comments from the literal-root guard", "reason": "It widens a shared guard to fix one sentence; rewording keeps the guard as strict as it was." }
  ],
  "reopenWhen": "The configuration-root suite fails again on a comment or a dated fixture, or planningPassScope stops dating enforcement from the introduction commit."
}
```

The mission contribution is a truthful green reviewer gate at the code that will
be released. The traps are rule beating (substituting a narrower gate) and drift
to low performance (normalizing a machinery suite that fails every day). Naive
Interventionism was bounded to one comment sentence and one fixture commit's
environment, with no change to the guard or to planningPassScope. The reviewer
is the only judge of these two edits, which is disclosed here and in the report.
