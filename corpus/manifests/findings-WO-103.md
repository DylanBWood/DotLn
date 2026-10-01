# WO-103 quarantined findings

Observed shipped behavior; no runtime repair is made by this evidence-only order.

## WO-103-F001

Missing semantic input refuses with the exact partial trace, but deriveAuditRecords omits the DecisionRecorded event from the denied record's eventIds. Carry-in: WO-017 FINAL-001 adjudication 8.

```json
{
  "number": "WO-103-F001",
  "kind": "unlinked-audit-refusal",
  "cellId": "audit-missing-state",
  "reproduced": true,
  "input": {
    "dimensions": {
      "effect": "string",
      "clock": "before",
      "eventTypes": 0,
      "events": 1,
      "typeMatch": false,
      "conditions": 1,
      "semanticMatch": "never",
      "environment": "missing-state",
      "patterns": "exact",
      "evidence": "required-empty",
      "resource": "undefined"
    },
    "intent": {
      "kind": "Act",
      "effect": "act",
      "payload": {}
    },
    "envelope": {
      "authorityEnvelopeId": "auth",
      "allowedEffects": [
        "act"
      ],
      "deniedEffects": [],
      "resourceLimits": {},
      "requiredEvidence": [],
      "expiresAt": 10,
      "revocationEventTypes": [],
      "revocationConditions": [
        {
          "registryId": "wo103.probe",
          "version": 1,
          "params": {
            "index": 0,
            "targetCondition": 0,
            "targetEvent": 0,
            "match": false,
            "expectedClock": 9,
            "expectedRng": 932122817,
            "throwAt": -1
          }
        }
      ]
    },
    "context": {
      "now": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "decisionIndex": 3,
      "intentIndex": 0,
      "evidence": [],
      "revokedBy": [
        {
          "schemaVersion": 1,
          "eventId": "rev-0",
          "type": "Tick",
          "occurredAt": 9,
          "actorId": "a",
          "workstreamId": "ws",
          "episodeId": "ep",
          "payload": {
            "index": 0
          }
        }
      ]
    },
    "environment": {
      "rngState": 932122817,
      "registry": "wo103.probe@1",
      "suppliedNow": -999
    }
  },
  "expected": {
    "authorized": false,
    "refusal": {
      "schemaVersion": 1,
      "type": "CommandRefused",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "intentIndex": 0,
        "reason": "cannot evaluate revocation",
        "authorityEnvelopeId": "auth"
      }
    },
    "trace": {
      "reactorId": "authority-guard",
      "reactorVersion": "1",
      "branchPath": [
        "refused",
        "cannot evaluate revocation"
      ],
      "envInputs": [
        "now",
        "authorityEnvelope",
        "evidence",
        "revocations",
        "rngState:932122817",
        "predicates"
      ],
      "cadenceEvaluations": []
    }
  },
  "events": [
    {
      "schemaVersion": 1,
      "type": "CommandRefused",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "intentIndex": 0,
        "reason": "cannot evaluate revocation",
        "authorityEnvelopeId": "auth"
      },
      "eventId": "refusal-0"
    },
    {
      "schemaVersion": 1,
      "eventId": "trace-0",
      "type": "DecisionRecorded",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "trace": {
          "reactorId": "authority-guard",
          "reactorVersion": "1",
          "branchPath": [
            "refused",
            "cannot evaluate revocation"
          ],
          "envInputs": [
            "now",
            "authorityEnvelope",
            "evidence",
            "revocations",
            "rngState:932122817",
            "predicates"
          ],
          "cadenceEvaluations": []
        }
      }
    }
  ],
  "auditRecords": [
    {
      "schemaVersion": 1,
      "recordId": "audit:refusal-0:authority-decision",
      "actionClass": "authority-decision",
      "action": "command.refused",
      "outcome": "denied",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "eventIds": [
        "refusal-0"
      ],
      "decision": "denied",
      "reason": "cannot evaluate revocation",
      "authorityEnvelopeRef": "auth",
      "association": "refusal-event-only"
    }
  ]
}
```

## WO-103-F002

Missing semantic input refuses with the exact partial trace, but deriveAuditRecords omits the DecisionRecorded event from the denied record's eventIds. Carry-in: WO-017 FINAL-001 adjudication 8.

