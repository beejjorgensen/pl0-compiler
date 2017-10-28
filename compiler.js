/**
 * Main compiler executor
 */

const tokenizer = require('./tokenizer');
const parser = require('./parser');
const emitJS = require('./emitjs');

let input = `VAR x, sqr, temp;
PROCEDURE square;
BEGIN
   sqr:= x * x
END;

BEGIN
	x := 1;
	WHILE x <= 10 DO
	BEGIN
		CALL square;
		! sqr;
		x := x + 1
	END
END.
`;

let tokens = tokenizer(input);
//console.log(JSON.stringify(tokens, null, 4));

let ast = parser(tokens);
//console.log(JSON.stringify(ast, null, 4));

let js = emitJS(ast);
console.log(js);