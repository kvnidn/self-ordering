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

// Render dashboard page
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


// Menu API
route.post('/menus', controller.create);
route.get('/menus', controller.find);
route.put('/menus/:id', controller.update);
route.delete('/menus/:id', controller.delete);


// Save image when new menu is created
const storage = multer.diskStorage({
    // Determine the destination directory to store uploaded files
    destination: function(req, file, cb) {
        cb(null, './public/assets/menu/uploads/')
    },
    // Determine the filename for the stored file
    filename: function(req, file, cb) {

        // Create a Date object representing the current date and time
        var currentDate = new Date();

        // Get date components
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1; // Note that months are zero-indexed
        var year = currentDate.getFullYear();

        // Get time components
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();

        // Combine components into a string with the desired format
        var formattedDate = `${day}${month < 10 ? '0' : ''}${month}${year.toString().substr(-2)}-${hours < 10 ? '0' : ''}${hours}${minutes < 10 ? '0' : ''}${minutes}${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Return the formed filename
        cb(null, formattedDate + path.extname(file.originalname))

    }
})

// Middleware for handling file upload using multer
const upload = multer({
    // Specify the storage configuration for multer
    storage: storage,
    // Set limits for the uploaded file
    limits: {fileSize: 1000000}, // Limit file size to 1MB
    // Define a file filter function
    fileFilter: function(req, file, cb){
        // Call the checkFileType function to validate the file type
        checkFileType(file, cb)
    }
}).single('file') // Handle only single file uploads with the field name 'file'

// Function to check if the file type is PNG
const checkFileType = (file, cb) => {
    // Regular expression to determine the accepted file types
    const fileTypes = /png/

    // Checking the file extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    
    // Checking the MIME type of the file
    const mimetype = fileTypes.test(file.mimetype)

    // If the extension and MIME type match, call back with null (no error) and true (file accepted)
    if (mimetype && extname){
        return cb(null, true)
    } else {
        // If the extension or MIME type doesn't match, call back with an error message
        cb("Please upload images only")
    }
}

// POST route to handle file uploads to the dashboard
route.post("/dashboard/upload", (req, res) => {
    // Using the 'upload' middleware to handle file uploads
    upload(req, res, (err) => {
        // If there's no error and files were uploaded successfully
        if (!err && req.files != ""){  
            // Sending a successful response with the filename
            res.status(200).send(res.req.file.filename)
        }
        // If there's no error but no files were selected for upload 
        else if (!err & req.files == ""){
            // Set a descriptive error message
            res.statusMessage = "Please select an image to upload"
            // Sending a bad request response
            res.status(400).end()
        }
        // If there's an error 
        else{
            // Setting an appropriate error message based on the error type
            res.statusMessage = (err === "Please upload images only") ? err : "Photo exceed limit of 1 MB"
            // Sending a bad request response
            res.status(400).end()
        }
    })
})

module.exports = route;