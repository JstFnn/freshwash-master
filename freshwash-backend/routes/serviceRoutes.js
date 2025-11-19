const express = require("express");
const router = express.Router();
const db = require("../config/db");

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.service_id,
        s.name,
        s.description,
        s.is_bundling,
        GROUP_CONCAT(CONCAT(sp.size, ':', sp.price) SEPARATOR ',') AS price_list
      FROM services s
      LEFT JOIN service_prices sp ON s.service_id = sp.service_id
      GROUP BY s.service_id
      ORDER BY s.service_id ASC
    `);

    const formatted = rows.map((service) => {
      let prices = {};

      if (service.price_list) {
        service.price_list.split(",").forEach((pair) => {
          const [size, price] = pair.split(":");
          prices[size] = Number(price);
        });
      }

      return {
        ...service,
        prices,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        s.service_id,
        s.name,
        s.description,
        s.is_bundling,
        GROUP_CONCAT(CONCAT(sp.size, ':', sp.price) SEPARATOR ',') AS price_list
      FROM services s
      LEFT JOIN service_prices sp ON s.service_id = sp.service_id
      WHERE LOWER(REPLACE(s.name, " ", "-")) = ?
      GROUP BY s.service_id
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = rows[0];
    let prices = {};

    if (service.price_list) {
      service.price_list.split(",").forEach((pair) => {
        const [size, price] = pair.split(":");
        prices[size] = Number(price);
      });
    }

    service.prices = prices;

    let bundling = null;
    if (service.is_bundling === 1) {
      const [bundlingRows] = await db.execute(
        `
        SELECT 
          s.service_id,
          s.name,
          s.description,
          GROUP_CONCAT(CONCAT(sp.size, ':', sp.price) SEPARATOR ',') AS price_list
        FROM services s
        LEFT JOIN service_prices sp ON s.service_id = sp.service_id
        WHERE s.service_id = ?
        GROUP BY s.service_id
        `,
        [service.is_bundling]
      );

      if (bundlingRows.length > 0) {
        let prices2 = {};
        const data = bundlingRows[0];

        if (data.price_list) {
          data.price_list.split(",").forEach((pair) => {
            const [size, price] = pair.split(":");
            prices2[size] = Number(price);
          });
        }

        bundling = {
          ...data,
          prices: prices2,
        };
      }
    }

    const [reviewRows] = await db.execute(
      `
      SELECT r.rating, r.comment, u.name AS reviewer
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.service_id = ?
      ORDER BY r.review_id DESC
      `,
      [service.service_id]
    );

    res.json({
      service,
      bundling: bundling || null,
      reviews: reviewRows || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
