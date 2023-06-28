#!/bin/bash

echo "Content-Type: application/json"
echo

awk ' 
    BEGIN { printf("["); r=0 } 
    { 
        if(r > 0) {
            printf(",");
        } 
        printf("\"%s\"", $0); 
        r = r + 1;
    } 
    END { 
        print("]")
    }
    ' > tags.json

cat tags.json

