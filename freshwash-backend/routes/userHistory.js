const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/auth');

router.get('/reservations/history', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT o.order_id AS id, o.plate_number, o.order_date, o.time_order, s.name AS service_name, o.status,
              (SELECT COUNT(*) FROM reviews r WHERE r.order_id = o.order_id AND r.user_id = ?) AS review_count
       FROM orders o
       JOIN services s ON o.service_id = s.service_id
       WHERE o.user_id = ? AND o.status IN ('selesai', 'dibatalkan')
       ORDER BY o.order_date DESC, o.time_order DESC`,
      [userId, userId]
    );

    const formatted = rows.map(row => {
      const orderDateStr = row.order_date instanceof Date
        ? row.order_date.toISOString().split("T")[0]
        : row.order_date;

      const timeOrderStr = typeof row.time_order === "string"
        ? row.time_order
        : row.time_order.toString().slice(0, 5);

      return {
        id: row.id,
        plateNumber: row.plate_number,
        servicePackage: row.service_name,
        reservationDate: orderDateStr,
        reservationTime: timeOrderStr,
        status: row.status === "selesai" ? "Selesai" : "Dibatalkan",
        hasReviewed: row.review_count > 0, 
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Gagal mengambil riwayat reservasi:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/reservations/:id/review', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating tidak valid.' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE order_id = ? AND user_id = ? AND status = 'selesai'`,
      [orderId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Reservasi tidak ditemukan atau belum selesai.' });
    }

    await db.execute(
      `INSERT INTO reviews (order_id, service_id, user_id, rating, comment, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [orderId, serviceId, userId, rating, comment]
    );

    res.json({ message: "Review berhasil dikirim." });
  } catch (err) {
    console.error("Gagal menyimpan review:", err);
    res.status(500).json({ message: "Gagal menyimpan review." });
  }
});

module.exports = router;
