const path = require('path');
const fs = require('fs');

class FileMapper {
	constructor() {
		this.dataPath = path.join(__dirname, '../data');
		this.schemaPath = path.join(__dirname, '../schemas');
		this.fileMap = {};
	}

	getFileMap() {
		return this.getFiles('schema')
			.then(() => this.getFiles('data'))
			.then(() => this.exportFilePaths());
	}

	getFiles(dir) {
		return new Promise((resolve, reject) => {
			fs.readdir(dir === 'data' ? this.dataPath : this.schemaPath, ((err, files) => {
				if (err) {
					reject(err);
				}
				for (let file of files) {
					this.mapFile(file, dir);
				}
				resolve(this.fileMap);
			}));
		});
	}

	exportFilePaths() {
		return {
			'fileMap': this.fileMap,
			'data_dir': this.dataPath,
			'schema_dir': this.schemaPath
		};
	}

	mapFile(fileName, dir) {
		let name = fileName.split('.')[0];
		this.fileMap[name] = this.fileMap[name] || {};
		this.fileMap[name][dir] = fileName;
	}
}

module.exports = FileMapper