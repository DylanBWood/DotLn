# WO-065 decisions

## WO-065-D001

```json
{
  "id": "WO-065-D001",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the existing target-publish fixture harness; decline a second harness experiment after reading its fake gh and isolated temporary scenario support.",
  "question": "Can the existing fake-gh harness cover the observer without a second harness?",
  "alternatives": [
    "Extend the existing fake gh with recorded GraphQL response replay",
    "Build a separate observer harness"
  ],
  "observation": "scripts/test-target-publish.mjs already supplies a fake gh, isolated temporary storage and CLI subprocess checks. A lightweight observation scenario can reuse its bin without rerunning source-change publication for every decoder case. No comparative runtime experiment was run.",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "declined",
  "reason": "Reading established the existing harness supplies the needed boundaries; measuring a duplicate would require unnecessary implementation.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": [
      "Read scripts/test-target-publish.mjs and scripts/lib/target-publish.mjs"
    ],
    "source": "No trial execution; source-inspection preparation was not separately timed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test scripts/test-target-publish.mjs"
    ],
    "summary": "Reuse existing fixture infrastructure; no measured saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reopenWhen": "Observer fixture preparation becomes materially slower than its assertions.",
  "evidence": [
    "scripts/test-target-publish.mjs existing shared fake gh and per-scenario temporary directories"
  ],
  "rejected": [
    {
      "option": "Second fixture harness",
      "reason": "Duplicates the existing gh process boundary and temporary storage support."
    }
  ]
}
```

## WO-065-D002

```json
{
  "id": "WO-065-D002",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Add a script-side observer using executeGh and the publication WorkerStore lock, with positive GraphQL decoding and per-connection pagination. Append only after every read and screen succeeds, and compare normalized state to the latest matching observation. Keep source-change execution and publication unchanged.",
  "evidence": [
    "WO-065 objective, design and criteria",
    "scripts/lib/target-publish.mjs publishes PullRequestOpened with actor target-publish-host and source command correlation",
    "packages/skeleton/src/worker-store.ts provides acquire/read/append/release; generic event decoding does not validate domain payloads",
    "GitHub CLI manual https://cli.github.com/manual/gh_api (Context7 /websites/cli_github_manual, read 2026-09-29)",
    "GitHub GraphQL references https://docs.github.com/en/graphql/reference/pulls and https://docs.github.com/en/graphql/reference/checks (read 2026-09-29)"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Observe the published deliverable so WO-066 can classify and resolve review work and WO-123 can compose the source-to-deliverable loop.",
    "traps": {
      "policyResistance": "Use the publisher's identity and store lock, and WO-060's screen, avoiding competing authority and privacy rules.",
      "tragedyOfTheCommons": "One on-demand invocation, one read-only review agent with no descendants; pagination costs depend on actual remote state.",
      "driftToLowPerformance": "Fail unreadable data with a fixed field path and append nothing; no partial success.",
      "escalation": "No polling or additional gate.",
      "successToTheSuccessful": "Reuse the harness because it already exercises the gh process boundary; a package adapter was considered and declined because its consumer and writer are script-side.",
      "shiftingTheBurden": "Typed normalized events remove repeated manual retrieval; errors identify the unreadable field without exposing its contents.",
      "ruleBeating": "Fixtures cross the CLI boundary and inspect persisted bytes, including omitted sensitive text and latest-state dedup. Live smoke exercises the real API.",
      "seekingTheWrongGoal": "The event is the deliverable downstream consumers need; fixture volume and process receipts are not the outcome."
    },
    "naiveInterventionism": "Preserve the existing publisher and source log. The new command only reads GitHub; the local append is serialized. Smallest probe is recorded JSON through fake gh before the authorized scratch smoke.",
    "noOp": "Leaves the post-PR loop blind despite a published deliverable; rejected because the prerequisite and declared screen are available."
  },
  "rejected": [
    {
      "option": "Independent poller",
      "reason": "WO-123 owns composition and cadence."
    },
    {
      "option": "Write to the pull request",
      "reason": "Observation has no remote mutation; WO-066 owns disposition."
    },
    {
      "option": "Observer in packages/skeleton/src",
      "reason": "The gh helper and publisher are script-side; no package consumer requires in-process observation."
    },
    {
      "option": "Keep refused body hashes or raw responses",
      "reason": "The order forbids retaining refused text in any form."
    }
  ],
  "reopenWhen": "A package consumer needs observation, pagination produces inconsistent remote state, or the declared screen misses a real credential."
}
```

## WO-065-D003

