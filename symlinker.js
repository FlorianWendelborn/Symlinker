#!/usr/bin/env node
/* dependencies */
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
	.describe('c', 'force creation of destination folder')
	.describe('f', 'skips invalid paths')
	.describe('r', 'force symbolic link recreation for existing symbolic links')
	.describe('i', 'ignores file not found errors')
	.describe('t', 'Specifies the format of the Symlinker-file. Supported: json, text-newline, advanced-newline. Default: advanced-newline')
	.argv;

var mkdirp = require('mkdirp');

var fs = require('fs');

/* basic functions */

function replaceBackslash (str) {
	var reg = new RegExp("\\\\", 'g');
	return str.replace(reg, "/");
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
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

var forceCreation = argv.f;
var forceRecreation = argv.r;
var forceDestinationCreation = argv.c;
var isIgnoring = argv.i;

var parseType = argv.t;

// resources
var rawFile;

/* Validating */
try {
	rawFile = fs.readFileSync(filePath, 'utf8');
} catch (err) {
	console.log("Could not read the provided Symlinker file.\n" + filePath);
	process.exit(1);
}

/* Parsing Symlinker File */

var task = new Array();

switch (parseType) {
	case "text-newline":
		try {
				task = [{
				'input': argv.s,
				'items': rawFile.replace(/(\r)/gm,"").split("\n"),
				'output': argv.d
			}];
		} catch (err) {
			console.log("Could not parse the provided Symlinker file.\n" + filePath);
			process.exit(1);
		}
	break;
	case "json":
		try {
			task = [{
				'input': argv.s,
				'items': JSON.parse(rawFile),
				'output': argv.d
			}];
		} catch (err) {
			console.log("Could not parse the provided Symlinker file.\n" + filePath);
			process.exit(1);
		}
	break;
	case "advanced-newline":
		try {

			var temp = rawFile.replace(/(\r)/gm,"").split("\n");

			var queue = new Object();
			
			for (var i = 0; i < temp.length; i++) {
				
				var content = temp[i].slice(1);

				switch(temp[i][0]) {
					case '$':
						queue = {'input': content,'items':[]};
					break;
					case '-':
						queue.items.push(content);
					break;
					case '>':
						queue.output = content;
						task.push(clone(queue));
					break;
					case undefined: break;
					case '#': break;
					default:
						console.log("invalid file syntax " + JSON.stringify(temp[i]) + " in line " + i);
				}
			}
		} catch (err) {
			console.error("Could not parse the provided Symlinker file.\n" + filePath);
			process.exit(1);
		}
	break;
	default:
		console.error("Invalid value for Symlinker-file type.");
		process.exit(1);
}

for (var i = 0; i < task.length; i++) {
	var q = task[i];

	// checking if source folder is valid
	var valid = fs.existsSync(q.input);

	if (!valid && !forceCreation) {
		console.error('Path isn\'t valid: ' + q.input)
	} else {
		console.log('\n$' + q.input);
		for (var j = 0; j < q.items.length; j++) {
			try {
				var outputPath = q.output + '/' + q.items[j];
				var inputPath = q.input + '/' + q.items[j];
				var dirs = outputPath.slice(0,outputPath.lastIndexOf('/'));
				mkdirp.sync(dirs);
				try {
					if (fs.lstatSync(outputPath).isSymbolicLink()) {
						if (!forceRecreation) {
							console.log("Symbolic link " + outputPath  + " already exists.\nUse -r to force symbolic link recreation.");
							process.exit(1);
						} else {
							fs.unlinkSync(outputPath);
						}
					}
				} catch (err) {
					// file doesn't exist
				}
				var stats = fs.lstatSync(inputPath);
				if (stats.isDirectory()) {
					fs.symlinkSync(inputPath, outputPath, 'dir');
				} else if (stats.isFile()) {
					fs.symlinkSync(inputPath, outputPath, 'file');
				} else if (!isIgnoring) {
					console.log("Could not create symbolic link. " + inputPath + " is neither a file nor a folder. Use -i to allow Symlinker to continue after this error.");
					process.exit(1);
				}
				console.log('-' + q.items[j]);
			} catch (err) {
				console.error(err);
				console.error('Error creating symlink ' + q.input + ' -> ' + q.output);
				process.exit(1);
			}
		}
		console.log('>' + q.output);
	}
}