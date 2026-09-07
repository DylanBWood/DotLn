import { runGit } from "./git.mjs";

// Public author identity on the commit that landed the license decision.
// This exemption never follows the publishing user's mutable Git config.
export const operatorAuthor = "Dylan Wood <dylanwoodconsulting@gmail.com>";

export const contributionSignoffRules = (root) => {
  const base = runGit(root, [
    "rev-parse",
    "--verify",
    "refs/remotes/origin/main^{commit}",
  ]);
  const commits = runGit(root, ["rev-list", "--reverse", `${base}..HEAD`])
    .split("\n")
    .filter(Boolean);
  return commits.map((commit) => {
    const [name, email, message] = runGit(
      root,
      ["show", "-s", "--format=%an%x00%ae%x00%B", commit],
      { trim: false },
    ).split("\0");
    const author = `${name} <${email}>`;
    const exempt = author === operatorAuthor;
    const trailers = runGit(root, ["interpret-trailers", "--parse"], {
      input: message,
    });
    const signed = trailers
      .split("\n")
      .some(
        (line) =>
          /^Signed-off-by:[ \t]+/i.test(line) &&
          line.replace(/^[^:]+:[ \t]+/, "") === author,
      );
    const pass = exempt || signed;
    // Commit IDs identify findings without repeating contributors' identities.
    return {
      pass,
      line: `${pass ? "PASS" : "FAIL"} contribution-signoff ${commit.slice(0, 12)}: observed ${exempt ? "operator author" : signed ? "matching author sign-off" : "outside author without matching sign-off"}; expected ${exempt ? "operator exemption (no sign-off required)" : "Signed-off-by trailer matching the commit author (DCO 1.1)"}`,
    };
  });
};
