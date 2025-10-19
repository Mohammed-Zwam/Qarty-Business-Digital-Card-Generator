require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const allowedOrigins = require("./config/origins");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');
const digitalCardRouter = require('./routes/digitalCardRoutes');
const path = require("path");


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



// ROUTES
app.use("/auth", authRouter);
app.use("/api/digital-card", digitalCardRouter);
app.get("/", (req, res) => {
    res.send(require("./config/endpointsDoc.json"));
});


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB ...");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} ...`);
    });
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
})

module.exports = app;