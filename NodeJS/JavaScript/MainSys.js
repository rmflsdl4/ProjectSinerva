const database = require('../database.js');

async function expertInfo() {
	const query = `SELECT e.name as name, e.address as address, e.introduction as introduction, COALESCE(ROUND(AVG(ue.rating), 2), 0) AS rating
					FROM expert AS e
					LEFT JOIN user_has_expert AS ue ON e.id = ue.expert_id
					WHERE e.waitOk = 1
					GROUP BY e.id`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

module.exports = {
    expertInfo: expertInfo
};