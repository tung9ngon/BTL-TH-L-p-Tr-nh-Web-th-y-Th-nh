import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Space,
  Image,
  Descriptions,
  Tabs,
  Menu,
  Avatar,
  Badge,
  Tooltip,
  Rate,
  Spin,
  message,
  Form,
  Input,

  List,
  Progress,
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
  LockOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  BellOutlined,
  UserOutlined,
  ReadOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface FootballField {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  pitch_type_id: string;
  avatar: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  avg_rating?: number;
  total_reviews: number;
  phone: number;
  amenities?: {
    wifi?: boolean;
    parking?: boolean;
    drinks?: boolean;
    locker?: boolean;
  };
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: Review[];
}

const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  async getPitchDetail(pitchId: string): Promise<FootballField> {
    try {
      const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`);
      if (!response.ok) throw new Error('Failed to fetch pitch');
      const data = await response.json();
      return {
        ...data.data,
        avg_rating: data.data.avg_rating || 0,
        total_reviews: data.data.total_reviews || 0
      };
    } catch (error) {
      console.error('Error fetching pitch detail:', error);
      throw error;
    }
  },

  async getPitchReviews(pitchId: string): Promise<ReviewStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/pitch/${pitchId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      return {
        average_rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        rating_distribution: data.rating_distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        reviews: data.reviews || []
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        reviews: []
      };
    }
  },

  async addReview(reviewData: {
    pitch_id: string;
    rating: number;
    comment: string;
    user_id: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add review');
      }

      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};

// Component hiển thị một review
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Avatar icon={<UserOutlined />} />
      <div style={{ marginLeft: 16, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong>{review.user_name}</Text>
          <Tooltip title={moment(review.created_at).format('YYYY-MM-DD HH:mm:ss')}>
            <Text type="secondary">{moment(review.created_at).fromNow()}</Text>
          </Tooltip>
        </div>
        <Rate disabled value={review.rating} style={{ fontSize: 14, margin: '4px 0' }} />
        <Paragraph style={{ marginBottom: 0 }}>{review.comment}</Paragraph>
      </div>
    </div>
  );
};

// Component hiển thị phân bố rating
const RatingDistribution: React.FC<{
  distribution: { [key: number]: number };
  totalReviews: number;
}> = ({ distribution, totalReviews }) => {
  return (
    <div style={{ marginTop: 16 }}>
      {[5, 4, 3, 2, 1].map(rating => {
        const count = distribution[rating] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ minWidth: 60 }}>{rating} sao</Text>
            <Progress
              percent={percentage}
              size="small"
              style={{ flex: 1, marginLeft: 8, marginRight: 8 }}
              showInfo={false}
            />
            <Text style={{ minWidth: 30 }}>({count})</Text>
          </div>
        );
      })}
    </div>
  );
};

const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: []
  });
  const [fieldData, setFieldData] = useState<FootballField | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review form states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!fieldId) {
        message.error('Không tìm thấy ID sân');
        navigate('/home');
        return;
      }

      setLoading(true);
      try {
        const [pitchData, reviewsData] = await Promise.all([
          apiService.getPitchDetail(fieldId),
          apiService.getPitchReviews(fieldId)
        ]);

        // Cập nhật fieldData với thông tin rating từ reviews
        const updatedFieldData = {
          ...pitchData,
          avg_rating: reviewsData.average_rating,
          total_reviews: reviewsData.total_reviews
        };

        setFieldData(updatedFieldData);
        setReviewStats(reviewsData);
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải thông tin sân bóng');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fieldId, navigate]);

  const handleBookNow = () => {
    if (!fieldId) return;
    navigate(`/booking/${fieldId}`);
  };

  const handleSubmitReview = async () => {
    // Validation
    if (!fieldId) {
      message.error('Không tìm thấy ID sân');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      message.error('Vui lòng chọn số sao đánh giá (1-5 sao)');
      return;
    }

    // Lấy userId từ localStorage hoặc tạo user tạm thời
    const getUserId = () => {
      const session = localStorage.getItem('session');
      if (!session) {
        console.log('No session found in localStorage');
        return null;
      }

      try {
        const sessionData = JSON.parse(session);
        console.log('Parsed session data:', sessionData);

        // Kiểm tra cả user_id và id để tương thích ngược
        return sessionData.user_id || sessionData.id || null;
      } catch (error) {
        console.error('Error parsing session:', error);
        return null;
      }
    };

    const userId = getUserId();
    console.log('Submitting review:', {
      pitch_id: fieldId,
      rating: rating,
      comment: comment.trim() || '',
      user_id: userId
    });

    try {
      setSubmitting(true);

      const result = await apiService.addReview({
        pitch_id: fieldId,
        rating: rating,
        comment: comment.trim() || '',
        user_id: userId
      });

      console.log('Review submitted successfully:', result);

      // Reload reviews data
      const updatedReviewsData = await apiService.getPitchReviews(fieldId);
      setReviewStats(updatedReviewsData);

      // Update field data with new rating
      if (fieldData) {
        setFieldData({
          ...fieldData,
          avg_rating: updatedReviewsData.average_rating,
          total_reviews: updatedReviewsData.total_reviews
        });
      }

      // Reset form
      setRating(0);
      setComment('');

      message.success('Đánh giá đã được thêm thành công!');
    } catch (error: any) {
      console.error('Error submitting review:', error);

      // Hiển thị lỗi chi tiết hơn
      if (error.message.includes('đã đánh giá')) {
        message.warning('Bạn đã đánh giá sân này rồi!');
      } else {
        message.error(`Lỗi: ${error.message || 'Không thể thêm đánh giá'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <Spin size="large" tip="Đang tải thông tin sân bóng..." />
        </div>
      </Layout>
    );
  }

  if (!fieldData) {
    return (
      <Layout style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
          <Title level={3}>Không tìm thấy thông tin sân bóng</Title>
          <Button type="primary" onClick={handleBack}>Quay lại</Button>
        </div>
      </Layout>
    );
  }

  const renderAmenities = () => {
    if (!fieldData.amenities) return null;

    return (
      <Space size="middle" style={{ marginTop: 16 }}>
        {fieldData.amenities.wifi && (
          <Tooltip title="Wifi miễn phí">
            <WifiOutlined style={{ fontSize: 20 }} />
          </Tooltip>
        )}
        {fieldData.amenities.parking && (
          <Tooltip title="Bãi đỗ xe">
            <CarOutlined style={{ fontSize: 20 }} />
          </Tooltip>
        )}
        {fieldData.amenities.drinks && (
          <Tooltip title="Đồ uống">
            <CoffeeOutlined style={{ fontSize: 20 }} />
          </Tooltip>
        )}
        {fieldData.amenities.locker && (
          <Tooltip title="Tủ đồ">
            <LockOutlined style={{ fontSize: 20 }} />
          </Tooltip>
        )}
      </Space>
    );
  };

  return (
    <Layout style={{ background: '#fff', minHeight: '100vh' }}>
      <Header style={{
        background: '#fff',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 64,
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#1890ff', marginRight: 24 }}>
          Football Booking
        </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['home']}
          style={{ flex: 1, borderBottom: 'none' }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/home')}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />}>Đánh giá</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
        </Menu>
        <Space size="middle">
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
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
              <Title level={2}>{fieldData.name}</Title>
              <Space size="middle">
                <Rate
                  disabled
                  value={fieldData.avg_rating || 0}
                  allowHalf
                  character={<StarOutlined />}
                />
                <Text type="secondary">{fieldData.total_reviews} đánh giá</Text>
                <Text><EnvironmentOutlined /> {fieldData.location}</Text>
                {renderAmenities()}
              </Space>
            </Col>

            <Col xs={24} md={16}>
              <Image
                src={fieldData.avatar || 'https://via.placeholder.com/800x400?text=Football+Field'}
                alt={fieldData.name}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  maxHeight: 400,
                  objectFit: 'cover',
                  marginBottom: 24
                }}
                preview={false}
              />

              <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                  <TabPane tab="Thông tin chi tiết" key="1">
                    <Title level={4}>Mô tả</Title>
                    <Paragraph>
                      {fieldData.description || 'Sân bóng đá chất lượng cao với cơ sở vật chất hiện đại.'}
                    </Paragraph>

                    <Title level={4} style={{ marginTop: 24 }}>Thông tin cơ bản</Title>
                    <Descriptions column={2}>
                      <Descriptions.Item label="Loại sân">
                        {fieldData.pitch_type_id === '1' ? 'Sân 5 người' :
                          fieldData.pitch_type_id === '2' ? 'Sân 7 người' :
                            'Sân 11 người'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá thuê trung bình">
                        {fieldData.price_per_hour.toLocaleString()} VND/giờ
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <Badge
                          status={fieldData.status === 'available' ? 'success' : 'error'}
                          text={fieldData.status === 'available' ? 'Có sẵn' : 'Đóng cửa'}
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="Giờ mở cửa">
                        <ClockCircleOutlined /> 06:00 - 23:00
                      </Descriptions.Item>
                    </Descriptions>
                  </TabPane>

                  <TabPane tab={`Đánh giá (${reviewStats.total_reviews})`} key="2">
                    <Card style={{ marginBottom: 24 }}>
                      <Title level={4}>Thêm đánh giá của bạn</Title>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Đánh giá: </Text>
                        <Rate
                          value={rating}
                          onChange={setRating}
                          style={{ marginLeft: 8 }}
                        />
                        {rating > 0 && (
                          <Text style={{ marginLeft: 8, color: '#1890ff' }}>
                            ({rating} sao)
                          </Text>
                        )}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Nhận xét: </Text>
                        <TextArea
                          rows={4}
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}
                          placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..."
                          style={{ marginTop: 8 }}
                        />
                      </div>
                      <Button
                        type="primary"
                        loading={submitting}
                        onClick={handleSubmitReview}
                        icon={<SendOutlined />}
                        disabled={!rating || submitting}
                      >
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                      </Button>
                    </Card>

                    <Divider />

                    <Title level={4}>Đánh giá từ người dùng</Title>
                    {reviewStats.reviews.length > 0 ? (
                      <List
                        dataSource={reviewStats.reviews}
                        renderItem={(review) => (
                          <List.Item key={review.id}>
                            <ReviewItem review={review} />
                          </List.Item>
                        )}
                      />
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
              <Card title="Đặt sân" style={{ marginBottom: 24 }}>
                <Descriptions column={1}>
                  <Descriptions.Item label="Giá thuê trung bình">
                    <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                      {fieldData.price_per_hour.toLocaleString()} VND/giờ
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số điện thoại">
                    {fieldData?.phone || '0123 456 789'}
                  </Descriptions.Item>


                  <Descriptions.Item label="Địa chỉ">
                    <EnvironmentOutlined /> {fieldData.location}
                  </Descriptions.Item>
                </Descriptions>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleBookNow}
                  disabled={fieldData.status !== 'available'}
                  style={{ marginTop: 16 }}
                >
                  {fieldData.status === 'available' ? 'Đặt sân ngay' : 'Sân tạm đóng'}
                </Button>
              </Card>

              <Card title="Thống kê đánh giá">
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Title level={2} style={{ color: '#1890ff', marginBottom: 0 }}>
                    {reviewStats.average_rating.toFixed(1)}
                  </Title>
                  <Rate
                    disabled
                    value={reviewStats.average_rating}
                    allowHalf
                    style={{ fontSize: 16 }}
                  />
                  <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    {reviewStats.total_reviews} đánh giá
                  </Text>
                </div>

                <RatingDistribution
                  distribution={reviewStats.rating_distribution}
                  totalReviews={reviewStats.total_reviews}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default FieldDetailPage;