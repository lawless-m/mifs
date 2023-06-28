BEGIN { 
	printf("[");
	and = "";
}

/\.webp$/ { 
	txt = $1;
	gsub(/\.webp$/, "", txt); 
	printf("%s\"%s\"", and, txt);
	and = ","
}

END { printf("]") }
