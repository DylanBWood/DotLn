import { realpathSync } from "node:fs";
import { dirname } from "node:path";
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
export function confinedTestCommand(root: string, command: string): string {
  if (process.platform !== "darwin")
    throw new Error(
      "source-change test confinement unavailable: macOS sandbox-exec required",
    );
  const quote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;
  return `/usr/bin/env -i PATH=${quote(`${dirname(process.execPath)}:/usr/bin:/bin`)} HOME='/var/empty' TMPDIR=${quote(root)} NODE_DISABLE_COMPILE_CACHE=1 /usr/bin/sandbox-exec -p ${quote(discoverySandbox(root))} ${command}`;
}
