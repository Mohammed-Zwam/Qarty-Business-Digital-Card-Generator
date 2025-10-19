const Ajv = require('ajv');
const ajvErrors = require("ajv-errors");
const validator = require('validator');
const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv);


ajv.addFormat("username", /^[A-Za-z_][A-Za-z0-9_-]{2,19}$/);
ajv.addFormat("email", {
    validate: (val) => {
        return validator.isEmail(val);
    }
});


ajv.addFormat("strongPassword", {
    validate: (val) => {
        return validator.isStrongPassword(val);
    }
});


const registerSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            format: 'username',
            errorMessage: {
                format: "Username must be 3–20 characters long, start with a letter or '_', and contain only letters, numbers, '_' or '-'"
            }
        },
        email: {
            type: 'string',
            format: 'email',
            errorMessage: {
                format: "Invalid email format."
            }
        },
        password: {
            type: 'string',
            format: 'strongPassword',
            errorMessage: {
                format: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            }
        },
    },
    required: ['username', 'email', 'password'],
    additionalProperties: false
}

module.exports = ajv.compile(registerSchema);

