Symlinker
=========

Automatically creates symbolic links based on a provided file.

##Installation

Symlinker requires [nodejs](http://nodejs.org/).

###via [npm](http://github.com/isaacs/npm)

    npm install symlinker -g

Then type:

    symlinker [symlinkerFile]

###via github
Symlinker requires the following npm packages:
- [optimist](https://github.com/substack/node-optimist)
- [mkdirp](https://github.com/substack/node-mkdirp)

Install them with [npm](http://github.com/isaacs/npm):

    npm install optimist mkdirp

After that, download this repository and navigate to it.

Then type:

    node symlinker.js [symlinkerFile]

##Symlinker File

###General Information

A symlinker file is basically list of the file- or foldernames you want to link. This files or folders must exist in the source folder and will be symlinked to the matching path in the destination folder. You can choose between two different formats.

###advanced-newline [default]

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

###text-newline

Example:
````text
documents/home
documents/work
documents/private/important.odt
````
To use text-newline you'll have to use this console argument:

	-t text-newline -s [pathToSourceFolder] -d [pathToDestinationFolder]

###JSON

Example:
````json
["documents/home","documents/work","documents/private/important.odt"]
````
For JSON you'll have to use the following console argument:

    -t json -s [pathToSourceFolder] -d [pathToDestinationFolder]

##Options
###-s --source [pathToSourceFolder] \(optional)
Defines the path to the source folder.

###-d --destination [pathToDestinationFolder] \(optional)
Defines the path to the destination folder.

###-c --create (optional)
Eventually creates destination folder.

###-f --skip (optional)
Skips invalid paths while creating symbolic links.

###-r --replace (optional)
The -r option allows Symlinker to replace old symbolic links.

###-i --ignore (optional)
Ignores file not found errors.

###-t --type (optional)
Specifies the filetype of the Symlinker-file. Possible values:
- advanced-newline (default)
- text-newline
- json

##License

The MIT License (MIT)

Copyright (c) 2014 Florian Wendelborn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.