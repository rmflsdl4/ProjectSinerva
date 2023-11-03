const database = require('../database.js');

async function _Login(id, pw){
    
    const query = `SELECT COUNT(*) as count FROM(
                                            SELECT id
                                            FROM user
                                            WHERE id = ? AND password = ?
                                            UNION
                                            SELECT id
                                            FROM expert
                                            WHERE id = ? AND password = ?) as unionTable`;
    const values = [id, pw];

    const result = await database.Query(query, values);
    const user_id = result[0].count;

    if (result instanceof Error) {
        return;
    }
    const type = await User_Type_Check(id);

    const arr = [user_id, type.userType, type.waitOk];
    console.log(arr);
    return arr;
}
async function User_Type_Check(user_id){
    const query = `SELECT userType, waitOk FROM user
                    UNION
                    SELECT userType, waitOk FROM expert
                    WHERE id = ?`;
    try{
        const result = await database.Query(query, user_id);
        
        return result[0];
    }
    catch(error){
        console.log(error);
    }
}
module.exports = {
    Login: _Login
};
