/**
 * The Shunting Yard algorithm
 * 
 * https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 */

/*
while there are tokens to be read:
read a token.
if the token is a number, then push it to the output queue.
if the token is an operator, then:
	while there is an operator at the top of the operator stack with
		greater than or equal to precedence and the operator is left associative:
			pop operators from the operator stack, onto the output queue.
	push the read operator onto the operator stack.
if the token is a left bracket (i.e. "("), then:
	push it onto the operator stack.
if the token is a right bracket (i.e. ")"), then:
	while the operator at the top of the operator stack is not a left bracket:
		pop operators from the operator stack onto the output queue.
	pop the left bracket from the stack.
	** if the stack runs out without finding a left bracket, then there are
	mismatched parentheses. **


if there are no more tokens to read:
while there are still operator tokens on the stack:
	** if the operator token on the top of the stack is a bracket, then
	there are mismatched parentheses. **
	pop the operator onto the output queue.
exit.
*/

const precedence = {
	'UNARY_MINUS': 0,
	'UNARY_PLUS': 0,
	'PLUS': 10,
	'MINUS': 10,
	'MULT': 20,
	'DIV': 20,
};

function isOperator(token) {
	let t = token.token;

	// A little hackish, but this allows you to use a token or a token
	// name:
	if (t === undefined) {
		t = token;
	}

	return !!(precedence[t]);
}

function isUnary(token) {
	return ['UNARY_PLUS', 'UNARY_MINUS'].includes(token.token);
}

class ShuntingYard {
	constructor() {
		this.reset();
	}

	reset() {
		this.queue = []; // RPN output queue, 1, 2, x, PLUS, etc.
		this.stack = []; // operators, MULT, PLUS, etc.
	}

	stackPeek() {
		return this.stack[this.stack.length - 1];
	}

	process(token) {
		if (token.token == 'IDENTIFIER') {
			this.queue.push(token.strval);
		}

		else if (token.token == 'NUMBER') {
			this.queue.push(token.intval);
		}

		else if (isOperator(token)) {
			let topOp = this.stackPeek();

			while (this.stack.length > 0 && precedence[topOp] > precedence(token.token)) {
				topOp = this.stack.pop();
				this.queue.push(topOp);

				topOp = this.stackPeek();
			}

			this.stack.push(token.token);
		}

		else if (token.token == 'LPAREN') {
			this.stack.push(token.token);
		}

		else if (token.token == 'RPAREN') {
			let topOp = this.stackPeek();

			while (topOp != 'LPAREN') {
				topOp = this.stack.pop();
				if (topOp === undefined) {
					throw 'mismatched parens';
				}
				this.queue.push(topOp);

				topOp = this.stackPeek();
			}

			// Pop and discard left paren
			this.stack.pop();
		}
	}

	/**
	 * Call this after sending the last token to process()
	 */
	complete() {
		let topOp = this.stackPeek();

		while (topOp !== undefined) {
			topOp = this.stack.pop();

			if (topOp == 'LPAREN' || topOp == 'RPAREN') {
				throw 'mismatched parens';
			}

			this.queue.push(topOp);

			topOp = this.stackPeek();
		}
	}

	/**
	 * Return RNP of expression
	 * 
	 * NOTE: Only valid after complete() called
	 */
	getRPN() {
		return this.queue;
	}

	/**
	 * Return AST of expression
	 * 
	 * NOTE: Only valid after complete() called
	 */
	getAST() {
		let convStack = [];
		let topOp;
		let queueCopy = this.queue.slice(); // Be nondestructive

		topOp = queueCopy.shift();

		while (topOp !== undefined) {

			if (isOperator(topOp)) {
				let node = {
					type: 'Operator',
					value: topOp
				};

				if (isUnary(topOp)) {
					node.operand = [ convStack.pop() ];

				} else {
					// Binary
					node.operand = [
						convStack.pop(),
						convStack.pop()
					];
				}

				convStack.push(node);

			} else {
				// Not an operator
				convStack.push({
					type: 'Operand',
					value: topOp
				});
			}

			topOp = queueCopy.shift();
		}

		return convStack;

	}
}

module.exports = ShuntingYard;