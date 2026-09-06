// Deliberately conservative lexical enumeration, not a TypeScript parser.
// Comments, regexes and whole templates (including interpolations) are opaque.
import { createHash } from "node:crypto";

export const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

export const seeds = [
  {
    file: "packages/compiler/src/compile.ts",
    before:
      "support.supportedTags.some((tag) =>\n      active.tags.includes(tag),\n    )",
    after: "true",
    operator: "condition-force-true",
    claim:
      "WO-008 AC1: the tag half of link compatibility rejects incompatible tags.",
  },
  {
    file: "packages/compiler/src/compile.ts",
    before: "tied !== undefined) {",
    after: "tied !== undefined && Boolean(0)) {",
    operator: "condition-neuter",
    claim: "WO-008 AC3: equal-precedence incompatible claims are rejected.",
  },
  {
    file: "packages/compiler/src/compile.ts",
    before:
      "active.requiredCapabilities.filter(\n      (capability) => !capabilities.has(capability),\n    )",
    after: "active.requiredCapabilities.filter(() => false)",
    operator: "condition-neuter",
    claim:
      "WO-008 AC1: an active mechanic with missing capabilities is inactive.",
  },
  {
    file: "packages/compiler/src/compile.ts",
    before: "duplicates.add(key);",
    after: "{}",
    operator: "statement-delete",
    claim: "WO-008 graph validation: duplicate component ids are rejected.",
  },
  {
    file: "packages/compiler/src/compile.ts",
    before: "group.linkIds.length > container.socketBudget",
    after: "group.linkIds.length > Number.MAX_SAFE_INTEGER",
    operator: "condition-neuter",
    claim:
      "WO-008 graph validation: container socket-budget overflow is rejected.",
  },
  {
    file: "packages/compiler/src/normalize.ts",
    before: "[...value.orderedSupportFacetIds]",
    after: "[...new Set(value.orderedSupportFacetIds)]",
    operator: "ordered-array-deduplicate",
    claim:
      "WO-008 normalization contract: explicit pipelines retain multiplicity.",
  },
  {
    file: "packages/compiler/src/normalize.ts",
    before: "[...value.updateLaws]",
    after: "[]",
    operator: "array-content-delete",
    claim:
      "WO-008 round-trip contract: identity update laws survive normalization.",
  },
  {
    file: "packages/compiler/src/compile.ts",
    before: "...support.cost,",
    after: "...support.cost, promptTokens: 0,",
    operator: "numeric-force-zero",
    claim: "WO-008 AC4: support prompt-token costs are emitted faithfully.",
  },
];

