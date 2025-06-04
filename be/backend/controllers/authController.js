const userModel = require('../models/user');
const ownerModel = require('../models/owner');

// Đăng ký người dùng
async function registerUser(req, res) {
  try {
    const { name, email, password, phone } = req.body;

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
    res.json({
      message: 'Login successful',
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

// Đăng nhập chủ sân (không trả về token)
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
    res.json({
      message: 'Login successful',
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



async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    
    console.log('Getting profile for user ID:', userId);
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID người dùng không hợp lệ' 
      });
    }

    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    // Trả về tất cả thông tin người dùng
    res.json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      introduce: user.introduce,
      gender: user.gender,
      background: user.background,
      created_at: user.created_at
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng',
      error: error.message
    });
  }
}

// Cập nhật thông tin người dùng - Fixed
async function updateUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const { name, email, phone, avatar, introduce, gender, background } = req.body;

    console.log('Updating user ID:', userId);
    console.log('Update data:', { name, email, phone, avatar, introduce, gender, background });

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID người dùng không hợp lệ' 
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên không được để trống' 
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không được để trống' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Kiểm tra user có tồn tại không
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    // Kiểm tra email có bị trùng với user khác không (nếu email thay đổi)
    if (email && email !== existingUser.email) {
      const emailExists = await userModel.findUserByEmail(email);
      if (emailExists.length > 0 && emailExists[0].id != userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email này đã được sử dụng bởi tài khoản khác' 
        });
      }
    }

    // Chuẩn bị dữ liệu cập nhật - giữ nguyên giá trị cũ nếu không có giá trị mới
    const updateData = {
      name: name ? name.trim() : existingUser.name,
      email: email ? email.trim() : existingUser.email,
      phone: phone !== undefined ? phone.trim() : (existingUser.phone || ''),
      avatar: avatar !== undefined ? avatar : existingUser.avatar,
      introduce: introduce !== undefined ? introduce.trim() : (existingUser.introduce || ''),
      gender: gender || existingUser.gender || 'male',
      background: background !== undefined ? background : existingUser.background
    };

    console.log('Final update data:', updateData);

    const success = await userModel.updateUser(userId, updateData);
    
    if (success) {
      // Lấy lại thông tin user sau khi cập nhật
      const updatedUser = await userModel.getUserById(userId);
      res.json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar,
          introduce: updatedUser.introduce,
          gender: updatedUser.gender,
          background: updatedUser.background,
          created_at: updatedUser.created_at
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Không thể cập nhật thông tin' 
      });
    }
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin',
      error: error.message
    });
  }
}

// Xóa avatar của người dùng
async function removeUserAvatar(req, res) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      avatar: null,
      introduce: existingUser.introduce,
      gender: existingUser.gender,
      background: existingUser.background
    };

    const success = await userModel.updateUser(userId, updateData);
    
    if (success) {
      res.json({ message: 'Avatar removed successfully' });
    } else {
      res.status(400).json({ message: 'Failed to remove avatar' });
    }
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({
      message: 'Failed to remove avatar',
      error: error.message
    });
  }
}

module.exports = {
  registerUser,
  registerOwner,
  loginUser,
  loginOwner,
  getUserProfile,
  updateUserProfile,
  removeUserAvatar
};
