// Reproduce the prior reports serially. Exit 0 means execution completed;
// inspect each emitted outcome to judge the product. No native model or forge.
for (const name of [
  "verification-003-probes.mjs",
  "verification-004-probes.mjs",
  "verification-005-probes.mjs",
  "verification-005-adversary-probes.mjs",
]) {
  const original = console.log;
  console.log = (line) => {
    try {
      original(JSON.stringify({ source: name, observation: JSON.parse(line) }));
    } catch {
      original(line);
    }
  };
  try {
    await import(new URL(name, import.meta.url));
  } finally {
    console.log = original;
  }
}
