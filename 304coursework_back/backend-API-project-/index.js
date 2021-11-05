//import koa
const Koa = require('koa');
const cors = require('@koa/cors');
const staticDir = require('koa-static')
//import all the routes
const welcome = require('./routes/welcome');
const admin = require('./routes/admin');
const recipes = require('./routes/recipes.js');
const users = require('./routes/users.js');
const Category = require('./routes/category.js');
const Ingredients = require('./routes/ingredients.js');
const Steps = require('./routes/steps.js');
const nutrition = require('./routes/nutrition')
const CreateRecipes = require('./routes/createRecipes')
const viewRecipe = require('./routes/viewRecipe')
const searchRecipeByTitle = require('./routes/searchRecipeByTitle')
const updateRecipe = require('./routes/updateRecipe')
//create a koa instance and store it in app variable
const app = new Koa();

const passport = require('koa-passport');
//this import will run the code in the auth.js
require('./auth');
app.use(passport.initialize());
app.use(staticDir('.'))
app.use(cors());
////apply the routes as a middleware
app.use(welcome.routes());
app.use(admin.routes());
app.use(recipes.routes());
app.use(users.routes());
app.use(Category.routes());
app.use(Ingredients.routes());
app.use(Steps.routes());
app.use(nutrition.routes());
app.use(CreateRecipes.routes());
app.use(viewRecipe.routes());
app.use(searchRecipeByTitle.routes());
app.use(updateRecipe.routes());


//if there is no environment variable set for port number
//use a default value of 3000
var port = process.env.PORT || 3000;

//run the werver on port 3000
app.listen(port); 
