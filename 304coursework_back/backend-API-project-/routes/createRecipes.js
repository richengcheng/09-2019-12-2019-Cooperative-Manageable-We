const Router = require('koa-router');
const model = require('../models/createRecipes');
const user = require('../models/users');


const Category = require('../models/category');
const Ingredients = require('../models/ingredient');
const Step = require('../models/step');
const recipe = require('../models/recipe');


const router = Router({
   prefix: '/api/v1.0/recipes'
}); // Prefixed all routes with /api/v1.0/recipes

// because we are going to parse POST parameters we will import koa-bodyparser

const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' });

const sd = require('silly-datetime');



// note that we have injected the body parser onlyin the POST request.
// create a new recipe

router.post('/addrecipes', koaBody, async (cnx, next) => {

    //  get the user id useing username
 
    const username = cnx.query.username;
   
    const userId = await user.getIDByUsername(username);
    // cnx.body = await model.getByUserId(userId);
 
    // set the date
    let dateCreated = sd.format(new Date().toLocaleDateString)
 
    // get the category Id 
    const categoryName = cnx.request.body.values.category
    const categoryID = await Category.getcategoryId(categoryName)
 
    // this part for creating new recipe only 
    let newRecipe = {
      
       title: cnx.request.body.values.recipeTitle,
       subtitle: cnx.request.body.values.recipeSubTitle,
       description: cnx.request.body.values.recipeDescription,
       categoryId: categoryID,
       authorId: userId,
       DateCreated: dateCreated,
       mainImageURL: cnx.request.body.mainImageURL,
       ending: cnx.request.body.ending,
    };
     try {
    

      await model.add(newRecipe);

  

 
    // this part for creating new ingredient only 
    const RecipeID= await recipe.getrecipeID(cnx.request.body.values.recipeTitle,categoryID,dateCreated)
   


    await Ingredients.addingredient(cnx.request.body.values.ingredientsDescription,
       cnx.request.body.values.ingredientsTitle,RecipeID,categoryID,dateCreated)
 
    

    // this part for creating new steps only 
    const Steps= cnx.request.body.values.steps
    
    for(let i = 0; i<Steps.length;i++){
       await Step.addsteps(RecipeID, i+1,Steps[i],dateCreated);
    }
 
 
  
    cnx.body = { message: "added successfully" };
   } catch (error) {
      cnx.body = { message: error.message };
  }
 });
 
 module.exports = router; 