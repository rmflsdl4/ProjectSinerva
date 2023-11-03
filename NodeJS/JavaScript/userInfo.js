const database = require('../database.js');

async function updateUserInfo(id, pw, nick_name, phone_num, email, address, userType) {
    let query;
    let values;
    let result;

    // if (userType == 'user') {
    //     query = 'INSERT INTO user(id, pw, nick_name, phone_num, email, address, userType, waitOk) VALUES (?, ?, ?, ?, ?, ?, ?, 1)';
    //     values = [id, pw, nick_name, phone_num, email, address, userType];
        
    //     result = await database.Query(query, values);

    //     if (result instanceof Error) {
    //         return;
    //     }
    // }
    // else {
    //     query = 'INSERT INTO user(id, pw, nick_name, phone_num, email, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    //     values = [id, pw, nick_name, phone_num, email, address, userType];

    //     result = await database.Query(query, values);

    //     if (result instanceof Error) {
    //         return;
    //     }

    // }
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