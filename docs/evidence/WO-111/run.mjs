#!/usr/bin/env node
// The live WO-111 caller. It binds the existing resident, source-change and
// verification hosts; no fixture double makes or judges a source change.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { materializeOrder } from "../../../scripts/lib/derived-orders.mjs";
import { checkBinding } from "../../../scripts/resident-bind.mjs";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { portfolioExecution } from "../../../packages/skeleton/dist/src/portfolio-host.js";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import { replayResident } from "../../../packages/skeleton/dist/src/resident-store.js";
import { CodexCliExecWorkOrderTransport } from "../../../packages/skeleton/dist/src/worker-transport.js";
import { checkoutSnapshot, treeDigest } from "../WO-053/fixture.mjs";

const returnProof = process.argv.includes("--return-proof");
const locationPath = join(
  TOOL_ROOT,
  `docs/control/local/wo111/${returnProof ? "return-location" : "location"}.json`,
);
const location = JSON.parse(readFileSync(locationPath, "utf8"));
const artifactIdentity = JSON.parse(
  readFileSync(
    join(
      TOOL_ROOT,
      "packages/skeleton/fixtures/wo051-inspection-baseline.json",
    ),
    "utf8",
  ),
).request.artifactIdentity;
const logPath = join(location.store, "events.jsonl");
const readLog = () =>
  existsSync(logPath) ? readFileSync(logPath, "utf8") : "";
const events = () => decodeLog(readLog());
const git = (cwd, ...args) =>
  execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    timeout: 15000,
  }).trim();
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const worktrees = execFileSync("git", ["worktree", "list", "--porcelain"], {
  cwd: TOOL_ROOT,
  encoding: "utf8",
});
const main = worktrees
  .split("\n\n")
  .map((block) => ({
    path: /^worktree (.+)$/m.exec(block)?.[1],
    branch: /^branch (.+)$/m.exec(block)?.[1],
  }))
  .find((item) => item.branch === "refs/heads/main")?.path;
if (!main) throw new Error("no main worktree is registered");
function protectedSnapshot() {
  return {
    main: checkoutSnapshot(main),
    selected: checkoutSnapshot(TOOL_ROOT),
    target: checkoutSnapshot(location.target),
    sentinel: treeDigest(join(location.root, "trees", "sentinel")),
    template: hash(readFileSync(join(location.root, "resident-template.json"))),
    remotes: {
      target: git(location.target, "remote").split("\n").filter(Boolean).length,
      launchpad: git(location.launchpad, "remote").split("\n").filter(Boolean)
        .length,
    },
  };
}

function summary() {
  const log = events();
  const state = replayResident(readLog()).state.resident;
  const observations = log.filter(
    (event) => event.type === "PortfolioOrderObserved",
  );
  return {
    present: state?.present ?? true,
    phase: state?.machine?.state ?? null,
    discovery:
      state?.discovery?.report?.candidates?.map(
        (candidate) => candidate.kind,
      ) ?? [],
    portfolio: observations.map((event) => ({
      phase:
        log.find(
          (item) =>
            item.type === "PortfolioOrderActivated" &&
            item.payload.episodeId === event.payload.episodeId,
        )?.payload.activation.phaseId ?? null,
      changed: event.payload.portfolio?.change?.status ?? "none",
      verdict: event.payload.portfolio?.verification?.verdict ?? "not-run",
      verified: event.payload.verified,
      reason: event.payload.reason,
    })),
    dispatches: log.filter((event) => event.type === "ScriptEpisodeDispatched")
      .length,
    refusals: log.filter((event) => event.type === "ScriptEpisodeRefused")
      .length,
    events: log.length,
  };
}

async function run() {
  checkBinding(location.launchpad, location.store);
  if (git(location.target, "rev-parse", "HEAD") !== location.baseCommit)
    throw new Error("the synthetic target main checkout moved before launch");
  const config = JSON.parse(
    readFileSync(join(location.store, "resident.json"), "utf8"),
  );
  const transport = new CodexCliExecWorkOrderTransport();
  const host = new ResidentHost({
    directory: location.store,
    policyId: config.policyId,
    configuration: config,
    capabilities: () => ["adapter.fixture"],
    portfolio: portfolioExecution({
      materialize: (compiled, provenance, { surfaces }) =>
        materializeOrder(compiled, provenance, {
          root: location.launchpad,
          surfaces: [...surfaces],
        }),
      target: location.target,
      directory: join(location.root, "portfolio"),
      source: {
        authorityEvidence: ["verified-input"],
        artifactIdentity,
        worktreeParent: join(location.root, "trees"),
        launchpadCheckout: TOOL_ROOT,
        model: "gpt-6-sol",
        effort: "xhigh",
        transport,
      },
      verifier: {
        transport: new CodexCliExecWorkOrderTransport(),
        model: "gpt-6-sol",
        effort: "xhigh",
      },
    }),
  });
  const controller = new AbortController();
  const startedAt = Date.now();
  const before = protectedSnapshot();
  let lastProgress = startedAt;
  let seenAway = false;
  const pulse = setInterval(() => {
    const s = summary();
    if (!s.present) seenAway = true;
    if (Date.now() - lastProgress >= 60_000) {
      console.log(
        JSON.stringify({
          elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
          ...s,
        }),
      );
      lastProgress = Date.now();
    }
    if (seenAway && s.present) controller.abort();
  }, 1000);
  try {
    await host.run({ tickMs: 1000, signal: controller.signal });
  } finally {
    clearInterval(pulse);
    const endedAt = Date.now();
    const after = protectedSnapshot();
    writeFileSync(
      join(location.root, "run.json"),
      `${JSON.stringify({ startedAt, endedAt, elapsedMs: endedAt - startedAt, before, after, summary: summary() }, null, 2)}\n`,
      { flag: "wx", mode: 0o600 },
    );
    console.log(
      JSON.stringify({
        elapsedSeconds: Math.floor((endedAt - startedAt) / 1000),
        ...summary(),
      }),
    );
  }
}

const action = process.argv[2];
if (action === "status") console.log(JSON.stringify(summary()));
else if (action === "run") await run();
else
  throw new Error(
    "usage: node docs/evidence/WO-111/run.mjs status|run [--return-proof]",
  );
