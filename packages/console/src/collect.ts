import { observedExecFileSync as execFileSync } from "@dotln/skeleton/dist/src/gate-deadlines.mjs";
import { deadlineLimit } from "@dotln/skeleton/dist/src/gate-deadlines.mjs";
import { lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { seiriEnvironment, type FeedbackUnit } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import { projectWorkerStatus } from "@dotln/skeleton/dist/src/worker-status.js";
import { projectAuditLog } from "@dotln/skeleton/dist/src/audit.js";
import { currentEvidence } from "@dotln/skeleton/dist/src/evidence-editions.mjs";
import {
  editionBodies,
  resolveEditionLog,
} from "@dotln/skeleton/dist/src/feedback-selfhost.js";
import { feedbackEditionLog } from "@dotln/skeleton/dist/src/feedback-edition-log.js";
import type {
  BoardSources,
  DocumentSource,
  LoadoutSource,
  Source,
  StoreSource,
} from "./types.js";
import { exportedLoadouts } from "./builds.js";
import {
  array,
  at,
  available,
  object,
  readFailureReason,
  string,
  unavailable,
} from "./values.js";

function attempt<T>(ref: string, read: () => T): Source<T> {
  try {
    return available(ref, read());
  } catch (error) {
    return unavailable(ref, readFailureReason(error));
  }
}
const contained = (path: string, root: string): boolean =>
  realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);

function readFile(path: string, root?: string): string {
  if (!lstatSync(path).isFile() || (root && !contained(path, root)))
    throw Object.assign(new Error("expected contained regular file"), {
      code: "ENOTFILE",
    });
  return readFileSync(path, "utf8");
}

/** File-host adapter for the launchpad's control roots. The lifecycle CLI
 * still owns configuration validation and folding; no script module is
 * imported into the console package. */
function controlRoots(root: string): { legacy: string; orders: string } {
  const config = join(root, "dotln.config.json");
  const declared = lstatSync(config, { throwIfNoEntry: false })
    ? object(JSON.parse(readFile(config, root)))
    : { version: 1 };
  if (declared["version"] !== 1) throw new Error("invalid configuration");
  const roots =
    declared["roots"] === undefined ? {} : object(declared["roots"]);
  const docs = roots["docs"] ?? "docs";
  const control = roots["control"] ?? `${String(docs)}/control`;
  const orders = roots["orders"] ?? `${String(control)}/orders`;
  for (const value of [docs, control, orders])
    if (
      typeof value !== "string" ||
      value.includes("\\") ||
      value.includes("\0") ||
      value.split("/").some((part) => !part || part === "." || part === "..")
    )
      throw new Error("invalid control root");
  return { legacy: `${String(control)}/resume.jsonl`, orders: String(orders) };
}
/** A recorded stream by value. A schema 2 feedback edition commits its
 * verifier stream by reference (WO-154), which projections cannot read; it
 * is rebuilt from Git first, `candidates` supplying the judged report. A
 * stream without references is returned unchanged. */
export function editionStream(
  root: string,
  text: string,
  candidates: readonly string[] = [],
): string {
  return resolveEditionLog(text, editionBodies(root, candidates).resolve);
}
const lines = (text: string): readonly unknown[] =>
  text.trim()
    ? text
        .trimEnd()
        .split("\n")
        .map((line) => JSON.parse(line) as unknown)
    : [];

export function storeFromLog(
  id: string,
  label: string,
  source: Source<string>,
): StoreSource {
  if (source.status === "unavailable")
    return {
      id,
      label,
      status: unavailable(`${source.ref}#worker-status`, source.reason),
      audit: unavailable(`${source.ref}#audit-projections`, source.reason),
    };
  return {
    id,
    label,
    status: attempt(`${source.ref}#worker-status`, () =>
      projectWorkerStatus(decodeLog(source.value)),
    ),
    audit: attempt(`${source.ref}#audit-projections`, () =>
      projectAuditLog(source.value),
    ),
  };
}

