BaseDao = require('./baseDao');

class MockDao extends BaseDao {
	constructor() {
		super();
		this.table = [];
	}

	insert(datum) {
		return new Promise((resolve, reject) => {
			try {
				this.table.push(datum);
			} catch (err) {
				reject(err);
			}
			// helpful to have this when testing
			console.log(this.getAll());
			resolve(true);
		});
	}

	getAll() {
		return this.table;
	}
}

module.exports = MockDao