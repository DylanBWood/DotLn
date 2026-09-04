# Release records

`v0.2.0.md` and `v0.2.0-notes.md` are the immutable historical projection used
for the first hand-closed release. Forward releases use the annotated Git tag
itself as the immutable record: its message contains layered human notes and a
canonical JSON compatibility manifest between
`DOTLN-MANIFEST-BEGIN`/`DOTLN-MANIFEST-END` markers. This binds the record to
the reviewed merged commit without a self-referential manifest commit or a
second release PR.

`tag-manifest.template.json` pins the field layout. `scripts/release.mjs`
populates it only from the merged repository, installed toolchain, control
state, and observed evidence. The same implementation re-derives those fields
before publication; `npm run release -- validate <manifest.json>` exposes that
validator for inspection and mutation tests. Because the validator derives
cadence compatibility from the built `@dotln/kernel` exports, run
`npm run build` or the evidence gate before validating on a fresh checkout.
After evidence builds the kernel, cadence compatibility comes from the built
`@dotln/kernel` exports: the type-exhaustive `CADENCE_KINDS` constant supplies
the complete list, `EVALUABLE_CADENCE_KINDS` supplies the evaluable subset, and
the runtime `Cadence` constructors must match the complete list in both
directions and return their named discriminants. The deferred list is their set
difference. Missing, duplicate, extra, or inconsistent built exports refuse
before tag creation. The control-log schema range likewise uses the
constant exported by `scripts/resume.mjs`; release code does not scrape either
value from source text. Committed release state is folded from the tagged
`resume.jsonl` bytes through that same control implementation, while live
lifecycle consumers use structured `resume status --json` output.
`npm run release -- check-surfaces` is the non-mutating working-tree preview for
the release-bearing README block, component versions, and current final-review
GitHub bodies when those bodies exist. It consults origin's annotated tag refs,
so it is read-only but not offline. Publish and close run the same rules against
the committed snapshot and report each observed and expected value without
creating a tag, Release, package, or commit.
`npm run release -- manifest-from-tag vX.Y.Z` extracts the JSON projection.

The annotation's human layer is a five-section edition assembled in first-parent
order from each included work order's reviewed
`docs/final-reviews/WO-NNN/RELEASE-NOTES.md`. Work orders closed before that
artifact became mandatory receive an explicit legacy fallback with their commit
subjects; later missing or malformed notes are refused before publication. The
machine-derived evidence and compatibility block is last, while the canonical
JSON block remains unchanged below the manifest markers.

From WO-025 forward, current PR and release-note prose uses one physical source
line per paragraph or list-item paragraph so GitHub can apply its own wrapping.
Semantic Markdown boundaries stay on their own lines, and publication transports
the reviewed bytes exactly instead of reflowing them. The preflight applies this
profile only to the current committed final-review package; historical packages
and tag re-derivation are grandfathered unchanged.

Two commands inspect published records locally and do not use the network:

```bash
npm run release -- notes vX.Y.Z
npm run release -- list
```

The first prints a tag's human layer. The second lists each local DotLn release
tag with its commit, application version, and included work orders. The same
human layer is visible on the
[GitHub Releases page](https://github.com/DylanBWood/DotLn/releases); its body
links back to both local commands rather than duplicating the JSON manifest.

`release close WO-NNN` performs guarded closeout and preparation. On the first
post-merge invocation, use the absolute subject-helper command emitted by
`worktree publish` or `resume release-close`; it runs with main as the working
checkout and uses the reviewed subject release and worktree helpers through the
pre-fast-forward cleanup boundary. After the subject is removed, recoverable
reruns use `npm run release -- close WO-NNN` from updated main. Either form may
fast-forward local `main` and remove the known merged worktree and local branch.
At a new eligible boundary it also installs exact dependencies and runs release
evidence, but without `--publish` it creates no tag. Lower and
already-published targets return after their own validation. Adding `--publish`
is explicit authority to create and push only the validated annotated tag and,
after that push succeeds, create its matching GitHub Release. A post-tag Release
failure is recoverable: rerun the same command, which validates the immutable
tag and creates the missing projection or refuses the first differing body line
without editing it. Whether disposable built-kernel output is absent or already
present, that retry reproduces the release evidence first so tagged
compatibility data is checked against a fresh build rather than trusted ignored
bytes. Neither form pushes a `main` commit, publishes a package, or implies
binary, container, or hosted distribution.

`npm run release -- publish-notes vX.Y.Z` is the separate operator-run backfill
for an annotated tag that predates WO-024. It uses that tag's existing human
layer verbatim under a time-indexed legacy label; `v0.2.0` also links its
committed historical manifest and notes. It never moves a tag or edits an
existing Release. No historical backfill was performed by the WO-024 executor.
The operator's post-merge disposition for `v0.2.0` through `v0.3.1` remains to
run that command explicitly or record a deliberate decision not to backfill.
