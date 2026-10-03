import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { replayVerification } from "../../../packages/skeleton/dist/src/verification.js";
import { transportPrompt } from "../../../packages/skeleton/dist/src/verification-protocol.js";

/** Replays the retained no-notice stream without a worktree, CLI or model. */
export function checkLegacyNotice() {
  const input = JSON.parse(
    readFileSync(new URL("legacy-notice-input.json", import.meta.url), "utf8"),
  );
  const state = replayVerification(input.events, input.events[0].workstreamId);
  const { command, capsule } = state.pending;
  assert.ok(!("reviewNotice" in command.intent.payload));
  const request = {
    ...input.launch,
    command,
    capsule,
    workOrder: capsule.workOrder,
    cwd: "/synthetic/wo184/snapshot",
    profile: {
      profileId: "worktree-snapshot",
      mounts: [{ path: "/synthetic/wo184/snapshot", access: "read" }],
    },
  };
  const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(sha256(JSON.stringify(command)), input.expected.commandSha256);
  assert.equal(sha256(transportPrompt(request)), input.expected.promptSha256);
  const receipt = JSON.parse(
    readFileSync(
      new URL("legacy-notice-compatibility.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(receipt.commandSha256, input.expected.commandSha256);
  assert.equal(receipt.promptSha256, input.expected.promptSha256);
  return { commandByteIdentical: true, promptByteIdentical: true };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv[2], "--check");
  console.log(JSON.stringify(checkLegacyNotice()));
}
