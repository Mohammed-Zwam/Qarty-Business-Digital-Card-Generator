const cloudinary = require("../config/cloudinaryConfig");

module.exports = async (publicId) => {
    try {
        if (!publicId)
            return false;

        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        return false
    }
};
