const cloudinary = require("../config/cloudinaryConfig");
const stream = require("stream");

module.exports = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "qarty_images" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                const bufferStream = new stream.PassThrough();
                bufferStream.end(req.file.buffer);
                bufferStream.pipe(uploadStream);
            });
        };

        const result = await uploadToCloudinary();
        req.body.imgSrc = result.secure_url;
        req.body.imgId = result.public_id;
        next();
    } catch (err) {
        res.status(500).json({ error: "Image upload failed" });
    }
};
