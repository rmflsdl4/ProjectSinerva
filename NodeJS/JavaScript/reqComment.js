const database = require('../database.js');

async function commentImport() {
	const query = `SELECT * FROM commentRequest as c
                    JOIN image as i
                        ON c.img_id = i.img_id`;
	
	const result = await database.Query(query, null);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return result;
}

async function updateReqDependingOn(imgId, dataTime) {
	let query = `UPDATE commentRequest SET requestDate = ?, reqDependingOn = 'Y' WHERE img_id = ?`;
	let value = [dataTime, imgId];
	
	let result = await database.Query(query, value);
	
	if (result instanceof Error) {
		console.error(result);
	}
	return;
}

async function deleteReqDependingOn(imgId) {
	let query = `DELETE FROM commentRequest WHERE img_id = ?`;
	let value = [imgId];
	
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

module.exports = {
    commentImport: commentImport,
	updateReqDependingOn: updateReqDependingOn,
	deleteReqDependingOn: deleteReqDependingOn,
	updateCommitComment: updateCommitComment
};