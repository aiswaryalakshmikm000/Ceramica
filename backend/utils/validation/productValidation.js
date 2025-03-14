const Joi = require("joi");
const mongoose = require("mongoose");

// Helper function to validate MongoDB ObjectId
const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid ObjectId format.");

const productSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Product name is required.",
      "any.required": "Product name is required.",
      "string.min": "Product name should have at least 2 characters.",
      "string.max": "Product name should have at most 50 characters.",
    }),

  description: Joi.string()
    .required()
    .messages({
      "string.empty": "Product description is required.",
      "any.required": "Product description is required.",
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Price must be a number.",
      "number.min": "Price cannot be negative.",
      "any.required": "Price is required.",
    }),

  discount: Joi.number()
    .min(0)
    .max(90)
    .required()
    .messages({
      "number.base": "Discount must be a number.",
      "number.min": "Discount cannot be negative.",
      "number.max": "Discount cannot exceed 90%.",
      "any.required": "Discount is required.",
    }),

  offerId: objectIdSchema.allow(null, ""),
  
  categoryId: objectIdSchema.required().messages({
    "string.empty": "Category ID is required.",
    "any.required": "Category ID is required.",
  }),

  tags: Joi.array()
    .items(Joi.string().trim())
    .messages({
      "array.base": "Tags must be an array of strings.",
    }),

  colors: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .required()
          .messages({
            "string.empty": "Color name is required.",
            "any.required": "Color name is required.",
          }),
        stock: Joi.number()
          .min(0)
          .required()
          .messages({
            "number.base": "Stock must be a number.",
            "number.min": "Stock quantity cannot be negative.",
            "any.required": "Stock is required.",
          }),
        images: Joi.array()
          .items(Joi.string()) // Removed .uri() validation to allow local paths or Cloudinary URLs
          //.required()   give this
          .messages({
            "array.base": "Images must be an array of strings.",
            "any.required": "Images are required.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Colors must be an array of objects.",
      "array.min": "At least one color variant is required.",
      "any.required": "Colors are required.",
    }),





    //%^%$#$#@%$@#%$#%$#%#V Remove this#$%@#$%#@$%$#%

    images: Joi.array()
    .items(Joi.string()) // Removed .uri() validation to allow local paths or Cloudinary URLs
    .required()
    .messages({  // <-- This bracket is not properly closed
      "array.base": "Images must be an array of strings.",
      "any.required": "Images are required."}),
 //#$%@%#$%^%$^@%^$%^@#$%%@^&#%^$^^^^^^^^^^^^^^^^$@%$#%$#%#$%#@





  totalStock: Joi.forbidden(), // Prevents direct input, as it will be computed in the backend.

  isFeatured: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "isFeatured must be a boolean.",
    }),

  isListed: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "isListed must be a boolean.",
    }),

  reviews: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().allow(null, ""),
        rating: Joi.number().min(1).max(5).messages({
          "number.base": "Rating must be a number.",
          "number.min": "Rating must be at least 1.",
          "number.max": "Rating cannot be more than 5.",
        }),
        comment: Joi.string().allow(null, ""),
        createdAt: Joi.date(), // No default, since MongoDB sets it automatically
      })
    )
    .messages({
      "array.base": "Reviews must be an array of objects.",
    }),
});

module.exports = productSchema;
