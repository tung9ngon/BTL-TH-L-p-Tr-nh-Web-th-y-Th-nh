import React from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import {
  GoogleOutlined,
  FacebookFilled,
  AppleFilled,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const SignUp: React.FC = () => {
  // Hàm onFinish gọi API đăng ký
  const onFinish = async (values: any) => {
    try {
      const response = await fetch("http://localhost:2222/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(`Registration failed: ${data.message}`);
        return;
      }

      message.success("Registration successful!");
      console.log("Registration success:", data);
      
      // window.location.href = '/login';
    } catch (error) {
      message.error("Error during registration, please try again.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40 }}>
      {/* Left side content */}
      <div style={{ flex: 1, paddingRight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title level={2} style={{ fontWeight: 'bold' }}>Wellcome back,</Title>
        <Text>Launch your website in seconds. Already have an account?{' '}
          <Link href="/login">Log in here.</Link>
        </Text>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/working-employee-at-home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--on-laptop-work-from-man-businessman-character-pack-people-illustrations-3864094.png"
          alt="Illustration"
          style={{ width: 600, marginTop: 24, maxWidth: '100%' }}
        />
      </div>

      {/* Right side form */}
      <div style={{ flex: 1, maxWidth: 700, margin: 'auto' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Sign up 
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}  
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 8, message: 'At least 8 alphanumeric characters' }]}
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
              Sign up 
            </Button>
          </Form.Item>
        </Form>

       

        
      </div>
    </div>
  );
};

export default SignUp;
