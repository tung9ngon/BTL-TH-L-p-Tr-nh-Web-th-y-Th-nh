import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, Collapse } from "antd";
import { 
  ThunderboltOutlined, 
  CrownOutlined, 
  TeamOutlined, 
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const ContentPage: React.FC = () => {
  const [activeFaqKey, setActiveFaqKey] = useState<string | string[]>([]);

  const handleBookFieldClick = () => {
    window.location.href = "/login";
  };

  const handleContactClick = () => {
    window.location.href = "/contact";
  };

  const handleFaqChange = (key: string | string[]) => {
    setActiveFaqKey(key);
  };

  const faqData = [
    {
      question: "Cách đặt sân như thế nào?",
      answer: "Bạn có thể đặt sân dễ dàng qua 3 bước: (1) Chọn sân và khung giờ, (2) Điền thông tin cá nhân, (3) Thanh toán và nhận xác nhận qua email.",
      key: "booking"
    },
    {
      question: "Các phương thức thanh toán được chấp nhận?",
      answer: "Chúng tôi chấp nhận nhiều phương thức thanh toán: Thẻ ngân hàng, Ví điện tử (Momo, ZaloPay), Chuyển khoản và Thanh toán trực tiếp tại sân.",
      key: "payment"
    },
    {
      question: "Chính sách hủy đặt sân?",
      answer: "Bạn có thể hủy đặt sân miễn phí trước 24 giờ. Trong vòng 24 giờ trước giờ đá, phí hủy là 20% giá trị đơn đặt sân.",
      key: "cancel"
    },
    {
      question: "Có chương trình khuyến mãi nào không?",
      answer: "Chúng tôi thường xuyên có các chương trình khuyến mãi theo mùa, giảm giá cho nhóm đông người và ưu đãi cho khách hàng thân thiết.",
      key: "promotion"
    }
  ];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://sum.vn/blog/wp-content/uploads/2020/08/17B641E2-0096-4A63-BC8B-C01B99121F1E.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "100px 20px",
        textAlign: "center",
        color: "white"
      }}>
        <Title level={1} style={{ color: "white" }}>NỀN TẢNG ĐẶT SÂN SỐ 1</Title>
        <Paragraph style={{ color: "#f0f0f0", fontSize: 18 }}>Đặt sân bóng nhanh chóng & dễ dàng.</Paragraph>
        <Button 
          type="primary" 
          size="large" 
          style={{ margin: "10px" }}
          onClick={handleBookFieldClick}
        >
          Đặt sân
        </Button>
        <Button 
          size="large"
          onClick={handleContactClick}
        >
          Liên hệ với chúng tôi
        </Button>
      </div>

      {/* Quick Features Section */}
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Title level={2} style={{ marginBottom: 40 }}>TẠI SAO CHỌN CHÚNG TÔI</Title>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              style={{ borderRadius: 12, padding: 20, height: '100%' }}
              cover={
                <div style={{ fontSize: 48, color: '#1890ff', margin: '20px 0' }}>
                  <ThunderboltOutlined />
                </div>
              }
            >
              <Title level={4}>ĐẶT SÂN NHANH CHÓNG</Title>
              <Paragraph>
                Hệ thống đặt sân tự động 24/7, chỉ với 3 bước đơn giản bạn đã có thể sở hữu sân bóng yêu thích
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              style={{ borderRadius: 12, padding: 20, height: '100%' }}
              cover={
                <div style={{ fontSize: 48, color: '#1890ff', margin: '20px 0' }}>
                  <CrownOutlined />
                </div>
              }
            >
              <Title level={4}>SÂN BÓNG HIỆN ĐẠI</Title>
              <Paragraph>
                Hệ thống sân bóng đạt tiêu chuẩn quốc tế với mặt cỏ nhân tạo chất lượng cao, hệ thống chiếu sáng hiện đại
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              style={{ borderRadius: 12, padding: 20, height: '100%' }}
              cover={
                <div style={{ fontSize: 48, color: '#1890ff', margin: '20px 0' }}>
                  <TeamOutlined />
                </div>
              }
            >
              <Title level={4}>CỘNG ĐỒNG YÊU BÓNG ĐÁ</Title>
              <Paragraph>
                Kết nối với hàng ngàn người yêu bóng đá, tạo đội và tham gia các giải đấu thường xuyên
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Video Section */}
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px", 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://png.pngtree.com/background/20250115/original/pngtree-soccer-field-on-background-and-ball-the-left-side-picture-image_15583260.jpg')", 
        backgroundSize: "cover", 
        color: "white" 
      }}>
        <Title level={2} style={{ color: "white" }}>WESPORT INTRO</Title>
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
        }}>
          <video 
            controls 
            style={{ width: "100%", display: "block" }}
            poster="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Stats/Info Section - Thay thế phần Đối tác */}
      <div style={{ padding: "60px 20px", textAlign: "center", backgroundColor: "#f0f9ff" }}>
        <Title level={2}>WESPORT TRONG NHỮNG CON SỐ</Title>
        <Paragraph style={{ maxWidth: 800, margin: "0 auto 30px" }}>
          Chúng tôi tự hào là nền tảng đặt sân thể thao hàng đầu với những thành tích ấn tượng
        </Paragraph>
        <Row gutter={[32, 32]} justify="center" style={{ marginBottom: 30 }}>
          <Col xs={12} sm={6}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>500+</div>
            <div>Sân bóng</div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>50K+</div>
            <div>Người dùng</div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>100K+</div>
            <div>Lượt đặt sân</div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>20+</div>
            <div>Thành phố</div>
          </Col>
        </Row>
      </div>

      {/* FAQ Section - Phiên bản cải tiến */}
      <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: 1000, margin: "0 auto" }}>
        <Title level={2}>CÂU HỎI THƯỜNG GẶP</Title>
        <Paragraph style={{ marginBottom: 40 }}>
          Tìm câu trả lời cho những thắc mắc phổ biến của bạn
        </Paragraph>
        
        <Collapse 
          accordion 
          bordered={false} 
          activeKey={activeFaqKey}
          onChange={handleFaqChange}
          expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
          style={{ background: 'none' }}
        >
          {faqData.map((item) => (
            <Panel 
              header={
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {item.question}
                </div>
              } 
              key={item.key}
              style={{
                marginBottom: 16,
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                overflow: 'hidden'
              }}
            >
              <Paragraph style={{ paddingLeft: 24 }}>{item.answer}</Paragraph>
            </Panel>
          ))}
        </Collapse>
      </div>

      {/* Footer */}
      <div style={{ background: "#001529", padding: "60px 20px 30px", color: "white" }}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: "white" }}>DỊCH VỤ</Title>
            <Paragraph style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              <div style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => window.location.href = "/booking"}>Đặt Sân</div>
              <div style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => window.location.href = "/equipment"}>Đồ Dùng Thể Thao</div>
              <div style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => window.location.href = "/tournament"}>Giải Đấu</div>
            </Paragraph>
          </Col>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: "white" }}>LIÊN HỆ</Title>
            <Paragraph style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              <div style={{ marginBottom: 8 }}><PhoneOutlined style={{ marginRight: 8 }} /> 0123 456 789</div>
              <div style={{ marginBottom: 8 }}><MailOutlined style={{ marginRight: 8 }} /> info@wesport.vn</div>
              <div style={{ marginBottom: 8 }}>Giờ làm việc: 8:00 - 22:00 hàng ngày</div>
            </Paragraph>
          </Col>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: "white" }}>THEO DÕI CHÚNG TÔI</Title>
            <div style={{ fontSize: 24 }}>
              <FacebookOutlined style={{ marginRight: 16, cursor: "pointer" }} onClick={() => window.open('https://facebook.com')} />
              <InstagramOutlined style={{ marginRight: 16, cursor: "pointer" }} onClick={() => window.open('https://instagram.com')} />
              <YoutubeOutlined style={{ cursor: "pointer" }} onClick={() => window.open('https://youtube.com')} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContentPage;