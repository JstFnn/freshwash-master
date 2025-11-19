const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.signUp = async (req, res) => {
  const { nama, email, phone, password } = req.body;
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedPassword = password.trim();

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE LOWER(email) = ?', [cleanedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(cleanedPassword, 10);

    await db.execute(
      'INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)',
      [nama, cleanedEmail, phone, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedPassword = password.trim();

  console.log("Login attempt:");
  console.log("Email from form:", cleanedEmail);
  console.log("Password from form:", cleanedPassword);

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE LOWER(email) = ?', [cleanedEmail]);
    const user = rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'Kredensial tidak valid (email tidak ditemukan)' });
    }

    console.log("User found. Stored hash:", user.password);
    const isMatch = await bcrypt.compare(cleanedPassword, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: 'Kredensial tidak valid (kata sandi salah)' });
    }

    const role = cleanedEmail === "loginadmin@freshwash.com" ? "admin" : "user";
    const token = jwt.sign(
      { id: user.user_id, email: user.email, name: user.name, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Login successful. Role:", role);
    res.json({ token, role });
  } catch (err) {
    console.error("Login server error:", err);
    res.status(500).json({ message: 'Server error.' });
  }
};