```json
{
  "id": "WO-065-D003",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Read head identity, status-check rollup, review threads and their comments, conversation comments and submitted review bodies. Classify GraphQL Bot actors as automation; explicitly decode User, Mannequin, Organization and EnterpriseUserAccount as non-bots. The PR author is reporter only when both actor type and case-folded login match; remaining/deleted authors are reviewer. Missing or unknown types refuse at author.__typename. This corrects the original unsupported [bot] suffix rule (VER-001 F1, D009, D011). Resolved threads take class resolved; other Bot comments automated-review and other comments human-review. Failed check states FAILURE, ERROR, TIMED_OUT, STARTUP_FAILURE and ACTION_REQUIRED produce synthetic automation comments with class ci-failure, id ci:<check-node-id>, and screened text equal to the check name; check rows retain name and exact observed status/conclusion. CANCELLED and STALE remain check states without asserting a code failure.",
  "evidence": [
    "WO-065 payload fixes checks to name/state and permits class only on comments; ci-failure therefore requires a comment-shaped observation",
    "GitHub GraphQL Checks reference CheckRun status/conclusion enums",
    "WO-060 decodeSourceBundle, SOURCE_SECRET_SHAPES and SOURCE_URL_FORMS"
  ],
  "rejected": [
    {
      "option": "Infer automation from arbitrary account names or comment text",
      "reason": "Unbounded heuristic; use the positively decoded actor type instead."
    },
    {
      "option": "Read only the first page or pr view reviews",
      "reason": "Would silently lose comments or resolution state."
    }
  ],
  "reopenWhen": "GitHub adds an Actor type or WO-066 needs a different explicit classification."
}
```

## WO-065-D004

```json
{
  "id": "WO-065-D004",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Run the live smoke in the operator-named personal scratch repository, preferring its existing PR and retained publication record. Store only a shape-reduced smoke receipt.",
  "evidence": [
    "Operator reply during resume: next: you can use an existing PR here or create a new one; supplied public scratch repository",
    "WO-065 criterion 4 and WO-064 smoke.json"
  ],
  "rejected": [
    {
      "option": "Leave criterion 4 unmet without attempting the authorized smoke",
      "reason": "Operator supplied authority and target during this dispatch."
    }
  ],
  "reopenWhen": "The original publication store is unavailable or the API cannot be read."
}
```

## WO-065-D005

```json
{
  "id": "WO-065-D005",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Review corrections: request and decode inline comment state on both pagination paths and omit pending drafts. Request one initial comment per thread, page the rest independently, and give only the observer's gh calls a 16 MiB response buffer. Node IDs are opaque nonempty strings screened as metadata, with no invented encoding or length grammar. A one-entry body bundle uses the fixed entryId comment, whose span is a UTF-8 byte range within that body's transient bundle. D012 corrects the original whole-observation refusal choice: decoded strings refused by the screen produce per-item field-path refusals, without rejected content or hashes. Safe metadata is retained, refused ids use local placeholders, and a malformed string uses malformed-text without a span. Structural decode errors still refuse the whole observation. No raw gh error or partial GraphQL response is logged.",
  "evidence": [
    "Read-only observer_review agent review found pending inline comments, nested response amplification and an unsupported node-id grammar; its follow-up found all three addressed",
    "scripts/test-target-publish.mjs: pending draft omission, deleted author, null line, opaque node ID and >1 MiB page fixtures",
    "https://docs.github.com/en/graphql/reference/pulls#pullrequestreviewcommentstate",
    "https://docs.github.com/en/graphql/guides/migrating-graphql-global-node-ids",
    "scripts/lib/github-repository.mjs optional maxBuffer leaves existing callers at their existing default"
  ],
  "rejected": [
    { "option": "100 bodies on every one of 100 initial threads", "reason": "Amplifies a single response and hits the process buffer before the caller can paginate." },
    { "option": "Unlimited response buffering", "reason": "A malformed or oversized upstream response should refuse; 16 MiB is an explicit transport bound, not a completeness claim for arbitrarily large responses." },
    { "option": "Store every privacy finding", "reason": "The fixed payload allows one refused shape/span; the first deterministic finding establishes refusal without storing any body content." }
  ],
  "reopenWhen": "A real valid page exceeds 16 MiB, a consumer needs all screen findings, or a new API state is returned."
}
```

## WO-065-D006

```json
{
  "id": "WO-065-D006",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "The original scratch PR was open but its local publication store was not found in the known source-fixture temporary locations or the main checkout. Under the operator's existing authorization, create a fresh synthetic source-change episode and publish its new branch through target-publish-host in the named scratch repository. Run the observer on that real publication, then run the CLI again and independently compare gh pr view. Keep the episode and scratch locator for inspection; commit only shapes. The smoke passed with zero checks/comments, so classification and screening claims come from fixtures.",
  "evidence": [
    "Operator authorized an existing PR or a new PR in the supplied scratch repository, then reiterated: Create a fresh scratch PR if needed",
    "docs/evidence/WO-065/smoke.json: one correlated observation, same head/number as independent view, zero events from second observation",
    "docs/evidence/WO-065/smoke.mjs: reproducible read-only smoke command",
    "Session scratch create-smoke.mjs reuses the WO-064 loadout fixture and SourceChangeHost double, fetches scratch main as its base, publishes a new branch and retains live-store.json; no model worker is invoked"
  ],
  "correction": "I unnecessarily asked for the retained store path and repeated a choice after the operator had already authorized creating a scratch PR. The operator clarified that the repository is scratch and asked me to stop assigning work there. I proceeded under the existing authorization and performed the full smoke myself.",
  "rejected": [
    { "option": "Manufacture a PullRequestOpened event for the earlier PR", "reason": "Would replace actual publisher evidence with an invented effect record." },
    { "option": "Keep requesting operator work", "reason": "The supplied authorization already covered the concrete next step." }
  ],
  "reopenWhen": "A later smoke needs populated checks or live review comments beyond the deterministic fixture evidence."
}
```

