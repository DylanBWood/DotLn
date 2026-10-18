import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { sha256Hex, json } from "./helpers.mjs";
import { buildOutputDigest } from "./gate-reuse.mjs";
import { hasPackageSources } from "../../packages/skeleton/src/runtime-inputs.mjs";

const stamp = ".runtime/build-freshness.json";
const outputs = ["packages/*/dist"];

function sourceDigest(root) {
  const files = [];
  const visit = (path) => {
    const stat = lstatSync(join(root, path));
    if (stat.isSymbolicLink())
      throw new Error(`Build input is a link: ${path}`);
    if (stat.isDirectory()) {
      for (const name of readdirSync(join(root, path)).sort())
        if (name !== ".DS_Store") visit(`${path}/${name}`);
    } else if (stat.isFile())
      files.push([path, readFileSync(join(root, path))]);
    else throw new Error(`Build input is not a regular file: ${path}`);
  };
  for (const path of [
    "tsconfig.json",
    "package-lock.json",
    "scripts/build.mjs",
    "scripts/lib/build-freshness.mjs",
  ])
    if (existsSync(join(root, path))) visit(path);
  for (const name of readdirSync(join(root, "packages")).sort())
    for (const part of ["package.json", "tsconfig.json", "src", "test"])
      if (existsSync(join(root, "packages", name, part)))
        visit(`packages/${name}/${part}`);
  return sha256Hex(
    Buffer.concat(
      files.flatMap(([path, bytes]) => [
        Buffer.from(`${path}\0${bytes.length}\0`),
        bytes,
      ]),
    ),
  );
}

export function buildFreshness(root) {
  if (!hasPackageSources(root))
    return { current: true, reason: "carried runtime" };
  try {
    const recorded = JSON.parse(readFileSync(join(root, stamp), "utf8"));
    const output = buildOutputDigest(root, outputs);
    return {
      current:
        recorded.source === sourceDigest(root) &&
        typeof output === "string" &&
        recorded.output === output,
      reason: "source and compiled output must match the last successful build",
    };
  } catch (error) {
    return {
      current: false,
      reason:
        error.code === "ENOENT" ? "no build freshness receipt" : error.message,
    };
  }
}

export function recordBuildFreshness(root) {
  writeFileSync(
    join(root, stamp),
    json({
      source: sourceDigest(root),
      output: buildOutputDigest(root, outputs),
    }),
  );
}
