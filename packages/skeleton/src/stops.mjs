// Every stop the kit ships is a row of the table below: a place where a hook
// denies a tool call, a gate task fails a run for a reason other than the
// code under test, or a lifecycle command declines its own job. A row says
// what the stop is, which class it is (what it protects) and where it is
// enforced.
//
// The class decides the level a root starts with. A `work` row guards the
// owner's work or private material from loss or exposure that cannot be
// undone, and refuses in every root. A `record` row guards the kit's own
// records, order or form, a `host` row a property of the machine and a
// `bound` row a budget: these refuse in core, which builds the kit, and
// advise in an instance, where the work goes on. A root's owner sets any of
// them with one line of the `stops` section of dotln.config.json:
// "refuse", "advise" or "off".
//
// A stop enforced in several places is one row, and every place reads that
// row's level. A hook has the levels from the emit, which writes them into
// its configuration; a command reads them from the configuration when it
// runs.

/** What a stop protects: the owner's work, the kit's records, a property of
 * the host or a budget.
 * @typedef {"work" | "record" | "host" | "bound"} StopClass */
/** What a stop does when it is met: deny or fail, say what it found and go
 * on, or say nothing.
 * @typedef {"refuse" | "advise" | "off"} StopLevel */
/** One row of the table. `census` names the rows of the 2026-11-16 census
 * the stop covers. A row with `setBy` keeps a switch of its own, a row with
 * `file` is set in another file (at that path in the default layout;
 * `control` is the same file under a root's control root), and a row with
 * `forward` is a lifecycle command's refusal, listed with its way forward;
 * none of those three has a line in the `stops` section. `effect` is the
 * denied effect a row answers for, and `unit` the feedback unit whose
 * sentence goes with it. `election` names the feature that was a stop's
 * switch before the stop had a level: where a root makes that election and
 * writes no line for the stop, elected it advises and declined it refuses.
 * @typedef {object} StopRow
 * @property {string} id
 * @property {StopClass} class
 * @property {string} protects
 * @property {string} where
 * @property {readonly string[]} census
 * @property {string} [setBy]
 * @property {string} [file]
 * @property {string} [control]
 * @property {string} [forward]
 * @property {string} [effect]
 * @property {string} [unit]
 * @property {string} [election]
 */

export const STOP_CLASSES = Object.freeze(
  /** @type {const} */ (["work", "record", "host", "bound"]),
);
export const STOP_LEVELS = Object.freeze(
  /** @type {const} */ (["refuse", "advise", "off"]),
);

/** @param {string} id @param {StopClass} stopClass @param {string} protects
 * @param {string} where @param {readonly string[]} census
 * @param {Partial<StopRow>} [extra] @returns {StopRow} */
const row = (id, stopClass, protects, where, census, extra = {}) =>
  Object.freeze({
    id,
    class: stopClass,
    protects,
    where,
    census: Object.freeze([...census]),
    ...extra,
  });

const HOOK = "the launchpad's hook";
const TARGET = "a target worktree's hook";
const BOTH = "the launchpad's hook and a target worktree's";
const GATE = "the gate";

