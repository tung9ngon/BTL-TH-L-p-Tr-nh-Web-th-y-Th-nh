const timeSlotModel = require('../models/timeSlotModel');

const getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await timeSlotModel.getAllTimeSlots();
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTimeSlot = async (req, res) => {
  try {
    const { start_time, end_time } = req.body;
    const timeSlotId = await timeSlotModel.addTimeSlot(start_time, end_time);
    res.status(201).json({ 
      message: 'Time slot added successfully',
      timeSlotId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTimeSlots,
  createTimeSlot,
};
