import assert from "node:assert/strict";
import {
  writeFileSync,
  mkdirSync,
  chmodSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { areaNoteFailures } from "../../../../scripts/lib/area-notes.mjs";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const root = createScratchRoot(join(tmpdir(), "dotln-ver002-notes-"));
const parent = join(root, "docs/repositories"),
  profile = "docs/repositories/noted.md",
  file = "docs/repositories/noted/billing.md";
try {
  mkdirSync(join(root, "docs/repositories/noted"), { recursive: true });
  writeFileSync(join(root, profile), "# Repository\n");
  writeFileSync(
    join(root, file),
    '<!-- dotln-area-note:start -->\n{"paths":["billing/"]}\n<!-- dotln-area-note:end -->\n',
  );
  const control = areaNoteFailures(root, profile);
  assert.equal(control.length, 1);
  assert.match(control[0], /commit/u);
  chmodSync(parent, 0o111);
  let listError = null;
  try {
    readdirSync(parent);
  } catch (error) {
    listError = error.code;
  }
  assert.equal(listError, "EACCES");
  assert.ok(readFileSync(join(root, profile), "utf8"));
  assert.ok(readFileSync(join(root, file), "utf8"));
  const observed = areaNoteFailures(root, profile);
  assert.deepEqual(observed, []);
  writeFileSync(
    process.argv[2],
    JSON.stringify(
      {
        control,
        parentListError: listError,
        profileAndNoteReadable: true,
        observed,
        limit:
          "Production area-note helper only; complete document scanner with registered profile not exercised, so recorded as follow-up.",
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  chmodSync(parent, 0o755);
  removeTemporaryPath(root, { recursive: true, force: true });
}
