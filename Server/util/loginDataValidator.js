const Ajv = require('ajv');
const ajvErrors = require("ajv-errors");
const validator = require('validator');
const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv);


ajv.addFormat("email", {
    validate: (val) => {
        return validator.isEmail(val);
    }
});


const loginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            errorMessage: {
                format: "Invalid email format."
            }
        },
        password: {
            type: 'string',
        },
    },
    required: ['email', 'password'],
    additionalProperties: false
}

module.exports = ajv.compile(loginSchema);

