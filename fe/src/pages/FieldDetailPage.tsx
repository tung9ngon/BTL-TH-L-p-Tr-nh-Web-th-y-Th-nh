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
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Tooltip,
  Form,
  Input,
  message,
  Spin,
  Modal,
  Alert
} from 'antd';
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
  SendOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface PitchData {
  id: number;
  name: string;
  location: string;
  price_per_hour: number;
  pitch_type_id: number;
  avatar: string;
  status: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

interface ReviewStats {
  success: boolean;
  average_rating: number;
  total_reviews: number;
  reviews: Review[];
}

interface BookingData {
  id: number;
  pitch_id: number;
  user_id: number;
  status: string;
  created_at: string;
}

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  // Simple date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      marginBottom: 16,
      paddingBottom: 16,
      borderBottom: '1px solid #f0f0f0'
    }}>
      <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
      <div style={{ marginLeft: 16, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{review.user_name}</Text>
          <Tooltip title={new Date(review.created_at).toLocaleString('vi-VN')}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDate(review.created_at)}
            </Text>
          </Tooltip>
        </div>
        <Rate 
          disabled 
          value={review.rating} 
          style={{ fontSize: 12, margin: '4px 0' }} 
        />
        <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
          {review.comment || 'Không có bình luận'}
        </Paragraph>
      </div>
    </div>
  );
};

