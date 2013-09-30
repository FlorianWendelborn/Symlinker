/* Requiring */
var argv = require('optimist')
	.usage("Usage: $0 file -s [source] -d [destination] -c [boolean: forceDestinationCreation] -f [boolean: forceSymbolicLinkCreation] -r [boolean: forceSymbolicLinkRecreation")
	.demand(['_','s','d'])
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
var filePath = replaceBackslash(argv._[0]);console.log(filePath);
var destinationPath = replaceBackslash(argv.d);
var sourcePath = replaceBackslash(argv.s);

var forceCreation = argv.f;
var forceRecreation = argv.r;
var forceDestinationCreation = argv.c;

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
	console.log("Could not read the provided symlinker file.\n" + filePath);
	process.exit();
}

sourceExists = fs.existsSync(sourcePath);	

if (!sourceExists) {
	console.log("Source folder not found.\n" + sourcePath);
	process.exit();
}

destinationExists = fs.existsSync(destinationPath);

if (!destinationExists) {
	console.log("Destination folder not found.\n" + destinationPath);
	if (!forceDestinationCreation) {
		console.log("Use -c if you want Symlinker to create the destination folder.");
		process.exit();
	} else {
		console.log("Creating destination folder.");
		mkdirp.sync(destinationPath);
	}
}

/* Parsing Symlinker File */

try {
	file = JSON.parse(rawFile);
} catch (err) {
	console.log("Could not parse the provided symlinker file.\n" + filePath);
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
			process.exit();
		}
	} else {
		try {
			var dirs = putPath.slice(0,putPath.lastIndexOf("/"));
			mkdirp(dirs);
			try {
				var isSymbolicLink = fs.lstatSync(putPath).isSymbolicLink();
				if (isSymbolicLink) {
					if (!forceRecreation) {
						console.log("Symbolic link " + putPath  + " already exists.\nUse -r to force symbolic link recreation.");
						process.exit();
					} else {
						fs.unlinkSync(putPath);
					}
				}
			} catch (err) {
				// file doesn't exist
			}

			fs.symlinkSync(getPath, putPath, "dir");
			console.log("Created " + putPath);
		} catch (err) {
			throw(err);
			console.log("Error creating symbolic link " + getPath + " -> " + putPath);
			process.exit();
		}
	}
}