export function tokens(source) {
  const out = [];
  let i = 0;
  const quoted = (quote) => {
    i++;
    while (i < source.length) {
      if (source[i] === "\\") i += 2;
      else if (source[i++] === quote) return;
    }
    throw new Error("unterminated quoted token");
  };
  const template = () => {
    i++;
    while (i < source.length) {
      if (source[i] === "\\") i += 2;
      else if (source[i] === "`") {
        i++;
        return;
      } else if (source.slice(i, i + 2) === "${") {
        i += 2;
        scan(true);
      } else i++;
    }
    throw new Error("unterminated template");
  };
  const scan = (interpolation = false) => {
    let depth = 0;
    let previous = "=";
    while (i < source.length) {
      const start = i;
      const c = source[i];
      if (/\s/u.test(c)) {
        i++;
        continue;
      }
      if (source.slice(i, i + 2) === "//") {
        while (i < source.length && source[i] !== "\n") i++;
        continue;
      }
      if (source.slice(i, i + 2) === "/*") {
        const end = source.indexOf("*/", i + 2);
        if (end < 0) throw new Error("unterminated comment");
        i = end + 2;
        continue;
      }
      let kind = "punctuation";
      if (c === '"' || c === "'") {
        quoted(c);
        kind = "string";
      } else if (c === "`") {
        template();
        kind = "opaque";
      } else if (
        c === "/" &&
        /^(?:=|\(|\[|\{|,|:|;|!|\?|&&|\|\||=>|return|case|throw)$/u.test(
          previous,
        )
      ) {
        i++;
        let bracket = false,
          closed = false;
        while (i < source.length && source[i] !== "\n") {
          if (source[i] === "\\") {
            i += 2;
            continue;
          }
          if (source[i] === "[") bracket = true;
          if (source[i] === "]") bracket = false;
          if (source[i++] === "/" && !bracket) {
            closed = true;
            break;
          }
        }
        if (!closed) throw new Error("ambiguous slash: refuse enumeration");
        while (/[a-z]/iu.test(source[i] ?? "")) i++;
        kind = "opaque";
      } else if (/[a-z_$]/iu.test(c)) {
        i++;
        while (/[a-z0-9_$]/iu.test(source[i] ?? "")) i++;
        kind = "identifier";
      } else if (/[0-9]/u.test(c)) {
        i++;
        while (/[a-z0-9_.]/iu.test(source[i] ?? "")) i++;
        kind = "number";
      } else {
        const operator = [
          "===",
          "!==",
          "...",
          ">>>",
          "=>",
          "<=",
          ">=",
          "==",
          "!=",
          "&&",
          "||",
          "??",
          "?.",
          "++",
          "--",
          "**",
          "+=",
          "-=",
          "*=",
          "/=",
          "<<",
          ">>",
        ].find((value) => source.startsWith(value, i));
        i += operator?.length ?? 1;
      }
      const value = source.slice(start, i);
      if (interpolation && value === "}" && depth === 0) return;
      if (value === "{") depth++;
      if (value === "}") depth--;
      if (!interpolation) out.push({ start, end: i, value, kind });
      previous = value;
    }
    if (interpolation) throw new Error("unterminated interpolation");
  };
  scan();
  return out;
}

const claimFor = (file) => {
  if (file.startsWith("packages/kernel/"))
    return "Kernel acceptance suites: cadence, authorization, replay, continuation and outbox behavior at this site. Survival is a local detection gap, not a capability verdict.";
  if (file.startsWith("packages/compiler/"))
    return "Compiler acceptance suites: validation, normalization and emitted contracts at this site. Survival is a local detection gap, not a capability verdict.";
  return "Skeleton acceptance suites: runtime, host and projection behavior at this site. Survival is a local detection gap, not a capability verdict.";
};

export function enumerate(sources, { requireSeeds = true } = {}) {
  const candidates = [],
    seen = new Set();
  const add = (file, start, end, after, operator, extra = {}) => {
    const source = sources.get(file);
    const before = source.slice(start, end);
    const key = JSON.stringify([file, start, end, after]);
    if (before === after || seen.has(key)) return;
    seen.add(key);
    candidates.push({
      file,
      line: source.slice(0, start).split("\n").length,
      start,
      end,
      before,
      after,
      operator,
      sourceHash: sha256(source),
      claim: claimFor(file),
      ...extra,
    });
  };
  for (const [index, seed] of seeds.entries()) {
    const source = sources.get(seed.file);
    const at = source?.indexOf(seed.before) ?? -1;
    if (at < 0 || source.indexOf(seed.before, at + 1) !== -1) {
      if (requireSeeds)
        throw new Error(`seed ${index + 1} is missing or ambiguous`);
      continue;
    }
    add(seed.file, at, at + seed.before.length, seed.after, seed.operator, {
      seed: index + 1,
      claim: seed.claim,
    });
  }
  const seeded = candidates.splice(0);
  for (const file of [...sources.keys()].sort()) {
    const source = sources.get(file),
      ts = tokens(source);
    for (let n = 0; n < ts.length; n++) {
      const t = ts[n],
        prev = ts[n - 1],
        next = ts[n + 1];
      if (
        ["===", "!==", "<=", ">="].includes(t.value) ||
        (["<", ">"].includes(t.value) &&
          (prev?.kind === "number" ||
            next?.kind === "number" ||
            prev?.value === "length" ||
            prev?.value === "size"))
      ) {
        add(
          file,
          t.start,
          t.end,
          {
            "===": "!==",
            "!==": "===",
            "<": "<=",
            "<=": "<",
            ">": ">=",
            ">=": ">",
          }[t.value],
          "comparison-swap",
        );
      }
      // Binary, space-separated arithmetic; omit unary signs and type syntax.
      if (
        ["+", "-", "*", "/"].includes(t.value) &&
        prev &&
        next &&
        /\s/u.test(source[t.start - 1] ?? "") &&
        /\s/u.test(source[t.end] ?? "") &&
        (prev.kind === "number" ||
          prev.value === ")" ||
          prev.value === "length") &&
        ![";", "from"].includes(next.value)
      )
        add(
          file,
          t.start,
          t.end,
          { "+": "-", "-": "+", "*": "/", "/": "*" }[t.value],
          "arithmetic-swap",
        );
      if (
        t.kind === "number" &&
        /^\d+$/u.test(t.value) &&
        ["<", "<=", ">", ">=", "+", "-", "*", "/", "return"].includes(
          prev?.value,
        ) &&
        Number.isSafeInteger(Number(t.value) + 1)
      )
        add(
          file,
          t.start,
          t.end,
          String(Number(t.value) + 1),
          "numeric-off-by-one",
        );
      if (
        t.kind === "string" &&
        prev?.value === ":" &&
        ["trace", "reason", "message"].includes(ts[n - 2]?.value)
      )
        add(
          file,
          t.start,
          t.end,
          t.value.slice(0, -1) + " [mutation]" + t.value.at(-1),
          "trace-string-perturb",
        );
      if (t.value === "if" && next?.value === "(") {
        let depth = 1,
          j = n + 2;
        for (; j < ts.length && depth; j++) {
          if (ts[j].value === "(") depth++;
          if (ts[j].value === ")") depth--;
        }
        const end = ts[j - 1];
        if (!depth && end.start - next.end < 500) {
          const condition = source.slice(next.end, end.start);
          add(file, next.end, end.start, `!(${condition})`, "condition-invert");
          // Preserve the original narrowing on the true branch.
          add(
            file,
            next.end,
            end.start,
            `(${condition}) && Boolean(0)`,
            "condition-neuter",
          );
        }
      }
      if (t.value === "return" && next?.value === ";")
        add(file, t.start, next.end, "{}", "early-return-delete");
      // Exact one-statement side-effect deletion, with a semicolon retaining
      // the body of a one-line if. No variable declarations or block deletion.
      if (
        t.kind === "identifier" &&
        next?.value === "." &&
        ["push", "add", "set", "delete"].includes(ts[n + 2]?.value) &&
        ts[n + 3]?.value === "(" &&
        /^[ \t]*$/u.test(
          source.slice(source.lastIndexOf("\n", t.start - 1) + 1, t.start),
        )
      ) {
        let depth = 1,
          j = n + 4;
        for (; j < ts.length && depth; j++) {
          if (ts[j].value === "(") depth++;
          if (ts[j].value === ")") depth--;
        }
        if (!depth && ts[j]?.value === ";" && ts[j].end - t.start < 500)
          add(file, t.start, ts[j].end, "{}", "statement-delete");
      }
      if (
        t.value === "[" &&
        next?.value === "..." &&
        ts[n + 2]?.kind === "identifier"
      ) {
        let j = n + 3;
        while (ts[j]?.value === "." && ts[j + 1]?.kind === "identifier") j += 2;
        if (ts[j]?.value === "]")
          add(
            file,
            t.start,
            ts[j].end,
            `[...new Set(${source.slice(ts[n + 2].start, ts[j].start)})]`,
            "ordered-array-deduplicate",
          );
      }
    }
  }
  // Seeds first, then round-robin across file/operator buckets. A bounded
  // prefix samples packages and operators instead of exhausting one file.
  const buckets = new Map();
  for (const site of candidates) {
    const key = `${site.file}\0${site.operator}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(site);
  }
  const ordered = [...seeded];
  for (let depth = 0; ; depth++) {
    const layer = [...buckets.keys()]
      .sort()
      .flatMap((key) => buckets.get(key)[depth] ?? []);
    if (!layer.length) break;
    ordered.push(...layer);
  }
  return ordered.map((site, index) => ({
    id: `M${String(index + 1).padStart(5, "0")}`,
    ...site,
  }));
}

export function applySite(source, site) {
  if (
    sha256(source) !== site.sourceHash ||
    source.slice(site.start, site.end) !== site.before
  )
    throw new Error(`source drift at ${site.id}`);
  return source.slice(0, site.start) + site.after + source.slice(site.end);
}

// A fully runnable contemporary campaign, selected before any verdict exists.
// Keep the complete candidate census alongside it so selection is auditable.
export function selectCampaign(candidates) {
  const selected = candidates.filter((site) => site.seed);
  if (selected.length !== 8)
    throw new Error("campaign needs all eight historical seeds");
  const pick = (file, operators) => {
    const choices = operators.flatMap((operator) =>
      candidates.filter(
        (site) =>
          site.file === file &&
          site.operator === operator &&
          !selected.includes(site),
      ),
    );
    if (!choices.length)
      throw new Error(`campaign has no eligible site in ${file}`);
    const preferred = choices.filter(
      (site) => site.operator === choices[0].operator,
    );
    selected.push(preferred[Math.floor((preferred.length - 1) / 2)]);
  };
  for (const operator of [
    "comparison-swap",
    "condition-invert",
    "arithmetic-swap",
    "numeric-off-by-one",
    "trace-string-perturb",
  ])
    pick("packages/kernel/src/core.ts", [operator]);
  pick("packages/kernel/src/store.ts", [
    "condition-neuter",
    "condition-invert",
    "statement-delete",
  ]);
  const preferred = [
    "condition-neuter",
    "statement-delete",
    "numeric-off-by-one",
    "comparison-swap",
    "ordered-array-deduplicate",
  ];
  for (const file of [
    "feedback",
    "verification",
    "senses",
    "artifact-identity",
    "normalize",
    "compile",
  ])
    pick(`packages/compiler/src/${file}.ts`, preferred);
  for (const file of [
    "reactor.ts",
    "worker-host.ts",
    "worker-store.ts",
    "worker-transport.ts",
    "verification.ts",
    "verification-host.ts",
    "verification-protocol.ts",
    "beacon-observe.ts",
    "beacon-perception.ts",
    "beacon-v3-fs.mjs",
    "feedback-boundary.ts",
    "feedback-source-comments.ts",
  ])
    pick(`packages/skeleton/src/${file}`, preferred);
  const currentClaims = [
    "Kernel authorization: only a named resource is decremented when an intent is admitted (ac6-authorization.test.ts).",
    "Kernel authorization: unavailable revocation predicates cause refusal rather than unchecked dispatch (ac6-authorization.test.ts).",
    "Kernel cadence: seeded Backoff jitter preserves the specified delay calculation (ac3-cadence.test.ts).",
    "Kernel cadence: Backoff retains its unit center before applying jitter (ac3-cadence.test.ts).",
    "Kernel cadence: cancellation by Until emits the specified trace (ac3-cadence.test.ts).",
    "Kernel store: a truncated JSONL tail without a final newline is rejected (ac2-replay-store.test.ts).",
    "WO-011 feedback: a rejected approach needs explicit supersession before reuse (compiler feedback.test.ts).",
    "WO-010 verification: invalid contract inputs are rejected by the shared invariant check (compiler verification.test.ts).",
    "WO-022 senses: unknown or duplicate equipped senses are rejected (compiler senses.test.ts).",
    "WO-029 identity: component manifest entries require a matching normalized definition and version (compiler artifact-identity.test.ts).",
    "Compiler canonical JSON rejects non-finite numbers before hashing (compiler views.test.ts).",
    "WO-023 compilation rejects wildcard authority combined with linked authority claims (compiler compiler.test.ts).",
    "Beacon reactor: reachable observations receive the appropriate age reevaluation cadence (skeleton beacon.test.ts).",
    "WO-009 worker recovery consumes a cached result without repeating the physical worker episode (skeleton worker.test.ts).",
    "WO-009 worker store releases its owned host lock for subsequent acquisition (skeleton worker.test.ts).",
    "WO-009 transport rejects effort claims unsupported by the selected Codex profile (skeleton worker.test.ts).",
    "WO-010 matrix projection derives verification streams from host-authored VerificationOpened events (skeleton verification.test.ts).",
    "WO-010 host refuses another physical verification episode while the prior lease remains live (skeleton verification.test.ts).",
    "WO-010 admission requires failing evidence to support a failing criterion verdict (skeleton verification.test.ts).",
    "WO-022 observation rejects malformed, unknown or duplicate selected senses before perception (skeleton senses.test.ts).",
    "WO-022 replay checks decoded Beacon fields against their captured metadata (skeleton senses.test.ts).",
    "WO-021 v3 Beacon writes require a compatible sparse storage profile (skeleton senses-v3.test.ts).",
    "WO-011 feedback boundary prevents the effect when the compiled verdict refuses (skeleton feedback-fixtures.test.ts).",
    "WO-011 source-comment traversal treats JSDoc as comment trivia, without revisiting it as a token subtree (skeleton feedback-fixtures.test.ts); this guard may be redundant for some parser traversals.",
  ];
  if (selected.length !== 8 + currentClaims.length)
    throw new Error("campaign selection and claim inventory differ");
  return selected.map((site, index) => ({
    ...site,
    candidateId: site.id,
    id: `M${String(index + 1).padStart(5, "0")}`,
    claim: index < 8 ? site.claim : currentClaims[index - 8],
  }));
}
