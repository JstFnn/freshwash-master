const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

router.get("/reservations", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT o.order_id AS id, o.plate_number, o.order_date, o.time_order, o.final_price, s.name AS service_name
       FROM orders o
       JOIN services s ON o.service_id = s.service_id
       WHERE o.user_id = ? AND o.status = 'pending'
       ORDER BY o.order_date ASC, o.time_order ASC`,
      [userId]
    );

    const formatted = rows.map((row) => {
      const orderDateStr = row.order_date instanceof Date ? row.order_date.toISOString().split("T")[0] : row.order_date;

      const timeOrderStr = typeof row.time_order === "string" ? row.time_order : row.time_order.toString().slice(0, 5);

      return {
        id: row.id,
        plateNumber: row.plate_number,
        date: `${orderDateStr} ${timeOrderStr}`,
        servicePackage: row.service_name,
        final_price: row.final_price,
        orderId: `FW-${orderDateStr.replace(/-/g, "")}-${timeOrderStr.replace(":", "")}-${row.id}`,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Gagal mengambil data reservasi:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/reservations/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  try {
    const [check] = await db.execute("SELECT * FROM orders WHERE order_id = ? AND user_id = ?", [orderId, userId]);
    if (check.length === 0) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan atau bukan milik Anda." });
    }

    await db.execute("UPDATE orders SET status = ? WHERE order_id = ?", ["dibatalkan", orderId]);
    res.json({ message: "Reservasi berhasil dibatalkan." });
  } catch (err) {
    console.error("Gagal membatalkan reservasi:", err);
    res.status(500).json({ message: "Gagal membatalkan reservasi." });
  }
});

router.post("/reservations/:id/review", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const { rating, comment } = req.body;

  try {
    const [orderRows] = await db.execute("SELECT service_id FROM orders WHERE order_id = ? AND user_id = ?", [
      orderId,
      userId,
    ]);

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan." });
    }

    const serviceId = orderRows[0].service_id;

    await db.execute("INSERT INTO reviews (user_id, order_id, service_id, rating, comment) VALUES (?, ?, ?, ?, ?)", [
      userId,
      orderId,
      serviceId,
      rating,
      comment,
    ]);

    res.json({ message: "Review berhasil disimpan." });
  } catch (err) {
    console.error("Gagal menyimpan review:", err);
    res.status(500).json({ message: "Gagal menyimpan review." });
  }
});

module.exports = router;
