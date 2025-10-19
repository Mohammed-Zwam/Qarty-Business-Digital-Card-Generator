const jwt = require("jsonwebtoken");

module.exports = (req, res, nxt) => {
    let accessToken = req.header("authorization" || "Authorization");
    if (!accessToken || !accessToken.startsWith("Bearer ") || accessToken.split(" ").length === 1) {
        return res.status(401).json({
            ok: false,
            message: "Unauthorized"
        });
    }
    try {
        accessToken = accessToken.split(" ")[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    ok: false,
                    message: "Forbidden"
                });
            }
            req.userID = decoded.userID;
            nxt();
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err: "Internal Server Error"
        });
    }
}
