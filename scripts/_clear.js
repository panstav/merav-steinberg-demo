const del = require('delete');

module.exports = clearOutputDir;

function clearOutputDir() {
	return del.promise('output/*');
}