const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const userId = req.user.id;
        const ext = path.extname(file.originalname);
        const filename = `user-${userId}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});
const upload = multer({ storage });

router.get('/profile', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.execute(
            'SELECT name, email, phone_number, photo_url FROM users WHERE user_id = ? LIMIT 1',
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];
        res.json({
            name: user.name,
            email: user.email,
            phone: user.phone_number,
            photoUrl: user.photo_url || '',
        });
    } catch (err) {
        console.error("Gagal mengambil profil:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', authMiddleware, upload.single('photo'), async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, oldPassword, newPassword } = req.body;
    let photoUrl;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = rows[0];

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Password lama salah.' });
        }

        let passwordHash = user.password;
        if (newPassword) {
            passwordHash = await bcrypt.hash(newPassword, 10);
        }

        if (req.file) {
            photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else {
            photoUrl = user.photo_url;
        }

        await db.execute(
            `UPDATE users SET name = ?, email = ?, phone_number = ?, password = ?, photo_url = ? WHERE user_id = ?`,
            [name, email, phone, passwordHash, photoUrl, userId]
        );

        res.json({ message: 'Profil berhasil diperbarui.' });
    } catch (err) {
        console.error("Gagal update profil:", err);
        res.status(500).json({ message: 'Gagal memperbarui profil.' });
    }
});

router.delete('/profile/photo', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.execute('SELECT photo_url FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan.' });

        const photoUrl = rows[0].photo_url;

        if (photoUrl) {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(photoUrl));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.execute('UPDATE users SET photo_url = NULL WHERE user_id = ?', [userId]);

        res.json({ message: 'Foto profil berhasil dihapus.' });
    } catch (err) {
        console.error("Gagal menghapus foto profil:", err);
        res.status(500).json({ message: 'Gagal menghapus foto profil.' });
    }
});

router.delete('/account', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.execute('SELECT photo_url FROM users WHERE user_id = ?', [userId]);
        const photoUrl = rows[0]?.photo_url;
        if (photoUrl) {
            const filePath = path.join(__dirname, '..', photoUrl.replace(`${req.protocol}://${req.get('host')}/`, ''));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.execute('DELETE FROM users WHERE user_id = ?', [userId]);

        res.json({ message: 'Akun berhasil dihapus.' });
    } catch (err) {
        console.error("Gagal menghapus akun:", err);
        res.status(500).json({ message: 'Gagal menghapus akun.' });
    }
});


module.exports = router;
