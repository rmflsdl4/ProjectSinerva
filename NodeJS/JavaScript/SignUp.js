const database = require('../database.js');

async function User_Insert(id, pw, nick_name, phone_num, email, address){
    
    const query = 'INSERT INTO user(id, pw, nick_name, phone_num, email, address) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, pw, nick_name, phone_num, email, address];

    const result = await database.Query(query, values);

    if (result instanceof Error) {
        return;
    }
}

module.exports = {
    Add_User: User_Insert
};