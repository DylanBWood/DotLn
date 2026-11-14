// The one table of what a worker runs, and the one interface over it. A
// model is a row of data; a worker is a name an instance binds, for each
// provider it can run on, to a model; a provider is a launcher, with what is
// particular to it kept in one adapter here. Every caller names a worker or
// a model and takes the answer from `resolveWorker`: none handles a model's
// id, a host's flags or a launch tool's arguments itself. Build-free, so the
// configuration, the launcher and the compiled loadout read one answer.

import { KIT_MODELS, KIT_WORKERS } from "./worker-models.mjs";

/** The instance's own list of models and prices, beside its configuration. */
export const WORKER_MODELS_FILE = "dotln.models.json";
const CONFIG_FILE = "dotln.config.json";
/** A model's or a worker's name: a word a person says and an agent passes. */
export const WORKER_NAME = /^[a-z][a-z0-9-]{0,39}$/u;
/** The four classes of tokens a price is declared for, which do not
 * overlap: input no cache served, input read from a cache, input written to
 * one, and output. A price is in US dollars for a million tokens. */
export const WORKER_PRICE_CLASSES = Object.freeze([
  "uncachedInput",
  "cacheRead",
  "cacheWrite",
  "output",
]);

/** @typedef {{provider: string, id: string, effort: string, family?: string, description?: string}} ModelRow */
/** @typedef {{model: string, effort: string | null}} WorkerBinding */
/** @typedef {{description: string | null, bindings: Record<string, WorkerBinding>}} NamedWorker */
/** @typedef {ModelRow & {source: string}} TableModel */
/** @typedef {{description: string | null, bindings: Record<string, WorkerBinding & {source: string}>}} TableWorker */
/** @typedef {{models: Record<string, TableModel>, workers: Record<string, TableWorker>, prices: Record<string, Record<string, number>>}} WorkerTable */
/** @typedef {{name: string, entry: "model" | "worker", provider: string, model: {name: string, id: string, family: string | null}, effort: string, description: string | null, launchable: boolean, workerType: string | null, source: {model: string, id: string, effort: string}}} ResolvedWorker */
/** @typedef {{tool: string, arguments: Record<string, string>, exact: boolean, note?: string, preamble?: string}} SessionLaunch */
/** @typedef {{id: string, label: string, efforts: readonly string[], rowKeys: readonly string[], transport: string, harness: string, workerType: string, idProblem: (id: string) => string | null, sessionLaunch: (resolved: ResolvedWorker, context: {pin?: {id: string, effort: string} | null, preamble?: string}) => SessionLaunch | null}} WorkerProvider */
/** A refusal: what is wrong and, where an entry of the instance's is at
 * fault, that entry's place as file#key, so that the caller can name the
 * file it stands in.
 * @typedef {(detail: string, place?: string) => never} Fail */

// A model id as a definition's front matter and a command line can carry
// it, less the words front matter reads as something else.
const MODEL_ID = /^[a-z][a-z0-9.-]{0,99}$/u;
const ID_RESERVED = new Set([
  "null",
  "true",
  "false",
  "yes",
  "no",
  "on",
  "off",
  "y",
  "n",
  "inherit",
]);
/** @param {string} id @returns {string | null} */
const idProblem = (id) =>
  !MODEL_ID.test(id)
    ? "must be a model id of at most 100 lower-case letters, digits, dots and hyphens that begins with a letter"
    : ID_RESERVED.has(id)
      ? "is a word a worker definition reads as something else"
      : null;
const EFFORTS = Object.freeze(["low", "medium", "high", "xhigh", "max"]);

/** The launchers the kit has, each with what is particular to it: the
 * efforts its launches take, the keys of a model row that are its own, the
 * command-line transport that runs it and the harness its attestation
 * records, the worker type a record names, and
 * how a session of that provider launches a resolved worker itself. A new
 * provider is one entry here and one transport; no caller changes.
 * @type {Readonly<Record<string, WorkerProvider>>} */
