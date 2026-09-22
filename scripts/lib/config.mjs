import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CONFIG_FILENAME = "dotln.config.json";
export const CONFIG_SCHEMA_VERSION = 1;

/** The one root derivation the control plane owns: the checkout that holds the
 * running scripts. Kit paths (`packages/`, `node_modules/`) live here; every
 * document root is resolved from a launchpad instead, so a script that only
 * reads documents never needs this. */
export const TOOL_ROOT = resolve(
  fileURLToPath(new URL("../../", import.meta.url)),
);

// Every document root this control plane resolves, with the segment its
// default carries under the document base. `workstreams` is declared by the
// WO-033 phase 1 schema and carries no control-plane surface yet.
const ROOT_SEGMENTS = {
  control: "control",
  workOrders: "work-orders",
  verifications: "verifications",
  finalReviews: "final-reviews",
  evidence: "evidence",
  releases: "releases",
  planning: "planning",
  publication: "publication",
  intake: "intake",
  workstreams: "workstreams",
  lineage: "lineage",
  product: "product",
  discovery: "discovery",
  observations: "observations",
  decisions: "decisions",
};

// Roots whose default is carried by another root, so that moving the parent
// moves the child unless the launchpad declares the child separately.
const NESTED_SEGMENTS = {
  orders: ["control", "orders"],
  derivedWorkOrders: ["workOrders", "derived"],
  refutations: ["planning", "refutations"],
};

const DEFAULT_DOCUMENT_BASE = "docs";

export const ROOT_KEYS = [
  "docs",
  ...Object.keys(ROOT_SEGMENTS),
  ...Object.keys(NESTED_SEGMENTS),
];

const BUILD_KEYS = ["loadout", "profile", "overlay"];
const RELEASE_KEYS = [
  "readmeBlock",
  "componentVersions",
  "corpus",
  "publicationCheck",
];
const REPOSITORY_KEYS = [
  "baseBranch",
  "worktreeParent",
  "repositoryClass",
  "authorityProfile",
];
const AUTHORITY_PROFILE_KEYS = [
  "authorityEnvelopeId",
  "allowedEffects",
  "deniedEffects",
  "resourceLimits",
  "requiredEvidence",
  "expiresAt",
  "revocationEventTypes",
  "revocationConditions",
];
const PREDICATE_REF_KEYS = ["registryId", "version", "params"];
const SECTION_KEYS = [
  "version",
  "roots",
  "repositories",
  "build",
  "release",
  "derivedOrders",
  "portfolios",
];
// WO-100: the reviewed text of a preauthorized portfolio. The skeleton's
// `decodePortfolio` re-validates the same shape and admits it under the floor.
const PORTFOLIO_KEYS = [
  "version",
  "repo",
  "mechanics",
  "surfaces",
  "phases",
  "budget",
  "verification",
];
const PORTFOLIO_MECHANICS = ["sort", "shine", "standardize"];
const CANDIDATE_KINDS = [
  "failing-lint",
  "failing-test",
  "misplaced-file",
  "stale-generated",
  "repeated-repair",
];

/** Today's layout, byte for byte: the defaults an absent configuration means. */
export const defaultRoots = () => resolveRoots({});

const resolveRoots = (declared) => {
  const roots = { docs: declared.docs ?? DEFAULT_DOCUMENT_BASE };
  for (const [key, segment] of Object.entries(ROOT_SEGMENTS))
    roots[key] = declared[key] ?? `${roots.docs}/${segment}`;
  for (const [key, [parent, segment]] of Object.entries(NESTED_SEGMENTS))
    roots[key] = declared[key] ?? `${roots[parent]}/${segment}`;
  return roots;
};

const refuse = (path, detail) =>
  new Error(`invalid DotLn configuration in ${path}: ${detail}`);

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireObject = (path, value, label) => {
  if (!isPlainObject(value)) throw refuse(path, `${label} must be an object`);
  return value;
};

const requireKnownKeys = (path, value, known, label) => {
  for (const key of Object.keys(value))
    if (!known.includes(key))
      throw refuse(
        path,
        `unknown ${label} key ${JSON.stringify(key)}; known keys: ${known.join(", ")}`,
      );
};

const requireText = (path, value, label, pattern) => {
  if (
    typeof value !== "string" ||
    !value ||
    /[\u0000-\u001f\u007f\u2028\u2029]/u.test(value) ||
    (pattern && !pattern.test(value))
  )
    throw refuse(path, `${label} must be a non-empty valid string`);
  return value;
};

