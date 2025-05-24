const ownerDashboardModel = require('../models/ownerDashboardModel');

const getOwnerDashboard = async (req, res) => {
  try {
    // Lấy owner_id từ params hoặc query
    const ownerId = req.params.owner_id || req.query.owner_id;
    
    if (!ownerId) {
      return res.status(400).json({ 
        success: false,
        message: 'Owner ID is required' 
      });
    }

    const data = await ownerDashboardModel.getDashboardData(ownerId);
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Thêm API để lấy danh sách tất cả owners
const getAllOwners = async (req, res) => {
  try {
    const owners = await ownerDashboardModel.getAllOwners();
    
    res.json({
      success: true,
      data: owners
    });
  } catch (error) {
    console.error('Get owners error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getOwnerDashboard,
  getAllOwners,
};