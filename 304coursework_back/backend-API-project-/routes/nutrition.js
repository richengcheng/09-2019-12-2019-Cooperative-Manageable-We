const Router = require('koa-router');
const nutrition = require('../models/nutriton')
const recipe = require('../models/recipe')

const router = Router({
    prefix: '/api/v1.0/nutrition'
});
const bodyParser = require('koa-bodyparser');

router.get('/', bodyParser(), async (cnx, next) => {
   const recipeId = cnx.query.recipeId
   let Recipe = await recipe.getById(recipeId)
   Recipe = Recipe[0].title
   let nutritionValue = {}
   nutritionValue = await nutrition.getNutrtion(recipeId, Recipe)
   cnx.body = nutritionValue
});

module.exports = router; 