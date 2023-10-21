const database = require('../database.js');

async function Find(id, pw, phone_num, email){
    
    const query = 'SELECT COUNT(*) as count FROM user WHERE id = ? OR pw = ? OR phone_num = ? OR email = ?';
    const values = [id, pw, phone_num, email];

    const result = await database.Query(query, values);
    const user_id = result[0].count;

    if (result instanceof Error) {
        return;
    }
    const user_type = await User_Type_Check(id);
    const arr = [user_id, user_type];
    console.log(arr);
    return arr;
}

module.exports = {
    Find: Find
};
