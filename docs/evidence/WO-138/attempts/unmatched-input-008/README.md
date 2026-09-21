# First repair matrix — retained, unscored

This matrix ran probe build
`2e72cd2bab60e20f92916121332adbec9d9bca0cbb68734a79d05fe17085c924`.
The remote schema repair worked: all six remote T2 calls reached the model.
Every numerical distribution independently reproduced, but cross-transport
input validation failed. The failing-test candidate's stderr digest embeds its
fresh scratch path, and each transport separately generated its inputs.
T2 therefore had different input and prompt hashes across the two arms.

All 38 records and both manifests are preserved without changed hashes. The
result file is the evaluator's historical output, not a valid qualification.
WO-138-D009 replaces this collector behavior by retaining one input snapshot
for both arms and validating every episode's binding before evaluation.
