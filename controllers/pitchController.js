const pitchModel = require('../models/pitchModel');

const getAllPitches = async (req, res) => {
  try {
    const pitches = await pitchModel.getAllPitches();
    res.json({
      success: true,
      data: pitches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy danh sách sân',
      error: error.message 
    });
  }
};

const searchPitches = async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, pitchType, sortBy } = req.query;
    
    const pitches = await pitchModel.searchPitches({
      search,
      location,
      minPrice,
      maxPrice,
      pitchType,
      sortBy
    });
    
    res.json({
      success: true,
      data: pitches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi tìm kiếm sân',
      error: error.message 
    });
  }
};

const getPitchesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitches = await pitchModel.getPitchesByOwner(ownerId);
    res.json({
      success: true,
      data: pitches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy danh sách sân của chủ sân',
      error: error.message 
    });
  }
};

const addPitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = await pitchModel.addPitch(ownerId, req.body);
    res.status(201).json({ 
      success: true,
      message: 'Thêm sân thành công', 
      pitchId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi thêm sân',
      error: error.message 
    });
  }
};

const updatePitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = req.params.id;

    const isOwner = await pitchModel.verifyPitchOwnership(pitchId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ 
        success: false,
        message: 'Không có quyền chỉnh sửa sân này' 
      });
    }

    await pitchModel.updatePitch(pitchId, req.body);
    res.json({ 
      success: true,
      message: 'Cập nhật sân thành công' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi cập nhật sân',
      error: error.message 
    });
  }
};

const getBookingsByPitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = req.params.id;
    const { date } = req.query;

    const bookings = await pitchModel.getBookingsByPitch(ownerId, pitchId, date);
    if (bookings === null) {
      return res.status(403).json({ 
        success: false,
        message: 'Không có quyền truy cập đặt sân này' 
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy danh sách đặt sân',
      error: error.message 
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const bookingId = req.params.id;
    const { status } = req.body;

    const updated = await pitchModel.updateBookingStatus(ownerId, bookingId, status);
    if (!updated) {
      return res.status(403).json({ 
        success: false,
        message: 'Không có quyền cập nhật trạng thái đặt sân này' 
      });
    }

    res.json({ 
      success: true,
      message: 'Cập nhật trạng thái đặt sân thành công' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đặt sân',
      error: error.message 
    });
  }
};

const getPitchDetail = async (req, res) => {
  try {
    const pitchId = req.params.id;
    const pitch = await pitchModel.getPitchById(pitchId);
    
    if (!pitch) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sân' 
      });
    }
    
    res.json({
      success: true,
      data: pitch
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy thông tin sân',
      error: error.message 
    });
  }
};


module.exports = {
  getAllPitches,
  searchPitches,
  getPitchesByOwner,
  addPitch,
  updatePitch,
  getBookingsByPitch,
  updateBookingStatus,
  getPitchDetail
  
};