import React from "react";
import { Row, Col, Card, Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

const ContentPage: React.FC = () => {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1607083206963-4fbd3c399b80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "100px 20px",
        textAlign: "center",
        color: "white"
      }}>
        <Title level={1} style={{ color: "white" }}>NỀN TẢNG ĐẶT SÂN SỐ 1</Title>
        <Paragraph style={{ color: "#f0f0f0", fontSize: 18 }}>Đặt sân bóng nhanh chóng & dễ dàng.</Paragraph>
        <Button type="primary" size="large" style={{ margin: "10px" }}>Đặt sân</Button>
        <Button size="large">Liên hệ với chúng tôi</Button>
      </div>

      {/* Quick Features Section */}
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <img src="https://images.unsplash.com/photo-1607083206963-4fbd3c399b80?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60" alt="Fast booking" style={{ width: "100%", borderRadius: 8 }} />
            <Paragraph strong>ĐẶT SÂN NHANH CHÓNG</Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <img src="https://images.unsplash.com/photo-1608062148290-74e477948ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60" alt="Modern field" style={{ width: "100%", borderRadius: 8 }} />
            <Paragraph strong>SÂN BÓNG HIỆN ĐẠI</Paragraph>
          </Col>
        </Row>
      </div>

      {/* Video Section */}
      <div style={{ textAlign: "center", background: "#000", padding: "60px 20px" }}>
        <Title style={{ color: "white" }} level={2}>WESPORT INTRO</Title>
        <video controls style={{ width: "100%", maxWidth: "720px", borderRadius: 8 }}>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Partner Section */}
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Title level={3}>ĐỐI TÁC CỦA CHÚNG</Title>
        <Paragraph style={{ maxWidth: 600, margin: "0 auto" }}>
          Dù bạn là chủ sân, cộng đồng thể thao hoặc là thương hiệu, hãy trở thành đối tác của chúng tôi để nhận được nhiều lợi ích.
        </Paragraph>
      </div>

      {/* Footer */}
      <div style={{ background: "#f0f2f5", padding: "40px 20px", textAlign: "center" }}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={6}><strong>DỊCH VỤ</strong><br />Đặt Sân<br />Đồ Dùng Trong Sân</Col>
          <Col xs={24} md={6}><strong>LIÊN HỆ</strong><br />Email<br />Contact</Col>
        </Row>
      </div>
    </div>
  );
};

export default ContentPage;