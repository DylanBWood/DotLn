import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, posix, resolve, sep } from "node:path";
import { scriptTokens } from "./machinery-coverage.mjs";
import { relativeImports } from "./evidence-sources.mjs";
import { docPath, docRelative } from "./config.mjs";

/** Scan executable tokens, not examples embedded in strings. Output-side
 * atomic staging under an existing store belongs to that store's protocol;
 * this rule covers independent temporary roots and system-temp fixtures.
 */
export function unownedTemporaryRootSites(root) {
  const physicalRoot = realpathSync(root);
  const intake = docRelative(root, "intake");
  const intakePath = docPath(root, "intake");
  const physicalIntake = existsSync(intakePath)
    ? realpathSync(intakePath)
    : intakePath;
  const temporaryBases = [
    tmpdir(),
    realpathSync(tmpdir()),
    "/tmp",
    "/private/tmp",
    "/var/tmp",
  ].map((base) => resolve(base));
  const files = [];
  const walk = (path) => {
    if (!existsSync(join(root, path))) return;
    for (const entry of readdirSync(join(root, path), {
      withFileTypes: true,
    })) {
      if (
        entry.isSymbolicLink() ||
        ["dist", "node_modules", ".runtime", ".git"].includes(entry.name)
      )
        continue;
      const child = `${path}/${entry.name}`;
      if (entry.isDirectory()) walk(child);
      else if (/\.(?:mjs|cjs|ts|js)$/.test(entry.name)) files.push(child);
    }
  };
  walk("scripts");
  walk("packages");
  walk("corpus");
  // Tests can load executable evidence fixtures through both relative imports
  // and repository-relative path literals. Follow that closure instead of
  // treating a documentation directory as an execution boundary.
  const seen = new Set(files);
  const admit = (path) => {
    path = posix.normalize(path);
    if (
      seen.has(path) ||
      path.startsWith("../") ||
      isAbsolute(path) ||
      path === intake ||
      path.startsWith(intake + "/") ||
      !/\.(?:mjs|cjs|js|ts)$/.test(path)
    )
      return;
    const absolute = join(root, path);
    if (!lstatSync(absolute, { throwIfNoEntry: false })?.isFile()) return;
    const physical = realpathSync(absolute);
    if (!physical.startsWith(physicalRoot + sep)) return;
    if (
      physical === physicalIntake ||
      physical.startsWith(physicalIntake + sep)
    )
      return;
    seen.add(path);
    files.push(path);
  };
  const findings = [];
  for (const path of files) {
    const source = readFileSync(join(root, path), "utf8");
    const tokens = [...scriptTokens(source)];
    for (const target of relativeImports(root, path)) admit(target);
    for (const token of tokens)
      if (token.string && /\.(?:mjs|cjs|js|ts)$/.test(token.value)) {
        if (token.value.startsWith("."))
          admit(posix.join(posix.dirname(path), token.value));
        else admit(token.value);
      }
    if (
      /^packages\/skeleton\/(?:dist\/)?src\/temporary-root-records\.mjs$/.test(
        path,
      ) ||
      !source.includes("mkdtemp")
    )
      continue;
    const names = new Set(["mkdtempSync", "mkdtemp"]);
    for (let i = 0; i < tokens.length; i++)
      if (
        names.has(tokens[i].text) &&
        tokens[i + 1]?.text === "as" &&
        tokens[i + 2]?.identifier
      )
        names.add(tokens[i + 2].text);
    for (let i = 0; i < tokens.length; i++) {
      if (
        !tokens[i].identifier ||
        !names.has(tokens[i].text) ||
        tokens[i + 1]?.text !== "("
      )
        continue;
      let depth = 1,
        end = i + 2;
      for (; end < tokens.length && depth; end++) {
        if (tokens[end].text === "(") depth++;
        if (tokens[end].text === ")") depth--;
      }
      const argumentsText = source.slice(
        tokens[i + 1].start,
        tokens[end - 1]?.start,
      );
      const temporaryLiteral = tokens.slice(i + 2, end - 1).some((token) => {
        if (!token.string) return false;
        if (/(?:^|[\\/])dotln-/.test(token.value)) return true;
        return (
          isAbsolute(token.value) &&
          temporaryBases.some((base) =>
            resolve(token.value).startsWith(base + sep),
          )
        );
      });
      if (/\btmpdir\b/.test(argumentsText) || temporaryLiteral)
        findings.push({
          path,
          line: source.slice(0, tokens[i].start).split("\n").length,
        });
    }
  }
  return findings.sort(
    (a, b) => a.path.localeCompare(b.path) || a.line - b.line,
  );
}
