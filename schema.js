const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    location: Joi.string().trim().min(1).required(),
    country: Joi.string().trim().min(1).required(),
    price: Joi.number().min(0).required(),
    // image handled by multer, so no need to validate here
    // image: Joi.string().trim().uri().allow("", null) // optional but if provided must be URL
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().min(1).required()
  }).required()
});
