// Part E, criterion E4: the wordings the four statement cases of
// scripts/test-vertical.mjs iterate at the order's base, and the rows of the
// table that replaced them in packages/skeleton/test/vertical-judgment.test.ts.
//
//   node docs/evidence/WO-276/part-e/wordings.mjs base <commit>
//     writes wordings.json: every iteration of the four cases at that commit,
//     read from the titles the file registers there, with the statement role
//     and the assertion kind the case's fixture supplies for it.
//   node docs/evidence/WO-276/part-e/wordings.mjs table
//     writes table-rows.json: the table's rows as the test file's source
//     holds them, and their comparison with wordings.json.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const FILE = "scripts/test-vertical.mjs";
const TABLE_FILE = "packages/skeleton/test/vertical-judgment.test.ts";
const SUFFIX = ": make `fixture.txt` contain changed by synthetic worker.";
const OBSERVATION = "current-behavior observation";

/** The four cases by the words their titles open with. What each supplies
 * is what its call of `verticalFixture` passes at the base: the body's
 * section is classed a requirement where `failureAsRequirement` is true and
 * a current-behavior observation where it is false, and its assertion is
 * `baselineKind`, an existing failure where the case names none. The first
 * and the third case take the flag from the title's closing parenthesis;
 * the second and the fourth pass `failureAsRequirement: true` and
 * `baselineKind: "no-existing-failure"`. */
const CASES = [
  {
    case: "composed baseline reproduces",
    opens:
      "WO-123 composed baseline records source-bound failure judgments and reproduces across statement roles: ",
    flagged: true,
    assertion: "existing-failure",
    expects: { kind: "defect", outcome: "reproduced" },
  },
  {
    case: "composed baseline walks",
    opens:
      "WO-123 composed baseline walks requirement-voice wording without a failing-behavior finding: ",
    flagged: false,
    assertion: "no-existing-failure",
    expects: { kind: "new", outcome: "walked" },
  },
  {
    case: "resident consumes",
    opens:
      "WO-123 resident consumes source-bound failure judgments across statement roles: ",
    flagged: true,
    assertion: "existing-failure",
    expects: { kind: "defect", outcome: "reproduced" },
  },
  {
    case: "healthy loop completes",
    opens:
      "WO-123 healthy negative wording completes the composed loop without a false baseline hold: ",
    flagged: false,
    assertion: "no-existing-failure",
    expects: { kind: "new", outcome: "walked" },
  },
];

const write = (name, value) =>
  writeFileSync(join(here, name), `${JSON.stringify(value, null, 2)}\n`);
const key = (row) => JSON.stringify([row.wording, row.role, row.assertion]);

/** Every title the file registers at a commit, in order, with no case
 * body run: the file is loaded with `test` standing for a collector. */
async function registeredTitles(commit) {
  const source = execFileSync("git", ["show", `${commit}:${FILE}`], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64_000_000,
  });
  const marker = 'import test from "node:test";';
  if (!source.includes(marker)) throw new Error(`${FILE} imports no test`);
  const directory = mkdtempSync(join(tmpdir(), "dotln-wordings-"));
  try {
    const rewritten = source
      .replace(
        marker,
        "export const registered = []; const test = (name) => registered.push(name);",
      )
      .replace(/from "([^"]+)"/gu, (whole, specifier) =>
        specifier.startsWith("node:")
          ? whole
          : `from ${JSON.stringify(
              specifier.startsWith(".")
                ? pathToFileURL(resolve(root, dirname(FILE), specifier)).href
                : import.meta.resolve(specifier),
            )}`,
      );
    const path = join(directory, "registrations.mjs");
    writeFileSync(path, rewritten);
    return (await import(pathToFileURL(path).href)).registered;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