const FieldDetailPage: React.FC = () => {
  // Mock data - in real app these would come from context/props
  const fieldId = "1";
  const currentUserId = 1; // This should come from authentication context
  
  const [activeTab, setActiveTab] = useState('1');
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    success: false,
    average_rating: 0,
    total_reviews: 0,
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // API Functions
  const fetchPitchData = async (pitchId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pitches`);
      if (!response.ok) throw new Error('Failed to fetch pitches');
      
      const pitches = await response.json();
      const pitch = pitches.find((p: PitchData) => p.id.toString() === pitchId);
      
      if (!pitch) {
        // Return mock data if API call fails or pitch not found
        return {
          id: parseInt(pitchId),
          name: "Sân bóng KARA Sport khu đô thị Hòa Quý",
          location: "56 Đặng Thái Trâm, Khu đô thị Hòa Quý, Ngũ Hành Sơn, Đà Nẵng",
          price_per_hour: 300000,
          pitch_type_id: 1,
          avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          status: "available",
          owner_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      return pitch;
    } catch (error) {
      console.error('Error fetching pitch data:', error);
      // Return mock data on error
      return {
        id: parseInt(pitchId),
        name: "Sân bóng KARA Sport khu đô thị Hòa Quý",
        location: "56 Đặng Thái Trâm, Khu đô thị Hòa Quý, Ngũ Hành Sơn, Đà Nẵng",
        price_per_hour: 300000,
        pitch_type_id: 1,
        avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        status: "available",
        owner_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  const fetchReviews = async (pitchId: string) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_BASE_URL}/reviews/pitch/${pitchId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const reviewData = await response.json();
      return reviewData;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Return mock data on error
      return {
        success: true,
        average_rating: 4.2,
        total_reviews: 8,
        reviews: [
          {
            id: 1,
            booking_id: 1,
            rating: 5,
            comment: "Sân đẹp, cỏ mới, nhân viên nhiệt tình. Rất hài lòng với chất lượng dịch vụ.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_name: "Nguyễn Văn A"
          },
          {
            id: 2,
            booking_id: 2,
            rating: 4,
            comment: "Sân tốt nhưng giá hơi cao so với mặt bằng chung. Vệ sinh sạch sẽ.",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            user_name: "Trần Văn B"
          },
          {
            id: 3,
            booking_id: 3,
            rating: 4,
            comment: "Chất lượng sân ổn định, đã chơi nhiều lần và sẽ quay lại.",
            created_at: new Date(Date.now() - 259200000).toISOString(),
            user_name: "Lê Thị C"
          }
        ]
      };
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserBookings = async (pitchId: string, userId: number) => {
    try {
      // This endpoint should return user's bookings for this pitch that haven't been reviewed
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}/pitch/${pitchId}?status=completed&not_reviewed=true`);
      if (!response.ok) throw new Error('Failed to fetch user bookings');
      
      const bookings = await response.json();
      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      // Return mock data for demo
      return [
        {
          id: 123,
          pitch_id: parseInt(pitchId),
          user_id: userId,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
  };

  const submitReview = async (bookingId: number, userId: number, rating: number, comment: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          user_id: userId,
          rating: rating,
          comment: comment
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit review');
      }

      return result;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load pitch data and reviews in parallel
        const [pitch, reviews, bookings] = await Promise.all([
          fetchPitchData(fieldId),
          fetchReviews(fieldId),
          fetchUserBookings(fieldId, currentUserId)
        ]);

        setPitchData(pitch);
        setReviewStats(reviews);
        setUserBookings(bookings);
        
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải dữ liệu sân bóng');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fieldId, currentUserId]);

  // Handle review submission
  const handleSubmitReview = async (values: any) => {
    if (!selectedBookingId) {
      message.error('Vui lòng chọn booking để đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      
      await submitReview(
        selectedBookingId,
        currentUserId,
        values.rating,
        values.comment
      );

      message.success('Đánh giá thành công!');
      
      // Reset form and close modal
      form.resetFields();
      setReviewModalVisible(false);
      setSelectedBookingId(null);
      
      // Reload reviews
      const updatedReviews = await fetchReviews(fieldId);
      setReviewStats(updatedReviews);
      
      // Reload user bookings to remove reviewed booking
      const updatedBookings = await fetchUserBookings(fieldId, currentUserId);
      setUserBookings(updatedBookings);
      
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (bookingId?: number) => {
    if (userBookings.length === 0) {
      message.info('Bạn cần hoàn thành ít nhất một lần đặt sân để có thể đánh giá');
      return;
    }
    
    if (bookingId) {
      setSelectedBookingId(bookingId);
    } else if (userBookings.length === 1) {
      setSelectedBookingId(userBookings[0].id);
    }
    
    form.setFieldsValue({ rating: 5 });
    setReviewModalVisible(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!pitchData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Không tìm thấy thông tin sân bóng</Text>
      </div>
    );
  }

  const amenities = [
    { icon: <WifiOutlined />, label: 'WiFi miễn phí' },
    { icon: <CarOutlined />, label: 'Bãi đỗ xe' },
    { icon: <CoffeeOutlined />, label: 'Căn tin' },
    { icon: <LockOutlined />, label: 'Tủ khóa' },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Thông tin sân',
      children: (
        <div>
          <Descriptions column={1} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Địa chỉ">
              <Space>
                <EnvironmentOutlined />
                {pitchData.location}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giá thuê">
              <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                {pitchData.price_per_hour.toLocaleString('vi-VN')} VNĐ/giờ
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge 
                status={pitchData.status === 'available' ? 'success' : 'error'} 
                text={pitchData.status === 'available' ? 'Có sẵn' : 'Không có sẵn'} 
              />
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={5}>Tiện ích</Title>
          <Row gutter={[16, 16]}>
            {amenities.map((amenity, index) => (
              <Col span={12} key={index}>
                <Space>
                  {amenity.icon}
                  <Text>{amenity.label}</Text>
                </Space>
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={5}>Quy định</Title>
          <List
            size="small"
            dataSource={[
              'Không được mang thức ăn từ bên ngoài vào',
              'Vui lòng giữ gìn vệ sinh sân bóng',
              'Không hút thuốc trong khu vực sân',
              'Tuân thủ thời gian thuê sân'
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
      )
    },
    {
      key: '2',
      label: `Đánh giá (${reviewStats.total_reviews})`,
      children: (
        <div>
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              {reviewStats.average_rating.toFixed(1)}
            </div>
            <Rate disabled value={reviewStats.average_rating} allowHalf />
            <div style={{ marginTop: 8, color: '#666' }}>
              Dựa trên {reviewStats.total_reviews} đánh giá
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>Tất cả đánh giá</Title>
            {userBookings.length > 0 && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => openReviewModal()}
              >
                Viết đánh giá
              </Button>
            )}
          </div>

          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : reviewStats.reviews.length > 0 ? (
            <div>
              {reviewStats.reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <Text>Chưa có đánh giá nào</Text>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {pitchData.name}
            </Title>
          </Space>
          <Space>
            <Button type="primary" size="large">
              Đặt sân ngay
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card style={{ marginBottom: 24 }}>
              <Image
                src={pitchData.avatar}
                alt={pitchData.name}
                style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
              />
            </Card>

            <Card>
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={tabItems}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Thông tin liên hệ" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <PhoneOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text>0905 123 456</Text>
                </div>
                <div>
                  <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text>{pitchData.location}</Text>
                </div>
                <div>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text>6:00 - 22:00 (Thứ 2 - Chủ nhật)</Text>
                </div>
              </Space>
            </Card>

            <Card title="Đánh giá tổng quan">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                  {reviewStats.average_rating.toFixed(1)}
                </div>
                <Rate disabled value={reviewStats.average_rating} allowHalf style={{ fontSize: 16 }} />
                <div style={{ marginTop: 8, color: '#666' }}>
                  {reviewStats.total_reviews} đánh giá
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Review Modal */}
      <Modal
        title="Viết đánh giá"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          form.resetFields();
          setSelectedBookingId(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitReview}
          initialValues={{ rating: 5 }}
        >
          {userBookings.length > 1 && (
            <Form.Item label="Chọn lần đặt sân">
              <List
                size="small"
                dataSource={userBookings}
                renderItem={(booking) => (
                  <List.Item
                    style={{
                      padding: '8px 12px',
                      border: selectedBookingId === booking.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: 6,
                      marginBottom: 8,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedBookingId(booking.id)}
                  >
                    <div>
                      <Text strong>Booking #{booking.id}</Text>
                      <br />
                      <Text type="secondary">
                        {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Form.Item>
          )}

          <Form.Item
            name="rating"
            label="Đánh giá của bạn"
            rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
          >
            <Rate style={{ fontSize: 24 }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét (không bắt buộc)"
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setReviewModalVisible(false);
                  form.resetFields();
                  setSelectedBookingId(null);
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                icon={<SendOutlined />}
                disabled={!selectedBookingId}
              >
                Gửi đánh giá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default FieldDetailPage;