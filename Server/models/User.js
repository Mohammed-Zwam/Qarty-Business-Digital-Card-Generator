const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                const regex = /^[A-Za-z_][A-Za-z0-9_-]{2,19}$/;
                return validator.matches(val, regex);
            },
            message: "Username must be 3–20 characters long, start with a letter or '_', and contain only letters, numbers, '_' or '-'"
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return validator.isEmail(val);
            },
            message: "Email Is Not Valid"
        }
    },
    password: {
        type: String,
        required: true,
    },
    hasDigitalCard: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAccessToken = function (userID) {
    const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    return accessToken;
};

userSchema.methods.generateRefreshToken = function (userID) {
    const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return refreshToken;
};


module.exports = mongoose.model("User", userSchema);