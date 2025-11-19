const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT user_id, name, email, phone_number, password, photo_url FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data pengguna:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await db.execute("DELETE FROM users WHERE user_id = ?", [userId]);
    res.json({ message: "Pengguna berhasil dihapus." });
  } catch (err) {
    console.error("Gagal menghapus pengguna:", err);
    res.status(500).json({ message: "Gagal menghapus pengguna." });
  }
});

router.patch("/:id/reset-password", async (req, res) => {
  const userId = req.params.id;
  const newPassword = "defaultpassword123";
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({
      message: "Password berhasil direset.",
      defaultPassword: newPassword,
    });
  } catch (err) {
    console.error("Gagal mereset password:", err);
    res.status(500).json({ message: "Gagal mereset password." });
  }
});

module.exports = router;