/** @type {readonly StopRow[]} */
export const STOPS = Object.freeze([
  // ---- the owner's work and private material: refused in every root
  row(
    "writer-reservation",
    "work",
    "another session's uncommitted work in the same worktree",
    `${BOTH}, and a prompt's dispatch; under Codex, whose tool calls no hook sees, the lifecycle dispatch holds it and refuses at any level`,
    ["S10", "S25", "S26", "S38", "S41"],
    { unit: "concurrent-work-requires-worktrees" },
  ),
  row(
    "outside-write",
    "work",
    "files outside the project, the owner's own settings among them",
    HOOK,
    ["S07"],
  ),
  row(
    "gh-repository",
    "work",
    "a pull request or an issue opened on the wrong repository",
    HOOK,
    ["S05"],
  ),
  row(
    "ssh",
    "work",
    "files sent to another host over ssh, scp or sftp",
    `the host's deny rules the emit writes, and ${TARGET}`,
    ["S03", "S30"],
    { effect: "transport.ssh" },
  ),
  row(
    "package-publish",
    "work",
    "a package published without review",
    `the host's deny rule the emit writes, and ${TARGET}`,
    ["S04", "S30"],
    { effect: "package.publish" },
  ),
  row(
    "credentials-access",
    "work",
    "credentials and environment files read into a session",
    TARGET,
    ["S30"],
    { effect: "credentials.access" },
  ),
  row(
    "user-settings",
    "work",
    "the owner's own settings and instructions outside the worktree",
    TARGET,
    ["S30"],
    { effect: "settings.user" },
  ),
  row(
    "sandbox-disable",
    "work",
    "the host's sandbox around a session's commands",
    TARGET,
    ["S30"],
    { effect: "sandbox.disable" },
  ),
  row(
    "unapproved-remote",
    "work",
    "work pushed to a remote nobody approved",
    TARGET,
    ["S30"],
    { effect: "remote.unapproved" },
  ),
  row(
    "denied-effect",
    "work",
    "whatever a registered repository's authority profile names as denied beyond the kit's six effects",
    TARGET,
    ["S30"],
  ),
  row(
    "target-bundle",
    "work",
    "a target worktree's Git metadata, settings and installed hook files",
    TARGET,
    ["S34"],
  ),
  row(
    "target-publication",
    "work",
    "unreviewed work pushed or proposed from a target worktree",
    TARGET,
    ["S40"],
  ),
  row(
    "attribution",
    "work",
    "the author's rule that no commit or pull request carries AI attribution",
    `the commit-message hook, and ${TARGET}`,
    ["S27", "S41"],
    { unit: "no-attribution" },
  ),
  row(
    "docs-private-path",
    "work",
    "a home directory or private temporary path written into a committed file",
    `${GATE}'s document check`,
    ["S121"],
  ),
  // ---- the kit's own records, order and form: advised in an instance
  row(
    "live-gate",
    "record",
    "the bytes a running gate is judging",
    `${BOTH}, and a prompt's dispatch`,
    ["S08", "S24", "S39"],
  ),
  row(
    "planning-branch",
    "record",
    "a planning pass that stays document-only",
    HOOK,
    ["S09"],
  ),
  row(
    "router",
    "record",
    "a drive's order: its router routes and edits nothing",
    HOOK,
    ["S11", "S12", "S13"],
  ),
  row(
    "worker-gate",
    "record",
    "the launching session's writes, which a worker's gate would lock out",
    BOTH,
    ["S14", "S36"],
  ),
  row(
    "driven-helper",
    "record",
    "one writer for an order's worktrees: a driven worker's helper only reads",
    BOTH,
    ["S15"],
  ),
  row(
    "worker-tasks",
    "record",
    "a worker's background tasks, which would outlive its hand-back",
    HOOK,
    ["S20"],
  ),
  row(
    "target-classification",
    "record",
    "the kit's scoping of a target worktree: a shell line its classifier cannot read",
    TARGET,
    ["S29"],
  ),
  row(
    "target-unlisted-effect",
    "record",
    "the kit's scoping of a target worktree: an effect its compiled authority does not list",
    TARGET,
    ["S30"],
  ),
  row(
    "target-cwd",
    "record",
    "the kit's scoping of a target worktree: a session or a command that runs from a directory other than its root",
    TARGET,
    ["S31"],
  ),
  row(
    "target-destinations",
    "record",
    "the kit's scoping of a target worktree: a command whose write destinations it cannot name",
    TARGET,
    ["S32"],
  ),
  row(
    "target-delegation",
    "record",
    "the kit's worker accounting in a target worktree: an agent launch or an interaction tool",
    TARGET,
    ["S33"],
  ),
  row(
    "driven-roots",
    "record",
    "a driven phase's binding to its order's recorded worktrees",
    TARGET,
    ["S35"],
  ),
  // ---- a property of the host
  row(
    "hook-input",
    "host",
    "the hook protocol: an input the hook cannot decode",
    HOOK,
    ["S19"],
  ),
  row(
    "target-runtime",
    "host",
    "a target worktree's guard: the launchpad's runtime it cannot reach judges nothing",
    TARGET,
    ["S28"],
  ),
  // ---- a budget
  row(
    "dispatch-bound",
    "bound",
    "a dispatch's wall clock and its number of complete runs",
    `${HOOK}, the bounded probe wrapper, a re-dispatch and ${GATE}'s host row`,
    ["S16", "S90", "S102"],
  ),
  row(
    "worker-cap",
    "bound",
    "the worker uses one spawning session may make",
    `${HOOK} and the review helper's own launch`,
    ["S17"],
  ),
  row(
    "driven-budget",
    "bound",
    "the worker uses a whole drive may make",
    `${BOTH}, the review helper's own launch, and the driver before a phase and as it reads the helpers a Codex worker reports`,
    ["S18", "S37"],
  ),
  // ---- gate tasks that fail a run for a reason other than the code under test
  row(
    "gate-format",
    "record",
    "the form of documents and code: what the formatter would rewrite",
    `${GATE}'s format row`,
    ["S94"],
  ),
  row(
    "gate-configuration",
    "record",
    "the form of this root's configuration, roots and registrations",
    `${GATE}'s configuration row`,
    ["S95"],
  ),
  row(
    "gate-registrations",
    "record",
    "the kit's registration records",
    `${GATE}'s registrations row`,
    ["S96"],
  ),
  row(
    "gate-declarations",
    "record",
    "the gate's own bookkeeping: declared suite and fixture inputs",
    `${GATE}'s declarations row`,
    ["S97"],
  ),
  row(
    "gate-generated",
    "record",
    "generated pages and projections kept current",
    `${GATE}'s generated row`,
    ["S98"],
  ),
  row(
    "host-toolchain",
    "host",
    "a Node and a Git at least as new as the kit declares",
    `${GATE}'s host row`,
    ["S99"],
  ),
  row(
    "host-memory",
    "host",
    "the machine's memory under a gate: pressure and the lane budget",
    `${GATE}'s host row`,
    ["S100"],
  ),
  row(
    "host-file-events",
    "host",
    "the machine under a gate: a file-events daemon grown past its limit",
    `${GATE}'s host row`,
    ["S101"],
  ),
  row(
    "gate-kit-verify",
    "record",
    "the carried runtime as its kit manifest records it",
    `${GATE}'s kit verification`,
    ["S103"],
  ),
  row(
    "gate-harness",
    "record",
    "the installed hooks, skills and instruction block as the emit would write them",
    `${GATE}'s harness row`,
    ["S104"],
  ),
  row(
    "host-confinement",
    "host",
    "a gate's own reach: suites that need what a sandbox withholds",
    `${GATE}, before a selection starts`,
    ["S105"],
  ),
  row(
    "gate-release-surfaces",
    "record",
    "version surfaces that agree with the order's declared version",
    `${GATE}'s release-surfaces row`,
    ["S107"],
  ),
  row(
    "gate-license-surfaces",
    "record",
    "license files and markers that agree",
    `${GATE}'s license-surfaces row`,
    ["S108"],
  ),
  row(
    "gate-publication",
    "record",
    "the form of the publication index and its outlines",
    `${GATE}'s publication row`,
    ["S109"],
  ),
  row(
    "docs-product-shape",
    "record",
    "the form of product documents: no new receipt or candidate paragraph",
    `${GATE}'s document check`,
    ["S110"],
  ),
  row(
    "docs-entry-point",
    "record",
    "reader entry points that name standing documents only",
    `${GATE}'s document check`,
    ["S111"],
  ),
  row(
    "docs-moved-path",
    "record",
    "the document move map: no file at a path it lists as moved",
    `${GATE}'s document check`,
    ["S112"],
  ),
  row(
    "docs-red-tag",
    "record",
    "the document lifecycle: a red tag takes a disposition within one pass",
    `${GATE}'s document check`,
    ["S113"],
  ),
  row(
    "docs-decision-form",
    "record",
    "the form of decision records: dispatch lines, operator quotations and round findings",
    `${GATE}'s document check`,
    ["S114", "S118", "S119"],
  ),
  row(
    "docs-instance-records",
    "record",
    "the form of an instance's notes for core and of its area notes",
    `${GATE}'s document check`,
    ["S115", "S116"],
  ),
  row(
    "docs-pattern-reader",
    "record",
    "one reader for each format: no source reads Markdown or JSON with its own pattern",
    `${GATE}'s document check`,
    ["S117"],
  ),
  row(
    "docs-links",
    "record",
    "links and anchors that resolve",
    `${GATE}'s document check`,
    ["S120"],
  ),
  row(
    "docs-front-page",
    "record",
    "the front page's amendment rules",
    `${GATE}'s document check`,
    ["S122"],
  ),
  row(
    "docs-form",
    "record",
    "every other form rule the document check holds over the kit's records",
    `${GATE}'s document check`,
    [],
  ),
  row(
    "gate-index",
    "record",
    "the work-order index and its sequence kept current",
    `${GATE}'s index row`,
    ["S126"],
  ),
  row(
    "gate-siblings",
    "record",
    "the sibling register kept current",
    `${GATE}'s siblings row`,
    ["S127"],
  ),
  row(
    "gate-lineage",
    "record",
    "the lineage index kept current",
    `${GATE}'s lineage row`,
    ["S128"],
  ),
  row(
    "gate-harness-context",
    "record",
    "role instructions whose Read lines resolve",
    `${GATE}'s harness-context row`,
    ["S129"],
  ),
  row(
    "gate-plan-refutation-current",
    "record",
    "current planning receipts that pass their own check",
    `${GATE}'s plan-refutation-current row`,
    ["S130"],
  ),
  row(
    "gate-meta",
    "record",
    "the decisions index, the follow-up register and the features page kept current",
    `${GATE}'s meta row`,
    ["S131"],
  ),
  row(
    "gate-plan",
    "record",
    "the planning record: a pass with its receipt, bound to the current subject",
    `${GATE}'s plan row`,
    ["S132", "S133"],
  ),
  row(
    "gate-reader-profiles",
    "record",
    "reader profiles whose choices, anchors and hashes agree",
    `${GATE}'s reader-profiles row`,
    ["S134"],
  ),
  row(
    "gate-entropy",
    "record",
    "entropy receipts that are valid",
    `${GATE}'s entropy row`,
    ["S135"],
  ),
  // ---- the author's rule on the operator's own words, which the document
  // check holds a branch to. It reads every file under the ignored intake
  // root as the operator's words, so text an owner pasted for use meets it
  // too: a record row, which advises in an instance.
  row(
    "verbatim-operator-words",
    "record",
    "the author's rule that committed text paraphrases the operator",
    `${GATE}'s document check`,
    ["S123", "S124"],
    { election: "verbatim-operator-words" },
  ),
  // ---- stops with a switch of their own, which they keep
  row(
    "desktop-control",
    "work",
    "the operator's own signed-in desktop and browser sessions",
    `${HOOK} and the host's deny rules the emit writes; ${TARGET} admits none, whatever the election`,
    ["S01", "S02"],
    { setBy: "features.desktop-control" },
  ),
  row(
    "plan-first",
    "record",
    "the plan-first order of work: a reviewed plan before implementation",
    `${BOTH}, and the executor's completion`,
    ["S06", "S50"],
    { setBy: "features.plan-first" },
  ),
  row(
    "starter-update-request",
    "record",
    "who decides an update: a newer starter release is taken on the operator's request",
    "the starter update",
    ["S69"],
    { setBy: "features.auto-update-upstream" },
  ),
  row(
    "kit-instance-actions",
    "record",
    "an instance's own files, which a kit update's actions would change",
    "the kit update's apply step",
    ["S70"],
    { setBy: "kit.applyInstanceActions" },
  ),
  // ---- stops set in a file of their own
  row(
    "private-terms",
    "work",
    "the owner's private terms: an entry in the list's refuse class refuses at any level",
    `${GATE}'s terms row and every publish`,
    ["S125", "S67", "S77"],
    { file: "docs/control/local/terms.txt", control: "local/terms.txt" },
  ),
  row(
    "time-limits",
    "bound",
    "the time a gate task, a check a task runs or a probe may take",
    `${GATE} and the bounded probe wrapper`,
    ["S106", "S136"],
    { file: "docs/control/time-limits.json", control: "time-limits.json" },
  ),
  // ---- what a lifecycle command declines, with the way forward
  row(
    "command-phase",
    "record",
    "the lifecycle's order: an action that is not legal in the order's phase",
    "npm run resume, and the prompt hook that reports its answer",
    ["S21", "S22", "S23", "S42", "S43"],
    {
      forward:
        "run one of the legal actions the message lists; npm run resume -- status prints them",
    },
  ),
  row(
    "command-attestation",
    "record",
    "the record's accuracy: a completion states the model, effort and version that ran",
    "npm run resume",
    ["S44"],
    { forward: "state the flags the message names" },
  ),
  row(
    "command-headers",
    "record",
    "the form of an order's Model and Effort lines and of a report's actor header",
    "npm run resume",
    ["S45", "S46"],
    { forward: "write the line or the header the message prints" },
  ),
  row(
    "command-reactivation",
    "record",
    "an order's history: a withdrawn order is reactivated with a new dated note",
    "npm run resume",
    ["S47"],
    { forward: "add the dated note to the order, then activate it" },
  ),
  row(
    "command-own-off-ramp",
    "record",
    "a review's independence: an order's executor records no waiver, defect or retraction of its own",
    "npm run resume",
    ["S48"],
    {
      forward:
        "the verifier, the final reviewer or the operator records it from its own session",
    },
  ),
  row(
    "command-activation",
    "record",
    "the sequence: an umbrella record, a blocked order or an unregistered repository is not activated",
    "npm run resume and worktree start",
    ["S49", "S74"],
    {
      forward:
        "activate the successor the message names, finish the order it waits on, or register the repository",
    },
  ),
  row(
    "command-completion",
    "record",
    "the completion record: every criterion judged, with a passing gate row at the current identity",
    "npm run resume, at each phase's completion",
    ["S51", "S52", "S53", "S54", "S55", "S56"],
    {
      forward:
        "judge each criterion in handoff.md and run the gate the message names; it consumes the row and runs none itself",
    },
  ),
  row(
    "command-stored-body",
    "record",
    "a pull request's stored text, which matches the record's criterion lines",
    "npm run resume and worktree publish",
    ["S57"],
    { forward: "prepare the stored body again from the current record" },
  ),
  row(
    "command-record-rules",
    "record",
    "records that are not rewritten: a correction changes no verdict and moves no report",
    "npm run resume (target records, correct, waive, defect, retract, reopen-handoff, accept-overrun)",
    ["S58", "S59", "S60", "S61"],
    { forward: "each refusal names the form or the worktree that admits it" },
  ),
  row(
    "command-main-worktree",
    "record",
    "the control plane: commands that read it need one checkout on the main branch",
    "the lifecycle commands that locate the main checkout",
    ["S62"],
    { forward: "check out the main branch in one worktree of the repository" },
  ),
  row(
    "command-planning",
    "record",
    "a planning pass's base, register and review: a clean main, a current register, a committed subject",
    "npm run plan",
    ["S63", "S64", "S65", "S66"],
    {
      forward:
        "commit or set aside the changes on main, run npm run meta for a stale register, and refute a committed subject once",
    },
  ),
  row(
    "command-publish",
    "work",
    "what leaves the machine through a planning or update publish: private terms, unreviewed lines, the wrong origin",
    "the planning and update publish",
    ["S67", "S68"],
    {
      forward:
        "reword the line the message names by file and line, or register the private terms list (an empty one refuses nothing)",
    },
  ),
  row(
    "command-update",
    "work",
    "an instance's own edits, which an update's merge must not drop",
    "the starter update",
    ["S71", "S72"],
    { forward: "each refusal names the step that takes the update further" },
  ),
  row(
    "command-worktree",
    "work",
    "work a worktree command would lose or publish unreviewed: stashed changes, intake, an unmerged order",
    "npm run worktree (start, integrate, publish, finish, settle)",
    ["S75", "S76", "S77", "S78", "S79", "S80", "S81", "S82"],
    {
      forward:
        "each refusal names what to finish first: the final review, the merge, the named backup or the running gate",
    },
  ),
  row(
    "command-release",
    "work",
    "a release of reviewed, merged work alone, from a synced main",
    "npm run release (prepare, close)",
    ["S83", "S84", "S85"],
    {
      forward:
        "close the order, merge it and sync main; sign in to gh where the message says so",
    },
  ),
  row(
    "command-target-publish",
    "work",
    "what is published to a sibling repository: a reviewed change without the launchpad's records",
    "the target publish and target draft",
    ["S40", "S86"],
    {
      forward:
        "pass the final review and the target's gate; an owner who wants to push without them uses Git",
    },
  ),
  row(
    "command-configuration",
    "record",
    "the form of dotln.config.json, the budgets file and the build overlay",
    "every command that loads them",
    ["S87", "S88", "S89"],
    {
      forward:
        "correct the key the message names; npm run features -- list prints the known ones",
    },
  ),
  row(
    "command-toolchain",
    "host",
    "a harness check or an evidence run under a Node or a Git older than the kit declares",
    "node scripts/harness.mjs check and evidence",
    ["S91"],
    { forward: "install the Node and the Git package.json engines names" },
  ),
  row(
    "command-drive-override",
    "record",
    "recovery before routing: a drive does not start while an override is open",
    "the drive router",
    ["S92"],
    { forward: "leave the override with operator override: off" },
  ),
  row(
    "command-package-publish",
    "work",
    "a package of the kit published to a registry",
    "each package's own prepublish script",
    ["S93"],
    {
      forward:
        "the kit's packages are not published; an instance takes them through the starter",
    },
  ),
]);

