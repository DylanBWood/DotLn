// One-time WO-172 survey repair: pure folds, with no transcript I/O.
import assert from "node:assert/strict";
const time = (value) => {
  const t = Date.parse(value);
  assert.ok(Number.isFinite(t), "event needs a time");
  return t;
};
const compare = (a, b) =>
  time(a.sentAt ?? a.at) - time(b.sentAt ?? b.at) || a.sequence - b.sequence;
export function repairChronology(messages, activities, dispatchRole) {
  const ordered = [...messages].sort(compare);
  const history = [...activities].filter((a) => a.at).sort(compare);
  let previous = null,
    dispatch = null,
    role = "undispatched",
    cursor = 0,
    agent = null;
  return ordered.map((message) => {
    while (cursor < history.length && compare(history[cursor], message) < 0) {
      const activity = history[cursor++];
      agent = {
        ...(agent ?? { text: "", tools: [] }),
        at: activity.at,
        sequence: activity.sequence,
      };
      if (activity.text !== undefined) {
        agent.text = activity.text;
        agent.textAt = activity.at;
      }
      if (activity.tool !== undefined)
        agent.tools = [
          ...agent.tools,
          { at: activity.at, sequence: activity.sequence, text: activity.tool },
        ].slice(-4);
    }
    const dispatched = dispatchRole(message.text);
    if (dispatched) {
      role = dispatched;
      dispatch = message.sentAt;
    }
    const gap = (before) =>
      before ? Math.round((time(message.sentAt) - time(before)) / 1000) : null;
    const row = {
      ...message,
      role,
      gapPrevOperator: gap(previous),
      sinceDispatch: gap(dispatch),
      sinceAgent: gap(agent?.at),
      agentAt: agent?.at ?? null,
      agentSequence: agent?.sequence ?? null,
      agentTextAt: agent?.textAt ?? null,
      agentToolTimes: (agent?.tools ?? []).map((t) => t.at),
      agentBefore: {
        text: agent?.text ?? "",
        tools: (agent?.tools ?? []).map((t) => t.text),
      },
    };
    previous = message.sentAt;
    return row;
  });
}

export const COUNTED = [
  "correction",
  "direction",
  "scope-expansion",
  "override",
  "takeover",
  "answer",
];
export const PRIORITY = [
  ...COUNTED.slice(0, 1),
  "scope-expansion",
  "override",
  "takeover",
  "direction",
  "answer",
  "question",
  "ideation",
  "interrupt",
  "other-step",
  "acknowledgement",
  "none",
];
const tally = (rows, key) =>
  rows.reduce((out, row) => {
    const value = key(row);
    out[value] = (out[value] ?? 0) + 1;
    return out;
  }, {});
const day = (value) => value?.slice(0, 10) ?? "unknown";

export function surveyEpisodes(classified, window = 120) {
  const sessions = new Map();
  for (const row of classified) {
    const key = `${row.source}:${row.session}`;
    if (!sessions.has(key)) sessions.set(key, []);
    sessions.get(key).push(row);
  }
  const episodes = [];
  for (const messages of sessions.values()) {
    let episode = null;
    for (const message of [...messages].sort(compare)) {
      if (
        !episode ||
        message.order !== episode.order ||
        message.role !== episode.role ||
        (time(message.sentAt) - time(episode.last)) / 1000 > window
      ) {
        episode = {
          order: message.order,
          role: message.role,
          start: message.sentAt,
          last: message.sentAt,
          messages: [],
        };
        episodes.push(episode);
      }
      episode.messages.push(message);
      episode.last = message.sentAt;
    }
  }
  for (const e of episodes) {
    e.class = PRIORITY.find((c) => e.messages.some((m) => m.c.class === c));
    e.failureInstruction = e.messages.some((m) => m.c.failureInstruction);
    e.severity = e.messages.some((m) => m.c.severity);
    e.mash = e.messages.some((m) => m.mash);
    e.instigator = e.messages[0].c.instigator;
    e.spanS = (time(e.last) - time(e.start)) / 1000;
    e.midTurn = e.messages.some((m) => /absorbed|while-working/.test(m.via));
  }
  return episodes;
}

// Unknown dates do not match. Consume each record once within its comparison,
// preferring the same UTC day before the adjacent day on either side.
export function matchDays(transcriptDates, recordDates) {
  const transcript = [...transcriptDates].sort(),
    record = [...recordDates].sort();
  let matched = 0;
  for (const slack of [0, 1])
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i] === null || !Number.isFinite(Date.parse(transcript[i])))
        continue;
      const j = record.findIndex(
        (date) =>
          date !== null &&
          Math.abs(Date.parse(date) - Date.parse(transcript[i])) <=
            slack * 86400e3,
      );
      if (j >= 0) {
        matched++;
        transcript[i] = null;
        record[j] = null;
      }
    }
  return {
    transcript: transcriptDates.length,
    record: recordDates.length,
    matched,
  };
}

