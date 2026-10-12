import {
  cpSync,
  rmSync,
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  symlinkSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
const S = process.argv[2];
const base = join(S, "base");
const only = process.argv[3];
const results = {};
const listFiles = (root) => {
  const out = {};
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else out[relative(root, p)] = readFileSync(p, "utf8");
    }
  };
  for (const d of [".claude", ".agents", ".codex"]) walk(join(root, d));
  if (existsSync(join(root, "CLAUDE.md")))
    out["CLAUDE.md"] = readFileSync(join(root, "CLAUDE.md"), "utf8");
  return out;
};
const baseFiles = listFiles(base);
const fresh = (name) => {
  const d = join(S, "cases", name);
  rmSync(d, { recursive: true, force: true });
  mkdirSync(join(S, "cases"), { recursive: true });
  cpSync(base, d, { recursive: true, verbatimSymlinks: true });
  return d;
};
const run = (root, action, args = []) => {
  const r = spawnSync(
    process.execPath,
    ["scripts/harness.mjs", action, ...args],
    {
      cwd: root,
      env: { ...process.env, DOTLN_LAUNCHPAD: root },
      encoding: "utf8",
    },
  );
  return { status: r.status, out: (r.stdout + r.stderr).trim() };
};
const select = (root, path) =>
  writeFileSync(
    join(root, "dotln.config.json"),
    JSON.stringify({ version: 1, build: { overlay: path } }, null, 2) + "\n",
  );
