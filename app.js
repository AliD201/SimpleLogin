/**
 * Required External Modules
 */
const express = require("express");
var session = require('express-session')
const path = require("path");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '12345',
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
app.use(session({
    secret: "the Greatest Password",
    resave: false,
    saveUninitialized: false,
}))
// // Parse URL-encoded bodies (as sent by HTML forms)
// app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
const min=5
const sec =60 

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

var MyGarbageCollector = setInterval(function() {
    const keys = Object.keys(twoWayAuth)
    var now  = new Date();
    var nextnow = new Date(now.getTime()+1*60000)
    for (const key of keys) {
        if (twoWayAuth[key].deadline<=now){
            twoWayAuth[key].verificationNumber = null
        }
        if (twoWayAuth[key].deadline<=nextnow){
            delete twoWayAuth[key]
        }
    }
    console.log(twoWayAuth)
},30 * 1000); 


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

function isLoggedIn(req, res, next){
    if (req.session.username){
        next();
    }else{
        return res.redirect('/login')
    }
}
function notLoggedIn(req, res, next){
    if (!req.session.username){
        next();
    }else{
        return res.redirect('/welcome')
    }
}
function underAuthentication(req, res, next){
    if (req.session.authentication){
        next();
    }else{
        return res.redirect('/login')
    }
}


app.get("/",notLoggedIn, (req, res) => {
    res.render('pages/login.ejs');
});
app.get("/login" , notLoggedIn, (req, res) => {
    console.log(req.session)

    res.render('pages/login.ejs');
});
app.get("/welcome",isLoggedIn, (req, res) => {
    console.log(req.session.username)
    res.render('pages/Welcome-sample.ejs', {username: req.session.username});
});
app.post("/login", notLoggedIn, (req, res) => {

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
            if (data.length === 0){
                return res.send({ status: 'Incorrect Username or Password', link: '/login' }); //a problem here 
            }

            console.log(data[0].hashedpassword)

            if (hash == data[0].hashedpassword) {
                console.log('Successfulllllllllly');
                var rnd = Math.floor(Math.random() * (10000 - 999)) + 999
                const dead = new Date(new Date().getTime() + min*sec*1000)
                var tfa = {
                    verificationNumber: rnd,
                    deadline: dead
                }
                let idd = data[0].userid
                twoWayAuth[idd] = tfa
                console.log(twoWayAuth)
                const mailOptions = {
                    from: 'dhahraneshopping.noreply@gmail.com',
                    to: email,
                    subject: 'Authentication code No-Reply',
                    html: '<h3>Hi ' + data[0].username + ', </h3><br><p>We need to authenticate you. Submit the following number:<br><b>' + rnd + '</b><br>This code will die at ' + dead + '.</p>'
                };

                console.log(mailOptions);
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                req.session.authentication = true;
                res.send({ status: 'success', link: '/2fa/' + idd });
            } else {
                console.log('Failled');
                res.send({ status: 'Incorrect Username or Password', link: '/login' }); //a problem here
                // res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Incorrect Username or Password'))

});
app.get("/logout", isLoggedIn, (req, res) => {

req.session.destroy()
res.redirect('/login')
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

app.get("/2fa/test", notLoggedIn, (req, res) => {
    var dead = new Date(new Date().getTime() + 1*sec*1000)
     dead = new Date(dead.getTime() -  new Date().getTime())
    // const {id} = req.params()
    console.log(dead)
    console.log(dead.getMinutes())
    console.log(dead.getSeconds())
    res.render('pages/twoAuth.ejs', {deadline:{
        min: dead.getMinutes(),
        sec: dead.getSeconds()
    }});
});

app.get("/2fa/:hidish", notLoggedIn, underAuthentication, (req, res) => {
    // const { id } = req.params()
    try {    
        const hidish = req.params.hidish
        const keys = Object.keys(twoWayAuth)
        var deadline = new Date (twoWayAuth[hidish].deadline -  new Date().getTime());
        for (const key of keys) {
            if (key === hidish && twoWayAuth[hidish].verificationNumber!= null) {
                return res.render('pages/twoAuth.ejs',{deadline:{
                    min: deadline.getMinutes(),
                    sec: deadline.getSeconds()
                }, username:""});
                
            }
        }
    } catch (error) {
        res.redirect('/login')       
    }
 

});

app.post("/2fa/:hidish", notLoggedIn, underAuthentication, (req, res) => {
    console.log(req.body)
    const hidish = req.params.hidish
    const digits = req.body.digits;
    console.log(hidish)
    console.log(digits)
    console.log(twoWayAuth[hidish])
    try {
        if (twoWayAuth[hidish].verificationNumber == digits) {
            console.log('Successfulllllllllly');
            delete twoWayAuth[hidish]
            knex.select('username', 'email').from('users')
            .where('userid', '=', hidish)
            .then(data => {
                req.session.username = data[0].username;
                delete req.session.authentication;
                console.log(req.session)
                return res.send({ status: 'success', link: '/welcome'});
            });
    
            
        } else {
            console.log('Failled');
            return res.send({ status: 'Incorrect Pin Number', link: `/2fa/${hidish}ّ` }); //a problem here
            // res.status(400).json('wrong credentials')
        }
    } catch (error) {
        return res.send({ status: 'success', link: '/login'})
    }
    
});
// for resend
app.put("/2fa/:hidish", notLoggedIn, underAuthentication, (req, res) => {
    const hidish = req.params.hidish
    try{
        var rnd = Math.floor(Math.random() * (10000 - 999)) + 999
        twoWayAuth[hidish].verificationNumber = rnd
        const dead = twoWayAuth[hidish].deadline
        knex.select('username', 'email').from('users')
        .where('userid', '=', hidish)
        .then(data => {
                console.log(twoWayAuth)
                const mailOptions = {
                    from: 'dhahraneshopping.noreply@gmail.com',
                    to: data[0].email,
                    subject: 'Authentication code No-Reply',
                    html: '<h3>Hi ' + data[0].username + ',</h3><br><p>We need to authenticate you. Submit the following number:<br><b>' + rnd + '</b><br>This code will die at ' + dead + '.</p>'
                };
                console.log(mailOptions);
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
            }
        catch(err){
            // console.log(err);
            res.send({ status: 'Code Timed Out', link: `/login` }); //a problem here

        }

        });

    


/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});