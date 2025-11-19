const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
