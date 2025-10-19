const mongoose = require('mongoose');
const validator = require('validator');
const digitalCardSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return /^[\u0600-\u06FFa-zA-Z\s]+$/.test(val);
            },
            message: "Name must contain only letters"
        }
    },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    imgSrc: {
        type: String,
        required: true
    },
    imgId: {
        type: String,
        required: true
    },
    links: [
        {
            _id: false,
            linkName: {
                type: String,
                required: true,
                enum: ["whatsapp", "phone number", "email", "linkedin", "facebook", "youtube", "website", "github", "x", "behance", "cv"],
            },
            linkUrl: {
                type: String,
                required: true
            }
        }
    ],
});

module.exports = mongoose.model("DigitalCard", digitalCardSchema);