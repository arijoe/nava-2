BaseDao = require('./baseDao');
const axios = require('axios').default;

class NavaDao extends BaseDao {
	constructor() {
		super();
		this.endpoint = 'https://2swdepm0wa.execute-api.us-east-1.amazonaws.com/prod/NavaInterview/measures';
	}

	insert(data) {
		return this.sendRequest(this.endpoint, data);
	}

	sendRequest(url, body) {
		return axios.post(url, body)
			.catch(function (error) {
				console.error(error);
				throw error;
			});
	}
}

module.exports = NavaDao