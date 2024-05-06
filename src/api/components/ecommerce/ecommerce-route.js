const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecommerceControllers = require('./ecommerce-controller');
const ecommerceValidator = require('./ecommerce-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/ecommerce', route);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ecommerceValidator.createEcommerces),
    ecommerceControllers.createEcommerce
  );

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(ecommerceValidator.updateEcommerce),
    ecommerceControllers.updateEcommerce
  );

  route.get('/', authenticationMiddleware, ecommerceControllers.getEcommerces);

  route.delete(
    '/:id',
    authenticationMiddleware,
    ecommerceControllers.deleteEcommerce
  );
};
