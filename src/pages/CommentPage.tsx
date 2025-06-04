import React, { useState, useEffect } from 'react';
import { Row, Col, Card, List, Form, Input, Button, Rate, Typography, message, Layout, Menu, Avatar, Badge, Dropdown, Space, Statistic, Spin } from 'antd';
import { UserOutlined, CommentOutlined, HomeOutlined, ReadOutlined, StarFilled, InfoCircleOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

interface Feedback {
  id?: number;
  user_id: string;
  username: string;
  avatar?: string;
  email?: string;
  comment: string;
  rating: number;
  created_at?: string;
}

const CommentPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // API base URL - thay đổi theo server của bạn
  const API_BASE_URL = 'http://localhost:5000/api';

  // Lấy user_id từ localStorage - SỬA LẠI
  const getUserId = () => {
    const session = localStorage.getItem('session');
    if (!session) {
      console.log('No session found in localStorage');
      return null;
    }

    try {
      const sessionData = JSON.parse(session);
      console.log('Parsed session data:', sessionData);

      // Trả về trực tiếp user_id hoặc id
      return sessionData.user_id || sessionData.id || null;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  };

  // Fetch all comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/comments`);
      if (response.data.success) {
        const comments = response.data.comments;
        setFeedbacks(comments);
        setTotalComments(comments.length);
        
        // Tính toán số sao trung bình
        if (comments.length > 0) {
          const totalRating = comments.reduce((sum: number, comment: Feedback) => sum + comment.rating, 0);
          setAverageRating(Number((totalRating / comments.length).toFixed(1)));
        } else {
          setAverageRating(0);
        }
      }
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      message.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  // Submit new comment - SỬA LẠI
  const handleAddFeedback = async (values: any) => {
    setSubmitLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        message.error('Vui lòng đăng nhập để đánh giá');
        return;
      }

      const commentData = {
        user_id: userId, // Gửi trực tiếp userId
        comment: values.comment,
        rating: values.rating
      };

      console.log('Sending comment data:', commentData); // Debug log

      const response = await axios.post(`${API_BASE_URL}/comments`, commentData);
      
      if (response.data.success) {
        message.success('Cảm ơn bạn đã gửi đánh giá!');
        form.resetFields();
        form.setFieldsValue({ rating: 5 });
        await fetchComments(); // Tải lại danh sách comment
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể gửi đánh giá. Vui lòng thử lại!');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Load comments when component mounts
  useEffect(() => {
    fetchComments();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{
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
          defaultSelectedKeys={['reviews']} 
          style={{ flex: 1, borderBottom: 'none' }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/home')}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />} onClick={() => navigate('/comments')}>Đánh giá</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
        </Menu>
        <Space size="middle">
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Dropdown overlay={<div />} trigger={['click']}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </Space>
      </Layout.Header>
      
      <Layout.Content style={{ padding: 24 }}>
        {/* Statistics Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số đánh giá"
                value={totalComments}
                prefix={<CommentOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đánh giá trung bình"
                value={averageRating}
                suffix="/ 5"
                precision={1}
                prefix={<StarFilled />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Xếp hạng sao</div>
                <Rate disabled value={averageRating} allowHalf />
              </div>
            </Card>
          </Col>
          
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card 
              title="💬 Đánh giá của người dùng" 
              bordered={false}
              extra={
                <Button 
                  type="link" 
                  onClick={fetchComments}
                  loading={loading}
                  icon={<CommentOutlined />}
                >
                  Làm mới
                </Button>
              }
            >
              <Spin spinning={loading}>
                {feedbacks.length === 0 && !loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <CommentOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <div>Chưa có đánh giá nào</div>
                  </div>
                ) : (
                  <List
                    itemLayout="vertical"
                    dataSource={feedbacks}
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: false,
                      showQuickJumper: true,
                    }}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <b>{item.username}</b>
                              {item.created_at && (
                                <span style={{ fontSize: 12, color: '#999' }}>
                                  {formatDate(item.created_at)}
                                </span>
                              )}
                            </div>
                          }
                          description={<Rate disabled value={item.rating} />}
                        />
                        <p style={{ marginTop: 8 }}>{item.comment}</p>
                      </List.Item>
                    )}
                  />
                )}
              </Spin>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="📝 Gửi đánh giá của bạn" bordered={false}>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleAddFeedback}
                initialValues={{ rating: 5 }}
              >
                <Form.Item
                  name="comment"
                  label="Đánh giá"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung đánh giá' },
                    { min: 3, message: 'Đánh giá phải có ít nhất 10 ký tự' }
                  ]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Nhập nhận xét của bạn về dịch vụ..." 
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item 
                  name="rating" 
                  label="Chấm điểm"
                  rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                >
                  <Rate />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                    loading={submitLoading}
                    size="large"
                  >
                    Gửi đánh giá
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default CommentPage;