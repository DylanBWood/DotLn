## Release overview

A gate now re-executes a suite only when something that suite reads has changed. A lifecycle transition, a commit of identical bytes, a new checkpoint ref or a sibling worktree no longer invalidates suites that did not read what changed, and every task that does execute prints the input class that changed, with bounded paths, or `no prior success`. On the operator's host, the first full gate after a lifecycle transition composed 46 of 78 tasks from earlier successes in 390 s where the same transition had cost 613 to 839 s the day before. This release is for anyone who runs or reads the repository's gate, and for anyone whose worker transport refused a routine CLI upgrade.

## Read before upgrading

Suite-success records move from each worktree's `docs/control/local/harness/suite-success` to `dotln/suite-success` under the repository's common Git directory, shared by the main checkout and every linked worktree, and advance to record version 3. Version-2 records are ignored and never migrated, so every scoped suite executes once more after this release; the exact-tree aggregate, the fail-closed defaults and the lifecycle predicate are unchanged. The generated hooks refuse agent writes into the shared cache from any worktree, with or without an active gate, with the reason `suite-success cache is runner-owned Git metadata`.

Each suite's reuse key drops the commit identity, every ref, the physical checkout path, the CPU count, the OS release and the complete Git configuration listing. It keeps the declared candidate paths, the declared Git state, the projected environment, the toolchain digests, the installed roots and the configuration keys that change how a tree is read (`core.*`, `filter.*`, `init.templatedir`, `extensions.worktreeconfig`), and the hook, filter, attribute and exclude guards still force execution. Checkout-local `PATH` entries and npm's `npm_config_local_prefix` take a worktree-relative identity in the key while execution keeps the real values; an external npm prefix and every other projected environment difference still invalidate reuse.

Gate rows gain additive fields: `freshReasons` on the aggregate row and `executionFacts` (checkout digest, CPU count, OS release); existing readers are unaffected. Nothing prunes the shared cache; after eleven gates it holds 284 records and 24.5 MB.

The worker transports admit Claude Code `2.1.270` and Codex CLI `0.154.0` as minimum versions with no upper bound. Older or unparseable versions refuse at construction with the required minimum; Codex effort selection uses the same minimum. An installation below either minimum, including Codex `0.153.4`, is no longer admitted.

Application target `v0.17.4` (patch) above `v0.17.3`; skeleton `0.15.4` with regenerated runtime pins and snapshot; compiler, kernel and console unchanged; no new dependency.

## Substantive changes

**Suite identity by declared inputs.** Every inventoried suite, including the 40 release cases, carries a declaration (version 1) with its document scope and its Git state: none, `HEAD`, or ref patterns. `index` declares `HEAD` and `refs/tags/*`, `plan` and `plan-refutation:current` declare `HEAD`, and `authority-evidence` declares `refs/tags/v0.16.0`. Declared state is observed once per gate and folded only into the keys of suites that declared it. The seven live checks, the build and release preparation always execute, and an undeclared suite name gets no key.

**Shared, sealed cache with per-class digests.** Each success record carries seven class digests (source, documents, git, environment, toolchain, runtime, declaration) and the hashed path inventory it was keyed on, sealed as before. A malformed, foreign-version, unsealed, truncated or edited record is ignored. A fixture launches real npm gates in two Git worktrees at identical bytes: the second composes from the first's executed suite, and one differing byte executes fresh.

**Miss explanations.** For every fresh task the runner compares the current digests with the suite's newest prior success and prints the changed classes with up to five paths each and an `(+N more)` remainder, the policy that forced execution (`preparation`, `live check`, `forced fresh`, `unreusable snapshot`, `undeclared suite`), or `no prior success`; the same reasons are retained in the aggregate gate row.

**Cache guard in the generated hooks.** The pre-tool guard shares the runner's physical cache locator and refuses Write, Edit and classified shell destinations that resolve into the shared cache, including from linked worktrees and including physical aliases, before any active-gate check.

**Transport minimum versions.** Exact version allowlists are replaced by numeric minimums compared component by component; newer patch, minor and major versions launch the requested model with the same restricted profile, effort validation and result validation.

## Progressive polish

Version bumps for the skeleton and its host constant; regenerated hooks, manifest and pinned runtime snapshot; the README release claim, the roadmap note, both publication source locks, the decisions index rows D001 to D006, the follow-up register and the work-order index; fixture versions moved from `2.1.261`/`2.1.263`/`0.153.4` to the new minimums; two existing fixtures adjusted to the new semantics (an unrelated tag now reuses, and the gate-protection fixture admits the cache refusal reason).

## Evidence and compatibility

Independent [VER-001](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-129/VER-001.md) failed on the npm prefix carrying the checkout path through the canonical entry points, with one low finding beside it; the repair closed both and [VER-002](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-129/VER-002.md) passed all eight acceptance criteria with one non-blocking finding. [FINAL-001](https://github.com/DylanBWood/DotLn/blob/main/docs/final-reviews/WO-129/FINAL-001.md) records the review, the [decisions](https://github.com/DylanBWood/DotLn/blob/main/docs/evidence/WO-129/decisions.md) and the [host-gate capture](https://github.com/DylanBWood/DotLn/blob/main/docs/evidence/WO-129/host-gates.json). Known limits: one passing gate on the Codex host retained none of its suite successes and the runner cannot report that condition (VER-002 F1, deferred with diagnosis first in D006); the reviewed environment projection still bounds reuse to one session on Claude Code hosts, whose sandbox variables carry checkout paths; the shared cache has no pruning; the declaration version has no dedicated fixture; the whole-tree document scopes of 23 suites remain WO-130's work. Supported Node line and package privacy are unchanged.
