// Source .mjs leaves are strictly checked by the skeleton's TypeScript build.
// Bootstrap must also work before npm ci and cannot trust ignored dist output.
import { parseWorktrees } from "./git.mjs";
import {
  emitControlBeacon,
  emitGroupBeacon,
  restrictedBeaconBriefing,
  renderControlConstellation,
  sweepControlBeacons,
  readGroupBeacon,
  prepareBeaconDisposal,
} from "../../packages/skeleton/src/control-beacon-fs.mjs";
import { CONTROL_CODEBOOK } from "../../packages/skeleton/src/control-codebook.mjs";
import { openBeaconKey } from "../../packages/skeleton/src/beacon-provenance.mjs";

export { restrictedBeaconBriefing, prepareBeaconDisposal };

export const projectControlBeacon = (root, state, recordedAt) => {
  const keyFile = process.env.DOTLN_BEACON_KEY_FILE;
  const key = keyFile ? openBeaconKey(keyFile, root) : undefined;
  const effort = state.latestAttestation?.effort ?? "unknown";
  const storage = emitControlBeacon(
    root,
    {
      recordType: "control-beacon-projection",
      codebookVersion: 2,
      workOrderId: state.workOrderId,
      phase: state.phase,
      latestVerdict: state.latestVerdict ?? "unknown",
      effort: CONTROL_CODEBOOK.efforts.includes(effort) ? effort : "unknown",
      provenance: "host-projected",
      recordedAt,
    },
    key ? { key } : {},
  );
  emitGroupBeacon(root, parseWorktrees(root), Date.parse(recordedAt), storage);
};

export const constellation = (root) => {
  const now = Date.now();
  const worktrees = parseWorktrees(root);
  const observations = sweepControlBeacons(worktrees);
  return renderControlConstellation(
    observations,
    now,
    undefined,
    readGroupBeacon(worktrees, observations),
  );
};
