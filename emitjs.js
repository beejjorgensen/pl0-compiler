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
	out('function ' + procedure.name + '() {\n');
	blockEmitter(procedure.block);
	out('}\n');
}

/**
 * Statement emitter
 */
function statementEmitter(statement) {
	out('STATEMENT\n');
}

/**
 * Block emitter
 */
function blockEmitter(block) {
	for (let procedure of block.procedure) {
		procedureEmitter(procedure);
	}

	statementEmitter(block.statement);
}

/**
 * Program emitter
 */
function programEmitter(program) {
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