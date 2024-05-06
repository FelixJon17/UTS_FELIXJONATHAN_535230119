const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(pageNumber, pageSize, sortBy, search) {
    try {
      let query = {};

      // Add search functionality
      if (search) {
        const [field, value] = search.split(':');
        if (field && value) {
          query = {
            [field]: { $regex: value, $options: 'i' }
          };
        }
      }

      // Calculate total count of documents
      const totalCount = await User.countDocuments(query);

      // Define sort criteria
      let sortCriteria;
      if (sortBy === 'desc') {
        sortCriteria = { name: -1 };
      } else {
        sortCriteria = { name: 1 };
      }

      // If sort includes 'desc'
      if (sortBy.includes(':desc')) {
        const [fieldName, order] = sortBy.split(':');
        if (fieldName === 'name' || fieldName === 'email') {
          sortCriteria = { [fieldName]: -1};
        }
      }

      // Fetch users from MongoDB
      let users;
      if (pageSize === 0) {
          users = await User.find(query).sort(sortCriteria);
      } else {
          users = await User.find(query)
              .sort(sortCriteria)
              .skip((pageNumber - 1) * pageSize)
              .limit(pageSize);
      }

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasPreviousPage = pageNumber > 1;
      const hasNextPage = pageNumber < totalPages;

      return { 
        page_number : pageNumber,
        page_size : pageSize,
        count : users.length,
        total_pages : totalPages, 
        has_previous_page : hasPreviousPage, 
        has_next_page : hasNextPage,
        data: users.map(user => ({
          id : user.id,
          name: user.name,
          email: user.email,
        }))     
      };
    } catch (error) {
        throw new Error(error.message);
    }
  };

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
