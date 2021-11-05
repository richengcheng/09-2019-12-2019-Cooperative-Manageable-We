const mysql = require('promise-mysql');
const info = require('../config');

exports.createTables = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //create recipe table
        let sql = `CREATE TABLE recipe ( 
                    ID INT NOT NULL AUTO_INCREMENT,
                    title TEXT,
                    subtitle TEXT,
                    description TEXT,
                    categoryId INT,
                    authorId INT,
                    DateCreated DATETIME,
                    mainImageURL TEXT,
                    ending TEXT,
                    PRIMARY KEY (ID)
                )`;
        await connection.query(sql);
        //create user table
        sql = `CREATE TABLE users (
                ID INT NOT NULL AUTO_INCREMENT,
                email TEXT,
                password TEXT,
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create ingredient table
        sql = `CREATE TABLE ingredient (
                ID INT NOT NULL AUTO_INCREMENT,
                title TEXT,
                quantity INT,
                quantityUnitId INT,
                description TEXT,
                categoryId INT,
                recipeId INT,
                DateCreated DATETIME,
                mainImageURL TEXT,
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create steps table
        sql = `CREATE TABLE steps (
                ID INT NOT NULL AUTO_INCREMENT,
                description TEXT,
                Orders INT,
                recipeId INT,
                DateCreated DATETIME,
                mainImageURL TEXT,
                PRIMARY KEY (ID)
            )`;
            
        await connection.query(sql);
        //create recipeImages table
        sql = `CREATE TABLE recipeImages (
                ID INT NOT NULL AUTO_INCREMENT,
                url TEXT,
                Orders INT,
                recipeId INT,
                DateCreated DATETIME,
                deleted TINYINT(1),
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create stepsImage
        sql = `CREATE TABLE stepsImgaes (
                ID INT NOT NULL AUTO_INCREMENT,
                url TEXT,
                Orders INT,
                recipeId INT,
                DateCreated DATETIME,
                deleted TINYINT(1),
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create nutrition table  
        sql = `CREATE TABLE nutrition (
                ID INT NOT NULL AUTO_INCREMENT,
                recipeId INT,
                description JSON,
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create QuantityUnit table admin access only
        sql = `CREATE TABLE quantityUnit (
                ID INT NOT NULL AUTO_INCREMENT,
                name TEXT,
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);
        //create category table admin access only
        sql = `CREATE TABLE category (
                ID INT NOT NULL AUTO_INCREMENT,
                name TEXT,
                description TEXT,
                imageURL TEXT,
                PRIMARY KEY (ID)
            )`;
        await connection.query(sql);

        return {message:"created successfully"};
 
    } catch (error) {
        
        ctx.throw(500, 'An Error has occured');
    }
}

