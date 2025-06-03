import React from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UploadOutlined, HomeFilled, CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EditProfile = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    message.success('Cập nhật thông tin thành công!');
  };

  const props = {
    name: 'avatar',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Title level={2} style={{ color: '#1890ff' }}>Chỉnh sửa thông tin cá nhân</Title>
      
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
            style={{ borderRadius: '10px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
              </Upload>
              <Text type="secondary" style={{ marginTop: '8px' }}>JPG, PNG tối đa 2MB</Text>
            </div>
          </Card>
        </Col>
        
        <Col span={24} md={16}>
          <Card 
            bordered={false}
            style={{ borderRadius: '10px' }}
          >
            <Form
              form={form}
              name="edit_profile"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>
              
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input prefix={<HomeFilled />} placeholder="Địa chỉ" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditProfile;