import React, { useState } from 'react';
import { Layout, Card, Table, Tag, Typography, Divider, Row, Col } from 'antd';
import { HomeOutlined, CreditCardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import UserMenuLeft from '../component/UserMenuLeft';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const PaymentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const transactionData = [
    {
      key: '1',
      transactionId: '#ES267',
      date: 'Her 1, 2023',
      amount: '100.000 đ',
      quantity: 1,
      status: 'Success',
    },
    {
      key: '2',
      transactionId: '#ESS587',
      date: 'Jan 26, 2023',
      amount: '300.000 đ',
      quantity: 3,
      status: 'Success',
    },
    {
      key: '3',
      transactionId: '#FJ436',
      date: 'Feb 12, 2033',
      amount: '100.000 đ',
      quantity: 1,
      status: 'Success',
    },
    {
      key: '4',
      transactionId: '#FJ877',
      date: 'Feb 12, 2033',
      amount: '500.000 đ',
      quantity: 5,
      status: 'Success',
    },
    {
      key: '5',
      transactionId: '#FJ878',
      date: 'Feb 28, 2033',
      amount: '500.000 đ',
      quantity: 5,
      status: 'Rejected',
    },
    {
      key: '6',
      transactionId: '#FJ6609',
      date: 'March 15, 2033',
      amount: '100.000 đ',
      quantity: 1,
      status: 'Success',
    },
    {
      key: '7',
      transactionId: '#FJ6907',
      date: 'March 18, 2033',
      amount: '100.000 đ',
      quantity: 1,
      status: 'Pending',
    },
  ];

  const columns = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Số phòng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        if (status === 'Success') {
          color = 'green';
        } else if (status === 'Rejected') {
          color = 'red';
        } else if (status === 'Pending') {
          color = 'orange';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <UserMenuLeft 
        collapsed={collapsed} 
        currentPath={location.pathname.split('/')[1] || 'home'} 
      />
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
          <Title level={2} style={{ color: '#1890ff' }}>Trang lịch sử giao dịch</Title>
          
          <Row gutter={16}>
            <Col span={24} md={8}>
              <Card 
                title="HotelBooking" 
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px' }}
                headStyle={{ backgroundColor: '#1890ff', color: 'white' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Text strong><HomeOutlined /> Home</Text>
                  <Text strong style={{ color: '#1890ff' }}><CreditCardOutlined /> Payments</Text>
                  <Text strong><UserOutlined /> Chỉnh sửa thông tin</Text>
                </div>
              </Card>
              
              <Card 
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px' }}
              >
                <Title level={4}>Tổng số tiền đã thanh toán</Title>
                <Text strong style={{ fontSize: '24px', color: '#1890ff' }}>đ1.000.000</Text>
                <Text type="secondary">Từ ngày 2.0.2023</Text>
                
                <Divider />
                
                <Title level={4}>Thanh toán gần đây</Title>
                <Text strong style={{ fontSize: '24px', color: '#1890ff' }}>đ100.00</Text>
                <Text type="secondary">Từ ngày 2.0.2023</Text>
              </Card>
              
              <Card 
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px' }}
              >
                <Title level={4}>Tài khoản ngân hàng đã liên kết</Title>
                <Text strong>ISO2*******4822</Text>
              </Card>
              
              <Card 
                bordered={false}
                style={{ borderRadius: '10px' }}
              >
                <Title level={4}>Cài đặt</Title>
                <Text strong><SettingOutlined /> Log out</Text>
                <br />
                <Text strong>per page</Text>
              </Card>
            </Col>
            
            <Col span={24} md={16}>
              <Card 
                title="Lịch sử giao dịch" 
                bordered={false}
                style={{ borderRadius: '10px' }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Tag color="default">All</Tag>
                  <Tag color="green">Complete</Tag>
                  <Tag color="orange">Reading</Tag>
                  <Tag color="red">Rejected</Tag>
                </div>
                
                <Table 
                  columns={columns} 
                  dataSource={transactionData} 
                  pagination={false}
                  scroll={{ x: true }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PaymentPage;