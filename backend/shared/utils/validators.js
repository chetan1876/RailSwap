const Joi = require("joi");

const validate = (schema, data) => {

    return schema.validate(data, {
        abortEarly: false,
    });

};

module.exports = {
    validate,
};