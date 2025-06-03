import React, { useState } from 'react';
import {
  Layout, Card, Typography, Row, Col, Input,
  Radio, Button, Upload, message, Avatar
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import UserMenuLeft from '../component/UserMenuLeft';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | ArrayBuffer | null>(null);

  interface ImageUploadSetter {
    (value: string | ArrayBuffer | null): void;
  }

  const handleImageUpload = (file: File, setter: ImageUploadSetter): boolean => {
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

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
              <Upload showUploadList={false} beforeUpload={(file) => handleImageUpload(file, setBackgroundUrl)}>
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
                <Upload showUploadList={false} beforeUpload={(file) => handleImageUpload(file, setAvatarUrl)}>
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
              <Text strong style={{ fontSize: 16, marginLeft: 16 }}>dothanh@gmail.com</Text>
            </div>

            {/* Giới thiệu + Thông tin liên hệ */}
            <Row gutter={24} style={{ padding: '0 24px' }}>
              <Col span={12}>
                <Title level={5}>Giới thiệu</Title>
                <Input.TextArea rows={5} placeholder="Viết gì đó về bạn..." />
              </Col>
              <Col span={12}>
                <Title level={5}>Thông tin liên hệ</Title>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tên tài khoản</Text>
                  <Input placeholder="Tên tài khoản" style={{ marginTop: 8 }} />
                </div>
                <div>
                  <Text strong>Số điện thoại</Text>
                  <Input placeholder="Số điện thoại" style={{ marginTop: 8 }} />
                </div>
              </Col>
            </Row>

            {/* Thông tin cá nhân */}
            <div style={{ padding: '24px' }}>
              <Title level={5}>Thông tin Cá nhân</Title>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>Email</Text>
                  <Input value="dothanh@gmail.com" readOnly style={{ marginTop: 8 }} />
                </Col>
                <Col span={12}>
                  <Text strong>Giới tính</Text>
                  <div style={{ marginTop: 8 }}>
                    <Radio.Group defaultValue="male">
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
              <Button danger>Xóa dữ liệu</Button>
              <Button type="primary">Lưu thông tin</Button>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;
