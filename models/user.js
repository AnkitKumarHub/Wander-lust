//defining a user model/schema

// const { required } = require("joi");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    //by default passport-local-mongoose adds a username hashed password and salt value
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
