const mysql = require('promise-mysql');
const info = require('../config');

exports.saveNutrition = async (recipeId, data) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `INSERT INTO nutrition (recipeId, description) 
                   VALUES (${recipeId}, '${data}')
                  `;
        await connection.query(sql);
        await connection.end();
        return true;
    } catch (error) {
        throw(500, 'An Error has occured');
    }
}

exports.getNutrtion = async (recipeId, recipeName) => {
    try {
        const connection = await mysql.createConnection(info.config);
        // This is the sql statement to execute
        let sql = `SELECT description FROM nutrition
                   WHERE recipeId = ${recipeId}
                  `;
        let data = await connection.query(sql);

        await connection.end();

        data = JSON.parse(JSON.stringify(data))
        data = JSON.parse(String(data[0].description))

        const nutrition = []
        nutrition[0] = {  
            "nutritionName": "Calories",
            "totalNutrients": Math.floor(data.calories),
        }
        nutrition[1] = {  
            "nutritionName": "Fat",
            "totalNutrients": `${Math.floor(data.totalNutrients.FAT.quantity)} g`,
            "totalDaily": `${Math.floor(data.totalDaily.FAT.quantity)} %`
        }
        nutrition[2] = {  
            "nutritionName": "Cholesterol",
            "totalNutrients": `${Math.floor(data.totalNutrients.CHOLE.quantity)} mg`,
            "totalDaily": `${Math.floor(data.totalDaily.CHOLE.quantity)} %`
        }
        nutrition[3] = {  
            "nutritionName": "Total Carbohydrate",
            "totalNutrients": `${Math.floor(data.totalNutrients.CHOCDF.quantity)} g`,
            "totalDaily": `${Math.floor(data.totalDaily.CHOCDF.quantity)} %`
        }
        nutrition[4] = {  
            "nutritionName": "Fiber",
            "totalNutrients": `${Math.floor(data.totalNutrients.FIBTG.quantity)} g`,
            "totalDaily": `${Math.floor(data.totalDaily.FIBTG.quantity)} %`
        }
        nutrition[5] = {  
            "nutritionName": "Total Sugar",
            "totalNutrients": `${Math.floor(data.totalNutrients.SUGAR.quantity)} g`
        }
        nutrition[6] = {  
            "nutritionName": "Protein",
            "totalNutrients": `${Math.floor(data.totalNutrients.PROCNT.quantity)} g`,
            "totalDaily": `${Math.floor(data.totalDaily.PROCNT.quantity)} %`
        }
        nutrition[7] = {
            "recipeName": `${recipeName}`
        }
        return nutrition
    } catch (error) {
        throw(500, 'An Error has occured')
    }
}
