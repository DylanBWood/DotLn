#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
int main(int argc,char **argv){
 if(argc!=2)return 2;
 pid_t p=fork();
 if(p<0)return 3;
 if(p>0)_exit(0);
 pid_t g=fork();
 if(g<0)_exit(4);
 if(g>0)_exit(0);
 setsid();
 FILE *out=fopen(argv[1],"w");
 if(out){fprintf(out,"%d\n",getpid());fclose(out);}
 // No allocation; this evidence child expires by itself within two seconds.
 sleep(2);_exit(0);
}

