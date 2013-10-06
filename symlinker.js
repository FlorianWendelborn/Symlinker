/* Requiring */
var argv = require('optimist')
	.usage("Usage: $0 file -s [source] -d [destination]")
	.demand(['_','s','d'])
	.default('t', 'text-newline')
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
	.describe('t', 'Specifies the format of the Symlinker-file. Supported: json, text-newline. Default: text-newline')
	.argv;

var mkdirp = require('mkdirp');

var fs = require('fs');

/* Replace Backslash Function */

function replaceBackslash (str) {
	var reg = new RegExp("\\\\", 'g');
	return str.replace(reg, "/");
}

/* Setting Variables */
// argv
var filePath = replaceBackslash(argv._[0]);
var destinationPath = replaceBackslash(argv.d);
var sourcePath = replaceBackslash(argv.s);

var forceCreation = argv.f;
var forceRecreation = argv.r;
var forceDestinationCreation = argv.c;
var isIgnoring = argv.i;

var parseType = argv.t;

// validation
var sourceExists;
var destinationExists;

// resources
var rawFile;
var file;

/* Validating */
try {
	rawFile = fs.readFileSync(filePath, 'utf8');
} catch (err) {
	console.log("Could not read the provided Symlinker file.\n" + filePath);
	process.exit(1);
}

sourceExists = fs.existsSync(sourcePath);	

if (!sourceExists) {
	console.log("Source folder not found.\n" + sourcePath);
	process.exit(1);
}

destinationExists = fs.existsSync(destinationPath);

if (!destinationExists) {
	console.log("Destination folder not found.\n" + destinationPath);
	if (!forceDestinationCreation) {
		console.log("Use -c if you want Symlinker to create the destination folder.");
		process.exit(1);
	} else {
		console.log("Creating destination folder.");
		mkdirp.sync(destinationPath);
	}
}

/* Parsing Symlinker File */

switch (parseType) {
	case "text-newline":
		file = rawFile.replace(/(\r)/gm,"").split("\n");
		if(file.length == 1 && file[0].charAt(0) == "[") {
			try {
				 JSON.parse(rawFile);
				 console.log("This Symlinker-file looks like json but -t json was missing.");
				 process.exit();
			} catch (err) {

			}
		}
	break;
	case "json":
		try {
			file = JSON.parse(rawFile);
		} catch (err) {
			console.log("Could not parse the provided Symlinker file.\n" + filePath);
		}
	break;
	default:
		console.log("Invalid value for Symlinker-file type.");
		process.exit();
}

/* Iterating */
for (var i = 0; i < file.length; i++) {
	// setting path
	var getPath = sourcePath + "/" + file[i];
	var putPath = destinationPath + "/" + file[i];

	// checking if source folder is valid
	var valid = fs.existsSync(getPath);

	if (!valid) {
		if (!forceCreation) {
			console.log("Path isn't valid: " + getPath + "\nUse -f if you want Symlinker to force symbolic link creation for invalid sources.");
			process.exit(1);
		}
	} else {
		try {
			var dirs = putPath.slice(0,putPath.lastIndexOf("/"));
			mkdirp.sync(dirs);
			try {
				var isSymbolicLink = fs.lstatSync(putPath).isSymbolicLink();
				if (isSymbolicLink) {
					if (!forceRecreation) {
						console.log("Symbolic link " + putPath  + " already exists.\nUse -r to force symbolic link recreation.");
						process.exit(1);
					} else {
						fs.unlinkSync(putPath);
					}
				}
			} catch (err) {
				// file doesn't exist
			}
			var stats = fs.lstatSync(getPath);
			if (stats.isDirectory()) {
				fs.symlinkSync(getPath, putPath, "dir");
			} else if (stats.isFile()) {
				fs.symlinkSync(getPath, putPath, "file");
			} else {
				if (!isIgnoring) {
					console.log("Could not create symbolic link. " + getPath + " is neither a file nor a folder. Use -i to allow Symlinker to continue after this error.");
					process.exit(1);
				}
			}
			console.log("Created " + putPath);
		} catch (err) {
			console.log("Error creating symbolic link " + getPath + " -> " + putPath);
			throw(err);
			process.exit(1);
		}
	}
}