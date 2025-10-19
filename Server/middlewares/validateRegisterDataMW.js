const validate = require('../util/registerDataValidator');

module.exports = (req, res, nxt) => {
    const isValid = validate(req.body);
    if (!isValid) {
        return res.status(400).json({
            ok: false,
            message: validate.errors[0].message
        })
    }
    nxt();
}