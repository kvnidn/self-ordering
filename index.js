const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// const path = require("path");

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
// app.set("views", path.join(__dirname, "views"));

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

app.use('/api/menuRoute', require('./routes/api/menuRoute'))
app.use('/api/cartRoute', require('./routes/api/cartRoute'))

// app.use('/dashboard/carts', require('./routes/api/cartRoute'));

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


// 
app.get("*", (req, res) => {
    res.render('404', { title: 'Error Page', layout: false});
});



// UPLOAD MENU

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const util = require("util")
const unlinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/assets/menu/uploads/')
    },
    filename: function(req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        // Membuat objek Date yang mewakili tanggal dan waktu saat ini
        var currentDate = new Date();

        // Mendapatkan komponen tanggal
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1; // Perhatikan bahwa bulan dimulai dari 0
        var year = currentDate.getFullYear();

        // Mendapatkan komponen waktu
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();

        // Menggabungkan komponen menjadi string dengan format yang diinginkan
        var formattedDate = `${day}${month < 10 ? '0' : ''}${month}${year.toString().substr(-2)}-${hours < 10 ? '0' : ''}${hours}${minutes < 10 ? '0' : ''}${minutes}${seconds < 10 ? '0' : ''}${seconds}`;
        
        cb(null, formattedDate + path.extname(file.originalname))

        // Mendapatkan nama menu dari input dengan name="name"
        // const menuName = req.body.name.toLowerCase().replace(/\s+/g, '-'); // Mengubah ke huruf kecil dan ganti spasi dengan strip
        // const uniqueSuffix = Date.now();
        // const fileName = `${menuName}-${uniqueSuffix}${path.extname(file.originalname)}`;
        // cb(null, fileName);
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).any()

function checkFileType (file, cb) {
    const fileTypes = /png/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname){
        return cb(null, true)
    } else {
        cb("Please upload images only")
    }
}

app.post("/dashboard/upload", (req, res) => {
    upload(req, res, (err) => {
        if (!err && req.files != ""){
            res.status(200).send()
        } else if (!err & req.files == ""){
            res.statusMessage = "Please select an image to upload"
            res.status(400).end()
        } else{
            res.statusMessage = (err === "Please upload images only") ? err : "Photo exceed limit of 1 MB"
            res.status(400).end()
        }
    })
})