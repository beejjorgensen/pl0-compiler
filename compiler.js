/**
 * From https://en.wikipedia.org/wiki/Recursive_descent_parser
 */

const tokenizer = require('./tokenizer');
const parser = require('./parser');
const emitJS = require('./emitjs');

let input = `VAR x, sqr;
PROCEDURE square;
BEGIN
   squ:= x * x
END;

BEGIN
	x := 1;
	WHILE x <= 10 DO
	BEGIN
		CALL square;
		! squ;
		x := x + 1
	END
END.
`;

let tokens = tokenizer(input);
//console.log(JSON.stringify(tokens, null, 4));

let ast = parser(tokens);
console.log(JSON.stringify(ast, null, 4));

let js = emitJS(ast);
console.log(js);