# WO-191 VER-001 probes

These probes support [VER-001](../../../verifications/WO-191/VER-001.md). The
two writing probes change, commit or tag files in the repository they are
given, so each refuses a root outside the system temporary directory. Run them
against a scratch clone: clone this repository, check out the subject's base,
and copy the subject's uncommitted files into the clone.

- `control-mutations.sh <clone>` mutates `docs/control/reader-profiles.json`
  and runs `node scripts/reader.mjs check` for each mutation (criterion 1).
- `score-probes.mjs <clone>` records real-corpus results, then commits the
  profile and tags three releases to show the reader becomes due (criteria 5
  and 7, finding F2).
- `body-profile.mjs <root>` reads only. It runs WO-188's body-profile check
  over every example text (planning receipt 043, criterion 4).
- [transcript.txt](transcript.txt) holds the observed output, with the
  tag-object pruning reproduction for finding F1.
