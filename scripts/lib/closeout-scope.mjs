// The checks an order owes at its closeout: one selection that the executor's
// briefing, the integrate helper's "owed by this order" list and the
// completion advisory all print, so that each reader names the same checks.
//
// Every order owes the launchpad document gate. A launchpad order also owes
// the complete launchpad run, its own repository's gate. A target order owes
// its registered target gate, and the complete launchpad run only where its
// launchpad changes reach what that run judges: machinery the order changed,
// a machinery conflict it resolved at integration, a criterion that names
// `npm test`, or anything the selection cannot classify or read. Paths that
// main's merge adopted unchanged are main's change, already gated on main.
//
// The selection runs no gate, supplies no passing row and refuses nothing:
// an input it cannot read keeps the complete run and says why.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { docRelative, loadConfig, rootPattern } from "./config.mjs";
import { eventsForOrder, readControl } from "./control-store.mjs";
import { runGit, runGitPathList } from "./git.mjs";
import { criterionGateClaims, declaredCriteria } from "./handoff-ledger.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import {
  launchpadInvocation,
  targetGateCommand,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";
import { parseRepositoryDeclaration } from "./work-order-repository.mjs";
import { isKitRoot } from "../../packages/skeleton/src/runtime-inputs.mjs";

/** The runner's suite declarations, which name the records a complete run
 * reads beyond code. A reader loads them before it selects, because a runner
 * with an unresolved conflict cannot be imported; that failure makes the
 * selection uncertain instead of failing the reader. */
export async function loadCloseoutRunner() {
  try {
    const { suites } = await import("../test-runner.mjs");
    return { suites };
  } catch (error) {
    return { error: error.message.split("\n")[0] };
  }
}

/** The runner's declarations when `order` (an id or its control state) is a
 * target order, the only kind whose launchpad paths the selection
 * classifies; a launchpad order's selection reads none, so its readers never
 * load the runner module. */
export async function closeoutRunnerFor(root, order) {
  let state = order;
  try {
    if (typeof order === "string")
      state = readControl(root).orders.get(order)?.state;
  } catch {
    // An unreadable control record makes the selection uncertain by itself.
    return undefined;
  }
  return state?.repositoryId ? loadCloseoutRunner() : undefined;
}

// Files a record root holds as documents. Any other file under a record root
// is classified only inside the order's own record lanes.
const DOCUMENT_FILE =
  /\.(?:md|markdown|txt|json|jsonl|csv|tsv|svg|png|jpe?g|gif|webp|pdf|html?|ya?ml)$/iu;
// Launchpad source and configuration: what the complete run builds and tests.
const CODE_ROOT = /^(?:scripts|packages|corpus)\//u;
const HOST_ROOT = /^\.(?:claude|agents|codex)\//u;
const ROOT_CONFIGURATION =
  /^(?:package(?:-lock)?\.json|dotln\.config\.json|KIT-MANIFEST\.json|tsconfig(?:\.[^/]+)?\.json|\.gitignore|\.gitattributes|\.node-version|\.nvmrc|\.npmrc|\.prettierrc(?:\.[^/]+)?|\.prettierignore|CLAUDE\.md|AGENTS\.md)$/u;

const kitFiles = (root) => {
  if (!isKitRoot(root)) return null;
  const manifest = JSON.parse(
    readFileSync(join(root, "KIT-MANIFEST.json"), "utf8"),
  );
  return new Set(manifest.files.map((file) => file.path));
};

/** Classify one launchpad path an order changed. Known machinery and the
 * records gates read as inputs come first, so no configured record root can
 * turn source into a document. */
