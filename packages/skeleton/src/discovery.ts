import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
  existsSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import {
  Program,
  stepProgram,
  type ExecutableProgramV1,
  type Event,
} from "@dotln/kernel";
import { discoverySandbox } from "./discovery-sandbox.js";
import {
  decodeDiscoveryReport,
  discoveryPath,
  type DiscoveryReport,
  type WorkCandidate,
} from "./work-candidate.js";
export type { WorkCandidate, DiscoveryReport } from "./work-candidate.js";
export interface DiscoveryConventions {
  checks?: { kind: "lint" | "test"; argv: string[]; paths: string[] }[];
  placements?: { path: string; home: string }[];
  generated?: { path: string; referenceTokens: string[] }[];
  repairHistory?: string;
}
export interface DiscoveryOptions {
  profilePath?: string;
}
const MAX_FILES = 1024,
  MAX_BYTES = 4 * 1024 * 1024;
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
function fail(message: string): never {
  throw new Error(`discovery: ${message}`);
}
const array = (value: unknown): unknown[] => {
  if (!Array.isArray(value) || value.length > 64)
    fail("invalid convention list");
  return value as unknown[];
};
const record = (value: unknown, keys: string[]): Record<string, unknown> => {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((key) => !keys.includes(key))
  )
    fail("invalid convention fields");
  return value as Record<string, unknown>;
};
export function decodeDiscoveryConventions(
  value: unknown,
): DiscoveryConventions {
  const v = record(value, [
    "checks",
    "placements",
    "generated",
    "repairHistory",
  ]);
  if (v.checks !== undefined) {
    const kinds = new Set();
    for (const raw of array(v.checks)) {
      const c = record(raw, ["kind", "argv", "paths"]);
      if (!["lint", "test"].includes(String(c.kind)) || kinds.has(c.kind))
        fail("duplicate or invalid check kind");
      kinds.add(c.kind);
      const argv = array(c.argv);
      if (
        !argv.length ||
        !argv.every(
          (arg) =>
            typeof arg === "string" &&
            arg.length <= 8192 &&
            !arg.includes("\0"),
        ) ||
        !(argv[0] as string).startsWith("/")
      )
        fail("check requires exact absolute argv");
      const paths = array(c.paths);
      if (!paths.length || new Set(paths).size !== paths.length)
        fail("check requires distinct declared paths");
      paths.forEach(discoveryPath);
    }
  }
  for (const name of ["placements", "generated"] as const) {
    if (v[name] === undefined) continue;
    const seen = new Set();
    for (const raw of array(v[name])) {
      const row = record(
        raw,
        name === "placements" ? ["path", "home"] : ["path", "referenceTokens"],
      );
      discoveryPath(row.path);
      if (seen.has(row.path)) fail("duplicate convention path");
      seen.add(row.path);
      if (name === "placements") {
        discoveryPath(row.home);
        if (row.path === row.home) fail("placement is already home");
      } else {
        const tokens = array(row.referenceTokens);
        if (
          !tokens.length ||
          !tokens.every(
            (token) =>
              typeof token === "string" &&
              token.length > 0 &&
              token.length <= 240 &&
              !/[\x00-\x1f]/u.test(token),
          )
        )
          fail("generated declaration needs reference tokens");
      }
    }
  }
  if (v.repairHistory !== undefined) discoveryPath(v.repairHistory);
  return structuredClone(v) as DiscoveryConventions;
}
/** No operator await, parallel All, model choice or repair effect. */
export const discoveryProgram: ExecutableProgramV1 = Program.Sequence([
  Program.Guard(
    { registryId: "discovery.bounded", version: 1 },
    Program.Sequence(
      ["checks", "placements", "generated", "repairs"].map((stage) =>
        Program.Invoke(
          `discovery.${stage}`,
          { kind: "Act", effect: "repo.inspect", payload: { stage } },
          { completed: Program.Done() },
        ),
      ),
    ),
    Program.Done(),
  ),
]);
function confined(root: string, path: string, missing = false): string {
  discoveryPath(path);
  let current = root;
  const parts = path.split("/");
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    if (!existsSync(current)) {
      if (missing) continue;
      fail("declared path is missing");
    }
    const stat = lstatSync(current);
    if (stat.isSymbolicLink()) fail("symlink in declared path");
    if (index < parts.length - 1 && !stat.isDirectory())
      fail("path ancestor is not a directory");
  }
  return current;
}
function inventory(root: string): Map<string, Buffer> {
  const files = new Map<string, Buffer>();
  let bytes = 0,
    entries = 0;
  const walk = (relative: string) => {
    for (const item of readdirSync(join(root, relative), {
      withFileTypes: true,
    }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
      if (++entries > 4096) fail("inventory entry limit");
      if ([".git", "node_modules"].includes(item.name)) continue;
      const path = relative ? `${relative}/${item.name}` : item.name;
      discoveryPath(path);
      if (item.isSymbolicLink()) fail("inventory contains a symlink");
      if (item.isDirectory()) {
        if (path.split("/").length > 16) fail("inventory depth limit");
        walk(path);
      } else if (item.isFile()) {
        if (files.size >= MAX_FILES) fail("inventory file limit");
        const location = confined(root, path);
        const size = lstatSync(location).size;
        bytes += size;
        if (bytes > MAX_BYTES) fail("inventory byte limit");
        const contents = readFileSync(location);
        if (contents.length !== size) fail("inventory changed while reading");
        files.set(path, contents);
      } else fail("inventory contains a special file");
    }
  };
  walk("");
  return files;
}
export function discover(
  worktree: string,
  conventions?: DiscoveryConventions,
  options: DiscoveryOptions = {},
): DiscoveryReport {
  return observe(worktree, conventions, options, false);
}
/** Host-internal entry; only the supervisor supplies the inherited native boundary. */
export function discoverWithinActor(
  worktree: string,
  options: DiscoveryOptions,
): DiscoveryReport {
  return observe(worktree, undefined, options, true);
}
function observe(
  worktree: string,
  conventions: DiscoveryConventions | undefined,
  options: DiscoveryOptions,
  inheritedBoundary: boolean,
): DiscoveryReport {
  const root = realpathSync(worktree);
  if (
    root !== resolve(worktree) ||
    !lstatSync(root).isDirectory() ||
    root === sep
  )
    fail("target must be a canonical directory");
  let files = inventory(root);
  let source = "direct-conventions";
  let profilePath: string | undefined;
  let config: DiscoveryConventions;
  if (conventions !== undefined && options.profilePath !== undefined)
    fail("choose direct conventions or profile");
  if (conventions !== undefined)
    config = decodeDiscoveryConventions(conventions);
  else {
    const profile = options.profilePath ?? ".dotln/discovery.json";
    const bytes = files.get(profile);
    if (bytes) {
      discoveryPath(profile);
      const text = bytes.toString("utf8");
      const blocks = [
        ...text.matchAll(/```dotln-discovery\s*\n([\s\S]*?)\n```/gu),
      ];
      if (profile.endsWith(".md") && blocks.length !== 1)
        fail("profile needs one dotln-discovery block");
      config = decodeDiscoveryConventions(
        JSON.parse(profile.endsWith(".md") ? blocks[0]![1]! : text),
      );
      source = profile;
      profilePath = profile;
    } else {
      if (options.profilePath) fail("declared profile missing");
      const pkg = files.has("package.json")
        ? JSON.parse(files.get("package.json")!.toString("utf8"))
        : {};
      config = { checks: [], repairHistory: ".dotln/repairs.jsonl" };
      for (const kind of ["lint", "test"] as const) {
        const script: unknown = pkg.scripts?.[kind];
        if (script !== undefined) {
          if (typeof script !== "string" || !script || script.length > 8192)
            fail("invalid package check");
          if (
            pkg.packageManager !== undefined &&
            (typeof pkg.packageManager !== "string" ||
              !pkg.packageManager.startsWith("npm@"))
          )
            fail("non-npm package manager requires explicit check conventions");
          if (!existsSync(join(dirname(process.execPath), "npm")))
            fail("npm default runner unavailable; declare exact checks");
          config.checks!.push({
            kind,
            argv: [
              process.execPath,
              realpathSync(join(dirname(process.execPath), "npm")),
              "run",
              "--silent",
              kind,
            ],
            paths: ["package.json"],
          });
        }
      }
      config = decodeDiscoveryConventions(config);
      source = "package.json defaults";
    }
  }
  const report: DiscoveryReport = {
    schemaVersion: 1,
    candidates: [],
    evidence: [],
  };
  const add = (
    kind: WorkCandidate["kind"],
    paths: string[],
    facts: DiscoveryReport["evidence"][number]["facts"],
    proposedHome?: string,
  ) => {
    const id = `${kind}:${paths.join(",")}`;
    report.evidence.push({ evidenceId: id, source, facts });
    report.candidates.push({
      candidateId: id,
      kind,
      paths,
      evidence: [id],
      ...(proposedHome ? { proposedHome } : {}),
      size: { files: paths.length },
    });
  };
  const stages: Record<string, () => void> = {
    checks: () => {
      for (const check of config.checks ?? []) {
        if (process.platform !== "darwin")
          fail("check confinement unavailable: requires macOS sandbox-exec");
        check.paths.forEach((path) => {
          confined(root, path);
          if (!files.has(path)) fail("check scope is not a file");
        });
        const command = inheritedBoundary
          ? check.argv
          : [
              "/usr/bin/sandbox-exec",
              "-p",
              discoverySandbox(root),
              ...check.argv,
            ];
        const execution = spawnSync(command[0]!, command.slice(1), {
          cwd: root,
          env: {
            PATH: `${join(root, "node_modules/.bin")}:${dirname(process.execPath)}:/usr/bin:/bin`,
            HOME: root,
            TMPDIR: root,
            // npm enables Node's binary compile cache under TMPDIR by default.
            // Keep runtime cache bytes out of the bounded reference corpus.
            NODE_DISABLE_COMPILE_CACHE: "1",
          },
          encoding: "buffer",
          timeout: 5000,
          killSignal: "SIGKILL",
          maxBuffer: 65536,
        });
        if (execution.error || execution.signal || execution.status === null)
          fail("check did not complete within its bound");
        // sandbox-exec's own launch errors must not become a failing target check.
        if (
          !inheritedBoundary &&
          execution.stderr.toString().startsWith("sandbox-exec:")
        )
          fail("check sandbox or launch refused");
        if (execution.status !== 0)
          add(`failing-${check.kind}`, [...check.paths].sort(), {
            exitCode: execution.status,
            stdoutSha256: hash(execution.stdout),
            stderrSha256: hash(execution.stderr),
            commandSha256: hash(JSON.stringify(check.argv)),
          });
      }
      // Checks may write caches. Inspect the actual resulting bounded tree.
      files = inventory(root);
    },
    placements: () => {
      for (const row of config.placements ?? []) {
        const location = confined(root, row.path, true);
        if (!files.has(row.path) && !existsSync(location)) continue;
        confined(root, row.home, true);
        if (!files.has(row.path)) fail("placement source is not a file");
        if (existsSync(join(root, row.home)))
          fail("proposed home already exists");
        add(
          "misplaced-file",
          [row.path],
          {
            observedPath: row.path,
            declaredHome: row.home,
            contentSha256: hash(files.get(row.path)!),
          },
          row.home,
        );
      }
    },
    generated: () => {
      for (const row of config.generated ?? []) {
        const location = confined(root, row.path, true);
        if (!files.has(row.path) && !existsSync(location)) continue;
        if (!files.has(row.path)) fail("generated source is not a file");
        const corpus = [...files].filter(
          ([path]) =>
            path !== row.path &&
            path !== profilePath &&
            path !== config.repairHistory,
        );
        if (corpus.some(([, bytes]) => bytes.includes(0)))
          fail("reference corpus contains binary data");
        const references = corpus.filter(([, bytes]) =>
          row.referenceTokens.some((token) =>
            bytes.toString("utf8").includes(token),
          ),
        );
        if (!references.length)
          add("stale-generated", [row.path], {
            classification: "generated-stale",
            references: "none in bounded literal-token corpus",
            scannedFiles: corpus.length,
            corpusSha256: hash(
              JSON.stringify(
                corpus.map(([path, bytes]) => [path, hash(bytes)]),
              ),
            ),
            contentSha256: hash(files.get(row.path)!),
            referenceTokens: row.referenceTokens,
          });
      }
    },
    repairs: () => {
      if (!config.repairHistory) return;
      const bytes = files.get(config.repairHistory);
      if (!bytes) {
        if (source !== "package.json defaults")
          fail("declared repair history missing");
        return;
      }
      const lines = bytes.toString("utf8").trim().split("\n").filter(Boolean);
      if (lines.length > 256) fail("repair history limit");
      const groups = new Map<string, { ids: string[]; paths: string[] }>();
      const ids = new Set<string>();
      for (const line of lines) {
        const row = record(JSON.parse(line), ["eventId", "repairId", "paths"]);
        for (const key of ["eventId", "repairId"])
          if (
            typeof row[key] !== "string" ||
            !/^[a-zA-Z0-9._-]{1,80}$/u.test(row[key] as string)
          )
            fail("invalid repair identity");
        if (ids.has(row.eventId as string)) fail("duplicate repair event");
        ids.add(row.eventId as string);
        const paths = array(row.paths);
        if (!paths.length || new Set(paths).size !== paths.length)
          fail("invalid repair scope");
        paths.forEach((path) => {
          discoveryPath(path);
          confined(root, path);
          if (!files.has(path)) fail("repair scope is not a file");
        });
        const key = `${row.repairId}:${JSON.stringify([...paths].sort())}`;
        const group = groups.get(key) ?? {
          ids: [],
          paths: [...(paths as string[])].sort(),
        };
        group.ids.push(row.eventId as string);
        groups.set(key, group);
      }
      for (const [key, group] of groups)
        if (group.ids.length >= 2) {
          add("repeated-repair", group.paths, {
            repairKey: key,
            occurrences: group.ids.length,
            eventIds: group.ids,
            historyPath: config.repairHistory,
            historySha256: hash(bytes),
          });
          // Distinct recurring repairs can affect the same paths.
          const suffix = hash(key).slice(0, 16);
          report.candidates.at(-1)!.candidateId += `:${suffix}`;
          report.evidence.at(-1)!.evidenceId += `:${suffix}`;
          report.candidates.at(-1)!.evidence = [
            report.evidence.at(-1)!.evidenceId,
          ];
        }
    },
  };
  let program = discoveryProgram;
  const env = {
    now: 0,
    rngState: 0,
    predicates: { "discovery.bounded": { 1: () => true } },
  };
  for (let steps = 0; program.kind !== "Done"; steps++) {
    if (steps > 32) fail("program step limit");
    const result = stepProgram(program, {}, env);
    program = result.residual;
    for (const intent of result.intents) {
      const stage = (intent.payload as { stage: string }).stage;
      if (!stages[stage]) fail("unknown program stage");
      stages[stage]!();
      const event: Event = {
        schemaVersion: 1,
        eventId: `result:${stage}`,
        type: "CommandResult",
        occurredAt: 0,
        actorId: "discovery",
        workstreamId: "discovery",
        payload: { commandId: `discovery.${stage}`, result: "completed" },
      };
      program = stepProgram(program, {}, env, event).residual;
    }
  }
  return decodeDiscoveryReport(report);
}