## WO-065-D007

```json
{
  "id": "WO-065-D007",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.55.0 as the next minor above observed local v0.54.0. No component package changes: all runtime additions are script-side and no dependency or package metadata changes. Product 02 gains 408 UTF-8 bytes against its 450-byte order bound; the base is 147835 bytes with 2776 bytes of headroom, leaving 2368 bytes. Refresh both publication source locks. No evidence edition is re-minted because no registered source or feedback-audit source changes.",
  "evidence": [
    "git tag --list --sort=-v:refname: local baseline v0.54.0",
    "scripts/lib/evidence-sources.mjs explicit source inventories and packages/skeleton/src/feedback-audit.ts imports exclude the changed scripts",
    "docs/control/doc-ceilings.json: product 02 ceiling 150611 bytes",
    "npm run release -- prepare --local: v0.55.0 remains current; generated the order meter snapshot and PR preparation surface"
  ],
  "rejected": [
    { "option": "Bump skeleton or compiler", "reason": "Neither component's source nor public contract changes." },
    { "option": "Raise the product document ceiling", "reason": "The in-place write-back fits the existing bound and headroom." }
  ],
  "reopenWhen": "Final review integration records a release collision or a later change edits a registered source."
}
```

## WO-065-D008

```json
{
  "id": "WO-065-D008",
  "date": "2026-09-29",
  "dispatch": "ideation: during resume: next; operator requests minimum three subagents when each workflow mode is enabled and discretionary delegation when disabled",
  "decision": "Complete the document-only breakout: adopt the requested personal workflow policy in product 05, append its two specified ledger entries, and preserve the exact source in worktree-local ignored intake. Enabled means at least three distinct contributing agents over the active root workflow task; off means willing delegation with roughly zero to three as an expectation, not a cap. The counting scope is an explicit synthesis inference from the operator comparison against the shared total budget. No runtime or settings change is claimed. The operator ideation dispatch authorizes these documentation additions to WO-065; its PR observer deliverable and original criteria remain in force.",
  "evidence": [
    "docs/intake/notes/WO-065-expanded-ideation-2026-09-29.md; SHA-256 88b5b5545d9551062cc8a778a27926002e62e1bf1971e58df0401bb1b7584f3d; main resolved by git worktree list, capture local under the operator rule recorded in WO-116-D014; final review/release close reconciles",
    "docs/lineage/idea-ledger.md \u00a72026-09-29 \u2014 Ideation during WO-065: useful delegation with workflow mode; two entries, both specified",
    "docs/product/05-pattern-library.md \u00a7Orchestration and quality policies; existing preference, No Fan-Out and concurrency policies read before edit",
    "docs/product/07-execution-guide.md \u00a7Goal-aligned decisions, \u00a7Operator-opened ideation mode, \u00a7Discipline and ultra normalization; docs/lineage/resolutions.md has no delegation-specific resolution",
    "Read-only agents delegation_policy_lookup and delegation_ideation_review checked policy placement and tensions; session used three distinct subagents total including observer_review, no descendants. This is actor-attested; harness usage reported zero observed admissions with unknown remainder, so it does not prove the actual total."
  ],
  "cleanRoom": "Operator-authored personal process observations, rewritten through Shape-First synthesis. No employer material, no direct-draft filing and no source text promoted verbatim.",
  "authority": "The explicit ideation: message selects the complete capture/synthesis/ledger/product-writeback breakout under product 07; no new executable helper, setting change, or runtime delegation gate is authorized by this documentation choice.",
  "review": "Verifier and final reviewer must digest this receipt, the appended ledger section and product 05 paragraph as part of WO-065. Check traceability, stated inference, distinctions among total/cap/concurrency and evidence labels, compatibility with No Fan-Out, and absence of runtime-enforcement claims.",
  "goalAlignment": {
    "missionAndCriticalPath": "Make delegation mode produce useful independent contributions consistently across harnesses, reducing the operator's need to prompt fan-out. It is personal execution policy, not a new prerequisite on the source-to-deliverable critical path.",
    "traps": {
      "policyResistance": "Keep explicit No Fan-Out, authority and root budget; an incompatibility is reported as unmet instead of silently bypassed.",
      "tragedyOfTheCommons": "Three is a minimum within the existing total cap including descendants; keep concurrency separately bounded and record meaningful contributions.",
      "driftToLowPerformance": "Preserve the requested floor rather than quietly relaxing it for one harness.",
      "escalation": "One scope per root task avoids multiplying the minimum across turns and retries; no new gate is added here.",
      "successToTheSuccessful": "The same requested outcome applies to Claude and Codex; reported history grants neither a permanent exemption.",
      "shiftingTheBurden": "Document the intended behavior so the operator need not repeatedly request delegation.",
      "ruleBeating": "Empty launches, repeated messages and fabricated counts cannot satisfy three contributions; distinguish instrument observations from actor attestations.",
      "seekingTheWrongGoal": "Agent count supports useful independent work; incorporate results instead of treating activity as success."
    },
    "naiveInterventionism": "Existing Orchestrate remains portable preference. The floor belongs to the selected personal workflow profile, retaining the off-mode discretion and other limits. Smallest next probe is a bounded host-binding implementation with task-level contribution evidence; this breakout changes documents only.",
    "noOp": "Would preserve the observed cross-harness gap and lose explicit operator direction, so capture and specification are chosen now."
  },
  "rejected": [
    {
      "option": "Treat minimum three as optional when enabled",
      "reason": "Contradicts the explicit request."
    },
    {
      "option": "Treat zero to three as an off-mode cap",
      "reason": "The operator explicitly says cases differ."
    },
    {
      "option": "Change live account settings or generated role bundles in the breakout",
      "reason": "The direction is ideation; host binding and instruction changes need bounded implementation and evidence."
    }
  ],
  "followup": "Planning: implement the personal workflow delegation profile specified in product 05: bind Claude/Codex enabled-mode evidence, minimum three distinct meaningful subagent contributions per root workflow task, off-mode willing delegation with no new cap, honest insufficient-capacity and unknown-counter reporting, existing cap20/descendant/No Fan-Out/concurrency/writer boundaries, and fixtures or observed runs demonstrating both modes. Operator direction is the trigger; do not silently soften the floor.",
  "reopenWhen": "Operator clarifies a different workflow counting boundary; measured evidence shows redundant contributions or a host cannot expose the requested setting. Preserve the requested floor while resolving those observations."
}
```

