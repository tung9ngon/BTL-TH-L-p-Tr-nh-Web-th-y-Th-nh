import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Modal, Row, Col, Statistic } from 'antd';
import { CheckCircleTwoTone, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Countdown } = Statistic;

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const handleBack = () => {
    window.history.back();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isModalVisible && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isModalVisible, timeLeft]);

  const deadline = Date.now() + timeLeft * 1000;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          borderRadius: 12,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          border: 'none',
          overflow: 'hidden',
        }}
        bordered={false}
        bodyStyle={{ padding: '40px' }}
      >
        <CheckCircleTwoTone 
          twoToneColor="#52c41a" 
          style={{ 
            fontSize: 80,
            marginBottom: 24,
            animation: 'bounce 0.6s',
          }} 
        />
        
        <Title level={3} style={{ marginBottom: 16, color: '#1890ff' }}>
          Đặt sân thành công!
        </Title>

        <div style={{ 
          background: '#f9f9f9', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '24px',
          borderLeft: '4px solid #52c41a'
        }}>
          <Paragraph style={{ marginBottom: 8 }}>
            Cảm ơn bạn đã sử dụng dịch vụ đặt sân của chúng tôi.
            <br />
            Một email xác nhận đã được gửi đến địa chỉ email của bạn.
          </Paragraph>

          <Paragraph style={{ fontWeight: 500 }}>
            Vui lòng chuyển đến trang thanh toán để tiến hành thanh toán sân đã đặt.
          </Paragraph>
        </div>

        <Paragraph style={{ 
          color: '#ff4d4f', 
          background: '#fff2f0',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          ⚠️ Lưu ý: Nếu bạn không thanh toán trong vòng 5 phút, slot của bạn sẽ tự động bị hủy.
        </Paragraph>

        <Space size="large">
          <Button 
            size="large" 
            icon={<ArrowLeftOutlined />}
            style={{
              padding: '0 24px',
              border: '1px solid #d9d9d9'
            }}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button 
            type="primary" 
            size="large"
            style={{
              padding: '0 24px',
              background: '#1890ff',
              border: 'none',
              boxShadow: '0 2px 0 rgba(5, 145, 255, 0.1)'
            }}
            onClick={showModal}
          >
            Thanh toán ngay bằng QR Code
          </Button>
        </Space>
      </Card>

{/* QR Code Modal */}
<Modal
  title="Thanh toán bằng QR Code"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={[
    <Button 
      key="home" 
      onClick={() => navigate('/home')}
      style={{ marginRight: 8 }}
    >
      Quay về trang chủ
    </Button>,
    <Button 
      key="history"
      type="primary" 
      onClick={() => navigate('/payment')}
    >
      Chuyển đến trang lịch sử giao dịch
    </Button>
  ]}
  closeIcon={<CloseOutlined style={{ fontSize: '20px' }} />}
  width={800}
  centered
>
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    <Countdown
      title="Thời gian còn lại"
      value={deadline}
      format="mm:ss"
      valueStyle={{ color: '#ff4d4f', fontSize: 24 }}
    />
    <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
      Hiệu lực mã QR sẽ hết hạn sau 5 phút
    </p>
  </div>

  <Row gutter={24}>
    <Col span={12}>
      <div style={{ 
        padding: '16px', 
        border: '1px solid #d9d9d9', 
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ViettinBank|Do Trung Thanh|1234567890" 
          alt="ViettinBank QR" 
          style={{ width: '100%', maxWidth: '300px' }}
        />
        <div style={{ marginTop: '16px' }}>
          <p><strong>Ngân hàng:</strong> ViettinBank</p>
          <p><strong>Chủ tài khoản:</strong> Đỗ Trung Thành</p>
          <p><strong>Số tài khoản:</strong> 1234567890</p>
        </div>
      </div>
    </Col>
    <Col span={12}>
      <div style={{ 
        padding: '16px', 
        border: '1px solid #d9d9d9', 
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Vietcombank|Nguyen Viet Anh|0987654321" 
          alt="Vietcombank QR" 
          style={{ width: '100%', maxWidth: '300px' }}
        />
        <div style={{ marginTop: '16px' }}>
          <p><strong>Ngân hàng:</strong> Vietcombank</p>
          <p><strong>Chủ tài khoản:</strong> Nguyễn Việt Anh</p>
          <p><strong>Số tài khoản:</strong> 0987654321</p>
        </div>
      </div>
    </Col>
  </Row>

  <div style={{ 
    background: '#fff2f0', 
    padding: '12px', 
    borderRadius: '6px',
    textAlign: 'center'
  }}>
    <p style={{ color: '#ff4d4f', margin: 0 }}>
      ⚠️ Vui lòng thanh toán trong thời gian hiệu lực của mã QR
    </p>
  </div>
</Modal>
      
      {/* Thêm CSS animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-20px);}
            60% {transform: translateY(-10px);}
          }
        `}
      </style>
    </div>
  );
};

export default BookingSuccess;