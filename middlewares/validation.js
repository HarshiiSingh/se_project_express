const { Joi, celebrate } = require('celebrate');
const validator = require('validator');


module.exports.validateUrl = (value, helpers) => {
  if  (validator.isUrl(value)) {
    return value;
  }
  return helpers.error("string.uri");
}

module.exports.validateItem = (value, helpers) => {
  if (!validator.isHexadecimal(value) || value.length === 24) {
    return value;
  }
  return helpers.error(
    "Must be 24-character hexadecimal string"
  );
};

module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'the "imageUrl" field must be a valid url',
    }),
  })
})

module.exports.validateUserBodyInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.uri': 'the "email" field must be a valid url',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  })
})

module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.uri': 'the "email" field must be a valid url',
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  })
})

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
    })
  })



// module.exports = {
//   validateUrl,
//   validateEmail,
//   validateItem,
//   validateClothingItems,
//   validateUserBodyInfo,
//   validateAuth,
//   validateId,
// }