## WO-065-D009

```json
{
  "id": "WO-065-D009",
  "date": "2026-09-29",
  "dispatch": "resume: verify",
  "decision": "Fail VER-001 on criterion 1 (F1). The declared automation pattern, a case-insensitive [bot] login suffix, is matched against GraphQL author { login }. GitHub's GraphQL API returns a Bot actor's login without that suffix, so no real automated review comment can reach role automation or class automated-review; every one is stored as reviewer/human-review. The committed fixture's automation author, fixture-agent[bot], is a login shape the queried API does not return, so the passing criterion-1 test does not establish the classification over recorded response shapes. The verifier leaves implementation unchanged and routes the defect through repair.",
  "evidence": [
    "Read-only gh api graphql search of public cli/cli pull requests on 2026-09-29 returned author {\"__typename\":\"Bot\",\"login\":\"dependabot\"} and comment author {\"__typename\":\"Bot\",\"login\":\"cli-triage\"}",
    "gh CLI api/queries_issue.go Author.MarshalJSON renders an id-less (bot) author as is_bot true and login app/<login>; public fixes brave/pull-merge#405 and epics-containers/org-dashboard#9 record GraphQL bot logins without [bot]",
    "scripts/lib/pull-request-observer.mjs:49 requests author { login } without __typename; :131-133 classify automation only by /\\[bot\\]$/iu",
    "Verifier reproduction on the committed observation.json with only the automation login changed from fixture-agent[bot] to fixture-agent: PRRC_1 becomes role reviewer, class human-review; PRRC_3 becomes role reviewer (class resolved unchanged)",
    "docs/verifications/WO-065/VER-001.md F1"
  ],
  "rationale": "Mission and critical path: WO-066 resolves every automated review comment from these stored classes, so an unreachable automated-review class blinds the next order. Rule beating and seeking the wrong goal: a green fixture over an unrecorded login shape is not the classification the criterion asks for. Policy resistance and drift: D003's reopen condition names exactly this miss. Commons and escalation: one bounded repair; no new gate. Success to the successful: the existing fake-gh harness stays; only its recorded author shape changes. Shifting the burden: without repair the operator would find the misclassification only when WO-066 acts. Naive Interventionism: the verifier edits no implementation. NoOp leaves every live bot comment misclassified.",
  "rejected": [
    {
      "option": "Judge criterion 1 met because the synthetic fixture passes",
      "reason": "The criterion names recorded JSON; the fixture's automation login is a shape the queried API does not return, and a live check shows the pattern cannot match."
    },
    {
      "option": "Repair the classifier in the verifier session",
      "reason": "An independent verifier records the defect and preserves the judged subject for repair and re-verification."
    }
  ],
  "followup": "WO-065 executor, next resume: fix, blocking VER-001 F1: decide automation from the actor type GraphQL returns (request __typename on every author; Bot is automation), decode the author typename positively (refuse an unknown value with its field path, or map User, Bot, Mannequin, Organization and EnterpriseUserAccount explicitly), and record fixture authors in the API's shape (a Bot login without [bot]). Add a test where a Bot author without the suffix classifies automated-review and a User author does not; keep ci-failure, reporter and resolved behavior; update D003's declared pattern and the evidence README. Keeping the [bot] suffix only as a fallback is optional.",
  "reopenWhen": "The repaired observer classifies a Bot-typed author as automation over recorded response shapes, or new evidence shows GraphQL returns the [bot] suffix for the queried fields."
}
```

