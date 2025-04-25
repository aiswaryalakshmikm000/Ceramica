const Joi = require('joi');

const offerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Offer name is required',
  }),
  targetType: Joi.string().valid('Product', 'Category').required().messages({
    'any.only': 'Offer type must be either Product or Category',
  }),
  targetId: Joi.string().required().messages({
    'string.empty': 'Target ID is required',
  }),
  discountType: Joi.string().valid('flat', 'percentage').required().messages({
    'any.only': 'Discount type must be either flat or percentage',
  }),
  discountValue: Joi.number()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number().min(1).max(80).required().messages({
        'number.base': 'Discount value must be a number',
        'number.min': 'Discount value must be at least 1 for percentage discounts',
        'number.max': 'Discount value cannot exceed 80 for percentage discounts',
      }),
      otherwise: Joi.number().min(1).required().messages({
        'number.base': 'Discount value must be a number',
        'number.min': 'Discount value must be at least 1 for flat discounts',
      }),
    }),
  maxDiscountAmount: Joi.when('discountType', {
    is: 'percentage',
    then: Joi.number().min(0).optional().messages({
      'number.base': 'Max discount amount must be a number',
      'number.min': 'Max discount amount cannot be negative',
    }),
    otherwise: Joi.any().optional().allow('').allow(null),
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