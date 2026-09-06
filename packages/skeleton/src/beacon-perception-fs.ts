import { lstatSync } from "node:fs";
import { join, resolve } from "node:path";
import type { BeaconPerceptionProfile } from "./execution-environment.js";
import type { SenseId } from "@dotln/compiler";
import { canonicalDestination } from "./beacon-io.mjs";
import { observeBeaconMetadata } from "./control-beacon-fs.mjs";
import { decodeGroupBeaconSize } from "./control-codebook.mjs";
import type { BeaconProvenance } from "./beacon-provenance.mjs";
import type { PerceptionRead } from "./beacon-perception.js";
import type { GroupObservation } from "./control-beacon.js";

/** No readdir, readFile, readlink or xattr API. The host mount record supplies
 * the complete finite address set even in a search-only directory.
 */
export function readMountedBeacons(
  profile: BeaconPerceptionProfile,
  senses: readonly SenseId[],
  key?: BeaconProvenance,
): PerceptionRead {
  const observations = [];
  const groups: GroupObservation[] = [];
  for (const mount of profile.mounts) {
    if (mount.family === "phase-group" && !senses.includes("composition"))
      continue;
    if (
      canonicalDestination(mount.path) !== resolve(mount.path) ||
      !lstatSync(mount.path).isDirectory()
    )
      throw new Error("beacon mount changed since provisioning");
    for (const address of mount.addresses) {
      const observed = observeBeaconMetadata(
        join(mount.path, address),
        `${mount.mountId}:${address}`,
      );
      if (mount.family === "phase-group") {
        groups.push({
          ...observed,
          decoded:
            observed.size === null
              ? { status: "absent" }
              : decodeGroupBeaconSize(BigInt(observed.size)),
        });
      } else {
        const state =
          observed.decoded.status === "decoded"
            ? observed.decoded.state
            : undefined;
        observations.push({
          ...observed,
          provenanceCheck: !state
            ? ("not-applicable" as const)
            : state.codebookVersion !== 3
              ? ("unauthenticated-legacy" as const)
              : (key?.check(state, address) ??
                ("unverifiable-provenance" as const)),
        });
      }
    }
  }
  return {
    observations,
    groups: senses.includes("composition") ? groups : "not-sensed",
  };
}