export const PROVIDERS = Object.freeze({
  claude: Object.freeze({
    id: "claude",
    label: "Claude",
    efforts: EFFORTS,
    rowKeys: Object.freeze(["family"]),
    transport: "claude-cli-print",
    harness: "claude-code",
    workerType: "dotln-worker",
    idProblem,
    // The one worker definition holds the default's exact id and effort. A
    // launch of another model names its family and its effort for that
    // launch alone: the host's launch takes a family, not an id, and which
    // model a family is at the time is the host's to say.
    /** @type {WorkerProvider["sessionLaunch"]} */
    sessionLaunch: (resolved, { pin }) => {
      /** @type {Record<string, string>} */
      const launch = { subagent_type: "dotln-worker" };
      if (pin && resolved.model.id === pin.id) {
        if (resolved.effort !== pin.effort) launch["effort"] = resolved.effort;
        return { tool: "Agent", arguments: launch, exact: true };
      }
      if (!resolved.model.family) return null;
      launch["model"] = resolved.model.family;
      launch["effort"] = resolved.effort;
      return {
        tool: "Agent",
        arguments: launch,
        exact: false,
        note: `The host resolves the family ${resolved.model.family} to a model; record the model the worker reports, which may not be ${resolved.model.id}.`,
      };
    },
  }),
  codex: Object.freeze({
    id: "codex",
    label: "Codex",
    efforts: EFFORTS,
    rowKeys: Object.freeze([]),
    transport: "codex-cli-exec",
    harness: "codex-cli",
    workerType: "codex-spawn-agent",
    idProblem,
    // A spawn takes the exact id and effort as its own arguments and reads
    // no definition, so the worker's standing rules open its brief.
    /** @type {WorkerProvider["sessionLaunch"]} */
    sessionLaunch: (resolved, { preamble }) => ({
      tool: "spawn_agent",
      arguments: {
        fork_turns: "none",
        model: resolved.model.id,
        reasoning_effort: resolved.effort,
      },
      exact: true,
      ...(preamble === undefined ? {} : { preamble }),
    }),
  }),
});

/** The worker types a record may name: one for each provider, and the two
 * a record written before there was one worker for each provider may hold.
 * A fixed set, so that an old record reads whatever the table now holds. */
export const WORKER_RECORD_TYPES = Object.freeze([
  "dotln-worker",
  "codex-spawn-agent",
  "dotln-worker-fable",
  "dotln-worker-astra",
]);

/** What a map holds under a key of its own. A name is any word of the
 * name's form, `constructor` among them, so no lookup reads a key an
 * object merely inherits.
 * @template Value @param {Readonly<Record<string, Value>>} map @param {string} key
 * @returns {Value | undefined} */
const own = (map, key) => (Object.hasOwn(map, key) ? map[key] : undefined);
/** @param {unknown} value @returns {value is Record<string, unknown>} */
const plain = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
/** @param {unknown} value @returns {value is string} */
const text = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  !/[\p{Cc}\p{Cf}\u2028\u2029]/u.test(value);
/** @param {readonly string[]} values */
const quoted = (values) =>
  values.map((value) => JSON.stringify(value)).join(", ");
/** @type {Fail} */
const refuse = (detail) => {
  throw new Error(detail);
};
/** @param {Record<string, unknown>} value @param {readonly string[]} keys @param {string} at @param {Fail} fail */
const closed = (value, keys, at, fail) => {
  for (const key of Object.keys(value))
    if (!keys.includes(key))
      fail(`unknown key ${at}.${key}; known keys: ${keys.join(", ")}`);
};
/** @param {string} name @param {string} at @param {Fail} fail */
const named = (name, at, fail) => {
  if (!WORKER_NAME.test(name) || name === "and")
    fail(
      `${at} is no name a launch can take: a name is at most 40 lower-case letters, digits and hyphens, begins with a letter and is not "and"`,
    );
};

/** An instance's model rows as written in its models file, each whole.
 * @param {unknown} declared @param {Fail} [fail]
 * @returns {Record<string, ModelRow>} */
