const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });

        if(clean !== value) return helpers.error('string.escapeHTML', {value})
        return clean;
        
      }
    }
  }
});
const Joi = baseJoi.extend(extension)

module.exports.kemahSchema = Joi.object({
  kemah: Joi.object({
    judul: Joi.string().required().escapeHTML(),
    harga: Joi.number().required().min(0),
    // gambar: Joi.string().required(),
    deskripsi: Joi.string().required().escapeHTML(),
    lokasi: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required()
})