#!/usr/bin/env node

var symlinker = require('./symlinker.js');

var argv = require('optimist')
	.usage("Usage: $0 file")
	.demand(['_'])
	.default('t', 'advanced-newline')
	.alias('s', 'source')
	.alias('d', 'destination')
	.alias('c', 'create')
	.alias('f', 'skip')
	.alias('r', 'recreate')
	.alias('i', 'ignore')
	.alias('t', 'type')
	.describe('s', 'specify the source folder')
	.describe('d', 'specify the destination folder')
	.describe('f', 'skips invalid paths')
	.describe('r', 'force symbolic link recreation for existing symbolic links')
	.describe('i', 'ignores file not found errors')
	.describe('t', 'Specifies the format of the Symlinker-file. Supported: json, text-newline, advanced-newline. Default: advanced-newline')
	.argv;

function replaceBackslash (str) {
	var reg = new RegExp("\\\\", 'g');
	return str.replace(reg, "/");
}

/* Setting Variables */
// argv

var filePath = replaceBackslash(argv._[0]);

if (argv.t != 'advanced-newline') {
	var destinationPath = replaceBackslash(argv.d);
	var sourcePath = replaceBackslash(argv.s);
} else {
	var destinationPath = false;
	var sourcePath = false;
}

symlinker.open({
	path: filePath,
	type: argv.t || 'advanced-newline',
	source: argv.s || null,
	destination: argv.d || null,
	forceCreation: argv.f || false,
	forceRecreation: argv.r || false,
	isIgnoring: argv.i || false
});
