import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { commandId, stableHash } from "../src/index.js";

// AC7: `packages/kernel/README.md` maps each exported type to its domain-model entry.
// Evidence hardening against the three defeats named in docs/verifications/WO-002/VER-002.md §AC7:
//   (a) matching export names against the description column instead of the left column;
//   (b) missing export forms (namespace members, `export { X }` lists, multi-declarator
//       consts) and reading a hard-coded file list instead of globbing dist/src/*.d.ts;
//   (c) never reading docs/product/02-domain-model.md at all.

// ---------- inline helpers ----------

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const containsWord = (text: string, term: string): boolean => new RegExp(`(?<![A-Za-z0-9_$])${escapeRegExp(term)}(?![A-Za-z0-9_$])`).test(text);

/** Split on commas that sit outside <>, (), [] and {} — `=>` arrows do not close a depth level. */
const splitTopLevelCommas = (text: string): readonly string[] => {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let previous = "";
  for (const char of text) {
    if (char === "<" || char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") depth = Math.max(0, depth - 1);
    else if (char === ">" && previous !== "=") depth = Math.max(0, depth - 1);
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else current += char;
    previous = char;
  }
  parts.push(current);
  return parts;
};

/** `export declare const a: X, b: Y;` introduces both `a` and `b`. */
const addDeclarators = (line: string, into: Set<string>): void => {
  const afterKeyword = line.replace(/^.*?\b(?:const|let|var)\s+/, "");
  for (const declarator of splitTopLevelCommas(afterKeyword)) {
    const name = /^\s*([A-Za-z_$][\w$]*)/.exec(declarator);
    if (name !== null) into.add(name[1]!);
  }
};

interface ExportSurface { readonly top: ReadonlySet<string>; readonly members: ReadonlyMap<string, ReadonlySet<string>> }

/**
 * Every export form a .d.ts can carry: top-level declarations (multi-declarator consts
 * included), `export { X, Y as Z }` lists, and the indented member declarations inside
 * `export declare namespace` blocks. `export * from` lines contribute nothing because the
 * re-exported module's own .d.ts is also globbed.
 */
const extractExports = (dts: string): ExportSurface => {
  const top = new Set<string>();
  const members = new Map<string, Set<string>>();
  let currentNamespace: Set<string> | undefined;
  for (const raw of dts.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (currentNamespace !== undefined) {
      if (line.startsWith("}")) {
        currentNamespace = undefined;
        continue;
      }
      const member = /^[ \t]+(?:export\s+)?(?:declare\s+)?(?:abstract\s+)?(const|let|var|type|interface|class|function|enum)\s+([A-Za-z_$][\w$]*)/.exec(line);
      if (member !== null) {
        if (member[1] === "const" || member[1] === "let" || member[1] === "var") addDeclarators(line, currentNamespace);
        else currentNamespace.add(member[2]!);
      }
      continue;
    }
    const namespaceDecl = /^export\s+(?:declare\s+)?namespace\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (namespaceDecl !== null) {
      const name = namespaceDecl[1]!;
      top.add(name);
      const bucket = members.get(name) ?? new Set<string>();
      members.set(name, bucket);
      currentNamespace = bucket;
      continue;
    }
    const exportList = /^export\s+(?:type\s+)?\{([^}]*)\}/.exec(line);
    if (exportList !== null) {
      for (const rawEntry of exportList[1]!.split(",")) {
        const entry = rawEntry.trim();
        if (entry === "") continue;
        const aliased = /\bas\s+([A-Za-z_$][\w$]*)\s*$/.exec(entry);
        const direct = /^(?:type\s+)?([A-Za-z_$][\w$]*)/.exec(entry);
        const name = aliased?.[1] ?? direct?.[1];
        if (name !== undefined) top.add(name);
      }
      continue;
    }
    const decl = /^export\s+(?:declare\s+)?(?:abstract\s+)?(const|let|var|type|interface|class|function|enum)\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (decl !== null) {
      if (decl[1] === "const" || decl[1] === "let" || decl[1] === "var") addDeclarators(line, top);
      else top.add(decl[2]!);
    }
  }
  return { top, members };
};

const srcDir = fileURLToPath(new URL("../src/", import.meta.url));

