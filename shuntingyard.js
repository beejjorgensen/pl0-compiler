/**
 * The Shunting Yard algorithm
 * 
 * https://en.wikipedia.org/wiki/Shunting-yard_algorithm
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

	return precedence[t] !== undefined;
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

		else if (isOperator(token.token)) {
			let topOp = this.stackPeek();

			while (this.stack.length > 0 && precedence[topOp] > precedence[token.token]) {
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
					node.operand = [ null, convStack.pop() ];

				} else {
					// Binary
					let op2 = convStack.pop();
					let op1 = convStack.pop();
					node.operand = [
						op1,
						op2,
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