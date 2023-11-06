const database = require('../database.js');

async function commentImport(expertId) {
	const query = `SELECT * FROM commentRequest as c
                    JOIN image as i
                        ON c.img_id = i.img_id
					GROUP BY imgUploadDate
					HAVING expert_id = ?`;
	
	const value = [expertId];

	const result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

async function updateReqDependingOn(imgUploadDate, dataTime) {
	let query = `UPDATE commentRequest SET requestDate = ?, reqDependingOn = 'Y' WHERE imgUploadDate = ?`;
	let value = [dataTime, imgUploadDate];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function deleteReqDependingOn(imgUploadDate) {
	let query = `DELETE FROM commentRequest WHERE imgUploadDate = ?`;
	let value = [imgUploadDate];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function updateCommitComment(imgId, inputValue) {
	let query = `UPDATE commentRequest SET comment = ? WHERE img_id = ?`;
	let value = [inputValue, imgId];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function seeMore(imgUploadDate) {
	const query = `SELECT * FROM commentRequest as c
                    JOIN image as i
                        ON c.img_id = i.img_id
					WHERE imgUploadDate = ?`;
	
	let value = [imgUploadDate];

	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

module.exports = {
    commentImport: commentImport,
	updateReqDependingOn: updateReqDependingOn,
	deleteReqDependingOn: deleteReqDependingOn,
	updateCommitComment: updateCommitComment,
	seeMore: seeMore
};