'use strict';

const Router = require('koa-router');
const Step = require('../models/step');

const router = Router({
  prefix: '/api/v1.0/steps'
}); // Prefixed all routes with /api/v1.0/recipes


const bodyParser = require('koa-bodyparser');
 

router.post('/addsteps', bodyParser(), async (cnx, next) => {
  await Step.addsteps(cnx.request.body.reciepid, cnx.request.body.description);
  cnx.body = { message: "added successfully" };

});

router.get('/seletecategory:id', async (cnx, next) => {

  const nameoftitle = cnx.params.id
  const name = await Category.getcategoryId(nameoftitle);
  cnx.body = { message: name };

});


module.exports = router; 