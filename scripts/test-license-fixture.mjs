import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepublishOnly } from "./license-surfaces.mjs";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const installLicenseFixture = (root) => {
  mkdirSync(join(root, "docs"), { recursive: true });
  for (const path of ["LICENSE", "LICENSE-docs", "NOTICE", "docs/LEGAL.md"])
    copyFileSync(join(source, path), join(root, path));
  const paths = [
    "package.json",
    ...readdirSync(join(root, "packages"))
      .map((name) => `packages/${name}/package.json`)
      .filter((path) => existsSync(join(root, path))),
  ];
  for (const path of paths) {
    const manifest = JSON.parse(readFileSync(join(root, path), "utf8"));
    manifest.license = "Apache-2.0";
    manifest.private = true;
    manifest.scripts = { ...manifest.scripts, prepublishOnly };
    if (path === "package.json") {
      manifest.name ??= "dotln-license-fixture";
      manifest.workspaces = ["packages/*"];
    }
    writeFileSync(join(root, path), `${JSON.stringify(manifest, null, 2)}\n`);
  }
};

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  installLicenseFixture(resolve(process.argv[2]));
