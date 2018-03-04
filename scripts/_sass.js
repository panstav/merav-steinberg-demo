const fs = require('fs');
const { promisify } = require('util');

const nodeSass = require('node-sass');

const fsWrite = promisify(fs.writeFile);
const sassCompile = promisify(nodeSass.render);

const entryFile = './source/styles/index.sass';
const destFile = './output/styles.css';

module.exports = sassTask;

function sassTask() {

	return sassCompile({ file: entryFile })
		.then(({ css }) => fsWrite(destFile, css));

};