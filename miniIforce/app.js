const { publicDecrypt } = require('crypto');
const express = require('express');
//const morgan = require('morgan');
const mongoose = require('mongoose');
const _ = require('lodash');

const Customers = require('./models/customers');
const Admin = require('./models/admins');
const Worker = require('./models/workers');
const Jobs = require('./models/jobs');

//database protection
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

//express app
const app = express();

//connect to mongodb 
//listen for requests
const dbURI=process.env.DB_CONNECTION;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

//EJS included
app.set('view engine','ejs');

//static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

//to view images define static file path
app.use(express.static(__dirname+'/images'));


//------------------------------------------------------------------

//BLOG ROUTES
//get the index page
app.get('/', (req,res) => {
    res.render('index');
});

//SIGN UP
//get the sign up page
app.get('/signUp', (req,res) => {
    res.render('signUp');
});

//POST the signUp page
app.post('/signUp', (req, res) => {
    const customers = new Customers(req.body);

    customers.save()
      .then(result => {
        res.render('login');
      })
      .catch(err => {
        console.log(err);
      });
  });
//END SIGN UP


//LOGIN
//get the login page
app.get('/login', (req,res) => {
    res.render('login');
});

//POST the login page
app.post('/login', (req, res) => {
  // const customers = new Customers();
  let body=req.body
  let type=body.type;

if(type == 'customer')
{
  //customers
  Customers.findOne({username:body.username,password:body.password})
    .then(result => {
      if(result){
        console.log(result)
        console.log("Sucsss")
        res.render('viewJobs');
      }else{
        console.log("Wrong Credentials")
      }
    })
    .catch(err => {
      console.log(err);
    });

} else if ( type== 'worker'){
//workers
Worker.findOne({username:body.username,password:body.password})
.then(result => {
  if(result){
    console.log(result)
    console.log("Sucsss")
    res.render('viewJobs');
  }else{
    console.log("Wrong Credentials")
  }
})
.catch(err => {
  console.log(err);
});

} else if( type == "admin"){
//admin
    Admin.findOne({username:body.username,password:body.password})
    .then(result => {
      if(result){
        console.log(result)
        console.log("Sucsss")
        res.render('adminViews');
      }else{
        console.log("Wrong Credentials")
      }
    })
    .catch(err => {
      console.log(err);
    });

}
});
//END LOGIN


//get the admin add page
app.get('/views/adminAdd', (req,res) => {
  res.render('adminAdd');
});

//render from admin pop up
app.post('/adminAdd', (req, res) => {
  const admin = new Admin(req.body);
  admin.save()
    .then(result => {
      res.render('adminAdd');
    })
    .catch(err => {
      console.log(err);
    });
});

//render from customer pop up
app.post('/customerAdd', (req, res) => {
  const customer = new Customers(req.body);
  customer.save()
    .then(result => {
      res.render('adminAdd');
    })
    .catch(err => {
      console.log(err);
    });
});

//render from worker pop up
app.post('/workerAdd', (req, res) => {
  const worker = new Worker(req.body);
  worker.save()
    .then(result => {
      res.render('adminAdd');
    })
    .catch(err => {
      console.log(err);
    });
});
//------------------------------------------------------------------------------

//Admin view page
app.get('/views/adminVisualize', (req,res) => {
  res.render('adminVisualize');
});


//get mongodb admins data and page
app.get('/adminsDB', (req,res) => {
  MongoClient.connect(dbURI, {useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("iForceMini");
    //Find the first document in the customers collection:
  dbo.collection("admins").find({}).toArray(function(err, result) {
    if (err) throw err;
    else{
        // console.log(result);
        res.render('adminsDB', { result: result }); 
        db.close();
      }
  });
  });
})


//get mongodb customers data and page
app.get('/customersDB', (req,res) => {
  MongoClient.connect(dbURI, {useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("iForceMini");
    //Find the first document in the customers collection:
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    else{
        // console.log(result);
        res.render('customersDB', { result: result }); 
        db.close();
      }
  });
  });
})


//get mongodb workers data and page
app.get('/workersDB', (req,res) => {
  MongoClient.connect(dbURI, {useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("iForceMini");
    //Find the first document in the customers collection:
  dbo.collection("workers").find({}).toArray(function(err, result) {
    if (err) throw err;
    else{
        // console.log(result);
        res.render('workersDB', { result: result }); 
        db.close();
      }
  });
  });
})
// -------- END of Admin view page --------

//-------- CUSTOMER VISUALIZE PAGE --------

//get mongodb jobs data and page
app.get('/customerVisualize', (req,res) => {
  MongoClient.connect(dbURI, {useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("iForceMini");
    //Find the first document in the customers collection:
  dbo.collection("jobs").find({}).toArray(function(err, result) {
    if (err) throw err;
    else{
        // console.log(result);
        res.render('customerVisualize', { result: result }); 
        db.close();
      }
  });
  });
})
//-------- END OF CUSTOMER VISUALIZE PAGE --------

//otherwise get the 404 page
app.use((req,res) => {
    res.status(404).render('404');
});