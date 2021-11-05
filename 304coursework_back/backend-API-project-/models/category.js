const mysql = require('promise-mysql');
const info = require('../config');

exports.getcategoryId = async (getcategoryname) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        if(getcategoryname !== undefined) {
			sql = `SELECT ID FROM category
							WHERE name = "${getcategoryname}"`     
        }       
        let data = await connection.query(sql);
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID) 
        await connection.end();
        return data;

    } catch (error) {
     
        throw(500, 'An Error has occured');
    }
}


exports.addcategory = async (getcategoryname) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `INSERT INTO category (name) 
                   VALUES ("${getcategoryname}")
                  `;
        await connection.query(sql);
        await connection.end();
        return true;
    } catch (error) {
        throw(500, 'An Error has occured');
    }
}
