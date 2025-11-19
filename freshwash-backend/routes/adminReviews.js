
const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.review_id, o.order_id, s.name AS service, u.name AS user, r.rating, r.comment, r.created_at
      FROM reviews r
      JOIN orders o ON r.order_id = o.order_id
      JOIN services s ON r.service_id = s.service_id
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.created_at DESC
    `);
    res.json(rows); 
  } catch (err) {
    console.error('Gagal mengambil data review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const reviewId = req.params.id;
  try {
    await db.execute('DELETE FROM reviews WHERE review_id = ?', [reviewId]);
    res.json({ message: 'Review berhasil dihapus.' });
  } catch (err) {
    console.error('Gagal menghapus review:', err);
    res.status(500).json({ message: 'Gagal menghapus review.' });
  }
});

module.exports = router;