function classifier(root, workOrder, runner) {
  const roots = loadConfig(root).roots;
  const control = docRelative(root, "control");
  const evidence = docRelative(root, "evidence");
  const gateInputs = new Set([
    `${control}/budgets.json`,
    `${control}/doc-ceilings.json`,
    `${control}/outward-vocabulary.json`,
    `${evidence}/current.json`,
  ]);
  // Minted evidence editions, which docs/evidence/current.json selects and
  // the evidence and product suites read.
  const edition = new RegExp(
    `^${rootPattern(root, "evidence")}/WO-\\d{3}/(?:authority|artifact-identity|verification|feedback(?:-\\d{3})?)/`,
    "u",
  );
  const kit = kitFiles(root);
  // Records a suite of the complete run reads, as the runner declares them;
  // structural, document and generated suites run in the document gate too.
  const kitRoot = Boolean(kit);
  const declared = runner.suites
    .filter(
      (row) =>
        !row.structural &&
        !row.document &&
        !row.generated &&
        (row.product || row.machinery) &&
        !(kitRoot && row.kit?.startsWith("core-only: ")),
    )
    .flatMap((row) =>
      (row.sources ?? []).map((source) => ({ source, suite: row.name })),
    );
  const ownLanes = ["evidence", "verifications", "finalReviews"].map(
    (key) => `${docRelative(root, key)}/${workOrder}/`,
  );
  const recordRoots = [...new Set(Object.values(roots))].map(
    (path) => `${path}/`,
  );
  return (path) => {
    if (gateInputs.has(path) || edition.test(path))
      return { kind: "machinery", why: "a record the gates read as input" };
    if (kit?.has(path)) return { kind: "machinery", why: "a kit file" };
    if (CODE_ROOT.test(path) || HOST_ROOT.test(path))
      return { kind: "machinery", why: "launchpad source" };
    if (ROOT_CONFIGURATION.test(path))
      return { kind: "machinery", why: "launchpad configuration" };
    const reader = declared.find(
      ({ source }) => path === source || path.startsWith(source),
    );
    if (reader)
      return {
        kind: "machinery",
        why: `an input of the ${reader.suite} suite`,
      };
    if (ownLanes.some((lane) => path.startsWith(lane)))
      return { kind: "document", why: "the order's own record" };
    if (
      (/^[^/]+\.md$/iu.test(path) ||
        recordRoots.some((prefix) => path.startsWith(prefix))) &&
      DOCUMENT_FILE.test(path)
    )
      return { kind: "document", why: "a document or record" };
    return { kind: "unknown", why: "outside the known launchpad locations" };
  };
}

const isAncestor = (root, older, newer) =>
  runGit(root, ["merge-base", "--is-ancestor", older, newer], {
    onFailure: (result) => {
      if (result.status === 1) return false;
      throw new Error(`git merge-base --is-ancestor ${older} ${newer} failed`);
    },
  }) !== false;

/** The ignored integration receipt `worktree integrate` writes and the
 * selection reads, relative to the launchpad. */
export const integrationReceiptPath = (root) =>
  docRelative(root, "control", "local/integration.json");

const readReceipt = (root) => {
  const file = join(root, integrationReceiptPath(root));
  if (!existsSync(file)) return null;
  if (!containedRegularFile(file, root))
    throw new Error("the integration receipt is not a regular file");
  return JSON.parse(readFileSync(file, "utf8"));
};

/** The paths this order changed in its launchpad worktree. The comparison
 * base is the activation base, the commit the activation checkpoint was
 * taken on, until an integration takes in main; from then on it is the main
 * commit that integration took in, so paths main's merge brought are not
 * counted as the order's. Conflicts resolved at any integration are the
 * order's, even where the resolution kept main's bytes. */
export function closeoutChanges(root, workOrder, { receipt } = {}) {
  const changes = {
    activationBase: null,
    base: null,
    paths: [],
    conflicts: [],
    uncertain: [],
  };
  try {
    const activation = eventsForOrder(readControl(root), workOrder).findLast(
      (event) => event.type === "WorkOrderActivated",
    );
    if (!activation?.checkpointSha)
      throw new Error("its activation recorded no checkpoint");
    changes.activationBase = runGit(
      root,
      [
        "rev-parse",
        "--verify",
        "--quiet",
        `${activation.checkpointSha}^1^{commit}`,
      ],
      {
        onFailure: () => {
          throw new Error(
            `its activation checkpoint ${activation.checkpointSha} is unreadable`,
          );
        },
      },
    );
    if (!isAncestor(root, changes.activationBase, "HEAD"))
      throw new Error("the branch no longer descends from it");
  } catch (error) {
    changes.uncertain.push(`the activation base is unknown: ${error.message}`);
    return changes;
  }
  changes.base = changes.activationBase;
  try {
    const saved = receipt ?? readReceipt(root);
    if (saved && saved.workOrder !== workOrder)
      throw new Error(`it names ${saved.workOrder}`);
    if (saved && isAncestor(root, saved.upstream, changes.activationBase)) {
      // An integration from before this activation took in nothing since.
    } else if (saved) {
      if (!saved.complete) throw new Error("its integration is pending");
      if (
        !isAncestor(root, changes.activationBase, saved.upstream) ||
        !isAncestor(root, saved.upstream, "HEAD")
      )
        throw new Error("the main commit it took in is not on this branch");
      changes.base = saved.upstream;
      changes.conflicts = [
        ...new Set([...(saved.priorAuthored ?? []), ...(saved.authored ?? [])]),
      ];
    }
  } catch (error) {
    changes.uncertain.push(
      `the integration receipt cannot be read: ${error.message}`,
    );
    return changes;
  }
  try {
    changes.paths = [
      ...new Set([
        ...runGitPathList(root, [
          "diff",
          "--no-renames",
          "--name-only",
          "-z",
          changes.base,
          "--",
        ]),
        ...runGitPathList(root, [
          "ls-files",
          "--others",
          "--exclude-standard",
          "-z",
        ]),
      ]),
    ].sort();
  } catch (error) {
    changes.uncertain.push(
      `the changed paths cannot be read: ${error.message}`,
    );
  }
  return changes;
}

