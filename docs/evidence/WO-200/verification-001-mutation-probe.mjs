// Verifier mutation probe for WO-200: each mutation is applied to the scratch
// clone, the targeted tests run, and the clone is restored from its commit.
import { readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";
const C = process.argv[2];
process.chdir(C);
const read = (p) => readFileSync(p, "utf8");
const write = (p, s) => writeFileSync(p, s);
const edit = (p, from, to) => {
  const s = read(p);
  if (!s.includes(from))
    throw new Error(`probe anchor missing in ${p}: ${from}`);
  write(p, s.replace(from, to));
};
const tests = {
  schemaAnchor: [
    "corpus/harness/wo107-schema.test.mjs",
    "hashed collector files are exactly",
  ],
  classification: [
    "corpus/harness/wo107-schema.test.mjs",
    "classification exception",
  ],
  commentPrettier: ["scripts/test-comment-labels.mjs", "WO-200 every path"],
  commentFixture: ["scripts/test-comment-labels.mjs", "WO-200 a file whose"],
};
const run = (key) => {
  const [file, pattern] = tests[key];
  const r = spawnSync(
    process.execPath,
    ["--test", `--test-name-pattern=${pattern}`, file],
    { encoding: "utf8" },
  );
  const pass = /^ℹ pass (\d+)/mu.exec(r.stdout)?.[1];
  const fail = /^ℹ fail (\d+)/mu.exec(r.stdout)?.[1];
  const msg = (
    /^\s+(?:error|message): '?(.*?)'?$/mu.exec(r.stdout)?.[1] ??
    /AssertionError[^\n]*/u.exec(r.stdout)?.[0] ??
    ""
  ).slice(0, 140);
  return `${key}: exit ${r.status} pass ${pass} fail ${fail}${r.status ? ` — ${msg}` : ""}`;
};
const restore = (added = []) => {
  if (added.length) execFileSync("git", ["reset", "-q", "--", ...added]);
  execFileSync("git", ["checkout", "--", "."]);
  for (const f of added) rmSync(f, { force: true });
  const dirty = execFileSync("git", ["status", "--porcelain"], {
    encoding: "utf8",
  });
  if (dirty.trim()) throw new Error(`clone not restored: ${dirty}`);
};
const NAMES = `    "profile.mjs",\n    "wo107-records.mjs",\n    "wo107-scenarios.mjs",\n    "wo107-bounded.mjs",\n  ]`;
const HASH = `      "profile.mjs",\n      "wo107-records.mjs",\n      "wo107-scenarios.mjs",\n      "wo107-bounded.mjs",\n    ]`;
const mutations = [
  [
    "M0 baseline (no mutation)",
    () => [],
    ["schemaAnchor", "classification", "commentPrettier", "commentFixture"],
  ],
  [
    "M1 drop the wo107-bounded attribute row",
    () => (
      edit(
        ".gitattributes",
        "/corpus/harness/wo107-bounded.mjs dotln-pinned-bytes\n",
        "",
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M2 drop the wo107-records prettierignore line",
    () => (
      edit(".prettierignore", "corpus/harness/wo107-records.mjs\n", ""),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M3 drop wo107-scenarios from machinerySources",
    () => (
      edit(
        "scripts/test-runner.mjs",
        `    "corpus/harness/wo107-scenarios.mjs",\n    "corpus/harness/wo107-bounded.mjs",\n  ],\n  "fixture-temp-root"`,
        `    "corpus/harness/wo107-bounded.mjs",\n  ],\n  "fixture-temp-root"`,
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M4 add a fifth hashed file in both literals, no other list follows",
    () => {
      copyFileSync(
        "corpus/harness/wo107-bounded.mjs",
        "corpus/harness/wo107-extra.mjs",
      );
      execFileSync("git", ["add", "-N", "corpus/harness/wo107-extra.mjs"]);
      edit(
        "corpus/harness/profile.mjs",
        NAMES,
        NAMES.replace(
          `"wo107-bounded.mjs",\n  ]`,
          `"wo107-bounded.mjs",\n    "wo107-extra.mjs",\n  ]`,
        ),
      );
      edit(
        "corpus/harness/profile.mjs",
        HASH,
        HASH.replace(
          `"wo107-bounded.mjs",\n    ]`,
          `"wo107-bounded.mjs",\n      "wo107-extra.mjs",\n    ]`,
        ),
      );
      return ["corpus/harness/wo107-extra.mjs"];
    },
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M4b fifth hashed file with attribute, ignore line and machinery source all following",
    () => {
      copyFileSync(
        "corpus/harness/wo107-bounded.mjs",
        "corpus/harness/wo107-extra.mjs",
      );
      execFileSync("git", ["add", "-N", "corpus/harness/wo107-extra.mjs"]);
      edit(
        "corpus/harness/profile.mjs",
        NAMES,
        NAMES.replace(
          `"wo107-bounded.mjs",\n  ]`,
          `"wo107-bounded.mjs",\n    "wo107-extra.mjs",\n  ]`,
        ),
      );
      edit(
        "corpus/harness/profile.mjs",
        HASH,
        HASH.replace(
          `"wo107-bounded.mjs",\n    ]`,
          `"wo107-bounded.mjs",\n      "wo107-extra.mjs",\n    ]`,
        ),
      );
      edit(
        ".gitattributes",
        "/corpus/harness/wo107-bounded.mjs dotln-pinned-bytes\n",
        "/corpus/harness/wo107-bounded.mjs dotln-pinned-bytes\n/corpus/harness/wo107-extra.mjs dotln-pinned-bytes\n",
      );
      edit(
        ".prettierignore",
        "corpus/harness/wo107-bounded.mjs\n",
        "corpus/harness/wo107-bounded.mjs\ncorpus/harness/wo107-extra.mjs\n",
      );
      edit(
        "scripts/test-runner.mjs",
        `    "corpus/harness/wo107-bounded.mjs",\n  ],\n  "fixture-temp-root"`,
        `    "corpus/harness/wo107-bounded.mjs",\n    "corpus/harness/wo107-extra.mjs",\n  ],\n  "fixture-temp-root"`,
      );
      return ["corpus/harness/wo107-extra.mjs"];
    },
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M5 attribute an unrelated corpus file",
    () => (
      edit(
        ".gitattributes",
        "/corpus/harness/wo107-bounded.mjs dotln-pinned-bytes\n",
        "/corpus/harness/wo107-bounded.mjs dotln-pinned-bytes\n/corpus/harness/wo107-schema.test.mjs dotln-pinned-bytes\n",
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M6 reorder lineage names only (live hash literal unchanged)",
    () => (
      edit(
        "corpus/harness/profile.mjs",
        NAMES,
        `    "wo107-records.mjs",\n    "profile.mjs",\n    "wo107-scenarios.mjs",\n    "wo107-bounded.mjs",\n  ]`,
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M7 remove wo107-bounded from both literals",
    () => {
      edit(
        "corpus/harness/profile.mjs",
        NAMES,
        NAMES.replace(`    "wo107-bounded.mjs",\n  ]`, `  ]`),
      );
      edit(
        "corpus/harness/profile.mjs",
        HASH,
        HASH.replace(`      "wo107-bounded.mjs",\n    ]`, `    ]`),
      );
      return [];
    },
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M8 delete WO-107's live classification declaration",
    () => {
      const p = "packages/kernel/test/fixtures/jsonl-protocols.json";
      const j = JSON.parse(read(p));
      delete j.nonEventPaths[
        "corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl"
      ];
      write(p, JSON.stringify(j, null, 2) + "\n");
      return [];
    },
    ["classification"],
  ],
  [
    "M8b change WO-107's live classification declaration text",
    () => {
      const p = "packages/kernel/test/fixtures/jsonl-protocols.json";
      const j = JSON.parse(read(p));
      const k =
        "corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl";
      if (!j.nonEventPaths[k])
        throw new Error("probe anchor missing: live declaration");
      j.nonEventPaths[k] += " (edited)";
      write(p, JSON.stringify(j, null, 2) + "\n");
      return [];
    },
    ["classification"],
  ],
  [
    "M8c add another unrelated live declaration (sibling registration)",
    () => {
      const p = "packages/kernel/test/fixtures/jsonl-protocols.json";
      const j = JSON.parse(read(p));
      j.nonEventPaths["corpus/another-sibling.jsonl"] = "sibling registration";
      write(p, JSON.stringify(j, null, 2) + "\n");
      return [];
    },
    ["classification"],
  ],
  [
    "M9 replace three ignore lines with an equivalent glob",
    () => (
      edit(
        ".prettierignore",
        "corpus/harness/wo107-records.mjs\ncorpus/harness/wo107-scenarios.mjs\ncorpus/harness/wo107-bounded.mjs\n",
        "corpus/harness/wo107-*.mjs\n",
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
  [
    "M10 set the attribute through a directory pattern covering the schema test too",
    () => (
      edit(
        ".gitattributes",
        "/corpus/harness/profile.mjs dotln-pinned-bytes\n",
        "/corpus/harness/profile.mjs dotln-pinned-bytes\n/corpus/harness/*.test.mjs dotln-pinned-bytes\n",
      ),
      []
    ),
    ["schemaAnchor", "commentPrettier"],
  ],
];
for (const [label, apply, keys] of mutations) {
  let added = [];
  try {
    added = apply();
    console.log(`== ${label}`);
    for (const key of keys) console.log(`   ${run(key)}`);
  } finally {
    restore(added);
  }
}
