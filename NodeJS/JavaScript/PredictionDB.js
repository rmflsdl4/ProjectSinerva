const database = require('../database.js');


async function InsertImage(imgArr){
    var id = 1;
    imgArr.forEach((idx) => {
        console.log("파일이름: " + idx.name + "URL: " + idx.url.slice(-100));
        
        const query = 'INSERT INTO testImg(fileName, userId) VALUES (?, \'test\')';
        const values = [idx.name];

        database.Query(query, values);
        id++;
    });
    
}


module.exports = {
    InsertImage: InsertImage
};