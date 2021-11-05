'use strict';

const Router = require('koa-router');
const Ingredients = require('../models/ingredient');

const router = Router({
      prefix: '/api/v1.0/ingredients'
}); // Prefixed all routes with /api/v1.0/recipes

// because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');


/// for postman test only 

router.post('/addingredients', bodyParser(), async (cnx, next) => {

 
  await Ingredients.addingredient(cnx.request.body.title,cnx.request.body.reciepid,cnx.request.body.categoryId);

  cnx.body = {message:"added successfully"};

});

router.get('/seleteingredients:id',  async (cnx, next) => {
   
  const  nameoftitle= cnx.params.id

  const name = await Category.getcategoryId( nameoftitle );

  cnx.body = {message:name};

});


module.exports = router; 