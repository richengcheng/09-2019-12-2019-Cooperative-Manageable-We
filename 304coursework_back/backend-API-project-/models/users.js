'use strict';

const mysql = require('promise-mysql');
const bcrypt = require('bcryptjs');
const info = require('../config');

//get an user by its id
exports.getById = async (id) => {
	try {
		//first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
		let sql = `SELECT * FROM users
					WHERE id = ${id}
				`;
		//wait for the async code to finish
        let data = await connection.query(sql);
		
		//wait until connection to db is closed 
		await connection.end();

		//return the result
        return data;

    } catch (error) {
		//if an error occured please log it and throw an exception
        throw new Error(error)
    }
}

//this method is to verify a user does exist in db with such email and pwd
exports.findOne = async (authData, callback) => {

    try {
		//first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
		let sql = `SELECT * FROM users
					WHERE email = \'${authData.email}\'
				`;
		//wait for the async code to finish
        let data = await connection.query(sql);
        
        //wait until connection to db is closed 
        await connection.end();
        
        if(data.length > 0){
            //check if the hashed passwords match
            let pass = bcrypt.compareSync(authData.password, data[0].pwd);
            
            if(pass)
                //if yes callback with the user data
                callback(null, data[0]); 
            else
                // otherwise callback with false
                callback(null, false); 
        }
        else{
            //no such email was found
            callback(null, false);
        }
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
		//if an error occured please log it and throw an exception
        callback(error);
    }
}

exports.add = async (user) => {
	try {
        //server validation rules 
        //email is required        
        if(user.email === undefined){
            throw {message:'email is required', status:400};
        }
        //paswword is required
        if(user.password === undefined){
            throw {message:'password is required', status:400};
        }
        else{
            //if password is provided it must be ay least 6 characters long
            if(user.password.length < 6){
                throw {message:'password must be more than 6 characters long', status:400};
            }
        }
        //passwordConfrimation is required
        if(user.passwordConfirmation === undefined){
            throw {message:'password confirmation is required', status:400};
        }
        else{
            //if passwordConfirmation is provided then it must match password
            if(user.password !== user.passwordConfirmation ){
                throw {message:'passwords don\'t match', status:400};
            }
        }
        //email should be a valid email address
        //we will use a regular expression to validate the email format
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(user.email).toLowerCase()))
            throw {message:'invalid email address format', status:400};

        //final check is to make sure that email should be unique and never been used in the system
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT email from Users WHERE
                    email = \'${user.email}\'`;
        
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);

        //if the query return a record then this email has been used before
        if(data.length){
            //first close the connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message:'email address already in use', status:400};
        }

        //hash the password using bcryptjs package
        let salt = bcrypt.genSaltSync(10);
       let hash = bcrypt.hashSync(user.password, salt);

        //create a new object to hold users final data
        let userData = {
            email: user.email, 
            password: hash
        }
        
        //this is the sql statement to execute
		sql = `INSERT INTO users
					SET ?
                `;
                
        data = await connection.query(sql, userData);
		
		await connection.end();

        return data;

    } catch (error) {
        //in case we caught an error that has no status defined then this is an error from our database
        //therefore we should set the status code to server error
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

// this is login function
exports.login= async (username, password) => {
    try {
        

        if(username === undefined){
            throw {message:'email is required', status:400};
        }
        //paswword is required
        if(password === undefined){
            throw {message:'password is required', status:400};
        }
      
        //check the email first before check the password
        let sql = `SELECT id FROM users WHERE email="${username}";`
       
        const connection = await mysql.createConnection(info.config);
        
        let records  = await connection.query(sql);
      

        if(records.length==0) throw {message:'email is not exist', status:400};
        sql = `SELECT password FROM users WHERE email = "${username}";`
  
         let resultPassword  = await connection.query(sql);
        const valid = await bcrypt.compare(password, resultPassword[0].password)
     
   
        if(valid === false) throw {message:'wrong password for account', status:400};
        await connection.end();

        return true
    } catch(error) {
        throw error
    }
}

exports.getIDByUsername = async (username) => {
    try {
        
        // connect to the database
        const connection = await mysql.createConnection(info.config);

        // this is the sql statement to execute
		let sql = `SELECT ID FROM users
					WHERE email = \'${username}\'
				`;
		// wait for the async code to finish
        let data = await connection.query(sql);
		
		// wait until connection to db is closed 
        await connection.end();
        // return the result
        data = JSON.parse(JSON.stringify(data))
        data = String(data[0].ID)
        return data;
    } catch (error) {
        throw error
    }
}
