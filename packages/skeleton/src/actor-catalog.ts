import { fork, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cliWorkerAdapter } from "./cli-actor.js";
import { humanHandoffAdapter } from "./handoff-actor.js";
import {
  assertActorSpec,
  SCRIPT_SANDBOX,
  type ActorSpec,
  type ActorRun,
  type ActorResult,
  type ActorKind,
  type ActorAdapter,
} from "./actor-contract.js";
export * from "./actor-contract.js";

export function scriptAvailability(): string | null {
  if (process.platform !== "darwin")
    return "script offline boundary unavailable: this adapter requires macOS sandbox-exec";
  const probe = spawnSync(
    "/usr/bin/sandbox-exec",
    ["-p", SCRIPT_SANDBOX, "/usr/bin/true"],
    { env: {}, encoding: "utf8", timeout: 2000 },
  );
  return probe.status === 0
    ? null
    : "script offline boundary unavailable: sandbox-exec refused its local probe";
}
function runScript(
  spec: ActorSpec,
  context?: { residentStore: string; episodeId: string },
): ActorRun {
  assertActorSpec(spec);
  const child = fork(
    fileURLToPath(new URL("./script-episode.js", import.meta.url)),
    [],
    {
      env: {},
      execArgv: [],
      cwd: spec.cwd,
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    },
  );
  let observed: ActorResult | undefined;
  const completed = new Promise<ActorResult>((resolve) => {
    child.on("message", (result) => {
      observed = result as ActorResult;
    });
    child.on("error", () => {});
    child.on("close", () =>
      resolve(
        observed ?? {
          exitCode: null,
          signal: null,
          stdoutSha256:
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          firstLine: "",
          verified: false,
          reason: "script supervisor exited without an observation",
        },
      ),
    );
  });
  child.send({ spec, profile: SCRIPT_SANDBOX, context });
  return {
    completed,
    kill: () => {
      if (child.connected) child.send({ kill: true });
    },
  };
}
const unavailable = (kind: ActorKind, reason: string): ActorAdapter => ({
  kind,
  available: () => reason,
  run: () => {
    throw new Error(reason);
  },
});
export const actorCatalog: Readonly<Record<ActorKind, ActorAdapter>> = {
  script: { kind: "script", available: scriptAvailability, run: runScript },
  "cli-worker": cliWorkerAdapter(),
  "human-handoff": humanHandoffAdapter,
  "local-model": unavailable(
    "local-model",
    "local-model is unavailable until WO-110",
  ),
};
