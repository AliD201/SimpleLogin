/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'SWE545',
        database: 'DhahranEShopping'
    }
});



/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8002";

// this is just an example of 2fa auth
var twoWayAuth = {


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
        user: 'dhahraneshopping.noreply@gmail.com',
        pass: 'SWE545SWE545' // naturally, replace both with your real credentials or an application-specific password
    }
});



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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    var hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(hash)
    knex.select('userid', 'username', 'email', 'hashedpassword').from('users')
        .where('email', '=', email)
        .then(data => {
            console.log('Successfulllllllllly');
            console.log(hash)
            console.log(data[0].hashedpassword)

            if (hash == data[0].hashedpassword) {
                console.log('Successfulllllllllly');
                var rnd = Math.floor(Math.random() * (10000 - 999)) + 999
                var tfa = {
                    verificationNumber: rnd,
                    timestamp: new Date()
                }
                let idd = data[0].userid
                twoWayAuth[idd] = tfa
                console.log(twoWayAuth)
                    // var dead = new Date(tfa['timestamp'] + 5 * 60000)
                var dead = 'DC'
                const mailOptions = {
                    from: 'dhahraneshopping.noreply@gmail.com',
                    to: email,
                    subject: 'Authentication code No-Reply',
                    html: '<h1>Hi ' + data[0].username + ',</h1><br><h1>We need to authenticate you. Submit the following number:<b>' + rnd + '</b> This code will die at' + dead + '</h1>'
                };


                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.send({ status: 'success', link: '/2fa/' + idd });
            } else {
                console.log('Failled');
                res.send({ status: 'Incorrect Username or Password', link: '/login' }); //a problem here
                // res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Incorrect Username or Password'))

});


app.get("/register1", (req, res) => {
    res.render('pages/register1.ejs');
});

app.post("/register1", (req, res) => {

    console.log(req.body)
    var condition = false
    if (condition) {
        res.send({ status: 'success', link: '/register2' });
    } else {
        res.send({ status: 'Server error', link: '' });
    }
});


app.get("/register2", (req, res) => {
    res.render('pages/register2.ejs');
});
app.post("/register2", (req, res) => {

    console.log(req.body)
    var condition = false
    if (condition) {
        res.send({ status: 'success', link: '/register2' });
    } else {
        res.send({ status: 'Server error', link: '' });
    }
});

app.get("/2fa/:hidish", (req, res) => {
    // const { id } = req.params()
    res.render('pages/twoAuth.ejs');
});

app.post("/2fa/:hidish", (req, res) => {
    console.log(req.body)
    const hidish = req.hidish
    const digits = req.body;
    if (twoWayAuth[hidish] === digits) {
        console.log('Successfulllllllllly');
        twoWayAuth[hidish] = null;
        res.send({ status: 'Success', link: '/login' });
    } else {
        console.log('Failled');
        res.send({ status: 'Incorrect Pin Number', link: '' }); //a problem here
        // res.status(400).json('wrong credentials')
    }
});
// for resend
app.put("/2fa/:hidish", (req, res) => {


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