const database = require('../database.js');

async function get_users() {
	const query = `SELECT id, nick_name, waitOk, userType  FROM user
					UNION
					SELECT id, name, waitOk, userType FROM expert`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

async function updateWaitOk(id) {
	let query = `UPDATE expert SET waitOk = 1 WHERE id = ?`;
	let value = [id];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function deleteUser(id, userType) {
	let query;
	let value;
	
	if (userType === 'user') {
		query = `DELETE FROM user WHERE id = ?`;
	value = [id];
	}
	else {
		query = `DELETE FROM expert WHERE id = ?`;
		value = [id];
}
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function unCommit(id) {
	let query = `UPDATE expert SET waitOk = 0 WHERE id = ?`;
	let value = [id];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

module.exports = {
    get_users: get_users,
	updateWaitOk: updateWaitOk,
	deleteUser: deleteUser,
	unCommit: unCommit
};