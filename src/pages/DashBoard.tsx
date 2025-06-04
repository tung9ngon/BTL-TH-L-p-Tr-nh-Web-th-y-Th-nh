import React, { useState, useEffect } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Layout,
  Space,
  Tag,
  Table,
  Progress,
  Divider,
  Badge,
  Avatar,
  List,
  Spin,
  message
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  StarOutlined,
  TeamOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface BookingType {
  id: string;
  user_name: string;
  pitch_name: string;
  formatted_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  location: string;
  booking_time: string;
}

interface DashboardData {
  overview: {
    total_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    pending_bookings: number;
    total_revenue: number;
    pending_revenue: number;
    gross_revenue: number;
    total_pitches: number;
    available_pitches: number;
    maintenance_pitches: number;
  };
  period_stats: {
    today: { bookings: number; revenue: number };
    week: { bookings: number; revenue: number };
    month: { bookings: number; revenue: number };
  };
  recent_bookings: BookingType[];
  top_revenue_pitches: any[];
  monthly_revenue: any[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Lấy owner_id từ localStorage (hoặc có thể từ context/redux)
  const getOwnerId = () => {
  const session = JSON.parse(sessionStorage.getItem('owner_session') || '{}');
  return session.owner_id; // ✅ Lấy từ session đã lưu
};

  // API call để lấy dữ liệu dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/owner/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: getOwnerId(),
          user_type: 'owner'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.data) {
        setDashboardData(result.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Tính toán các metrics
  const getCompletionRate = () => {
    if (!dashboardData?.overview) return 0;
    const { total_bookings, cancelled_bookings } = dashboardData.overview;
    if (total_bookings === 0) return 0;
    return ((total_bookings - cancelled_bookings) / total_bookings) * 100;
  };

  const getCancellationRate = () => {
    if (!dashboardData?.overview) return 0;
    const { total_bookings, cancelled_bookings } = dashboardData.overview;
    if (total_bookings === 0) return 0;
    return (cancelled_bookings / total_bookings) * 100;
  };

  // Format số tiền VND
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  // Format trạng thái booking
  const getStatusTag = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      'confirmed': { color: 'green', text: 'Đã xác nhận' },
      'pending': { color: 'orange', text: 'Chờ xác nhận' },
      'cancelled': { color: 'red', text: 'Đã hủy' },
      'completed': { color: 'blue', text: 'Hoàn thành' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // Cột cho bảng đặt sân
  const bookingColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Sân',
      dataIndex: 'pitch_name',
      key: 'pitch_name',
      render: (name: string, record: BookingType) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.location}
          </Text>
        </div>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'formatted_date',
      key: 'formatted_date',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (record: BookingType) => (
        `${record.start_time} - ${record.end_time}`
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'Số tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (amount: number) => (
        <Text strong>{formatCurrency(amount)}</Text>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} style={{ background: "#fff" }}>
          <MenuLeft />
        </Sider>
        <Layout>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <Spin 
              size="large" 
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        </Layout>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} style={{ background: "#fff" }}>
          <MenuLeft />
        </Sider>
        <Layout>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
          }}>
            <Text type="danger" style={{ fontSize: '18px', marginBottom: '16px' }}>
              Không thể tải dữ liệu dashboard
            </Text>
            <button onClick={fetchDashboardData} style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: '1px solid #1890ff',
              backgroundColor: '#1890ff',
              color: 'white',
              cursor: 'pointer'
            }}>
              Thử lại
            </button>
          </div>
        </Layout>
      </Layout>
    );
  }

  const { overview, period_stats, recent_bookings, top_revenue_pitches } = dashboardData;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Header style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>Dashboard Quản Lý Sân</Title>
            <button 
              onClick={fetchDashboardData}
              style={{ 
                padding: '6px 12px', 
                borderRadius: '4px', 
                border: '1px solid #d9d9d9',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              Làm mới
            </button>
          </div>
        </Header>
        <Content>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            
            {/* Thống kê chính */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng số booking"
                    value={overview.total_bookings}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Progress 
                    percent={100} 
                    showInfo={false} 
                    strokeColor="#1890ff"
                    trailColor="#f0f0f0"
                  />
                  <Text type="secondary">
                    Hôm nay: {period_stats.today.bookings} booking
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Booking đã hủy"
                    value={overview.cancelled_bookings}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                  <Progress 
                    percent={getCancellationRate()} 
                    showInfo={false} 
                    strokeColor="#f5222d"
                    trailColor="#f0f0f0"
                  />
                  <Text type="secondary">
                    Chiếm {getCancellationRate().toFixed(1)}% tổng số
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Booking chờ xác nhận"
                    value={overview.pending_bookings}
                    prefix={<FieldTimeOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <Progress 
                    percent={100} 
                    showInfo={false} 
                    strokeColor="#faad14"
                    trailColor="#f0f0f0"
                  />
                  <Text type="secondary">
                    Cần xử lý sớm
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng doanh thu"
                    value={overview.total_revenue}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    formatter={(value) => `${value.toLocaleString()} VND`}
                  />
                  <Progress 
                    percent={100} 
                    showInfo={false} 
                    strokeColor="#52c41a"
                    trailColor="#f0f0f0"
                  />
                  <Text type="secondary">
                    Tháng này: {formatCurrency(period_stats.month.revenue)}
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Thống kê theo thời gian */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Card title="Hôm nay" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Booking" 
                        value={period_stats.today.bookings}
                        valueStyle={{ fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Doanh thu" 
                        value={period_stats.today.revenue}
                        formatter={(value) => `${value.toLocaleString()}`}
                        suffix="VND"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card title="Tuần này" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Booking" 
                        value={period_stats.week.bookings}
                        valueStyle={{ fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Doanh thu" 
                        value={period_stats.week.revenue}
                        formatter={(value) => `${value.toLocaleString()}`}
                        suffix="VND"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card title="Tháng này" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Booking" 
                        value={period_stats.month.bookings}
                        valueStyle={{ fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Doanh thu" 
                        value={period_stats.month.revenue}
                        formatter={(value) => `${value.toLocaleString()}`}
                        suffix="VND"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Thống kê tỷ lệ */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Card title="Tỷ lệ thành công">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Progress 
                      percent={getCompletionRate()} 
                      status="active" 
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                    <Row justify="space-between">
                      <Col>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          Thành công: {overview.confirmed_bookings}
                        </Tag>
                      </Col>
                      <Col>
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          Đã hủy: {overview.cancelled_bookings}
                        </Tag>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Thông tin sân">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic 
                        title="Tổng sân" 
                        value={overview.total_pitches}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="Đang hoạt động" 
                        value={overview.available_pitches}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="Bảo trì" 
                        value={overview.maintenance_pitches}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* Đặt sân gần đây */}
            <Card 
              title={
                <Space>
                  <FieldTimeOutlined />
                  <Text strong>Booking gần đây</Text>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Table 
                columns={bookingColumns} 
                dataSource={recent_bookings} 
                pagination={{ pageSize: 5 }} 
                size="middle"
                rowKey="id"
              />
            </Card>

            {/* Top sân có doanh thu cao */}
            {top_revenue_pitches && top_revenue_pitches.length > 0 && (
              <Card 
                title={
                  <Space>
                    <StarOutlined />
                    <Text strong>Top sân doanh thu cao nhất</Text>
                  </Space>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={top_revenue_pitches}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
                        title={<Text strong>{item.name}</Text>}
                        description={
                          <Space size="large">
                            <span>
                              <Text type="secondary">Địa điểm:</Text> {item.location}
                            </span>
                            <span>
                              <Text type="secondary">Booking:</Text> {item.total_bookings}
                            </span>
                            <span>
                              <Text type="secondary">Doanh thu:</Text> {formatCurrency(item.total_revenue)}
                            </span>
                          </Space>
                        }
                      />
                      <Tag color="gold">
                        TOP {index + 1}
                      </Tag>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;