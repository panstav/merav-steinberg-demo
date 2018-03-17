const fs = require('fs');
const { promisify } = require('util');

const jsonFile = require('json-file-plus');

const posthtml = require('posthtml');
const extend = require('posthtml-extend');
const include = require('posthtml-include');
const expressions = require('posthtml-expressions');
const htmlnano = require('htmlnano');

const global = require('../source/data/global');

const fsRead = promisify(fs.readFile);
const fsWrite = promisify(fs.writeFile);
const fsReaddir = promisify(fs.readdir);

const regularTemplates = ['homepage', 'about', 'projects', 'inspiration'];

module.exports = htmlTask;

function getEntryFile(pageType) {
	return `./source/templates/pages/${pageType}.html`;
}

function getDestFile(pageType) {
	return `./output/${pageType}.html`;
}

function read(pageType) {
	return fsRead(getEntryFile(pageType), 'utf8')
		.then((data) => ({ pageType, data }));
}

function parse(pageType, rawHtml, locals = {}) {

	return posthtml(getPlugins())
		.process(rawHtml)
		.then((result) => result.html);

	function getPlugins() {
		return [
			extend(),
			include({ encoding: 'utf8' }),
			expressions({locals: { ...global, ...locals, pageType }}),
			htmlnano({ removeComments: true, collapseWhitespace: 'conservative', removeEmptyAttributes: false, collapseBooleanAttributes: true })
		];
	}

}

function write(destFilename, html) {
	return fsWrite(getDestFile(destFilename), html);
}

function htmlTask() {

	return Promise.all([
		renderStatic(),
		renderDynamic()
	])
		.catch((err) => {
			console.error(err);
			console.error(err.stack);
		});

	function renderStatic() {
		return regularTemplates.map((pageType) => {
			return read(pageType)
				.then(({ pageType, data }) => parse(pageType, data))
				.then((html) => write(pageType, html));
		});
	}

	function renderDynamic() {

		return getDynamicTemplates()
			.then(parseRecursively);

		function parseRecursively(directoryNamesOfDynamicTemplates) {
			return Promise.all(directoryNamesOfDynamicTemplates.map((pageType) => {
				return getRawPageAndItsVariety(pageType)
					.then(parseEach)
					.then((slugHtmlPairs) => Promise.all(slugHtmlPairs.map(({ slug, html }) => write(slug, html))));
			}));
		}

		function parseEach([ { pageType, data }, files ]) {
			return Promise.all(files.map((pageData) => {
				return parse(pageType, data, pageData)
					.then((html) => ({ html, slug: pageData.slug }));
			}));
		}

		function getDynamicTemplates() {
			return fsReaddir(`./source/data`)
				.then((result) => result.filter((filename) => !filename.includes('.')));
		}

		function getRawPageAndItsVariety(pageType) {
			return Promise.all([
				read(pageType),
				getJsonOf(pageType)
			]);
		}

		function getJsonOf(pageType) {
			return fsReaddir(`./source/data/${pageType}`)
				.then((filenames) => Promise.all(filenames.map((filename) => {
					const [slug] = filename.split('.');
					return jsonFile(`source/data/${pageType}/${filename}`).then((json) => ({ ...json.data, slug }));
				})));
		}

	}

}