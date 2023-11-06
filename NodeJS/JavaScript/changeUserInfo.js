const database = require('../database.js');

async function updateUserInfo(loginId, loginUserType, id, pw, nick_name, phone_num, email, address, introduction, image_route) {
    let query;
    let values;
    let result;
    let expertQuert;
    let expertValues;

    if (loginUserType == 'user') {
        query = 'UPDATE user SET id = ?, password = ?, nick_name = ?, phone_num = ?, email = ?, address = ? WHERE id = ?';
        values = [id, pw, nick_name, phone_num, email, address, loginId];
        
        result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }
    }
    else {
        query = 'UPDATE expert SET id = ?, password = ?, name = ?, phone_num = ?, email = ?, address = ?, introduction = ? WHERE id = ?';
        values = [id, pw, nick_name, phone_num, email, address, introduction, loginId];

        result = await database.Query(query, values);

        expertQuert = 'update expert set expert_route = ? where id = ?';
        expertValues = [image_route, id];
        await database.Query(expertQuert, expertValues);

        if (result instanceof Error) {
            return;
        }
    }
}

async function getUserInfo(id, userType) {
    let query;
    let values;
    
    if (userType === 'user') {
        query = 'select * from user where id = ?';
    }
    else {
        query = 'select * from expert where id = ?';
    }

    values = [id];
    const result = await database.Query(query, values);

    if (result instanceof Error) {
        return;
    }

    return result;
}

module.exports = {
    updateUserInfo: updateUserInfo,
    getUserInfo: getUserInfo
};