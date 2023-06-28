BEGIN { 
	printf("{")
	and = ""
}

/\.txt$/ {
	txt = $1
	gsub(/\.txt$/, "", txt);
	printf("%s\"%s\":", and, txt)
    system(sprintf("../describe_json < %s", $0))
    and = ","
}

END { printf("}") }
