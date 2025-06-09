import React, { useState } from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import {
  GoogleOutlined,
  FacebookFilled,
  AppleFilled,
} from '@ant-design/icons';

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
        const messageText = data.message || 'Đăng ký thất bại';

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

      message.success("Đăng ký thành công!");
      console.log("Đăng ký thành công:", data);
      window.location.href = '/login';

    } catch (error) {
      message.error("Lỗi khi đăng ký, vui lòng thử lại.");
      console.error("Lỗi khi đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', padding: 40, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto' }}>
      {/* Left side content */}
      <div style={{ 
        flex: 1, 
        minWidth: 300,
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        paddingRight: 40,
      }}>
        <Title level={2} style={{ fontWeight: 'bold' }}>Chào mừng bạn,</Title>
        <Text>
          Khởi chạy website của bạn trong vài giây. Đã có tài khoản?{' '}
          <Link href="/login">Đăng nhập ngay.</Link>
        </Text>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/working-employee-at-home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--on-laptop-work-from-man-businessman-character-pack-people-illustrations-3864094.png"
          alt="Illustration"
          style={{ width: '100%', maxWidth: 500, marginTop: 24 }}
        />
      </div>

      {/* Right side form */}
      <div style={{ 
        flex: 1, 
        minWidth: 300,
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng ký (Miễn phí)
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="+84 123456789" />
          </Form.Item>

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

          <Text type="secondary">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <Link href="#">Điều khoản dịch vụ</Link> và{' '}
            <Link href="#">Chính sách bảo mật</Link>.
          </Text>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký (Miễn phí)
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;