/** Host adapter only. Fixed read-only commands; no command text comes from data. */
export async function collectSources(
  root: string,
  requestedStores: readonly string[] = [],
): Promise<BoardSources> {
  const command = (
    script: string,
    args: readonly string[],
    maxBuffer = 8_000_000,
  ): string =>
    execFileSync(process.execPath, [join(root, "scripts", script), ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer,
      // Verification measured release:list at 17.2 s alone (WO-125). The
      // declares the load factor; ordinary collection keeps its 60 s bound.
      timeout: deadlineLimit(17_200, 60_000),
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    });
  const text = (ref: string) => attempt(ref, () => readFile(join(root, ref)));
  const controlLog = attempt(
    "control:canonical-segments",
    (): readonly DocumentSource[] => {
      const paths = controlRoots(root);
      const directory = lstatSync(join(root, paths.orders), {
        throwIfNoEntry: false,
      });
      if (
        directory &&
        (!directory.isDirectory() || !contained(join(root, paths.orders), root))
      )
        throw Object.assign(new Error("expected contained control directory"), {
          code: "ENOTFILE",
        });
      const refs = [
        ...(lstatSync(join(root, paths.legacy), { throwIfNoEntry: false })
          ? [paths.legacy]
          : []),
        ...(directory ? readdirSync(join(root, paths.orders)) : [])
          .filter((name) => /^WO-\d{3}\.jsonl$/u.test(name))
          .sort()
          .map((name) => `${paths.orders}/${name}`),
      ];
      return refs.map((ref) => ({
        ref,
        value: lines(readFile(join(root, ref), root)),
      }));
    },
  );
  const orderIds = (): readonly string[] => {
    if (controlLog.status !== "available")
      throw new Error("control unavailable");
    return [
      ...new Set(
        controlLog.value.flatMap((document) =>
          array(document.value).map((event) =>
            string(object(event)["workOrderId"]),
          ),
        ),
      ),
    ].sort();
  };
  const folded = attempt("resume:status--json", () => {
    const ids = orderIds();
    // One process folds every order (WO-164). Each object carries the whole
    // order list, so the output grows with the square of the order count.
    const statuses = array(
      JSON.parse(
        command("resume.mjs", ["status", "--all", "--json"], 256_000_000),
      ) as unknown,
    );
    const returned = statuses.map((status) =>
      string(object(status)["workOrder"]),
    );
    if (returned.join("\n") !== ids.join("\n"))
      throw new Error(
        `status --all returned orders that differ from the control log (${returned.length} returned, ${ids.length} logged)`,
      );
    return statuses;
  });
  // A failed fold falls back to one process per order, the form before
  // WO-164, and the source's ref records that it did. When that fails too,
  // the fold's own failure is reported.
  const fallback =
    folded.status === "unavailable" && controlLog.status === "available"
      ? attempt("resume:status--json#per-order-fallback", () =>
          orderIds().map(
            (workOrder) =>
              JSON.parse(
                command("resume.mjs", [
                  "status",
                  "--json",
                  "--work-order",
                  workOrder,
                ]),
              ) as unknown,
          ),
        )
      : undefined;
  const controlStatus = fallback?.status === "available" ? fallback : folded;
  const graphs: LoadoutSource[] = [];
  const loadoutFailures: Source<never>[] = [];
  let loadouts: Source<readonly LoadoutSource[]>;
  let feedbackUnits: Source<readonly FeedbackUnit[]> = unavailable(
    "packages/skeleton/src/loadouts/feedback.ts",
    "not found",
  );
  try {
    const environment = seiriEnvironment();
    const modules = [
      "reactor.js",
      ...readdirSync(join(root, "packages/skeleton/dist/src/loadouts"))
        .filter((name) => name.endsWith(".js"))
        .sort()
        .map((name) => `loadouts/${name}`),
    ];
    for (const module of modules) {
      const exports = (await import(
        pathToFileURL(join(root, "packages/skeleton/dist/src", module)).href
      )) as Record<string, unknown>;
      const ref = `packages/skeleton/src/${module.replace(/\.js$/u, ".ts")}`;
      graphs.push(
        ...exportedLoadouts(exports, ref, environment, (failedRef, reason) =>
          loadoutFailures.push(unavailable(failedRef, reason)),
        ),
      );
      if (Array.isArray(exports["personalFeedbackUnits"]))
        feedbackUnits = available(
          ref,
          exports["personalFeedbackUnits"] as readonly FeedbackUnit[],
        );
    }
    loadouts = available("skeleton:loadout-exports", graphs);
  } catch (error) {
    loadouts = unavailable(
      "skeleton:loadout-exports",
      readFailureReason(error),
    );
  }
  const feedback = attempt("docs/evidence/current.json#feedback", () =>
    currentEvidence(root, "feedback"),
  );
  const selfhostStores = (["audit", "verifier"] as const).map(
    (role): StoreSource => {
      const id = `selfhost-${role}`;
      if (feedback.status === "unavailable")
        return storeFromLog(id, `Self-hosted ${role}`, feedback);
      const name =
        role === "audit"
          ? "selfhost-audit.jsonl"
          : "selfhost-verification.jsonl";
      const read = attempt(`${feedback.value.directory}/${name}`, () =>
        feedbackEditionLog(root, feedback.value.directory, role),
      );
      const log: Source<string> =
        read.status === "available"
          ? available(read.value.ref, read.value.value)
          : read;
      return storeFromLog(
        id,
        `${feedback.value.workOrder} self-hosted ${role === "audit" ? "executor" : "verifier"}`,
        log,
      );
    },
  );
  const defaultStores = [
    [
      "wo009-demo",
      "WO-009 demonstration (recorded fixture)",
      "packages/console/fixtures/wo009.events.jsonl",
    ],
  ] as const;
  const stores = [
    ...defaultStores.map(([id, label, ref]) =>
      storeFromLog(id, label, text(ref)),
    ),
    ...selfhostStores,
    ...requestedStores.map((directory, index) =>
      storeFromLog(
        `requested-${index + 1}`,
        `Requested worker store ${index + 1}`,
        attempt(`requested-store:${index + 1}/events.jsonl`, () =>
          readFile(join(resolve(directory), "events.jsonl")),
        ),
      ),
    ),
  ];
  return {
    stores,
    loadouts,
    loadoutFailures,
    feedbackUnits,
    controlLog,
    controlStatus,
    controlUsage: attempt(
      "resume:usage--json",
      () => JSON.parse(command("resume.mjs", ["usage", "--json"])) as unknown,
    ),
    constellation: attempt("worktree:constellation", () =>
      command("worktree.mjs", ["constellation"]),
    ),
    releases: attempt("release:list", () => command("release.mjs", ["list"])),
    maturity:
      feedback.status === "unavailable"
        ? feedback
        : attempt(
            `${feedback.value.directory}/feedback.json`,
            () =>
              JSON.parse(
                readFile(join(root, feedback.value.directory, "feedback.json")),
              ) as unknown,
          ),
    workOrderIndex: text("docs/work-orders/README.md"),
    workOrderHistory: text("docs/work-orders/HISTORY.md"),
    capabilities: text("docs/planning/capability-table.md"),
    publication: text("docs/publication/audience-status-index.md"),
    roadmap: text("docs/product/06-roadmap.md"),
    refutations: attempt("docs/planning/refutations/", () =>
      readdirSync(join(root, "docs/planning/refutations"))
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => ({
          ref: `docs/planning/refutations/${name}`,
          value: JSON.parse(
            readFile(join(root, "docs/planning/refutations", name)),
          ) as unknown,
        })),
    ),
  };
}
