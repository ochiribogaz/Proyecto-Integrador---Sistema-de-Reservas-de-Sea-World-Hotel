const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/* Creating a new schema for the user. */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin','editor']
    },
    lastAccess: {
        type: Date,
        default: Date.now
    },
    hash: { type: String },
    salt: { type: String },
    resetToken: {
        type: String,
    },
});

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        lastname: this.lastname,
        role: this.role,
        lastAccess: this.lastAccess,
        exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
};

/* Setting the password. */
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
};


/* Checking if the password is valid. */
userSchema.methods.validPassword = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
    return this.hash === hash;
};

userSchema.methods.generatePassword = function(){
    return Math.random().toString(36).slice(-8);
}

/* Creating a new model called user. */
const User = new mongoose.model('user', userSchema,'users');

/*const usr = new User({
    name:'Sebastian',
    lastname: 'Insuasti',
    email:'sebasinsuasti13@gmail.com',
    role: 'admin'
});

usr.setPassword("Bg*12345");

usr.save();*/