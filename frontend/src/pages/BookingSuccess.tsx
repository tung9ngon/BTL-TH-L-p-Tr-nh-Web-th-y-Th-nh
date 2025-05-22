import React from 'react';
import { Button, Card, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const BookingSuccess: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 8,
        }}
        bordered={false}
      >
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
        <Title level={2} style={{ marginTop: 16 }}>
          Bạn đã đặt sân thành công!
        </Title>

        <Paragraph>
          Cảm ơn bạn đã sử dụng dịch vụ đặt sân của chúng tôi.
          <br />
          Một email xác nhận đã được gửi đến địa chỉ email của bạn.
        </Paragraph>

        <Paragraph>
          Để giúp đội bóng có trải nghiệm tốt hơn, bạn có thể điền thêm các thông tin cần thiết như:
        </Paragraph>

        <ul style={{ textAlign: 'left', paddingLeft: 40, marginBottom: 24 }}>
          <li>Tên đội bóng</li>
          <li>Số lượng người chơi</li>
          <li>Liên hệ người đại diện</li>
        </ul>

        <Button type="primary" size="large">
          Điền thông tin đội bóng
        </Button>
      </Card>
    </div>
  );
};

export default BookingSuccess;
