// Independent VER-001 probes. Fixtures use local bare remotes and mocked gh.
// Generated copies live only in system temp; the implementation is not edited.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-verification-"));
const mode = process.argv[2];
const modes = [
  "close-original",
  "close-preignored-env",
  "close-moved-release-tag",
  "draft-original",
  "draft-ready-retry",
  "draft-moved-head",
  "fallback-original",
  "fallback-markers",
  "fallback-optout-rewrite",
];
if (!modes.includes(mode))
  throw new Error("Specify one of: " + modes.join(", "));
let source = readFileSync(
  join(root, "scripts/test-target-worktree.mjs"),
  "utf8",
);
const selected = mode.startsWith("close")
  ? "WO-221 a target close"
  : mode.startsWith("draft")
    ? "WO-221 the draft form"
    : "WO-221 a registration without";
if (source.split('test(\"' + selected).length !== 2)
  throw new Error("Expected exactly one selected fixture");
source = source.replace(
  'import test from "node:test";',
  `const test = (name, run) => { if (!name.startsWith(${JSON.stringify(selected)})) return; const start = Date.now(); try { run(); console.log(JSON.stringify({probe:${JSON.stringify(mode)},outcome:'passed',durationMs:Date.now()-start})); } catch (error) { console.log(JSON.stringify({probe:${JSON.stringify(mode)},outcome:'failed',error:error.message,stack:error.stack,durationMs:Date.now()-start})); process.exitCode=1; } };`,
);
source = source.replace(
  /from "(\.[^"]+)"/g,
  (_, file) =>
    `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)}`,
);
if (mode === "close-preignored-env") {
  if (!source.includes('write(clone, \"source.txt\", \"declared base\\n\");'))
    throw new Error("base fixture marker missing");
  source = source.replace(
    'write(clone, "source.txt", "declared base\\n");',
    'write(clone, "source.txt", "declared base\\n");\n  write(clone, ".gitignore", ".env\\n");',
  );
  source = source.replace(
    'const refusedBase = close("--publish");',
    'const refusedBase = close("--publish");\n    console.log(JSON.stringify({probe:"preignored-env-result",exit:refusedBase.status,envRetained:existsSync(join(f.clone,".env")),targetRemoved:!existsSync(f.target),baseMoved:git(f.clone,"rev-parse","HEAD")!==baseBefore,stdout:refusedBase.stdout,stderr:refusedBase.stderr}));',
  );
}
if (mode === "draft-ready-retry") {
  const marker =
    'const published = f.ok(\n      f.worktree(...publishArgs("feat/reviewed-behavior")),\n    );';
  if (!source.includes(marker)) throw new Error("publish marker missing");
  source = source.replace(
    marker,
    `const ghFile = join(forge.bin, 'gh');
    const ghOriginal = readFileSync(ghFile, 'utf8');
    writeFileSync(ghFile, ghOriginal.replace("const args = process.argv.slice(2);", "const args = process.argv.slice(2); if (args[0] === 'pr' && args[1] === 'ready') { console.error('simulated ready failure'); process.exit(77); }"));
    const interrupted = f.worktree(...publishArgs('feat/reviewed-behavior'));
    assert.notEqual(interrupted.status, 0);
    writeFileSync(ghFile, ghOriginal);
    const retried = f.worktree(...publishArgs('feat/reviewed-behavior'));
    console.log(JSON.stringify({probe:'ready-retry',firstExit:interrupted.status,firstError:interrupted.stderr,retryExit:retried.status,retryError:retried.stderr,remoteAtReviewed:git(remote,'rev-parse','refs/heads/feat/reviewed-behavior')===git(f.target,'rev-parse','HEAD')}));
    f.ok(retried);
    const recovered = JSON.parse(readFileSync(forge.state,'utf8'));
    assert.equal(recovered.pulls[7].draft,false); assert.equal(Object.keys(recovered.pulls).length,1);
    assert.equal(events().at(-1).payload.reusedDraft,draftHead);
    return;
    const published = '';`,
  );
}
if (mode === "draft-moved-head") {
  const marker =
    'const published = f.ok(\n      f.worktree(...publishArgs("feat/reviewed-behavior")),\n    );';
  if (!source.includes(marker)) throw new Error("publish marker missing");
  source = source.replace(
    marker,
    `git(remote, 'update-ref', 'refs/heads/feat/reviewed-behavior', headBefore);
    const moved = f.worktree(...publishArgs('feat/reviewed-behavior'));
    console.log(JSON.stringify({probe:'moved-head',exit:moved.status,remoteUnchanged:git(remote,'rev-parse','refs/heads/feat/reviewed-behavior')===headBefore,error:moved.stderr}));
    assert.notEqual(moved.status,0); assert.equal(git(remote,'rev-parse','refs/heads/feat/reviewed-behavior'),headBefore);
    return;
    const published = '';`,
  );
}
if (mode === "fallback-optout-rewrite") {
  source = source.slice(0, source.indexOf('test("target release preparation'));
  source += `
test('WO-221 a registration without hostRules must not rewrite literal rules', () => withFixture((f) => {
    publicationSetup(f); f.mapClone(); f.start();
    assert.equal(existsSync(join(f.main,'.claude/settings.local.json')),false);
    const rewritten = f.worktree('host-rules','--rewrite','WO-999');
    console.log(JSON.stringify({probe:'optout-rewrite',exit:rewritten.status,claudeRulesWritten:existsSync(join(f.main,'.claude/settings.local.json')),codexRulesWritten:existsSync(join(f.main,'.codex/rules/dotln-WO-999.rules')),stdout:rewritten.stdout,stderr:rewritten.stderr}));
    assert.notEqual(rewritten.status,0);
  }));
`;
}
if (mode === "close-moved-release-tag") {
  if (!source.includes('const published = f.ok(close(\"--publish\"));'))
    throw new Error("close marker missing");
  source = source.replace(
    'const published = f.ok(close("--publish"));',
    `const ghFile=join(forge.bin,'gh');
    const ghOriginal=readFileSync(ghFile,'utf8');
    writeFileSync(ghFile,ghOriginal.replace("const args = process.argv.slice(2);", "const args = process.argv.slice(2); if(args[0]==='release' && args[1]==='create'){console.error('simulated release failure');process.exit(77);}"));
    const interrupted=close('--publish'); assert.notEqual(interrupted.status,0); assert.match(interrupted.stderr,/tag published/u);
    writeFileSync(ghFile,ghOriginal);
    const remoteFixture=join(f.base,'target.git');
    const expected=git(remoteFixture,'rev-parse','v0.1.0^{commit}');
    git(remoteFixture,'update-ref','refs/tags/v0.1.0',baseBefore);
    const retry=close('--publish');
    console.log(JSON.stringify({probe:'moved-release-tag',firstExit:interrupted.status,retryExit:retry.status,tagStillExpected:git(remoteFixture,'rev-parse','v0.1.0^{commit}')===expected,releaseCreated:Boolean(JSON.parse(readFileSync(forge.state,'utf8')).releases['v0.1.0']),stdout:retry.stdout,stderr:retry.stderr}));
    assert.notEqual(retry.status,0); return;
    const published='';`,
  );
}
if (mode === "fallback-markers") {
  const marker = "const rules = local.permissions.allow;";
  if (!source.includes(marker)) throw new Error("fallback marker missing");
  source = source.replace(
    marker,
    marker +
      `
    const settingsText = readFileSync(join(f.main,'.claude/settings.local.json'),'utf8');
    const marked = settingsText.includes('dotln:WO-999:start') && settingsText.includes('dotln:WO-999:end');
    console.log(JSON.stringify({probe:'fallback-markers',markersInClaudeSettings:marked,codexMarkers:readFileSync(join(f.main,'.codex/rules/dotln-WO-999.rules'),'utf8').includes('dotln:WO-999:start')}));
    assert.equal(marked,true);`,
  );
}
const file = join(scratch, `${mode}.mjs`);
writeFileSync(file, source);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
