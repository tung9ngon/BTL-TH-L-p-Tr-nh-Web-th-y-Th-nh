import React, { useState } from 'react';
import { Row, Col, Card, List, Form, Input, Button, Rate, Typography, message, Layout, Menu, Avatar, Badge, Dropdown, Space } from 'antd';
import { UserOutlined, CommentOutlined, HomeOutlined, ReadOutlined, StarFilled, InfoCircleOutlined, BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Feedback {
  username: string;
  comment: string;
  rating: number;
}

const initialFeedbacks: Feedback[] = [
  {
    username: 'Nguyen Van A',
    comment: 'Giao diện đẹp và dễ sử dụng!',
    rating: 5,
  },
  {
    username: 'Tran Thi B',
    comment: 'Tốc độ tải trang hơi chậm.',
    rating: 3,
  },
];

const CommentPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [form] = Form.useForm();

  const handleAddFeedback = (values: Feedback) => {
    setFeedbacks([values, ...feedbacks]);
    form.resetFields();
    message.success('Cảm ơn bạn đã gửi đánh giá!');
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
          defaultSelectedKeys={['home']} 
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
            <List
              itemLayout="vertical"
              dataSource={feedbacks}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined />}
                    title={<b>{item.username}</b>}
                    description={<Rate disabled defaultValue={item.rating} />}
                  />
                  <p>{item.comment}</p>
                </List.Item>
              )}
            />
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
                name="username"
                label="Tên của bạn"
                rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn C" />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Đánh giá"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập nhận xét..." />
              </Form.Item>

              <Form.Item name="rating" label="Chấm điểm">
                <Rate />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
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
