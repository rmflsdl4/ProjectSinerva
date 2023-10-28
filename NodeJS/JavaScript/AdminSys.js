const database = require('../database.js');

async function get_users() {
	const query = `SELECT * FROM user`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

module.exports = {
    get_users: get_users
};