/** The stop each gate task is, for the tasks that hold one check: a task
 * that fails is that stop met. The document check and the host row hold
 * checks of more than one stop and say themselves which each failure is. A
 * task the table leaves out is the code under test and fails as it always
 * did.
 * @type {Readonly<Record<string, string>>} */
export const GATE_TASK_STOPS = Object.freeze({
  format: "gate-format",
  configuration: "gate-configuration",
  registrations: "gate-registrations",
  declarations: "gate-declarations",
  generated: "gate-generated",
  "kit-verify": "gate-kit-verify",
  harness: "gate-harness",
  "release-surfaces": "gate-release-surfaces",
  "license-surfaces": "gate-license-surfaces",
  publication: "gate-publication",
  index: "gate-index",
  siblings: "gate-siblings",
  lineage: "gate-lineage",
  "harness-context": "gate-harness-context",
  "plan-refutation-current": "gate-plan-refutation-current",
  meta: "gate-meta",
  plan: "gate-plan",
  "reader-profiles": "gate-reader-profiles",
  entropy: "gate-entropy",
});

/** The line a gate task that holds several stops prints when it exits zero
 * with failures that advised: the prefix, then the stops as a JSON array.
 * The runner reads it to record the task as advised and not as passed. */
export const ADVISED_STOPS_LINE = "DOTLN_ADVISED_STOPS ";