## WO-065-D010

```json
{
  "id": "WO-065-D010",
  "date": "2026-09-29",
  "dispatch": "resume: verify",
  "decision": "Board two defects outside the declared criteria, with reproductions, as non-blocking (VER-001 F2 and F3). F2: a comment body that decodes as JSON but holds a C0 control character other than tab, line feed or carriage return (for example an ANSI escape) is malformed for WO-060's discussion text, and the observer refuses the whole observation, so no other comment is stored. F3: a metadata string refused by the screen (an inline comment path, a check name or a node id) refuses the whole observation, as D005 chose; an ordinary repository path that begins with www., such as www.example.org/index.html, trips www-autolink, so one such inline comment blocks observation of the pull request. A repositoryId with a single-label host also passes the recorded-event check and then fails as a screen caller error, without the refusal prefix, after the gh reads; nothing is appended. Criteria 2 and 3 are judged on comment text and on undecodable output respectively, so none of these fails a criterion.",
  "evidence": [
    "Verifier reproduction through the observe-pr CLI on the committed fixture: an added conversation comment with body containing U+001B exits 1 with $.data.repository.pullRequest.comments.nodes[1].body: invalid screened text and leaves 1 event",
    "Same harness: reviewThreads.nodes[0].comments.nodes[1].path = www.example.org/index.html exits 1 with ...path: metadata refused by source-bundle screen and leaves 1 event; sites/www.example.org/index.html passes, because the www-autolink form starts only at a string start or after whitespace, *, _, ~ or (",
    "packages/compiler/src/source-bundle.ts:263-268 refuses control characters in text; scripts/lib/pull-request-observer.mjs:108-109, 112-117, 128, 152, 371, 380",
    "Verifier component check: parseGitHubTarget('https://localhost/o/r') returns selector localhost/o/r, and decodeSourceBundle with allowedHosts [localhost] throws the allowedHosts[0] caller error; the read-only review subagent's end-to-end probe found the log unchanged and the lock released",
    "docs/verifications/WO-065/VER-001.md F2 and F3"
  ],
  "rejected": [
    {
      "option": "Fail criterion 2 on the metadata case",
      "reason": "Criterion 2 speaks of a comment's text (a forge-host link is stored with its text); refused.span can address only the body, and D005 records the whole-refusal choice."
    },
    {
      "option": "Treat these as operator questions now",
      "reason": "Each has a reproduction and a bounded repair; the WO-065 repair or planning can dispose of them without a new operator decision."
    }
  ],
  "followup": "WO-065 repair within its Boy Scout bound, otherwise planning before WO-066 consumes observations: keep one unreadable comment from blocking a whole observation. Store a comment whose body the screen cannot decode as refused without its text, under a declared shape such as malformed-text with no span, or strip or escape control characters before screening while keeping the no-retention rule. For metadata, record a per-comment refusal instead of refusing the observation, or at minimum stop a repository path from tripping www-autolink. Validate the forge host with the screen's host rule when reading the PullRequestOpened event, before any gh call. Preserve: no refused text, hash or raw response persisted; other comments stored; refusals name a field path.",
  "reopenWhen": "A repair changes screening of bodies or metadata, or WO-066 needs a different disposition for an unreadable comment."
}
```

## WO-065-D011