const discoverSurface = (): { readonly files: readonly string[]; readonly top: ReadonlySet<string>; readonly members: ReadonlyMap<string, ReadonlySet<string>> } => {
  const files = readdirSync(srcDir).filter(file => file.endsWith(".d.ts")).sort();
  const top = new Set<string>();
  const members = new Map<string, Set<string>>();
  for (const file of files) {
    const surface = extractExports(readFileSync(join(srcDir, file), "utf8"));
    for (const name of surface.top) top.add(name);
    for (const [namespaceName, namespaceMembers] of surface.members) {
      const bucket = members.get(namespaceName) ?? new Set<string>();
      members.set(namespaceName, bucket);
      for (const member of namespaceMembers) bucket.add(member);
    }
  }
  return { files, top, members };
};

interface MapRow { readonly left: string; readonly right: string }

const parseMapRows = (): readonly MapRow[] => {
  const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");
  const section = readme.split("## Domain-model map")[1];
  assert.ok(section !== undefined, "README.md has no '## Domain-model map' section");
  const tableLines: string[] = [];
  let inTable = false;
  for (const line of section.split("\n")) {
    if (line.startsWith("|")) {
      inTable = true;
      tableLines.push(line);
    } else if (inTable) break;
  }
  const header = tableLines[0];
  const separator = tableLines[1];
  assert.ok(header !== undefined && separator !== undefined, "domain-model map table is missing");
  assert.match(header, /Export/);
  assert.match(header, /Domain-model entry/);
  return tableLines.slice(2).map(line => {
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map(cell => cell.replace(/\\\|/g, "|").trim());
    assert.equal(cells.length, 2, `map row does not have exactly two cells: ${line}`);
    return { left: cells[0]!, right: cells[1]! };
  });
};

const leftColumnNames = (rows: readonly MapRow[]): ReadonlySet<string> => {
  const names = new Set<string>();
  for (const row of rows) {
    for (const match of row.left.matchAll(/`([^`]+)`/g)) {
      const name = match[1]!;
      assert.match(name, /^[A-Za-z_$][\w$]*$/, `left-column entry \`${name}\` is not a bare export name`);
      names.add(name);
    }
  }
  return names;
};

// The complete export surface at the time of writing: 30 from types.d.ts, 22 from
// core.d.ts, 4 from store.d.ts. New exports extend this; none may vanish silently.
const KNOWN_SURFACE: readonly string[] = [
  "JsonPrimitive", "JsonValue", "EventEnvelope", "EventDraft", "Comparison", "Refusal", "Event",
  "PredicateRef", "EventPattern", "Program", "Cadence", "ActIntent", "WaitIntent", "ObserveIntent",
  "NoOpIntent", "Intent", "DecisionTrace", "Schedule", "Decision", "KernelEnv", "Predicate",
  "PredicateRegistry", "Reactor", "AuthorityEnvelope", "Command", "CommandReceipt", "WorkOrder",
  "ResultEnvelope", "OutboxEntry", "OutboxState",
  "predicate", "CadenceResult", "evaluateCadence", "ProgramStep", "stepProgram", "ProgramDecision",
  "decideProgram", "serializeContinuation", "deserializeContinuation", "stableHash", "commandId",
  "AuthorizationResult", "authorize", "ReplayResult", "replay", "emptyOutbox", "persistCommand",
  "pendingCommands", "replayOutbox", "applyCommandResult", "PresenceDecision", "guardQueuedPulse",
  "JsonlLog", "appendEvent", "decodeLog", "encodeLog",
];

// ---------- tests ----------

test("AC7 evidence: export extraction catches namespace members, export lists, and multi-declarator consts (literal fixture)", () => {
  const fixture = [
    "export declare const alpha: number, beta: (pair: Map<string, number>) => void;",
    'export { gamma, delta as epsilon, type Zeta } from "./elsewhere.js";',
    "export declare namespace Omega {",
    "    interface Inner {",
    '        readonly kind: "Inner";',
    "    }",
    "    const Inner: () => Inner;",
    "    const first: string, second: Record<string, () => number>;",
    "    type T = Inner;",
    "}",
    "export interface Standalone {",
    "    readonly value: string;",
    "}",
  ].join("\n");
  const surface = extractExports(fixture);
  assert.deepEqual([...surface.top].sort(), ["Omega", "Standalone", "Zeta", "alpha", "beta", "epsilon", "gamma"]);
  assert.deepEqual([...surface.members.keys()], ["Omega"]);
  assert.deepEqual([...surface.members.get("Omega")!].sort(), ["Inner", "T", "first", "second"]);
});

