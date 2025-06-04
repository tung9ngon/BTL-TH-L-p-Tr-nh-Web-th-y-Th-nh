import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Typography, Row, Col, Input,
  Radio, Button, Upload, message, Avatar, Spin
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import UserMenuLeft from '../component/UserMenuLeft';

const { Content } = Layout;
const { Title, Text } = Typography;

// Định nghĩa interface cho FormData
interface FormData {
  name: string;
  email: string;
  phone: string;
  introduce: string;
  avatar: string | ArrayBuffer | null;
  gender: string;
}

// Định nghĩa interface cho session data
interface SessionData {
  user_id?: string;
  id?: string;
}

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    introduce: '',
    avatar: null,
    gender: 'male'
  });
  
  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | ArrayBuffer | null>(null);

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
      console.error('Error parsing session:', error);
      return null;
    }
  };

  const userId = getUserId();

  // Check if user is logged in
  const checkUserLogin = (): boolean => {
    const userId = getUserId();
    if (!userId) {
      message.warning('Vui lòng đăng nhập để truy cập trang này');
      // Uncomment if you want to redirect to login
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 2000);
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
        // Redirect to login page if needed
        // window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        introduce: data.introduce || '',
        avatar: data.avatar || null,
        gender: data.gender || 'male'
      });
      
      if (data.avatar) {
        setAvatarUrl(data.avatar);
      }

    } catch (error) {
      console.error('Load user data error:', error);
      message.error('Không thể tải thông tin người dùng. Vui lòng thử lại!');
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
      if (field === 'avatar') {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
    return false;
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

      const updateData = {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone.trim(),
        introduce: formData.introduce.trim(),
        avatar: formData.avatar,
        gender: formData.gender
      };

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
        console.error('Error updating localStorage:', error);
      }

    } catch (error) {
      console.error('Update user error:', error);
      message.error('Cập nhật thất bại. Vui lòng thử lại!');
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
        gender: 'male'
      };

      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clearedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFormData(clearedData);
      setAvatarUrl(null);
      setBackgroundUrl(null);
      message.success('Đã xóa dữ liệu cá nhân thành công');
      
    } catch (error) {
      console.error('Delete data error:', error);
      message.error('Không thể xóa dữ liệu. Vui lòng thử lại!');
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
              <Upload showUploadList={false} beforeUpload={(file: File) => handleImageUpload(file, setBackgroundUrl)}>
                <Button
                  icon={<UploadOutlined />}
                  size="small"
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Upload>
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
                <Upload showUploadList={false} beforeUpload={(file: File) => handleImageUpload(file, setAvatarUrl, 'avatar')}>
                  <Button
                    shape="circle"
                    size="small"
                    icon={<UploadOutlined />}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      transform: 'translate(25%, 25%)',
                      padding: 0
                    }}
                  />
                </Upload>
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
                    readOnly 
                    style={{ marginTop: 8 }} 
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
    </Layout>
  );
};

export default ProfilePage;