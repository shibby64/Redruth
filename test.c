#include <stdio.h>
#include <sys/types.h>

int main() {
    fork();
    printf("hellp\n");
    fork();
    printf("bye\n");
    return 0;
}