const Router = require('koa-router');
const model = require('../models/recipe');

const Category = require('../models/category');
const Ingredients = require('../models/ingredient');
const Step = require('../models/step');

const router = Router({
   prefix: '/api/v1.0/recipes'
}); // Prefixed all routes with /api/v1.0/recipes

// because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');


router.get('/viewRecipe', bodyParser(), async (cnx, next) => {
    try {
 
       const RecipeTitle = cnx.query.recipeTitle
       const CategoryTitle = cnx.query.catgagoryTitle
 
       //get categoryID
       const categoryID = await Category.getcategoryId(CategoryTitle)
 
       // get the value 
       let recipeID = await model.getRecipeByVing(RecipeTitle, categoryID)
 
 
       const recipedata = await model.getById(recipeID)
 

 
       const Stepsdata = await Step.getingstepsByshowing( recipeID)
       const Ingredientsdata = await Ingredients.getingredientByshowing(categoryID, recipeID)
     
       let newdata = {
          recipedata: recipedata,
          Ingredientsdata: Ingredientsdata,
          Stepsdata: Stepsdata,
       }
   
 
       cnx.body = newdata
 
    } catch (err) {
       cnx.body = err.message
    }
 })
 
 module.exports = router;