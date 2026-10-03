import { realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
/** Native boundary shared by direct checks and the whole trusted producer episode. */
export function discoverySandbox(
  root: string,
  runtimeReads: readonly string[] = [],
): string {
  const quote = (path: string) => JSON.stringify(path);
  return (
    `(version 1)(allow default)(deny network*)(deny file-read-data)(deny file-write*)` +
    [
      root,
      "/usr",
      "/bin",
      "/System",
      "/Library/Apple",
      "/opt/homebrew",
      dirname(dirname(realpathSync(process.execPath))),
      "/private/var/db/dyld",
      ...runtimeReads,
    ]
      .map((path) => `(allow file-read-data (subpath ${quote(path)}))`)
      .join("") +
    `(allow file-read-data (literal "/") (literal "/dev/null") (literal "/dev/urandom"))(allow file-write* (subpath ${quote(root)}) (literal "/dev/null"))`
  );
}

/** Exact shell spelling used by the Claude writer's native allowlist and
 * host permission route. The named command remains the contract's input. */
export function writerSandboxProfilePath(
  launchpad: string,
  target: string,
): string {
  return join(
    launchpad,
    "docs/control/local/harness/targets",
    createHash("sha256").update(target).digest("hex"),
    "writer-sandbox.sb",
  );
}

/** Tests may write product files, never the controls that confine later tools
 * nor the paths the host's writer Write route protects. */
export function writerSandboxProfile(root: string): string {
  return (
    discoverySandbox(root) +
    `(deny file-write* (subpath ${JSON.stringify(join(root, ".claude"))}) (subpath ${JSON.stringify(join(root, ".dotln"))}) (subpath ${JSON.stringify(join(root, ".git"))}) (literal ${JSON.stringify(join(root, "claude.local.md"))}) (literal ${JSON.stringify(join(root, "CLAUDE.local.md"))}))`
  );
}

export function confinedTestCommand(
  root: string,
  command: string,
  profileFile: string,
): string {
  if (process.platform !== "darwin")
    throw new Error(
      "source-change test confinement unavailable: macOS sandbox-exec required",
    );
  if (command.includes("*"))
    throw new Error(
      "source-change test command contains an asterisk; the writer profile refuses wildcards",
    );
  if (profileFile === root || profileFile.startsWith(`${root}/`))
    throw new Error(
      "source-change sandbox profile must be outside the writable worktree",
    );
  const quote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;
  const confined = `/usr/bin/env -i PATH=${quote(`${dirname(process.execPath)}:/usr/bin:/bin`)} HOME='/var/empty' TMPDIR=${quote(root)} NODE_DISABLE_COMPILE_CACHE=1 /usr/bin/sandbox-exec -f ${quote(profileFile)} ${command}`;
  if (confined.includes("*"))
    throw new Error(
      "source-change confined test command contains an asterisk; the writer profile refuses wildcards",
    );
  return confined;
}
