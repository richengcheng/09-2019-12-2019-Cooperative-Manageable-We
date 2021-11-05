'use strict';

const Router = require('koa-router');
//because we are going to parse POST parameters we will import koa-bodyparser
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');

const router = Router({
   prefix: '/api/v1.0/users'
});  //Prefixed all routes with /api/v1.0/users

//the id should be a number greater than or equal 1
router.get('/:id([0-9]{1,})', async (cnx, next) =>{
   //to protect the resource, only authenticated users can access it
   return passport.authenticate('basic', async function(err, user, info, status) {
      //there are two values in user, false and user's data 
      if(err){
        cnx.body = err
      }
      else if (user === false) {// if there is a user but password is worng.
       cnx.body = { success: false }
       cnx.throw(401)
      } else {
         // there is using search fucntion by id, which means which can search any user's information
         // by id if exist and your id right and password right.
         let id = cnx.params.id;
         let data = await model.getById(id);
        //if the id u want to search is not exist.
         if(data.length === 0){
            cnx.response.status = 404;
            cnx.body = {message:"user not found"}
         }
         else
            cnx.body = data;
         }
   })(cnx)
});


//the id should be a number greater than or equal 1
router.get('/:id([0-9]{1,})', async (cnx, next) =>{
   let id = cnx.params.id;
   let data = await model.getById(id);
   if(data.length === 0){
      cnx.response.status = 404;
      cnx.body = {message:"user not found"}
   }
   else
      cnx.body = data;
});

//note that we have injected the body parser only in the POST request
/**
 * The script to process new user registration.
 * @name Register Script
 * @route {POST} /
 */
router.post('/', bodyParser(), async (cnx, next) =>{
   //prevent server crash if values is undefined
   let newUser = {
      email : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.email, 
      password : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.password,
      passwordConfirmation: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.passwordConfirmation
   };
   try{
      await model.add(newUser);
      cnx.response.status = 201;
      cnx.body = {message:"user was added successfully"};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message: error.message};
   }
});

//note that we have injected the body parser only in the POST request
/**
 * The script to process new user registration.
 * @name login Script
 * @route {POST} /
 */

router.post('/login', bodyParser(), async (cnx, next) => {

   //prevent server crash if values is undefined
   try {
      const testingExistingUser = await model.login(cnx.request.body.values.username, cnx.request.body.values.password);
      cnx.response.status = 201;
      cnx.body = { message: "user was login successfully" };
      //return testingExistingUser
   }
   catch (error) {
      cnx.response.status = error.status;
      cnx.body = { message: error.message };
   }
});


router.put('/:id([0-9]{1,})', async (cnx, next) =>{
   //TODO: edit a user
   
});

router.del('/:id([0-9]{1,})', async (cnx, next) =>{
   //TODO: delete a user
   
});

module.exports = router;