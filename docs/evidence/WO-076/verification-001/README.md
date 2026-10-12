# WO-076 VER-001 probes

The verifier's probe scripts and their outputs. Each probe ran under
`node scripts/harness.mjs bounded`, in a scratch copy of the subject, never in
the worktree.

- `mkcopy.sh <source-root> <dest>` makes the scratch copy that the probes
  write into.
- `noverlay.mjs <root>` compares the generated bundle with `HEAD` after
  replacing hashes, the compiler version and the snapshot id with
  placeholders.
- `probe.mjs <scratch> [case]` runs the overlay cases against fresh copies of
  `<scratch>/base`. It writes `probe-results.json`, which is reproduced here
  with absolute paths replaced by `<repo>` and `<scratch>`.
- `transcript.txt` holds the commands, outputs and single-case
  reproductions that the report cites.
