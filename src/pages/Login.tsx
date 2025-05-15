import React from 'react';
import { Button, Checkbox, Divider, Form, Input, Typography } from 'antd';
import {
  GoogleOutlined,
  FacebookFilled,
  AppleFilled,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40, flexWrap: 'wrap' }}>
      {/* Left side */}
      <div
        style={{
          flex: 1,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: 20,
        }}
      >
        <Title level={2} style={{ fontWeight: 'bold' }}>
          Wellcome back,
        </Title>
        <Text>
          Launch your website in seconds. Don’t have an account?{' '}
          <Link href="/signup">Sign up.</Link>
        </Text>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/working-employee-at-home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--on-laptop-work-from-man-businessman-character-pack-people-illustrations-3864094.png"
          alt="Illustration"
          style={{ width: 500, maxWidth: '100%', marginTop: 24 }}
        />
      </div>

      {/* Right side - Login Form */}
      <div
        style={{
          flex: 1,
          minWidth: 300,
          maxWidth: 500,
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Login for Internships
        </Title>

        <Form
          layout="vertical"
          onFinish={(values) => console.log('Login submitted:', values)}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, min: 8, message: 'At least 8 alphanumeric characters' },
            ]}
          >
            <Input.Password placeholder="At least 8 alphanumeric characters" />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link href="#">Forgot Password?</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          Don’t have an account? <Link href="/signup">Sign up</Link>
        </Text>

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

export default Login;