const setOverlay = (root, value, path = "build/overlay.json") => {
  select(root, path);
  mkdirSync(join(root, path, ".."), { recursive: true });
  writeFileSync(
    join(root, path),
    typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n",
  );
};
const normalize = (t) => t.replace(/fnv1a64:[0-9a-f]{16}/g, "H");
const changedShapes = (files) => {
  const changed = [],
    shapes = new Set();
  for (const [p, t] of Object.entries(files)) {
    if (baseFiles[p] === t) continue;
    changed.push(p);
    if (baseFiles[p] === undefined) {
      shapes.add(`+FILE ${p}`);
      continue;
    }
    const a = baseFiles[p].split("\n"),
      b = t.split("\n");
    const sa = new Set(a),
      sb = new Set(b);
    for (const l of a)
      if (!sb.has(l)) shapes.add("- " + normalize(l).trim().slice(0, 220));
    for (const l of b)
      if (!sa.has(l)) shapes.add("+ " + normalize(l).trim().slice(0, 220));
  }
  const removed = Object.keys(baseFiles).filter((p) => !(p in files));
  return { changed: changed.length, removed, shapes: [...shapes] };
};
const envelope = (root) => {
  const t = readFileSync(join(root, ".claude/hooks/permissions.mjs"), "utf8");
  const m = t.match(/await runHarnessHook\(([\s\S]*), feedbackBoundary/);
  return m ? JSON.parse(m[1]).envelope : null;
};
const cases = {
  narrowOther(root) {
    setOverlay(root, {
      version: 1,
      narrow: {
        deniedEffects: ["remote.push"],
        expiresAt: 4102444800000,
        revocationEventTypes: ["instance.revoked"],
      },
    });
    const e = run(root, "emit");
    const c = run(root, "check");
    return {
      emit: e,
      check: c,
      diff: changedShapes(listFiles(root)),
      envelope: envelope(root),
    };
  },
  narrowAllowed(root) {
    setOverlay(root, {
      version: 1,
      narrow: {
        allowedEffects: [
          "repo.read",
          "repo.write",
          "git.local",
          "lifecycle.run",
        ],
      },
    });
    const e = run(root, "emit");
    const c = run(root, "check");
    const env = envelope(root);
    return {
      emit: e,
      check: c,
      diffChanged: changedShapes(listFiles(root)).changed,
      allowed: env?.allowedEffects,
      denied: env?.deniedEffects,
    };
  },
  emptyOverlay(root) {
    setOverlay(root, { version: 1 });
    const e = run(root, "emit");
    const c = run(root, "check");
    return { emit: e, check: c, diff: changedShapes(listFiles(root)) };
  },
  identityUnequip(root) {
    setOverlay(root, {
      version: 1,
      identity: {
        identityId: "fork.curator",
        version: 2,
        name: "Fork curator",
        dispositions: ["Inspectable"],
        invariants: ["Floor kept"],
        updateLaws: ["Review builds"],
        lineage: ["fork"],
      },
      unequip: ["process-cost", "goal-alignment"],
    });
    const e = run(root, "emit");
    const c = run(root, "check");
    const files = listFiles(root);
    const body = Object.values(files).join("\n");
    const m = JSON.parse(files[".claude/harness-manifest.json"]);
    return {
      emit: e,
      check: c,
      originHasUnits: ["process-cost", "goal-alignment"].map((id) =>
        m.origin.ids.includes(id),
      ),
      processCostText: /Process Cost:/.test(body),
      goalText: /Goal Alignment:/.test(body),
      identityText:
        /Instance identity: Fork curator \(fork\.curator, version 2\)/.test(
          body,
        ),
      oldIdentityId: m.profiles.map(
        (p) => p.loadout?.phenotype?.identityId ?? null,
      ),
    };
  },
  buildNone(root) {
    setOverlay(root, { version: 1, build: "none" });
    const e = run(root, "emit");
    const c = run(root, "check");
    const files = listFiles(root);
    const remaining = Object.keys(files).filter((p) => p !== "CLAUDE.md");
    const floor = files["CLAUDE.md"];
    const refs = [...floor.matchAll(/@skills\/([a-z-]+)\/SKILL\.md/g)].map(
      (m) => m[1],
    );
    const missingRefs = refs.filter(
      (n) => !existsSync(join(root, ".claude/skills", n, "SKILL.md")),
    );
    rmSync(join(root, ".runtime"), { recursive: true, force: true });
    const c2 = run(root, "check");
    select(root, null === null ? "build/missing-not-used.json" : "");
    writeFileSync(
      join(root, "dotln.config.json"),
      JSON.stringify({ version: 1 }) + "\n",
    );
    const back = run(root, "emit");
    const backCheck = run(root, "check");
    const restored = listFiles(root);
    const restoredDiff = Object.keys({ ...restored, ...baseFiles }).filter(
      (p) => restored[p] !== baseFiles[p],
    );
    return {
      emit: e,
      check: c,
      checkNoRuntime: c2,
      remaining,
      floorBytes: floor.length,
      floorEqualsHandWritten: floor,
      statesNoCompiled:
        /no compiled|without (?:compiled )?(?:refusal|hook)/i.test(floor),
      skillRefs: refs,
      missingRefs,
      reEnable: back,
      reEnableCheck: backCheck,
      restoredDiff,
    };
  },
  widenings(root) {
    const out = {};
    for (const [label, narrow] of [
      ["allowDenied", { allowedEffects: ["repo.read", "package.publish"] }],
      ["allowNew", { allowedEffects: ["repo.read", "network.request"] }],
      ["writers2", { resourceLimits: { writers: 2 } }],
      ["newResource", { resourceLimits: { agents: 1 } }],
      ["newResource0", { resourceLimits: { agents: 0 } }],
    ]) {
      setOverlay(root, { version: 1, narrow });
      const before = JSON.stringify(listFiles(root));
      const r = run(root, "emit", ["--out", "never-" + label]);
      out[label] = {
        status: r.status,
        out: r.out.slice(0, 260),
        unchanged: before === JSON.stringify(listFiles(root)),
        outCreated: existsSync(join(root, "never-" + label)),
      };
    }
    return out;
  },
  grants(root) {
    const out = {};
    const g = (over) => ({
      grantId: "fork.publish",
      version: 1,
      grantedBy: "operator",
      effects: ["package.publish"],
      operations: ["package.publish"],
      repo: "project",
      reason: "fork release posture",
      ...over,
    });
    for (const [label, value] of [
      ["operatorGrant", { version: 1, grants: [g({})] }],
      [
        "hostPolicyGrant",
        { version: 1, grants: [g({ grantedBy: "host-policy" })] },
      ],
      [
        "allowWithGrant",
        {
          version: 1,
          narrow: { allowedEffects: ["repo.read", "network.request"] },
          grants: [
            g({
              effects: ["network.request"],
              operations: ["network.request"],
            }),
          ],
        },
      ],
      [
        "shadowKitGrantId",
        {
          version: 1,
          grants: [g({ grantId: "contributor.outside-temporary" })],
        },
      ],
      [
        "wildcardDenyThenGrant",
        {
          version: 1,
          narrow: { deniedEffects: ["package*"] },
          grants: [g({})],
        },
      ],
      ["agentGrantedBy", { version: 1, grants: [g({ grantedBy: "agent" })] }],
    ]) {
      setOverlay(root, value);
      const r = run(root, "emit");
      const c = r.status === 0 ? run(root, "check") : null;
      let prov = null;
      if (r.status === 0) {
        const m = JSON.parse(
          readFileSync(join(root, ".claude/harness-manifest.json"), "utf8"),
        );
        prov = m.profiles.map((p) =>
          (p.grants ?? []).map(
            (x) => `${x.grantId}:${x.grantedBy}:${x.effects.join(",")}`,
          ),
        );
      }
      out[label] = {
        status: r.status,
        out: r.out.slice(0, 300),
        check: c?.status,
        provenance: prov,
        envAllowed: r.status === 0 ? envelope(root)?.allowedEffects : null,
        envDenied: r.status === 0 ? envelope(root)?.deniedEffects : null,
      };
    }
    return out;
  },
  denyKitGranted(root) {
    const env0 = envelope(base);
    const temp = env0.allowedEffects.filter(
      (e) =>
        ![
          "repo.read",
          "repo.write",
          "shell.run",
          "git.local",
          "lifecycle.run",
        ].includes(e),
    );
    setOverlay(root, { version: 1, narrow: { deniedEffects: [temp[0]] } });
    const r = run(root, "emit");
    const env = r.status === 0 ? envelope(root) : null;
    return {
      kitGranted: temp,
      denied: temp[0],
      status: r.status,
      out: r.out.slice(0, 300),
      stillAllowed: env?.allowedEffects.includes(temp[0]),
      inDenied: env?.deniedEffects.includes(temp[0]),
    };
  },
  refusals(root) {
    const out = {};
    mkdirSync(join(S, "outside"), { recursive: true });
    writeFileSync(join(S, "outside", "overlay.json"), '{"version":1}\n');
    const variants = [
      [
        "directory",
        (r) => {
          select(r, "build/dir");
          mkdirSync(join(r, "build/dir"), { recursive: true });
        },
      ],
      [
        "symlinkOutside",
        (r) => {
          select(r, "build/link.json");
          mkdirSync(join(r, "build"), { recursive: true });
          rmSync(join(r, "build/link.json"), { force: true });
          symlinkSync(
            join(S, "outside", "overlay.json"),
            join(r, "build/link.json"),
          );
        },
      ],
      ["dotdotEscape", (r) => select(r, "../outside/overlay.json")],
      ["absoluteOutside", (r) => select(r, join(S, "outside", "overlay.json"))],
      ["empty", (r) => setOverlay(r, "")],
      ["nullJson", (r) => setOverlay(r, "null")],
      ["arrayJson", (r) => setOverlay(r, "[]")],
      ["bomJson", (r) => setOverlay(r, '﻿{"version":1}')],
      ["versionString", (r) => setOverlay(r, '{"version":"1"}')],
      [
        "nestedIdentityKey",
        (r) =>
          setOverlay(r, {
            version: 1,
            identity: {
              identityId: "a",
              version: 1,
              name: "a",
              dispositions: [],
              invariants: [],
              updateLaws: [],
              lineage: [],
              extra: 1,
            },
          }),
      ],
      [
        "identityMissingField",
        (r) =>
          setOverlay(r, {
            version: 1,
            identity: { identityId: "a", version: 1, name: "a" },
          }),
      ],
      [
        "grantRepo",
        (r) =>
          setOverlay(r, {
            version: 1,
            grants: [
              {
                grantId: "x",
                version: 1,
                grantedBy: "operator",
                effects: ["a.b"],
                repo: "other",
                reason: "r",
              },
            ],
          }),
      ],
      ["unknownTop", (r) => setOverlay(r, { version: 1, repositories: {} })],
      ["classesTop", (r) => setOverlay(r, { version: 1, classes: [] })],
      ["truncated", (r) => setOverlay(r, '{"version":1,')],
    ];
    for (const [label, prep] of variants) {
      prep(root);
      const before = JSON.stringify(listFiles(root));
      const e = run(root, "emit", ["--out", "never-" + label]);
      const c = run(root, "check");
      out[label] = {
        emit: e.status,
        emitOut: e.out.slice(0, 240),
        check: c.status,
        checkOut: c.out.slice(0, 160),
        unchanged: before === JSON.stringify(listFiles(root)),
        outCreated: existsSync(join(root, "never-" + label)),
      };
    }
    return out;
  },
  tamper(root) {
    setOverlay(root, {
      version: 1,
      narrow: { resourceLimits: { writers: 0 } },
    });
    const e = run(root, "emit");
    writeFileSync(
      join(root, "build/overlay.json"),
      readFileSync(join(root, "build/overlay.json"), "utf8") + "\n",
    );
    const c = run(root, "check");
    const e2 = run(root, "emit");
    const c2 = run(root, "check");
    return {
      emit: e.status,
      checkAfterTamper: c,
      reEmit: e2.status,
      checkAfterReEmit: c2.status,
    };
  },
};
for (const [name, fn] of Object.entries(cases)) {
  if (only && name !== only) continue;
  try {
    results[name] = fn(fresh(name));
  } catch (error) {
    results[name] = { probeError: String(error.stack ?? error).slice(0, 600) };
  }
}
writeFileSync(join(S, "probe-results.json"), JSON.stringify(results, null, 1));
console.log(JSON.stringify(results, null, 1));
