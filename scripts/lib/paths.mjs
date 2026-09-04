import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { basename, join, resolve, sep } from "node:path";

export const containedRegularFile = (path, root) =>
  existsSync(path) &&
  lstatSync(path).isFile() &&
  realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);

export const parseJson = (source, displayPath) => {
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(
      `invalid JSON in ${displayPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const readJsonFile = (path) => {
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    throw new Error(
      `cannot read JSON file ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseJson(source, path);
};

export const workOrderAuthorityPath = (
  root,
  workOrderId,
  workOrderPath,
  { requireFile = true } = {},
) => {
  const authorityRoot = join(root, "docs/work-orders");
  const authorityPath = resolve(root, workOrderPath ?? "");
  if (
    !/^WO-\d{3}$/.test(workOrderId ?? "") ||
    !workOrderPath ||
    !authorityPath.startsWith(`${authorityRoot}${sep}`) ||
    !basename(authorityPath).startsWith(`${workOrderId}-`) ||
    (requireFile && !containedRegularFile(authorityPath, authorityRoot))
  )
    throw new Error(
      `invalid work-order authority path for ${workOrderId ?? "none"}: ${workOrderPath ?? "none"}`,
    );
  return authorityPath;
};

const protectedIntake = (candidate) =>
  candidate === "docs/intake" || candidate.startsWith("docs/intake/");
const anchoredBuildOutput = (candidate) =>
  /^(?:node_modules|dist)(?:\/|$)/.test(candidate) ||
  /^packages\/[^/]+\/(?:node_modules|dist)(?:\/|$)/.test(candidate);

export const classifyIgnoredMaterial = (candidate) => {
  const intake = protectedIntake(candidate);
  const disposable =
    !intake &&
    (anchoredBuildOutput(candidate) ||
      basename(candidate) === ".DS_Store" ||
      candidate.endsWith(".tsbuildinfo"));
  return {
    disposable,
    releaseEvidenceAllowed:
      intake || disposable || candidate === ".claude/settings.local.json",
  };
};
