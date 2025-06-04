import React, { useState, useEffect } from "react";
import { Card, Tabs, Table, Button, Layout, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import MenuLeft from "../component/MenuLeft";

const { TabPane } = Tabs;
const { Sider, Content } = Layout;

interface Booking {
  id: string;
  user_name: string;
  user_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  payment_status: "pending" | "completed";
  pitch_name: string;
  status: string;
}

const ManagePayment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy owner_id từ session
  const getOwnerId = () => {
  const session = JSON.parse(sessionStorage.getItem('owner_session') || '{}');
  return session.owner_id; // ✅ Lấy từ session đã lưu
};

  // Fetch bookings từ API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const ownerId = getOwnerId();
      if (!ownerId) {
        message.error("Không tìm thấy thông tin chủ sân");
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings/owner/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_type: 'owner',
          owner_id: ownerId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const bookings = await response.json();
      
      // Transform data để match với interface
      const transformedData = bookings.map((booking: any) => ({
        id: booking.id.toString(),
        user_name: booking.user_name,
        user_phone: booking.user_phone,
        booking_date: new Date(booking.booking_date).toLocaleDateString('vi-VN'),
        start_time: booking.start_time,
        end_time: booking.end_time,
        total_price: booking.total_price,
        payment_status: booking.payment_status,
        pitch_name: booking.pitch_name,
        status: booking.status
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Không thể tải danh sách đặt sân');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

//cập nhật trạng thái sân
  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
  try {
    const ownerId = getOwnerId();
    if (!ownerId) {
      message.error("Không tìm thấy thông tin chủ sân");
      return;
    }

    const response = await fetch(`http://localhost:5000/api/bookings/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_type: 'owner',
        status: newStatus,
        owner_id: ownerId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }

    message.success(`Đã cập nhật trạng thái thành ${newStatus === 'confirmed' ? 'đã xác nhận' : 'đã hủy'}!`);
    
    // Refresh data sau khi cập nhật
    await fetchBookings();
  } catch (error) {
    console.error('Error updating booking status:', error);
    message.error('Không thể cập nhật trạng thái');
  }
};



  // Xác nhận thanh toán
  const handleConfirmPayment = async (bookingId: string) => {
    try {
      const ownerId = getOwnerId();
      if (!ownerId) {
        message.error("Không tìm thấy thông tin chủ sân");
        return;
      }

      // 1. Cập nhật trạng thái thanh toán
      const paymentResponse = await fetch(`http://localhost:5000/api/bookings/bookings/${bookingId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_type: 'owner',
          payment_status: 'completed',
          owner_id: ownerId
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to update payment status');
      }

      // 2. Cập nhật trạng thái đặt sân thành confirmed
      const statusResponse = await fetch(`http://localhost:5000/api/bookings/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_type: 'owner',
          status: 'confirmed',
          owner_id: ownerId
        })
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update booking status');
      }

      message.success("Đã xác nhận thanh toán và trạng thái đặt sân thành công!");
      
      // Refresh data sau khi cập nhật
      await fetchBookings();
    } catch (error) {
      console.error('Error confirming payment:', error);
      message.error('Không thể xác nhận thanh toán');
    }
  };

  // Filter data theo tab active
  const filteredData = data.filter((booking) => {
  if (activeTab === "pending") {
    return booking.payment_status === "pending";
  } else {
    // Tab completed: chỉ hiển thị booking đã thanh toán và không bị hủy
    return booking.payment_status === "completed" && booking.status !== "cancelled";
  }
});

// Hàm helper để xác định trạng thái hiển thị
const getDisplayStatus = (booking: Booking) => {
  // Trả về trạng thái thực tế từ database
  return booking.status;
};

const columns: ColumnsType<Booking> = [
  {
    title: "Thông tin người đặt sân",
    dataIndex: "user_name",
    width: 200,
    render: (_: any, record: Booking) => (
      <div>
        <div>
          <b>Họ và tên</b>: {record.user_name}
        </div>
        <div>
          <b>Số điện thoại</b>: {record.user_phone}
        </div>
      </div>
    ),
  },
  {
    title: "Ngày đặt",
    dataIndex: "booking_date",
    width: 120,
    render: (date: string) => (
      <div>{date}</div>
    ),
  },
  {
    title: "Giờ đặt - Sân",
    width: 180,
    render: (_: any, record: Booking) => (
      <div>
        <div>
          <b>Giờ</b>: {record.start_time} - {record.end_time}
        </div>
        <div>
          <b>Sân</b>: {record.pitch_name}
        </div>
      </div>
    ),
  },
  {
    title: "Giá",
    dataIndex: "total_price",
    width: 120,
    render: (price: number) => (
      <div>{price?.toLocaleString('vi-VN')} VNĐ</div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: 150,
    render: (status: string, record: Booking) => {
      const displayStatus = getDisplayStatus(record);
      
      return (
        <div>
          {activeTab === "completed" ? (
            <span style={{ color: '#52c41a' }}>Đã xác nhận</span>
          ) : (
            <>
              <span style={{
                color: displayStatus === 'confirmed' ? '#52c41a' : 
                      displayStatus === 'cancelled' ? '#ff4d4f' : '#faad14',
                marginRight: 8
              }}>
                {displayStatus === 'confirmed' ? 'Đã xác nhận' : 
                 displayStatus === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}
              </span>
              {displayStatus !== 'cancelled' && record.payment_status !== 'completed' && (
                <div style={{ marginTop: 8 }}>
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => handleUpdateStatus(record.id, 'confirmed')}
                    disabled={displayStatus === 'confirmed'}
                  >
                    Xác nhận
                  </Button>
                  <Button 
                    size="small" 
                    type="link" 
                    danger 
                    onClick={() => handleUpdateStatus(record.id, 'cancelled')}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      );
    },
  },
  ...(activeTab === "pending"
    ? [
        {
          title: "Thanh toán",
          width: 150,
          render: (_: any, record: Booking) => (
            <Button
              type="primary"
              size="small"
              disabled={record.status === 'cancelled' || record.payment_status === 'completed'}
              onClick={() => handleConfirmPayment(record.id)}
            >
              Xác nhận thanh toán
            </Button>
          ),
        },
      ]
    : []),
];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Card>
            <Tabs
              defaultActiveKey="pending"
              onChange={(key) => setActiveTab(key as "pending" | "completed")}
              tabBarGutter={30}
            >
              <TabPane tab="Chưa thanh toán" key="pending" />
              <TabPane tab="Đã thanh toán" key="completed" />
            </Tabs>

            <Spin spinning={loading}>
              <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} bản ghi`,
                }}
                bordered
                style={{ marginTop: 16 }}
                rowKey="id"
                scroll={{ x: 800 }}
              />
            </Spin>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagePayment;