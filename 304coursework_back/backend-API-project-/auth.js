const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;

//we need user model to connect to DB to verify user credentials
const User = require('./models/users');

//implement the basic auth strategy
passport.use(new BasicStrategy(
    //this is callback function that will recieve the userid and password
    //after extracting them from the request header
    function(userid, password, done) {
        //we need to create User.findOne function
        //this function receive user auth data and try to find them in the DB
        //it also recieves a call back to pass either error or user object
        User.findOne({ email: userid, password: password}, function (err, user) {
            //final decision will depend on the result of verification 
            //which we recieve from the findOne function
            //we will use done() method which is provided by Passport to save final decision
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
      });
    }
  ));