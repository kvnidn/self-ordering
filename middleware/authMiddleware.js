const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Checking Token
const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    
    if(token) {
        jwt.verify(token, "Secret", async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.render('404', { title: '404', script: '', layout: false});
            } else {
                console.log(decodedToken);
                const user = await User.findById(decodedToken.id);

                if(user.role !== "admin"){
                    res.render('404', { title: '404', script: '', layout: false});
                }
                next();
            }
        });
    } else {
        res.render('404', { title: '404', script: '', layout: false});
    }
};

// FIND USER
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, "Secret", async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // Input into views/html
                // Username for the NAVBAR
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };