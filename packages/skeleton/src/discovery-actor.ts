/** Private supervisor entry: the entire process is already in discoverySandbox.
 * The public CLI always establishes its own boundary for each target command. */
import { discoverWithinActor } from "./discovery.js";
try {
  const [worktree, profilePath, ...extra] = process.argv.slice(2);
  if (!worktree || extra.length)
    throw new Error("invalid discovery actor invocation");
  process.stdout.write(
    JSON.stringify(
      discoverWithinActor(worktree, profilePath ? { profilePath } : {}),
    ) + "\n",
  );
} catch {
  process.stderr.write(
    "Discovery failed; inspect the bounded target configuration locally.\n",
  );
  process.exitCode = 1;
}