```json
{
  "id": "WO-065-D011",
  "date": "2026-09-29",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 by decoding GraphQL Actor.__typename, classifying Bot as automation, explicitly admitting the other documented Actor types and refusing missing or unknown types with a field path. Keep automation precedence over reporter, deleted-author behavior and CI/resolution classification. Reuse D001; no second economy experiment.",
  "evidence": [
    "VER-001 F1 and D009 reproduce the unsuffixed Bot login misclassification",
    "GitHub documentation fetched through Context7 /github/docs shows __typename with Bot and User and an unsuffixed agent login",
    "Existing AUTHOR fragment is shared by PR metadata, conversation comments, reviews and both thread pagination paths",
    "D001 already declined a duplicate harness; repair uses scripts/test-target-publish.mjs",
    "Live read-only GitHub schema introspection on 2026-09-29: Actor possibleTypes are Bot, EnterpriseUserAccount, Mannequin, Organization and User; https://docs.github.com/en/graphql/reference/users#actor",
    "Focused F1 regression failed before the query change (missing author typename selection), then all eight WO-065 tests passed in 7.63 s. The new case includes a Bot PR author and same-login non-bots, submitted reviews and paginated inline Bot comments."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Restore the automated-review input WO-066 needs to consume observed feedback.",
    "traps": {
      "policyResistance": "Positive actor decoding preserves the existing unreadable-data contract.",
      "tragedyOfTheCommons": "One writer, existing fixtures, no new runtime gate or duplicated experiment.",
      "driftToLowPerformance": "An API-shaped Bot fixture must exercise the promised class.",
      "escalation": "Bounded repair in the original observer and test surfaces.",
      "successToTheSuccessful": "Replace the unsupported suffix heuristic despite its passing historical fixture.",
      "shiftingTheBurden": "Remove future manual reclassification for the operator.",
      "ruleBeating": "Make fake gh check author typename selection, and test each author connection.",
      "seekingTheWrongGoal": "Judge stored feedback classes, not just a green test total."
    },
    "naiveInterventionism": "Keep correlation, no remote mutations, screen, pagination and dedup semantics. Add a focused regression before repair.",
    "noOp": "Rejected: keeps live bot reviews invisible to the downstream resolver."
  },
  "rejected": [
    {
      "option": "Keep or broaden login-name heuristics",
      "reason": "Actor type is explicit; strings are neither required nor sufficient evidence of automation."
    },
    {
      "option": "Add a second economy experiment",
      "reason": "D001 already records this order’s experiment and its reuse decision remains supported."
    }
  ],
  "reopenWhen": "GitHub adds an Actor type or a downstream consumer needs account identity beyond type and login.",
  "correction": "The earlier suffix decision was inferred from an unsupported response shape. The verifier reproduction and current schema identify Bot as a typed actor. D003, the fixture, queries and role decoder now use that evidence."
}
```

## WO-065-D012

```json
{
  "id": "WO-065-D012",
  "date": "2026-09-29",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F2/F3 in adjacent-0001. Screen failures on decoded strings become per-item refusals with a source field path: declared findings retain their span, malformed Unicode/control text uses malformed-text without a span. Retain only safe metadata and omit all body text whenever any field refuses. Replace refused comment ids with collision-avoiding local ordinal placeholders without hashing source bytes. A refused check name becomes [refused] in checks and a refused automation item; its class is ci-failure only for an actual failing state, otherwise automated-review. Validate the forge host by calling the existing screen with an empty bundle before any gh call. Keep structural decode errors as whole-observation refusals.",
  "evidence": [
    "VER-001 F2/F3 and D010 give reproductions and repair rules",
    "source-bundle.ts text rejects C0 controls, DEL and lone surrogates; allowlist throws on single-label or invalid DNS hosts",
    "pull-request-observer.mjs throws on malformed bodies and every metadata screen refusal",
    "Operator async reply: Continue with F2 and F3 (recommended); queue revision 2 reread and check-in recorded before start"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Keep safe PR feedback available to WO-066 while exposing unreadable items that must stop automated disposition.",
    "traps": {
      "policyResistance": "Use the existing screen unchanged; do not widen its allowlist or normalize rejected text into retained content.",
      "tragedyOfTheCommons": "Both findings share one bounded queue item, module and regression suite.",
      "driftToLowPerformance": "Retain visible refusal markers and positive structural decoding; do not silently drop problematic items.",
      "escalation": "No new dependency, gate, retry mechanism or remote action.",
      "successToTheSuccessful": "Reconsider D005 whole-refusal behavior because reproduced ordinary paths and controls block safe peers.",
      "shiftingTheBurden": "Consumers can see the exact refused field and other comments without operator rescue.",
      "ruleBeating": "Search the store for all rejected metadata/body strings and assert peers, states, repeat behavior and pre-gh refusal.",
      "seekingTheWrongGoal": "Preserve usable observed feedback and confidentiality together."
    },
    "naiveInterventionism": "Keep safe-item roles, correlation, pagination and latest-state dedup. Placeholder ids carry no remote identity and refused items are never actionable without rereading. Structural unknowns still abort with no append.",
    "noOp": "Rejected within this bounded repair: one screened string would continue to blind downstream consumers to every peer."
  },
  "rejected": [
    {
      "option": "Strip or escape controls and retain the resulting text",
      "reason": "Changes source text and risks retaining a rejected payload in another form."
    },
    {
      "option": "Keep a hash of a refused identifier",
      "reason": "Retains a fingerprint of rejected content; a local placeholder needs no source bytes."
    },
    {
      "option": "Bypass URL screening for path or check metadata",
      "reason": "Could persist declared secrets or forbidden hosts in a different field."
    }
  ],
  "reopenWhen": "WO-066 needs stable identity for a refused-id placeholder, a consumer needs all findings per item, or observed scale makes repeated per-item screening material."
}
```

## WO-065-D013

