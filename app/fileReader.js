const csv = require('csv-parser');
const fs = require('fs');

class FileReader {
	constructor() {
		this.models = {};
		this.data = [];
	}

	async formatDataFromFiles(files) {
		let promises = [];
		for (let v of Object.values(files.fileMap)) {
			if (!v.schema) {
				if (!v.data) {
					console.warn('The impossible has happened.');
				}
				console.warn(`File name ${v.data.split('.')[0]} doesn't exist in schema directory.`);
				continue;
			}
			promises.push(this.getDataModels(v.schema, files.schema_dir));
		}
		return await Promise.all(promises).then( () => {
			return files;
		});
	}

	getDataModels(fileName, schema_dir) {
		const modelName = fileName.split('.')[0];
		return new Promise((resolve, reject) => {
			fs.createReadStream(`${schema_dir}/${fileName}`)
				.on('error', (err) => {
					reject(err);
				})
				.pipe(csv({headers: false}))
				.on('data', (row) => {
					this.models[modelName] = this.models[modelName] || {};
					const name = row[0];
					const length = row[1];
					const type = row[2];
					this.models[modelName][name] = {
						'length': length,
						'type': type
					}
				})
				.on('end', () => {
					console.log(`CSV file ${fileName} successfully processed!`);
					resolve(true);
				});
		});
	}

	async cullDataFromFiles(files, dataModel) {
		let promises = [];
		for (let v of Object.values(files.fileMap)) {
			if (!v.data) {
				// not dry, can be improved
				if (!v.schema) {
					console.warn('The impossible has happened.');
				}
				console.warn(`File name ${v.schema.split('.')[0]} doesn't exist in data directory.`);
				continue;
			}
			promises.push(this.getFormattedData(v.data, files.data_dir, dataModel));
		}
		return await Promise.all(promises).then( () => {
			return this.data;
		});
	}

	getFormattedData(fileName, data_dir) {
		const model = this.models[fileName.split('.')[0]];
		if (!model) {
			return null;
		}
		return new Promise((resolve, reject) => {
			fs.createReadStream(`${data_dir}/${fileName}`)
				.on('error', (err) => {
					reject(err);
				})
				.on('data', (contents) => {
					const rows = contents.toString().split('\n');
					for (let str of rows) {
						let datum = {};
						let beginning = 0;
						for (let [k,v] of Object.entries(model)) {
							if (!v.length || !v.type) {
								throw 'data not formatted properly!';
							}
							const len = Number.parseInt(v.length);
							datum[k] = this.formatDataType(str.slice(beginning, beginning + len).trim(), v.type.toUpperCase());
							beginning += len;
						}
						this.data.push(datum);
					}
				})
				.on('end', () => {
					console.log(`Data from ${fileName} successfully prepared!`);
					resolve(true);
				});
		});
	}

	formatDataType(value, type) {
		if (type === 'TEXT') {
			return value + '';
		} else if (type === 'INTEGER') {
			return parseInt(value);
		} else if (type === 'BOOLEAN') {
			return Boolean(value);
		} else {
			console.warn('code has reached theoretically unreachable state!');
			throw 'no schema for given data!';
		}
	}
}

module.exports = FileReader