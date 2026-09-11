# Evidence selection

[current.json](current.json) selects the current authority, artifact-identity,
verification and feedback evidence editions. The gate, evidence scripts and
console read the same manifest through one resolver. Starting or resuming a
work order does not change these selections. Update only the affected entry
when a relevant source change requires newly recorded evidence.

The selection is a pointer, not validation. The normal checks still compare
current source with the selected evidence; feedback still requires a live
independent verifier. Existing immutable editions retain their bytes. Explicit
`--edition WO-NNN [--revision NNN]` options on the authority and feedback
commands select a historical edition or a new recording destination without
changing the default. An unversioned original edition remains addressable.

Historical test fixtures keep fixed inputs, hashes and expected results.
During normal checks, those independent expectations must not be calculated
from current output.
Behavioral changes can require new fixtures or changed assertions with a
recorded reason; an unrelated work order should not require script edits.

After recording and validating replacement feedback evidence, use
`node scripts/console-fixtures.mjs --record-current-selfhost` to pin its source
paths and hashes and regenerate only that console case. This explicit authoring
command reads the same manifest; normal checks never update their expectations.
