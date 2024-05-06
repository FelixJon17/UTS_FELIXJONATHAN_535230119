const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Store the number of failed login attempts
const attemptsLOGIN = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Store failed login attempts
    const usedEmail = email.toLowerCase();
    const userAttempts = attemptsLOGIN[usedEmail];

    if (userAttempts && userAttempts.attemptCount >= 5) {
      // If failed more than 5 times, block the login
      const lastFailTime = userAttempts.timestamp;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastFailTime;
      const reEnterMinutes = Math.ceil((1800000 - timeDiff) / 60000);

      if (timeDiff < 1800000) {
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          `Attempt failed. You have ${5 - userAttempts.attemptCount} attempts left. Try again in ${reEnterMinutes} minutes.`
        );
      } else {
        // Reset login attempts
        resetLoginAttempts(usedEmail);
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Store failed login attempts
      recordFailedLoginAttempt(usedEmail);

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Attempt failed. You have ' + (5 - userAttempts.attemptCount) + ' attempts left.',
        // Send information about the number of failed login attempts and the last failed login attempt time
        {
          timestamp: new Date().toISOString(),
          attemptCount: userAttempts ? userAttempts.attemptCount : 1,
        }
      );
    }

    // Reset login attempts if successful
    resetLoginAttempts(usedEmail);

    // Successful login response
    return response.status(200).json({
      success: true,
      message: 'Login successful',
      data: loginSuccess, // Additional user data if needed
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Record a failed login attempt for the user
 * @param {string} email - Email of the user
 */
function recordFailedLoginAttempt(email) {
  if (!attemptsLOGIN[email]) {
    attemptsLOGIN[email] = {
      attemptCount: 1,
      timestamp: Date.now(),
    };
  } else {
    attemptsLOGIN[email].attemptCount++;
    attemptsLOGIN[email].timestamp = Date.now();
  }
}

/**
 * Reset login attempts for the user
 * @param {string} email - Email of the user
 */
function resetLoginAttempts(email) {
  delete attemptsLOGIN[email];
}

module.exports = {
  login,
};
