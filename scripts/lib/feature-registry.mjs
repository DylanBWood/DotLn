// The feature inventory's registry and its alias resolver, in a module that
// imports no configuration reader: scripts/lib/config.mjs validates a
// declared features section through them, and scripts/lib/features.mjs reads
// the elections with loadConfig, so neither module reaches the other while it
// is evaluated (WO-241-D017, broken by WO-257).
const row = (id, scope, defaultValue, what, readFrom, readBy) =>
  Object.freeze({ id, scope, default: defaultValue, what, readFrom, readBy });

/** One inventory: selections and existing budget keys stay at their own addresses. */
export const featureRegistry = Object.freeze([
  row(
    "tinkerer-economy",
    "instance",
    true,
    "Equips the executor to compare two credible approaches when a useful fork appears.",
    "features.tinkerer-economy",
    "scripts/lib/harness.mjs",
  ),
  row(
    "plan-first",
    "instance",
    false,
    "Requires a reviewed plan, persistent conversation and complete candidate diff before implementation.",
    "features.plan-first",
    "packages/skeleton/src/harness-host.ts",
  ),
  row(
    "private-destination",
    "instance",
    false,
    "Admits the owner's ordinary project links and identifiers inside an exported instance; credentials and outward publication screens stay protected.",
    "features.private-destination",
    "scripts/lib/harness.mjs",
  ),
  row(
    "desktop-control",
    "instance",
    false,
    "Permits desktop and operator-browser tools only with the operator's explicit request in the session.",
    "features.desktop-control",
    "packages/skeleton/src/harness-host.ts",
  ),
  row(
    "kit-instance-actions",
    "instance",
    false,
    "Allows a kit update to apply its declared instance actions.",
    "kit.applyInstanceActions",
    "scripts/launchpad.mjs",
  ),
  // A host's surfaces are an election: off by default, inferred on from the
  // instance's own committed record (WO-258).
  ...[
    ["codex", "Codex"],
    ["copilot", "Copilot"],
  ].map(([id, name]) =>
    row(
      `host-${id}`,
      "instance",
      false,
      `Emits the ${name} host's surfaces and puts its profile in the bundle. Undeclared, it is on when the committed control log attests a session on the host or the discovery record observed its version.`,
      `features.host-${id}`,
      "scripts/lib/harness.mjs",
    ),
  ),
  row(
    "auto-update-upstream",
    "instance",
    false,
    "Lets a planning or entropy pass's session take a newer starter release without recording the operator's in-session request.",
    "features.auto-update-upstream",
    "scripts/launchpad.mjs",
  ),
  // The operator's words stay out of committed text unless an instance turns
  // that rule off here; the document gate then advises instead of failing.
  row(
    "verbatim-operator-words",
    "instance",
    false,
    "Turns off the rule that committed text paraphrases the operator: the document gate's verbatim screen and its attributed-speech check advise instead of failing.",
    "features.verbatim-operator-words",
    "scripts/docs-check.mjs",
  ),
  ...[
    ["readme-block", "readmeBlock", "the README release block"],
    ["component-versions", "componentVersions", "component version surfaces"],
    ["corpus", "corpus", "release corpus surfaces"],
    ["publication-check", "publicationCheck", "the publication check"],
  ].map(([id, key, what]) =>
    row(
      `release-${id}`,
      "core",
      true,
      `Declares an election for ${what}; no consumer implements this switch yet.`,
      `release.${key}`,
      "unread",
    ),
  ),
  row(
    "build-loadout",
    "both",
    null,
    "Stores a build selection; no consumer reads this key yet (the CLI has a separate --loadout option).",
    "build.loadout",
    "unread",
  ),
  row(
    "build-profile",
    "both",
    null,
    "Stores a harness profile selection; no consumer reads this key yet (the CLI has a separate --profile option).",
    "build.profile",
    "unread",
  ),
  row(
    "build-overlay",
    "instance",
    null,
    "Selects the instance-owned equipment and authority overlay, including build none.",
    "build.overlay",
    "scripts/lib/harness.mjs",
  ),
  row(
    "drive-sandbox",
    "instance",
    "host",
    "Uses the host's sandbox policy, or off for unsandboxed driven phase sessions.",
    "drive.sandbox",
    "scripts/lib/drive-worker.mjs",
  ),
  row(
    "subagent-cap",
    "both",
    20,
    "Bounds worker uses per spawning session; null removes this bound. It is read from the configured control root, as the process readers are.",
    "budgets.subagentCap",
    "packages/skeleton/src/subagent-budget.ts",
  ),
  row(
    "dispatch-bounds",
    "both",
    null,
    "Declares per-role process limits; null leaves a bound unset and local-median uses this instance's history.",
    "budgets.dispatches",
    "scripts/lib/process-budget.mjs",
  ),
  row(
    "driven-session-ceiling",
    "both",
    80,
    "Bounds all descendant worker uses in a drive; null removes this bound.",
    "budgets.drivenSessionCeiling",
    "scripts/lib/drive-session.mjs",
  ),
  row(
    "driven-phase-timeout",
    "both",
    null,
    "Optionally bounds a driven phase's host timeout; null sets no extra timeout.",
    "budgets.drivenPhaseTimeoutMs",
    "scripts/lib/drive-session.mjs",
  ),
  row(
    "retention",
    "both",
    Object.freeze({
      "gate-fixture-passed": 0,
      "gate-fixture-failed": 24,
      "session-scratch": 24,
      "worker-capture": 1,
      "warm-fixture": 0,
      "legacy-backfill": 48,
      coordination: null,
      "closed-journal": 720,
    }),
    "Sets temporary-root retention by class; null keeps a class and an absent contract uses runtime defaults.",
    "budgets.retention",
    "packages/skeleton/src/temporary-root-records.mjs",
  ),
  row(
    "prune-start-budget",
    "both",
    1800000,
    "Bounds the routine prune at plan start and release close; the prune stops there, says what remains and how to resume, and the command goes on. null removes the bound.",
    "budgets.prune.startBudgetMs",
    "scripts/lib/temporary-prune-summary.mjs",
  ),
]);

/** A rename ships with { successor, release }; in the following kit release
 * the same tombstone refuses. No existing feature has been renamed yet. */
export const featureAliases = Object.freeze({});
export function resolveFeatureId(
  id,
  {
    registry = featureRegistry,
    aliases = featureAliases,
    release,
    advisory = (message) => console.warn(`Advisory: ${message}`),
  } = {},
) {
  const alias = Object.hasOwn(aliases, id) ? aliases[id] : undefined;
  if (alias) {
    if (release !== alias.release)
      throw new Error(
        `retired feature ${JSON.stringify(id)}; use features.${alias.successor}; npm run features -- list`,
      );
    advisory(
      `feature ${id} is renamed to ${alias.successor}; use features.${alias.successor} before the next kit release`,
    );
    id = alias.successor;
  }
  const entry = registry.find((candidate) => candidate.id === id);
  if (!entry)
    throw new Error(
      `unknown features key ${JSON.stringify(id)}; known ids: ${registry.map((candidate) => candidate.id).join(", ")}; npm run features -- list`,
    );
  if (entry.readFrom !== `features.${id}`)
    throw new Error(
      `features.${id} is not an election here; edit ${entry.readFrom}; npm run features -- list`,
    );
  return id;
}
