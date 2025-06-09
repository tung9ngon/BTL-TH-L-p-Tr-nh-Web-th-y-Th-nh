import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Input, Typography, message } from 'antd';
import {
  GoogleOutlined,
  FacebookFilled,
  AppleFilled,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;
interface SessionData {
  user_id: string | number;
  username: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login/user", {
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
        form.setFields([
          {
            name: 'email',
            errors: [' '],
          },
          {
            name: 'password',
            errors: [data.message || 'Thông tin đăng nhập không hợp lệ'],
          },
        ]);
        return;
      }

      message.success("Đăng nhập thành công!");
      const sessionData = {
        user_id: data.user.id,
        username: data.user.username,
      };

      localStorage.setItem('session', JSON.stringify(sessionData));

      console.log("Đăng nhập thành công:", data);
      window.location.href = '/home';
    } catch (error) {
      message.error("Lỗi khi đăng nhập, vui lòng thử lại.");
      console.error("Lỗi khi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  const onAdminLogin = async () => {
    try {
      setAdminLoading(true);
      window.location.href = '/admin-login';
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto' }}>
      {/* Left side */}
      <div
        style={{
          flex: 1,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: 40,
        }}
      >
        <Title level={2} style={{ fontWeight: 'bold' }}>
          Chào mừng trở lại,
        </Title>
        <Text>
          Khởi chạy website của bạn trong vài giây. Chưa có tài khoản?{' '}
          <Link href="/signup">Đăng ký ngay.</Link>
        </Text>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/working-employee-at-home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--on-laptop-work-from-man-businessman-character-pack-people-illustrations-3864094.png"
          alt="Illustration"
          style={{ width: '100%', maxWidth: 500, marginTop: 24 }}
        />
      </div>

      {/* Right side - Login Form */}
      <div
        style={{
          flex: 1,
          minWidth: 300,
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng nhập hệ thống
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, min: 8, message: 'Ít nhất 8 ký tự' }]}
          >
            <Input.Password placeholder="Ít nhất 8 ký tự" />
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
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link href="#">Quên mật khẩu?</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <Button 
              type="default" 
              block 
              loading={adminLoading}
              onClick={onAdminLogin}
            >
              Đăng nhập với tư cách Admin
            </Button>
          </Form.Item>
        </Form>
        <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginTop: 16 }}>
          Chưa có tài khoản? <Link href="/signup">Đăng ký ngay</Link>
        </Text>
      </div>
    </div>
  );
};

export default Login;