const validateEffectPatterns = (path, value, label) => {
  if (
    !Array.isArray(value) ||
    value.some(
      (entry) =>
        typeof entry !== "string" ||
        !entry ||
        /[\s\u0000-\u001f\u007f]/u.test(entry) ||
        entry === "*" ||
        (entry.includes("*") && !/^[^*]+\*$/u.test(entry)),
    )
  )
    throw refuse(
      path,
      `${label} must be an array of exact ids or non-empty terminal-prefix patterns`,
    );
  return [...new Set(value)];
};

const validateStringSet = (path, value, label) => {
  if (
    !Array.isArray(value) ||
    value.some(
      (entry) =>
        typeof entry !== "string" ||
        !entry ||
        /[\u0000-\u001f\u007f\u2028\u2029]/u.test(entry),
    )
  )
    throw refuse(path, `${label} must be an array of non-empty strings`);
  return [...new Set(value)];
};

const validatePredicateRef = (path, value, label) => {
  requireObject(path, value, label);
  requireKnownKeys(path, value, PREDICATE_REF_KEYS, label);
  const registryId = requireText(path, value.registryId, `${label}.registryId`);
  if (!Number.isSafeInteger(value.version) || value.version < 1)
    throw refuse(path, `${label}.version must be a positive safe integer`);
  if (value.params !== undefined)
    requireObject(path, value.params, `${label}.params`);
  return {
    registryId,
    version: value.version,
    ...(value.params === undefined
      ? {}
      : { params: structuredClone(value.params) }),
  };
};

const validateAuthorityProfile = (path, id, value) => {
  const label = `repositories.${id}.authorityProfile`;
  requireObject(path, value, label);
  requireKnownKeys(path, value, AUTHORITY_PROFILE_KEYS, label);
  const resourceLimits = requireObject(
    path,
    value.resourceLimits,
    `${label}.resourceLimits`,
  );
  for (const [resource, limit] of Object.entries(resourceLimits)) {
    requireText(path, resource, `${label}.resourceLimits key`);
    if (!Number.isSafeInteger(limit) || limit < 0)
      throw refuse(
        path,
        `${label}.resourceLimits.${resource} must be a non-negative safe integer`,
      );
  }
  if (!Number.isSafeInteger(value.expiresAt) || value.expiresAt < 0)
    throw refuse(
      path,
      `${label}.expiresAt must be a non-negative safe integer`,
    );
  if (
    value.revocationConditions !== undefined &&
    !Array.isArray(value.revocationConditions)
  )
    throw refuse(path, `${label}.revocationConditions must be an array`);
  return {
    authorityEnvelopeId: requireText(
      path,
      value.authorityEnvelopeId,
      `${label}.authorityEnvelopeId`,
    ),
    allowedEffects: validateEffectPatterns(
      path,
      value.allowedEffects,
      `${label}.allowedEffects`,
    ),
    deniedEffects: validateEffectPatterns(
      path,
      value.deniedEffects,
      `${label}.deniedEffects`,
    ),
    resourceLimits: { ...resourceLimits },
    requiredEvidence: validateStringSet(
      path,
      value.requiredEvidence,
      `${label}.requiredEvidence`,
    ),
    expiresAt: value.expiresAt,
    revocationEventTypes: validateStringSet(
      path,
      value.revocationEventTypes,
      `${label}.revocationEventTypes`,
    ),
    ...(value.revocationConditions === undefined
      ? {}
      : {
          revocationConditions: value.revocationConditions.map((entry, index) =>
            validatePredicateRef(
              path,
              entry,
              `${label}.revocationConditions[${index}]`,
            ),
          ),
        }),
  };
};

// A root is a relative POSIX path inside the launchpad. Absolute paths,
// traversal and separators outside the launchpad are refused by name.
const validateRootPath = (path, key, value) => {
  if (typeof value !== "string" || value === "")
    throw refuse(path, `roots.${key} must be a non-empty string`);
  if (value.includes("\\"))
    throw refuse(path, `roots.${key} must use "/" separators: ${value}`);
  if (value.startsWith("/"))
    throw refuse(
      path,
      `roots.${key} must be relative to the launchpad: ${value}`,
    );
  const segments = value.split("/");
  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  )
    throw refuse(
      path,
      `roots.${key} must name a contained relative path without "." or "..": ${value}`,
    );
  return value;
};

