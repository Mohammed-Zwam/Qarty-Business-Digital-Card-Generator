const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "djcgjpq9y",
    api_key: "152517429282229",
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;