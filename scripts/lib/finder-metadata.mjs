import { accessSync, constants, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { containedRegularFile } from "./paths.mjs";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";

export const isFinderMetadata = (root, file) =>
  basename(file) === ".DS_Store" &&
  containedRegularFile(join(root, file), root);

// Git omits empty directories and ignored entries from its status. Check the
// exact disposable name without following links or reading Git administration.
export function assertFinderMetadataTypes(root) {
  const started = performance.now();
  const skippedIgnoredDirectories = [];
  let directories = 0;
  const pending = [""];
  while (pending.length) {
    const directory = pending.pop();
    let entries;
    try {
      entries = readdirSync(join(root, directory), { withFileTypes: true });
      // Listing needs only read permission, but neither this walk nor Git can
      // look at the entries without search permission: Git's status then
      // silently omits them. Treat such a directory as unreadable.
      accessSync(join(root, directory), constants.X_OK);
      directories++;
    } catch (error) {
      if (
        directory &&
        ["EACCES", "EPERM"].includes(error.code) &&
        runGit(
          root,
          [...HOST_GIT_READ, "check-ignore", "-q", "--", directory],
          {
            onFailure: () => false,
          },
        ) !== false
      ) {
        skippedIgnoredDirectories.push(directory);
        continue;
      }
      throw new Error(
        `cannot inspect Finder metadata in ${directory || "."} (${error.code ?? "read failed"}); restore directory read and search access and retry; source retained`,
      );
    }
    for (const entry of entries) {
      if (entry.name === ".git") continue;
      const file = join(directory, entry.name);
      if (entry.name === ".DS_Store" && !entry.isFile())
        throw new Error(
          `non-regular Finder metadata: ${file}; source retained`,
        );
      if (entry.isDirectory()) pending.push(file);
    }
  }
  return {
    durationMs: Math.round(performance.now() - started),
    directories,
    skippedIgnoredDirectories,
  };
}
