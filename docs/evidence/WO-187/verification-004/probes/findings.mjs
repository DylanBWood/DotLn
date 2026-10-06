import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
const [root, base, scratch] = process.argv.slice(2);
const cur = await import(join(root, "scripts/lib/review-findings.mjs"));
const old = await import(join(base, "scripts/lib/review-findings.mjs"));
const curB = await import(join(root, "scripts/lib/verification-briefing.mjs"));
const oldB = await import(join(base, "scripts/lib/verification-briefing.mjs"));
const r3 = JSON.parse(
  readFileSync(
    join(root, "docs/evidence/WO-187/verification-003/reader-regressions.json"),
    "utf8",
  ),
);
const a3 = JSON.parse(
  readFileSync(
    join(
      root,
      "docs/evidence/WO-187/verification-003/adversary-reproductions.json",
    ),
    "utf8",
  ),
);
const brief = (mod, order, id = "WO-900") => {
  const dir = join(scratch, "root-" + Math.random().toString(36).slice(2));
  mkdirSync(join(dir, "docs/work-orders"), { recursive: true });
  const p = `docs/work-orders/${id}-probe.md`;
  writeFileSync(join(dir, p), order);
  try {
    return mod.verificationKnownIssues(dir, {
      workOrderId: id,
      workOrderPath: p,
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
const short = (r) => ({
  c:
    Object.entries(r.counts)
      .filter(([, n]) => n)
      .map(([k, n]) => `${k}=${n}`)
      .join(",") || "none",
  found: r.found,
  unrec: r.unrecognised,
  measured: r.measured,
  ub: r.unclassedBlocking,
});
const out = { findings: {}, adversary: {}, briefing: {} };
for (const [k, text] of Object.entries(r3.inputs.finding))
  for (const verdict of ["pass", "fail"])
    out.findings[`${k}/${verdict}`] = {
      now: short(cur.reviewFindings(text, { verdict })),
      cp11: short(old.reviewFindings(text, { verdict })),
    };
const fr = readFileSync(
  join(root, "docs/final-reviews/WO-186/FINAL-002.md"),
  "utf8",
);
out.findings["WO-186/FINAL-002/pass"] = {
  now: short(cur.reviewFindings(fr, { verdict: "pass" })),
  cp11: short(old.reviewFindings(fr, { verdict: "pass" })),
};
for (const [k, v] of Object.entries(a3.findings))
  out.adversary[k] = {
    verdict: v.verdict,
    now: short(cur.reviewFindings(v.text, { verdict: v.verdict })),
    cp11: short(old.reviewFindings(v.text, { verdict: v.verdict })),
  };
out.briefing.ver003Order = {
  now: brief(curB, r3.inputs.order),
  cp11: brief(oldB, r3.inputs.order),
};
const r3order =
  "# WO-901 — probe\n\n**Objective:** probe.\n\n**Known issues and carry-ins:**\n\n- first carry-in.\n\n**Design** for the repair: keep it small.\n\n- second carry-in.\n\n**Non-goals:** none.";
out.briefing.R3 = {
  now: brief(curB, r3order, "WO-901"),
  cp11: brief(oldB, r3order, "WO-901"),
};
console.log(JSON.stringify(out, null, 1));
