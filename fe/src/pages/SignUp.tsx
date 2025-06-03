import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';


const { Title, Text, Link } = Typography;

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const messageText = data.message || 'Registration failed';
        const errorFields = [];

        if (messageText.toLowerCase().includes("email")) {
          errorFields.push({ name: 'email', errors: [messageText] });
        } else if (messageText.toLowerCase().includes("phone")) {
          errorFields.push({ name: 'phone', errors: [messageText] });
        } else {
          errorFields.push({ name: 'password', errors: [messageText] });
        }

        form.setFields(errorFields);
        return;
      }

      message.success("Registration successful!");
      console.log("Registration success:", data);
      window.location.href = '/login';

    } catch (error) {
      message.error("Error during registration, please try again.");
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40 }}>
      {/* Left side content */}
      <div style={{ flex: 1, paddingRight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title level={2} style={{ fontWeight: 'bold' }}>Welcome back,</Title>
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

      {/* Right side form */}
      <div style={{ flex: 1, maxWidth: 700, margin: 'auto' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Sign up (Free)
        </Title>

        <Form
          form={form}
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
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="0123456789" />
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
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign up (Free)
            </Button>
          </Form.Item>
        </Form>

        
      </div>
    </div>
  );
};

export default SignUp;
