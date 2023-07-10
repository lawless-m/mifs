BEGIN { 
	printf("[");
	and = "";
}

{ 
	printf("%s\"%s\"", and, $0);
	and = ","
}

END { printf("]") }
