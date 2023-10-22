const database = require('../database.js');

async function User_Insert(id, pw, nick_name, phone_num, email, address, userType){
    let query;
    let values;
    let result;

    if (userType == 'user') {
        query = 'INSERT INTO user(id, pw, nick_name, phone_num, email, address, userType, waitOk) VALUES (?, ?, ?, ?, ?, ?, ?, 1)';
        values = [id, pw, nick_name, phone_num, email, address, userType];
        
        result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }
    }
    else {
        query = 'INSERT INTO user(id, pw, nick_name, phone_num, email, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
        values = [id, pw, nick_name, phone_num, email, address, userType];

        result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }

    }
}

module.exports = {
    Add_User: User_Insert
};