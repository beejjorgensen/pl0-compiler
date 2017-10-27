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
	out('// Procedure\n');
	out('function ' + procedure.name + '() {\n');
	blockEmitter(procedure.block);
	out('}\n');
}

/**
 * Statement emitter
 */
function statementEmitter(statement) {
	out('// Statement\n');
}

/**
 * Block emitter
 */
function blockEmitter(block) {
	out('// Block\n');
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
	out('// Program\n');
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