import type { ObserveIntent } from "@dotln/kernel";
import type { BeaconSweepRequest } from "./control-beacon.js";
import type { BeaconProvenance } from "./beacon-provenance.mjs";
import { observeBeaconSweep } from "./beacon-observe.js";
import type { PerceptionRead } from "./beacon-perception.js";
import type {
  Candidate,
  FixtureTree,
  LiveReactorDriver,
  ScenarioVerifier,
} from "./scenario.js";

export interface BeaconVerifierInput {
  readonly episodeId: "ep_beacon_verifier";
  readonly candidatePaths: readonly string[];
  readonly inventory: readonly {
    readonly path: string;
    readonly classification: string;
    readonly referenceCount: number;
  }[];
  readonly perception: PerceptionRead;
}

/** Deterministic verifier episode, like WO-009's current verifier. The host
 * alone holds the source/log/mounts; the evaluating role gets this finite capsule
 * and no tools, narrative, physical paths, key, or implementer evidence prose.
 */
export class MountedBeaconVerifier implements ScenarioVerifier {
  constructor(
    private readonly options: {
      readonly request: BeaconSweepRequest;
      readonly fixture: FixtureTree;
      readonly key?: BeaconProvenance;
      readonly evaluate?: (input: BeaconVerifierInput) => boolean;
    },
  ) {}

  dispatch(
    intent: ObserveIntent,
    candidates: readonly Candidate[],
    driver: LiveReactorDriver,
    now: number,
  ): boolean {
    if (
      intent.subject !== "candidates" ||
      this.options.request.audience !== "verifier"
    )
      throw new Error("verifier episode subject/audience refused");
    const swept = observeBeaconSweep(
      driver.log,
      this.options.request,
      now,
      (log) => driver.restore(log),
      this.options.key ? { key: this.options.key } : {},
    );
    if (!swept.authorized) return false;
    const input: BeaconVerifierInput = {
      episodeId: "ep_beacon_verifier",
      candidatePaths: candidates.map(({ path }) => path),
      inventory: this.options.fixture.files.map(
        ({ path, classification, referencedBy }) => ({
          path,
          classification,
          referenceCount: referencedBy.length,
        }),
      ),
      perception: { observations: swept.observations, groups: swept.groups },
    };
    // A detached JSON capsule is the actual input boundary, not a prose request
    // to ignore other fields on the executor's object or the host's log.
    const capsule = JSON.parse(JSON.stringify(input)) as BeaconVerifierInput;
    return (this.options.evaluate ?? evaluateBeaconVerification)(capsule);
  }
}

export function evaluateBeaconVerification(
  input: BeaconVerifierInput,
): boolean {
  return (
    input.candidatePaths.length > 0 &&
    input.candidatePaths.every((path) =>
      input.inventory.some(
        (file) =>
          file.path === path &&
          file.classification === "generated-stale" &&
          file.referenceCount === 0,
      ),
    )
  );
}
