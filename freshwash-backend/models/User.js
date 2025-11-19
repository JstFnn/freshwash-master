const db = require('../config/db');

const User = {
  async create({ name, email, phone_number, password }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)',
      [name, email, phone_number, password]
    );
    return result;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(user_id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
    return rows[0];
  },

  async updateProfile(user_id, { email, phone_number }) {
    await db.execute(
      'UPDATE users SET email = ?, phone_number = ? WHERE user_id = ?',
      [email, phone_number, user_id]
    );
  }
};

module.exports = User;
