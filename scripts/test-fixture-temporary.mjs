// WO-168: a session under test now creates its scratch directory, beside the
// operator-control and writer-coordination state fixtures already keep in the
// system temporary directory. A suite that imports this module before anything
// else keeps all of it in one directory of its own, removed when it exits.
import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const fixtureTemporary = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-fixture-temporary-")),
);
for (const name of ["TMPDIR", "TMP", "TEMP"])
  process.env[name] = fixtureTemporary;
process.on("exit", () => {
  try {
    rmSync(fixtureTemporary, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    // What a fixture left unremovable stays inside this directory.
  }
});
