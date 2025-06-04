import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Tag, Typography, Divider, Row, Col, Button, message, Spin } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserMenuLeft from '../component/UserMenuLeft';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

type PaymentStatus = 'completed' | 'pending' ;

// API endpoints
const API_BASE_URL = 'http://localhost:5000/api'; // Thay bằng URL thực tế của bạn
const BOOKINGS_API = `http://localhost:5000/api/bookings/user/bookings`;

// Format tiền tệ VND
const formatCurrency = (amount: number | null) => {
  if (!amount) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

// Format ngày tháng
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format thời gian
const formatTime = (timeString: string) => {
  const time = new Date(`1970-01-01T${timeString}`);
  return time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const PaymentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<PaymentStatus | 'all'>('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy user_id từ localStorage session
  const getUserId = () => {
    const session = localStorage.getItem('session');
    if (!session) {
      console.log('No session found in localStorage');
      return null;
    }

    try {
      const sessionData = JSON.parse(session);
      console.log('Parsed session data:', sessionData);

      // Kiểm tra cả user_id và id để tương thích ngược
      return sessionData.user_id || sessionData.id || null;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để xem lịch sử thanh toán');

      return;
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true);

        // Gọi API để lấy danh sách booking của user
        const response = await axios.post(BOOKINGS_API, {
          user_type: 'user',
          user_id: userId
        });
        console.log('API Response:', response.data);

        // Transform data để phù hợp với frontend
        const transformedData = response.data.map((booking: any) => ({
          key: booking.id.toString(),
          transactionId: `#BK${booking.id}`,
          date: formatDate(booking.booking_date),
          amount: formatCurrency(booking.total_price),
          quantity: 1,
          status: booking.status,
          paymentStatus: booking.payment_status,
          pitchName: booking.pitch_name,
          timeSlot: `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`,
          location: booking.location,
          rawAmount: booking.total_price || 0,
          bookingDate: booking.booking_date,
          created_at: booking.created_at,
          payment_date: booking.payment_date
        }));

        setBookings(transformedData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        message.error('Lỗi khi tải dữ liệu đặt sân');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId, navigate]);

  const filteredData = bookings.filter((item: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return item.paymentStatus === 'completed';
    if (activeTab === 'pending') return item.paymentStatus === 'pending';
    if (activeTab === 'cancelled') return item.status === 'cancelled';
    return true;
  });

  // Tính tổng tiền đã thanh toán (chỉ các giao dịch completed)
  const totalPaid = bookings
    .filter((item: any) => item.paymentStatus === 'completed')
    .reduce((sum: number, item: any) => sum + (item.rawAmount || 0), 0);

  const columns = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date: string | null) => date ? formatDate(date) : 'Chưa thanh toán'
    },
    {
      title: 'Ngày sử dụng',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tên sân',
      dataIndex: 'pitchName',
      key: 'pitchName',
    },
    {
      title: 'Khung giờ',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => {
        let color = '';
        let text = '';

        if (record.status === 'cancelled') {
          color = 'red';
          text = 'Đã hủy';
        } else if (record.paymentStatus === 'completed') {
          color = 'green';
          text = 'Đã thanh toán';
        } else {
          color = 'orange';
          text = 'Chờ thanh toán';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/bookings/${bookingId}/cancel`, {
        user_type: 'user',
        user_id: userId
      });

      if (response.data.message === 'Booking cancelled successfully') {
        message.success('Hủy đặt sân thành công');
        // Refresh danh sách booking
        const updatedBookings = bookings.map(booking =>
          booking.key === bookingId ? { ...booking, status: 'cancelled' } : booking
        );
        setBookings(updatedBookings);
      } else {
        message.error('Hủy đặt sân không thành công');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      message.error('Lỗi khi hủy đặt sân');
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <UserMenuLeft collapsed={collapsed} />
        <Layout style={{ paddingLeft: collapsed ? 80 : 0 }}>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <p>Đang tải dữ liệu...</p>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <UserMenuLeft collapsed={collapsed} />

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
                    {formatCurrency(totalPaid)}
                  </Title>
                  <Text type="secondary">Tổng cộng từ trước đến nay</Text>
                </div>

                <Divider />

                <div>
                  <Text strong>Tổng số đặt sân</Text>
                  <Text style={{ display: 'block', marginTop: 8 }}>
                    {bookings.length} đặt sân
                  </Text>
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
                      Tất cả ({bookings.length})
                    </Button>
                    <Button
                      type={activeTab === 'completed' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('completed')}
                      style={{ marginRight: 8 }}
                    >
                      Đã thanh toán ({bookings.filter((item: any) => item.paymentStatus === 'completed').length})
                    </Button>
                    <Button
                      type={activeTab === 'pending' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('pending')}
                      style={{ marginRight: 8 }}
                    >
                      Chưa thanh toán ({bookings.filter((item: any) => item.paymentStatus === 'pending').length})
                    </Button>
                   
                  </div>

                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} giao dịch`
                    }}
                    scroll={{ x: true }}
                    locale={{
                      emptyText: activeTab === 'all'
                        ? 'Chưa có giao dịch nào'
                        : `Không có giao dịch ${activeTab === 'completed' ? 'đã thanh toán' :
                          activeTab === 'pending' ? 'chưa thanh toán' : 'đã hủy'}`
                    }}
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