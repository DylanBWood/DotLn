// Read-only census. Never follow links or print the contents of a temporary file.
import { lstatSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sampleFileEventDaemon } from "../../../scripts/lib/host-resources.mjs";

function measure(path) {
  try {
    const info = lstatSync(path);
    if (info.isSymbolicLink())
      return { bytes: info.size, files: 1, unreadable: 0 };
    if (!info.isDirectory())
      return { bytes: info.size, files: 1, unreadable: 0 };
    return readdirSync(path).reduce(
      (sum, name) => {
        const child = measure(join(path, name));
        for (const key of Object.keys(sum)) sum[key] += child[key];
        return sum;
      },
      { bytes: 0, files: 0, unreadable: 0 },
    );
  } catch {
    return { bytes: 0, files: 0, unreadable: 1 };
  }
}

const families = new Map();
for (const name of readdirSync(tmpdir()).sort()) {
  if (name !== "dotln" && !name.startsWith("dotln-")) continue;
  const path = join(tmpdir(), name);
  const info = lstatSync(path, { throwIfNoEntry: false });
  if (!info?.isDirectory() || info.isSymbolicLink()) continue;
  const family = name.replace(/[-.][A-Za-z0-9_]{6}$/, "-*");
  const value = families.get(family) ?? {
    family,
    roots: 0,
    bytes: 0,
    files: 0,
    unreadable: 0,
    oldestMtime: info.mtime.toISOString(),
  };
  value.roots++;
  const measured = measure(path);
  for (const key of Object.keys(measured)) value[key] += measured[key];
  value.oldestMtime = [value.oldestMtime, info.mtime.toISOString()].sort()[0];
  families.set(family, value);
}
const daemon = sampleFileEventDaemon();
console.log(
  JSON.stringify(
    {
      observedAt: new Date().toISOString(),
      command: "node docs/evidence/WO-233/census.mjs",
      boundary:
        "system temp dotln and dotln-* directories; lstat only, links not followed",
      fseventsdResidentBytes: daemon.residentBytes,
      fileEvents: daemon,
      families: [...families.values()],
    },
    null,
    2,
  ),
);
