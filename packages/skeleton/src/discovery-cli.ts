import { discover } from "./discovery.js";
const [worktree, profilePath, ...extra] = process.argv.slice(2);
try {
  if (!worktree || extra.length)
    throw new Error("usage: discovery-cli <worktree> [profile-path]");
  process.stdout.write(
    JSON.stringify(
      discover(worktree, undefined, profilePath ? { profilePath } : {}),
    ) + "\n",
  );
} catch {
  // Never relay target output, absolute paths or profile contents to a shared log.
  process.stderr.write(
    "Discovery failed; inspect the bounded target configuration locally.\n",
  );
  process.exitCode = 1;
}