export function validateModels(declared, fail = refuse) {
  const at = `${WORKER_MODELS_FILE}#models`;
  if (!plain(declared)) return fail(`${at} must be an object`);
  /** @type {Record<string, ModelRow>} */
  const rows = {};
  for (const [name, row] of Object.entries(declared)) {
    const label = `${at}.${name}`;
    named(name, label, fail);
    if (!plain(row)) return fail(`${label} must be an object`);
    const provider = row["provider"];
    if (!text(provider) || !WORKER_NAME.test(provider))
      return fail(`${label}.provider must name a provider`);
    const adapter = own(PROVIDERS, provider);
    closed(
      row,
      ["provider", "id", "effort", "description", ...(adapter?.rowKeys ?? [])],
      label,
      fail,
    );
    const id = row["id"];
    if (!text(id)) return fail(`${label}.id must be the model's exact id`);
    // A provider the kit has no launcher for is the instance's to list:
    // its row is held to the common form of an id and to an effort that
    // is one word, and is refused where a launch would be resolved.
    const problem = (adapter?.idProblem ?? idProblem)(id);
    if (problem) fail(`${label}.id ${problem}; found ${JSON.stringify(id)}`);
    const effort = row["effort"];
    if (
      !text(effort) ||
      (adapter ? !adapter.efforts.includes(effort) : !WORKER_NAME.test(effort))
    )
      return fail(
        `${label}.effort must be ${adapter ? `one of ${quoted(adapter.efforts)}, the efforts a ${provider} launch takes` : "an effort, one lower-case word"}; found ${JSON.stringify(effort ?? null)}`,
      );
    /** @type {Record<string, string>} */
    const stated = { provider, id, effort };
    for (const key of ["description", ...(adapter?.rowKeys ?? [])]) {
      const value = row[key];
      if (value === undefined) continue;
      if (!text(value)) return fail(`${label}.${key} must be a line of text`);
      stated[key] = value;
    }
    rows[name] = /** @type {ModelRow} */ (stated);
  }
  return rows;
}

/** Named workers as a configuration's `workers` section writes them: each a
 * name, an optional description and, for each provider, a model's name or a
 * model with an effort of its own.
 * @param {unknown} declared @param {Fail} [fail] @param {string} [at]
 * @returns {Record<string, NamedWorker>} */
export function validateNamedWorkers(
  declared,
  fail = refuse,
  at = `${CONFIG_FILE}#workers`,
) {
  if (!plain(declared)) return fail(`${at} must be an object`);
  /** @type {Record<string, NamedWorker>} */
  const workers = {};
  for (const [name, entry] of Object.entries(declared)) {
    const label = `${at}.${name}`;
    named(name, label, fail);
    if (!plain(entry)) return fail(`${label} must be an object`);
    const description = entry["description"];
    if (description !== undefined && !text(description))
      fail(`${label}.description must be a line of text`);
    /** @type {Record<string, WorkerBinding>} */
    const bindings = {};
    for (const [provider, binding] of Object.entries(entry)) {
      if (provider === "description") continue;
      const place = `${label}.${provider}`;
      if (!WORKER_NAME.test(provider))
        fail(`${place} must be a provider's name or "description"`);
      if (text(binding)) {
        bindings[provider] = { model: binding, effort: null };
        continue;
      }
      if (!plain(binding))
        return fail(
          `${place} must be a model's name, or an object with a model and an effort`,
        );
      closed(binding, ["model", "effort"], place, fail);
      const model = binding["model"];
      if (!text(model)) return fail(`${place}.model must be a model's name`);
      const effort = binding["effort"];
      if (effort !== undefined && !text(effort))
        return fail(`${place}.effort must be an effort`);
      bindings[provider] = { model, effort: effort ?? null };
    }
    workers[name] = {
      description: text(description) ? description : null,
      bindings,
    };
  }
  return workers;
}

/** An instance's prices by exact model id.
 * @param {unknown} declared @param {Fail} [fail]
 * @returns {Record<string, Record<string, number>>} */
export function validatePrices(declared, fail = refuse) {
  const at = `${WORKER_MODELS_FILE}#prices`;
  if (!plain(declared)) return fail(`${at} must be an object`);
  /** @type {[string, Record<string, number>][]} */
  const priced = [];
  for (const [model, price] of Object.entries(declared)) {
    const label = `${at}[${JSON.stringify(model)}]`;
    if (!model.trim() || model in Object.prototype)
      fail(`${at} names a model by its id; found ${JSON.stringify(model)}`);
    if (!plain(price)) return fail(`${label} must be an object`);
    closed(price, WORKER_PRICE_CLASSES, label, fail);
    /** @type {Record<string, number>} */
    const classes = {};
    for (const tokens of WORKER_PRICE_CLASSES) {
      const value = price[tokens];
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
        return fail(
          `${label}.${tokens} must be a number that is not negative, in US dollars for a million tokens; found ${JSON.stringify(value ?? null)}`,
        );
      classes[tokens] = value;
    }
    priced.push([model, classes]);
  }
  return Object.fromEntries(priced);
}