export function compareByOrderAndRole(episodes, record) {
  const orders = [
    ...new Set([
      ...episodes.map((e) => e.order).filter((o) => /^WO-\d{3}$/.test(o)),
      ...Object.keys(record),
    ]),
  ].sort();
  const rows = [];
  for (const order of orders) {
    const orderEpisodes = episodes.filter((e) => e.order === order);
    const entries = record[order] ?? {
      steps: [],
      corrections: [],
      failedJudgments: [],
    };
    const roles = [
      ...new Set([
        ...orderEpisodes.map((e) => e.role),
        ...Object.values(entries)
          .flat()
          .map((r) => r.role),
      ]),
    ].sort();
    for (const role of roles) {
      const E = orderEpisodes.filter((e) => e.role === role);
      const steps = entries.steps.filter((s) => s.role === role);
      const corrections = entries.corrections.filter((s) => s.role === role);
      const judgments = entries.failedJudgments.filter((s) => s.role === role);
      const classes = Object.fromEntries(
        COUNTED.map((c) => [
          c,
          matchDays(
            E.filter((e) => e.class === c).map((e) => day(e.start)),
            steps.filter((s) => s.class === c).map((s) => s.date),
          ),
        ]).filter(([, m]) => m.transcript || m.record),
      );
      const failures = E.filter((e) => e.failureInstruction).map((e) =>
        day(e.start),
      );
      const failureInstructions = matchDays(
        failures,
        [...corrections, ...judgments].map((s) => s.date),
      );
      rows.push({
        order,
        role,
        transcriptEpisodes: E.length,
        episodesByClass: tally(E, (e) => e.class),
        dispatchesByClass: tally(steps, (s) => s.class),
        classes,
        failureInstructions: {
          ...failureInstructions,
          againstCorrections: matchDays(
            failures,
            corrections.map((s) => s.date),
          ),
          againstFailedJudgments: matchDays(
            failures,
            judgments.map((s) => s.date),
          ),
        },
        corrections: corrections.length,
        failedJudgments: judgments.length,
        recordIdentifiers: {
          dispatches: steps.map((s) => s.decision),
          corrections: corrections.map((s) => s.decision),
          failedJudgments: judgments.map((s) => s.report),
        },
        differs:
          Object.values(classes).some(
            (m) => m.matched < m.transcript || m.matched < m.record,
          ) || failureInstructions.matched < failureInstructions.transcript,
      });
    }
  }
  return {
    rows,
    differingOrders: [
      ...new Set(rows.filter((r) => r.differs).map((r) => r.order)),
    ],
  };
}

// Third repair (VER-003 F9): sourced role corrections change metadata in the
// retained snapshot, never membership, dates, classes or failed judgments.
export function repairRecordRoles(record, changes) {
  const repaired = structuredClone(record);
  const seen = new Set();
  for (const change of changes) {
    assert.match(change.decision, /^WO-\d{3}-D\d{3}$/);
    assert.ok(["executor", "executor-repair", "planner"].includes(change.role));
    for (const group of change.groups) {
      assert.ok(["steps", "corrections"].includes(group));
      const key = `${group}:${change.decision}`;
      assert.ok(!seen.has(key), `duplicate role correction: ${key}`);
      seen.add(key);
      const rows = repaired[change.decision.slice(0, 6)]?.[group];
      const matches =
        rows?.filter((row) => row.decision === change.decision) ?? [];
      assert.equal(matches.length, 1, `frozen entry required: ${key}`);
      assert.equal(
        matches[0].role,
        "unnamed",
        `original role required: ${key}`,
      );
      matches[0].role = change.role;
    }
  }
  return repaired;
}

// Second repair (VER-002 F4 and F5). The folds below hold three rules. A user
// line is read for the operator's input whatever it carries: a line of tool
// results for its question-tool answers, and a body of parts for its text. A
// refused or failed question holds no answer. An item a hook injected is never
// the operator's typing, whatever the hook is named.
export const QUESTION_TOOL = "AskUserQuestion";
export const NOTES_ONLY = "(notes only)";

/** The operator's answers in one question-tool result, as values with the
 * offered labels they were picked from. `notes` are typed beside a pick. */
