import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "./lib/temporary-roots.mjs";
import { write, json } from "./lib/helpers.mjs";
import { loadConfig, docPath, TOOL_ROOT } from "./lib/config.mjs";
import {
  featureRegistry,
  readFeatures,
  readFeatureInventory,
  readHostFeatures,
  resolveFeatureId,
  renderInstanceSecrets,
} from "./lib/features.mjs";
import {
  featureAdvisories,
  renderFeatures,
  renderRules,
  renderStops,
  writeFeatures,
  featuresMain,
} from "./features.mjs";
import { readStopInventory } from "./lib/features.mjs";
import { readRuleInventory } from "./lib/rule-inventory.mjs";
import { overlayRuleSelection, readBuildOverlay } from "./lib/harness.mjs";
import { contributorRules } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { STOPS, stopSettable } from "../packages/skeleton/src/stops.mjs";

const fixture = (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-features-")),
  );
  t.after(() => removeTemporaryPath(root, { recursive: true, force: true }));
  return root;
};
const config = (root, value = {}) =>
  write(root, "dotln.config.json", json({ version: 1, ...value }));
const named = featureRegistry.filter((entry) =>
  entry.readFrom.startsWith("features."),
);

test("features preserve absent configuration and validate every named election", (t) => {
  const root = fixture(t);
  const absent = loadConfig(root);
  const defaults = Object.fromEntries(
    named.map((entry) => [entry.id, entry.default]),
  );
  assert.deepEqual(readFeatures(root), defaults);
  config(root);
  const declared = loadConfig(root);
  assert.deepEqual(
    { ...declared, present: absent.present, path: absent.path },
    absent,
  );
  assert.deepEqual(readFeatures(root), defaults);
  for (const { id } of named) {
    for (const value of [
      true,
      false,
      { on: false, note: "An instance reason" },
    ]) {
      config(root, { features: { [id]: value } });
      assert.equal(
        readFeatures(root)[id],
        typeof value === "boolean" ? value : value.on,
      );
    }
    for (const [value, key] of [
      [{ on: "false" }, ".on"],
      [{ on: false, note: 42 }, ".note"],
      [{ on: true, extra: true }, "extra"],
    ]) {
      config(root, { features: { [id]: value } });
      assert.throws(
        () => loadConfig(root),
        (error) => error.message.includes(id) && error.message.includes(key),
      );
    }
  }
  config(root, { features: { "misspelled-feature": true } });
  assert.throws(
    () => loadConfig(root),
    /misspelled-feature.*known ids:.*npm run features -- list/u,
  );
  for (const entry of featureRegistry.filter(
    (entry) => !entry.readFrom.startsWith("features."),
  )) {
    config(root, { features: { [entry.id]: false } });
    assert.throws(
      () => loadConfig(root),
      (error) => error.message.includes(entry.readFrom),
    );
  }
});

test("a feature rename is advisory for its named kit release and refuses afterward", () => {
  const messages = [];
  const aliases = {
    "old-economy": { successor: "tinkerer-economy", release: "0.79.0" },
  };
  assert.equal(
    resolveFeatureId("old-economy", {
      aliases,
      release: "0.79.0",
      advisory: (message) => messages.push(message),
    }),
    "tinkerer-economy",
  );
  assert.match(
    messages.join("\n"),
    /old-economy.*tinkerer-economy.*next kit release/u,
  );
  assert.throws(
    () => resolveFeatureId("old-economy", { aliases, release: "0.80.0" }),
    /retired feature.*features.tinkerer-economy/u,
  );
});

