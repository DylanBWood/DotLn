# Deliverable readiness artifact contract

`deliverableReady(artifacts)` in `scripts/lib/github-body.mjs` returns fourteen
rows, each with `id`, `item`, `status`, `evidenceRefs` and `reason`. Status is
`evidenced`, `absent` or `not-applicable`. The conjunction holds when no row is
absent. It consumes typed host projections, never caller-supplied verdicts.

Target publication always renders the rows. The CLI accepts:

```text
worktree publish WO-NNN --target <request.json> [--require-deliverable-ready]
```

The flag refuses before authentication, remote Git or PR creation, listing every
absent item. Without it the operator can publish a proposal with gaps. A repeat
of an already recorded publication remains an idempotent local read.

The existing request accepts optional `baselineStore` and `reviewStore`, resolving
beside the request file like `verificationStore`. When omitted, the verification
store is also searched for baseline/review episodes. Every supplied evidence
store is replayed through the existing verification reactor; live host locks or
malformed logs refuse. Baseline and review claims require the host's actual
`BaselineWitnessed` and `ReviewCompleted` events. The baseline must precede the
source worker's first attempt and bind the base and original contract. A review
must bind the candidate diff, sealed files and contract, with no blocking finding
or human-attention result. Reviewer and verifier identities must differ from
the source worker and match the recorded verification/review episodes.

| Item | Artifact source |
| --- | --- |
| Current source revision | Local branch/commit and diff guard in `observeTarget` |
| Explicit contract | Bound writer compilation and its persisted source command |
| No unresolved material ambiguity | Explicit preparation inventory, empty and current |
| Reproduced baseline | Replayed `BaselineWitnessed`: reproduced defect or walked new story |
| Repo-native implementation | Bound independent review against a declared sealed conventions file |
| No unexplained scope | Changed paths within declared source surfaces and clear independent review |
| Tests/build/lint | Preparation's selected current passing host-run evidence for each category |
| Live behavior walked | Current passing live witnesses for every declared required check |
| Visual claims visually inspected | Declared visual criteria and verified passing screenshot references; no declared visual claims is not applicable |
| Every acceptance criterion evidenced | Current passing matrix covering exactly the contract's criteria |
| Independent verification and review | Bound passing evaluations, clear review and distinct producer episodes |
| Final diff read | Completed independent review of the exact sealed candidate diff |
| Grounded body | Generator's bound contract, test, matrix and diff inputs |
| Monitored loop | Prepared owner and explicit CI/comment/drift/terminal policies |

`delivery-preparation.json` is an optional regular file in the source episode
store. Its closed shape contains `schemaVersion: 1`, `workOrderId`,
`subjectRevision`, `contractHash`, `diffHash` and optional sections:

- `unresolvedMaterialAmbiguities`: an explicit array of unresolved identifiers;
  only an empty array evidences this item.
- `checks`: category arrays `tests`, `build`, `lint`, each selecting evidence IDs
  in the replayed candidate. Each selection must identify an actual current,
  passing live witness whose host test has `origin: host` and exit code zero.
  The owner declares category meaning; filenames and command prose are not
  interpreted. Missing categories remain absent.
- `monitoring`: exactly `owner`, `repositoryId`, `headRevision`, `command`,
  `ciFailure`, `reviewComments`, `sourceDrift`, `terminalState`. Required values
  are a named owner, the target repository and candidate revision,
  `worktree resolve-pr`, `classify-before-repair`, `triage-by-type`, `stop`,
  `human-controlled`, respectively. This is future loop ownership/policy,
  because no PR exists to observe yet; it claims no completed remote observation.

`deliveryContractHash` hashes the ordered JSON pairs for the six original
snapshot-contract fields: workOrderId, objective, acceptanceCriteria,
constraints, nonGoals, requiredEvidence. `diffHash` is the source host's existing
SHA-256 digest of the base-relative binary Git diff. Stale preparation yields
absent rows; malformed preparation refuses even a permissive proposal.

References use fixed aliases to avoid publishing private filesystem paths:
`commit:<sha>` resolves in the target Git object store; `source-event:<id>` in
the source log; `baseline-event:<id>` and `review-event:<id>` in their selected
logs; `verification:<workstream>` in the replayed verification store;
`delivery-preparation#/section` in the fixed preparation file; `#contract`,
`#acceptance`, `#change` in the generated body. The renderer escapes references
and contract data literally and applies the existing outward lint. The original
store/request remains the operator's resolver context.

No missing producer is silently presumed. A missing convention, ambiguity
inventory, build/lint witness or monitoring owner stays absent until a producer
records it. The evaluator does not run additional checks or infer correctness
from the presence of a narrative. Replayed minor review findings are carried
into known items; they authorize no edits.