const validateDeclaredRoots = (path, declared) => {
  requireObject(path, declared, "roots");
  requireKnownKeys(path, declared, ROOT_KEYS, "roots");
  const validated = {};
  for (const [key, value] of Object.entries(declared))
    validated[key] = validateRootPath(path, key, value);
  return validated;
};

const validateBuild = (path, declared) => {
  requireObject(path, declared, "build");
  requireKnownKeys(path, declared, BUILD_KEYS, "build");
  const build = { loadout: null, profile: null, overlay: null };
  for (const key of BUILD_KEYS) {
    if (declared[key] === undefined) continue;
    if (typeof declared[key] !== "string" || declared[key] === "")
      throw refuse(path, `build.${key} must be a non-empty string`);
    build[key] = declared[key];
  }
  return build;
};

const validateRelease = (path, declared) => {
  requireObject(path, declared, "release");
  requireKnownKeys(path, declared, RELEASE_KEYS, "release");
  const release = Object.fromEntries(RELEASE_KEYS.map((key) => [key, true]));
  for (const key of RELEASE_KEYS) {
    if (declared[key] === undefined) continue;
    if (typeof declared[key] !== "boolean")
      throw refuse(path, `release.${key} must be a boolean`);
    release[key] = declared[key];
  }
  return release;
};

const validateRepositories = (path, declared) => {
  requireObject(path, declared, "repositories");
  const repositories = {};
  for (const [id, value] of Object.entries(declared)) {
    requireText(
      path,
      id,
      "repository id",
      /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u,
    );
    if (id === "self")
      throw refuse(
        path,
        "repositories.self is implicit and cannot be declared",
      );
    requireObject(path, value, `repositories.${id}`);
    requireKnownKeys(path, value, REPOSITORY_KEYS, `repositories.${id}`);
    const baseBranch = requireText(
      path,
      value.baseBranch,
      `repositories.${id}.baseBranch`,
      /^\S+$/u,
    );
    const worktreeParent = requireText(
      path,
      value.worktreeParent,
      `repositories.${id}.worktreeParent`,
    );
    if (
      worktreeParent.startsWith("/") ||
      worktreeParent.includes("\\") ||
      posix.normalize(worktreeParent) !== worktreeParent ||
      worktreeParent.split("/").some((segment) => !segment || segment === ".")
    )
      throw refuse(
        path,
        `repositories.${id}.worktreeParent must be a relative normalized POSIX path`,
      );
    repositories[id] = {
      id,
      baseBranch,
      worktreeParent,
      repositoryClass: requireText(
        path,
        value.repositoryClass,
        `repositories.${id}.repositoryClass`,
        /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u,
      ),
      authorityProfile: validateAuthorityProfile(
        path,
        id,
        value.authorityProfile,
      ),
    };
  }
  return repositories;
};

const validateDerivedOrders = (path, declared = {}) => {
  requireObject(path, declared, "derivedOrders");
  requireKnownKeys(path, declared, ["first", "last"], "derivedOrders");
  const first = declared.first ?? "WO-900";
  const last = declared.last ?? "WO-999";
  for (const [key, value] of Object.entries({ first, last }))
    requireText(path, value, `derivedOrders.${key}`, /^WO-\d{3}$/u);
  if (first > last)
    throw refuse(
      path,
      "derivedOrders.first must not exceed derivedOrders.last",
    );
  return { first, last };
};

const distinctList = (path, value, label, valid) => {
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.length > 64 ||
    !value.every(valid) ||
    new Set(value).size !== value.length
  )
    throw refuse(
      path,
      `${label} must be a non-empty list of distinct valid values`,
    );
  return [...value].sort();
};
const positiveInteger = (path, value, label, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(value) || value < 1 || value > max)
    throw refuse(path, `${label} must be an integer from 1 to ${max}`);
  return value;
};
const containedPath = (value) =>
  typeof value === "string" &&
  value.length <= 240 &&
  !/[\\\x00-\x1f:]/u.test(value) &&
  !value.startsWith("/") &&
  value
    .split("/")
    .every((part) => part && part !== "." && part !== ".." && part !== ".git");
const covered = (patterns, effect) =>
  patterns.some(
    (pattern) =>
      pattern === effect ||
      (pattern.endsWith("*") && effect.startsWith(pattern.slice(0, -1))),
  );

