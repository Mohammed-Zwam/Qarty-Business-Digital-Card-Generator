const validate = require("../util/digitalCardDataValidator");


module.exports = (req, res, nxt) => {
    req.body.links = JSON.parse(req.body.links);
    const isValid = validate(req.body);
    if (!isValid) {
        return res.status(400).json({
            ok: false,
            message: validate.errors[0].message
        });
    }
    nxt();
}