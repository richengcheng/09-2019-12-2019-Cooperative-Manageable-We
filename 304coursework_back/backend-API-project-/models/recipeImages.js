const mysql = require('promise-mysql');
const info = require('../config');

exports.saveRecipeImage = async (imageURL, Orders, recipeId, DateCreated) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `INSERT INTO recipeImages (url, Orders, recipeId, DateCreated) 
                   VALUES ("${imageURL}", "${Orders}", ${recipeId}, "${DateCreated}")
                  `;
        await connection.query(sql);
        await connection.end();
        return true;
    } catch (error) {
        throw(500, 'An Error has occured');
    }
}
