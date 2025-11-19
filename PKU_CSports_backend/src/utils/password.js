const bcrypt = require('bcryptjs');

/**
 * Hashes a password.
 * @param {string} password The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} candidatePassword The plain text password.
 * @param {string} hashedPassword The hashed password from the database.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
