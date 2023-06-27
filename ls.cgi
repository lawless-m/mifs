#!/bin/bash

echo "Content-Type: text/plain"
echo

IFS='&'
for param in $QUERY_STRING; do
  if [[ "$param" == dir=* ]]; then
    ls `basename ${param#*=}` | awk -f ./webp2json.awk
  fi
done

 
