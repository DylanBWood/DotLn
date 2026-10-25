/** Describe the subject's own changes without rebinding its activation base. */
export function targetBase(read, activationBase, subjectCommit, baseTip) {
  const mergeBase = baseTip
    ? read(["merge-base", subjectCommit, baseTip], {
        onFailure: () => null,
      })
    : null;
  const baseCommit =
    mergeBase &&
    read(["merge-base", "--is-ancestor", activationBase, mergeBase], {
      onFailure: () => false,
    }) !== false
      ? mergeBase
      : activationBase;
  return { baseCommit, activationBase };
}
