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
`````text
$C:\documents
-business
-private
>C:\workspace\documents

$E:\music
-Psy
-Linkin Park
>C:\myData\music
>E:\myData\music
````

Explanation:
$ specifys main directory for the current group of files/folders, starts a new list
- adds an subfolder to the list
> adds an output directory for the symlinked files/folders

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

	-t text-newline

###JSON

Example:
````json
["documents/home","documents/work","documents/private/important.odt"]
````
For JSON you'll have to use the following console argument:

    -t json

##Options
###-s --source [pathToSourceFolder]
Defines the path to the source folder.

###-d --destination [pathToDestinationFolder]
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
- text-newline (default)
- json

##License

BSD 2-Clause License

Copyright (c) 2013, Florian Wendelborn
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
