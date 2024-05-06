const { Ecommerce } = require('../../../models');

/**
 * Create a new ecommerce
 * @param {string} ecommerce_name - Ecommerce name
 * @param {number} price - Ecommerce price
 * @param {string} category - Ecommerce category
 * @param {number} quantity - Ecommerce quantity
 * @returns {Promise<object>} Created ecommerce
 */
async function createEcommerce(ecommerce_name, price, category, quantity) {
  return Ecommerce.create({
    ecommerce_name,
    price,
    category,
    quantity,
  });
}

/**
 * Get ecommerces with pagination, sorting, and searching
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Page size
 * @param {string} sort - Sort order
 * @param {string} search - Search query
 * @returns {Promise<object>} Paginated and sorted ecommerces
 */
async function getEcommerces(pageNumber, pageSize, sort, search) {
  try {
    let query = {};

    if (search) {
      const [field, value] = search.split(':');
      if (field && value) {
        query = {
          [field]: { $regex: value, $options: 'i' },
        };
      }
    }

    const totalCount = await Ecommerce.countDocuments(query);

    let sortCriteria;
    if (sort === 'desc') {
      sortCriteria = { name: -1 };
    } else {
      sortCriteria = { name: 1 };
    }

    if (sort.includes(':desc')) {
      const [fieldName, order] = sort.split(':');
      if (fieldName === 'ecommerce_name' || fieldName === 'category') {
        sortCriteria = { [fieldName]: -1 };
      }
    }

    let ecommerces;
    if (pageSize === 0) {
      ecommerces = await Ecommerce.find(query).sort(sortCriteria);
    } else {
      ecommerces = await Ecommerce.find(query)
        .sort(sortCriteria)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    return {
      page_number: pageNumber,
      page_size: pageSize,
      count: ecommerces.length,
      total_pages: totalPages,
      has_previous_page: hasPreviousPage,
      has_next_page: hasNextPage,
      data: ecommerces.map((ecommerce) => ({
        id: ecommerce.id,
        ecommerce_name: ecommerce.ecommerce_name,
        price: ecommerce.price,
        category: ecommerce.category,
        quantity: ecommerce.quantity,
      })),
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Update an ecommerce
 * @param {string} id - Ecommerce ID
 * @param {string} ecommerce_name - Ecommerce name
 * @param {number} price - Ecommerce price
 * @param {string} category - Ecommerce category
 * @param {number} quantity - Ecommerce quantity
 * @returns {Promise<object>} Updated ecommerce
 */
async function updateEcommerce(id, ecommerce_name, price, category, quantity) {
  return Ecommerce.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        ecommerce_name,
        price,
        category,
        quantity,
      },
    }
  );
}

/**
 * Get an ecommerce by ID
 * @param {string} id - Ecommerce ID
 * @returns {Promise<object>} Ecommerce
 */
async function getEcommerce(id) {
  return Ecommerce.findById(id);
}

/**
 * Delete an ecommerce
 * @param {string} id - Ecommerce ID
 * @returns {Promise<void>}
 */
async function deleteEcommerce(id) {
  return Ecommerce.deleteOne({ _id: id });
}

module.exports = {
  createEcommerce,
  getEcommerces,
  updateEcommerce,
  getEcommerce,
  deleteEcommerce,
};