const validatePortfolios = (path, declared, repositories) => {
  requireObject(path, declared, "portfolios");
  const portfolios = {};
  for (const [id, value] of Object.entries(declared)) {
    requireText(path, id, "portfolio id", /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u);
    const label = `portfolios.${id}`;
    requireObject(path, value, label);
    requireKnownKeys(path, value, PORTFOLIO_KEYS, label);
    for (const key of PORTFOLIO_KEYS)
      if (value[key] === undefined && key !== "verification")
        throw refuse(path, `${label}.${key} is required`);
    const repo = requireText(path, value.repo, `${label}.repo`);
    const profile =
      repo === "self" ? undefined : repositories[repo]?.authorityProfile;
    if (repo !== "self" && !profile)
      throw refuse(path, `${label}.repo names no registered repository`);
    requireObject(path, value.phases, `${label}.phases`);
    const phaseIds = Object.keys(value.phases);
    if (!phaseIds.length || phaseIds.length > 16)
      throw refuse(path, `${label}.phases must name 1 to 16 presence phases`);
    const phases = {};
    for (const phaseId of phaseIds) {
      requireText(path, phaseId, `${label}.phases key`);
      const phaseLabel = `${label}.phases.${phaseId}`;
      const ceiling = requireObject(path, value.phases[phaseId], phaseLabel);
      requireKnownKeys(path, ceiling, ["effects", "files"], phaseLabel);
      const effects = distinctList(
        path,
        ceiling.effects,
        `${phaseLabel}.effects`,
        (effect) =>
          typeof effect === "string" &&
          /^[a-z][a-z0-9-]*(?:\.[a-zA-Z0-9-]+)+$/u.test(effect),
      );
      const files = positiveInteger(
        path,
        ceiling.files,
        `${phaseLabel}.files`,
        1024,
      );
      // A registered repository's profile is part of the floor for its orders.
      if (profile) {
        const outside = effects.find(
          (effect) =>
            !covered(profile.allowedEffects, effect) ||
            covered(profile.deniedEffects, effect),
        );
        if (outside)
          throw refuse(
            path,
            `${phaseLabel}.effects widens repositories.${repo}.authorityProfile with ${outside}`,
          );
        if (files > (profile.resourceLimits.files ?? Infinity))
          throw refuse(
            path,
            `${phaseLabel}.files exceeds repositories.${repo}.authorityProfile.resourceLimits.files`,
          );
      }
      phases[phaseId] = { effects, files };
    }
    const budget = requireObject(path, value.budget, `${label}.budget`);
    requireKnownKeys(
      path,
      budget,
      ["episodes", "wallMs", "tokens"],
      `${label}.budget`,
    );
    const verification =
      value.verification === undefined
        ? {}
        : requireObject(path, value.verification, `${label}.verification`);
    requireKnownKeys(
      path,
      verification,
      CANDIDATE_KINDS,
      `${label}.verification`,
    );
    portfolios[id] = {
      portfolioId: id,
      version: positiveInteger(path, value.version, `${label}.version`),
      repo,
      mechanics: distinctList(
        path,
        value.mechanics,
        `${label}.mechanics`,
        (m) => PORTFOLIO_MECHANICS.includes(m),
      ),
      surfaces: distinctList(
        path,
        value.surfaces,
        `${label}.surfaces`,
        containedPath,
      ),
      phases,
      budget: {
        episodes: positiveInteger(
          path,
          budget.episodes,
          `${label}.budget.episodes`,
        ),
        wallMs: positiveInteger(path, budget.wallMs, `${label}.budget.wallMs`),
        ...(budget.tokens === undefined
          ? {}
          : {
              tokens: positiveInteger(
                path,
                budget.tokens,
                `${label}.budget.tokens`,
              ),
            }),
      },
      verification: Object.fromEntries(
        Object.entries(verification).map(([kind, commands]) => [
          kind,
          distinctList(
            path,
            commands,
            `${label}.verification.${kind}`,
            (command) =>
              typeof command === "string" &&
              command.length <= 320 &&
              /^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u.test(command),
          ),
        ]),
      ),
    };
  }
  return portfolios;
};

