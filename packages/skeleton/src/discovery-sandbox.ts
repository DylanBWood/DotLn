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
