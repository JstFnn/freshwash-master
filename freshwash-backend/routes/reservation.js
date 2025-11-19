const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

// =======================
// POST: Buat reservasi
// =======================
router.post("/", authMiddleware, async (req, res) => {
  const { name, plateNumber, orderDate, timeOrder, serviceId, carSize, finalPrice } = req.body;
  const userId = req.user.id;

  if (!name || !plateNumber || !orderDate || !timeOrder || !serviceId || !carSize || !finalPrice) {
    return res.status(400).json({ message: "Data tidak lengkap." });
  }

  try {
    // Insert ke tabel orders
    const [result] = await db.execute(
      `INSERT INTO orders 
        (user_id, customer_name, service_id, plate_number, order_date, time_order, car_size, final_price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, serviceId, plateNumber, orderDate, timeOrder, carSize, finalPrice, "pending"]
    );

    const insertedId = result.insertId;

    // Generate order code
    const datePart = orderDate.replace(/-/g, "");
    const timePart = timeOrder.replace(":", "");
    const orderCode = `FW-${datePart}-${timePart}-${insertedId}`;

    await db.execute(`UPDATE orders SET order_code = ? WHERE order_id = ?`, [orderCode, insertedId]);

    res.status(201).json({
      message: "Reservasi berhasil",
      order_id: insertedId,
      order_code: orderCode,
    });
  } catch (err) {
    console.error("Gagal menyimpan ke database:", err);
    res.status(500).json({ message: "Gagal membuat reservasi" });
  }
});

// =======================
// GET: Ambil layanan + sizes
// =======================
router.get("/services", async (req, res) => {
  try {
    // Ambil semua layanan
    const [services] = await db.execute("SELECT service_id, name, price FROM services");

    // Ambil semua size & price dari tabel service_prices
    const [prices] = await db.execute("SELECT service_id, size, price FROM service_prices");

    // Gabungkan menjadi array sizes per service
    const servicesWithSizes = services.map((s) => ({
      ...s,
      sizes: prices.filter((p) => p.service_id === s.service_id).map((p) => ({ size: p.size, price: p.price })),
    }));

    res.json(servicesWithSizes);
  } catch (err) {
    console.error("Gagal mengambil layanan:", err);
    res.status(500).json({ message: "Gagal mengambil data layanan" });
  }
});

module.exports = router;
