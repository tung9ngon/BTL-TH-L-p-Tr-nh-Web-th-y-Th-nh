import React from "react";
import { 
  Button, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Divider,
  message 
} from "antd";
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div style={{ 
      maxWidth: 800,  // Giảm maxWidth để phù hợp với 1 cột
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      {/* Back Button */}
      <div style={{ textAlign: 'left' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
      </div>

      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2} style={{ color: '#1890ff' }}>LIÊN HỆ VỚI CHÚNG TÔI</Title>
        <Text type="secondary">
          Mọi thắc mắc, góp ý hoặc yêu cầu hỗ trợ, vui lòng liên hệ trực tiếp với chúng tôi
        </Text>
      </div>

      <Row justify="center">
        {/* Contact Info - Chỉ còn 1 cột duy nhất được căn giữa */}
        <Col xs={24} md={18} lg={16}>
          <Card 
            title="Thông tin liên hệ" 
            bordered={false}
            style={{ 
              borderRadius: 8, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              width: '100%'
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <EnvironmentOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Text strong>Địa chỉ công ty</Text><br />
                  <Text type="secondary">Làng sinh viên Hacinco cổng số 3</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <PhoneOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Text strong>Điện thoại</Text><br />
                  <Text type="secondary">0123 456 789 (Hotline)</Text><br />
                  <Text type="secondary">0987 654 321 (Hỗ trợ kỹ thuật)</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <MailOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Text strong>Email</Text><br />
                  <Text type="secondary">info@wesport.vn</Text><br />
                  <Text type="secondary">support@wesport.vn</Text>
                </div>
              </div>
            </div>

            <Divider>Giờ làm việc</Divider>
            
            <div style={{ marginBottom: 24 }}>
              <Row gutter={16} justify="center">
                <Col span={12}>
                  <Text strong>Thứ 2 - Thứ 6</Text><br />
                  <Text type="secondary">8:00 - 18:00</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Thứ 7 - Chủ nhật</Text><br />
                  <Text type="secondary">8:00 - 12:00</Text>
                </Col>
              </Row>
            </div>

            <Divider>Theo dõi chúng tôi</Divider>
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="text" 
                icon={<FacebookOutlined style={{ fontSize: 24, color: '#4267B2' }} />} 
                onClick={() => window.open('https://facebook.com')}
              />
              <Button 
                type="text" 
                icon={<InstagramOutlined style={{ fontSize: 24, color: '#E1306C' }} />} 
                onClick={() => window.open('https://instagram.com')}
              />
              <Button 
                type="text" 
                icon={<YoutubeOutlined style={{ fontSize: 24, color: '#FF0000' }} />} 
                onClick={() => window.open('https://youtube.com')}
              />
            </div>
          </Card>

          {/* Map Embed */}
          <div style={{ marginTop: 24, borderRadius: 8, overflow: 'hidden' }}>
            <iframe 
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.766724035268!2d105.8004971750307!3d21.001986080640695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adaeaf39a90b%3A0x5d5081341b654b7b!2zTMOgbmcgc2luaCB2acOqbiBIYWNpbmNvIC0gY-G7lW5nIHPhu5EgMw!5e0!3m2!1svi!2s!4v1748598887260!5m2!1svi!2s"
              width="100%" 
              height="300" 
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;