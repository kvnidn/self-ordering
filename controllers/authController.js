// =================================================================
// FOR SIGN UP LOGIN

const User = require('../models/user');
const jwt = require('jsonwebtoken');


const maxAge = 5 * 24 * 60 * 60;


// ============== FOR ADDING ACCOUNT ==================

const newAdmin = new User({
    username: 'admin',
    email: 'admin@mcdini.com',
    password: '12345',
    role: 'admin',
  });
  
newAdmin.save()
.then(admin => {
    console.log('New admin created:', admin);
})
.catch(err => {
    console.error('Error creating admin:', err);
});

// =======================================================

const handleError = (err, usernameExisted) => {
    console.error(err.message, err.code);
    let errors = { username: "", email: "", password: "" };

    if (usernameExisted) {
        errors.username = "Username is taken";
    }

    if (err.message === "Incorrect email") { 
        errors.email = "Email not registered";
    }
    
    if (err.message === "Incorrect password") {
        errors.password = "Password is not correct";
    }
    
    // Duplicate Error
    if (err.code === 11000) {
        errors.email = "Email is already in use";
    }

    // Handling error: Validation for email, Minimum Pass Length, etc
    else if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
};


// Create Token for cookies
const createToken = (id) => {
    const token = jwt.sign({ id: id }, "Secret", { expiresIn: maxAge});
    return token;
}

/*
    Request => getting data from website, example:
    Login: ___
    Password: ___

    Respond => for showing the result after we click button or after login sign up
*/
// Render username in navigation bar
module.exports.signup_get = (req, res) => {
    const userData = req.user || res.locals.user;
    res.render('signup', {title: "SignUp", user: userData});
}

// Render username in navigation bar
module.exports.login_get = (req, res) => {
    const userData = req.user || res.locals.user;
    res.render('login', {title: "Login", user: userData});
}

// Save user data from signing up
module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Create the data
        const user = await User.create({ username:username, email: email, password: password });
        // get token, get cookies
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json( { user: user._id, username: user.username } );
    }
    catch (err) {
        const usernameExisted = await User.findOne({ username });
        // handle errors, print errors
        const errors = handleError(err, usernameExisted);
        res.status(400).json({ errors });
    }
    // res.send('new signup');
}

// Build session after login
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
        res.status(200).json({ user: user._id, username: user.username });
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors })
    }

    
}

// Clear login session
module.exports.logout_get = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}