const KIT_NAMED = validateNamedWorkers(
  KIT_WORKERS,
  refuse,
  "the kit's workers",
);

/** The table a launch is resolved in: the kit's models with the instance's
 * over them, an instance's row of a kit model's name replacing that row
 * whole; the kit's workers with the instance's over them, an instance's
 * entry of a kit worker's name replacing the bindings it states and keeping
 * the others; and the instance's prices. Each value carries where it came
 * from. What only the whole table can show is judged here: a name that
 * would mean two things, a binding to a model that is not there or is
 * another provider's, an effort its provider does not take.
 * @param {{named?: Record<string, NamedWorker>, models?: Record<string, ModelRow>, prices?: Record<string, Record<string, number>>}} [instance]
 * @param {Fail} [fail]
 * @returns {WorkerTable} */
export function workerTable(instance = {}, fail = refuse) {
  /** @type {Record<string, TableModel>} */
  const models = {};
  for (const [name, row] of Object.entries(KIT_MODELS))
    models[name] = { ...row, source: "kit" };
  for (const [name, row] of Object.entries(instance.models ?? {}))
    models[name] = { ...row, source: `${WORKER_MODELS_FILE}#models.${name}` };
  /** @type {Record<string, TableWorker>} */
  const workers = {};
  for (const [name, worker] of Object.entries(KIT_NAMED))
    workers[name] = {
      description: worker.description,
      bindings: Object.fromEntries(
        Object.entries(worker.bindings).map(([provider, binding]) => [
          provider,
          { ...binding, source: "kit" },
        ]),
      ),
    };
  for (const [name, worker] of Object.entries(instance.named ?? {})) {
    const kept = own(workers, name);
    workers[name] = {
      description: worker.description ?? kept?.description ?? null,
      bindings: {
        ...kept?.bindings,
        ...Object.fromEntries(
          Object.entries(worker.bindings).map(([provider, binding]) => [
            provider,
            {
              ...binding,
              source: `${CONFIG_FILE}#workers.${name}.${provider}`,
            },
          ]),
        ),
      },
    };
  }
  // Every refusal below names the instance's entry at fault as file#key:
  // the kit's own rows are consistent, so where two entries disagree the
  // one the instance wrote is the one to change.
  const stated = instance.named ?? {};
  /** @param {string} name */
  const workerPlace = (name) =>
    Object.hasOwn(stated, name) ? `${CONFIG_FILE}#workers.${name}` : null;
  /** @param {TableModel} row */
  const modelPlace = (row) => (row.source === "kit" ? null : row.source);
  // One namespace: a launch names a model or a worker by the same kind of
  // word, so no word may mean both, and no model's id may be such a word.
  for (const name of Object.keys(workers)) {
    const model = own(models, name);
    if (!model) continue;
    const worker = workerPlace(name);
    if (worker)
      fail(
        `the worker ${JSON.stringify(name)} (${worker}) has the name of a model (${modelPlace(model) ?? "the kit's model list"}); a name means one thing`,
        worker,
      );
    fail(
      `the model ${JSON.stringify(name)} (${model.source}) has the name of a worker the kit ships; a name means one thing`,
      model.source,
    );
  }
  /** @type {Map<string, string>} */
  const ids = new Map();
  for (const [name, row] of Object.entries(models)) {
    const mine = modelPlace(row);
    const sameName = own(models, row.id);
    const holder = sameName
      ? { kind: "model", place: modelPlace(sameName) }
      : own(workers, row.id)
        ? { kind: "worker", place: workerPlace(row.id) }
        : null;
    // The entry at fault is the instance's: the row that holds the id, or
    // the entry whose name is another row's id.
    if (holder)
      fail(
        `${mine ? `${mine}.id` : `the id of the kit's model ${JSON.stringify(name)}`} is ${JSON.stringify(row.id)}, which is also the name of a ${holder.kind} (${holder.place ?? "the kit's"}); an id and a name must differ`,
        mine ? `${mine}.id` : (holder.place ?? undefined),
      );
    const key = `${row.provider}\u0000${row.id}`;
    const other = ids.get(key);
    if (other !== undefined) {
      const first = /** @type {TableModel} */ (models[other]);
      // The row at fault is this one unless only the earlier is the
      // instance's.
      const [late, early, at] =
        mine || !modelPlace(first)
          ? [name, other, mine]
          : [other, name, modelPlace(first)];
      fail(
        `${at ? `${at}.id` : "the kit's model list"} gives ${JSON.stringify(late)} the id ${row.id}, which is the ${row.provider} model ${JSON.stringify(early)} already; a second effort of a model is a worker, not a model`,
        at ? `${at}.id` : undefined,
      );
    }
    ids.set(key, name);
  }
  for (const [name, worker] of Object.entries(workers)) {
    if (!Object.keys(worker.bindings).length)
      fail(
        `${CONFIG_FILE}#workers.${name} binds no provider to a model`,
        `${CONFIG_FILE}#workers.${name}`,
      );
    for (const [provider, binding] of Object.entries(worker.bindings)) {
      const kit = binding.source === "kit";
      const place = kit
        ? `the kit's worker ${name}.${provider}`
        : binding.source;
      const model = own(models, binding.model);
      if (!model)
        return fail(
          `${place} names the model ${JSON.stringify(binding.model)}, which is not in the model list (${Object.keys(models).join(", ")})`,
          kit ? undefined : binding.source,
        );
      if (model.provider !== provider) {
        // The kit's binding and the kit's row agree, so here the
        // instance replaced the row under a binding it did not restate.
        if (kit && model.source !== "kit")
          fail(
            `${model.source}.provider makes ${JSON.stringify(binding.model)} a ${model.provider} model, and the kit's worker ${JSON.stringify(name)} runs it on ${provider}; keep the row's provider, or bind ${provider} to another model in ${CONFIG_FILE}#workers.${name}`,
            `${model.source}.provider`,
          );
        fail(
          `${place} names the model ${JSON.stringify(binding.model)}, which is a ${model.provider} model, not a ${provider} one`,
          kit ? undefined : binding.source,
        );
      }
      const adapter = own(PROVIDERS, provider);
      if (
        binding.effort !== null &&
        (adapter
          ? !adapter.efforts.includes(binding.effort)
          : !WORKER_NAME.test(binding.effort))
      )
        fail(
          `${place}.effort must be ${adapter ? `one of ${quoted(adapter.efforts)}, the efforts a ${provider} launch takes` : "an effort, one lower-case word"}; found ${JSON.stringify(binding.effort)}`,
          kit ? undefined : `${binding.source}.effort`,
        );
    }
  }
  return { models, workers, prices: instance.prices ?? {} };
}

