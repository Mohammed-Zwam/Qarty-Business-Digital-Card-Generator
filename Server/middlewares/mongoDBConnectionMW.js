const mongoose = require('mongoose');

module.exports = (req, res, nxt) => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB");
    } else {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => {
                console.log("Connected to MongoDB successfully!");
            })
            .catch((err) => {
                console.log("Error details:\n");
                console.log("Message:", err.message);
                console.log("Code:", err.code);
                console.log("Full error:", err);
            });
    }

    nxt();
};