const validateConfig = (path, source) => {
  let parsed;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw refuse(path, error instanceof Error ? error.message : String(error));
  }
  const declared = requireObject(path, parsed, "the configuration");
  requireKnownKeys(path, declared, SECTION_KEYS, "configuration");
  if (declared.version !== CONFIG_SCHEMA_VERSION)
    throw refuse(
      path,
      `version must be ${CONFIG_SCHEMA_VERSION}; found ${JSON.stringify(declared.version ?? null)}`,
    );
  const repositories =
    declared.repositories === undefined
      ? {}
      : validateRepositories(path, declared.repositories);
  return {
    version: CONFIG_SCHEMA_VERSION,
    roots: resolveRoots(
      declared.roots === undefined
        ? {}
        : validateDeclaredRoots(path, declared.roots),
    ),
    derivedOrders: validateDerivedOrders(path, declared.derivedOrders),
    repositories,
    portfolios:
      declared.portfolios === undefined
        ? {}
        : validatePortfolios(path, declared.portfolios, repositories),
    build:
      declared.build === undefined
        ? validateBuild(path, {})
        : validateBuild(path, declared.build),
    release:
      declared.release === undefined
        ? validateRelease(path, {})
        : validateRelease(path, declared.release),
  };
};

const absentConfig = () => ({
  version: CONFIG_SCHEMA_VERSION,
  roots: defaultRoots(),
  repositories: {},
  portfolios: {},
  derivedOrders: { first: "WO-900", last: "WO-999" },
  build: { loadout: null, profile: null, overlay: null },
  release: Object.fromEntries(RELEASE_KEYS.map((key) => [key, true])),
});

// One stat per lookup keeps a launchpad that gains, loses or edits its
// configuration mid-process honest while the parsed result is still shared.
const cache = new Map();
const cacheKey = (path) => {
  try {
    const stat = statSync(path);
    return `${stat.mtimeMs}:${stat.size}`;
  } catch {
    return "absent";
  }
};

/** Load the configuration that governs `root`. An absent file means today's
 * defaults; a malformed file refuses by path. */
export const loadConfig = (root) => {
  const launchpad = resolve(root);
  const path = join(launchpad, CONFIG_FILENAME);
  const key = cacheKey(path);
  const cached = cache.get(launchpad);
  if (cached?.key === key) return cached.config;
  const config = Object.freeze({
    launchpad,
    path: key === "absent" ? null : path,
    present: key !== "absent",
    ...(key === "absent"
      ? absentConfig()
      : validateConfig(path, readFileSync(path, "utf8"))),
  });
  cache.set(launchpad, { key, config });
  return config;
};

const ascend = (from) => {
  let directory = resolve(from);
  for (;;) {
    if (existsSync(join(directory, CONFIG_FILENAME))) return directory;
    if (existsSync(join(directory, ".git"))) return directory;
    const parent = dirname(directory);
    if (parent === directory) return undefined;
    directory = parent;
  }
};

/** The launchpad whose documents this process owns: `DOTLN_LAUNCHPAD` when the
 * session runs outside it, otherwise the nearest enclosing directory of the
 * running scripts that declares a configuration or is a Git top level, and the
 * scripts' own checkout when the ascent reaches neither.
 *
 * The working directory never selects a launchpad. A copied script tree is
 * routinely driven from an unrelated directory, so a working-directory ascent
 * would let one checkout's session write into another's documents. */
export const findLaunchpad = ({
  toolRoot = TOOL_ROOT,
  cwd = process.cwd(),
  env = process.env,
} = {}) => {
  const override = env.DOTLN_LAUNCHPAD;
  if (override) {
    const root = resolve(cwd, override);
    if (!existsSync(root))
      throw new Error(`DOTLN_LAUNCHPAD names a missing directory: ${root}`);
    return root;
  }
  return ascend(toolRoot) ?? resolve(toolRoot);
};

const under = (roots, key, segments) => {
  if (!(key in roots))
    throw new Error(
      `unknown document root ${JSON.stringify(key)}; known roots: ${ROOT_KEYS.join(", ")}`,
    );
  return [roots[key], ...segments].filter((part) => part !== "").join("/");
};

/** The launchpad-relative path of a configured root, or of a file under it. */
export const docRelative = (root, key, ...segments) =>
  under(loadConfig(root).roots, key, segments);

/** The same path under today's defaults, for a display name or a shared
 * constant that no launchpad has been resolved for yet. */
export const defaultDocRelative = (key, ...segments) =>
  under(defaultRoots(), key, segments);

/** A configured root escaped for use inside a regular expression. */
export const rootPattern = (root, key) =>
  docRelative(root, key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The absolute path of a configured root, or of a file under it. */
export const docPath = (root, key, ...segments) =>
  join(root, docRelative(root, key, ...segments));
