import React, { useState, useEffect } from 'react';
import { Row, Col, Card, List, Form, Input, Button, Rate, Typography, message, Layout, Menu, Avatar, Badge, Dropdown, Space, Spin } from 'antd';
import { UserOutlined, CommentOutlined, HomeOutlined, ReadOutlined, StarFilled, InfoCircleOutlined, BellOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

interface Feedback {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  rating: number;
  created_at: string;
}

const CommentPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    // Fetch current user data (you might get this from your auth context)
    const fetchUser = async () => {
      try {
        // Replace with your actual user fetching logic
        const user = { id: 1, name: 'Tùng' }; // Example user
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/api/comments');
        setFeedbacks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        message.error('Failed to load comments');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

 const [submitting, setSubmitting] = useState(false);

  const handleAddFeedback = async (values: any) => {
    if (!currentUser) {
      message.error('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/comments', {
        user_id: currentUser.id,
        username: currentUser.name,
        comment: values.comment,
        rating: values.rating
      });

      setFeedbacks([response.data, ...feedbacks]);
      form.resetFields();
      message.success('Gửi đánh giá thành công!');
    } catch (error: any) {
      console.error('Lỗi khi gửi đánh giá:', error);
      message.error(`Gửi đánh giá thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
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
          <Menu.Item key="home" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />}>Đánh giá</Menu.Item>
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
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="💬 Đánh giá của người dùng" bordered={false}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Spin />
                </div>
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={feedbacks}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<UserOutlined />}
                        title={<b>{item.username}</b>}
                        description={
                          <>
                            <Rate disabled defaultValue={item.rating} />
                            <span style={{ marginLeft: 8, color: '#999', fontSize: 12 }}>
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </>
                        }
                      />
                      <p>{item.comment}</p>
                    </List.Item>
                  )}
                />
              )}
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
                {!currentUser && (
                  <Form.Item
                    name="username"
                    label="Tên của bạn"
                    rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn C" />
                  </Form.Item>
                )}

                <Form.Item
                  name="comment"
                  label="Đánh giá"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
                >
                  <Input.TextArea rows={4} placeholder="Nhập nhận xét..." />
                </Form.Item>

                <Form.Item name="rating" label="Chấm điểm" rules={[{ required: true }]}>
                  <Rate />
                </Form.Item>

                <Form.Item>
                   <Button 
    type="primary" 
    htmlType="submit" 
    block
    loading={submitting}
    disabled={submitting}
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