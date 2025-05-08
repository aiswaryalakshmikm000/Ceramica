
const Joi = require('joi');

const offerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .pattern(/^(?!\d+$).+$/)
    .messages({
      'string.empty': 'Offer name is required',
      'string.pattern.base': 'Offer name cannot be only numbers',
    }),
  targetType: Joi.string().valid('Product', 'Category').required().messages({
    'any.only': 'Offer type must be either Product or Category',
  }),
  targetId: Joi.string().required().messages({
    'string.empty': 'Target ID is required',
  }),
  discountType: Joi.string().valid('percentage').required().messages({
    'any.only': 'Discount type must be percentage',
  }),
  discountValue: Joi.number().min(1).max(80).required().messages({
    'number.base': 'Discount value must be a number',
    'number.min': 'Discount value must be at least 1',
    'number.max': 'Discount value cannot exceed 80',
  }),
  maxDiscountAmount: Joi.number().min(0).optional().messages({
    'number.base': 'Max discount amount must be a number',
    'number.min': 'Max discount amount cannot be negative',
  }),
  validFrom: Joi.date().required().messages({
    'date.base': 'Valid from date is required',
  }),
  expiryDate: Joi.date()
    .greater(Joi.ref('validFrom'))
    .required()
    .messages({
      'date.base': 'Expiry date is required',
      'date.greater': 'Expiry date must be after valid from date',
    }),
});

module.exports = offerSchema;