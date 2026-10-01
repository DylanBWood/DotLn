# `@dotln/browser-evidence`

The standalone WO-059 adapter has one entry point:

```ts
import { runScenario } from "@dotln/browser-evidence";

const result = await runScenario("saved-scenario.json", {
  subjectRevision: "candidate",
  directory: ".runtime/new-browser-run",
  // recoverFrom: ".runtime/interrupted-browser-run"
});
```

The caller prepares a subject before `VerificationOpened`, adding
`result.evidence` to its subject evidence. These are synthetic-fixture witnesses,
not verifier verdicts. The kernel, compiler and skeleton load no browser code.
The package serves its checked-in form, fetch endpoint and console-error page on
an owned loopback server. It supports only the closed JSON interpreter in
[the saved fixture](fixtures/scenario.json): navigate, fill, click, assertText,
assertResponse and a bounded wait. Unknown actions and fields refuse before
effects. No arbitrary script or real target selection is supported yet.

Each criterion names one check and its public repository surfaces. The result
binds screenshot, DOM, accessibility, request/response trace and console captures
to every covered criterion. Assertions failing produce adverse evidence; any
captured console error or failed `console.assert` produces a failing console witness for every criterion. WO-058
admission decides whether a verifier result can pass. Missing launch or capture
returns unavailable evidence with a reason; it never substitutes a passing
fixture. On missing launch no payload pretends to be an observed screenshot or
response. Other launch failures remain unavailable without an install recommendation.
Console entries are copied at the capture boundary, so messages during trace
retention or shutdown cannot change the saved witness or its hash.
Up to ten criteria, six requests and one hundred console entries fit
the existing capsule limits; exceeding capture bounds makes the run unavailable.

Raw artifacts, `scenario.json`, `replay-fields.json`, `processes.json` and a
Playwright `trace.zip` remain in the new output directory. Every run owns a fresh
browser/context and closes them and its server before returning. `recoverFrom`
requires an exited owner, checks UTC process start times and browser commands, and
signals only matching identities in a recorded browser tree whose root was
observed as the owner's child before starting a new run. A bare browser PID
without that recorded root refuses recovery and cannot seed later observations.
A browser PID whose observed start time or command changed is left alone. An active
owner refuses recovery even if it changes its process title. The process-table
checks require a POSIX host with `ps`; the fixtures establish the WO-057 macOS
host/pin, not a universal process or hostile-browser confinement guarantee.

Saved scenarios replay through the same entry point. [Declared stable fields and
omissions](fixtures/replay-fields.json) define the comparison: exact DOM and
accessibility text, normalized request URLs/methods/body hashes, response statuses
and body hashes, console entries, and equal PNG hashes under the WO-057 pin and
render settings. Dynamic ports and timings remain in the raw trace. HTML does
not serialize every live input property; the screenshot/accessibility capture
also records the rendered result. A changed browser/host needs a new observation.

`npm run worktree -- start ...` prepares the lockfile-pinned headless shell in
each new worktree before printing its launch handoff. Bootstrap installs the
JavaScript dependencies with lifecycle scripts disabled, invokes that checkout's
installed Playwright CLI, then builds and prepares the hooks. Repeated bootstrap
uses an already installed matching browser. A failed download preserves the
checkout and stops preparation with the retry command; it never skips a test.

A raw checkout or interrupted setup can run `node scripts/bootstrap.mjs` from
its root. The equivalent explicit prerequisite and standalone suite commands are:

```sh
npm ci --ignore-scripts
PLAYWRIGHT_BROWSERS_PATH="$PWD/.runtime/playwright" npx playwright install chromium --only-shell
npm run build
node --test packages/browser-evidence/test/*.test.mjs
```

The suite uses `.runtime/playwright` by default or an explicit
`PLAYWRIGHT_BROWSERS_PATH`. A missing-browser failure prints this install command
with the selected cache path shell-quoted; a caller without a cache override gets
the bare command for Playwright's platform default. The negative fixtures
deliberately bypass bootstrap, run the actual suite in a fresh worktree with no
supplied browser-path variable and compare the
printed remedy and this README's command through the pinned CLI's `--dry-run`.
They also check an empty custom cache containing shell characters and a caller
using the platform default. Missing launch still yields unavailable witnesses
and a failing suite.

Automatic preparation applies to future worktree creation; existing worktrees
are not retrofitted. Bootstrap uses `.runtime/playwright` by default, honors
`PLAYWRIGHT_BROWSERS_PATH` and resolves relative selections from the new checkout.
The cache remains isolated unless the caller explicitly chooses a shared one.
Receipt 036's earlier manual-setup disposition is reopened by
[WO-181-D008](../../docs/evidence/WO-181/decisions.md#wo-181-d008--operator-expansion-prepare-future-worktrees);
the historical observation remains in
[D023](../../docs/evidence/WO-059/decisions.md#wo-059-d023--receipt-036-missing-browser-disposition).
No package, browser binary or bundled artifact is published by this work order.
