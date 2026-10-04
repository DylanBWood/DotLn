// Zero-allocation regression: intermediates disappear before a census can see
// them. Each survivor expires independently after five seconds.
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
int main(int argc, char **argv) {
  if (argc != 3) return 2;
  int depth = atoi(argv[2]);
  for (int i = 0; i < depth; i++) {
    pid_t child = fork();
    if (child < 0) _exit(3);
    if (child > 0) _exit(0);
  }
  if (setsid() < 0) _exit(4);
  if (depth > 2) {
    // A mark is a descriptor identity, not a fixed descriptor number.
    if (dup2(STDERR_FILENO, 8) < 0) _exit(5);
    close(STDOUT_FILENO); close(STDERR_FILENO);
  }
  FILE *out = fopen(argv[1], "w");
  if (out) { fprintf(out, "%d\n", getpid()); fclose(out); }
  sleep(5); _exit(0);
}
