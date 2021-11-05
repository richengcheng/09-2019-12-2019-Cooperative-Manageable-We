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
        let  data = await connection.query(sql);
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID) 
        await connection.end();
        return data;

    } catch (error) {
        throw(500, 'An Error has occured');
    }
}


exports.addsteps = async (recipeId,Orders,description,DateCreated) => {
    try {


        if(recipeId === undefined){
            throw {message:'recipeId is required'};
        }
        //paswword is required
        if(Orders === undefined){
            throw {message:'Orders is required'};
        }
       

        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `INSERT INTO steps (description,Orders,recipeId,DateCreated) 
                   VALUES ("${description}",${Orders},${recipeId},"${DateCreated}")
                  `;
        await connection.query(sql);
        await connection.end();
        return true;
    } catch (error) {
        throw(500, 'An Error has occured');
    }
}


exports.getingstepsByshowing = async ( recipeId) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT * FROM steps
        WHERE recipeId = ${recipeId} 
       `;

       let data = await connection.query(sql);
        await connection.end();
        data = JSON.parse(JSON.stringify(data))
        
        return data;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}
