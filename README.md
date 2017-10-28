# Simple PL/0 Compiler

This converts PL/0 code to JavaScript via an AST.

The Shunting Yard Algorithm is used for mathematical expressions.

Includes these bits:

* tokenizer
* parser
* emitter (JavaScript)
* shunting yard

## Usage

Right now, the PL/0 source is hardcoded in `compiler.js`. (Obviously
that's scheduled to change.)

    node compiler > foo.js
	node foo.js

## Caveats

This isn't the most efficient code, by any means. The tokenizer and
emitter constantly make new strings, for example.

## TODO

* Accept input filename on command line
* Finish implementing `ODD`
* `?` statment
* Report symbol table-related errors
* Add a C emitter
* Moar testing!

## References

* [PL/0 at Wikipedia](https://en.wikipedia.org/wiki/PL/0)
* [Recursive Descent Parsing at Wikipedia](https://en.wikipedia.org/wiki/Recursive_descent_parser)
* [Shunting Yard Algorithm at Wikipedia](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
* [Write your own (LISP-y) Compiler](http://blog.klipse.tech/javascript/2017/02/08/tiny-compiler-intro.html)