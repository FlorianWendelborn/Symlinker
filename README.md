Symlinker
=========

Automatically creates symbolic links based on a provided JSON file.

##Installation

Symlinker requires the following npm packages:
- optimist
- mkdirp

Install them with [npm](http://github.com/isaacs/npm):

    npm install optimist mkdirp

After that, download this repository and navigate to it.

Then type:

    node symlinker.js [symlinkerFile] -s [absoluteSourcePath] -d [absoluteDestinationPath]

##Symlinker File

A symlinker file is basically a JSON array with the names of the folders you want to link. This folders must exist in the source folder and will be symlinked to the matching path in the destination folder.

Example:
````javascript
    ["documents/home","documents/work"]
````

##License

BSD 2-Clause License

Copyright (c) 2013, Florian Wendelborn
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
