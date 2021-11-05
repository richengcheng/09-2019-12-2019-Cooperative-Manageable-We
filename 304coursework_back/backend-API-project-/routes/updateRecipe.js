const Router = require('koa-router');

const updateRecipe = require('../models/updateRecipe');

const router = Router({
    prefix: '/api/v1.0/updateRecipe'
}); // Prefixed all routes with /api/v1.0/recipes

// because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');


//update the recipe info
router.post('/:id([0-9]{1,})', bodyParser(), async (cnx, next) => {
    let id = cnx.params.id;


    let newRecipe = {
        title: cnx.request.body.recipeTitle ,
        subtitle: cnx.request.body.recipeSubTitle ,
        description: cnx.request.body.description,
        categoryId: cnx.request.body.categoryId,
        authorId: cnx.request.body.authorId,
        DateCreated: cnx.request.body.DateCreated,
        mainImageURL: cnx.request.body.mainImageURL,
        ending: cnx.request.body.ending,

    };
    try {
        await updateRecipe.put(id, newRecipe);
        cnx.body = { message: "updated successfully" };
    }
    catch (error) {
        cnx.body = { message: error.message };
    }

});
module.exports = router; 