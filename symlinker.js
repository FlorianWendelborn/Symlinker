var argv = require('optimist')
	.usage("Usage: $0 file -s [source] -d [destination]")
	.demand(['_','s','d'])
	.argv;

var fs = require('fs');

var file = fs.readFileSync(argv._[0], 'utf8');