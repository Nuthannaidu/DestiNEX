const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // It's good to have unique emails
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // allows multiple docs without googleId
    },
    username: {
        type: String,
    },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);
