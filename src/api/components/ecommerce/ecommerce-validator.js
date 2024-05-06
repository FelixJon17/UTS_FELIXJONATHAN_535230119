const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createEcommerces: {
    body: {
      ecommerce_name: joi.string().required().label('ecommerce_name'),
      price: joi.number().required().label('price'),
      category: joi.string().required().label('category'),
      quantity: joi.number().required().label('quantity'),
    },
  },

  updateEcommerce: {
    body: {
      ecommerce_name: joi.string().label('ecommerce_name'),
      price: joi.number().label('price'),
      category: joi.string().label('category'),
      quantity: joi.number().label('quantity'),
    },
  },
};
