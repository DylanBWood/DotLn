## Release overview

DotLn can now take a GitHub issue as the source of work. Until now no code read a tracked-work artifact, so the source-to-deliverable vertical started from a hand-written contract. The skeleton's new `fetchIssueBundle` reads one issue, its comments and their edit history through the GitHub CLI, read-only. It screens every item before anything is stored and writes the result as a `SourceBundle` under its hash, with a text-free receipt beside it. The issue's last-updated time is the bundle's revision id, and an unchanged issue fetched again gives the same hash. Anything left out is named in the receipt, and a consumer that asks for complete input gets a typed stop instead. This is the input port WO-123's source-to-deliverable loop will consume; that loop is not part of this release.

## Read before upgrading

- **Privacy boundary.** Every title, body, comment and earlier version passes WO-060's declared screen, with the repository's forge host as the only allowed link host. An item that holds a declared secret shape or a link to any other host is left out. The receipt records its id, the shape, its API path and its span, never its text. The screen catches only WO-060's declared shapes; an unrecognized secret passes.
- **Expect stops on real issues.** The result is `stopped` whenever anything is left out or absent. That includes a comment whose author role cannot be determined, a declared field the API leaves null (a deleted revision, for example), and a secret that appears only in an earlier version. A public `cli/cli` issue lost 13 of its 43 comments to links off the forge host. Call `requireCompleteIssueBundle` before treating a bundle as complete input; it throws an `incomplete` refusal naming the first item left out.
- **Requirements.** An installed, authenticated `gh` that can read the repository. The adapter needs no local checkout, ignores the ambient `GH_REPO` and `GH_HOST`, writes nothing to the forge and invokes no model, so no `ModelInputPlan` is part of its contract.
- **Component version.** `@dotln/skeleton` moves to `0.51.0` for the new export, and the console's pin follows. No dependency is added.

## Substantive changes

**GitHub issue source adapter.** `fetchIssueBundle(repo, number, { directory })` parses the repository URL with the existing helper and reads through its `executeGh` over GraphQL. It pages every connection independently and refuses a cursor that does not advance. After the read it fetches the issue and its comment pages again, and refuses if either changed.

**What the bundle holds.** Sections hold the current title and body, and discussion entries hold the current comments. Authors become role labels: the issue author is `reporter`, a `Bot` actor or a login ending in `[bot]` is `automation`, and every other commenter is `reviewer`. Each edit becomes a text-free receipt entry (edit id, time and subject) and a revision whose changed spans cover the whole retained current item. GitHub's edit history carries each full earlier version; the adapter screens those versions in memory and stores none of them. Image markup stays in the text with its spans. Its byte hash is recorded as unavailable because the API does not supply one, so the bundle's image list stays empty.

**Refusals.** A missing or unauthenticated `gh`, a failing call, output that is not JSON, GraphQL errors and a malformed field each refuse with a reason and store nothing. A malformed field is named by its API path, and `gh` diagnostics are never echoed. Storage is content-addressed and immutable: an existing file under the same name with different bytes, or a symlink, refuses rather than being replaced.

## Progressive polish

The adapter ships with 14 focused tests that replay recorded-shape JSON through a fake `gh` without network access. They cover all ten of WO-060's declared shapes and URL forms in current bodies, comments and earlier versions, and each refusal the order names. The lane also commits a read-only smoke script and its records with identifiers reduced to shapes, and a sampled observation of GitHub's edit-history format. Product 03's `SourceAdapter` entry now names this first adapter and its forge-only allowlist.

## Evidence and compatibility

Application `v0.65.0` is a minor release over `v0.64.1`, built from WO-062 on `main` at `dee4b2df`. `@dotln/skeleton` is `0.51.0`; the compiler, kernel and console keep their versions, and the console pins the new skeleton. No registered evidence source imports the adapter, so no evidence edition is re-minted.

The verification sequence:
- [VER-001](../../verifications/WO-062/VER-001.md) failed the first implementation into repair. It had read GitHub's `UserContentEdit.diff` as a change summary and stored each version as a section, so the bundle presented earlier versions as current text. It also left role omissions unnamed ([D008](../../evidence/WO-062/decisions.md#wo-062-d008--verification-edit-history-carries-full-versions-so-the-mapping-is-repaired-in-the-order)).
- The repair keeps only current text, screens history without storing it, and names each role omission ([D011](../../evidence/WO-062/decisions.md#wo-062-d011--current-text-only-explicit-role-omissions)).
- [VER-002](../../verifications/WO-062/VER-002.md) passed all six criteria on the repaired subject.
- [FINAL-001](FINAL-001.md) passed on the integrated tree.

`npm test -- --review` passed on the integrated tree at code identity `8618ab9329bdbf3f3292fe3751e6fa91d7d7e14a9c8c3b877235435c3651c0e8`: 30 suites, 0 failed, 410.06 s. `npm run test:docs` passes. Two read-only fetches of a public issue reproduced the bundle and receipt hashes ([smoke record](../../evidence/WO-062/smoke-repair.json)).

Known limitations:
- The full-version reading of `diff` rests on sampled public reads (11, 14 and 3 edited subjects), not on documented API behavior. D011 reopens if GitHub changes it.
- Revision spans cover whole current items, not the exact text each edit changed.
- A control character anywhere in the issue, its comments or their earlier versions refuses the whole fetch.
- One query asks for up to 100 comments, each with up to 100 full earlier versions, into a 16 MiB reply buffer. A larger reply refuses as a generic `gh` failure and stores nothing.
