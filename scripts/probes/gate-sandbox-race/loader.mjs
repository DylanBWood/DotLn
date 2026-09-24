// WO-157 item 15 race probe (scripts/probes/gate-sandbox-race/race.mjs): in-memory patches of scripts/test-runner.test.mjs
// only. UNFIX=1 removes the landed maintenance.auto=false line; PLANT=1 writes
// two loose blobs whose ids start with "17" before the partial test's last
// commit, the state that made Git 2.55 start a detached repack.
import { register } from "node:module";
register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (!url.endsWith("/scripts/test-runner.test.mjs")) return result;
  let source = String(result.source);
  if (process.env.UNFIX === "1") {
    const line = '  git("config", "maintenance.auto", "false");\\n';
    if (!source.includes(line)) throw new Error("fix line missing");
    source = source.replace(line, "");
  }
  if (process.env.PLANT === "1") {
    const anchor = "  review(accepted.productGate);";
    if (!source.includes(anchor)) throw new Error("plant anchor missing");
    source = source.replace(anchor, [
      "  {",
      "    let planted = 0;",
      "    for (let i = 0; planted < 2; i++) {",
      "      const text = 'planted ' + i + ' ' + process.pid + '\\\\n';",
      "      const id = createHash('sha1').update('blob ' + Buffer.byteLength(text) + '\\\\0' + text).digest('hex');",
      "      if (!id.startsWith('17')) continue;",
      "      execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: repo, input: text });",
      "      planted++;",
      "    }",
      "  }",
      anchor,
    ].join("\\n"));
  }
  return { ...result, source };
}
`),
);
