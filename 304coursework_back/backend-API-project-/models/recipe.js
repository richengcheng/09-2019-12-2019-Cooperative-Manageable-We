const mysql = require('promise-mysql');
const info = require('../config');

//get an recipe by its id
exports.getById = async (id) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `SELECT * FROM recipe
                   WHERE id = ${id}
                  `;
        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();
        data = JSON.parse(JSON.stringify(data))

        //return the result
        return data;

    } catch (error) {
        //if an error occured please log it and throw an exception
     
        throw (500, 'An Error has occured');
    }
}

exports.getAll = async (page, limit, order) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = 'SELECT * FROM recipe ORDER BY DateCreated DESC';
        const data = await connection.query(sql);

        await connection.end();
       
        return data;

    } catch (error) {
    
        throw (500, 'An Error has occured');
    }
}

// this function is for searching by Title , and will return ID 
exports.searchByTitle = async (query) => {
    try {

        const connection = await mysql.createConnection(info.config);

        if (query !== undefined) {
            sql = `SELECT * FROM recipe
							WHERE title LIKE "%${query}%" `
        }
        let ID = await connection.query(sql);
        await connection.end();
        return ID;

    } catch (err) {
     
        throw (500, 'An Error has occured');

    }
}




exports.del = async (id) => {
    try {
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `DELETE FROM recipe
                   WHERE id = ${id}
                  `;
        let data = await connection.query(sql);

        await connection.end();

        return data;

    } catch (error) {
      
        throw (500, 'An Error has occured');
    }
}

exports.getByUserId = async (userId) => {
    try {
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute 
        let sql = `SELECT * FROM recipe
                   WHERE authorId = ${userId}
                  `;
        let data = await connection.query(sql);

        await connection.end();

        return data;

    } catch (error) {
      
        throw (500, 'An Error has occured');
    }
}

exports.getLatest = async () => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT * FROM recipe
                   ORDER BY DateCreated  DESC
                   LIMIT 5
                  `;
        let data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}
exports.saveImageURL = async (recipeId, imageURL) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `UPDATE recipe
                   SET mainImageURL = ?
                   WHERE id = ${recipeId}
                  `;
        await connection.query(sql, imageURL);
        await connection.end();
        return true;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}

exports.getrecipeID = async (title, categoryId,DateCreated) => {
    try {

      
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT ID FROM recipe
                 WHERE title = "${title}" and categoryId = ${categoryId} and DateCreated= "${DateCreated}"
                  `;
        let data = await connection.query(sql);
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID)
        await connection.end();
        return data;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}

/*
CREATE TABLE category (
                ID INT NOT NULL AUTO_INCREMENT,
                name TEXT,
                description TEXT,
                imageURL TEXT,
                PRIMARY KEY (ID)
*/
exports.searchByCategory = async (categoryName) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT ID FROM category
                 WHERE name = "${categoryName}" 
                  `;
        let data = await connection.query(sql);
       
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID)
        
        await connection.end();
        return data;
    } catch (error) {
        throw (500, 'An Error has occured');
    }
}

exports.getByCategoryId = async (id) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `SELECT * FROM recipe
                   WHERE categoryId = ${id}
                  `;
        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();

        //return the result
        return data;

    } catch (error) {
        //if an error occured please log it and throw an exception
      
        throw (500, 'An Error has occured');
    }
}

//viewRecipe

exports.getRecipeByVing = async (title,CategoryID) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `SELECT ID FROM recipe
                   WHERE categoryId = ${CategoryID} and  title = "${title}"
                  `;
        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();

        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID)

        //return the result
        return data;

    } catch (error) {
        //if an error occured please log it and throw an exception
    }
}

exports.searchRecipeByTitle = async (query) => {
    try {

        const connection = await mysql.createConnection(info.config);

        if (query !== undefined) {
            sql = `SELECT * FROM recipe
                    WHERE title LIKE "%${query}%" 
                  `;
        }
        const data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (err) {
        
        throw (500, 'An Error has occured');
    }
}