const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

router.get("/reservations/on-progress", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      `SELECT o.order_id AS id, o.plate_number, o.order_date, o.time_order, o.status, o.final_price, s.name AS service_name
       FROM orders o
       JOIN services s ON o.service_id = s.service_id
       WHERE o.user_id = ? AND o.status IN ('dalam_antrian', 'sedang_dicuci', 'pencucian_selesai')
       ORDER BY o.order_date DESC, o.time_order DESC
       LIMIT 1`,
      [userId]
    );

    console.log(">>> [GET] /reservations/on-progress", rows); // ✅ Debug

    const formatted = rows.map((row) => {
      const orderDateStr = row.order_date instanceof Date ? row.order_date.toISOString().split("T")[0] : row.order_date;

      const timeOrderStr = typeof row.time_order === "string" ? row.time_order : row.time_order.toString().slice(0, 5);

      return {
        id: row.id,
        plateNumber: row.plate_number,
        date: `${orderDateStr} ${timeOrderStr}`,
        servicePackage: row.service_name,
        status: row.status,
        orderId: `FW-${orderDateStr.replace(/-/g, "")}-${timeOrderStr.replace(":", "")}-${row.id}`,
        final_price: row.final_price, // ✅ tambahkan harga
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Gagal mengambil data on-progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
