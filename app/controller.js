class Controller {
	constructor(dao) {
		this.dao = dao;
	}

	async insertData(data) {
		let promises = [];
		let inserts = 0;
		for (let datum of data) {
			promises.push(this.dao.insert(JSON.stringify(datum)));
			inserts++;
		}
		return await Promise.all(promises).then(() => {
			return `Successfully performed ${inserts} inserts.`;
		});
	}
}

module.exports = Controller