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
validator for inspection and mutation tests.
`npm run release -- manifest-from-tag vX.Y.Z` extracts the JSON projection.

`npm run release -- close WO-NNN` performs guarded closeout and preparation: it
may fast-forward local `main` and remove the known merged worktree and local
branch. At a new eligible boundary it also installs exact dependencies and runs
release evidence, but without `--publish` it creates no tag. Lower and
already-published targets return after their own validation. Adding `--publish`
is explicit authority to create and push only the validated annotated tag.
Neither form pushes a `main` commit, publishes a package, or implies binary,
container, or hosted distribution.
