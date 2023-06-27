BEGIN { 
	printf("[");
	w = 1;
}

/\.webp$/ { 
	if(w > 1) { printf(","); }
	txt = $1;
	gsub(/\.webp$/, "", txt); 
	printf("\"%s\"", txt);
	w = w + 1;
}

END { printf("]") }
