import React from 'react';
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Badge,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Space,
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  ReadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const sampleFields = [
    {
      title: 'Sân bóng đá The One Gamuda',
      location: 'Quận Hoàng Mai - Hà Nội',
      slots: ['15:00', '17:30', '19:00'],
      img: 'https://img.vietcetera.com/uploads/images/06-apr-2023/football.jpg',
    },
    {
      title: 'Sân bóng KAKA Sport',
      location: 'Ngũ Hành Sơn - Đà Nẵng',
      slots: ['15:00', '17:30', '19:00'],
      img: 'https://img.vietcetera.com/uploads/images/06-apr-2023/sport-field.jpg',
    },
    {
      title: 'Sân đại học Y Hà Nội',
      location: 'Quận Đống Đa - Hà Nội',
      slots: ['15:00', '17:30', '19:00'],
      img: 'https://img.vietcetera.com/uploads/images/06-apr-2023/soccer.jpg',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER */}
      <Header style={{
        background: '#fff',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#1890ff', marginRight: 48 }}>
          SPORT WORLD
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ flex: 1, borderBottom: 'none' }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
        </Menu>
        <Space size="large">
          <Input
            placeholder="Tìm sân bóng..."
            prefix={<SearchOutlined />}
            style={{ width: 300, borderRadius: 20 }}
          />
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Avatar icon={<UserOutlined />} />
        </Space>
      </Header>

      {/* CONTENT */}
      <Content style={{ padding: '40px 80px' }}>
        <Title level={3} style={{ marginBottom: 32 }}>Có 3.860 Sân bóng đá</Title>
        <Row gutter={[24, 24]}>
          {sampleFields.map((field, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                cover={
                  <img
                    alt={field.title}
                    src={field.img}
                    style={{
                      height: 180,
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                }
              >
                <Title level={5} style={{ marginBottom: 4 }}>{field.title}</Title>
                <Text type="secondary">Khu vực: {field.location}</Text>
                <div style={{ marginTop: 12 }}>
                  <Text strong>Sân trống:</Text>
                  <div style={{ marginTop: 8 }}>
                    {field.slots.map((time) => (
                      <Button
                        key={time}
                        size="small"
                        shape="round"
                        style={{ marginRight: 8, marginBottom: 8 }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
