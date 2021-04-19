
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const nodemailer = require('nodemailer');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8002";

// this is just an example of 2fa auth
var twoWayAuth = {
        auth12345:{
            id : "12345",
            verificationNumber: '54321',
            timestamp: '10-04-2021 01:05:00'
        },
        auth12345:{
            id : "12345",
            verificationNumber: '54321',
        }
    }

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// // Parse URL-encoded bodies (as sent by HTML forms)
// app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/**
 * Mailer settings
 */

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail',
      pass: 'email_password' // naturally, replace both with your real credentials or an application-specific password
    }
  });
  
  const mailOptions = {
    from: 'youremail',
    to: 'user',
    subject: 'Authentication code No-Reply',
    text: 'Dudes, we really need your money. and here is the code \n 1234'
  };
  
//!   this is how to send an email 
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });


/**
 * Routes Definitions
 */
// app.get("/", (req, res) => {
//     res.status(200).send("WHATABYTE: Food For Devs");
//   });

app.get("/", (req, res) => {
    res.render('pages/login.ejs');
});
app.get("/login", (req, res) => {
    res.render('pages/login.ejs');
});

app.post("/login", (req, res) => {
    
    console.log(req.body)
    var condition = false
    if (condition){
    res.send({status: 'success',link: '/2fa/test'});
    }else{
    res.send({status: 'Invalid credintials',link: '/register1'});
    }
});


app.get("/register1", (req, res) => {
    res.render('pages/register1.ejs');
});

app.post("/register1", (req, res) => {
    
    console.log(req.body)
    var condition = false
    if (condition){
    res.send({status: 'success',link: '/register2'});
    }else{
    res.send({status: 'Server error',link: ''});
    }
});


app.get("/register2", (req, res) => {
    res.render('pages/register2.ejs');
});
app.post("/register2", (req, res) => {
    
    console.log(req.body)
    var condition = false
    if (condition){
    res.send({status: 'success',link: '/register2'});
    }else{
    res.send({status: 'Server error',link: ''});
    }
});

app.get("/2fa/:id:", (req, res) => {
    const {id} = req.params()
    res.render('pages/index.ejs');
});

app.get("/2fa/test", (req, res) => {
    // const {id} = req.params()
    res.render('pages/twoAuth.ejs');
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });