const Joi = require('joi');

// Joi return the object of details of error and value (validated data) ==> {error : {details: [ { message: ""}]}}
const categoryValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .pattern(/^(?!\d+$)[a-zA-Z0-9\s]+$/, 'Category name must include letters and not be only numbers')
    .messages({
      'string.base': 'Category name should be a text.',
      'string.empty': 'Category name is required.',
      'string.min': 'Category name should have at least 3 characters.',
      'string.max': 'Category name should have at most 50 characters.',
      'string.pattern.name': 'Category name must include letters and not be only numbers.',
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(200)
    .required()
    .pattern(/^(?!\d+$).+$/, 'Description must include letters and not be only numbers')
    .messages({
      'string.base': 'Description should be a text.',
      'string.empty': 'Description is required.',
      'string.min': 'Description should have at least 10 characters.',
      'string.max': 'Description should have at most 200 characters.',
      'string.pattern.name': 'Description must include letters and not be only numbers.',
    }),
});


module.exports = categoryValidationSchema;