import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Typography, Row, Col, Input,
  Radio, Button, Upload, message, Avatar, Spin, Modal
} from 'antd';
import { UserOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons';
import UserMenuLeft from '../component/UserMenuLeft';

const { Content } = Layout;
const { Title, Text } = Typography;

// Định nghĩa interface cho FormData - thêm background
interface FormData {
  name: string;
  email: string;
  phone: string;
  introduce: string;
  avatar: string | ArrayBuffer | null;
  gender: string;
  background: string | ArrayBuffer | null;
}

// Định nghĩa interface cho session data
interface SessionData {
  user_id?: string;
  id?: string;
}

// Error type helper
interface ErrorWithMessage {
  message: string;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Form states - thêm background
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    introduce: '',
    avatar: null,
    gender: 'male',
    background: null
  });

  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | ArrayBuffer | null>(null);

  // Modal states for image URL input
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState<boolean>(false);
  const [isBackgroundModalVisible, setIsBackgroundModalVisible] = useState<boolean>(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>('');
  const [backgroundUrlInput, setBackgroundUrlInput] = useState<string>('');

  // Get user ID from localStorage
  const getUserId = (): string | null => {
    const session = localStorage.getItem('session');
    if (!session) {
      console.log('No session found in localStorage');
      return null;
    }

    try {
      const sessionData: SessionData = JSON.parse(session);
      console.log('Parsed session data:', sessionData);

      // Kiểm tra cả user_id và id để tương thích ngược
      return sessionData.user_id || sessionData.id || null;
    } catch (error) {
      console.error('Error parsing session:', toErrorWithMessage(error).message);
      return null;
    }
  };

  // Check if user is logged in
  const checkUserLogin = (): boolean => {
    const userId = getUserId();
    if (!userId) {
      message.warning('Vui lòng đăng nhập để truy cập trang này');
      return false;
    }
    return true;
  };

  // Load user data on component mount
  useEffect(() => {
    if (checkUserLogin()) {
      loadUserData();
    }
  }, []);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      const userId = getUserId();

      if (!userId) {
        message.error('Vui lòng đăng nhập để xem thông tin cá nhân');
        return;
      }

      console.log('Loading user data for ID:', userId);

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      console.log('Load user response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const data = JSON.parse(responseText);

      // Cập nhật formData với tất cả thông tin từ server
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        introduce: data.introduce || '',
        avatar: data.avatar || null,
        gender: data.gender || 'male',
        background: data.background || null
      });

      // Cập nhật URL cho avatar và background
      if (data.avatar) {
        setAvatarUrl(data.avatar);
      }

      if (data.background) {
        setBackgroundUrl(data.background);
      }

    } catch (error) {
      console.error('Load user data error:', error);
      const errorMessage = toErrorWithMessage(error).message;
      message.error(`Không thể tải thông tin người dùng: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (
    file: File,
    setter: (value: string | ArrayBuffer | null) => void,
    field?: keyof FormData
  ): boolean => {
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result);
      if (field) {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  // Handle avatar URL modal
  const handleAvatarUrlSubmit = () => {
    if (avatarUrlInput.trim()) {
      setAvatarUrl(avatarUrlInput);
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrlInput
      }));
      setIsAvatarModalVisible(false);
      setAvatarUrlInput('');
    } else {
      message.warning('Vui lòng nhập URL hợp lệ');
    }
  };

  // Handle background URL modal
  const handleBackgroundUrlSubmit = () => {
    if (backgroundUrlInput.trim()) {
      setBackgroundUrl(backgroundUrlInput);
      setFormData(prev => ({
        ...prev,
        background: backgroundUrlInput
      }));
      setIsBackgroundModalVisible(false);
      setBackgroundUrlInput('');
    } else {
      message.warning('Vui lòng nhập URL hợp lệ');
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
      const userId = getUserId();

      if (!userId) {
        message.error('Vui lòng đăng nhập để cập nhật thông tin');
        return;
      }

      // Validate required fields
      if (!formData.name.trim()) {
        message.error('Vui lòng nhập tên tài khoản');
        return;
      }

      if (!formData.email.trim()) {
        message.error('Vui lòng nhập email');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        message.error('Email không hợp lệ');
        return;
      }

      // Chuẩn bị dữ liệu cập nhật - bao gồm tất cả các field
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        introduce: formData.introduce.trim(),
        avatar: formData.avatar,
        gender: formData.gender,
        background: formData.background
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const responseText = await response.text();
      console.log('Update response text:', responseText);

      if (!response.ok) {
        let errorMessage = 'Cập nhật thất bại';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        throw new Error('Invalid response format');
      }

      message.success('Cập nhật thông tin thành công!');

      // Update localStorage with new user data
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.name = formData.name;
          user.email = formData.email;
          user.phone = formData.phone;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error updating localStorage:', toErrorWithMessage(error).message);
      }

      // Reload user data to show updated information
      await loadUserData();

    } catch (error) {
      console.error('Update user error:', error);
      const errorMessage = toErrorWithMessage(error).message;
      message.error(`Cập nhật thất bại: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteData = async (): Promise<void> => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dữ liệu cá nhân? (Email và tên tài khoản sẽ được giữ lại)')) {
      return;
    }

    try {
      const userId = getUserId();
      if (!userId) {
        message.error('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      // Reset form data (keep email and name)
      const clearedData: FormData = {
        name: formData.name,
        email: formData.email,
        phone: '',
        introduce: '',
        avatar: null,
        gender: 'male',
        background: null
      };

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clearedData)
      });

      const responseText = await response.text();
      console.log('Delete response text:', responseText);

      if (!response.ok) {
        let errorMessage = 'Xóa dữ liệu thất bại';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        throw new Error('Invalid response format');
      }

      setFormData(clearedData);
      setAvatarUrl(null);
      setBackgroundUrl(null);
      message.success('Đã xóa dữ liệu cá nhân thành công');

    } catch (error) {
      console.error('Delete data error:', error);
      const errorMessage = toErrorWithMessage(error).message;
      message.error(`Không thể xóa dữ liệu: ${errorMessage}`);
    }
  };

  if (!getUserId()) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <UserMenuLeft collapsed={collapsed} />
        <Layout className="site-layout">
          <Content style={{ margin: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <Title level={3}>Vui lòng đăng nhập</Title>
              <Text>Bạn cần đăng nhập để xem thông tin cá nhân</Text>
              <br />
              <Button type="primary" style={{ marginTop: '16px' }} onClick={() => window.location.href = '/login'}>
                Đăng nhập
              </Button>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <UserMenuLeft collapsed={collapsed} />
        <Layout className="site-layout">
          <Content style={{ margin: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <UserMenuLeft collapsed={collapsed} />

      <Layout className="site-layout">
        <Content style={{ margin: '16px' }}>
          <Card
            bordered={false}
            style={{
              borderRadius: '8px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {/* Background image with edit button */}
            <div style={{ position: 'relative', height: 200, backgroundColor: '#f5f5f5' }}>
              <img
                src={typeof backgroundUrl === 'string' ? backgroundUrl : 'https://via.placeholder.com/800x200?text=Background'}
                alt="background"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                <Upload 
                  showUploadList={false} 
                  beforeUpload={(file: File) => handleImageUpload(file, setBackgroundUrl)}
                  style={{ marginRight: 8 }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                  >
                    Tải ảnh
                  </Button>
                </Upload>
                <Button
                  icon={<LinkOutlined />}
                  size="small"
                  onClick={() => setIsBackgroundModalVisible(true)}
                >
                  Link ảnh
                </Button>
              </div>
            </div>

            {/* Avatar + email */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: -32,
              padding: '0 24px 24px'
            }}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  size={80}
                  src={typeof avatarUrl === 'string' ? avatarUrl : undefined}
                  icon={<UserOutlined />}
                  style={{ border: '3px solid white' }}
                />
                <div style={{ position: 'absolute', bottom: -10, right: -10 }}>
                  <Upload 
                    showUploadList={false} 
                    beforeUpload={(file: File) => handleImageUpload(file, setAvatarUrl, 'avatar')}
                    style={{ marginRight: 4 }}
                  >
                    <Button
                      shape="circle"
                      size="small"
                      icon={<UploadOutlined />}
                    />
                  </Upload>
                  <Button
                    shape="circle"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={() => setIsAvatarModalVisible(true)}
                    style={{ marginLeft: 4 }}
                  />
                </div>
              </div>
              <Text strong style={{ fontSize: 16, marginLeft: 16 }}>{formData.email}</Text>
            </div>

            {/* Giới thiệu + Thông tin liên hệ */}
            <Row gutter={24} style={{ padding: '0 24px' }}>
              <Col span={12}>
                <Title level={5}>Giới thiệu</Title>
                <Input.TextArea
                  rows={5}
                  placeholder="Viết gì đó về bạn..."
                  value={formData.introduce}
                  onChange={(e) => handleInputChange('introduce', e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Title level={5}>Thông tin liên hệ</Title>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tên tài khoản</Text>
                  <Input
                    placeholder="Tên tài khoản"
                    style={{ marginTop: 8 }}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Text strong>Số điện thoại</Text>
                  <Input
                    placeholder="Số điện thoại"
                    style={{ marginTop: 8 }}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            {/* Thông tin cá nhân */}
            <div style={{ padding: '24px' }}>
              <Title level={5}>Thông tin Cá nhân</Title>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>Email</Text>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{ marginTop: 8 }}
                    placeholder="Nhập email"
                  />
                </Col>
                <Col span={12}>
                  <Text strong>Giới tính</Text>
                  <div style={{ marginTop: 8 }}>
                    <Radio.Group
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <Radio value="female">Nữ</Radio>
                      <Radio value="male">Nam</Radio>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Action buttons */}
            <div style={{
              padding: '0 24px 24px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Button danger onClick={handleDeleteData}>Xóa dữ liệu</Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={saving}
              >
                Lưu thông tin
              </Button>
            </div>
          </Card>
        </Content>
      </Layout>

      {/* Avatar URL Modal */}
      <Modal
        title="Nhập URL Avatar"
        visible={isAvatarModalVisible}
        onOk={handleAvatarUrlSubmit}
        onCancel={() => {
          setIsAvatarModalVisible(false);
          setAvatarUrlInput('');
        }}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập URL hình ảnh avatar"
          value={avatarUrlInput}
          onChange={(e) => setAvatarUrlInput(e.target.value)}
          onPressEnter={handleAvatarUrlSubmit}
        />
      </Modal>

      {/* Background URL Modal */}
      <Modal
        title="Nhập URL Ảnh Nền"
        visible={isBackgroundModalVisible}
        onOk={handleBackgroundUrlSubmit}
        onCancel={() => {
          setIsBackgroundModalVisible(false);
          setBackgroundUrlInput('');
        }}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập URL hình ảnh nền"
          value={backgroundUrlInput}
          onChange={(e) => setBackgroundUrlInput(e.target.value)}
          onPressEnter={handleBackgroundUrlSubmit}
        />
      </Modal>
    </Layout>
  );
};

export default ProfilePage;
