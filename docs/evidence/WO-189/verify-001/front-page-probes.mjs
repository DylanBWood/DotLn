import {
  realpathSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  frontPageFindings,
  checkDocs,
} from "../../../../scripts/docs-check.mjs";
const subject = resolve(import.meta.dirname, "../../../..");
const original = readFileSync(join(subject, "README.md"), "utf8");
const control = JSON.parse(
  readFileSync(join(subject, "docs/control/front-page.json"), "utf8"),
);
const runs = [];
function fixture(declare) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo189-verify-")));
  const write = (file, text) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  };
  const git = (...args) => {
    const result = spawnSync(
      "git",
      [
        "-C",
        root,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { encoding: "utf8" },
    );
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout.trim();
  };
  git("init", "-q", "-b", "main");
  if (git("rev-parse", "--show-toplevel") !== root)
    throw new Error("fixture root mismatch");
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write("docs/control/front-page.json", JSON.stringify(control));
  write(
    "docs/work-orders/WO-999-probe.md",
    "# WO-999 — Probe\n\n**Track:** machinery\n" +
      (declare ? "**Front page:** README.md\n" : "") +
      "**Objective:** Test the guard.\n",
  );
  write("README.md", original);
  git("add", "-A");
  git("commit", "-qm", "fixture baseline");
  git("checkout", "-qb", "wo-999");
  return { root, write, git };
}
function probe(name, declare, edit, extra = () => {}) {
  const f = fixture(declare);
  try {
    f.write("README.md", edit(original));
    extra(f);
    const result = frontPageFindings(f.root);
    runs.push({ name, declares: declare, ...result });
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
}
const lines = Array.from(
  { length: 12 },
  (_, index) => `Extra capability ${index + 1} runs.`,
).join("\n");
probe("unchanged authorized baseline", true, (text) => text);
probe("unchanged undeclared baseline", false, (text) => text);
probe(
  "undeclared prose addition",
  false,
  (text) => text + "\nAnother capability runs.\n",
);
probe(
  "declared prose addition outside What runs today",
  true,
  (text) => text + "\nAnother capability runs.\n",
);
probe("generated version change only", false, (text) =>
  text.replace("v0.73.2", "v0.73.3"),
);
probe("in-marker over-budget section", true, (text) =>
  text.replace(
    control.whatRunsToday.end,
    lines + "\n" + control.whatRunsToday.end,
  ),
);
probe(
  "twelve sentences directly below end marker within same heading",
  true,
  (text) =>
    text.replace(
      control.whatRunsToday.end,
      control.whatRunsToday.end + "\n\n" + lines,
    ),
);
probe("twelve sentences directly above start marker", true, (text) =>
  text.replace(
    control.whatRunsToday.start,
    lines + "\n\n" + control.whatRunsToday.start,
  ),
);
probe(
  "marker pair moved before What runs today heading with uncounted section",
  true,
  (text) => {
    const start = text.indexOf(control.whatRunsToday.start),
      end =
        text.indexOf(control.whatRunsToday.end) +
        control.whatRunsToday.end.length;
    const block = text.slice(start, end);
    const remainder = text.slice(0, start) + lines + text.slice(end);
    return remainder.replace(
      "## What runs today",
      block + "\n\n## What runs today",
    );
  },
);
probe(
  "thirteen sentences on one physical line with lowercase starts",
  true,
  (text) =>
    text.replace(
      text
        .slice(
          text.indexOf(control.whatRunsToday.start) +
            control.whatRunsToday.start.length +
            1,
        )
        .split("\n")[0],
      "One capability runs. " +
        Array.from({ length: 12 }, () => "another capability runs.").join(" "),
    ),
);
probe("missing end marker", true, (text) =>
  text.replace(control.whatRunsToday.end, ""),
);
probe(
  "branch-added permission",
  false,
  (text) => text + "\nAnother capability runs.\n",
  (f) =>
    f.write(
      "docs/work-orders/WO-999-probe.md",
      "# WO-999 — Probe\n\n**Track:** machinery\n**Front page:** README.md\n**Objective:** Test the guard.\n",
    ),
);
probe(
  "deleted control record",
  false,
  (text) => text + "\nAnother capability runs.\n",
  (f) => rmSync(join(f.root, "docs/control/front-page.json")),
);
const full = fixture(true);
try {
  const simple =
    "# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `v0.73.2`.\n<!-- DOTLN-RELEASE-END -->\n\n" +
    control.whatRunsToday.start +
    "\nOne capability runs.\n" +
    control.whatRunsToday.end +
    "\n\n## Next\n\nMore information.\n";
  full.write("README.md", simple);
  full.git("add", "-A");
  full.git("commit", "-qm", "minimal baseline");
  full.git("branch", "-f", "main", "HEAD");
  full.write("docs/product/00-probe.md", "# Product\n\nA stable fact.\n");
  const ceilings = {
    schemaVersion: 1,
    documents: {
      "00-probe.md": {
        ceiling: 1000,
        nonExemptBytesAtLanding: 1000,
        date: "2026-10-10",
        decision: "fixture",
      },
    },
  };
  const baseline = {
    schemaVersion: 1,
    products: {},
    dispatches: {},
    links: [],
  };
  const check = () => checkDocs(full.root, { ceilings, baseline });
  runs.push({ name: "full checkDocs unchanged minimal baseline", ...check() });
  full.write(
    "README.md",
    simple.replace(
      control.whatRunsToday.end,
      control.whatRunsToday.end + "\n\n" + lines,
    ),
  );
  const after = check();
  runs.push({
    name: "full checkDocs twelve sentences below end marker before next heading",
    failures: after.failures,
    notices: after.notices,
  });
} finally {
  rmSync(full.root, { recursive: true, force: true });
}
const missed = runs
  .filter(
    (row) =>
      [
        "twelve sentences directly below end marker within same heading",
        "marker pair moved before What runs today heading with uncounted section",
        "thirteen sentences on one physical line with lowercase starts",
        "full checkDocs twelve sentences below end marker before next heading",
      ].includes(row.name) && !row.failures.length,
  )
  .map((row) => row.name);
console.log(
  JSON.stringify(
    {
      cutoff: new Date().toISOString(),
      missedRefusals: missed,
      subject:
        "WO-189 current README and front-page record; synthetic main/wo-999 order",
      runs,
    },
    null,
    2,
  ),
);
if (missed.length) process.exitCode = 1;
