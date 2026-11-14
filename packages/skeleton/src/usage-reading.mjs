// The reading of recorded usage observations: tokens by class, by order and
// by the host's local calendar day, with an estimate in dollars from prices
// the instance declares. Build-free, so the meter, the usage report and a
// session's prompt line read one answer without a build.
//
// A usage row holds the counters its host reported and the source that
// names the host. The classes are derived here from those two, never stored:
// a row recorded before this reading existed is read like any other, and the
// derivation has one home.
//
// A session is observed more than once, and each observation counts the
// session from its start. Rows that share a `series` are the successive
// observations of one dispatch: each is read for what it adds to the one
// before, on the day it was observed, so a session that runs past midnight
// leaves on each day what that day's observations added.
//
// The producers count upward. A Claude session's count is the sum over the
// distinct messages of its transcript, which the host only appends to; a
// Codex session's is the host's own running total less the total before the
// session's start; a launcher's row is one count of one finished worker. So
// a count that falls between two observations of one session is not
// something a producer makes: the basis of the measurement changed (another
// transcript under the same key, a ledger edited by hand), and nothing here
// can tell a restart from a correction. The reading then counts the session
// from the fall on: the observation that fell is taken whole on its day and
// later ones add on theirs, so the sum is the last count, as the meter's
// is. The observations before the fall stay in their days adding nothing,
// and every figure the session touches says so (`fell`), so that no reader
// takes the days of that session as known.
//
// An observation of another scope than the dispatch (a Copilot session's
// cumulative count, a Codex count with no baseline) counts something else:
// it gives no figure here and is counted as unmeasured.

/** The four classes of tokens, which do not overlap: input no cache served,
 * input read from a cache, input written to one, and output. */
export const USAGE_CLASSES = Object.freeze([
  "uncachedInput",
  "cacheRead",
  "cacheWrite",
  "output",
]);

/** @typedef {{uncachedInput: number|null, cacheRead: number|null, cacheWrite: number|null, output: number|null}} UsageClasses */

/** @param {unknown} value @returns {number|null} */
const counted = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;

/** The host a usage source names, by what its counters mean.
 * @param {unknown} source @returns {"claude"|"codex"|null} */
export const usageHost = (source) =>
  typeof source !== "string"
    ? null
    : source.startsWith("claude-")
      ? "claude"
      : source.startsWith("codex-")
        ? "codex"
        : null;

/** The four classes of one usage observation, each `null` where the host
 * reported none. A Claude source counts its input apart from what a cache
 * served or took, so its counters are the classes. A Codex source counts
 * cached input inside its input and reports no cache writes, so its
 * uncached input is the input less the cached part, `null` where it
 * reported no cached part to take away, and its cache write is `null`,
 * never zero. Any other source (a Copilot session, an unavailable
 * reading) gives no class: its counters are not ones this reading can
 * place. Where a host reported every part, its classes sum to its total,
 * so no token is in two classes.
 * @param {{inputTokens?: unknown, cachedInputTokens?: unknown, cacheWriteInputTokens?: unknown, outputTokens?: unknown} | null | undefined} usage
 * @param {unknown} source
 * @returns {UsageClasses} */
export function usageClasses(usage, source) {
  const host = usageHost(source);
  const input = counted(usage?.inputTokens);
  const cached = counted(usage?.cachedInputTokens);
  const output = counted(usage?.outputTokens);
  if (host === "claude")
    return {
      uncachedInput: input,
      cacheRead: cached,
      cacheWrite: counted(usage?.cacheWriteInputTokens),
      output,
    };
  if (host === "codex")
    return {
      // A Codex count of input holds its cached part: where the host
      // reported no cached count the two cannot be told apart, and the
      // uncached class is unknown, never the whole input.
      uncachedInput:
        input === null || cached === null || input < cached
          ? null
          : input - cached,
      cacheRead: cached,
      cacheWrite: null,
      output,
    };
  return {
    uncachedInput: null,
    cacheRead: null,
    cacheWrite: null,
    output: null,
  };
}

/** The classes of several observations summed: for each class the sum of
 * what was reported, and `null` where no observation reported it.
 * @param {readonly UsageClasses[]} parts @returns {UsageClasses} */
export function sumUsageClasses(parts) {
  /** @type {Record<string, number|null>} */
  const total = {};
  for (const name of USAGE_CLASSES) {
    const reported = parts
      .map((part) => part[/** @type {keyof UsageClasses} */ (name)])
      .filter((value) => value !== null);
    total[name] = reported.length
      ? reported.reduce((sum, value) => sum + /** @type {number} */ (value), 0)
      : null;
  }
  return /** @type {UsageClasses} */ (total);
}

