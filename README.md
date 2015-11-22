# Symlinker

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Code Climate](https://codeclimate.com/github/dodekeract/symlinker/badges/gpa.svg)](https://codeclimate.com/github/dodekeract/symlinker)
[![NPM Downloads](https://img.shields.io/npm/dm/symlinker.svg)](https://npmjs.com/package/symlinker)
[![NPM Dependencies](https://david-dm.org/dodekeract/symlinker.png)](https://david-dm.org/dodekeract/symlinker)
[![Code Documentation](https://inch-ci.org/github/dodekeract/symlinker.svg)](https://inch-ci.org/github/dodekeract/symlinker)

Automatically creates symbolic links based on a provided file. Symlinker also has a [GUI](https://github.com/dodekeract/symlinker-gui).

## Installation

Symlinker requires [nodejs](http://nodejs.org/).

### via [npm](http://github.com/isaacs/npm)

    npm install symlinker -g

Then type:

    symlinker [symlinkerFile]

### via github
Symlinker requires the following npm packages:
- [optimist](https://github.com/substack/node-optimist)
- [mkdirp](https://github.com/substack/node-mkdirp)

Install them with [npm](http://github.com/isaacs/npm):

    npm install optimist mkdirp

After that, download this repository and navigate to it.

Then type:

    node symlinker.js [symlinkerFile]

## Symlinker File

### General Information

A symlinker file is basically a list of the file- or foldernames you want to link. This files or folders must exist in the source folder and will be symlinked to the matching path in the destination folder. You can choose between two different formats.

### advanced-newline [default]

Example:
````text
$C:\documents
-business
-private
>C:\workspace\documents

#music linked to my private music folders

$E:\music
-Psy
-Linkin Park
>C:\myData\music
#just adding C418 to the list (will only link to following >outputDirectorys)
-C418
>E:\myData\music
````

Explanation:

| character | description                                                                      |
|----------:|:---------------------------------------------------------------------------------|
|         $ | specifys main directory for the current group of files/folders, starts a new list|
|        \- | adds an subfolder to the list                                                    |
|        \> | adds an output directory for the symlinked files/folders                         |
|        \# | that's a comment - it will be ignored                                            |

Tips:
You can use multiple lists in one file. Also multiple output locations are possible.

### text-newline

Example:
````text
documents/home
documents/work
documents/private/important.odt
````
To use text-newline you'll have to use this console argument:

	-t text-newline -s [pathToSourceFolder] -d [pathToDestinationFolder]

### JSON

Example:
````json
["documents/home","documents/work","documents/private/important.odt"]
````
For JSON you'll have to use the following console argument:

    -t json -s [pathToSourceFolder] -d [pathToDestinationFolder]

## Options
### -s --source [pathToSourceFolder] \(optional)
Defines the path to the source folder.

### -d --destination [pathToDestinationFolder] \(optional)
Defines the path to the destination folder.

### -c --create (optional)
Eventually creates destination folder.

### -f --skip (optional)
Skips invalid paths while creating symbolic links.

### -r --replace (optional)
The -r option allows Symlinker to replace old symbolic links.

### -i --ignore (optional)
Ignores file not found errors.

### -t --type (optional)
Specifies the filetype of the Symlinker-file. Possible values:
- advanced-newline (default)
- text-newline
- json

## use as library || api
### initialize:
````javascript
var symlinker = require('symlinker');
````

### basic
````javascript
// function basic (sourcePath, destinationPath, options, callback) {...}
symlinker.basic('source/path', 'destination/path', {
	recreateSymbolicLinks: true
}, function (err, data) {
	if (!err) {
		console.log('everything went well');
	} else {
		console.error('oh noes', err)
	}
});
````

#### explanation
Creates a symbolic link from 'source/path' to 'destination/path', will 'recreateSymbolicLinks' in case one conflicts with symlinks symlinker tries to create.

### removeBasic
````javascript
// function removeBasic (path, callback) {...}
symlinker.removeBasic('destination/path', function (err, data) {
	if (!err) {
		console.log('everything went well');
	} else {
		console.error('oh noes', err)
	}
});
````

#### explanation
This will just delete the stuff created in the 'basic'-example

### advanced
````javascript
// function advanced (task, options, callback) {...}
// task {source, destination, files:[{path, name}, *]}
symlinker.advanced({
	source: 'source/path',
	destination: 'destination/path',
	files:[{
		path: 'test.md',
		name: null
	},{
		path: 'canThisRenameStuff.question',
		name: 'ofCourse.answer'
	}]
}, {
	recreateSymbolicLinks: false,
	ignoreExisting: false
}, function (err, data) {
	if (!err) {
		console.log('everything went well');
	} else {
		console.error('oh noes', err)
	}
});
````

#### explanation
This will link the files 'test.md', 'canThisRenameStuff.question' from 'source/path' to 'destination/path'. It will also rename the last file to 'ofCourse.answer'.

#### options
|                option | description                                                                                      |
|----------------------:|:-------------------------------------------------------------------------------------------------|
| recreateSymbolicLinks | delete already existing symlinks (when checking individual file's location and symlink is found) |
|        ignoreExisting | ignores existing files and continues to next file when true, otherwise will drop the task        |

### removeAdvanced
````javascript
// function removeAdvanced (task, options, callback) {...}
// task {destination, files:[{path, name}, *]}
symlinker.removeAdvanced({
	destination: 'destination/path',
	files:[{
		path: 'test.md',
		name: null
	},{
		path: 'canThisRenameStuff.question',
		name: 'ofCourse.answer'
	}]
}, {
	ignoreMissingSymbolicLinks: true
}, function (err, data) {
	if (!err) {
		console.log('everything went well');
	} else {
		console.error('oh noes', err)
	}
});
````

#### explanation
Deletes all the symlinks created by the 'advanced'-example. It will also ignore any already missing symbolic link.

#### options
|                     option | description                            |
|---------------------------:|:---------------------------------------|
| ignoreMissingSymbolicLinks | ignores already deleted symbolic links |

## License

The MIT License (MIT)

Copyright (c) 2014 Florian Wendelborn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
