// dashboardController.js
const bookingModel = require('../models/bookingModel');

// Helper function để kiểm tra user_type
const validateUserType = (req, expectedType) => {
  const { user_type } = req.body;
  if (!user_type || user_type !== expectedType) {
    return false;
  }
  return true;
};

module.exports = {
  // Lấy thống kê tổng quan
  async getOverviewStats(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const [stats, periodStats] = await Promise.all([
        bookingModel.getOwnerStatistics(owner_id),
        bookingModel.getBookingsByPeriod(owner_id)
      ]);
      
      res.json({
        message: 'Statistics retrieved successfully',
        data: {
          // Thống kê booking
          total_bookings: stats.bookings.total_bookings || 0,
          confirmed_bookings: stats.bookings.confirmed_bookings || 0,
          cancelled_bookings: stats.bookings.cancelled_bookings || 0,
          pending_bookings: stats.bookings.pending_bookings || 0,
          
          // Thống kê doanh thu
          total_revenue: stats.revenue.total_revenue || 0,
          pending_revenue: stats.revenue.pending_revenue || 0,
          gross_revenue: stats.revenue.gross_revenue || 0,
          
          // Thống kê sân
          total_pitches: stats.pitches.total_pitches || 0,
          available_pitches: stats.pitches.available_pitches || 0,
          maintenance_pitches: stats.pitches.maintenance_pitches || 0,
          
          // Thống kê theo thời gian
          period_stats: {
            today: {
              bookings: periodStats.today_bookings || 0,
              revenue: periodStats.today_revenue || 0
            },
            week: {
              bookings: periodStats.week_bookings || 0,
              revenue: periodStats.week_revenue || 0
            },
            month: {
              bookings: periodStats.month_bookings || 0,
              revenue: periodStats.month_revenue || 0
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in getOverviewStats:', error);
      res.status(500).json({ 
        message: 'Failed to fetch statistics', 
        error: error.message 
      });
    }
  },

  // Lấy booking gần đây
  async getRecentBookings(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id, limit } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const bookings = await bookingModel.getRecentBookings(owner_id, limit || 10);
      
      res.json({
        message: 'Recent bookings retrieved successfully',
        data: bookings
      });
    } catch (error) {
      console.error('Error in getRecentBookings:', error);
      res.status(500).json({ 
        message: 'Failed to fetch recent bookings', 
        error: error.message 
      });
    }
  },

  // Lấy thống kê doanh thu theo tháng
  async getMonthlyRevenue(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const monthlyData = await bookingModel.getMonthlyRevenue(owner_id);
      
      res.json({
        message: 'Monthly revenue data retrieved successfully',
        data: monthlyData
      });
    } catch (error) {
      console.error('Error in getMonthlyRevenue:', error);
      res.status(500).json({ 
        message: 'Failed to fetch monthly revenue data', 
        error: error.message 
      });
    }
  },

  // Lấy thống kê theo sân
  async getPitchStatistics(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const pitchStats = await bookingModel.getPitchStatistics(owner_id);
      
      res.json({
        message: 'Pitch statistics retrieved successfully',
        data: pitchStats
      });
    } catch (error) {
      console.error('Error in getPitchStatistics:', error);
      res.status(500).json({ 
        message: 'Failed to fetch pitch statistics', 
        error: error.message 
      });
    }
  },

  // Lấy dashboard tổng hợp (tất cả thông tin cần thiết)
  async getDashboardData(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      // Lấy tất cả dữ liệu cần thiết
      const [stats, recentBookings, monthlyRevenue, pitchStats, topPitches, periodStats] = await Promise.all([
        bookingModel.getOwnerStatistics(owner_id),
        bookingModel.getRecentBookings(owner_id, 5),
        bookingModel.getMonthlyRevenue(owner_id),
        bookingModel.getPitchStatistics(owner_id),
        bookingModel.getTopRevenePitches(owner_id, 5),
        bookingModel.getBookingsByPeriod(owner_id)
      ]);

      res.json({
        message: 'Dashboard data retrieved successfully',
        data: {
          overview: {
            // Thống kê booking
            total_bookings: stats.bookings.total_bookings || 0,
            confirmed_bookings: stats.bookings.confirmed_bookings || 0,
            cancelled_bookings: stats.bookings.cancelled_bookings || 0,
            pending_bookings: stats.bookings.pending_bookings || 0,
            
            // Thống kê doanh thu
            total_revenue: stats.revenue.total_revenue || 0,
            pending_revenue: stats.revenue.pending_revenue || 0,
            gross_revenue: stats.revenue.gross_revenue || 0,
            
            // Thống kê sân
            total_pitches: stats.pitches.total_pitches || 0,
            available_pitches: stats.pitches.available_pitches || 0,
            maintenance_pitches: stats.pitches.maintenance_pitches || 0,
          },
          period_stats: {
            today: {
              bookings: periodStats.today_bookings || 0,
              revenue: periodStats.today_revenue || 0
            },
            week: {
              bookings: periodStats.week_bookings || 0,
              revenue: periodStats.week_revenue || 0
            },
            month: {
              bookings: periodStats.month_bookings || 0,
              revenue: periodStats.month_revenue || 0
            }
          },
          recent_bookings: recentBookings,
          monthly_revenue: monthlyRevenue,
          pitch_statistics: pitchStats,
          top_revenue_pitches: topPitches
        }
      });
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({ 
        message: 'Failed to fetch dashboard data', 
        error: error.message 
      });
    }
  },

  // Lấy top sân có doanh thu cao nhất
  async getTopRevenuePitches(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view dashboard' });
      }

      const { owner_id, limit } = req.body;
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const topPitches = await bookingModel.getTopRevenePitches(owner_id, limit || 5);
      
      res.json({
        message: 'Top revenue pitches retrieved successfully',
        data: topPitches
      });
    } catch (error) {
      console.error('Error in getTopRevenuePitches:', error);
      res.status(500).json({ 
        message: 'Failed to fetch top revenue pitches', 
        error: error.message 
      });
    }
  }
};