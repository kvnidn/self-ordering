const express = require('express');
const route = express.Router();

const controller = require('../controllers/menuController');

// FOR REQUEST
const axios = require('axios');

route.get('/dashboard', (req, res) => {
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

route.get('/dashboard/add_menus', (req, res) => {
    res.render("add_menus.ejs", {title: "Dashboard", script: "", layout: "layouts/main-layout.ejs", errors: "", formData: ""});
})

route.get('/dashboard/update_menus', (req, res) => {
    axios.get("http://localhost:3000/menus", {params: {id: req.query.id}})
    .then(menudata => {
        res.render("update_menus.ejs", {title: "Dashboard", script: "", layout: "layouts/main-layout.ejs", menu: menudata.data, errors: ""});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render("update_menus.ejs", {title: "Dashboard", script: "", layout: "layouts/main-layout.ejs"});
})


// API

route.post('/menus', controller.create);
route.get('/menus', controller.find);
route.put('/menus/:id', controller.update);
route.delete('/menus/:id', controller.delete);

module.exports = route