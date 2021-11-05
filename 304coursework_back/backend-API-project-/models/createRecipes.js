const mysql = require('promise-mysql');
const info = require('../config');


exports.add = async (recipes) => {
    try {
        
        if(recipes.title === undefined){
            throw {message:'title is required'};
        }
        //paswword is required
        if(recipes.subtitle === undefined){
            throw {message:'subtitle is required'};
        }
        if(recipes.categoryId === undefined){
            throw {message:'categoryId is required'};
        }
        //paswword is required
        if(recipes.authorId === undefined){
            throw {message:'authorId is required'};
        }
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `INSERT INTO recipe
                   SET ?
                  `;
        let data = await connection.query(sql, recipes);
        await connection.end();

        return data;

    } catch (error) {
        throw error;
    }
}