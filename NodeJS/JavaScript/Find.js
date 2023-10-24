const database = require('../database.js');

async function FindId(nick_name, userType, phone_num, email){
    
    const query = 'SELECT id, nick_name FROM user WHERE nick_name = ? AND userType = ? AND phone_num = ? OR email = ?';
    const values = [nick_name, userType, phone_num, email];

    const result = await database.Query(query, values);
    const user = [result[0].id, result[0].nick_name];

    if (result instanceof Error) {
        return;
    }
    console.log(user);
    return user;
}

async function FindPw(id, userType, phone_num, email){
    
    const query = 'SELECT pw, nick_name FROM user WHERE id = ? AND userType = ? AND phone_num = ? OR email = ?';
    const values = [id, userType, phone_num, email];

    const result = await database.Query(query, values);
    const user = [result[0].pw, result[0].nick_name];

    if (result instanceof Error) {
        return;
    }
    console.log(user);
    return user;
}

module.exports = {
    FindId: FindId,
    FindPw: FindPw
};
