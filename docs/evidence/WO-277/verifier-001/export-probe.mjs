import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  cpSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  kit,
  scratch,
  ok,
  run,
  manifestOf,
  repository,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
const out = process.env.DOTLN_VERIFY_OUTPUT;
if (!out)
  throw new Error(
    "Set DOTLN_VERIFY_OUTPUT to session scratch; filed evidence is immutable.",
  );
const sha = (s) => createHash("sha256").update(s).digest("hex");
const observations = { recordedAt: new Date().toISOString() };
test("WO-277 independent exported page and terms setup", () => {
  const bare = join(scratch, "verifier bare export");
  cpSync(kit, bare, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (p) => basename(p) !== "node_modules",
  });
  assert.equal(existsSync(join(bare, "node_modules")), false);
  const printed = ok(
    run(process.execPath, ["scripts/launchpad.mjs", "commands"], { cwd: bare }),
    "bare export commands",
  ).stdout;
  const nested = ok(
    run(process.execPath, ["../scripts/launchpad.mjs", "commands"], {
      cwd: join(bare, "docs"),
    }),
    "nested cwd commands",
  ).stdout;
  const page = readFileSync(join(repository, "docs/OPERATOR.md"), "utf8");
  assert.equal(printed, page);
  assert.equal(nested, page);
  const steps = printed.split(/^## \d+\. /mu).slice(1);
  assert.equal(steps.length, 7);
  const paragraphs = steps.map((s) => s.split(/\n\s*\n/u)[1]);
  for (const [i, p] of paragraphs.entries()) {
    assert.ok(p?.trim());
    assert.ok(steps[i].indexOf(p) < steps[i].indexOf("```"));
  }
  const terms =
    "mkdir -p docs/control/local\ncp scripts/kit/terms.example.txt docs/control/local/terms.txt\nnpm run terms -- check CLAUDE.md README.md";
  assert.ok(steps[0].indexOf("git clone --no-tags") < steps[0].indexOf(terms));
  assert.ok(steps[0].includes(terms));
  assert.match(paragraphs[0], /replace the example's entries with your own/);
  assert.match(paragraphs[1], /WO-001/);
  assert.match(paragraphs[1], /your own entries/);
  assert.match(
    paragraphs[4],
    /git checkout main -- \.claude\/harness-manifest\.json/,
  );
  assert.match(paragraphs[4], /one at a time/);
  const first = (p) => readFileSync(join(bare, p), "utf8").split(/\n\s*\n/u)[1];
  assert.match(
    first("README.md"),
    /\[docs\/OPERATOR\.md\]\(docs\/OPERATOR\.md\)/,
  );
  assert.match(first("docs/KIT.md"), /\[OPERATOR\.md\]\(OPERATOR\.md\)/);
  assert.ok(manifestOf(kit).files.some((f) => f.path === "docs/OPERATOR.md"));
  assert.ok(existsSync(join(bare, "scripts/kit/terms.example.txt")));
  const before = ok(
    run(
      process.execPath,
      ["scripts/terms.mjs", "check", "CLAUDE.md", "README.md"],
      { cwd: bare },
    ),
    "terms before",
  ).stdout;
  assert.match(before, /local-terms list: unavailable/);
  mkdirSync(join(bare, "docs/control/local"), { recursive: true });
  cpSync(
    join(bare, "scripts/kit/terms.example.txt"),
    join(bare, "docs/control/local/terms.txt"),
  );
  const copied = ok(
    run("npm", ["run", "terms", "--", "check", "CLAUDE.md", "README.md"], {
      cwd: bare,
    }),
    "copied terms",
  ).stdout;
  assert.match(
    copied,
    /local-terms list: present; entries: 2 refuse, 1 context/,
  );
  writeFileSync(
    join(bare, "docs/control/local/terms.txt"),
    "refuse:\nFixture Sentinel Qzv\ncontext:\nMeadow\n",
  );
  const replaced = ok(
    run("npm", ["run", "terms", "--", "check", "CLAUDE.md", "README.md"], {
      cwd: bare,
    }),
    "personalized synthetic list",
  ).stdout;
  assert.match(
    replaced,
    /local-terms list: present; entries: 1 refuse, 1 context/,
  );
  const ignored = run(
    "git",
    ["check-ignore", "-q", "docs/control/local/terms.txt"],
    { cwd: bare },
  );
  assert.equal(ignored.status, 0);
  writeFileSync(
    join(bare, "sample.md"),
    "Fixture Sentinel Qzv\nA meadow beside a stream.\n",
  );
  const refusal = run("npm", ["run", "terms", "--", "check", "sample.md"], {
    cwd: bare,
  });
  assert.notEqual(refusal.status, 0);
  assert.match(refusal.stderr, /FAIL sample\.md:1/);
  assert.match(refusal.stdout, /CONTEXT sample\.md:2/);
  assert.doesNotMatch(refusal.stderr + refusal.stdout, /Fixture Sentinel Qzv/);
  Object.assign(observations, {
    pageSha256: sha(page),
    printedBytes: Buffer.byteLength(printed),
    steps: 7,
    bareExport: true,
    nestedCwd: true,
    firstParagraphLinks: true,
    termsBlockOrder: true,
    replaceOwnEntries: true,
    absentList: true,
    copiedList: true,
    syntheticOwnList: true,
    ignoredList: true,
    refuseAndContextSemantics: true,
  });
  writeFileSync(
    join(out, "probe-results.json"),
    JSON.stringify(observations, null, 2) + "\n",
  );
  writeFileSync(join(out, "export-commands.txt"), printed);
});
