// src/pages/RegistrationSuccess.tsx
import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/home');
  };

  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="Success"
        style={{ width: 100, marginBottom: 24 }}
      />

      <Title level={2}>You’ve successfully registered!</Title>

      <Paragraph>
        Thank you for signing up with Football Booking!<br />
        To your registered email address, a confirmation email has been sent.
      </Paragraph>

      <Paragraph>
        To catch the attention of recruiters,<br />
        Let’s start by filling out your profile!
      </Paragraph>

      <div style={{ marginTop: 24 }}>
        <Button type="default" style={{ marginRight: 12 }} onClick={handleClose}>
          Close
        </Button>
        <Button type="primary" href="/profile/setup">
          Enter basic information
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
