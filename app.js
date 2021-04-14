
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");

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
        }
    }

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

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
app.get("/register1", (req, res) => {
    res.render('pages/register1.ejs');
});
app.get("/register2", (req, res) => {
    res.render('pages/register2.ejs');
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