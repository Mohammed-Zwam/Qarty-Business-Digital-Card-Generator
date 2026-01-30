require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-docs.json');
const allowedOrigins = require("./config/origins");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');
const digitalCardRouter = require('./routes/digitalCardRoutes');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// ROUTES

app.use(require('./middlewares/mongoDBConnectionMW')); // Check DB Connection (FIX: MongoDB Sleep)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/api/digital-card", digitalCardRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ...`);
});

module.exports = app;