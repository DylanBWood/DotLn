import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalDestination } from "../../packages/skeleton/src/beacon-io.mjs";
import { renderControlConstellation } from "../../packages/skeleton/src/control-beacon-fs.mjs";
import { parseWorktrees } from "./git.mjs";
import { readJsonFile } from "./paths.mjs";

export const agentConstellation = async (root, requestFile, logFile) => {
  const path = resolve(root, logFile);
  if (
    !path.startsWith(`${join(root, "docs/observations")}${sep}`) ||
    !path.endsWith(".jsonl") ||
    canonicalDestination(path) !== path ||
    (existsSync(path) && !lstatSync(path).isFile())
  )
    throw new Error(
      "sweep log must be a regular JSONL file under docs/observations",
    );
  let runtime;
  try {
    runtime = await import(
      pathToFileURL(join(root, "packages/skeleton/dist/src/beacon-observe.js"))
        .href
    );
  } catch {
    throw new Error(
      "agent constellation needs the current skeleton build; run npm run build first",
    );
  }
  const request = readJsonFile(resolve(root, requestFile));
  let log = existsSync(path) ? readFileSync(path, "utf8") : "";
  const result = runtime.observeBeaconSweep(
    log,
    request,
    parseWorktrees(root),
    Date.now(),
    (next) => {
      if (!next.startsWith(log))
        throw new Error("sweep log is not append-only");
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, next.slice(log.length), { flag: "a", mode: 0o600 });
      log = next;
    },
  );
  if (!result.authorized)
    return {
      authorized: false,
      text: "Beacon sweep refused; CommandRefused recorded; no beacon metadata read.",
    };
  return {
    authorized: true,
    text: renderControlConstellation(
      result.observations,
      result.sweptAt,
      request.staleAfterMs,
    ),
  };
};
