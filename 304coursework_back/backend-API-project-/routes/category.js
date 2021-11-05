'use strict';

const Router = require('koa-router');
const Category = require('../models/category');
const model = require('../models/recipe');

const router = Router({
      prefix: '/api/v1.0/category'
}); // Prefixed all routes with /api/v1.0/recipes

// because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');


/// for postman test only 


router.post('/addcategory', bodyParser(), async (cnx, next) => {

  await Category.addcategory(cnx.request.body.title);

  cnx.body = {message:"added successfully"};

});



router.get('/seletecategory:id',  async (cnx, next) => {
   
  const  nameoftitle= cnx.params.id

  const name = await Category.getcategoryId( nameoftitle );
  
  cnx.body = {message:name};

});




router.get('/searchByCategory',  async (cnx, next) => {
   const username = cnx.query.username;
   const name = await model.searchByCategory( username );
   const data = await model.getByCategoryId(name)
   cnx.body = data; 
 });



module.exports = router; 