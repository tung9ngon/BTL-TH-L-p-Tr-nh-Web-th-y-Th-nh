import React from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Divider, 
  Rate, 
  Tag, 
  Space,
  Image,
  List,
  Descriptions,
  Tabs,
  Carousel,
  Affix
} from 'antd';
import { 
  HomeOutlined, 
  StarOutlined, 
  WifiOutlined, 
  CoffeeOutlined,
  CarOutlined,
  HolderOutlined,
  LockOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface FootballField {
  id: string;
  title: string;
  location: string;
  pitches: number;
  rating: number;
  reviews: number;
  features: string[];
  times: string[];
  city: string;
  price: number;
  description: string;
  images: string[];
  amenities: {
    parking: boolean;
    showers: boolean;
    locker: boolean;
    drinks: boolean;
  };
  address: string;
  phone: string;
  openingHours: string;
}

const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  
  // Mock data - sẽ fetch từ API dựa trên fieldId
  const fieldData: FootballField = {
    id: fieldId || 'field-1',
    title: `Sân bóng ${fieldId === 'field-1' ? 'KARA Sport khu đô thị Hòa Quý' : 
            fieldId === 'field-2' ? 'Sân cỏ nhân tạo Đại học Bách Khoa' : 
            fieldId === 'field-3' ? 'Sân bóng Hồng Hà' : 'Phú Thọ'}`,
    location: fieldId === 'field-1' ? 'Quận Ngũ Hành Sơn - Đà Nẵng' : 
              fieldId === 'field-2' ? 'Quận Đống Đa - Hà Nội' : 
              fieldId === 'field-3' ? 'Quận Hoàng Mai - Hà Nội' : 'Quận Tân Bình - Hồ Chí Minh',
    city: fieldId === 'field-1' ? 'danang' : 
          fieldId === 'field-2' ? 'hanoi' : 
          fieldId === 'field-3' ? 'hanoi' : 'hcm',
    pitches: fieldId === 'field-1' ? 4 : 
             fieldId === 'field-2' ? 4 : 
             fieldId === 'field-3' ? 3 : 15,
    rating: fieldId === 'field-1' ? 4.5 : 
            fieldId === 'field-2' ? 4.2 : 
            fieldId === 'field-3' ? 4.0 : 4.7,
    reviews: fieldId === 'field-1' ? 12 : 
             fieldId === 'field-2' ? 8 : 
             fieldId === 'field-3' ? 5 : 18,
    features: ['Sân trống', 'Wifi', 'Căng tin'],
    times: ['15:00', '17:30', '19:00'],
    price: fieldId === 'field-1' ? 300000 : 
           fieldId === 'field-2' ? 250000 : 
           fieldId === 'field-3' ? 180000 : 350000,
    description: fieldId === 'field-1' ? 
      'Sân bóng đá cỏ nhân tạo chất lượng cao, đạt tiêu chuẩn quốc tế. Sân có 4 mặt cỏ nhân tạo mới nhất, hệ thống chiếu sáng hiện đại, phòng thay đồ rộng rãi.' : 
      fieldId === 'field-2' ? 
      'Sân bóng đá cỏ nhân tạo trong khuôn viên Đại học Y Hà Nội. Mặt cỏ mới, hệ thống thoát nước tốt, có chỗ để xe rộng rãi.' : 
      fieldId === 'field-3' ? 
      'Sân bóng đá cỏ nhân tạo chất lượng tốt tại quận Hoàng Mai. Có 3 sân cỏ nhân tạo đạt tiêu chuẩn, hệ thống chiếu sáng tốt.' : 
      'Sân bóng đá cỏ nhân tạo lớn nhất TP.HCM với 15 sân đạt tiêu chuẩn quốc tế. Cơ sở vật chất hiện đại, dịch vụ chuyên nghiệp.',
    images: fieldId === 'field-1' ? [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ] : fieldId === 'field-2' ? [
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ] : fieldId === 'field-3' ? [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ] : [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: {
      parking: true,
      showers: fieldId === 'field-2' ? false : true,
      locker: fieldId === 'field-3' ? false : true,
      drinks: true
    },
    address: fieldId === 'field-1' ? '56 Đặng Thái Trâm, Khu đô thị Hòa Quý, Ngũ Hành Sơn, Đà Nẵng' : 
             fieldId === 'field-2' ? '1 Tôn Thất Tùng, Đống Đa, Hà Nội' : 
             fieldId === 'field-3' ? '123 Minh Khai, Hoàng Mai, Hà Nội' : '45 Trường Chinh, Tân Bình, TP.HCM',
    phone: '0905 123 456',
    openingHours: '06:00 - 23:00 hàng ngày'
  };

  const handleBookNow = () => {
    navigate(`/booking/${fieldId}`);
  };

  return (
    <Layout style={{ background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={2}>{fieldData.title}</Title>
            <Space size="middle">
              <Rate 
                disabled 
                defaultValue={fieldData.rating} 
                character={<StarOutlined />} 
              />
              <Text type="secondary">{fieldData.reviews} đánh giá</Text>
              <Text><EnvironmentOutlined /> {fieldData.location}</Text>
            </Space>
          </Col>

          <Col xs={24} md={16}>
            <Carousel autoplay>
              {fieldData.images.map((img, index) => (
                <div key={index}>
                  <Image
                    src={img}
                    alt={`Hình ảnh sân bóng ${index + 1}`}
                    style={{ width: '100%', borderRadius: 8 }}
                    preview={{ mask: 'Phóng to' }}
                  />
                </div>
              ))}
            </Carousel>

            <Card style={{ marginTop: 24 }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin chi tiết" key="1">
                  <Title level={4}>Mô tả</Title>
                  <Paragraph>{fieldData.description}</Paragraph>
                  
                  <Title level={4} style={{ marginTop: 24 }}>Tiện ích</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CarOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.amenities.parking ? '#52c41a' : '#ccc' }} />
                        <Text>Chỗ đỗ xe {fieldData.amenities.parking ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <HolderOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.amenities.showers ? '#52c41a' : '#ccc' }} />
                        <Text>Phòng tắm {fieldData.amenities.showers ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LockOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.amenities.locker ? '#52c41a' : '#ccc' }} />
                        <Text>Tủ đồ {fieldData.amenities.locker ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.amenities.drinks ? '#52c41a' : '#ccc' }} />
                        <Text>Đồ uống {fieldData.amenities.drinks ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <WifiOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.features.includes('Wifi') ? '#52c41a' : '#ccc' }} />
                        <Text>Wifi {fieldData.features.includes('Wifi') ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                    <Col xs={12} sm={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CoffeeOutlined style={{ fontSize: 20, marginRight: 8, color: fieldData.features.includes('Căng tin') ? '#52c41a' : '#ccc' }} />
                        <Text>Căng tin {fieldData.features.includes('Căng tin') ? '' : '(Không có)'}</Text>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                
                <TabPane tab="Đánh giá" key="2">
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <Text type="secondary">Chức năng đánh giá sẽ sớm được cập nhật</Text>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Affix offsetTop={20}>
                <Card title="Thông tin đặt sân">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Giá thuê">
                      <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                        {fieldData.price.toLocaleString()} VND/giờ
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số sân">
                      {fieldData.pitches} sân
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ mở cửa">
                      <ClockCircleOutlined /> {fieldData.openingHours}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                      {fieldData.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Liên hệ">
                      <PhoneOutlined /> {fieldData.phone}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider />

                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    onClick={handleBookNow}
                  >
                    Đặt sân ngay
                  </Button>
                </Card>
              </Affix>

              <Card title="Khuyến mãi">
                <List
                  size="small"
                  dataSource={[
                    'Giảm 10% cho nhóm từ 10 người trở lên',
                    'Giảm 20% cho khung giờ sáng (6h-12h)',
                    'Tặng 1 chai nước/sân cho thành viên mới'
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <Text type="success">• {item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default FieldDetailPage;