const summary = (label, items) =>
  `${label} (${items.slice(0, 3).join(", ")}${items.length > 3 ? ` and ${items.length - 3} more` : ""})`;

/**
 * The checks `order` (an order id or its control state) owes at closeout:
 * `{ workOrder, repositoryId, target, launchpad, reasons }`. `target` is null
 * for a launchpad order; for a target order it names the registered gate's
 * selection and its commands (null when the registration cannot be read).
 * `launchpad` is "complete" once any reason owes that run, "document"
 * otherwise. `runner` is loadCloseoutRunner's result; `receipt` is an
 * integration receipt to read instead of the saved one. It never throws: an
 * unexpected failure is one more uncertain reason, so every reader keeps the
 * complete run on the same terms.
 */
export function closeoutScope(root, order, { runner, receipt } = {}) {
  const workOrder = typeof order === "string" ? order : order?.workOrderId;
  const scope = {
    workOrder,
    repositoryId: null,
    target: null,
    launchpad: "document",
    reasons: [],
  };
  // Each reason recorded here owes the complete run; the document-only
  // reason is written last, and only when none did.
  const owe = (reason) => {
    scope.launchpad = "complete";
    scope.reasons.push(reason);
  };
  const uncertain = (cause) => owe(`the scope is uncertain (${cause})`);
  try {
    select(root, order, scope, { owe, uncertain, runner, receipt });
  } catch (error) {
    uncertain(`the selection failed: ${error.message}`);
  }
  if (scope.launchpad === "document")
    scope.reasons.push(
      "the order's launchpad changes are documents and records, and the paths main's merge adopted are main's, gated there",
    );
  return scope;
}

