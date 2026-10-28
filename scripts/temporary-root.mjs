#!/usr/bin/env node
// The shell fixture helper uses the same owner record and remover as Node.
import {
  createTemporaryRoot,
  finishTemporaryRoot,
  nestedTemporaryRoots,
  readTemporaryOwner,
  removeTemporaryPath,
  removeTemporaryRoot,
} from "./lib/temporary-roots.mjs";
const [action, path, pid] = process.argv.slice(2);
if (action === "create" && path && /^\d+$/.test(pid ?? ""))
  console.log(
    createTemporaryRoot(path, {
      class: "gate-fixture",
      owner: { pid: Number(pid) },
    }),
  );
else if (action === "remove" && path && pid === undefined)
  removeTemporaryRoot(path);
else if (action === "failed" && path && pid === undefined)
  finishTemporaryRoot(path, "failed");
else if (action === "complete" && path && pid === undefined) {
  const record = readTemporaryOwner(path);
  if (!record) throw new Error("Unowned fixture root retained");
  if (!record.owner.gateId && nestedTemporaryRoots(path).length)
    console.error(
      "Temporary cleanup retained a parent with nested owned roots.",
    );
  else removeTemporaryPath(path, { recursive: true, force: true });
} else
  throw new Error(
    "usage: temporary-root create <prefix> <owner-pid> | remove|failed|complete <root>",
  );