async function base(commit) {
  const resolved = execFileSync("git", ["rev-parse", `${commit}^{commit}`], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  const titles = await registeredTitles(resolved);
  const cases = CASES.map((entry) => {
    const rows = titles
      .filter((title) => title.startsWith(entry.opens))
      .map((title) => {
        let text = title.slice(entry.opens.length);
        let role = "requirement";
        if (entry.flagged) {
          const flag = /^(.*) \((true|false)\)$/su.exec(text);
          if (!flag) throw new Error(`no role flag: ${title}`);
          text = flag[1];
          role = flag[2] === "true" ? "requirement" : OBSERVATION;
        }
        const wording = text.endsWith(SUFFIX)
          ? text.slice(0, -SUFFIX.length)
          : text;
        return { wording, role, assertion: entry.assertion };
      });
    if (!rows.length) throw new Error(`no iteration of: ${entry.opens}`);
    return {
      case: entry.case,
      title: entry.opens.replace(/: $/u, ""),
      expects: entry.expects,
      iterations: rows.length,
      rows,
    };
  });
  const all = cases.flatMap((entry) => entry.rows);
  write("wordings.json", {
    what: "Every wording the four statement cases of scripts/test-vertical.mjs iterate at the order's base, read from the titles the file registers there. Each row is one registered case: the wording, the statement role its fixture supplies for the body's section and the assertion kind it supplies for that statement. The statement judged is the wording followed by the suffix.",
    command: `node docs/evidence/WO-276/part-e/wordings.mjs base ${commit}`,
    base: resolved,
    file: FILE,
    suffix: SUFFIX,
    registered: titles.length,
    iterations: all.length,
    distinct: new Set(all.map(key)).size,
    cases,
  });
  console.log(
    `${all.length} iterations, ${new Set(all.map(key)).size} distinct rows, of ${titles.length} registered cases`,
  );
}

/** The table's rows from the test file's source: the entries of
 * `STATEMENT_WORDINGS`, one row for each of an entry's roles and wordings. */
async function table() {
  const { sourceSyntax, sourceTrees } = await import(
    pathToFileURL(join(root, "packages/skeleton/src/source-reading.mjs")).href
  );
  const K = sourceSyntax().SyntaxKind;
  const [read] = sourceTrees([
    { path: TABLE_FILE, source: readFileSync(join(root, TABLE_FILE), "utf8") },
  ]);
  const declaration = read.file.statements
    .filter((statement) => statement.kind === K.VariableStatement)
    .flatMap((statement) => statement.declarationList.declarations)
    .find((entry) => entry.name.text === "STATEMENT_WORDINGS");
  if (!declaration)
    throw new Error("the test file holds no STATEMENT_WORDINGS");
  const strings = (node) => {
    if (
      node.kind === K.StringLiteral ||
      node.kind === K.NoSubstitutionTemplateLiteral
    )
      return node.text;
    if (node.kind === K.ArrayLiteralExpression)
      return node.elements.map(strings);
    throw new Error(`the table holds a value that is no string: ${node.kind}`);
  };
  let list = declaration.initializer;
  while (list.kind !== K.ArrayLiteralExpression) list = list.expression;
  const rows = list.elements.flatMap((entry) => {
    const field = Object.fromEntries(
      entry.properties.map((property) => [
        property.name.text,
        strings(property.initializer),
      ]),
    );
    return field.wordings.flatMap((wording) =>
      field.roles.map((role) => ({
        wording,
        role,
        assertion: field.assertion,
        kind: field.kind,
        rule: field.rule,
        storyRule: field.storyRule,
      })),
    );
  });
  const recorded = JSON.parse(
    readFileSync(join(here, "wordings.json"), "utf8"),
  );
  const expected = new Map(
    recorded.cases.flatMap((entry) =>
      entry.rows.map((row) => [key(row), entry.expects.kind]),
    ),
  );
  const held = new Map(rows.map((row) => [key(row), row.kind]));
  const comparison = {
    baseRows: expected.size,
    tableRows: rows.length,
    repeatedInTable: rows.length - held.size,
    missingFromTable: [...expected.keys()].filter((row) => !held.has(row)),
    kindDiffers: [...expected].filter(
      ([row, kind]) => held.has(row) && held.get(row) !== kind,
    ),
    beyondTheBase: [...held.keys()]
      .filter((row) => !expected.has(row))
      .map((row) => JSON.parse(row)),
  };
  write("table-rows.json", {
    what: "The rows of the table STATEMENT_WORDINGS in the skeleton's judgment test, read from its source, and their comparison with wordings.json: every distinct row of the base is a row of the table with the classification kind its case expected.",
    command: "node docs/evidence/WO-276/part-e/wordings.mjs table",
    file: TABLE_FILE,
    comparison,
    rows,
  });
  console.log(JSON.stringify(comparison, null, 2));
  if (
    comparison.missingFromTable.length ||
    comparison.kindDiffers.length ||
    comparison.repeatedInTable
  )
    process.exitCode = 1;
}

const [mode, argument] = process.argv.slice(2);
if (mode === "base" && argument) await base(argument);
else if (mode === "table") await table();
else {
  console.error("usage: wordings.mjs base <commit> | table");
  process.exitCode = 2;
}
