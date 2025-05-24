const userModel = require('../models/user');
const ownerModel = require('../models/owner');

// Đăng ký người dùng
async function registerUser(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    
    // Kiểm tra input cơ bản
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await userModel.findUserByEmail(email);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userId = await userModel.createUser({ name, email, password, phone });
    res.status(201).json({ message: 'User registered successfully', userId });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
}

// Đăng ký chủ sân
async function registerOwner(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await ownerModel.findOwnerByEmail(email);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const ownerId = await ownerModel.createOwner({ name, email, password, phone });
    res.status(201).json({ message: 'Owner registered successfully', ownerId });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
}

// Đăng nhập người dùng
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = await userModel.findUserByCredentials(email, password);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const token = generateToken(user.id, 'user'); // Tạo token
    
    res.json({
      message: 'Login successful',
      token, // Trả về token
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: 'user'
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
}

// Đăng nhập chủ sân (cập nhật)
async function loginOwner(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const owners = await ownerModel.findOwnerByCredentials(email, password);
    if (owners.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const owner = owners[0];
    const token = generateToken(owner.id, 'owner'); // Tạo token
    
    res.json({
      message: 'Login successful',
      token, // Trả về token
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        type: 'owner'
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
}

module.exports = {
  registerUser,
  registerOwner,
  loginUser,
  loginOwner
};