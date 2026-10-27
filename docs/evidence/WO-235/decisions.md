# WO-235 decisions

## WO-235-D001 — A turn ends only with every operator message answered (operator-authorized amendment after receipt 056)

```json
{
  "id": "WO-235-D001",
  "date": "2026-10-27",
  "dispatch": "planning: FIX THE BULLSHIT FROM WO-192 … (the 2026-10-26 pass, after receipt 056); operator-authorized amendment of the judged order",
  "decision": "Amend WO-235 so that, under Claude, the Stop hook refuses to end a turn while the session journal holds an operator message (never a host task notification) newer than the last direction-ledger entry of the dispatch, naming the unanswered message indexes; the reply that ends the turn answers all of them, so a burst of messages is answered once, after its last, and a message that arrives mid-turn cannot be dropped. `operator override:` suspends it as it does the other refusals. Under Codex and Copilot the rule is role text. The executor reads the host's Stop-hook page for the blocking form and records it.",
  "operatorAuthorization": "The operator directed on 2026-10-27 that when two or more messages arrive in a row the role must not answer each individually but wait for all of them, asked how this recurring issue gets fixed permanently, and then said the session's reply had tangible errors. Captured verbatim in ignored intake, SHA-256 6baae3cbbd738603fad5a6e38caa1753302561399b42cdf9ffa4aecb50806d93 (items 7 to 13).",
  "evidence": [
    "The pass's own record: four operator messages observed between 00:19:13Z and 00:19:24Z and a fifth at 00:19:29Z, after the session had answered the message of 00:19:02Z alone; earlier, the messages of 00:17:26Z, 00:17:48Z, 00:18:14Z and 00:18:31Z were each answered individually",
    "packages/skeleton/src/harness-host.ts 1239 to 1253: the prompt hook journals every operator message with a digest, bytes, class and source; 5689: the Stop hook prints advisories and refuses nothing about messages",
    "the host starts a reply on each message when the role is idle, so only a refusal to end the turn can hold a burst together; a timer in the role cannot",
    "WO-235's direction ledger already gives each message an entry and refuses completion on a missing one; the turn-end refusal is the same check at turn granularity",
    "receipt 056 judged WO-235 aligned-with-findings with no hold; this is a bounded change to one hook judgment and one criterion, recorded through the execution-amendment route"
  ],
  "rejected": [
    { "option": "A waiting period in the role before replying", "reason": "The host starts a turn per message when the role is idle; a habit cannot hold the turn, and the operator asked for a permanent fix, not a habit." },
    { "option": "Refuse every stop until the operator says the exchange is done", "reason": "A lockout; the refusal names only messages without a ledger entry and admits the stop once they have one." },
    { "option": "Count host task notifications as messages", "reason": "Receipt 056's finding on criterion 1: the journal records them under their own source, and they are not the operator's words." },
    { "option": "NoOp", "reason": "The operator's explicit direction; the burst failure recurs in the record of this very session." }
  ],
  "reopenWhen": "A Stop refusal names a message the operator did not send, or a burst is answered in pieces after the rule lands, or the host's Stop hook stops admitting a blocking decision."
}
```
