const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');

router.get('/', timeSlotController.getAllTimeSlots);
router.post('/', timeSlotController.createTimeSlot);

module.exports = router;
