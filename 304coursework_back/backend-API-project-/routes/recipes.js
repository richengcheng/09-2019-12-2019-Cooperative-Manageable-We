const Router = require('koa-router');
// because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' });
const fs = require('fs-extra');
const mime = require('mime-types');
const sd = require('silly-datetime');
const request = require('request')

const model = require('../models/recipe');
const user = require('../models/users');
const recipeImages = require('../models/recipeImages');
const nutrition = require('../models/nutriton');


const router = Router({

   prefix: '/api/v1.0/recipes'
}); // Prefixed all routes with /api/v1.0/recipes


// Routes will go here
/**
 * The script to show all recipe.
 * @name Recipe Script
 * @route {GET} /
 * @description getAll() to connect to database and return all recipe
 */
router.get('/allRecipes', async (cnx, next) => {
   cnx.body = await model.getAll();
});

/**
 * The script to show specific recipe by its ID.
 * @name Recipe Script
 * @route {GET} /:id
 * @description getById() to connect to database and return a specific recipe.
 * @param {let} id - id is the recipe ID.
 */
router.get('/:id([0-9]{1,})', async (cnx, next) => {
   const id = cnx.params.id;
   cnx.body = await model.getById(id);
});

//this one is for searaching recipe by typing title 
router.get('/search', bodyParser(), async (cnx, next) => {
   try {

      const query = cnx.query.title
      cnx.body = await model.searchByTitle(query);

   } catch (err) {
      cnx.body = err.message
   }
})
/**
 * The script to show all recipes belong to specific user by its username and userId.
 * @name Recipe Script
 * @route {GET} /username
 * @description getByUserId() to connect to database and return eligible recipes.
 * @param {const} user.Id use.Id is authorId of the recipe.
 */
router.get('/username', bodyParser(), async (cnx, next) => {
   const username = cnx.query.username;
   const userId = await user.getIDByUsername(username);
   cnx.body = await model.getByUserId(userId);
})

/**
 * The script to show latest recipes that have been added (ONLY TOP 3).
 * @name Recipe Script
 * @route {GET} /latest
 * @description getLatest() to connect to database and return eligible recipes.
 */
router.get('/latest', async (cnx, next) => {
   cnx.body = await model.getLatest();
})




/**
 * The script to save a recipe image to public and save the imageURL to recipe table.
 * @name Recipe Script
 * @route {POST} /recipedId=:id
 * @description fs.copy() to save the upload image to public dirctory.
 * @description savImageURL() to save the upload imageURL to database.
 * @param {let} recipeId recipeId is the ID of recipe.
 * @param {const} path path is the path of upload image.
 * @param {const} type type is the type of the upload image.
 * @param {const} fileExtension fileExtension is the fileExtension of the upload image.
 * @param {const} imageURL imageURL is the URL that upload image save in public directory.
 */
router.post('/recipeId=:id([0-9]{1,})', koaBody, async (cnx, next) => {
   const recipeId = cnx.params.id;
   // Processing file
   const files = cnx.request.files.file
   for (let  i = 0; i < files.length; i++) {
      let Orders = i + 1;
      const { path, type } = files[i];
      const fileExtension = mime.extension(type);
      const DateCreated = sd.format(new Date().toLocaleDateString)
      let imageURL = `public/upload/recipe${recipeId}Order${Orders}.${fileExtension}`;
      await fs.copy(path, imageURL);
      imageURL = `http://localhost:3000/public/upload/recipe${recipeId}Order${Orders}.${fileExtension}`;
      await recipeImages.saveRecipeImage(imageURL, Orders, recipeId, DateCreated);
   }
   cnx.body = { message: "upload successfully" };

});


//update the recipe info
router.put('/:id([0-9]{1,})', bodyParser(), async (cnx, next) => {
   const id = cnx.params.id;
   let newRecipe = {

      title: cnx.request.body.title,
      subtitle: cnx.request.body.subtitle,
      description: cnx.request.body.description,
      categoryId: cnx.request.body.categoryId,
      authorId: cnx.request.body.authorId,
      DateCreated: cnx.request.body.DateCreated,
      mainImageURL: cnx.request.body.mainImageURL,
      ending: cnx.request.body.ending,
   };
   await model.put(id, newRecipe);
   cnx.body = { message: "updated successfully" };
});

/**
 * The script to delete a recipe based on its ID
 * @name Recipe Script
 * @route {DELETE} /:id
 * @description del() to connect to databse and delete the recipe on database.
 */
router.del('/:id([0-9]{1,})', async (cnx, next) => {
   const id = cnx.params.id;
   await model.del(id);
   cnx.body = { message: "deleted successfully" };
});

router.post('/analysis', bodyParser(), async (cnx, next) => {
   const recipeId = cnx.query.recipeId
   const recipeBody = cnx.request.body;

   let options = {
      method: 'POST',
      url: 'https://api.edamam.com/api/nutrition-details',
      qs: {
         app_id: '81941923',
         app_key: 'deb1f67095307797a9fc47422cfab63e'
      },
      headers: {
         'cache-control': 'no-cache',
         'Content-Type': 'application/json'
      },
      body: recipeBody,
      json: true
   };

   request(options, function (error, response, body) {
      if (error)
         throw new Error(error);
      body = JSON.stringify(body)
      nutrition.saveNutrition(recipeId, body);
   });
   cnx.body = { message: "Nutrition Value Saved!!!" };
})




module.exports = router;

