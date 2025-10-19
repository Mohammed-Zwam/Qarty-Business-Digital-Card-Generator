const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const userData = req.body;
        // Check IF User Exist OR NO
        const user = await User.findOne({ email: userData.email });
        if (user) {
            res.status(400).json({
                ok: false,
                message: "User already exists"
            });
        } else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                const user = new User({ ...userData, password: hashedPassword });
                await user.save();
                res.status(201).json({
                    ok: true,
                    message: "User Created Successfully"
                });
            } catch (err) {
                res.status(400).json({
                    ok: false,
                    message: "Error Creating User",
                    err
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
            err
        })
    }
}

const login = async (req, res) => {
    const userData = req.body;
    try {
        const user = await User.findOne({ email: userData.email });
        if (!user) {
            res.status(400).json({
                ok: false,
                message: "Wrong Email OR Password"
            });
        } else {
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({
                    ok: false,
                    message: "Wrong Email OR Password"
                });
            } else {
                const accessToken = user.generateAccessToken(user._id);
                const refreshToken = user.generateRefreshToken(user._id);

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "None",
                    secure: true
                });

                res.status(200).json({
                    ok: true,
                    message: "Login Successful",
                    accessToken,
                    user: {
                        username: user.username,
                        userID: user._id,
                        hasDigitalCard: user.hasDigitalCard,
                    }
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
            err
        })
    }
}


const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            ok: false,
            message: "Unauthorized"
        });
    }
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.status(403).json({
                    ok: false,
                    message: "Forbidden"
                });
            } else {
                const userID = decoded.userID;
                const user = await User.findOne({ _id: userID });
                const accessToken = user.generateAccessToken(decoded.userID);
                res.status(201).json({
                    ok: true,
                    message: "Access Token Refreshed",
                    accessToken,
                    user: {
                        username: user.username,
                        userID: user._id,
                        hasDigitalCard: user.hasDigitalCard,
                    }
                });
            }
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
        })
    }
}

const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    res.status(200).json({
        ok: true,
        message: "Logout Successful"
    });
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}