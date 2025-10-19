const Ajv = require('ajv');
const ajvErrors = require("ajv-errors");
const ajv = new Ajv({ allErrors: true })

ajvErrors(ajv);

ajv.addFormat("txt", /^[\u0600-\u06FFa-zA-Z\s]+$/);


const digitalCardSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            format: "txt",
            errorMessage: "Name is not valid"
        },
        position: {
            type: "string"
        },
        description: {
            type: "string",
            maxLength: 500,
        },
        imgSrc: {
            type: "string",
        },
        imgId: {
            type: "string",
        },
        links: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    linkName: {
                        type: "string",
                        enum: ["whatsapp", "phone number", "email", "linkedin", "facebook", "youtube", "website", "github", "x", "behance", "cv"]
                    },
                    linkUrl: {
                        type: "string",
                    }
                }
            }
        }
    },
    required: ["name", "position", "description", "links", "imgSrc"],
    additionalProperties: false
}

module.exports = ajv.compile(digitalCardSchema);
