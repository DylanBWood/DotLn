import { lstatSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { containedRegularFile } from "./paths.mjs";

export const OVERLAY_KEYS = [
  "version",
  "build",
  "identity",
  "unequip",
  "equip",
  "narrow",
  "grants",
];
export const overlayError = (path, detail) =>
  new Error(`invalid build overlay in ${path}: ${detail}`);

/** Instance-owned data has a closed schema; it cannot replace kit code or the floor.
 * `ids` says what `equip` and `unequip` may name: `supports`, the support
 * switches; `selectable`, the author-layer units and rules and the name that
 * stands for all of them; `fixed`, the platform's rules, which every build
 * carries. A list of support ids alone is read as before a rule could be
 * named. An id of `fixed` in `unequip` is named in one advisory and kept;
 * an id none of the three holds refuses, and in an exported instance
 * (`instance`) is named in one advisory and ignored, so that a mistyped or
 * retired id stops no emit there. A caller that passes no `ids` checks the
 * lists' form alone. */
export function decodeBuildOverlay(path, text, ids, options = {}) {
  const known = Array.isArray(ids) ? { supports: ids } : ids;
  const { instance = false, advise = () => {} } = options;
  const fail = (detail) => {
    throw overlayError(path, detail);
  };
  const object = (value, keys, label) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(`${label} must be an object`);
    for (const key of Object.keys(value))
      if (!keys.includes(key)) fail(`unknown key ${label}.${key}`);
  };
  const string = (value, label) => {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /[\u0000-\u001f\u007f\u2028\u2029]/u.test(value)
    )
      fail(`${label} must be a non-empty string without control characters`);
    if (/<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(value))
      fail(`${label} must not contain harness block markers`);
  };
  const integer = (value, label, min = 0) => {
    if (!Number.isSafeInteger(value) || value < min)
      fail(`${label} must be a safe integer >= ${min}`);
  };
  const strings = (value, label, pattern) => {
    if (!Array.isArray(value)) fail(`${label} must be an array`);
    for (const [index, entry] of value.entries()) {
      string(entry, `${label}[${index}]`);
      if (pattern && !pattern.test(entry))
        fail(`${label}[${index}] has an invalid effect pattern`);
    }
    if (new Set(value).size !== value.length) fail(`${label} has duplicates`);
  };
  const exactEffect = /^[^\s*\u0000-\u001f\u007f]+$/u;
  const effectPattern = /^[^\s*\u0000-\u001f\u007f]+\*?$/u;
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("root must be JSON");
  }
  const screenMarkers = (node, key) => {
    if (
      typeof node === "string" &&
      /<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(node)
    )
      fail(`${key} must not contain harness block markers`);
    if (node && typeof node === "object")
      for (const [name, child] of Object.entries(node)) {
        screenMarkers(name, `${key} property name`);
        screenMarkers(child, `${key}.${name}`);
      }
  };
  screenMarkers(value, "overlay");
  object(value, OVERLAY_KEYS, "overlay");
  if (value.version !== 1) fail("version must be 1");
  if (
    value.build !== undefined &&
    !["contributor", "none"].includes(value.build)
  )
    fail('build must be "contributor" or "none"');
  if (
    value.build === "none" &&
    Object.keys(value).some((key) => !["version", "build"].includes(key))
  )
    fail('build "none" accepts only version and build');
  for (const key of ["equip", "unequip"]) {
    if (value[key] === undefined) continue;
    strings(value[key], key);
    if (!known) continue;
    for (const id of value[key]) {
      if (known.supports.includes(id) || (known.selectable ?? []).includes(id))
        continue;
      if ((known.fixed ?? []).includes(id)) {
        if (key === "unequip")
          advise(
            `build overlay ${path}: unequip names ${id}, which is the platform's and stays equipped (npm run features -- list shows each rule's layer)`,
          );
        continue;
      }
      if (!instance) fail(`${key} names unknown support, unit or rule ${id}`);
      advise(
        `build overlay ${path}: ${key} names ${id}, which is no support, unit or rule of this kit; it is ignored (npm run features -- list)`,
      );
    }
  }
  // An id an instance's overlay names that the kit does not hold was named
  // above and is ignored, in both lists as in one. A reader that was given
  // no ids cannot tell such an id from one the kit holds, so in an instance
  // it leaves an id in both lists to the readers that can: every emit,
  // check and features command decodes with the kit's ids.
  const ignored = (id) =>
    instance &&
    (!known ||
      (!known.supports.includes(id) &&
        !(known.selectable ?? []).includes(id) &&
        !(known.fixed ?? []).includes(id)));
  const both = value.equip?.find(
    (id) => value.unequip?.includes(id) && !ignored(id),
  );
  if (both !== undefined)
    fail(`equip and unequip must not name the same id: ${both}`);
  if (value.identity !== undefined) {
    object(
      value.identity,
      [
        "identityId",
        "version",
        "name",
        "dispositions",
        "invariants",
        "updateLaws",
        "lineage",
      ],
      "identity",
    );
    for (const key of ["identityId", "name"])
      string(value.identity[key], `identity.${key}`);
    integer(value.identity.version, "identity.version", 1);
    for (const key of ["dispositions", "invariants", "updateLaws", "lineage"])
      strings(value.identity[key], `identity.${key}`);
  }
  if (value.narrow !== undefined) {
    const narrow = value.narrow;
    object(
      narrow,
      [
        "allowedEffects",
        "deniedEffects",
        "resourceLimits",
        "requiredEvidence",
        "expiresAt",
        "revocationEventTypes",
        "revocationConditions",
      ],
      "narrow",
    );
    for (const key of [
      "allowedEffects",
      "deniedEffects",
      "requiredEvidence",
      "revocationEventTypes",
    ])
      if (narrow[key] !== undefined)
        strings(
          narrow[key],
          `narrow.${key}`,
          key.endsWith("Effects") ? effectPattern : undefined,
        );
    if (narrow.resourceLimits !== undefined) {
      const limits = narrow.resourceLimits;
      object(limits, Object.keys(limits ?? {}), "narrow.resourceLimits");
      for (const [key, quantity] of Object.entries(limits)) {
        string(key, "narrow.resourceLimits key");
        integer(quantity, `narrow.resourceLimits.${key}`);
      }
    }
    if (narrow.expiresAt !== undefined)
      integer(narrow.expiresAt, "narrow.expiresAt");
    if (narrow.revocationConditions !== undefined) {
      if (!Array.isArray(narrow.revocationConditions))
        fail("narrow.revocationConditions must be an array");
      for (const [index, condition] of narrow.revocationConditions.entries()) {
        const label = `narrow.revocationConditions[${index}]`;
        object(condition, ["registryId", "version", "params"], label);
        string(condition.registryId, `${label}.registryId`);
        integer(condition.version, `${label}.version`, 1);
        if (condition.params !== undefined)
          object(
            condition.params,
            Object.keys(condition.params ?? {}),
            `${label}.params`,
          );
      }
    }
  }
  if (value.grants !== undefined) {
    if (!Array.isArray(value.grants)) fail("grants must be an array");
    const ids = new Set();
    for (const [index, grant] of value.grants.entries()) {
      const label = `grants[${index}]`;
      object(
        grant,
        [
          "grantId",
          "version",
          "grantedBy",
          "effects",
          "operations",
          "repo",
          "reason",
        ],
        label,
      );
      for (const key of ["grantId", "reason"])
        string(grant[key], `${label}.${key}`);
      integer(grant.version, `${label}.version`, 1);
      if (!["operator", "host-policy"].includes(grant.grantedBy))
        fail(`${label}.grantedBy must be operator or host-policy`);
      if (grant.repo !== "project") fail(`${label}.repo must be project`);
      strings(grant.effects, `${label}.effects`, exactEffect);
      if (grant.operations !== undefined)
        strings(grant.operations, `${label}.operations`, exactEffect);
      if (ids.has(grant.grantId)) fail(`${label}.grantId must be unique`);
      ids.add(grant.grantId);
    }
  }
  return value;
}

