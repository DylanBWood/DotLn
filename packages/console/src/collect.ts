import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { seiriEnvironment, type FeedbackUnit } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import { projectWorkerStatus } from "@dotln/skeleton/dist/src/worker-status.js";
import { projectAuditLog } from "@dotln/skeleton/dist/src/audit.js";
import type {
  BoardSources,
  DocumentSource,
  LoadoutSource,
  Source,
  StoreSource,
} from "./types.js";
import { exportedLoadouts } from "./builds.js";
import { array, at, available, object, string, unavailable } from "./values.js";

/** The self-hosted feedback edition the board reads by default. The root
 * evidence command selects the same edition. A compiler package bump makes an
 * earlier edition historical: the skeleton refuses persisted compilation drift
 * when it replays that edition's verifier stream, so the two selections move
 * together, and the `selfhost` fixture case is re-pinned with them. */
export const SELF_HOST_EDITION = "WO-039";
export const selfHostEvidence = (name: string): string =>
  `docs/evidence/${SELF_HOST_EDITION}/feedback/${name}`;

function attempt<T>(ref: string, read: () => T): Source<T> {
  try {
    return available(ref, read());
  } catch {
    return unavailable(
      ref,
      "Source could not be read or its declared format was refused",
    );
  }
}
function readFile(path: string): string {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink())
    throw new Error("expected regular file");
  return readFileSync(path, "utf8");
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
  const command = (script: string, args: readonly string[]): string =>
    execFileSync(process.execPath, [join(root, "scripts", script), ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 8_000_000,
      timeout: 60_000,
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    });
  const text = (ref: string) => attempt(ref, () => readFile(join(root, ref)));
  const controlLog = attempt(
    "control:canonical-segments",
    (): readonly DocumentSource[] => {
      const refs = [
        "docs/control/resume.jsonl",
        ...readdirSync(join(root, "docs/control/orders"))
          .filter((name) => /^WO-\d{3}\.jsonl$/u.test(name))
          .sort()
          .map((name) => `docs/control/orders/${name}`),
      ];
      return refs.map((ref) => ({
        ref,
        value: lines(readFile(join(root, ref))),
      }));
    },
  );
  const controlStatus = attempt("resume:status--json", () => {
    if (controlLog.status !== "available")
      throw new Error("control unavailable");
    const ids = [
      ...new Set(
        controlLog.value.flatMap((document) =>
          array(document.value).map((event) =>
            string(object(event)["workOrderId"]),
          ),
        ),
      ),
    ].sort();
    return ids.map(
      (workOrder) =>
        JSON.parse(
          command("resume.mjs", [
            "status",
            "--json",
            "--work-order",
            workOrder,
          ]),
        ) as unknown,
    );
  });
  const graphs: LoadoutSource[] = [];
  let loadouts: Source<readonly LoadoutSource[]>;
  let feedbackUnits: Source<readonly FeedbackUnit[]> = unavailable(
    "packages/skeleton/src/loadouts/feedback.ts",
    "Feedback exports could not be loaded",
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
      graphs.push(...exportedLoadouts(exports, ref, environment));
      if (Array.isArray(exports["personalFeedbackUnits"]))
        feedbackUnits = available(
          ref,
          exports["personalFeedbackUnits"] as readonly FeedbackUnit[],
        );
    }
    loadouts = available("skeleton:loadout-exports", graphs);
  } catch {
    loadouts = unavailable(
      "skeleton:loadout-exports",
      "Saved loadout exports could not be inspected",
    );
  }
  const defaultStores = [
    [
      "wo009-demo",
      "WO-009 demonstration (recorded fixture)",
      "packages/console/fixtures/wo009.events.jsonl",
    ],
    [
      "selfhost-audit",
      `${SELF_HOST_EDITION} self-hosted executor`,
      selfHostEvidence("selfhost-audit.jsonl"),
    ],
    [
      "selfhost-verifier",
      `${SELF_HOST_EDITION} self-hosted verifier`,
      selfHostEvidence("selfhost-verification.jsonl"),
    ],
  ] as const;
  const stores = [
    ...defaultStores.map(([id, label, ref]) =>
      storeFromLog(id, label, text(ref)),
    ),
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
    maturity: attempt(
      selfHostEvidence("feedback.json"),
      () =>
        JSON.parse(
          readFile(join(root, selfHostEvidence("feedback.json"))),
        ) as unknown,
    ),
    workOrderIndex: text("docs/work-orders/README.md"),
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
