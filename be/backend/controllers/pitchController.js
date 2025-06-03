const pitchModel = require('../models/pitchModel');

const getAllPitches = async (req, res) => {
  try {
    const pitches = await pitchModel.getAllPitches();
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchPitches = async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, pitchType } = req.query;
    
    const pitches = await pitchModel.searchPitches({
      search,
      location,
      minPrice,
      maxPrice,
      pitchType
    });
    
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPitchesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitches = await pitchModel.getPitchesByOwner(ownerId);
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addPitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = await pitchModel.addPitch(ownerId, req.body);
    res.status(201).json({ message: 'Pitch added successfully', pitchId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = req.params.id;

    const isOwner = await pitchModel.verifyPitchOwnership(pitchId, ownerId);
    if (!isOwner) {
      return res.status(404).json({ message: 'Pitch not found or access denied' });
    }

    await pitchModel.updatePitch(pitchId, req.body);
    res.json({ message: 'Pitch updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookingsByPitch = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pitchId = req.params.id;
    const { date } = req.query;

    const bookings = await pitchModel.getBookingsByPitch(ownerId, pitchId, date);
    if (bookings === null) {
      return res.status(404).json({ message: 'Pitch not found or access denied' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const bookingId = req.params.id;
    const { status } = req.body;

    const updated = await pitchModel.updateBookingStatus(ownerId, bookingId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPitches,
  searchPitches,
  getPitchesByOwner,
  addPitch,
  updatePitch,
  getBookingsByPitch,
  updateBookingStatus
};