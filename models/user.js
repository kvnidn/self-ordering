/*
    User Schema untuk database MongoDB
    memakai validator untuk email, bcrypt untuk hashing 
*/
const mongoose = require('mongoose');
// email validator
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Get user Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username"],
        unique: [true, "Username exists"],
        minLength: [3, "Please enter a minimum length of characters: 3"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: true,
        lowercase: true,
        validate:[isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [5, "Minimum length of the password is 5"]
    },
    role: {
        type: String,
    }
})

// After Saved
userSchema.post('save', function(doc, next) {
    console.log("New User was created", doc);
    next();
});

// Pre Saved
// Hashing password for better security
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // console.log("User was about to be saved", this);
    next();
});

// For login checking with JWT password
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email: email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
}


const User = mongoose.model('user', userSchema);
// import Schema
module.exports = User;