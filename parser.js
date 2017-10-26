/*
 * TODO
 * Symbol table local
 */

let curToken;
let curIndex;
let allTokens;

let symbolTable = {};

/**
 * Get previous tokens without changing curToken
 */
function prevToken(n=0) {
	return allTokens[curIndex - n - 2];
}

/**
 *  Take the next token off the front of the list
 */
function nextToken() {
	curToken = allTokens[curIndex];
	curIndex++;
}

/**
 * Return true if the next token matches
 */
function accept(t) {
	if (curToken.token == t) {
		nextToken();
		return true;
	}

	return false;
}

/**
 * Return true iif next token matches, otherwise throw an exception
 */
function expect(t) {
	if (!accept(t)) {
		throw 'unexpected symbol: ' + curToken.strval;
	}

	return true;
}

/**
 * Parse a condition
 * 
 * condition =
 *   "odd" expression
 *   | expression ("="|"#"|"<"|"<="|">"|">=") expression .
 */
function parseCondition() {
	let astNode;

	if (accept('ODD')) {
		astNode = {
			type: 'Odd',
			expression: parseExpression()
		};
	} else {
		let expression1 = parseExpression();

		if (['EQ', 'NE', 'LT', 'LE', 'GT', 'GE'].includes(curToken.token)) {
			nextToken();
			astNode = {
				type: prevToken().token, // EQ, NE, etc.
				expression: [
					expression1,
					parseExpression()
				]
			};
		} else {
			throw 'condition: invalid operator: ' + curToken.strval;
		}
	}

	return astNode;
}

/**
 * Parse a factor
 * 
 * factor =
 *   ident
 *   | number
 *   | "(" expression ")" .
 */
function parseFactor() {
	if (accept('IDENTIFIER')) {
		null;
	} else if (accept('NUMBER')) {
		null;
	} else if (accept('LPAREN')) {
		parseExpression();
		expect('RPAREN');
	} else {
		throw 'syntax error: ' + curToken.strval;
	}
}

/**
 * Parse a product term
 * 
 * term = factor {("*"|"/") factor} .
 */
function parseTerm() {
	parseFactor();

	while (['MULT', 'DIV'].includes(curToken.token)) {
		nextToken();
		parseFactor();
	}
}

/**
 * Parse an expression
 * 
 * expression = ["+"|"-"] term {("+"|"-") term} .
 */
function parseExpression() {
	if (curToken.token == 'PLUS' || curToken.token == 'MINUS') {
		nextToken();
	}

	parseTerm();

	while (curToken.token == 'PLUS' || curToken.token == 'MINUS') {
		nextToken();
		parseTerm();
	}
}

/**
 * Parse a statement
 * 
 *  statement =
 *   ident ":=" expression
 *   | "call" ident
 *   | "begin" statement {";" statement } "end"
 *   | "if" condition "then" statement
 *   | "while" condition "do" statement .
 */
function parseStatement() {
	let astNode;

	if (accept('IDENTIFIER')) {
		expect('ASSIGNMENT');
		astNode = {
			type: 'Assignment',
			identifier: prevToken(1).strval,
			expression: parseExpression()
		};

	} else if (accept('CALL')) {
		expect('IDENTIFIER');
		astNode = {
			type: 'Call',
			identifier: prevToken().strval
		};

	} else if (accept('WRITE')) {
		parseExpression();
		astNode = {
			type: 'Write',
			identifier: prevToken().strval
		};

	} else if (accept('BEGIN')) {
		astNode = {
			type: 'CompoundStatement',
			statements: []
		};

		do {
			astNode.statements.push(parseStatement());
		} while (accept('SEMICOLON'));
		expect('END');

	} else if (accept('IF')) {
		astNode = {
			type: 'IfThen',
		};

		astNode.condition = parseCondition();

		expect('THEN');

		astNode.statement = parseStatement();

	} else if (accept('WHILE')) {
		astNode = {
			type: 'While'
		};

		astNode.condition = parseCondition();

		expect('DO');

		astNode.statement = parseStatement();

	} else {
		throw 'syntax error: ' + curToken.strval;
	}

	return astNode;
}

/**
 * Parse a block
 * 
 * block =
 *   ["const" ident "=" number {"," ident "=" number} ";"]
 *   ["var" ident {"," ident} ";"]
 *   {"procedure" ident ";" block ";"} statement .
 */
function parseBlock() {
	let astNode = {
		procedure: [],
		statement: null
	};

	if (accept('CONST')) {
		do {
			expect('IDENTIFIER');
			expect('EQ');
			expect('NUMBER');
			symbolTable[prevToken(2).strval] = {
				const: true,
				val: prevToken().intval
			};
		} while (accept('COMMA'));

		expect('SEMICOLON');
	}

	if (accept('VAR')) {
		do {
			expect('IDENTIFIER');
			symbolTable[prevToken().strval] = { const: false };
		} while (accept('COMMA'));
		expect('SEMICOLON');
	}

	while (accept('PROCEDURE')) {
		expect('IDENTIFIER');
		let id = prevToken().strval;
		expect('SEMICOLON');
		let b = parseBlock();
		expect('SEMICOLON');

		astNode.procedure.push({
			name: id, 
			block: b
		});
	}

	astNode.statement = parseStatement();

	return astNode;
}

/**
 * Parse the main program block
 * 
 * program = block "." .
 */
function parseProgram() {
	let astNode = {
		type: 'Program'
	};

	nextToken();
	astNode.block = parseBlock();
	expect('PERIOD');

	return astNode;
}

/**
 * Main exported function
 */
function parse(tokens) {
	allTokens = tokens;
	curIndex = 0;

	return parseProgram();
}

module.exports = parse;