/** The local calendar day of an instant, as YYYY-MM-DD: the host's own time
 * zone unless one is named. Null for a value that is no instant.
 * @param {unknown} instant @param {string} [timeZone] @returns {string|null} */
export function localDay(instant, timeZone) {
  const time = typeof instant === "string" ? Date.parse(instant) : NaN;
  if (!Number.isFinite(time)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    ...(timeZone ? { timeZone } : {}),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(time));
  /** @param {string} type */
  const part = (type) => parts.find((entry) => entry.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** An estimate in US dollars of what the classes cost at a model's declared
 * prices, each class multiplied once by its own price for a million tokens;
 * `null` where no price is declared or no class was reported. A class the
 * host reports none of adds nothing.
 * @param {UsageClasses} classes
 * @param {Record<string, number> | null | undefined} price
 * @returns {number|null} */
export function estimateUsd(classes, price) {
  if (!price) return null;
  const reported = USAGE_CLASSES.filter(
    (name) => classes[/** @type {keyof UsageClasses} */ (name)] !== null,
  );
  if (!reported.length) return null;
  return reported.reduce(
    (sum, name) =>
      sum +
      ((classes[/** @type {keyof UsageClasses} */ (name)] ?? 0) *
        (price[name] ?? 0)) /
        1_000_000,
    0,
  );
}

/** @typedef {{classes: UsageClasses, totalTokens: number|null, reportedUsd: number|null}} UsageFigures */

/** When a row was recorded and observed, for the order of a series.
 * @param {unknown} value */
const instant = (value) => {
  const time = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(time) ? time : -Infinity;
};

/**
 * What each observation of one dispatch adds to the one before it, in the
 * order the observations were made (the instant each counts up to, and the
 * instant it was recorded where it names none or two share one): two
 * recorders of one session may write out of turn. The first is taken whole.
 * A figure a later observation does not report adds nothing known, and the
 * last value reported stands as the one before. An observation of another
 * scope than the dispatch counts something else and gives no figure. An
 * observation that adds nothing known is left out where the dispatch has
 * another; where none of them holds a figure at all, each stands on its
 * day, so that every day the session was seen says it was not measured.
 * Where a later observation counts less than an earlier one, which no
 * producer does, the later is taken whole and those after it add to it,
 * every observation of the session is marked `fell`, and the earlier ones
 * stay in their days adding nothing: the sum is the last observation's
 * count, no day is given a negative one, and each day the session touched
 * says its figure is not known.
 * @template {{observation?: {source?: string, scope?: string, observedAt?: string|null, usage?: Record<string, unknown>}, recordedAt?: string}} Row
 * @param {readonly Row[]} observations
 * @returns {{row: Row, added: UsageFigures, fell: boolean}[]} */
export function usageIncrements(observations) {
  /** @param {Row} row */
  const made = (row) => {
    const observed = instant(row.observation?.observedAt);
    return observed === -Infinity ? instant(row.recordedAt) : observed;
  };
  const ordered = [...observations].sort(
    (a, b) =>
      made(a) - made(b) || instant(a.recordedAt) - instant(b.recordedAt),
  );
  /** @param {Row} row @returns {(number|null)[]} */
  const figures = (row) => {
    const scope = row.observation?.scope;
    return typeof scope === "string" && scope !== "dispatch"
      ? [...USAGE_CLASSES.map(() => null), null, null]
      : [
          ...Object.values(
            usageClasses(row.observation?.usage, row.observation?.source),
          ),
          counted(row.observation?.usage?.totalTokens),
          counted(row.observation?.usage?.costUsd),
        ];
  };
  /** @param {(number|null)[]} values @returns {UsageFigures} */
  const shaped = (values) => ({
    classes: /** @type {UsageClasses} */ (
      Object.fromEntries(
        USAGE_CLASSES.map((name, index) => [name, values[index]]),
      )
    ),
    totalTokens: values[USAGE_CLASSES.length] ?? null,
    reportedUsd: values[USAGE_CLASSES.length + 1] ?? null,
  });
  /** @type {{row: Row, added: (number|null)[], aside: boolean}[]} */
  let placed = [];
  /** The last value each figure was reported at.
   * @type {(number|null)[] | null} */
  let known = null;
  let fell = false;
  for (const row of ordered) {
    const now = figures(row);
    /** @type {(number|null)[] | null} */
    const before = known;
    /** @param {number} index @returns {number|null} */
    const earlier = (index) => before?.[index] ?? null;
    if (
      before === null ||
      now.some((value, index) => {
        const was = earlier(index);
        return value !== null && was !== null && value < was;
      })
    ) {
      if (before !== null) {
        fell = true;
        placed = placed.map((entry) => ({
          row: entry.row,
          added: entry.added.map((value) => (value === null ? null : 0)),
          aside: true,
        }));
      }
      placed.push({ row, added: now, aside: false });
      known = now;
      continue;
    }
    placed.push({
      row,
      aside: false,
      added: now.map((value, index) => {
        const was = earlier(index);
        return value === null ? null : was === null ? value : value - was;
      }),
    });
    known = now.map((value, index) => value ?? earlier(index));
  }
  // A session none of whose observations holds a figure keeps them all.
  const measured = placed.some(({ added }) =>
    added.some((value) => value !== null),
  );
  const kept = measured
    ? placed.filter(
        ({ added, aside }) =>
          aside || added.some((value) => value !== null && value !== 0),
      )
    : placed;
  return (kept.length ? kept : placed.slice(-1)).map(({ row, added }) => ({
    row,
    added: shaped(added),
    fell,
  }));
}

/**
 * The reading: the given usage rows by order and by local calendar day,
 * each observation counted once, on the day it was observed, for what it
 * adds to the one before it of the same dispatch (rows that share a
 * `series`; a row that names none stands alone). A row names its order
 * (or, for a planning pass, its dispatch), its role, its observation and,
 * where a record attests one, the model that ran. The estimate of a group is
 * the sum of its rows' estimates and `null` where any of them has none, so a
 * figure never stands for less than it names. Beside each whole figure a
 * group carries what it is known to have used at the least: `knownTokens`,
 * the sum of each observation's total where it reported one and of the
 * classes it reported where it did not, and `knownUsd`, the sum of the
 * estimates its observations have. An observation with no count or no
 * estimate adds nothing to either and takes nothing from what the others
 * measured, whichever group it falls in.
 * @param {readonly {workOrder?: string|null, dispatch?: string, role: string, model?: string|null, series?: string, recordedAt?: string, observation: {source?: string, scope?: string, observedAt?: string|null, usage?: Record<string, unknown>}}[]} rows
 * @param {{since?: string, timeZone?: string, prices?: Record<string, Record<string, number>>}} [options]
 */
export function usageReading(rows, options = {}) {
  const { since, timeZone, prices = {} } = options;
  /** The price the instance declared under that very id: a model whose id
   * is a name every object inherits has none.
   * @param {string|null} model */
  const priceOf = (model) =>
    model !== null && Object.hasOwn(prices, model) ? prices[model] : null;
  /** @type {Map<string, (typeof rows)[number][]>} */
  const dispatches = new Map();
  rows.forEach((row, index) => {
    const key =
      typeof row.series === "string" ? `series ${row.series}` : `row ${index}`;
    dispatches.set(key, [...(dispatches.get(key) ?? []), row]);
  });
  const read = [...dispatches.values()]
    .flatMap((observations) => usageIncrements(observations))
    .map(({ row, added, fell }) => {
      const model = typeof row.model === "string" ? row.model : null;
      return {
        subject: row.workOrder ?? `planning ${row.dispatch ?? "unnamed"}`,
        role: row.role,
        model,
        day: localDay(
          row.observation?.observedAt ?? row.recordedAt ?? null,
          timeZone,
        ),
        classes: added.classes,
        totalTokens: added.totalTokens,
        reportedUsd: added.reportedUsd,
        estimateUsd: estimateUsd(added.classes, priceOf(model)),
        fell,
      };
    })
    .filter((row) => !since || (row.day !== null && row.day >= since));
  /** @typedef {(typeof read)[number]} Read */
  /** The sum of one figure over a group, or null where a row has none.
   * @param {readonly Read[]} group
   * @param {(row: Read) => number|null} figure */
  const whole = (group, figure) =>
    group.every((row) => figure(row) !== null)
      ? group.reduce((sum, row) => sum + (figure(row) ?? 0), 0)
      : null;
  /** The tokens one observation is known to add: its total where the host
   * reported one, and the classes it did report where it reported none.
   * @param {Read} row */
  const known = (row) =>
    row.totalTokens ??
    USAGE_CLASSES.reduce(
      (sum, name) =>
        sum + (row.classes[/** @type {keyof UsageClasses} */ (name)] ?? 0),
      0,
    );
  /** @param {readonly Read[]} group */
  const summed = (group) => ({
    tokens: sumUsageClasses(group.map((row) => row.classes)),
    totalTokens: whole(group, (row) => row.totalTokens),
    reportedUsd: whole(group, (row) => row.reportedUsd),
    estimateUsd: whole(group, (row) => row.estimateUsd),
    // The least the group used, summed an observation at a time.
    knownTokens: group.reduce((sum, row) => sum + known(row), 0),
    knownUsd: group.reduce((sum, row) => sum + (row.estimateUsd ?? 0), 0),
    observations: group.length,
    // Observations of a session whose count fell: its days are not known.
    fell: group.filter((row) => row.fell).length,
    // Observations that hold no counter at all: a class's sum is of what
    // was measured, and this says how much of the group was not.
    unmeasured: group.filter(
      (row) =>
        row.totalTokens === null &&
        USAGE_CLASSES.every(
          (name) =>
            row.classes[/** @type {keyof UsageClasses} */ (name)] === null,
        ),
    ).length,
  });
  /** @param {readonly Read[]} group
   * @param {(row: Read) => string}  key
   * @returns {[string, Read[]][]} */
  const grouped = (group, key) => {
    /** @type {Map<string, Read[]>} */
    const groups = new Map();
    for (const row of group)
      groups.set(key(row), [...(groups.get(key(row)) ?? []), row]);
    return [...groups].sort(([a], [b]) => a.localeCompare(b));
  };
  /** @param {readonly Read[]} group */
  const roles = (group) =>
    grouped(
      group,
      (row) => `${row.subject}\0${row.role}\0${row.model ?? ""}`,
    ).map(([, part]) => ({
      subject: part[0]?.subject ?? "",
      role: part[0]?.role ?? "",
      model: part[0]?.model ?? null,
      ...summed(part),
    }));
  return {
    schemaVersion: 1,
    timeZone:
      timeZone ?? new Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    since: since ?? null,
    classes: [...USAGE_CLASSES],
    prices: Object.fromEntries(
      [...new Set(read.map((row) => row.model))]
        .flatMap((model) => (model !== null && priceOf(model) ? [model] : []))
        .sort()
        .map((model) => [model, priceOf(model)]),
    ),
    byOrder: grouped(read, (row) => row.subject).map(([subject, group]) => ({
      subject,
      ...summed(group),
      roles: roles(group),
    })),
    byDay: grouped(read, (row) => row.day ?? "unknown").map(([day, group]) => ({
      day,
      ...summed(group),
      roles: roles(group),
    })),
  };
}

/** The reading as lines an operator reads: tokens by class for each order
 * and each day, the host's own reported cost where it gave one, and the
 * estimate, marked as an estimate, or `unknown` where no price is declared
 * for the model that ran.
 * @param {ReturnType<typeof usageReading>} reading */
export function renderUsageReading(reading) {
  /** @param {number|null} value */
  const number = (value) =>
    value === null ? "unknown" : value.toLocaleString("en-US");
  /** @param {number|null} value */
  const dollars = (value) =>
    value === null ? "unknown" : `$${value.toFixed(2)}`;
  /** @param {{tokens: UsageClasses, totalTokens: number|null, reportedUsd: number|null, estimateUsd: number|null, unmeasured: number, fell: number}} row */
  const figures = (row) =>
    `uncached input ${number(row.tokens.uncachedInput)}; cache read ${number(row.tokens.cacheRead)}; cache write ${number(row.tokens.cacheWrite)}; output ${number(row.tokens.output)}; total ${number(row.totalTokens)}; reported by the host ${dollars(row.reportedUsd)}; estimate ${row.estimateUsd === null ? "unknown" : `${dollars(row.estimateUsd)} (an estimate)`}${row.unmeasured ? `; ${row.unmeasured} of its observations gave no count of the dispatch, and the classes sum the rest` : ""}${row.fell ? `; ${row.fell} of its observations are of a session whose count fell between observations: that session is counted from the fall on, and what it used on each day is not known` : ""}`;
  /** @param {ReturnType<typeof usageReading>["byOrder"][number]["roles"][number]} row */
  const role = (row) =>
    `  ${row.subject} ${row.role} (${row.model ?? "model not attested"}): ${figures(row)}`;
  const priced = Object.keys(reading.prices);
  return [
    `Usage in tokens by class${reading.since ? ` since ${reading.since}` : ""}; local calendar days in ${reading.timeZone ?? "the host's time zone"}. A class a host reports none of reads unknown.`,
    priced.length
      ? `Estimates use the prices of this instance's dotln.models.json for ${priced.join(", ")}, in US dollars for a million tokens, as declared now; a cost the host reported is the figure of record.`
      : "No price is declared in dotln.models.json for a model that ran, so no estimate is made.",
    "",
    "By order:",
    ...(reading.byOrder.length
      ? reading.byOrder.flatMap((order) => [
          `${order.subject}: ${figures(order)}`,
          ...order.roles.map(role),
        ])
      : ["no usage observation"]),
    "",
    "By day:",
    ...(reading.byDay.length
      ? reading.byDay.flatMap((day) => [
          `${day.day}: ${figures(day)}`,
          ...day.roles.map(role),
        ])
      : ["no usage observation"]),
  ].join("\n");
}
