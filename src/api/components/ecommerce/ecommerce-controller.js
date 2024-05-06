const ecommerceService = require('./ecommerce-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle create ecommerce request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function createEcommerce(request, response, next) {
  try {
    const { ecommerce_name, price, category, quantity } = request.body;

    const success = await ecommerceService.createEcommerce(
      ecommerce_name,
      price,
      category,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to add Product'
      );
    }

    return response
      .status(200)
      .json({ ecommerce_name, price, category, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get ecommerces request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function getEcommerces(request, response, next) {
  try {
    const { page_number, page_size, sort, search } = request.query;

    const ecommerces = await ecommerceService.getEcommerces(
      parseInt(page_number) || 1,
      parseInt(page_size) || 0,
      sort || 'asc',
      search || ''
    );
    response.status(200).json(ecommerces);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

/**
 * Handle update ecommerce request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function updateEcommerce(request, response, next) {
  try {
    const { id } = request.params;
    const { ecommerce_name, price, category, quantity } = request.body;

    const success = await ecommerceService.updateEcommerce(
      id,
      ecommerce_name,
      price,
      category,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Product'
      );
    }

    return response
      .status(200)
      .json({ id, ecommerce_name, price, category, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete ecommerce request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteEcommerce(request, response, next) {
  try {
    const { id } = request.params;

    const success = await ecommerceService.deleteEcommerce(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete Product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createEcommerce,
  getEcommerces,
  updateEcommerce,
  deleteEcommerce,
};
