# WO-139 final-review runtime reproduction

Run the command below from the repository root after a build. It uses disposable copies and changes no repository source, installed runtime, counter or settings. It asserts the two F1 failures observed during final review: a module-only change keeps a stale installed default while the check passes, and a missing required module remains undetected by that check. These assertions describe the defective subject and should fail after repair.

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import {
  cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  harnessInstallation, emitHarness, checkHarness,
} from './scripts/lib/harness.mjs';

const scratch = mkdtempSync(join(tmpdir(), 'dotln-wo139-final-repro-'));
const source = join(scratch, 'source');
const installed = join(scratch, 'installed');
mkdirSync(installed, { recursive: true });
for (const name of ['kernel', 'compiler', 'skeleton', 'console']) {
  mkdirSync(join(source, 'packages', name), { recursive: true });
  cpSync(join('packages', name, 'dist'), join(source, 'packages', name, 'dist'), {
    recursive: true,
  });
  cpSync(join('packages', name, 'package.json'), join(source, 'packages', name, 'package.json'));
}
const options = {
  runtimeRoot: source,
  instructionFloor: readFileSync('CLAUDE.md', 'utf8'),
};
const initial = harnessInstallation(options);
emitHarness(installed, options);
const modulePath = 'packages/skeleton/dist/src/subagent-budget.js';
const original = readFileSync(join(source, modulePath), 'utf8');
const changed = original
  .replaceAll('return 20;', 'return 21;')
  .replace('value.subagentCap === undefined ? 20 :', 'value.subagentCap === undefined ? 21 :');
assert.notEqual(changed, original);
writeFileSync(join(source, modulePath), changed);
const revised = harnessInstallation(options);
emitHarness(installed, options);
assert.equal(initial.runtimeSnapshot, revised.runtimeSnapshot);
assert.equal(revised.runtimeFiles.some(file => file.path === modulePath), false);
assert.equal(checkHarness(installed, options).files, 28);
const built = await import(pathToFileURL(join(source, modulePath)).href);
const hooked = await import(pathToFileURL(join(installed, revised.runtimeSnapshot, modulePath)).href);
assert.equal(built.readSubagentCap(installed), 21);
assert.equal(hooked.readSubagentCap(installed), 20);

rmSync(join(installed, revised.runtimeSnapshot, modulePath));
assert.equal(checkHarness(installed, options).files, 28);
const result = spawnSync(process.execPath, ['.claude/hooks/permissions.mjs'], {
  cwd: installed,
  encoding: 'utf8',
  input: JSON.stringify({
    cwd: installed,
    session_id: 'synthetic-final-review',
    hook_event_name: 'PreToolUse',
    tool_name: 'Agent',
    tool_use_id: 'fixture',
    tool_input: {},
  }),
});
assert.equal(result.status, 0, result.stderr);
const response = JSON.parse(result.stdout);
assert.match(response.systemMessage, /runtime-unavailable/);
assert.equal(response.hookSpecificOutput?.permissionDecision, undefined);
console.log('F1 reproduced: stale cap behavior and missing runtime module both pass harness check.');
JS
```

The worktree's original built cap module and installed snapshot had identical bytes when reviewed. The defect is the omitted dependency in the runtime identity and integrity checks, not a claim that this untouched worktree was already running a different cap.

Recorded observations: [module-only regeneration](final-review-runtime-pin-probe.json), [missing module](final-review-runtime-missing-probe.json). The standalone copies have no local-terms list; the generated checker reports that unavailable rather than claiming a clean-room judgment. No private transcript or identifier was used.