export function questionAnswer(input, result) {
  const questions = result?.questions ?? input?.questions ?? [];
  const values = [];
  for (const q of questions) {
    const answer = result?.answers?.[q.question];
    if (answer === undefined || answer === null) continue;
    const labels = (q.options ?? []).map((o) => o.label);
    // A multiple selection arrives as its labels joined by a comma and a
    // space; a label may itself hold a comma, so labels are matched first.
    let rest = String(answer);
    const picked = [];
    if (q.multiSelect)
      for (const label of [...labels].sort((a, b) => b.length - a.length)) {
        // A label stands between the joins, never inside another value.
        let at = -1;
        for (
          let i = rest.indexOf(label);
          i !== -1;
          i = rest.indexOf(label, i + 1)
        ) {
          const end = i + label.length;
          if (
            (i === 0 || rest.slice(i - 2, i) === ", ") &&
            (end === rest.length || rest.slice(end, end + 2) === ", ")
          ) {
            at = i;
            break;
          }
        }
        if (at === -1) continue;
        picked.push(label);
        const end = at + label.length;
        rest =
          at === 0
            ? rest.slice(end + 2)
            : rest.slice(0, at - 2) + rest.slice(end);
      }
    else if (labels.includes(rest)) {
      picked.push(rest);
      rest = "";
    }
    const notes = result?.annotations?.[q.question]?.notes;
    const noted = typeof notes === "string" && Boolean(notes.trim());
    for (const label of picked)
      values.push({ question: q.question, value: label, picked: true });
    // An answer given only as a note arrives with the host's placeholder in
    // the value's place; the operator typed the note, not the placeholder.
    if (rest.trim())
      values.push(
        noted && rest.trim() === NOTES_ONLY
          ? {
              question: q.question,
              value: rest.trim(),
              picked: false,
              placeholder: true,
            }
          : { question: q.question, value: rest.trim(), picked: false },
      );
    if (noted)
      values.push({
        question: q.question,
        value: notes.trim(),
        picked: false,
        note: true,
      });
  }
  return values;
}

/** The question-tool results in one session's lines, in order. A call in a
 * subagent thread and a result without its call give nothing; a result that
 * is an error is returned unanswered, so a caller can count it and leave it
 * out. `sequence` is the line's position in the session, from one. */
export function questionToolAnswers(lines) {
  const calls = new Map();
  const results = [];
  lines.forEach((line, index) => {
    const content = line?.message?.content;
    if (!line || line.isSidechain || !Array.isArray(content)) return;
    if (line.type === "assistant")
      for (const part of content)
        if (part?.type === "tool_use" && part.name === QUESTION_TOOL)
          calls.set(part.id, { at: line.timestamp, input: part.input });
    if (line.type !== "user") return;
    for (const part of content) {
      if (part?.type !== "tool_result" || !calls.has(part.tool_use_id))
        continue;
      const call = calls.get(part.tool_use_id);
      const answered = !part.is_error;
      results.push({
        answered,
        sentAt: line.timestamp,
        calledAt: call.at,
        sequence: index + 1,
        questions: line.toolUseResult?.questions ?? call.input?.questions ?? [],
        values: answered ? questionAnswer(call.input, line.toolUseResult) : [],
      });
    }
  });
  return results;
}

/** A message body is a string or a list of parts. Its text is read either
 * way, and a part that is not text is named by its kind, never dropped with
 * the text beside it. */
export function messageBody(body) {
  if (typeof body === "string") return { text: body.trim(), others: [] };
  if (!Array.isArray(body)) return { text: "", others: [] };
  return {
    text: body
      .filter((part) => part?.type === "text")
      .map((part) => part.text ?? "")
      .join("\n")
      .trim(),
    others: body
      .filter((part) => part?.type !== "text")
      .map((part) => String(part?.type ?? "unknown")),
  };
}

/** True when a user item is a hook's injection and not the operator's typing. */
export function hookInjected(text, itemType = null) {
  if (typeof itemType === "string" && /hook/i.test(itemType)) return true;
  const t = String(text ?? "").trim();
  const open = /^<((?=[\w-]*hook)[A-Za-z][\w-]*)(?:\s[^>]*)?>/i.exec(t);
  if (!open) return false;
  return new RegExp(`</${open[1]}>$`, "i").test(t);
}

// Review of the second repair. Two more rules. A prompt the host marks as
// sent through its SDK entry point was launched by a tool call, so it is not
// the operator's typing. A line the host repeats in the file of a continued
// session, under the same line identifier, is one line: it is read in the
// file that holds the most lines and passed over in the others.
/** True when the host marks the line as sent through its SDK entry point. */
export function sdkLaunched(line) {
  return [line?.entrypoint, line?.promptSource, line?.turnOrigin].some(
    (mark) => typeof mark === "string" && /^sdk(?:-|$)/i.test(mark),
  );
}

/** For each file, the line identifiers it passes over because another file
 * holds them too. `files` names each file and lists its line identifiers. */
export function repeatedLines(files) {
  const holder = new Map();
  const bySize = [...files].sort(
    (a, b) => b.lines.length - a.lines.length || a.name.localeCompare(b.name),
  );
  for (const { name, lines } of bySize)
    for (const id of lines)
      if (typeof id === "string" && id && !holder.has(id)) holder.set(id, name);
  return new Map(
    files.map(({ name, lines }) => [
      name,
      new Set(lines.filter((id) => holder.has(id) && holder.get(id) !== name)),
    ]),
  );
}
