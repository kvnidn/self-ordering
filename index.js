const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// const path = require("path");

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config()

const port = process.env.port || 3000;
const MONGO_URL = process.env.URI

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));


// Static
app.use(express.static("public"));

// Layouts
app.use(expressLayouts);

app.use(morgan('dev'))

app.use('/api/menuRoute', require('./routes/api/menuRoute'))

mongoose.connect(MONGO_URL)
    .then(() => console.log(`MongoDB connected ${MONGO_URL}`))
    .catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
})

app.get("/", (req, res) => {
    res.render("index.ejs", {title: "McDini - Home", script: "../scripts/script.js", layout: "layouts/main-layout.ejs"})
})

app.get("/order", (req, res) => {
    res.render("order.ejs", {title: "McDini - Order", script: "../scripts/order.js", layout: "layouts/main-layout.ejs"})
})

app.get("/locations", (req, res) => {
    res.render("locations.ejs", {title: "McDini - Locations", script: "", layout: "layouts/main-layout.ejs"})
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {title: "McDini - About Us", script: "", layout: "layouts/main-layout.ejs"})
})