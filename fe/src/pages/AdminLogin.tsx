import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Card } from 'antd';
import { message } from 'antd';

const { Title, Link } = Typography;

const AdminLogin: React.FC = () => {
  const onFinish = async (values: any) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login/owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.error(`Login failed: ${data.message || 'Unknown error'}`);
      return;
    }

    message.success("Login successful!");
    console.log("Login success:", data);
    // Ví dụ redirect sau login thành công:
    // window.location.href = '/dashboard';
    window.location.href = '/home';

  } catch (error) {
    message.error("Error during login, please try again.");
    console.error("Error during login:", error);
  }
};

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: `url('https://thumbs.dreamstime.com/b/landscape-nature-view-background-view-window-landscape-nature-view-background-view-window-wonderful-landscape-121459679.jpg') no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 50px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          borderRadius: 12,
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ padding: 32 }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 30 }}>
            Administrator Login
          </Title>

          <Form
            name="admin_login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input placeholder="example@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                {
                  min: 8,
                  pattern: /^[a-zA-Z0-9]*$/,
                  message: 'Alphanumeric characters of 8 or more',
                },
              ]}
            >
              <Input.Password placeholder="Alphanumeric characters of 8 or more" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link href="#">Forgot password?</Link>
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: '#1E2A4A', borderColor: '#1E2A4A' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
