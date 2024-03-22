// =================================================================
// FOR SIGN UP LOGIN

const User = require('../models/user');
const jwt = require('jsonwebtoken');


const maxAge = 5 * 24 * 60 * 60;


const handleError = (err) => {
    console.error(err.message, err.code);
    let errors = { email: "", password: "" };

    if (err.message === "Incorrect email") { 
        errors.email = "Email not registered";
    }
    
    if (err.message === "Incorrect password") {
        errors.password = "Password is not correct";
    }
    
    if (err.code === 11000) {
        errors.email = "Email is already in use";
    }

    else if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
};


const createToken = (id) => {
    const token = jwt.sign({ id: id }, "Secret", { expiresIn: maxAge});
    return token;
}

module.exports.signup_get = (req, res) => {
    const userData = req.user || res.locals.user;
    res.render('signup', {title: "SignUp", script: "", layout: "layouts/main-layout.ejs", user: userData});
}

module.exports.login_get = (req, res) => {
    const userData = req.user || res.locals.user;
    res.render('login', {title: "Login", script: "", layout: "layouts/main-layout.ejs", user: userData});
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email: email, password: password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json( { user: user._id});
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }


    // console.log(email, password);

    // res.send('new signup');
}

module.exports.login_post = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    // console.log(email, password);

    // res.send('user login');
    try {
        // Use user.js function to login
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors })
    }

    
}

module.exports.logout_get = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
    // res.cookie('jwt', '', {maxAge: 1});
    // res.redirect('/');
}