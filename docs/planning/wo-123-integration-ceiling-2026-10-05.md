# Product 07 ceiling at WO-123's integration (2026-10-05)

A planning decision the operator made during WO-123's final review, recorded
here because `docs/control/doc-ceilings.json` accepts a ceiling increase only
from a planning document.

## 1. Product 07 ceiling

The 2026-10-02 pass reserved 2,900 bytes of product 07 for WO-123's
write-backs and 700 bytes for WO-186's
([standard pass §16](standard-pass-2026-10-02.md#16-document-ceilings-set-from-declared-write-backs)).
WO-186 merged first and grew 07 by 3,406 bytes, which left 30 bytes under the
166,907-byte ceiling. Integrating `main` then put WO-123's verified
write-backs 3,343 bytes over it.

Asked during the review, the operator chose to trim and then raise by the
remainder. WO-123's final review condensed its write-backs to what criterion 6
names: the `dotln vertical` command, the resident's admission and the `intent`
portfolio class. The details stay in the skeleton README. That leaves 07 at
168,083 bytes, so the ceiling rises by 1,176 bytes, from 166,907 to 168,083.
The increase is within WO-123's original 2,900-byte reservation.

Reopen: the next planning pass measures 07 and resets its ceiling from the
write-backs still queued.