function select(root, order, scope, { owe, uncertain, runner, receipt }) {
  const { workOrder } = scope;
  // A target order owes its target gate whatever else cannot be read; the
  // review selection stands until the criteria say plain.
  const target = (repositoryId, selection = "review") => {
    scope.repositoryId = repositoryId;
    scope.target = { repositoryId, selection, commands: null };
  };
  let state;
  try {
    state =
      typeof order === "string"
        ? readControl(root).orders.get(order)?.state
        : order;
  } catch (error) {
    uncertain(`the order's control state cannot be read: ${error.message}`);
    return;
  }
  if (state?.repositoryId) target(state.repositoryId);
  let text;
  try {
    if (!state?.workOrderPath)
      throw new Error("its control state names no order");
    text = readFileSync(
      workOrderAuthorityPath(root, workOrder, state.workOrderPath),
      "utf8",
    );
  } catch (error) {
    uncertain(`the order cannot be read: ${error.message}`);
    return;
  }
  let declaration,
    declared = true;
  try {
    declaration = parseRepositoryDeclaration(text, state.workOrderPath);
  } catch (error) {
    declared = false;
    uncertain(error.message);
  }
  const repositoryId = state.repositoryId ?? declaration?.id;
  if (!repositoryId) {
    owe(
      "this is a launchpad order, and the complete run is its own repository's gate",
    );
    return;
  }
  const criteria = declaredCriteria(text);
  const ids = (criteria ?? []).map(({ id }) => id);
  const claims = criterionGateClaims(criteria, ids, { repositoryId });
  target(repositoryId, !criteria || claims.review.length ? "review" : "plain");
  if (declared && declaration?.id !== state.repositoryId)
    uncertain("the order's Repository field differs from its activation");
  try {
    const repository = loadConfig(root).repositories[repositoryId];
    if (!repository)
      throw new Error(`repositories.${repositoryId} is not registered`);
    if (!repository.gate)
      throw new Error(`repositories.${repositoryId} declares no gate`);
    const entry = targetWorktreeForOrder(root, workOrder);
    if (
      !entry ||
      entry.repositoryId !== repositoryId ||
      entry.baseCommit !== state.baseCommit
    )
      throw new Error(
        "the target worktree registration is missing or differs from the activation",
      );
    scope.target.commands = repository.gate[scope.target.selection].map(
      (name) => ({ name, ...repository.gate.commands[name] }),
    );
  } catch (error) {
    uncertain(`the registration cannot be read: ${error.message}`);
  }
  if (!criteria) uncertain("no numbered acceptance criteria can be read");
  // A criterion's own words take precedence over the changed paths: one that
  // names the launchpad's npm test claims what only the complete run shows.
  const launchpadClaims = criterionGateClaims(criteria, ids, {});
  const named = [
    ...new Set([...launchpadClaims.review, ...launchpadClaims.plain]),
  ];
  if (named.length)
    owe(
      `${named.length === 1 ? "criterion" : "criteria"} ${named.join(", ")} ${named.length === 1 ? "names" : "name"} npm test`,
    );
  const changes = closeoutChanges(root, workOrder, { receipt });
  for (const cause of changes.uncertain) uncertain(cause);
  // loadCloseoutRunner returns a suite table or an error. A runner that
  // imports with no table, or an empty one, declares no inputs to classify
  // against, so it is uncertain too.
  const hasSuites = Array.isArray(runner?.suites) && runner.suites.length > 0;
  if (!runner) uncertain("the runner's suite declarations were not loaded");
  else if (!hasSuites)
    uncertain(
      `the runner's suite declarations cannot be read: ${runner.error ?? "the runner exports no suite table"}`,
    );
  if (changes.uncertain.length || !hasSuites) return;
  let classify;
  try {
    classify = classifier(root, workOrder, runner);
  } catch (error) {
    uncertain(`the launchpad paths cannot be classified: ${error.message}`);
    return;
  }
  const kinds = (paths) => {
    const sorted = { machinery: [], unknown: [] };
    for (const path of paths) sorted[classify(path).kind]?.push(path);
    return sorted;
  };
  const changed = kinds(changes.paths),
    resolved = kinds(changes.conflicts);
  if (changed.machinery.length)
    owe(summary("launchpad machinery changed", changed.machinery));
  if (resolved.machinery.length)
    owe(
      summary(
        "a machinery conflict was resolved at integration",
        resolved.machinery,
      ),
    );
  if (changed.unknown.length)
    uncertain(summary("unclassifiable launchpad paths", changed.unknown));
  if (resolved.unknown.length)
    uncertain(
      summary(
        "an unclassifiable conflict was resolved at integration",
        resolved.unknown,
      ),
    );
}

/** The commands for `scope`'s checks, target gate first and the document
 * gate last. `qualified` spells them for a session in the target worktree,
 * where npm would read the target's own package.json. */
export function closeoutCommands(root, scope, { qualified = false } = {}) {
  const runner = (flag) =>
    `${launchpadInvocation(root, "test-runner")} ${flag}`;
  const local = qualified && scope.repositoryId;
  return [
    ...(scope.target
      ? [
          local
            ? targetGateCommand(root, scope.workOrder, scope.target.selection)
            : `node scripts/target-gate.mjs ${scope.workOrder}${scope.target.selection === "review" ? " --review" : ""}`,
        ]
      : []),
    ...(scope.launchpad === "complete"
      ? [local ? runner("--review") : "npm test -- --review"]
      : []),
    local ? runner("--document") : "npm run test:docs",
  ];
}

const because = (scope) =>
  `${scope.launchpad === "complete" ? "The complete launchpad run is owed" : "No complete launchpad run is owed"} because ${scope.reasons.join("; ")}.`;

/** The headings the readers print the selection under. */
export const closeoutHeadings = Object.freeze({
  briefing:
    "Closeout checks owed as the order stands (its closeout selection, not run; npm run resume -- briefing prints it again after an edit or integration)",
  owed: "Owed by this order (its closeout selection; not run)",
});

/** The selection as a reader prints it: a heading, one command per line and
 * the reason. */
export const closeoutText = (root, scope, { heading, qualified } = {}) =>
  `${heading}:\n${closeoutCommands(root, scope, { qualified })
    .map((command) => `  ${command}`)
    .join("\n")}\n${because(scope)}`;

/** One line for a completion's recorded advisories: launchpad-relative
 * commands, so no machine path enters the committed control record. */
export const closeoutAdvisory = (root, scope) =>
  `Closeout selection for ${scope.workOrder}: ${closeoutCommands(root, scope).join("; ")}. ${because(scope)} Completion consumes only the rows its criteria name.`;
