import {
  closeSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  writeFileSync,
  linkSync,
  unlinkSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { canonicalStringify } from "@dotln/compiler";
import { assertActorSpec, type ActorAdapter } from "./actor-contract.js";
import { assertHandoffPacket } from "./handoff-contract.js";
import { actorFailure } from "./cli-actor.js";

export const humanHandoffAdapter: ActorAdapter = {
  kind: "human-handoff",
  available: () => null,
  run(spec, context) {
    assertActorSpec(spec);
    if (!context || !spec.handoff)
      throw new Error("handoff requires resident context");
    const packet = { ...spec.handoff, episodeId: context.episodeId };
    assertHandoffPacket(packet);
    const directory = join(
      context.residentStore,
      "control",
      "local",
      "handoffs",
    );
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    if (realpathSync(directory) !== directory)
      throw new Error("handoff directory must be canonical and not symlinked");
    const path = join(directory, `${packet.episodeId}.json`);
    const content = canonicalStringify(packet) + "\n";
    const temporary = join(
      directory,
      `.${packet.episodeId}.${randomUUID()}.tmp`,
    );
    const fd = openSync(temporary, "wx", 0o600);
    try {
      try {
        writeFileSync(fd, content);
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      try {
        linkSync(temporary, path);
      } catch (error) {
        if (
          (error as NodeJS.ErrnoException).code !== "EEXIST" ||
          realpathSync(path) !== path ||
          readFileSync(path, "utf8") !== content
        )
          throw error;
      }
      const directoryFd = openSync(directory, "r");
      try {
        fsyncSync(directoryFd);
      } finally {
        closeSync(directoryFd);
      }
    } finally {
      unlinkSync(temporary);
    }
    return {
      handoff: packet,
      completed: Promise.resolve(actorFailure("handoff-requested")),
      kill: () => {},
    };
  },
};