/** Failures sorted by the level of the stop each is. `levelOf` gives a
 * stop's level in the root; a failure whose stop has no line in the `stops`
 * section (one with a switch or a file of its own) refuses.
 * @template {{stop: string}} T
 * @param {readonly T[]} failures @param {(id: string) => StopLevel} levelOf
 * @returns {{refused: T[], advised: T[], off: T[]}} */
export function failuresByLevel(failures, levelOf) {
  /** @type {{refused: T[], advised: T[], off: T[]}} */
  const sorted = { refused: [], advised: [], off: [] };
  for (const failure of failures) {
    const entry = byId.get(failure.stop);
    const level =
      entry && stopSettable(entry) ? levelOf(failure.stop) : "refuse";
    sorted[
      level === "advise" ? "advised" : level === "off" ? "off" : "refused"
    ].push(failure);
  }
  return sorted;
}

/** @type {ReadonlyMap<string, StopRow>} */
const byId = new Map(STOPS.map((entry) => [entry.id, entry]));

/** The row of one stop, and none for an id the table does not hold.
 * @param {string} id @returns {StopRow | undefined} */
export const stopRow = (id) => byId.get(id);

/** Whether a row's level is a line of the `stops` section: one with no
 * switch or file of its own that is no lifecycle command's refusal.
 * @param {StopRow} entry */
