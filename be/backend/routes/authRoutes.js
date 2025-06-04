const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// AUTH ROUTES
router.post('/register/user', authController.registerUser);
router.post('/register/owner', authController.registerOwner);
router.post('/login/user', authController.loginUser);
router.post('/login/owner', authController.loginOwner);

router.get('/:userId', authController.getUserProfile);
router.put('/:userId', authController.updateUserProfile);
router.delete('/:userId/avatar', authController.removeUserAvatar);

module.exports = router;
