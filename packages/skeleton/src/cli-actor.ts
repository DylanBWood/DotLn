import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { ActorAdapter, ActorResult, ActorSpec } from "./actor-contract.js";
import { assertActorSpec } from "./actor-contract.js";
import {
  DETACHED_LAUNCH_ROWS,
  cliActorRequest,
  type CliActorSpec,
  type CliLaunchClaims,
} from "./cli-actor-contract.js";
import { WorkerFailure } from "./worker-protocol.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
} from "./worker-transport.js";

export interface CliActorContext {
  residentStore: string;
  episodeId: string;
}
const emptyDigest =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
export const actorFailure = (reason: string): ActorResult => ({
  exitCode: null,
  signal: null,
  stdoutSha256: emptyDigest,
  firstLine: "",
  verified: false,
  reason,
});
function claims(
  spec: CliActorSpec,
  context: CliActorContext,
  harnessVersion: string,
): CliLaunchClaims {
  return {
    transport: spec.transport,
    row: DETACHED_LAUNCH_ROWS[spec.transport].row,
    profileId: spec.request.profile.profileId,
    model: spec.request.model,
    effort: spec.request.effort,
    harnessVersion,
    origin: "actor",
    episodeId: context.episodeId,
  };
}
/** Used by the disposable supervisor in production and by process doubles. */
export function startCliEpisode(
  spec: CliActorSpec,
  context: CliActorContext,
  runner: ProcessRunner = runWorkerProcess,
  version?: string,
) {
  const stamped: ProcessRunner = (launch) =>
    runner({
      ...launch,
      resident: { store: context.residentStore, episodeId: context.episodeId },
    });
  const transport =
    spec.transport === "claude-cli-print"
      ? new ClaudeCliPrintWorkOrderTransport(stamped, version)
      : new CodexCliExecWorkOrderTransport(stamped, version);
  const launch = claims(spec, context, transport.harnessVersion);
  const failed = (error: unknown): ActorResult => ({
    ...actorFailure("worker-failed"),
    worker: {
      launch,
      failure: error instanceof WorkerFailure ? error.code : "transport-failed",
    },
  });
  try {
    const dispatched = transport.dispatch(
      cliActorRequest(spec, context.episodeId),
      Date.now,
    );
    return {
      kill: dispatched.kill,
      completed: Promise.all([dispatched.receipt, dispatched.completed]).then(
        ([, result]): ActorResult => ({
          ...actorFailure("worker-result"),
          exitCode: 0,
          worker: { launch, result },
        }),
        failed,
      ),
    };
  } catch (error) {
    return { kill: () => {}, completed: Promise.resolve(failed(error)) };
  }
}
export function cliWorkerAdapter(
  options: {
    rows?: Readonly<
      Record<string, { row: string; label: string; reason: string }>
    >;
    runner?: ProcessRunner;
    version?: string;
  } = {},
): ActorAdapter {
  const rows = options.rows ?? DETACHED_LAUNCH_ROWS;
  return {
    kind: "cli-worker",
    available(spec?: ActorSpec) {
      if (!spec?.worker) return "cli-worker needs a declared request";
      const row = rows[spec.worker.transport];
      return row?.label === "observed"
        ? null
        : `${row?.row ?? DETACHED_LAUNCH_ROWS[spec.worker.transport].row}: ${row?.label ?? "unavailable"}; ${row?.reason ?? "detached launch row missing"}`;
    },
    run(spec, context) {
      assertActorSpec(spec);
      if (!context || !spec.worker)
        throw new Error("CLI actor requires resident context");
      const unavailable = this.available(spec);
      if (unavailable) throw new Error(unavailable);
      if (options.runner)
        return startCliEpisode(
          spec.worker,
          context,
          options.runner,
          options.version,
        );
      const child = fork(
        fileURLToPath(new URL("./cli-episode.js", import.meta.url)),
        [],
        {
          execArgv: [],
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        },
      );
      let observed: ActorResult | undefined;
      const completed = new Promise<ActorResult>((resolve) => {
        child.on("message", (value) => {
          observed = value as ActorResult;
        });
        child.on("error", () => {});
        child.on("close", () =>
          resolve(
            observed ?? {
              ...actorFailure("worker-failed"),
              worker: {
                launch: claims(spec.worker!, context, "unknown"),
                failure: "supervisor-lost",
              },
            },
          ),
        );
      });
      child.send({ spec: spec.worker, context });
      return {
        completed,
        kill: () => {
          if (child.connected) child.send({ kill: true });
        },
      };
    },
  };
}
