const Router = require('koa-router');
const model = require('../models/recipe');

const router = Router({
   prefix: '/api/v1.0/recipes'
}); // Prefixed all routes with /api/v1.0/recipes



router.get('/searchRecipeByTitle', async (cnx, next) => {
    const query = cnx.query.title
    cnx.body = await model.searchRecipeByTitle(query)
});

 
 module.exports = router;