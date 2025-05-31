import React, { useState } from 'react';
import { Layout, Card, Table, Tag, Typography, Divider, Row, Col, Button } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import UserMenuLeft from '../component/UserMenuLeft';

const { Title, Text } = Typography;
const { Content } = Layout;

type PaymentStatus = 'all' | 'completed' | 'pending' | 'rejected';

const PaymentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<PaymentStatus>('all');
  const location = useLocation();
  const navigate = useNavigate();

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

  const filteredData = transactionData.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return item.status === 'Success';
    if (activeTab === 'pending') return item.status === 'Pending';
    if (activeTab === 'rejected') return item.status === 'Rejected';
    return true;
  });

  const totalPaid = transactionData
    .filter(item => item.status === 'Success')
    .reduce((sum, item) => sum + parseInt(item.amount.replace(/[^\d]/g, ''), 0), 0);

  const recentPayment = transactionData
    .filter(item => item.status === 'Success')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

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
      />
      
      <Layout style={{ paddingLeft: collapsed ? 80 : 0 }}>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 24 }}>
            <CreditCardOutlined /> Lịch sử thanh toán
          </Title>
          
          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Card 
                title="Thống kê thanh toán" 
                bordered={false}
                style={{ marginBottom: 20, borderRadius: 8 }}
                headStyle={{ backgroundColor: '#f0f0f0' }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tổng số tiền đã thanh toán</Text>
                  <Title level={3} style={{ color: '#1890ff', marginTop: 8 }}>
                    {totalPaid.toLocaleString()} đ
                  </Title>
                  <Text type="secondary">Từ ngày 02/2023</Text>
                </div>
                
                <Divider />
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Thanh toán gần đây</Text>
                  <Title level={3} style={{ color: '#1890ff', marginTop: 8 }}>
                    {recentPayment ? recentPayment.amount : '0 đ'}
                  </Title>
                  <Text type="secondary">
                    {recentPayment ? `Ngày ${recentPayment.date}` : 'Chưa có giao dịch'}
                  </Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text strong>Tài khoản ngân hàng đã liên kết</Text>
                  <Text style={{ display: 'block', marginTop: 8 }}>ISO2*******4822</Text>
                </div>
              </Card>
            </Col>
            
            <Col span={24} md={16}>
              <Card 
                bordered={false}
                style={{ borderRadius: 8 }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Button 
                      type={activeTab === 'all' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('all')}
                      style={{ marginRight: 8 }}
                    >
                      Tất cả
                    </Button>
                    <Button 
                      type={activeTab === 'completed' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('completed')}
                      style={{ marginRight: 8 }}
                    >
                      Đã thanh toán
                    </Button>
                    <Button 
                      type={activeTab === 'pending' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('pending')}
                      style={{ marginRight: 8 }}
                    >
                      Chưa thanh toán
                    </Button>
                    <Button 
                      type={activeTab === 'rejected' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('rejected')}
                    >
                      Đã hủy
                    </Button>
                  </div>
                  
                  <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PaymentPage;