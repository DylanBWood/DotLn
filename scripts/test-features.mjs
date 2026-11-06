import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  realpathSync,
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
  resolveFeatureId,
  renderInstanceSecrets,
} from "./lib/features.mjs";
import {
  featureAdvisories,
  renderFeatures,
  writeFeatures,
  featuresMain,
} from "./features.mjs";

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
  assert.equal(
    rendered.split("\n").filter((line) => /^\| [a-z]/u.test(line)).length,
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

test("features render/check obey configured roots and print closed-consumer advisories without refusing", (t) => {
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
  assert.match(readFileSync(file, "utf8"), /8 in the installed contract/u);
  assert.match(readFileSync(file, "utf8"), /single-writer reservation/u);
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
        workOrderPath: "records/work-orders/WO-242-fixture.md",
      },
      { type: "FinalReviewCompleted", verdict: "pass" },
    ]
      .map((event) =>
        JSON.stringify({ schemaVersion: 1, workOrderId: "WO-242", ...event }),
      )
      .join("\n") + "\n";
  write(root, "records/control/orders/WO-242.jsonl", closed);
  assert.match(
    featureAdvisories(root).join("\n"),
    /plan-first.*WO-242 has closed.*next planning pass/u,
  );
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
  assert.equal(warnings.length, 1);
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
      /must not name the same support/u,
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
