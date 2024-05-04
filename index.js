const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const Cart = require('./models/cartModel');

dotenv.config()

const port = process.env.port || 3000;
const MONGO_URL = process.env.URI;

const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require("./middleware/authMiddleware");


app.set("view engine", "ejs");

// for getting the data form .json file or mongodb file
// Request, Responds
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
app.use('/api/cartRoute', require('./routes/api/cartRoute'))

mongoose.connect(MONGO_URL)
    .then(() => console.log(`MongoDB connected ${MONGO_URL}`))
    .catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
})

// LOGIN/SIGN UP
app.use(authRoutes);

// Check Account
app.get('*', checkUser);

// Render home page
app.get("/", (req, res) => {
    res.render("index.ejs", {title: "McDini - Home", script: "../scripts/script.js", layout: "layouts/main-layout.ejs"})
})

// Render order page
app.get("/order", (req, res) => {
    res.render("order.ejs", {title: "McDini - Order", script: "../scripts/order.js", layout: "layouts/main-layout.ejs"})
})

// Render locations page
app.get("/locations", (req, res) => {
    res.render("locations.ejs", {title: "McDini - Locations", script: "", layout: "layouts/main-layout.ejs"})
})

// Render about page
app.get("/about", (req, res) => {
    res.render("about.ejs", {title: "McDini - About Us", script: "", layout: "layouts/main-layout.ejs"})
})

// Render dashboard order page
app.get('/dashboard/carts', requireAuth, async (req, res) => {
    try {
        // Fetch data from the database
        const carts = await Cart.find();
        // Render the page and pass the fetched data to the EJS template
        res.render('carts', { title: 'Dashboard - Carts', script: '', layout: 'layouts/main-layout', carts: carts });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Menu Routers
app.use('/', require('./routes/router'))

// Render 404 page
app.get("*", (req, res) => {
    res.render('404', { title: '404 - Not Found', layout: false});
});