test("AC7 evidence: every export discovered from dist/src/*.d.ts appears as a README map left-column name, with no ghost rows", () => {
  const { files, top } = discoverSurface();
  for (const required of ["core.d.ts", "index.d.ts", "store.d.ts", "types.d.ts"]) {
    assert.ok(files.includes(required), `expected ${required} among globbed declaration files, found only: ${files.join(", ")}`);
  }
  const missingKnown = KNOWN_SURFACE.filter(name => !top.has(name));
  assert.deepEqual(missingKnown, [], "known exports were not discovered by the .d.ts scrape");
  assert.ok(top.size >= 56, `discovered only ${top.size} top-level exports across ${files.join(", ")} — expected at least 56`);
  const mapped = leftColumnNames(parseMapRows());
  const unmapped = [...top].filter(name => !mapped.has(name)).sort();
  assert.deepEqual(unmapped, [], "exports missing from the README map's LEFT column (a description-column mention does not count)");
  const ghosts = [...mapped].filter(name => !top.has(name)).sort();
  assert.deepEqual(ghosts, [], "README map left column names things that are not exports");
});

test("AC7 evidence: Program and Cadence namespace member surfaces match the pinned grammar exactly", () => {
  const { members } = discoverSurface();
  assert.deepEqual([...members.keys()].sort(), ["Cadence", "Program"]);
  assert.deepEqual([...members.get("Program")!].sort(), ["All", "Await", "Choose", "Compensate", "Done", "Emit", "Guard", "Invoke", "Race", "Repeat", "Sequence", "T"]);
  assert.deepEqual([...members.get("Cadence")!].sort(), ["After", "Backoff", "Burst", "Calendar", "Every", "Gate", "Merge", "Once", "Race", "Repeat", "Sequence", "T", "Until", "While", "Window"]);
});

test("AC7 evidence: every README map row's right cell names an entry present in docs/product/02-domain-model.md", () => {
  const domainModelPath = fileURLToPath(new URL("../../../../docs/product/02-domain-model.md", import.meta.url));
  assert.ok(existsSync(domainModelPath), `02-domain-model.md not found at ${domainModelPath} — the compiled test expects the repo root four directories above dist/test/`);
  const domainText = readFileSync(domainModelPath, "utf8");
  const entryTerms = [...domainText.matchAll(/\*\*([^*\n]+?)\*\*/g)]
    .map(match => match[1]!.replace(/`/g, "").replace(/:\s*$/, "").trim())
    .filter(term => term.length >= 4);
  const missingStableTerms = [
    "AuthorityEnvelope", "Cadence", "Command", "CommandReceipt", "Comparison", "Continuation",
    "Decision", "DecisionTrace", "Event", "EventEnvelope", "Intent", "Reactor", "Schedule", "WorkOrder",
  ].filter(term => !entryTerms.includes(term));
  assert.deepEqual(missingStableTerms, [], "expected stable domain-model entry terms were not extracted from 02-domain-model.md");
  const rows = parseMapRows();
  assert.ok(rows.length >= 15, `expected at least 15 map rows, found ${rows.length}`);
  for (const row of rows) {
    const words = row.right.match(/[A-Za-z]{4,}/g) ?? [];
    assert.ok(
      words.some(word => containsWord(domainText, word)),
      `map row [${row.left}]: right cell shares no case-sensitive 4+ character term with 02-domain-model.md: "${row.right}"`,
    );
    assert.ok(
      entryTerms.some(term => containsWord(row.right, term)),
      `map row [${row.left}]: right cell names no domain-model entry (no bold/table-row term matches): "${row.right}"`,
    );
  }
});

test("AC7 evidence: package export targets, @dotln/kernel import, stableHash vector, and commandId namespace equivalence", async () => {
  const manifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as { exports: { "."?: { import?: string; types?: string } } };
  assert.match(manifest.exports["."]?.import ?? "", /^\.\//);
  assert.match(manifest.exports["."]?.types ?? "", /^\.\//);
  const kernel = await import("@dotln/kernel");
  assert.equal(typeof kernel.replay, "function");
  assert.equal(stableHash("é"), "0ac21707b7181e01");
  assert.equal(commandId("ws", "", 3, 0), "cmd_030cb49f8b1f142c");
  assert.equal(commandId("ws", undefined, 3, 0), "cmd_030cb49f8b1f142c");
});
