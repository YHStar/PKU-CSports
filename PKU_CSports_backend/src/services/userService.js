const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const db = require('../config/db'); // Import the database connection pool

/**
 * Handles user login verification by querying the database.
 * @param {string} username The user's username.
 * @param {string} password The user's password.
 * @returns {Promise<object>} An object containing success status, and data (token, user) or a message.
 */
exports.loginUser = async (username, password) => {
  let client;
  try {
    // 1. Get a client from the pool
    client = await db.connect();

    // 2. Find user by username from the database (PostgreSQL uses $1 for parameterized queries)
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return { success: false, message: '用户不存在' };
    }
    const user = result.rows[0];

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { success: false, message: '密码错误' };
    }

    // 4. Generate a JWT token
    const payload = { id: user.id, username: user.username, role: user.role };
    const secret = 'your_jwt_secret'; // IMPORTANT: Use an environment variable for this in production!
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // 5. Prepare user data to return (omitting the password)
    const userToReturn = { ...user };
    delete userToReturn.password;

    return {
      success: true,
      token,
      user: userToReturn,
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error('Error during login process.');
  } finally {
    // 6. Release the client back to the pool
    if (client) {
      client.release();
    }
  }
};