test("feature inventory reports elections, budgets, unread switches and escaped notes, and refuses the retired overlay choice", (t) => {
  const root = fixture(t);
  config(root, {
    roots: { control: "records/control" },
    features: {
      "plan-first": { on: false, note: "A | table\n<script>`note`" },
      "tinkerer-economy": { on: false, note: "Off for this instance." },
    },
    release: { corpus: false },
  });
  write(
    root,
    "records/control/budgets.json",
    json({ subagentCap: 5, retention: { "worker-capture": null } }),
  );
  const rows = readFeatureInventory(root);
  const row = (id) => rows.find((entry) => entry.id === id);
  assert.equal(row("tinkerer-economy").value, false);
  assert.equal(row("tinkerer-economy").source, "dotln.config.json");
  assert.equal(row("tinkerer-economy").note, "Off for this instance.");
  assert.equal(readFeatures(root)["tinkerer-economy"], false);
  // The cap is read from the configured control root's budgets, as the spawn
  // guard reads it (WO-254, FUP-a0efaae1b9887fde); the ceiling is four times it.
  assert.equal(row("subagent-cap").source, "records/control/budgets.json");
  assert.equal(row("subagent-cap").value, 5);
  assert.equal(row("driven-session-ceiling").value, 20);
  assert.equal(row("retention").value["worker-capture"], null);
  assert.equal(row("retention").value["session-scratch"], 24);
  assert.equal(row("release-corpus").value, false);
  assert.equal(row("release-corpus").readBy, "unread");
  assert.equal(row("release-corpus").source, "dotln.config.json");
  const rendered = renderFeatures(root);
  assert.match(rendered, /A &#124; table<br>&lt;script&gt;&#96;note&#96;/u);
  // One row for each feature, in the page's first table; the rules and the
  // stops follow under their own headings.
  assert.ok(
    rendered.indexOf("\n## Rules\n") > 0 &&
      rendered.indexOf("\n## Rules\n") < rendered.indexOf("\n## Stops\n"),
  );
  assert.equal(
    rendered
      .slice(0, rendered.indexOf("\n## Rules\n"))
      .split("\n")
      .filter((line) => /^\| [a-z]/u.test(line)).length,
    featureRegistry.length,
  );
  // The overlay's tinkerer-economy choice was accepted with an advisory
  // through kit release v0.118.0; the elections and the inventory refuse it
  // now, naming the election and the entry to remove (FUP-3d64b267a45d2f34).
  config(root, {
    features: { "tinkerer-economy": true },
    build: { overlay: "build/options.json" },
  });
  write(
    root,
    "build/options.json",
    json({ version: 1, unequip: ["tinkerer-economy"] }),
  );
  const retired =
    /the build overlay's tinkerer-economy choice is retired: it was accepted with an advisory through kit release v0\.118\.0; elect features\.tinkerer-economy in dotln\.config\.json and remove the overlay entry \(npm run features -- list\)$/u;
  assert.throws(() => readFeatures(root), retired);
  assert.throws(() => readFeatureInventory(root), retired);
  write(
    root,
    "build/options.json",
    json({ version: 1, equip: ["tinkerer-economy"] }),
  );
  assert.throws(() => readFeatures(root), retired);
  write(
    root,
    "build/options.json",
    json({ version: 1, unequip: ["process-cost"] }),
  );
  assert.equal(readFeatures(root)["tinkerer-economy"], true);
  assert.equal(row("tinkerer-economy").value, false);
});

test("host rows are elections inferred on from the instance's own committed record (WO-258)", (t) => {
  const root = fixture(t);
  config(root, { roots: { control: "records/control" } });
  const row = (id) =>
    readFeatureInventory(root).find((entry) => entry.id === id);
  const attestation = (harness) =>
    JSON.stringify({
      schemaVersion: 1,
      type: "ImplementationReady",
      workOrderId: "WO-001",
      actor: {
        harness,
        harnessVersion: "fixture",
        model: "fixture",
        effort: "max",
        source: "operator-attested",
      },
    }) + "\n";
  // No election and no record: Claude only.
  assert.equal(readFeatures(root)["host-codex"], false);
  assert.equal(readFeatures(root)["host-copilot"], false);
  assert.deepEqual(readHostFeatures(root), {
    "host-codex": false,
    "host-copilot": false,
  });
  assert.equal(row("host-codex").source, "default");
  // An undeclared host row is read only when asked for, so the hot-path
  // elections never scan the control log.
  assert.equal(
    typeof Object.getOwnPropertyDescriptor(readFeatures(root), "host-codex")
      .get,
    "function",
  );
  // A row naming the harness outside an attestation is not one.
  write(
    root,
    "records/control/orders/WO-001.jsonl",
    JSON.stringify({ type: "Note", evidence: { harness: "codex-cli" } }) + "\n",
  );
  assert.equal(readFeatures(root)["host-codex"], false);
  // An attestation in an order segment, under the configured roots, turns
  // the host on, and the inventory names the record's rows.
  write(
    root,
    "records/control/orders/WO-002.jsonl",
    attestation("claude-code") + attestation("codex-cli"),
  );
  write(root, "records/control/resume.jsonl", attestation("codex-cli"));
  assert.equal(readFeatures(root)["host-codex"], true);
  assert.equal(readFeatures(root)["host-copilot"], false);
  assert.equal(row("host-codex").value, true);
  assert.equal(
    row("host-codex").source,
    "inferred: records/control/resume.jsonl attestations; records/control/orders/ attestations",
  );
  assert.deepEqual(row("host-codex").record.attestations, {
    "records/control/resume.jsonl": 1,
    "records/control/orders/": 1,
  });
  // The discovery record's observed version turns no host on (WO-275): an
  // inspection that found a CLI is not the operator using it. The inventory
  // names the record as showing the host without an election.
  const discovery = (classification, harnesses = ["copilot-cli"]) =>
    write(
      root,
      "docs/discovery/environment.json",
      json({
        effortReadbackProbe: {
          harnesses: Object.fromEntries(
            harnesses.map((harness) => [
              harness,
              { versions: [{ classification, value: "1.0.86" }] },
            ]),
          ),
        },
      }),
    );
  discovery("untested");
  assert.equal(readFeatures(root)["host-copilot"], false);
  assert.equal(row("host-copilot").source, "default");
  discovery("observed", ["codex-cli", "copilot-cli"]);
  assert.equal(readFeatures(root)["host-copilot"], false);
  assert.deepEqual(readHostFeatures(root), {
    "host-codex": true,
    "host-copilot": false,
  });
  assert.equal(row("host-copilot").value, false);
  assert.equal(
    row("host-copilot").source,
    "default (docs/discovery/environment.json observed versions show the host without an election; a discovery record turns no host on)",
  );
  assert.equal(row("host-copilot").record.observedVersions, true);
  // An attested host stays inferred from its attestations alone, as before.
  assert.equal(
    row("host-codex").source,
    "inferred: records/control/resume.jsonl attestations; records/control/orders/ attestations",
  );
  // A malformed record shows nothing rather than failing the reader.
  write(root, "docs/discovery/environment.json", "not JSON");
  assert.equal(readFeatures(root)["host-copilot"], false);
  assert.equal(row("host-copilot").source, "default");
  // An election of false beside a record that shows the host is respected,
  // and the inventory says what the record shows; an election of true needs
  // no record.
  config(root, {
    roots: { control: "records/control" },
    features: {
      "host-codex": false,
      "host-copilot": { on: true, note: "Elected by hand." },
    },
  });
  assert.equal(readFeatures(root)["host-codex"], false);
  assert.equal(readFeatures(root)["host-copilot"], true);
  assert.deepEqual(readHostFeatures(root), {
    "host-codex": false,
    "host-copilot": true,
  });
  assert.equal(
    row("host-codex").source,
    "elected (the record shows the host: records/control/resume.jsonl attestations; records/control/orders/ attestations)",
  );
  assert.equal(row("host-copilot").source, "elected");
  assert.match(
    renderFeatures(root),
    /^\| host-codex \| instance \| false \| false \| elected \(the record shows the host: records\/control\/resume\.jsonl attestations; records\/control\/orders\/ attestations\) \|/mu,
  );
  // The auto-update-upstream election is an ordinary election, off by default.
  assert.equal(readFeatures(root)["auto-update-upstream"], false);
});

test("features render/check obey configured roots and distinguish built from queued consumers", (t) => {
  const root = fixture(t);
  config(root, { roots: { docs: "records" } });
  write(root, "CLAUDE.md", "DotLn has 8 refusals.\n");
  assert.throws(
    () => writeFeatures(root, { check: true }),
    /stale records\/control\/FEATURES.md/u,
  );
  const file = writeFeatures(root);
  assert.equal(file, docPath(root, "control", "FEATURES.md"));
  writeFeatures(root, { check: true });
  // The page lists the stops with their levels in place of a list of what
  // cannot be chosen, and reads no count from the instruction file.
  assert.doesNotMatch(
    readFileSync(file, "utf8"),
    /Not electable|in the installed contract|These are the floor/u,
  );
  assert.match(readFileSync(file, "utf8"), /^## Stops$/mu);
  config(root, {
    roots: { docs: "records" },
    features: { "plan-first": true },
  });
  assert.throws(() => writeFeatures(root, { check: true }), /stale/u);
  writeFeatures(root);
  // The closed consumer is a planning notice, not a gate on this unrelated order.
  const closed =
    [
      {
        type: "WorkOrderActivated",
        workOrderPath: "records/work-orders/WO-999-fixture.md",
      },
      { type: "FinalReviewCompleted", verdict: "pass" },
    ]
      .map((event) =>
        JSON.stringify({ schemaVersion: 1, workOrderId: "WO-999", ...event }),
      )
      .join("\n") + "\n";
  write(root, "records/control/orders/WO-999.jsonl", closed);
  const queued = readFeatureInventory(root).map((entry) =>
    entry.id === "plan-first" ? { ...entry, readBy: "WO-999" } : entry,
  );
  assert.match(
    featureAdvisories(root, queued).join("\n"),
    /plan-first.*WO-999 has closed.*next planning pass/u,
  );
  assert.deepEqual(featureAdvisories(root), []);
  const warnings = [];
  const log = console.log,
    warn = console.warn;
  console.log = () => {};
  console.warn = (message) => warnings.push(message);
  try {
    featuresMain(["check"], root);
  } finally {
    console.log = log;
    console.warn = warn;
  }
  assert.equal(warnings.length, 0);
  writeFileSync(file, "stale\n");
  assert.throws(() => writeFeatures(root, { check: true }), /stale/u);
});

test("legacy feature overlays share schema and regular-file validation", (t) => {
  const root = fixture(t);
  config(root, { build: { overlay: "build/options.json" } });
  for (const [value, diagnostic] of [
    [{ version: 1, unequip: "tinkerer-economy" }, /unequip must be an array/u],
    [
      {
        version: 1,
        equip: ["tinkerer-economy"],
        unequip: ["tinkerer-economy"],
      },
      /must not name the same id: tinkerer-economy/u,
    ],
    [{ version: 1, extra: true }, /unknown key overlay.extra/u],
    [{ version: 2 }, /version must be 1/u],
  ]) {
    write(root, "build/options.json", json(value));
    assert.throws(() => readFeatures(root), diagnostic);
  }
  write(root, "build/options.json", "not JSON");
  assert.throws(
    () => readFeatures(root),
    /invalid build overlay in build\/options.json: root must be JSON/u,
  );
  config(root, { build: { overlay: "build/missing.json" } });
  assert.throws(
    () => readFeatures(root),
    /invalid build overlay in build\/missing.json:.*regular file/u,
  );
  write(
    root,
    "build/options.json",
    json({ version: 1, unequip: ["tinkerer-economy"] }),
  );
  symlinkSync("options.json", join(root, "build/link.json"));
  config(root, { build: { overlay: "build/link.json" } });
  assert.throws(
    () => readFeatures(root),
    /invalid build overlay in build\/link.json:.*regular file/u,
  );
});

test("private-destination preserves customized Secrets sections and refuses to rewrite them", () => {
  const template = readFileSync(
    join(TOOL_ROOT, "scripts/kit/CLAUDE.template.md"),
    "utf8",
  );
  const ordinary = template.match(/## Secrets\n\n([\s\S]*?)(?=\n\n## )/u)[1];
  const elected = renderInstanceSecrets(template, template, true);
  const privateSecrets = elected.match(
    /## Secrets\n\n([\s\S]*?)(?=\n\n## )/u,
  )[1];
  assert.equal(renderInstanceSecrets(elected, template, false), template);
  for (const [floor, known] of [
    [template, ordinary],
    [elected, privateSecrets],
  ]) {
    for (const modified of [
      floor.replace(known, known + " Keep the owner's additional rule."),
      floor.replace(known, "Keep the owner's additional rule. " + known),
      floor.replace(
        known,
        known + "\n\nAn additional paragraph belongs to this section.",
      ),
    ]) {
      assert.equal(renderInstanceSecrets(modified, template, false), modified);
      assert.throws(
        () => renderInstanceSecrets(modified, template, true),
        /custom floor/u,
      );
    }
  }
  assert.throws(
    () => renderInstanceSecrets("## Other\n\n" + ordinary, template, true),
    /custom floor/u,
  );
});

test("WO-287 criterion A8: the features list prints one row for each stop with its id, class, what it protects, its level in this root, who set it and the line or file that changes it, lists a lifecycle command's refusal with its way forward, and prints no Not electable list", (t) => {
  const root = fixture(t);
  const cells = (line) =>
    line
      .slice(2, -2)
      .split(" | ")
      .map((value) => value.replaceAll("&#124;", "|"));
  // The two tables under the Stops heading, each row by its first cell.
  const tables = (page) => {
    const section = page.slice(page.indexOf("\n## Stops\n"));
    const [levelled, commands] = section.split(
      "\n### What a lifecycle command declines\n",
    );
    const rows = (text) =>
      new Map(
        text
          .split("\n")
          .filter((line) => /^\| [a-z]/u.test(line))
          .map((line) => [cells(line)[0], cells(line)]),
      );
    return { levelled: rows(levelled), commands: rows(commands) };
  };
  const listed = () => {
    const lines = [];
    const log = console.log;
    console.log = (line) => lines.push(String(line));
    try {
      featuresMain(["list"], root);
    } finally {
      console.log = log;
    }
    return lines.join("\n");
  };
  const settable = STOPS.filter(stopSettable);
  const commandRows = STOPS.filter((row) => row.forward !== undefined);
  const judge = (instance, declared = {}) => {
    const page = listed();
    assert.equal(page, renderFeatures(root));
    assert.doesNotMatch(page, /Not electable|cannot turn them off/u);
    assert.ok(
      page.includes(
        instance
          ? "This root is an exported instance: where no line of its own says otherwise, a work stop refuses and every other stop advises."
          : "This root is core, which builds the kit: where no line of its own says otherwise, every stop refuses.",
      ),
    );
    assert.ok(
      page.includes(
        "A session changes one only when its owner asks for it in that session.",
      ),
    );
    const { levelled, commands } = tables(page);
    // One row for each stop of the table, and no other.
    assert.deepEqual(
      [...levelled.keys(), ...commands.keys()],
      STOPS.map((row) => row.id),
    );
    for (const row of settable) {
      const level =
        declared[row.id] ??
        (instance && row.class !== "work" ? "advise" : "refuse");
      assert.deepEqual(
        levelled.get(row.id),
        [
          row.id,
          row.class,
          row.protects,
          row.where,
          level,
          declared[row.id] ? "dotln.config.json" : "the kit",
          `"stops": { "${row.id}": "${level === "refuse" ? "advise" : "refuse"}" }`,
        ],
        row.id,
      );
    }
    // A stop set elsewhere names its switch or its file in place of a line.
    assert.deepEqual(levelled.get("desktop-control").slice(4), [
      "by its own switch",
      "features.desktop-control",
      "features.desktop-control",
    ]);
    assert.deepEqual(levelled.get("private-terms").slice(4), [
      "in its own file",
      "records/control/local/terms.txt",
      "records/control/local/terms.txt",
    ]);
    assert.deepEqual(levelled.get("time-limits").slice(4), [
      "in its own file",
      "records/control/time-limits.json",
      "records/control/time-limits.json",
    ]);
    // A lifecycle command's refusal is listed with its way forward.
    for (const row of commandRows)
      assert.deepEqual(
        commands.get(row.id),
        [row.id, row.class, row.protects, row.where, row.forward],
        row.id,
      );
    assert.ok(commandRows.length > 15);
    // The same rows as data, and the section printed without the features.
    assert.deepEqual(
      readStopInventory(root).map((row) => row.id),
      STOPS.map((row) => row.id),
    );
    assert.ok(page.endsWith(renderStops(root)));
  };
  // Core's root, with its documents under another root.
  config(root, { roots: { docs: "records" } });
  judge(false);
  // The same root as an exported instance, then with lines of its own.
  write(root, "KIT-MANIFEST.json", "{}\n");
  judge(true);
  const declared = {
    "planning-branch": "refuse",
    "writer-reservation": "advise",
    "gate-format": "off",
  };
  config(root, { roots: { docs: "records" }, stops: declared });
  judge(true, declared);
  // A stop that had a switch before it had a level names the election that
  // sets it, where the root makes one and writes no line (criterion C1).
  const paraphrase = "verbatim-operator-words";
  const row = () => tables(listed()).levelled.get(paraphrase).slice(4);
  config(root, {
    roots: { docs: "records" },
    features: { [paraphrase]: false },
  });
  assert.deepEqual(row(), [
    "refuse",
    `features.${paraphrase}`,
    `"stops": { "${paraphrase}": "advise" }`,
  ]);
  config(root, {
    roots: { docs: "records" },
    features: { [paraphrase]: true },
    stops: { [paraphrase]: "off" },
  });
  assert.deepEqual(row(), [
    "off",
    "dotln.config.json",
    `"stops": { "${paraphrase}": "refuse" }`,
  ]);
});

// ---- WO-287, Part B: the rules of the features page and the overlay's lists

// A root's build overlay, selected by its configuration and written whole.
const overlayOf = (root, value, extra = {}, path = "build/overlay.json") => {
  config(root, { build: { overlay: path }, ...extra });
  write(root, path, json({ version: 1, ...value }));
};
const printed = (root, args) => {
  const lines = [];
  const log = console.log;
  console.log = (line) => lines.push(String(line));
  try {
    featuresMain(args, root);
  } finally {
    console.log = log;
  }
  return lines.join("\n");
};
const warned = (run) => {
  const lines = [];
  const warn = console.warn;
  console.warn = (line) => lines.push(String(line));
  try {
    run();
  } finally {
    console.warn = warn;
  }
  return lines;
};
const tableRows = (section) =>
  new Map(
    section
      .split("\n")
      .filter((line) => /^\| [a-z]/u.test(line))
      .map((line) =>
        line
          .slice(2, -2)
          .split(" | ")
          .map((value) =>
            value.replaceAll("&#124;", "|").replaceAll("&#96;", "`"),
          ),
      )
      .map((cells) => [cells[0], cells]),
  );
const ruleRows = (page) =>
  tableRows(
    page.slice(
      page.indexOf("## Rules\n"),
      page.includes("\n## Stops\n") ? page.indexOf("\n## Stops\n") : undefined,
    ),
  );
const authorIds = contributorRules
  .filter((rule) => rule.layer === "author")
  .map((rule) => rule.id);

test("WO-287 criterion B1: the features list prints one row for each feedback unit and each shared role rule with its id, its layer, how it is enforced, whether this root equips it and the overlay line that changes it", (t) => {
  const root = fixture(t);
  // What each row says, from the rule's own record and what this root's
  // overlay does with it.
  const judge = (state) => {
    const page = printed(root, ["list"]);
    assert.equal(page, renderFeatures(root));
    // The floor is no row and no line: nothing here says it cannot be chosen.
    assert.doesNotMatch(page, /not electable|cannot be chosen|locked floor/iu);
    const rows = ruleRows(page);
    assert.deepEqual(
      [...rows.keys()],
      contributorRules.map((rule) => rule.id),
    );
    for (const rule of contributorRules) {
      const { equipped, source, line } = state(rule);
      assert.deepEqual(
        rows.get(rule.id),
        [
          rule.id,
          rule.kind === "unit" ? "feedback unit" : "shared rule",
          rule.layer,
          `${rule.enforcement}${rule.stop ? `; its refusal is the stop ${rule.stop}` : ""}`,
          equipped ? "yes" : "no",
          source,
          line,
        ],
        rule.id,
      );
    }
    // The same rows as data, and the table printed without the rest.
    assert.deepEqual(
      JSON.parse(printed(root, ["rules", "--json"])),
      readRuleInventory(root),
    );
    assert.equal(printed(root, ["rules"]), renderRules(root));
    assert.deepEqual(ruleRows(renderRules(root)), rows);
    return page;
  };
  const kept = (rule, already = []) =>
    rule.layer === "platform"
      ? {
          equipped: true,
          source: "the kit",
          line: "none: every build carries it",
        }
      : {
          equipped: true,
          source: "the kit",
          // The whole list the line leaves: what the root's overlay already
          // leaves out, and this rule.
          line: `"unequip": ${JSON.stringify([...already, rule.id]).replaceAll('","', '", "')}`,
        };

  // A root that selects no overlay equips every rule.
  judge(kept);
  // The table holds the ten units, all the author's, and every shared rule
  // with the layer its record gives it.
  assert.deepEqual(
    contributorRules
      .filter((rule) => rule.kind === "unit")
      .map((rule) => rule.layer),
    Array.from({ length: 10 }, () => "author"),
  );
  assert.ok(
    contributorRules.some(
      (rule) => rule.kind === "rule" && rule.layer === "platform",
    ),
  );
  assert.ok(
    contributorRules.some(
      (rule) => rule.kind === "rule" && rule.layer === "author",
    ),
  );
  const enforcement = (id) =>
    contributorRules.find((rule) => rule.id === id).enforcement;
  assert.equal(
    enforcement("anti-oscillation"),
    "a sentence in the role's text",
  );
  assert.equal(
    enforcement("verify-app-before-done"),
    "a sentence in the role's text and an advisory when a session stops",
  );
  assert.equal(
    enforcement("no-lint-type-disables-as-fixes"),
    "a sentence in the role's text and a hook on writes",
  );
  assert.equal(
    enforcement("concurrent-work-requires-worktrees"),
    "a sentence in the role's text and a hook on shell commands and writes",
  );
  assert.equal(
    enforcement("no-attribution"),
    "a sentence in the role's text, a hook on shell commands, the commit-message hook and the host's attribution setting",
  );
  assert.equal(enforcement("durations"), "a sentence in the role's text");

  // The layer left out by its name, and one rule kept beside it.
  overlayOf(root, { unequip: ["author"], equip: ["claims-evidence"] });
  judge((rule) =>
    rule.layer === "platform"
      ? kept(rule)
      : rule.id === "claims-evidence"
        ? {
            equipped: true,
            source: "build/overlay.json",
            // Its own line keeps it beside the layer's name: dropping that
            // line is what removes it. Naming it in `unequip` as well would
            // put one id in both lists, which refuses.
            line: `remove "claims-evidence" from "equip"`,
          }
        : {
            equipped: false,
            source: "build/overlay.json",
            // The whole list the line leaves, so that writing it keeps the
            // rule the list already holds.
            line: `"equip": ["claims-evidence", "${rule.id}"]`,
          },
  );

  // Single ids left out, one of them a unit that also refuses: its stop
  // reads off, set by the overlay, and a stops line for it has no effect.
  overlayOf(
    root,
    { unequip: ["durations", "no-attribution"] },
    { stops: { attribution: "advise" } },
  );
  const page = judge((rule) =>
    ["durations", "no-attribution"].includes(rule.id)
      ? {
          equipped: false,
          source: "build/overlay.json",
          line: `remove "${rule.id}" from "unequip"`,
        }
      : kept(rule, ["durations", "no-attribution"]),
  );
  const stops = tableRows(page.slice(page.indexOf("\n## Stops\n")));
  assert.deepEqual(stops.get("attribution").slice(4), [
    "off",
    "the build overlay, which leaves out the unit no-attribution; this root's stops line for it has no effect",
    `remove "no-attribution" from "unequip"`,
  ]);
  assert.deepEqual(stops.get("writer-reservation").slice(4), [
    "refuse",
    "the kit",
    `"stops": { "writer-reservation": "advise" }`,
  ]);

  // An overlay that selects no build equips nothing, and says how to
  // change that.
  overlayOf(root, { build: "none" }, { stops: { attribution: "advise" } });
  const none = judge(() => ({
    equipped: false,
    source: "build/overlay.json",
    line: `remove "build": "none" from build/overlay.json`,
  }));
  // It names no unit, so no stop is taken with one: each of the two unit
  // stops is printed at the level a registered target worktree's guards
  // answer at, the root's own line among them.
  const noneStops = tableRows(none.slice(none.indexOf("\n## Stops\n")));
  assert.deepEqual(noneStops.get("attribution").slice(4), [
    "advise",
    "dotln.config.json",
    `"stops": { "attribution": "refuse" }`,
  ]);
  assert.deepEqual(noneStops.get("writer-reservation").slice(4), [
    "refuse",
    "the kit",
    `"stops": { "writer-reservation": "advise" }`,
  ]);
  // The emit's reading of the same overlay: no unit left out.
  assert.deepEqual(overlayRuleSelection(readBuildOverlay(root)), {
    units: [],
    rules: [],
  });
});

test("WO-287 criterion B1: applying the overlay line a rule's row prints changes whether that rule is equipped and changes no other, whatever the overlay's two lists hold", (t) => {
  const root = fixture(t);
  const equipped = () =>
    new Map(readRuleInventory(root).map((row) => [row.id, row.equipped]));
  const row = (lists, id) => {
    overlayOf(root, lists);
    return readRuleInventory(root).find((entry) => entry.id === id);
  };
  // A printed line applied to the overlay's two lists by its own words: a
  // list set whole, an id removed from one, an id moved between them.
  const applyLine = (lists, line) => {
    const now = {
      equip: [...(lists.equip ?? [])],
      unequip: [...(lists.unequip ?? [])],
    };
    const whole = /^"(equip|unequip)": (\[.*\])$/u.exec(line);
    if (whole) return { ...now, [whole[1]]: JSON.parse(whole[2]) };
    const removed = /^remove "([^"]+)" from "(equip|unequip)"$/u.exec(line);
    if (removed)
      return {
        ...now,
        [removed[2]]: now[removed[2]].filter((id) => id !== removed[1]),
      };
    const moved =
      /^move "([^"]+)" from "(equip|unequip)" to "(equip|unequip)"$/u.exec(
        line,
      );
    if (moved)
      return {
        ...now,
        [moved[2]]: now[moved[2]].filter((id) => id !== moved[1]),
        [moved[3]]: [...now[moved[3]], moved[1]],
      };
    return assert.fail(`a line of no known form: ${line}`);
  };
  // The layer's name with and without single ids beside it, single ids
  // alone, a line that restores a rule nothing left out, and no lists.
  const overlays = [
    {},
    { unequip: ["author"] },
    { unequip: ["author"], equip: ["claims-evidence"] },
    { unequip: ["author", "durations"] },
    { unequip: ["author", "durations"], equip: ["no-attribution"] },
    { unequip: ["durations", "no-attribution"] },
    { equip: ["durations"] },
  ];
  for (const lists of overlays) {
    overlayOf(root, lists);
    const before = equipped();
    const rows = readRuleInventory(root).filter(
      (entry) => entry.layer === "author",
    );
    assert.deepEqual(
      rows.map((entry) => entry.id),
      authorIds,
    );
    for (const entry of rows) {
      // The line as it is printed, applied as an owner applies it, leaves
      // the two lists the row's change names.
      assert.deepEqual(
        applyLine(lists, entry.line),
        {
          equip: entry.change.equip ?? [],
          unequip: entry.change.unequip ?? [],
        },
        `${JSON.stringify(lists)}: ${entry.id}: ${entry.line}`,
      );
      // The lists as the row's change leaves them load, which an id in
      // both would not, and they flip this rule alone.
      overlayOf(root, { ...lists, ...entry.change });
      const after = equipped();
      for (const [id, was] of before)
        assert.equal(
          after.get(id),
          id === entry.id ? !was : was,
          `${JSON.stringify(lists)}: the line of ${entry.id} (${entry.line}) and ${id}`,
        );
      // Its own line then puts the rule back as it was.
      const back = readRuleInventory(root).find(
        (candidate) => candidate.id === entry.id,
      );
      overlayOf(root, { ...lists, ...back.change });
      assert.deepEqual([...equipped()], [...before], entry.id);
    }
    // A platform rule has no change to apply.
    assert.ok(
      readRuleInventory(root)
        .filter((entry) => entry.layer === "platform")
        .every((entry) => entry.change === undefined),
    );
  }
  // The words of each kind of line.
  const kept = { unequip: ["author"], equip: ["claims-evidence"] };
  assert.equal(
    row(kept, "claims-evidence").line,
    `remove "claims-evidence" from "equip"`,
  );
  // A line that sets a list prints the whole list, with what it held.
  assert.equal(
    row(kept, "durations").line,
    `"equip": ["claims-evidence", "durations"]`,
  );
  assert.equal(
    row({ unequip: ["durations"] }, "no-attribution").line,
    `"unequip": ["durations", "no-attribution"]`,
  );
  assert.equal(
    row({ unequip: ["author", "durations"] }, "durations").line,
    `move "durations" from "unequip" to "equip"`,
  );
  assert.equal(
    row({ unequip: ["durations"] }, "durations").line,
    `remove "durations" from "unequip"`,
  );
  assert.equal(
    row({ equip: ["durations"] }, "durations").line,
    `move "durations" from "equip" to "unequip"`,
  );
  assert.equal(row({}, "durations").line, `"unequip": ["durations"]`);
  // A unit's stop names the same line as the unit's row.
  overlayOf(root, { unequip: ["author", "no-attribution"] });
  assert.equal(
    readStopInventory(root, {
      unequipped: {
        "no-attribution": row(
          { unequip: ["author", "no-attribution"] },
          "no-attribution",
        ).line,
      },
    }).find((entry) => entry.id === "attribution").line,
    `move "no-attribution" from "unequip" to "equip"`,
  );
});

