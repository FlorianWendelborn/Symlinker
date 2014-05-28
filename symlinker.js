var mkdirp = require('mkdirp');

var path = require('path');

var fs = require('fs');

/* basic functions */

function clone(obj){
	if(obj == null || typeof(obj) != 'object')
		return obj;

	var temp = obj.constructor();

	for(var key in obj)
		temp[key] = clone(obj[key]);
	return temp;
}

function open (options) {
	var rawFile;
	// options:
	// -path
	// -type
	// -(sourcePath)
	// -(destinationPath)
	// -(options.forceCreation)

	/* Validating */
	try {
		rawFile = fs.readFileSync(options.path, 'utf8');
	} catch (err) {
		console.log("Could not read the provided Symlinker file.\n" + options.path);
		process.exit(1);
	}

	/* Parsing Symlinker File */

	var task = new Array();

	switch (options.type) {
		case "text-newline":
			try {
					task = [{
					'input': options.sourcePath,
					'items': rawFile.replace(/(\r)/gm,"").split("\n"),
					'output': options.destinationPath
				}];
			} catch (err) {
				console.log("Could not parse the provided Symlinker file.\n" + options.path);
				process.exit(1);
			}
		break;
		case "json":
			try {
				task = [{
					'input': options.sourcePath,
					'items': JSON.parse(rawFile),
					'output': options.destinationPath
				}];
			} catch (err) {
				console.log("Could not parse the provided Symlinker file.\n" + options.path);
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
				console.error("Could not parse the provided Symlinker file.\n" + options.path);
				process.exit(1);
			}
		break;
		default:
			console.error("Invalid value for Symlinker-file type.");
			process.exit(1);
	}
	runTasks(task);
}

function runTasks (task) {
	for (var i = 0; i < task.length; i++) {
		var q = task[i];

		// checking if source folder is valid
		var valid = fs.existsSync(q.input);

		if (!valid && !options.forceCreation) {
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
							if (!options.forceRecreation) {
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
					} else if (!options.isIgnoring) {
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
}

function basic (sourcePath, destinationPath, options, callback) {	
	try {
		if (fs.lstatSync(destinationPath).isSymbolicLink()) {
			if (!options.recreateSymbolicLinks) {
				return callback(new Error('Could not create symbolic link. Destination is already a symbolic link.'));
			} else {
				fs.unlinkSync(destinationPath);
			}
		}
	} catch (err) {
		// file doesn't exist
	}
	
	if (fs.existsSync(sourcePath)) { // source path is valid
		mkdirp.sync(path.dirname(destinationPath));
		var stats = fs.lstatSync(sourcePath);
		if (stats.isDirectory()) {
			fs.symlinkSync(sourcePath, destinationPath, 'dir');
			return callback(null, true);
		} else if (stats.isFile()) {
			fs.symlinkSync(sourcePath, destinationPath, 'file');
			return callback(null, true);
		} else {
			return callback(new Error('Could not create symbolic link. Source is neither a file nor a folder.'), null);
		}
	} else { // source path is invalid
		callback(new Error('Could not create symbolic link. Source doesn\'t exist.'));
	}
}

var queue = [];
var queueRunning;

var taskId = 0;
var tasks = []

function advanced (list, options, callback) {
	// list
	// - task {source, destination, files:[{path, name}, *]}
	// - task {source, destination, files:[{path, name}, *]}

	var queueId = taskId++;

	tasks[taskId] = {
		total: list.length,
		finished: 0,
		active: true,
		callback: function (err, data) {
			callback(err, data);
		},
		options: options
	};

	for (var i = 0; i < list.length; i++) {
		var currentTask = list[i];
		queue.push({
			source: currentTask.source,
			destination: currentTask.destination,
			files: currentTask.files,
			id: queueId
		});
	}

	if (!queueRunning) runQueue();
}

function runQueue () {
	queueRunning = true;

	console.log('runQueue: starting with ' + queue.length + ' tasks.');

	while (queue.length) {
		// {source, destination, files:[{path, name}, *], id}
		var currentTask = queue.shift();
		
		// {total, finished, active, callback}
		var queueInfo = tasks[currentTask.id];

		// check activity
		if (!queueRunning.active) continue; // skip task

		// get paths
		var sourcePath = path.normalize(currentTask.source);
		var destinationPath = path.normalize(currentTask.destination);
		var destinationDir = path.dirname(destinationPath);

		// validify
		var sourceValid = fs.existsSync(sourcePath);
		var destinationValid = fs.existsSync(destinationPath);

		if (!destinationValid) mkdirp.sync(destinationDir);

		// iterate
		for (var i = 0; i < currentTask.files.length; i++) {
			var currentFile = currentTask.files[i];

			// get paths
			var fileSourcePath = path.join(sourcePath + currentFile.path);
			if (currentFile.name && currentFile.name != '') {
				var fileDestinationPath = path.join(destinationPath, currentFile.path);
			} else {
				var fileDestinationPath = path.join(destinationPath, currentFile.name);
			}

			// validify
			var fileSourceValid = fs.existsSync(fileSourcePath);
			var fileDestinationExisting = fs.existsSync(fileDestinationPath);

			if (fileSourceValid && fileDestinationExisting && fs.lstatSync(fileDestinationPath).isSymbolicLink()) { // symbolic link at destination
				if (queueInfo.options.recreateSymbolicLinks) { // not allowed to unlink symbolic links
					// process queue
					console.log('runQueue: error in queue ' + currentTask.id);
					queueInfo.active = false;
					queueInfo.callback(new Error('Could not create symbolic link. Destination is already a symbolic link.'), null);
					break; // skip task
				} else { // unlink symbolic link
					fs.unlinkSync(fileDestinationPath);
				}
			}
			if (fileSourceValid) {
				var fileSourceStats = fs.lstatSync(fileSourcePath);

				mkdirp.sync(path.dirname(fileDestinationPath)); // create destination directory

				if (fileSourceStats.isDirectory()) {
					fs.symlinkSync(fileSourcePath, fileDestinationPath, 'dir');
				} else if (fileSourcePath.isFile()) {
					fs.symlinkSync(fileSourcePath, fileDestinationPath, 'file');
				} else {
					// process queue
					console.log('runQueue: error in queue ' + currentTask.id);
					queueInfo.active = false;
					queueInfo.callback(new Error('Could not create symbolic link. Source is neither a file nor a folder.'), null);
					break; // skip task
				}
			} else {
				// process queue
				console.log('runQueue: error in queue ' + currentTask.id);
				queueInfo.active = false;
				queueInfo.callback(new Error('Could not create symbolic link. Source file is invalid.'), null);
				break; // skip task
			}
		}

		if (!queueInfo.active) continue; // skip task

		// process queue
		queueInfo.finished++;
		if (queueInfo.finished == queueInfo.total) { // complete queue finished
			console.log('runQueue: finished queue ' + currentTask.id);
			queueInfo.active = false;
			queueInfo.callback(null, 'success');
		}
	}

	console.log('runQueue: finished all tasks.');

	queueRunning = false;
}

// exporting functions
exports.open = open;
exports.basic = basic;
exports.advanced = advanced;