```json
{
  "id": "WO-065-D013",
  "date": "2026-09-29",
  "dispatch": "resume: fix",
  "decision": "F1-F3 are implemented and pass the required executable checks. Keep the staged application v0.55.0 minor release with no component or dependency change; release prepare --local confirmed the existing target. Original VER-001 is preserved for independent re-verification. D001 remains the sole economy decision; no measured efficiency improvement is claimed.",
  "evidence": [
    "repair-fixtures.txt: 17 passed, 0 failed, 21.72 s; all three new regressions failed before repair",
    "host-gate:ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d:npm test: 30 passed, 0 failed, 74 fresh tasks, 320.69 s at 2026-09-29T01:35:55.843Z",
    "host-gate:ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d:npm run test:docs: 23 passed, 0 failed, 13.44 s at 2026-09-29T01:36:17.828Z",
    "repair-smoke.json: both observations of the retained open scratch PR append nothing; independent head/number and correlation agree; zero checks/comments",
    "repair-subject.json records exact executed source/test/fixture bytes including untracked additions",
    "Product 02 current 148268 bytes, base 147835, addition 433 within bound 450, remaining ceiling headroom 2343; publication locks and planning check pass"
  ],
  "goalAlignmentOutcome": "The observed benefit is a reachable automated-review class over API-shaped actor data and safe-peer survival for malformed or screened strings. No remote mutation, poller, additional gate or broader secret detector was added. Placeholders are local and not stable forge identities; refused items require rereading before disposition. The full gate establishes regression coverage, not atomic remote snapshots or classification coverage from the empty live PR.",
  "followupDisposition": "D009/FUP-c327e33bc8eda813 and D010/FUP-0b67dbaface3d750 are allocated to this implemented WO-065 repair, awaiting independent re-verification. D008/FUP-e62d0d2771185a38 remains open for delegation policy implementation. Textual matches FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb and FUP-fd05316b6030ef73 remain as recorded: this repair changes neither usage-proof writer, usage attribution nor writer-reservation text; their reopening conditions were not encountered.",
  "rejected": [
    {
      "option": "Run another full gate after evidence-only updates",
      "reason": "No runtime source changed; the completed full gate covers the code and the document gate runs again inline."
    },
    {
      "option": "Claim the empty scratch PR proves automated classification",
      "reason": "It validates the current query and unchanged-state path; the API-shaped fixtures and schema check establish actor handling."
    }
  ],
  "reopenWhen": "Independent verification finds a counterexample to F1-F3, GitHub changes its schema, or a consumer needs stable identity for a refused item."
}
```

## WO-065-D014

```json
{
  "id": "WO-065-D014",
  "date": "2026-09-29",
  "dispatch": "resume: verify",
  "decision": "Pass VER-002: the repair holds VER-001's F1-F3 rules and criteria 1-6 are met. Board two defects outside the declared criteria, with reproductions, as non-blocking (VER-002 F4 and F5). F4: a response string the observer passes back to gh as an argument (a connection's pageInfo.endCursor, or a review thread id when that thread's comments paginate) is decoded as any string; one holding U+0000 makes spawnSync throw ERR_INVALID_ARG_VALUE, and the CLI prints that message, which quotes the leading part of the response value on stderr, without the refusal prefix or a field path. Nothing is appended and the lock is released; the store stays clean. This contradicts the observer's own rule that errors must not echo an API response and the evidence README's statement that no raw API failure text is logged. F5: one decoded string with a token run of about 5.6 million characters overflows the regex stack inside WO-060's screen; the RangeError escapes the observer, the whole observation fails with no field path and safe peers are not stored. The message carries no content. A 65,536-character token is refused per item as intended.",
  "evidence": [
    "Verifier reproduction through the observe-pr CLI with a fake gh: comments pageInfo.endCursor holding U+0000 exits 1, leaves 1 event, and stderr reads error: The argument 'args[13]' must be a string without null bytes. Received 'cursor=<leading response bytes>'",
    "Same harness: review thread id holding U+0000 with paginated comments exits 1, leaves 1 event, and stderr quotes 'id=<leading response bytes>'",
    "Same harness: a conversation comment body 'Bearer ' + 6,000,000 A characters, beside a safe peer, exits 1 with error: Maximum call stack size exceeded and leaves 1 event; the same body with 65,536 A characters is stored as refused bearer-credential",
    "scripts/lib/pull-request-observer.mjs:97 (errors must not echo an API response), :212 executeGh with response-derived args, :275-278 endCursor decoded as any string, :491 and :499-501 thread id reused as a query variable, :118-126 screen() does not contain a RangeError",
    "The read-only probe subagent found the same two outcomes independently and located the overflow threshold at about 5.59 million token characters for the bearer and GitHub-token shapes",
    "docs/verifications/WO-065/VER-002.md F4 and F5"
  ],
  "rationale": "Mission and critical path: WO-066 consumes these observations and WO-123 composes the command into a resident vertical, where stderr may be retained, so the no-echo rule matters before observation runs unattended. Rule beating and seeking the wrong goal: the store search is green, but the stated no-echo rule is not, so the verdict names the gap instead of counting passing tests. Policy resistance and drift: both inputs require a hostile or broken forge response; recording them keeps the declared limits honest. Commons and escalation: no new gate; one bounded follow-up. Success to the successful: the existing fake-gh harness reproduces both. Shifting the burden: without a record, a resident host would surface F4 as a leaked log line. Naive Interventionism: the verifier edits no implementation. NoOp would leave the README's no-logging statement false without a trace.",
  "rejected": [
    {
      "option": "Fail criterion 3 on F4",
      "reason": "Criterion 3 names an unrecorded number, output that does not decode and a failing gh; the cursor decodes under the declared decoder, nothing is appended and the store stays clean, so F4 is a defect outside the declared criteria."
    },
    {
      "option": "Fail criterion 2 on F5",
      "reason": "Criterion 2 is judged against WO-060's declared set and the store; F5 fails closed, retains nothing and echoes nothing."
    },
    {
      "option": "Repair either defect in the verifier session",
      "reason": "An independent verifier records the defect and preserves the judged subject."
    }
  ],
  "followup": "Planning, before WO-123 composes observe-pr into a resident vertical or WO-066 relies on complete observations (or the WO-065 final review within its Boy Scout bound): F4, decode every response value the observer sends back to gh (pageInfo.endCursor on every connection, the review thread id) against a bounded grammar that excludes U+0000 and controls, refusing at its field path before the call; and keep any non-refusal error from printing response bytes (the CLI reports a fixed reason, not error.message, for errors the observer did not raise). F5, contain a screen RangeError per item as a refused item without text (for example shape unscreenable-text with its field path), or bound the length the screen receives, while preserving that no rejected text, hash or raw response is persisted. Also judge whether WO-060's text rule should reject C1 controls (U+0080-U+009F) and bidirectional overrides, which pass today although its comment says tab, line feed and carriage return are its only controls. Correct the evidence README's no-logging statement when F4 is repaired.",
  "reopenWhen": "A repair changes how response values reach gh arguments or how screen errors are contained, or GitHub evidence shows cursors or thread ids can carry control characters."
}
```

