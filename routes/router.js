/*
    router.js, membuat server dengan ejs,
    menggunakan middleware untuk user
    menggunakan axios untuk request http
    menggunakan multer buat upload page
    membuat route untuk dashboard (add menu, update menu, delete menu, find menu) memakai API dari file controller (menuController)
*/
const express = require('express');
const route = express.Router();

const controller = require('../controllers/menuController');

// FOR REQUEST
const axios = require('axios');
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const util = require("util")
const unlinkFile = util.promisify(fs.unlink)

route.get('/dashboard', requireAuth, (req, res) => {
    axios.get("http://localhost:3000/menus")
        .then((response) => {
            res.render("dashboard.ejs", {
                menu: response.data, title: "Dashboard", script: "", layout: "layouts/main-layout.ejs", menu: response.data
            })
        })
        .catch(err => {
            res.send(err);
        })

})

route.get('/dashboard/add_menus', requireAuth, (req, res) => {
    res.render("add_menus.ejs", {title: "Dashboard", script: "", layout: "layouts/main-layout.ejs", errors: "", formData: ""});
})

route.get('/dashboard/update_menus', requireAuth, (req, res) => {
    axios.get("http://localhost:3000/menus", {params: {id: req.query.id}})
    .then(menudata => {
        res.render("update_menus.ejs", {title: "Dashboard", script: "", layout: "layouts/main-layout.ejs", menu: menudata.data, errors: ""});
    })
    .catch(err => {
        res.send(err);
    })})


// API
route.post('/menus', controller.create);
route.get('/menus', controller.find);
route.put('/menus/:id', controller.update);
route.delete('/menus/:id', controller.delete);




// UPLOAD MENU
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/assets/menu/uploads/')
    },
    filename: function(req, file, cb) {

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

    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('file')

const checkFileType = (file, cb) => {
    const fileTypes = /png/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname){
        return cb(null, true)
    } else {
        cb("Please upload images only")
    }
}

route.post("/dashboard/upload", (req, res) => {
    upload(req, res, (err) => {
        if (!err && req.files != ""){  
            res.status(200).send(res.req.file.filename)
        } else if (!err & req.files == ""){
            res.statusMessage = "Please select an image to upload"
            res.status(400).end()
        } else{
            res.statusMessage = (err === "Please upload images only") ? err : "Photo exceed limit of 1 MB"
            res.status(400).end()
        }
    })
})

module.exports = route;