```json
{
  "number": "WO-103-F002",
  "kind": "unlinked-audit-refusal",
  "cellId": "audit-missing-env",
  "reproduced": true,
  "input": {
    "dimensions": {
      "effect": "string",
      "clock": "before",
      "eventTypes": 0,
      "events": 1,
      "typeMatch": false,
      "conditions": 1,
      "semanticMatch": "never",
      "environment": "missing-env",
      "patterns": "exact",
      "evidence": "required-empty",
      "resource": "undefined"
    },
    "intent": {
      "kind": "Act",
      "effect": "act",
      "payload": {}
    },
    "envelope": {
      "authorityEnvelopeId": "auth",
      "allowedEffects": [
        "act"
      ],
      "deniedEffects": [],
      "resourceLimits": {},
      "requiredEvidence": [],
      "expiresAt": 10,
      "revocationEventTypes": [],
      "revocationConditions": [
        {
          "registryId": "wo103.probe",
          "version": 1,
          "params": {
            "index": 0,
            "targetCondition": 0,
            "targetEvent": 0,
            "match": false,
            "expectedClock": 9,
            "expectedRng": 932122817,
            "throwAt": -1
          }
        }
      ]
    },
    "context": {
      "now": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "decisionIndex": 3,
      "intentIndex": 0,
      "evidence": [],
      "revokedBy": [
        {
          "schemaVersion": 1,
          "eventId": "rev-0",
          "type": "Tick",
          "occurredAt": 9,
          "actorId": "a",
          "workstreamId": "ws",
          "episodeId": "ep",
          "payload": {
            "index": 0
          }
        }
      ],
      "state": {
        "marker": "wo103-seed-20261001"
      }
    },
    "environment": null
  },
  "expected": {
    "authorized": false,
    "refusal": {
      "schemaVersion": 1,
      "type": "CommandRefused",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "intentIndex": 0,
        "reason": "cannot evaluate revocation",
        "authorityEnvelopeId": "auth"
      }
    },
    "trace": {
      "reactorId": "authority-guard",
      "reactorVersion": "1",
      "branchPath": [
        "refused",
        "cannot evaluate revocation"
      ],
      "envInputs": [
        "now",
        "authorityEnvelope",
        "evidence",
        "revocations",
        "state"
      ],
      "cadenceEvaluations": []
    }
  },
  "events": [
    {
      "schemaVersion": 1,
      "type": "CommandRefused",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "intentIndex": 0,
        "reason": "cannot evaluate revocation",
        "authorityEnvelopeId": "auth"
      },
      "eventId": "refusal-1"
    },
    {
      "schemaVersion": 1,
      "eventId": "trace-1",
      "type": "DecisionRecorded",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "payload": {
        "trace": {
          "reactorId": "authority-guard",
          "reactorVersion": "1",
          "branchPath": [
            "refused",
            "cannot evaluate revocation"
          ],
          "envInputs": [
            "now",
            "authorityEnvelope",
            "evidence",
            "revocations",
            "state"
          ],
          "cadenceEvaluations": []
        }
      }
    }
  ],
  "auditRecords": [
    {
      "schemaVersion": 1,
      "recordId": "audit:refusal-1:authority-decision",
      "actionClass": "authority-decision",
      "action": "command.refused",
      "outcome": "denied",
      "occurredAt": 9,
      "actorId": "a",
      "workstreamId": "ws",
      "episodeId": "ep",
      "eventIds": [
        "refusal-1"
      ],
      "decision": "denied",
      "reason": "cannot evaluate revocation",
      "authorityEnvelopeRef": "auth",
      "association": "refusal-event-only"
    }
  ]
}
```

## WO-103-F003

Replay admits a command with a non-empty string commandId but incomplete Command structure. It reaches pendingCommands; this is quarantined, not asserted valid.

```json
{
  "number": "WO-103-F003",
  "kind": "incomplete-command-pending",
  "cells": 960,
  "reproduction": {
    "kind": "incompletePending",
    "cellId": "outbox-31840",
    "dimensions": {
      "commandShape": "id-only",
      "commandKey": "cmd-a",
      "malformed": "null",
      "alphabet": "pending"
    },
    "order": [
      0,
      1,
      2,
      3
    ],
    "events": [
      {
        "schemaVersion": 1,
        "eventId": "persist",
        "type": "CommandPersisted",
        "occurredAt": 9,
        "actorId": "a",
        "workstreamId": "ws",
        "episodeId": "ep",
        "payload": {
          "command": {
            "commandId": "cmd-a"
          }
        }
      },
      {
        "schemaVersion": 1,
        "eventId": "persist-duplicate",
        "type": "CommandPersisted",
        "occurredAt": 9,
        "actorId": "a",
        "workstreamId": "ws",
        "episodeId": "ep",
        "payload": {
          "command": {
            "commandId": "cmd-a",
            "replacement": true
          }
        }
      },
      {
        "schemaVersion": 1,
        "eventId": "unrelated",
        "type": "Unrelated",
        "occurredAt": 9,
        "actorId": "a",
        "workstreamId": "ws",
        "episodeId": "ep",
        "payload": {
          "command": {
            "commandId": "cmd-a",
            "workstreamId": "ws",
            "episodeId": "ep",
            "intent": {
              "kind": "Act",
              "effect": "act",
              "payload": {}
            }
          },
          "commandId": "cmd-a"
        }
      },
      {
        "schemaVersion": 1,
        "eventId": "malformed",
        "type": "CommandPersisted",
        "occurredAt": 9,
        "actorId": "a",
        "workstreamId": "ws",
        "episodeId": "ep",
        "payload": null
      }
    ],
    "expected": {
      "state": {
        "entries": {
          "cmd-a": {
            "command": {
              "commandId": "cmd-a"
            },
            "status": "pending"
          }
        }
      },
      "traces": []
    },
    "branchPath": [],
    "incompleteCommands": [
      {
        "commandId": "cmd-a"
      }
    ]
  }
}
```
