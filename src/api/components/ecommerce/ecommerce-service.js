const ecommerceRepository = require('./ecommerce-repository');

async function createEcommerce(ecommerce_name, price, category, quantity) {
  try {
    await ecommerceRepository.createEcommerce(
      ecommerce_name,
      price,
      category,
      quantity
    );
  } catch (err) {
    return null;
  }

  return true;
}

async function getEcommerces(page_number, page_size, sort, search) {
  try {
    const ecommerces = await ecommerceRepository.getEcommerces(
      page_number,
      page_size,
      sort,
      search
    );
    return ecommerces;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateEcommerce(id, ecommerce_name, price, category, quantity) {
  const ecommerce = await ecommerceRepository.getEcommerce(id);

  if (!ecommerce) {
    return null;
  }

  try {
    await ecommerceRepository.updateEcommerce(
      id,
      ecommerce_name,
      price,
      category,
      quantity
    );
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteEcommerce(id) {
  const ecommerce = await ecommerceRepository.getEcommerce(id);

  if (!ecommerce) {
    return null;
  }

  try {
    await ecommerceRepository.deleteEcommerce(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  createEcommerce,
  getEcommerces,
  updateEcommerce,
  deleteEcommerce,
};
