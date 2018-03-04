const watch = require('node-watch');

const clearTask = require('./_clear');
const htmlTask = require('./_html');
const sassTask = require('./_sass');

// initial run
runTasks();

// register listener
watch('./source', { recursive: true }, runTasks);

function runTasks() {

	return Promise.all([ clearTask(), htmlTask(), sassTask() ])
		.catch((err) => {
			console.error(err);
			console.error(err.stack);
		});

}