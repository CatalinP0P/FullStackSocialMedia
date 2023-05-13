const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().min(6),
    })
    return schema.validate(data);
}

module.exports = {
    registerValidation: registerValidation,
}
