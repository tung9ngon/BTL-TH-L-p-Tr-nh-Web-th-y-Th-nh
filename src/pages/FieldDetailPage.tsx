import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Divider, 
  Rate, 
  Space,
  Image,
  List,
  Descriptions,
  Tabs,
  Carousel,
  Affix,
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Tooltip,
  Form,
  Input,
  message
} from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  StarOutlined, 
  StarFilled,
  WifiOutlined, 
  CoffeeOutlined,
  CarOutlined,
  HolderOutlined,
  LockOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  BellOutlined,
  UserOutlined,
  ReadOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

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

interface Review {
  id: string;
  author: string;
  avatar: string;
  content: string;
  rating: number;
  createdAt: string;
  fieldId: string;
}

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div style={{ 
      display: 'flex', 
      marginBottom: 16,
      paddingBottom: 16,
      borderBottom: '1px solid #f0f0f0'
    }}>
      <Avatar src={review.avatar} alt={review.author} />
      <div style={{ marginLeft: 16, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong>{review.author}</Text>
          <Tooltip title={moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <Text type="secondary">{moment(review.createdAt).fromNow()}</Text>
          </Tooltip>
        </div>
        <Rate 
          disabled 
          value={review.rating} 
          style={{ fontSize: 14, margin: '4px 0' }} 
        />
        <Paragraph style={{ marginBottom: 0 }}>{review.content}</Paragraph>
      </div>
    </div>
  );
};

const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [fieldData, setFieldData] = useState<FootballField>({
    id: '',
    title: '',
    location: '',
    pitches: 0,
    rating: 0,
    reviews: 0,
    features: [],
    times: [],
    city: '',
    price: 0,
    description: '',
    images: [],
    amenities: {
      parking: false,
      showers: false,
      locker: false,
      drinks: false
    },
    address: '',
    phone: '',
    openingHours: ''
  });
  
  // Mock reviews data
  const mockReviews: Record<string, Review[]> = {
    'field-1': Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 1}`,
      author: `Người dùng ${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 6) + 1}.jpg`,
      content: i % 3 === 0 
        ? 'Sân đẹp, cỏ mới, nhân viên nhiệt tình. Rất hài lòng với chất lượng dịch vụ.' 
        : i % 3 === 1 
        ? 'Sân tốt nhưng giá hơi cao so với mặt bằng chung. Vệ sinh sạch sẽ.' 
        : 'Chất lượng sân ổn định, đã chơi nhiều lần và sẽ quay lại.',
      rating: i % 2 === 0 ? 5 : i % 3 === 0 ? 4 : 3,
      createdAt: new Date(Date.now() - (i * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      fieldId: 'field-1'
    })),
    'field-2': Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      author: `Người dùng ${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 6) + 1}.jpg`,
      content: i % 3 === 0 
        ? 'Sân thuận tiện vị trí gần trường đại học. Chất lượng cỏ ổn.' 
        : i % 3 === 1 
        ? 'Giá cả hợp lý, chất lượng tốt.' 
        : 'Sân mới mở nên còn một số điểm cần cải thiện.',
      rating: i % 2 === 0 ? 4 : i % 3 === 0 ? 5 : 3,
      createdAt: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      fieldId: 'field-2'
    })),
    'field-3': Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      author: `Người dùng ${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 6) + 1}.jpg`,
      content: i % 3 === 0 
        ? 'Sân tốt, giá cả phải chăng.' 
        : i % 3 === 1 
        ? 'Nhân viên thân thiện, sân sạch sẽ.' 
        : 'Cơ sở vật chất đầy đủ, sạch sẽ.',
      rating: i % 2 === 0 ? 4 : i % 3 === 0 ? 5 : 3,
      createdAt: new Date(Date.now() - (i * 10 * 24 * 60 * 60 * 1000)).toISOString(),
      fieldId: 'field-3'
    }))
  };

  // Load data khi component mount hoặc fieldId thay đổi
  useEffect(() => {
    const loadData = () => {
      // Mock field data
      const data: FootballField = {
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
        rating: 0, // Sẽ được tính toán dựa trên reviews
        reviews: 0, // Sẽ được cập nhật dựa trên số lượng reviews thực tế
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

      // Load reviews
      const fieldReviews = fieldId && mockReviews[fieldId] ? mockReviews[fieldId] : [];
      setReviews(fieldReviews);
      
      // Tính toán rating trung bình
      const avgRating = fieldReviews.length > 0 
        ? fieldReviews.reduce((sum, review) => sum + review.rating, 0) / fieldReviews.length 
        : 0;
      
      // Cập nhật fieldData với reviews và rating thực tế
      setFieldData({
        ...data,
        reviews: fieldReviews.length,
        rating: parseFloat(avgRating.toFixed(1))
      });
    };

    loadData();
  }, [fieldId]);

  const handleBookNow = () => {
    navigate(`/booking/${fieldId}`);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate(`/profile`)}>Thông tin cá nhân</Menu.Item>
      <Menu.Item key="history" onClick={() => navigate(`/payment`)}>Lịch sử giao dịch</Menu.Item>
      <Menu.Item key="logout" onClick={() => navigate(`/login`)}>Đăng xuất</Menu.Item>
    </Menu>
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSubmitReview = () => {
    if (!value) {
      message.warning('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        author: 'Người dùng mới',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        content: value,
        rating: rating,
        createdAt: new Date().toISOString(),
        fieldId: fieldId || ''
      };
      
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      
      // Tính toán lại rating trung bình
      const avgRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
      
      // Cập nhật fieldData
      setFieldData(prev => ({
        ...prev,
        reviews: updatedReviews.length,
        rating: parseFloat(avgRating.toFixed(1))
      }));
      
      setValue('');
      setSubmitting(false);
      message.success('Đánh giá của bạn đã được gửi!');
    }, 800);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header không fixed */}
      <Header style={{
        background: '#fff',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 64,
        lineHeight: '64px',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#1890ff', marginRight: 24 }}>
          Football Booking
        </div>
        <Menu 
          mode="horizontal" 
          defaultSelectedKeys={['home']} 
          style={{ flex: 1, borderBottom: 'none' }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/home')}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />} onClick={() => navigate(`/comments`)}>Đánh giá</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
        </Menu>
        <Space size="middle">
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </Space>
      </Header>
      
      <Content>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: 24 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={2}>{fieldData.title}</Title>
              <Space size="middle">
                <Rate 
                  disabled 
                  value={fieldData.rating} 
                  allowHalf 
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
                <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange}>
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
                  
                  <TabPane tab={`Đánh giá (${fieldData.reviews})`} key="2">
                    <div style={{ marginBottom: 24 }}>
                      <Title level={4}>Thêm đánh giá của bạn</Title>
                      <Rate 
                        value={rating} 
                        onChange={setRating} 
                        style={{ marginBottom: 16 }} 
                      />
                      <Form.Item>
                        <TextArea
                          rows={4}
                          onChange={(e) => setValue(e.target.value)}
                          value={value}
                          placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..."
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          loading={submitting}
                          onClick={handleSubmitReview}
                          type="primary"
                          icon={<SendOutlined />}
                        >
                          Gửi đánh giá
                        </Button>
                      </Form.Item>
                    </div>
                    
                    <Divider />
                    
                    <Title level={4}>Đánh giá từ người dùng</Title>
                    {reviews.length > 0 ? (
                      <div>
                        {reviews.map(review => (
                          <ReviewItem key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 24 }}>
                        <Text type="secondary">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</Text>
                      </div>
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      </Content>
    </Layout>
  );
};

export default FieldDetailPage;