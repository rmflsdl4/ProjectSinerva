const database = require('../database.js');

async function expertInfo() {
	const query = `SELECT name, address, introduction FROM expert WHERE waitOk = 1`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

module.exports = {
    expertInfo: expertInfo
};