let patterns = {
	VAR: /VAR/,
	CONST: /CONST/,
	PROCEDURE: /PROCEDURE/,
	CALL: /CALL/,
	WHILE: /WHILE/,
	DO: /DO/,
	BEGIN: /BEGIN/,
	END: /END/,
	IDENTIFIER: /[a-z_][a-z0-9_]*/,
	NUMBER: /[0-9]+/,
	ASSIGNMENT: /:=/,
	WRITE: /!/,
	LPAREN: /\(/,
	RPAREN: /\)/,
	MULT: /\*/,
	DIV: /\//,
	PLUS: /\+/,
	MINUS: /-/,
	EQ: /=/,
	NE: /#/,
	LE: /<=/,
	GE: />=/,
	LT: /</,
	GT: />/,
	COMMA: /,/,
	PERIOD: /\./,
	SEMICOLON: /;/,
	WHITESPACE: /\s/
};


function tokenize(input, ignoreWhitespace=true) {
	let tokens = [];
	let normPatterns = {};

	while (input != '') {
		let tokenized = false;

		for (let token of Object.keys(patterns)) {
			// Modify user patterns to search from start of string
			if (!(token in normPatterns)) {
				normPatterns[token] = new RegExp('^' + patterns[token].source, patterns[token].flags + 'i');
			}

			// Match a token
			let m = input.match(normPatterns[token]);

			if (m !== null && m.index === 0) {
				// Found a match
				tokenized = true;

				let strval = m[0];
				let len = strval.length;

				if (token != 'WHITESPACE' || !ignoreWhitespace) {
					tokens.push({
						token: token,
						length: len,
						strval: strval,
						intval: parseInt(strval),
						floatval: parseFloat(strval)
					});
				}

				// On to the next token
				input = input.slice(len);
				break;
			}
		}

		if (!tokenized) {
			throw `Unrecognized token at: "${input}"`;
		}
	}

	return tokens;
}

module.exports = tokenize;