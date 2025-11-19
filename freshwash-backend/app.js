const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservation');
const userRoutes = require('./routes/userRoutes');
const userReservationsRoutes = require('./routes/userReservations');
const userOnProgressRoutes = require('./routes/userOnProgress');
const userHistoryRoutes = require('./routes/userHistory');
const adminReservationsRoutes = require('./routes/adminReservations');
const adminDataUsersRoutes = require('./routes/adminDataUsers');
const adminReviewsRoutes = require('./routes/adminReviews');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('FreshWash API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user', userReservationsRoutes);
app.use('/api/user', userOnProgressRoutes);
app.use('/api/user', userHistoryRoutes);
app.use('/api/admin', adminReservationsRoutes);
app.use('/api/admin/users', adminDataUsersRoutes);
app.use('/api/admin/reviews', adminReviewsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
