import React from 'react';
import { Card, Avatar, Typography, Row, Col, Divider, Button } from 'antd';
import { UserOutlined, EditOutlined, HomeOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProfilePage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Title level={2} style={{ color: '#1890ff' }}>Trang thông tin cá nhân</Title>
      
      <Row gutter={16}>
        <Col span={24} md={8}>
          <Card 
            title="HotelBooking" 
            bordered={false}
            style={{ marginBottom: '20px', borderRadius: '10px' }}
            headStyle={{ backgroundColor: '#1890ff', color: 'white' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Text strong><HomeOutlined /> Home</Text>
              <Text strong><CreditCardOutlined /> Payments</Text>
              <Text strong style={{ color: '#1890ff' }}><UserOutlined /> Chỉnh sửa thông tin</Text>
            </div>
          </Card>
          
          <Card 
            bordered={false}
            style={{ marginBottom: '20px', borderRadius: '10px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>Người dùng</Title>
              <Text type="secondary">user@example.com</Text>
            </div>
          </Card>
          
          <Card 
            bordered={false}
            style={{ borderRadius: '10px' }}
          >
            <Title level={4}>Thông tin cá nhân</Title>
            <Divider />
            
            <Text strong>Họ và tên:</Text>
            <Text style={{ display: 'block', marginBottom: '12px' }}>Nguyễn Văn A</Text>
            
            <Text strong>Email:</Text>
            <Text style={{ display: 'block', marginBottom: '12px' }}>user@example.com</Text>
            
            <Text strong>Số điện thoại:</Text>
            <Text style={{ display: 'block', marginBottom: '12px' }}>0123456789</Text>
            
            <Text strong>Địa chỉ:</Text>
            <Text style={{ display: 'block', marginBottom: '12px' }}>123 Đường ABC, Quận XYZ, TP.HCM</Text>
            
            <Button type="primary" icon={<EditOutlined />} block>
              Chỉnh sửa thông tin
            </Button>
          </Card>
        </Col>
        
        <Col span={24} md={16}>
          <Card 
            title="Hoạt động gần đây" 
            bordered={false}
            style={{ marginBottom: '20px', borderRadius: '10px' }}
          >
            <Text>Bạn chưa có hoạt động gần đây</Text>
          </Card>
          
          <Card 
            title="Sân bóng đã đặt" 
            bordered={false}
            style={{ borderRadius: '10px' }}
          >
            <Card.Grid style={{ width: '100%', boxShadow: 'none' }}>
              <Text strong>Sân bóng KARA Sport khu đô thị Hòa Quý</Text>
              <Text style={{ display: 'block' }}>Quận Ngũ Hành Sơn - Đà Nẵng</Text>
              <Text type="secondary">Số sân: 4</Text>
            </Card.Grid>
            
            <Divider />
            
            <Card.Grid style={{ width: '100%', boxShadow: 'none' }}>
              <Text strong>Sân cỏ nhân tạo Đại Học Bách Khoa</Text>
              <Text style={{ display: 'block' }}>Quận Đông Đa - Hà Nội</Text>
              <Text type="secondary">Số sân: 3</Text>
            </Card.Grid>
            
            <Divider />
            
            <Card.Grid style={{ width: '100%', boxShadow: 'none' }}>
              <Text strong>Sân bóng Hồng Hà</Text>
              <Text style={{ display: 'block' }}>Quận Hoàng Mai - Hà Nội</Text>
              <Text type="secondary">Số sân: 2</Text>
            </Card.Grid>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;