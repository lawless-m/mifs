#!/bin/bash

echo "Content-Type: application/json;charset=utf-8"
echo

webp2json() {
	cd $1 
	ls | awk -f ../webp2json.awk
}

describes() {
	cd $1
	ls *.txt | awk -f ../describes2json.awk
}

IFS='&'
for param in $QUERY_STRING; do
	if [[ "$param" == dir=* ]]; then
		dir=`basename ${param#*=}`
		if [[ $dir == describes ]]; then
			( describes $dir )
		else
			( webp2json $dir )
		fi
	fi
done

 
