const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// const path = require("path");

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');

dotenv.config()

const port = process.env.port || 3000;
const MONGO_URL = process.env.URI;

const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require("./middleware/authMiddleware");


app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use(express.json());
// Static
app.use(express.static("public"));

app.use(cookieParser());
// Layouts
app.use(expressLayouts);

app.use(morgan('dev'))
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/menuRoute', require('./routes/api/menuRoute'))
app.use('/api/cartRoute', require('./routes/api/cartRoute'))

mongoose.connect(MONGO_URL)
    .then(() => console.log(`MongoDB connected ${MONGO_URL}`))
    .catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
})

app.use(authRoutes);

// Check Account
app.get('*', checkUser);

app.get("/", (req, res) => {
    res.render("index.ejs", {title: "McDini - Home", script: "../scripts/script.js", layout: "layouts/main-layout.ejs"})
})

// requireAuth => require to Login, else cant go to link
// app.get("/order", requireAuth, (req, res) => {
//     res.render("order.ejs", {title: "McDini - Order", script: "../scripts/order.js", layout: "layouts/main-layout.ejs"})
// })

app.get("/order", (req, res) => {
    res.render("order.ejs", {title: "McDini - Order", script: "../scripts/order.js", layout: "layouts/main-layout.ejs"})
})

app.get("/locations", (req, res) => {
    res.render("locations.ejs", {title: "McDini - Locations", script: "", layout: "layouts/main-layout.ejs"})
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {title: "McDini - About Us", script: "", layout: "layouts/main-layout.ejs"})
})


// // Cookies
// app.get('/set-cookies', (req, res) => {
//     // res.setHeader('Set-Cookie', 'newUser=true');
//     res.cookie('newUser', false);
//     res.cookie('isEmployee', true, { maxAge: 5000 * 60 * 60 * 24, httpOnly: true });
//     res.send("You got the cookies");
// })

// app.get('/read-cookies', (req, res) => {
//     const cookies = req.cookies;
//     console.log(cookies.newUser);

//     res.json(cookies);
// })

// Menu Routers
app.use('/', require('./routes/router'))