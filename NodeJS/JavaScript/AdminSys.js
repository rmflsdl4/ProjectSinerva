const database = require('../database.js');

async function get_users() {
	const query = `SELECT * FROM user`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

async function updateWaitOk(id) {
	let query = `UPDATE user SET waitOk = 1 WHERE id = ?`;
	let value = [id];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

module.exports = {
    get_users: get_users,
	updateWaitOk: updateWaitOk
};