export const stopSettable = (entry) =>
  entry.setBy === undefined &&
  entry.file === undefined &&
  entry.forward === undefined;

/** The stop that answers for a denied effect: the kit's own row for one of
 * its six, and the one row for any other effect an authority profile names.
 * @param {string} effect */
export const deniedEffectStop = (effect) =>
  STOPS.find((entry) => entry.effect === effect)?.id ?? "denied-effect";

/** The level a row has where nothing sets it: a work row refuses in every
 * root, and any other row refuses in core and advises in an instance.
 * @param {StopRow} entry @param {boolean} instance @returns {StopLevel} */
export const stopDefault = (entry, instance) =>
  entry.class === "work" || !instance ? "refuse" : "advise";

/** @param {unknown} value @returns {value is StopLevel} */
const isLevel = (value) =>
  typeof value === "string" &&
  /** @type {readonly string[]} */ (STOP_LEVELS).includes(value);

/** A declared `stops` section read against the table: the levels it sets,
 * and one advisory for each line that sets nothing. A line that names no
 * settable stop or no level is named and ignored, so that a mistyped line
 * stops no command.
 * @param {unknown} declared
 * @returns {{levels: Record<string, StopLevel>, advisories: string[]}} */
export function readStopsSection(declared) {
  /** @type {Record<string, StopLevel>} */
  const levels = {};
  /** @type {string[]} */
  const advisories = [];
  if (declared === undefined) return { levels, advisories };
  if (
    declared === null ||
    typeof declared !== "object" ||
    Array.isArray(declared)
  ) {
    advisories.push(
      'stops in dotln.config.json is not an object of "<stop id>": "refuse" | "advise" | "off" and sets nothing; npm run features -- list prints the stops',
    );
    return { levels, advisories };
  }
  for (const [id, value] of Object.entries(declared)) {
    const entry = byId.get(id);
    if (!entry)
      advisories.push(
        `stops.${id} in dotln.config.json names no stop and sets nothing; npm run features -- list prints the stops`,
      );
    else if (!stopSettable(entry))
      advisories.push(
        `stops.${id} in dotln.config.json sets nothing: ${
          entry.setBy
            ? `that stop keeps its own switch, ${entry.setBy}`
            : entry.file
              ? `that stop is set in ${entry.file}`
              : `that is a lifecycle command's refusal (${entry.forward})`
        }`,
      );
    else if (!isLevel(value))
      advisories.push(
        `stops.${id} in dotln.config.json is ${JSON.stringify(value)}, which is no level, and sets nothing; a level is ${STOP_LEVELS.join(", ")}`,
      );
    else levels[id] = value;
  }
  return { levels, advisories };
}

/** The level of one stop in a root and where it comes from: the root's own
 * line when it has one; else, for a stop that had a switch before it had a
 * level, the election the root makes of that feature (`elections` holds the
 * ones its configuration declares, true or false); otherwise the kit's
 * default for the row's class.
 * @param {string} id
 * @param {{instance: boolean, stops?: Readonly<Record<string, StopLevel>>, elections?: Readonly<Record<string, boolean>>}} root
 * @returns {{level: StopLevel, source: string}} */
export function resolveStop(id, { instance, stops = {}, elections = {} }) {
  const entry = byId.get(id);
  if (!entry || !stopSettable(entry))
    throw new Error(`no settable stop: ${id}`);
  const declared = Object.hasOwn(stops, id) ? stops[id] : undefined;
  if (declared !== undefined)
    return { level: declared, source: "dotln.config.json" };
  if (entry.election !== undefined && Object.hasOwn(elections, entry.election))
    return {
      level: elections[entry.election] ? "advise" : "refuse",
      source: `features.${entry.election}`,
    };
  return { level: stopDefault(entry, instance), source: "kit" };
}

/** Every settable stop's level in a root.
 * @param {{instance: boolean, stops?: Readonly<Record<string, StopLevel>>, elections?: Readonly<Record<string, boolean>>}} root
 * @returns {Record<string, StopLevel>} */
export const resolveStopLevels = (root) =>
  Object.fromEntries(
    STOPS.filter(stopSettable).map((entry) => [
      entry.id,
      resolveStop(entry.id, root).level,
    ]),
  );

/** The levels a hook's configuration carries: the stops that do not refuse.
 * A stop the map leaves out refuses, so a hook written before a level was
 * lowered, or one that carries no map, denies as it always did.
 * @param {Readonly<Record<string, StopLevel>>} levels
 * @returns {Record<string, "advise" | "off">} */
export const loweredStops = (levels) =>
  /** @type {Record<string, "advise" | "off">} */ (
    Object.fromEntries(
      Object.entries(levels)
        .filter(([, level]) => level !== "refuse")
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
    )
  );

/** The level a hook or a command answers at, from the lowered map alone.
 * @param {Readonly<Record<string, string>> | undefined} lowered
 * @param {string} id @returns {StopLevel} */
export const stopLevelIn = (lowered, id) => {
  const level = lowered && Object.hasOwn(lowered, id) ? lowered[id] : undefined;
  return level === "advise" || level === "off" ? level : "refuse";
};

/** The line of dotln.config.json that gives a stop a level.
 * @param {string} id @param {StopLevel} level */
export const stopLine = (id, level) => `"stops": { "${id}": "${level}" }`;

const withoutCode = (/** @type {string} */ reason) =>
  reason.replace(/^DOTLN_[A-Z_]+: /u, "");

/** What a refusal that remains says after its reason: the stop's id, what
 * it protects and the line that lowers it. A level is its owner's to
 * change, so the text names the owner and never a recovery control. `hook`
 * adds the emit that carries a new level into the hooks, and `covered` says
 * where the line is written when the refusal covers the configuration file
 * itself.
 * @param {string} id @param {string} reason
 * @param {{hook?: boolean, covered?: string}} [options] */
export function stopRefusal(id, reason, { hook = false, covered } = {}) {
  const entry = byId.get(id);
  if (!entry) return reason;
  const found = reason.trimEnd();
  return `${/[.!?]$/u.test(found) ? found : `${found}.`} This is stop ${id}, which protects ${entry.protects}. Its level is this root's owner's to set: ${stopLine(id, "advise")} in dotln.config.json${covered ? ` (${covered})` : ""}${hook ? ", then node scripts/harness.mjs emit" : ""}; a session changes it only when its owner asks.`;
}

/** What a stop says when it advises and the work goes on: what it found,
 * its id, what it protects and the line that makes it refuse or be quiet.
 * @param {string} id @param {string} reason */
export function stopAdvisory(id, reason) {
  const entry = byId.get(id);
  const found = withoutCode(reason)
    .trimEnd()
    .replace(/[.;]+$/u, "");
  if (!entry) return found;
  return `${found}. Stop ${id} advises in this root and the work goes on; it protects ${entry.protects}. ${stopLine(id, "refuse")} in dotln.config.json makes it refuse and "off" silences it`;
}