/** The author's shared rules the installed bundle leaves out, as its
 * manifest records them, so that a worker launched from a root is told what
 * the root's roles are told. None where no bundle is installed or it leaves
 * none out. */
export function installedUnequippedRules(root) {
  try {
    const manifest = JSON.parse(
      readFileSync(join(root, ".claude/harness-manifest.json"), "utf8"),
    );
    return [
      ...new Set(
        (Array.isArray(manifest?.profiles) ? manifest.profiles : []).flatMap(
          (profile) =>
            Array.isArray(profile?.unequipped?.rules)
              ? profile.unequipped.rules
              : [],
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function readBuildOverlayFile(launchpad, path, ids, options) {
  if (path === null) return undefined;
  const absolute = resolve(launchpad, path);
  let text;
  try {
    if (!containedRegularFile(absolute, launchpad)) throw new Error();
    text = readFileSync(absolute);
  } catch {
    throw overlayError(
      path,
      "build.overlay must name a readable regular file inside the launchpad",
    );
  }
  const value = decodeBuildOverlay(path, text.toString("utf8"), ids, options);
  return { path, bytes: text, value };
}

/** The instance's own hooks and permission rules: a committed fragment that
 * emit merges into the settings it writes, for the launchpad and for a
 * target worktree. Its schema is closed and the merge only adds, so every
 * entry the kit emits stays as emitted. Its entries keep to the shape of
 * the kit's own because the host is documented to drop a settings file's
 * other hooks over one malformed entry, and the file is the kit's. */
export const SETTINGS_FRAGMENT = ".claude/settings.instance.json";
const FRAGMENT_KEYS = ["hooks", "permissions"];
/** The events a fragment may add a hook under: those the kit registers a
 * hook under itself, which is what shows the host takes them, and at which
 * the kit only observes. The three it leaves out are the ones where an
 * added hook's output could stand in for an answer of the kit's, or keep
 * the operator's words from the session; each is refused with its reason. */
export const FRAGMENT_HOOK_EVENTS = [
  "PermissionDenied",
  "PostToolUse",
  "PostToolUseFailure",
  "SessionStart",
  "Stop",
];
const FRAGMENT_REFUSED_EVENTS = {
  PreToolUse:
    "a fragment adds no hook under PreToolUse, where a hook's output can rewrite a call after the kit's guards have judged it",
  SubagentStop:
    "a fragment adds no hook under SubagentStop, where the kit itself answers a worker's stop and an added hook's answer can take precedence over it",
  UserPromptSubmit:
    "a fragment adds no hook under UserPromptSubmit, where a hook that blocks or fails keeps a prompt from the session, the operator's recovery controls among them",
};
export const FRAGMENT_RULE_LISTS = ["allow", "ask", "deny"];
const fragmentError = (detail) =>
  new Error(`invalid settings fragment in ${SETTINGS_FRAGMENT}: ${detail}`);
// A tool's name, which a deny or ask rule may write as a glob, then its
// specifier in parentheses where the rule has one.
const PERMISSION_RULE = /^[A-Za-z_*][\w*.-]*(?:\(.+\))?$/u;

/** The fragment's hooks and rules, validated and in the kit's own key
 * order. `emittedKeys` are the top-level keys of the settings it joins: a
 * fragment that names one of them would replace what the kit emits. */
export function decodeSettingsFragment(text, emittedKeys = []) {
  const fail = (detail) => {
    throw fragmentError(detail);
  };
  const object = (value, label, keys) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(`${label} must be an object`);
    for (const key of Object.keys(value))
      if (keys && !keys.includes(key))
        fail(
          `unknown key ${label}.${key}: the merge defines ${keys.join(", ")}`,
        );
  };
  const string = (value, label) => {
    // Neither a control character nor a format one (a zero-width space, a
    // direction override): what a reader of the committed file cannot see
    // must not change what a command runs or a rule matches.
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /[\p{Cc}\p{Cf}\u2028\u2029]/u.test(value)
    )
      fail(
        `${label} must be a non-empty string without control or format characters`,
      );
  };
  const list = (value, label) => {
    if (!Array.isArray(value))
      fail(`${label} must be an array: a fragment only adds`);
  };
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("root must be JSON");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    fail("root must be an object");
  for (const key of Object.keys(value))
    if (!FRAGMENT_KEYS.includes(key))
      fail(
        emittedKeys.includes(key)
          ? `${key} would replace the ${key} the kit emits: a fragment only adds`
          : `unknown key ${key}: the merge defines ${FRAGMENT_KEYS.join(" and ")}`,
      );
  const hooks = {};
  if (value.hooks !== undefined) {
    object(value.hooks, "hooks");
    for (const [event, groups] of Object.entries(value.hooks)) {
      const at = `hooks.${event}`;
      if (Object.hasOwn(FRAGMENT_REFUSED_EVENTS, event))
        fail(`${at}: ${FRAGMENT_REFUSED_EVENTS[event]}`);
      if (!FRAGMENT_HOOK_EVENTS.includes(event))
        fail(
          `${at}: a fragment adds hooks under ${FRAGMENT_HOOK_EVENTS.join(", ")} alone`,
        );
      list(groups, at);
      hooks[event] = groups.map((group, index) => {
        const label = `${at}[${index}]`;
        object(group, label, ["matcher", "hooks"]);
        if (group.matcher !== undefined)
          string(group.matcher, `${label}.matcher`);
        list(group.hooks, `${label}.hooks`);
        if (!group.hooks.length) fail(`${label}.hooks names no hook`);
        return {
          ...(group.matcher === undefined ? {} : { matcher: group.matcher }),
          hooks: group.hooks.map((handler, place) => {
            const name = `${label}.hooks[${place}]`;
            object(handler, name, ["type", "command", "timeout"]);
            if (handler.type !== "command")
              fail(`${name}.type must be "command"`);
            string(handler.command, `${name}.command`);
            if (
              handler.timeout !== undefined &&
              (!Number.isSafeInteger(handler.timeout) || handler.timeout < 1)
            )
              fail(`${name}.timeout must be a whole number of seconds`);
            return {
              type: "command",
              command: handler.command,
              ...(handler.timeout === undefined
                ? {}
                : { timeout: handler.timeout }),
            };
          }),
        };
      });
    }
  }
  const permissions = {};
  if (value.permissions !== undefined) {
    object(value.permissions, "permissions", FRAGMENT_RULE_LISTS);
    for (const name of FRAGMENT_RULE_LISTS) {
      const rules = value.permissions[name];
      if (rules === undefined) continue;
      const at = `permissions.${name}`;
      list(rules, at);
      for (const [index, rule] of rules.entries()) {
        string(rule, `${at}[${index}]`);
        if (!PERMISSION_RULE.test(rule))
          fail(
            `${at}[${index}] is not a permission rule: a tool's name, then its specifier in parentheses where it has one`,
          );
      }
      permissions[name] = [...new Set(rules)];
    }
  }
  return { hooks, permissions };
}

/** The settings text the kit emits with the fragment's entries added: each
 * event's groups after the kit's, each list's new rules after the kit's.
 * A fragment that adds nothing returns the emitted text byte for byte. */
export function mergeSettingsFragment(emitted, text) {
  const settings = JSON.parse(emitted);
  const fragment = decodeSettingsFragment(text, Object.keys(settings));
  const merged = { ...settings };
  // A fragment adds hooks of its own. One that names a command the kit
  // registers would stand beside the kit's entry as a second registration
  // of it, with a timeout of its own choosing.
  const registered = new Set(
    Object.values(settings.hooks ?? {}).flatMap((groups) =>
      groups.flatMap((group) => group.hooks.map((hook) => hook.command)),
    ),
  );
  for (const [event, groups] of Object.entries(fragment.hooks)) {
    for (const [index, group] of groups.entries())
      for (const [place, hook] of group.hooks.entries())
        if (registered.has(hook.command))
          throw fragmentError(
            `hooks.${event}[${index}].hooks[${place}].command is a hook the kit registers itself: a fragment adds its own and registers none of the kit's again`,
          );
    if (!groups.length) continue;
    if (merged.hooks === settings.hooks) merged.hooks = { ...settings.hooks };
    merged.hooks[event] = [...(settings.hooks?.[event] ?? []), ...groups];
  }
  for (const [name, rules] of Object.entries(fragment.permissions)) {
    // The same rule in another list would countermand the kit's entry: a
    // deny or an ask beside the kit's allow, an allow beside its deny. A
    // wider rule of the instance's own that covers a kit rule is its own
    // tightening, which no comparison of strings can judge.
    for (const rule of rules)
      for (const other of FRAGMENT_RULE_LISTS)
        if (other !== name && settings.permissions?.[other]?.includes(rule))
          throw fragmentError(
            `permissions.${name} holds a rule the kit emits under permissions.${other} (${rule}): it would countermand that entry, and a fragment only adds`,
          );
    const kept = settings.permissions?.[name] ?? [];
    const added = rules.filter((rule) => !kept.includes(rule));
    if (!added.length) continue;
    if (merged.permissions === settings.permissions)
      merged.permissions = { ...settings.permissions };
    merged.permissions[name] = [...kept, ...added];
  }
  return `${JSON.stringify(merged, null, 2)}\n`;
}

/** The launchpad's fragment as its bytes, or undefined where it has none.
 * It is read as a regular file inside the launchpad and never through a
 * link. */
export function readSettingsFragment(launchpad) {
  const absolute = resolve(launchpad, SETTINGS_FRAGMENT);
  if (!lstatSync(absolute, { throwIfNoEntry: false })) return undefined;
  if (!containedRegularFile(absolute, launchpad))
    throw fragmentError("it must be a regular file inside the launchpad");
  return { path: SETTINGS_FRAGMENT, bytes: readFileSync(absolute) };
}
