// Final review of WO-276: does the kit's verification run an instance's own
// code before it has compared the carried compiled runtime with the
// manifest? A synthetic kit root under the scratch directory given as
// argv[2]: a manifest that lists one generated harness surface whose bytes
// differ and one compiled runtime file whose bytes differ, a harness manifest
// that names the surface, and a stand-in scripts/harness.mjs that records
// that it ran. The current verifyKit is run beside the base's (HEAD's
// scripts, extracted with `git archive` into the directory given as
// argv[3]). Adapted from the review worker's probe of the same claim.
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
const [scratch, base] = process.argv.slice(2);
const load = (from) =>
  import(pathToFileURL(join(from, "scripts/launchpad.mjs")).href);
const readers = {
  base: await load(base),
  candidate: await load(process.cwd()),
};
const zero = "0".repeat(64);
const result = {};
for (const [name, { verifyKit }] of Object.entries(readers)) {
  const root = join(scratch, `verify-order-${name}`);
  rmSync(root, { recursive: true, force: true });
  const put = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const marker = join(root, "ran.marker");
  put(
    "KIT-MANIFEST.json",
    JSON.stringify({
      schemaVersion: 1,
      commit: "a".repeat(40),
      tag: null,
      files: [
        { path: ".claude/settings.json", sha256: zero },
        { path: "packages/skeleton/dist/src/a.js", sha256: zero },
      ],
    }),
  );
  put(".claude/settings.json", "{}\n");
  put(
    ".claude/harness-manifest.json",
    JSON.stringify({ installed: [{ path: ".claude/settings.json" }] }),
  );
  put("packages/skeleton/dist/src/a.js", "// a changed runtime file\n");
  put(
    "scripts/harness.mjs",
    `import { writeFileSync } from "node:fs";\nwriteFileSync(${JSON.stringify(marker)}, "ran\\n");\n`,
  );
  mkdirSync(join(root, "node_modules"));
  let refusal = null;
  try {
    verifyKit(root);
  } catch (error) {
    refusal = error.message;
  }
  result[name] = {
    refusal,
    instanceCodeRanBeforeTheRefusal: existsSync(marker),
  };
  rmSync(root, { recursive: true, force: true });
}
console.log(JSON.stringify(result, null, 2));