/** What one name runs: a worker's binding for a provider, or a model at its
 * own effort. A name that is neither is read as a model's exact id. The
 * provider is the one given, else the model's own, else the only one the
 * worker binds; a worker that binds several needs one named. An effort
 * given for this launch stands over the binding's and the model's.
 * @param {WorkerTable} table @param {string} [name]
 * @param {{provider?: string | null, effort?: string | null}} [choice]
 * @returns {ResolvedWorker} */
export function resolveWorker(table, name = "default", choice = {}) {
  const wanted = choice.provider ?? null;
  const names = [...Object.keys(table.workers), ...Object.keys(table.models)];
  /** @param {string} model @param {string | null} effort @param {"model" | "worker"} entry @param {string | null} description @param {string} effortSource @returns {ResolvedWorker} */
  const resolved = (model, effort, entry, description, effortSource) => {
    const row = /** @type {TableModel} */ (table.models[model]);
    const adapter = own(PROVIDERS, row.provider);
    if (!adapter)
      throw new Error(
        `${JSON.stringify(name)} runs the ${row.provider} model ${row.id}, and the kit has no launcher for ${row.provider}; its launchers are ${Object.keys(PROVIDERS).join(" and ")}`,
      );
    const given = choice.effort ?? null;
    if (given !== null && !adapter.efforts.includes(given))
      throw new Error(
        `the effort ${JSON.stringify(given)} is not one a ${row.provider} launch takes (${quoted(adapter.efforts)})`,
      );
    return {
      // A model asked for by its id answers to its name.
      name: entry === "model" ? model : name,
      entry,
      provider: row.provider,
      model: { name: model, id: row.id, family: row.family ?? null },
      effort: given ?? effort ?? row.effort,
      description: description ?? row.description ?? null,
      launchable: true,
      workerType: adapter.workerType,
      // Where the choice of model was written, where the model's id was,
      // and where the effort was: three places an instance may correct.
      source: {
        model: entry === "worker" ? effortSource : row.source,
        id: row.source,
        effort:
          given !== null
            ? "this launch"
            : effort !== null
              ? effortSource
              : row.source,
      },
    };
  };
  const worker = Object.hasOwn(table.workers, name)
    ? table.workers[name]
    : undefined;
  if (worker) {
    const bound = Object.keys(worker.bindings);
    const provider = wanted ?? (bound.length === 1 ? bound[0] : undefined);
    const binding =
      provider === undefined ? undefined : own(worker.bindings, provider);
    if (provider === undefined || !binding)
      throw new Error(
        provider === undefined
          ? `the worker ${JSON.stringify(name)} runs on ${bound.join(" and ")}; name the provider`
          : `the worker ${JSON.stringify(name)} has no ${provider} binding; it runs on ${bound.join(" and ")}`,
      );
    return resolved(
      binding.model,
      binding.effort,
      "worker",
      worker.description,
      binding.source,
    );
  }
  const direct = Object.hasOwn(table.models, name) ? name : undefined;
  const withId = Object.entries(table.models).filter(
    ([, row]) => row.id === name,
  );
  const byId =
    wanted === null
      ? withId
      : withId.filter(([, row]) => row.provider === wanted);
  if (direct === undefined && byId.length > 1)
    throw new Error(
      `${JSON.stringify(name)} is the id of ${byId.map(([model]) => model).join(" and ")}; name the provider or the model`,
    );
  // An id that is another provider's model is answered as that model, so
  // that the refusal below says whose it is.
  const model = direct ?? byId[0]?.[0] ?? withId[0]?.[0];
  if (model === undefined)
    throw new Error(
      `${JSON.stringify(name)} is no worker or model of this instance; it has ${names.join(", ")}`,
    );
  const row = /** @type {TableModel} */ (table.models[model]);
  if (wanted !== null && row.provider !== wanted)
    throw new Error(
      `${JSON.stringify(model)} is a ${row.provider} model, and this launch is on ${wanted}; ${wanted} has ${
        Object.entries(table.models)
          .filter(([, other]) => other.provider === wanted)
          .map(([other]) => other)
          .join(", ") || "no model"
      }`,
    );
  return resolved(model, null, "model", null, row.source);
}

