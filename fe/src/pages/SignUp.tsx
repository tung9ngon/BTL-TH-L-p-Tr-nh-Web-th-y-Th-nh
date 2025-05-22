import React from 'react';
import { Button, Form, Input, Typography, Divider } from 'antd';
import {
  GoogleOutlined,
  FacebookFilled,
  AppleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // Xử lý khi form submit thành công
  const handleFinish = (values: any) => {
    console.log('Submitted:', values);

    // Giả lập delay hoặc gọi API -> Sau đó điều hướng
    setTimeout(() => {
      navigate('/success');
    }, 1000); // giả lập xử lý async
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40 }}>
      {/* Left content */}
      <div
        style={{
          flex: 1,
          paddingRight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Title level={2} style={{ fontWeight: 'bold' }}>
          Welcome back,
        </Title>
        <Text>
          Launch your website in seconds. Already have an account?{' '}
          <Link href="/login">Log in here.</Link>
        </Text>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/working-employee-at-home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--on-laptop-work-from-man-businessman-character-pack-people-illustrations-3864094.png"
          alt="Illustration"
          style={{ width: 600, marginTop: 24, maxWidth: '100%' }}
        />
      </div>

      {/* Right form */}
      <div style={{ flex: 1, maxWidth: 700, margin: 'auto' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Sign up (Free)
        </Title>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 8,
                message: 'At least 8 alphanumeric characters',
              },
            ]}
          >
            <Input.Password placeholder="At least 8 alphanumeric characters" />
          </Form.Item>

          <Text type="secondary">
            By signing up, you agree to the{' '}
            <Link href="#">Terms of Service</Link> and{' '}
            <Link href="#">Privacy Policy</Link>.
          </Text>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block>
              Sign up (Free)
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or continue with</Divider>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Button icon={<GoogleOutlined />} shape="circle" />
          <Button icon={<FacebookFilled />} shape="circle" />
          <Button icon={<AppleFilled />} shape="circle" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
