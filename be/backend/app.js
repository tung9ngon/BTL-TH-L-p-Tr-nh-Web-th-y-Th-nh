const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pitchRoutes = require('./routes/pitchRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const dashboardRoutes = require('./routes/ownerDashboardRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/owner/dashboard', dashboardRoutes); // Ensure routes inside only use `router.get('/'...)`
app.use('/api/reviews', reviewRoutes);
// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
