const mysql = require('promise-mysql');
const info = require('../config');

exports.getingredientId = async (ingredientname) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        if (getcategoryname !== undefined) {
            sql = `SELECT ID FROM ingredient

							WHERE name = "${ingredientname}"`
        }
        let data = await connection.query(sql);
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID)
        await connection.end();
        return data;

    } catch (error) {
        throw (500, 'An Error has occured');
    }
}


exports.addingredient = async (description, title,recipeId, categoryId,dateCreated) => {
    try {

        
        if(title === undefined){

            throw {message:'ingredient title is required'};
        }
      
      
       

        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `INSERT INTO ingredient (description,title,recipeId, categoryId,DateCreated) 
                   VALUES ("${description}","${title}",${recipeId},${categoryId},"${dateCreated}")
                  `;
        await connection.query(sql);
        await connection.end();
        return true;
    } catch (error) {
        throw error;
    }
}


exports.getingredientByshowing = async (categoryId, recipeId) => {
    try {

        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT * FROM ingredient
        WHERE categoryId = ${categoryId} and  recipeId = ${recipeId}
       `;
        let data = await connection.query(sql);
        
        await connection.end();
        data = JSON.parse(JSON.stringify(data))
        
        return data;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}