test("WO-287 criterion B3: an overlay that names single ids removes or restores exactly those, a platform-layer id in unequip is named in one advisory and kept, and in an instance an unknown id is named in one advisory and ignored", (t) => {
  const root = fixture(t);
  const out = () =>
    readRuleInventory(root)
      .filter((row) => !row.equipped)
      .map((row) => row.id);
  // Single ids: exactly those are left out.
  overlayOf(root, { unequip: ["read-your-own-output", "durations"] });
  assert.deepEqual(out(), ["read-your-own-output", "durations"]);
  assert.deepEqual(overlayRuleSelection(readBuildOverlay(root)), {
    units: ["read-your-own-output"],
    rules: ["durations"],
  });
  // Single ids beside the layer's name: exactly those are restored.
  overlayOf(root, {
    unequip: ["author"],
    equip: ["read-your-own-output", "durations"],
  });
  assert.deepEqual(
    out(),
    authorIds.filter(
      (id) => !["read-your-own-output", "durations"].includes(id),
    ),
  );
  // The layer's name in equip beside a single id in unequip: that one alone.
  overlayOf(root, { equip: ["author"], unequip: ["durations"] });
  assert.deepEqual(out(), ["durations"]);

  // A platform-layer id in unequip is named once, however often the
  // overlay is read, and the rule stays.
  overlayOf(root, { unequip: ["worker-launch"] }, {}, "build/b3-platform.json");
  const platform = warned(() => {
    assert.deepEqual(overlayRuleSelection(readBuildOverlay(root)), {
      units: [],
      rules: [],
    });
    readBuildOverlay(root);
  });
  assert.deepEqual(platform, [
    "Advisory: build overlay build/b3-platform.json: unequip names worker-launch, which is the platform's and stays equipped (npm run features -- list shows each rule's layer)",
  ]);
  assert.deepEqual(out(), []);

  // An id the kit does not know refuses in core, as it did.
  overlayOf(root, { unequip: ["no-such-rule"] }, {}, "build/b3-unknown.json");
  assert.throws(
    () => readBuildOverlay(root),
    /invalid build overlay in build\/b3-unknown\.json: unequip names unknown support, unit or rule no-such-rule/u,
  );
  // In an exported instance it is named once and ignored, and the ids
  // beside it still select.
  write(root, "KIT-MANIFEST.json", "{}\n");
  overlayOf(
    root,
    { unequip: ["no-such-rule", "durations"], equip: ["no-such-unit"] },
    {},
    "build/b3-unknown.json",
  );
  const unknown = warned(() => {
    assert.deepEqual(overlayRuleSelection(readBuildOverlay(root)), {
      units: [],
      rules: ["durations"],
    });
    readBuildOverlay(root);
  });
  assert.deepEqual(unknown, [
    "Advisory: build overlay build/b3-unknown.json: equip names no-such-unit, which is no support, unit or rule of this kit; it is ignored (npm run features -- list)",
    "Advisory: build overlay build/b3-unknown.json: unequip names no-such-rule, which is no support, unit or rule of this kit; it is ignored (npm run features -- list)",
  ]);
  assert.deepEqual(out(), ["durations"]);

  // One id in both lists refuses in either root, the layer's name included.
  for (const id of ["durations", "author"]) {
    overlayOf(root, { unequip: [id], equip: [id] }, {}, "build/b3-both.json");
    assert.throws(
      () => readBuildOverlay(root),
      new RegExp(`equip and unequip must not name the same id: ${id}$`, "u"),
      id,
    );
  }
  // An id the kit does not know, in both lists: an instance is told of it
  // once a list and goes on, as for one list, and core refuses it as
  // unknown.
  overlayOf(
    root,
    { unequip: ["typo", "durations"], equip: ["typo"] },
    {},
    "build/b3-both-unknown.json",
  );
  const twice = warned(() =>
    assert.deepEqual(overlayRuleSelection(readBuildOverlay(root)), {
      units: [],
      rules: ["durations"],
    }),
  );
  assert.deepEqual(
    twice.map((line) => /: (equip|unequip) names typo, /u.exec(line)?.[1]),
    ["equip", "unequip"],
  );
  // Every reader a command goes through takes that overlay the same way:
  // the elections, which read it without the kit's ids, the rules and the
  // printed list.
  warned(() => {
    assert.doesNotThrow(() => readFeatures(root));
    assert.deepEqual(
      readRuleInventory(root)
        .filter((row) => !row.equipped)
        .map((row) => row.id),
      ["durations"],
    );
    assert.ok(printed(root, ["list"]).includes("\n## Rules\n"));
  });
  // An id the kit does hold, in both lists, still refuses through the
  // readers that know the ids, in an instance as in core.
  overlayOf(
    root,
    { unequip: ["durations"], equip: ["durations"] },
    {},
    "build/b3-both-known.json",
  );
  for (const read of [
    () => readBuildOverlay(root),
    () => readRuleInventory(root),
    () => printed(root, ["list"]),
  ])
    assert.throws(
      read,
      /equip and unequip must not name the same id: durations/u,
    );
  // In core the unknown id refuses as unknown, through each of them.
  rmSync(join(root, "KIT-MANIFEST.json"));
  overlayOf(
    root,
    { unequip: ["typo", "durations"], equip: ["typo"] },
    {},
    "build/b3-both-unknown-core.json",
  );
  for (const read of [
    () => readBuildOverlay(root),
    () => readRuleInventory(root),
  ])
    assert.throws(read, /names unknown support, unit or rule typo/u);
});