## WO-065-D015

```json
{
  "id": "WO-065-D015",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-001 with no finding routed to repair, and record what a live run on populated pull requests showed, since the operator's scratch pull request has no checks or comments. The observer read three public GitHub pull requests read-only, from a synthetic PullRequestOpened in session scratch, and stored exactly the items a separate raw GraphQL read found, with the classes the order names: 283 checks over three pages, failing checks as ci-failure, Bot authors as automation, resolved threads as resolved, a second run appending nothing. Two usefulness limits follow from declared choices rather than defects, so neither fails a criterion. First, automation is the GraphQL Bot type (D003, D011); a machine account registered as a User, such as a merge bot, is stored as reviewer and human-review. Second, the forge host is the whole allowlist (operator-review assumption 3); 12 of the 21 non-CI Bot items were stored refused as scheme-authority because they link to another host, including the forge's own documentation subdomain, so most automated review text does not reach WO-066. Each multi-comment review thread also costs one further gh call per observation (D005's choice).",
  "evidence": [
    "Session scratch probe final-probe/: pytorch/pytorch#198710 (head d1cc1fe0), SharpMUSH/SharpMUSH#1390 (head 77dc1037), sydlexius/stillwater#3275 (head da70c0fd); every run exit 0 with empty stderr; each second run printed Pull request state unchanged; no event appended.",
    "Reviewer's own tally of the three stored payloads: 21, 12 and 13 comments; one PullRequestStateObserved each from pull-request-observer with causation equal to the opening event; checks FAILURE 2, 1 and 0; refused items 2, 6 and 4, all automation items, all scheme-authority; no human item refused",
    "Raw read-only GraphQL in the same probe: pytorchmergebot is __typename User; the read-only probe subagent's per-id cross-check found no role, class, resolution, path, line or text mismatch and no missing item",
    "docs/work-orders/WO-065-pull-request-state-observation.md operator-review assumption 3; D003, D005, D011",
    "docs/final-reviews/WO-065/FINAL-001.md Findings"
  ],
  "rejected": [
    {
      "option": "Fail criterion 1 on the machine-user account",
      "reason": "The order lets the executor declare the automation pattern; the Bot type is that declaration, and a User-typed account cannot be told from a person by type."
    },
    {
      "option": "Widen the allowlist or admit login patterns in this review",
      "reason": "Both are behavioral changes; the order's assumption 3 reserves more hosts for a later order, and a reviewer never writes a behavioral fix and certifies it."
    }
  ],
  "followup": "Planning, before WO-066 relies on automated review text or classes: judge (a) whether an operator-declared list of machine-user logins counts as automation beside the GraphQL Bot type, and (b) which hosts beyond the forge host a comment may link to and keep its text (for example the forge's own documentation subdomain and a reviewing app's declared hosts), given that 12 of 21 real Bot review items in the WO-065 final-review probe lost their text to scheme-authority. Preserve WO-060's screen for declared secret shapes and the rule that no refused text, hash or raw response is stored.",
  "reopenWhen": "WO-066 is activated, or an operator repository shows a machine account or an off-host link blocking disposition of an automated review comment."
}
```
