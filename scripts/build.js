const clearTask = require('./_clear');
const htmlTask = require('./_html');
const sassTask = require('./_sass');

const tasks = [ clearTask(), htmlTask(), sassTask() ];

Promise.all(tasks)
	.then(() => console.log('Done'), (err) => {
		console.error(err);
		console.error(err.stack);
	});


