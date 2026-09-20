import type { ActorAdapter, ActorResult, ActorSpec } from "./actor-contract.js";
import { assertActorSpec } from "./actor-contract.js";
import { actorFailure } from "./cli-actor.js";
import {
  LOCAL_MODEL_ROW,
  LOCAL_MODEL_TRANSPORT,
  LocalModelWorkOrderTransport,
  localModelOrigin,
  type LocalModelTransportOptions,
} from "./local-model-transport.js";
import {
  localModelActorRequest,
  type LocalModelActorSpec,
  type LocalModelLaunchClaims,
} from "./local-model-contract.js";
import { WorkerFailure } from "./worker-protocol.js";

export interface LocalModelActorContext {
  residentStore: string;
  episodeId: string;
}
export type LocalModelRow = {
  row: string;
  label: string;
  reason: string;
};

function claims(
  spec: LocalModelActorSpec,
  context: LocalModelActorContext,
  harnessVersion: string,
): LocalModelLaunchClaims {
  return {
    transport: LOCAL_MODEL_TRANSPORT,
    row: LOCAL_MODEL_ROW.row,
    endpoint: localModelOrigin(spec.endpoint),
    profileId: spec.request.profile.profileId,
    model: spec.request.model,
    effort: spec.request.effort,
    harnessVersion,
    origin: "actor",
    episodeId: context.episodeId,
  };
}

/** One bounded HTTP episode. Unlike `cli-worker` there is no detached child, so
 * no disposable supervisor is forked: aborting the request ends the episode with
 * the resident that started it. */
export function startLocalModelEpisode(
  spec: LocalModelActorSpec,
  context: LocalModelActorContext,
  options: LocalModelTransportOptions = {},
) {
  const transport = new LocalModelWorkOrderTransport(spec.endpoint, options);
  const launch = claims(spec, context, transport.harnessVersion);
  const failed = (error: unknown): ActorResult => ({
    ...actorFailure("worker-failed"),
    local: {
      launch,
      failure: error instanceof WorkerFailure ? error.code : "transport-failed",
    },
  });
  try {
    const dispatched = transport.dispatch(
      localModelActorRequest(spec, context.episodeId),
      Date.now,
    );
    return {
      kill: dispatched.kill,
      completed: dispatched.completed.then(
        (result): ActorResult => ({
          ...actorFailure("worker-result"),
          exitCode: 0,
          local: { launch, result },
        }),
        failed,
      ),
    };
  } catch (error) {
    return { kill: () => {}, completed: Promise.resolve(failed(error)) };
  }
}

/** Availability is the declared row, never a live probe: the resident must be
 * able to record a reasoned NoOp without contacting the operator's endpoint. */
export function localModelAdapter(
  options: { row?: LocalModelRow } & LocalModelTransportOptions = {},
): ActorAdapter {
  const { row = LOCAL_MODEL_ROW, ...transport } = options;
  return {
    kind: "local-model",
    available(spec?: ActorSpec) {
      // The endpoint's own row answers first: an operator reading the NoOp
      // needs the endpoint's state, not a missing declaration, when both hold.
      if (row.label !== "ready")
        return `${row.row}: ${row.label}; ${row.reason}`;
      return spec?.local
        ? null
        : "local-model needs a declared endpoint request";
    },
    run(spec, context) {
      assertActorSpec(spec);
      if (!context || !spec.local)
        throw new Error("local-model actor requires resident context");
      const unavailable = this.available(spec);
      if (unavailable) throw new Error(unavailable);
      return startLocalModelEpisode(spec.local, context, transport);
    },
  };
}
