/**
 * Emitter (JavaScript)
 */

let output;

/**
 * Write output inefficiently
 */
function out(s) {
	output += s;
}

/**
 * Procedure emitter
 */
function procedureEmitter(procedure) {
	//out('PROCEDURE');
	out('function ' + procedure.name + '() {\n');
	blockEmitter(procedure.block);
	out('}\n');
}

/**
 * Condition emitter
 */
function expressionEmitter(expression) {
	const operMap = {
		UNARY_MINUS: '-',
		UNARY_PLUS: '+',
		MINUS: '-',
		PLUS: '+',
		MULT: '*',
		DIV: '/'
	};

	//out('EXPR');

	let root = expression.tree;

	function inOrder(node) {
		if (!node) { return; }

		if (node.type == 'Operator') {
			out('(');

			// Go left
			inOrder(node.operand[0]);

			let operSym = operMap[node.value];

			if (!operSym) {
				throw 'unknown operator type: ' + node.value;
			}

			out(operSym);

			// Go right
			inOrder(node.operand[1]);

			out(')');
		}

		else if (node.type == 'Operand') {
			out(node.value);
		}

		else {
			throw 'unknown expression node type: ' + node.type;
		}
	}

	inOrder(root);
}

/**
 * Expression emitter
 */
function conditionEmitter(condition) {
	const compMap = {
		EQ: '=',
		NE: '!=',
		LT: '<',
		GT: '>',
		LE: '<=',
		GE: '>='
	};

	if (condition.type == 'Odd') {
		out('(((');
		expressionEmitter(condition.expression);
		out(')%2) == 1)');
	}

	else if (condition.type in compMap) {
		let comp = compMap[condition.type];

		out('((');
		expressionEmitter(condition.expression[0]);
		out(`) ${comp} (`);
		expressionEmitter(condition.expression[1]);
		out('))');
	}

	else {
		throw 'unknown condition type: ' + condition.type;
	}

}

/**
 * Statement emitter
 */
function statementEmitter(statement) {
	//out('STATEMENT');

	if (statement.type == 'CompoundStatement') {
		out('{\n');
		for (let s of statement.statements) {
			statementEmitter(s);
		}
		out('}\n');
	}

	else if (statement.type == 'Call') {
		out(statement.identifier + '();\n');
	}

	else if (statement.type == 'Assignment') {
		out(statement.identifier + ' = ');
		expressionEmitter(statement.expression);
		out(';\n');
	}

	else if (statement.type == 'Write') {
		out(`console.log(${statement.identifier});\n`);
	}

	else if (statement.type == 'IfThen') {
		out('if (');
		conditionEmitter(statement.condition);
		out(') ');
		statementEmitter(statement.statement);
		out('\n');
	}

	else if (statement.type == 'While') {
		out('while (');
		conditionEmitter(statement.condition);
		out(') ');
		statementEmitter(statement.statement);
		out('\n');
	}

	else {
		throw 'Unknown statement type: ' + statement.type;
	}
}

/**
 * Block emitter
 */
function blockEmitter(block) {
	//out('BLOCK\n');
	//out('{\n');

	for (let sym in block.symbol) {
		let symData = block.symbol[sym];
		if (symData.const) {
			out(`const ${sym} = ${symData.val};\n`);
		} else {
			out(`let ${sym};\n`);
		}
	}

	for (let procedure of block.procedure) {
		procedureEmitter(procedure);
	}

	statementEmitter(block.statement);
	//out('}\n');
}

/**
 * Program emitter
 */
function programEmitter(program) {
	//out('PROGRAM');
	out(';(function () {\n');

	blockEmitter(program.block);

	out('}());\n');
}

/**
 * Convert AST into JS
 */
function emitJS(ast) {
	output = '';

	if (ast.type != 'Program') {
		throw 'root node needs to be of type Program';
	}

	// Start at the root node
	programEmitter(ast);

	return output;
}

module.exports = emitJS;