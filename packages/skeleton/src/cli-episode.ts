// The supervising process owns the detached CLI group. Resident death closes
// IPC and kills that group; the next resident records the unobserved episode lost.
import { startCliEpisode, type CliActorContext } from "./cli-actor.js";
import { assertCliActorSpec, type CliActorSpec } from "./cli-actor-contract.js";
let active: ReturnType<typeof startCliEpisode> | undefined;
process.on("disconnect", () => {
  if (active) active.kill();
  else process.exit(1);
});
process.on(
  "message",
  (message: {
    kill?: boolean;
    spec: CliActorSpec;
    context: CliActorContext;
  }) => {
    if (message.kill) {
      active?.kill();
      return;
    }
    if (active) return;
    assertCliActorSpec(message.spec);
    active = startCliEpisode(message.spec, message.context);
    void active.completed.then((result) => {
      if (process.connected)
        process.send!(result, () => {
          process.disconnect();
          process.exit(0);
        });
      else process.exit(0);
    });
  },
);
