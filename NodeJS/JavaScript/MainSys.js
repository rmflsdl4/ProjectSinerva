const database = require('../database.js');

async function userInfo() {
	const query = `SELECT u.id, i.result, c.expert_id, c.imgUploadDate, c.requestDate, c.comment, c.reqDependingOn, i.img_id, i.file_route 
					FROM user AS u
						JOIN commentRequest AS c
							ON u.id = c.user_id
						JOIN image AS i
							ON c.imgUploadDate = i.upload_date
						GROUP BY c.requestDate
						HAVING comment IS NOT NULL AND i.result IS NOT NULL`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

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
	userInfo: userInfo,
    expertInfo: expertInfo
};