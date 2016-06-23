// import express

var express = require('express');
var app = express();
var fs = require('fs'); 
var path = require('path');
var bodyParser = require('body-parser');

// for file upload
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/firstApp/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-'+file.originalname)
  } 
});

var upload = multer({ storage: storage });

/*var uploading = multer({
    dest : __dirname + '/firstApp/uploads/'

});
*/
// use mongoose for database
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/bhavik");


// creating a Schema (model , similar to class in JAVA)
var schema = mongoose.Schema;


// creating a Schema
var userSchema = new schema({
  fname: String,
  lname : String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact : { type : String },
  path : { type : String },
  address : [{ type : String }]
});

// create a model from this schema
var user = mongoose.model('user_data', userSchema);




// listen to port
var p = 9090;
var server = app.listen(p , function(){
	var host = server.address().address;
  	var port = server.address().port;

  	console.log("listening at http://%s:%s", host, port)
});

// load files from this directory
app.use(express.static('firstApp'));

// use body parser
// instruct the app to use the `bodyParser()` middleware for all routes

app.use(bodyParser());

// respond with the html page for request for home page

app.get('/', function(req, res){
	// res.send("Hello");
	// res.sendFile("firstApp/index.html");
	displayForm(res);
	// res.sendFile(path.join(__dirname+'/index.html'));
});

// if request is for register

// can work with this also -- uploading.single('file') -- but gives any random name to uploaded file

app.post('/register', upload.single('file') , function(req, res){

    console.log(req.body);
    console.log(req.file);

	// res.send("POST Request Recieved");
    var data = req.body;
    var fname = data.fname;
    var lname = data.lname;
    var email = data.email;
    var contact = data.contact;
    var pwd = data.password;
    var addresses = [];

    // this line gets the compltete path
    // var path = req.file.path;

    var path = 'uploads/'+req.file.filename;

    var responseObj = {};

    if(checkEmpty(fname)){
        if(checkEmpty(lname)){
            if(checkEmpty(email)){
                if(isValidEmailAddress(email)){
                    if(checkEmpty(contact)){
                        if(contact.trim().length == 10){
                            if(checkEmpty(pwd)){
                                if(checkPassword(pwd)){
                                    /*responseObj.error = false;
                                    responseObj.message = "Registered Successfully"; */


                                    // create a new user object using the schema

                                    var user1 = new user({
                                        fname : fname,
                                        lname : lname,
                                        email : email,
                                        contact : contact,
                                        password : pwd,
                                        path : path

                                    });

                                    // save the object to database
                                    user1.save(function(err){
                                        if(err) {
                                            // either we can throw the error or handle it here
                                            // handling error

                                            responseObj.error = true;
                                            responseObj.message = "Error in storing user data";
                                        }
                            
                                            responseObj.error = false;
                                            responseObj.message = "User data saved Successfully";

                                            res.send(responseObj);
                                        
                                    });
                                }
                                else
                                {
                                    responseObj.error = true;
                                    responseObj.message = "Password must satisfy the specified conditions";
                                }
                            }
                            else
                            {
                                responseObj.error = true;
                                responseObj.message = "Password must not be empty";
                            }
                        }
                        else
                        {
                            responseObj.error = true;
                            responseObj.message = "Contact must be of 10 digits only";
                        }
                    }
                    else
                    {
                        responseObj.error = true;
                        responseObj.message = "Contact must not be empty";
                    }
                }
                else
                {
                    responseObj.error = true;
                    responseObj.message = "Email is invalid";
                }
            }
            else
            {
                responseObj.error = true;
                responseObj.message = "Email must not be empty";
            }
        }
        else
        {
            responseObj.error = true;
            responseObj.message = "Last Name must not be empty";
        }
    }
    else
    {
        responseObj.error = true;
        responseObj.message = "First Name must not be empty";
    }

    res.send(JSON.stringify(responseObj));
	
});

app.get('/readAll', function(req, res){
    user.find({}, function(err, allUsers){
        if(err) throw err;

        // display the records
        console.log(allUsers);
        res.send(JSON.stringify(allUsers));
    });
});

// Note : when sending query string parameters in get request , the variables come in req.query not in req.body

app.get('/deleteUser', function(req, res){
    console.log(req.query.id);

    var responseObj = {};

    user.findByIdAndRemove(req.query.id , function(err) {
      if (err) {
        responseObj.error = true;
        responseObj.message = "Error in Deleting";
      }

      // we have deleted the user
      console.log('User deleted!');

      responseObj.error = false;
      responseObj.message = "User Deleted Successfully";

      res.send(responseObj);
      
    });
});


// update the data 

app.post('/updateUser', upload.single('file'), function(req, res){
    console.log(req.body);
    console.log(req.file);


    console.log("Updating");
    // fetch the id of object to be updated
    var id = req.body.id;
    console.log("id is : "+id);
    if(req.file === undefined){
        console.log("is undefined");
        conditions = { _id : id }
      , update = { fname : req.body.fname , lname : req.body.lname , email : req.body.email , contact : req.body.contact , password : req.body.password };  

      user.update(conditions, update, callback);

      console.log("Updated Successfully")

    }
    else {

        console.log("not undefined");

        // get path of this id stored in db and delete from folder



       /* fs.exists('./www/index.html', function(exists) {
          if(exists) {
            //Show in green
            console.log(gutil.colors.green('File exists. Deleting now ...'));
            fs.unlink('./www/index.html');
          } else {
            //Show in red
            console.log(gutil.colors.red('File not found, so not deleting.'));
          }
        });*/



        var path = 'uploads/'+req.file.filename;

        conditions = { _id : id }
      , update = { fname : req.body.fname , lname : req.body.lname , email : req.body.email , contact : req.body.contact , password : req.body.password , path : path };

      user.update(conditions, update, callback);


    }

    

    

    
    

});

function callback (err, numAffected) {

    if(err) console.log("Error in updating");

      // numAffected is the number of updated documents
      if(numAffected >= 0){
        console.log("Successfully updated");
      }
}

function displayForm(res) {
    fs.readFile('firstApp/index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function checkEmpty(data){
    if(data.trim().length <= 0){
        return false;
    }
    return true;
}

// function to validate email
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}


// function for password validation
/*
1. Must be at least 8 characters
2. At least 1 number, 1 lowercase, 1 uppercase letter
3. At least 1 special character from @#$%&
*/
function checkPassword(password){
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
    if(pattern.test(password)){
        return true;
    }else{
        return false;
    }
}