/** The table as one listing, for a person and for an agent alike: every
 * worker and every model by name, with what each runs for each provider and
 * where each value came from.
 * @param {WorkerTable} table */
export function listWorkers(table) {
  /** @param {string} name @param {string | null} effort @param {string} source */
  const runs = (name, effort, source) => {
    const row = /** @type {TableModel} */ (table.models[name]);
    return {
      provider: row.provider,
      model: name,
      id: row.id,
      effort: effort ?? row.effort,
      family: row.family ?? null,
      launchable: Boolean(own(PROVIDERS, row.provider)),
      source,
    };
  };
  return [
    ...Object.entries(table.workers).map(([name, worker]) => ({
      name,
      entry: /** @type {const} */ ("worker"),
      description: worker.description,
      runs: Object.values(worker.bindings).map((binding) =>
        runs(binding.model, binding.effort, binding.source),
      ),
    })),
    ...Object.entries(table.models).map(([name, row]) => ({
      name,
      entry: /** @type {const} */ ("model"),
      description: row.description ?? null,
      runs: [runs(name, null, row.source)],
    })),
  ];
}

/** What a provider's one worker definition holds: the default worker's
 * model and effort for that provider, or null where the default has no
 * binding for it.
 * @param {WorkerTable} table @param {string} provider @param {string} [worker] */
export function workerPin(table, provider, worker = "default") {
  const bindings = own(table.workers, worker)?.bindings;
  if (!bindings || !own(bindings, provider)) return null;
  const resolved = resolveWorker(table, worker, { provider });
  return { id: resolved.model.id, effort: resolved.effort };
}

/** How a session of the worker's provider launches it itself, or null where
 * it cannot and the kit's command-line launcher must.
 * The pin is what the provider's one worker definition holds: the table's
 * default, unless the caller read another from the definition as emitted.
 * @param {WorkerTable} table @param {ResolvedWorker} resolved
 * @param {{preamble?: string, pin?: {id: string, effort: string} | null}} [context] */
export function sessionLaunch(table, resolved, context = {}) {
  const adapter = own(PROVIDERS, resolved.provider);
  return (
    adapter?.sessionLaunch(resolved, {
      ...context,
      pin: context.pin ?? workerPin(table, resolved.provider),
    }) ?? null
  );
}
