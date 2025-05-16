import React, { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Alert, 
  Divider,
  Tag,
  Space,
  message,
  Badge,
  Popconfirm
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

interface BookingSlot {
  id: string;
  time: string;
  date: string;
  court: string;
  price: number;
  status: 'available' | 'booked' | 'past';
}

interface UserBooking {
  id: string;
  slots: BookingSlot[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  createdAt: string;
}

const UserBookingPage: React.FC = () => {
  // State quản lý dữ liệu
  const [allSlots, setAllSlots] = useState<BookingSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data - Khung giờ và giá
  const times = ["05:30", "07:00", "08:30", "10:00", "11:30", "14:30", "16:00", "17:30", "19:00", "20:30", "22:00"];
  const courts = ["Sân số 1", "Sân số 2"];
  const prices = {
    "05:30": 300000,
    "07:00": 300000,
    "08:30": 300000,
    "10:00": 300000,
    "11:30": 300000,
    "14:30": 300000,
    "16:00": 300000,
    "17:30": 500000,
    "19:00": 500000,
    "20:30": 500000,
    "22:00": 300000,
  };

  // Tạo dữ liệu slots cho tuần hiện tại
  const generateWeekSlots = () => {
    const days = [];
    const today = new Date();
    today.setDate(today.getDate() + currentWeek * 7);
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    // Tạo 7 ngày trong tuần
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }

    // Tạo tất cả các slot cho tuần
    const slots: BookingSlot[] = [];
    days.forEach(day => {
      const dateStr = day.toISOString().split('T')[0];
      times.forEach(time => {
        courts.forEach(court => {
          const slotDate = new Date(day);
          const [hours, minutes] = time.split(":").map(Number);
          slotDate.setHours(hours, minutes, 0, 0);
          
          const isPast = slotDate < new Date();
          const isBooked = userBookings.some(booking => 
            booking.slots.some(slot => 
              slot.date === dateStr && 
              slot.time === time && 
              slot.court === court
            )
          );

          slots.push({
            id: `${dateStr}-${time}-${court}`,
            time,
            date: dateStr,
            court,
            price: prices[time as keyof typeof prices],
            status: isBooked ? 'booked' : isPast ? 'past' : 'available'
          });
        });
      });
    });

    setAllSlots(slots);
  };

  // Khởi tạo dữ liệu
  useEffect(() => {
    generateWeekSlots();
  }, [currentWeek, userBookings]);

  // Xử lý khi chọn slot
  const handleSlotClick = (slot: BookingSlot) => {
    if (slot.status !== 'available') return;

    setSelectedSlots(prev => {
      const existingIndex = prev.findIndex(s => s.id === slot.id);
      if (existingIndex >= 0) {
        return prev.filter(s => s.id !== slot.id);
      } else {
        return [...prev, { ...slot, status: 'booked' }];
      }
    });
  };

  // Đặt sân
  const handleBookSlots = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (selectedSlots.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 khung giờ');
        return;
      }

      // Tạo booking mới
      const newBooking: UserBooking = {
        id: `booking-${Date.now()}`,
        slots: [...selectedSlots],
        customerInfo: {
          name: values.name || 'Khách hàng',
          email: values.email,
          phone: values.phone
        },
        totalAmount: selectedSlots.reduce((sum, slot) => sum + slot.price, 0),
        createdAt: new Date().toISOString()
      };

      // Thêm vào danh sách booking
      setUserBookings(prev => [...prev, newBooking]);
      
      // Reset form và selected slots
      setSelectedSlots([]);
      setShowBookingForm(false);
      form.resetFields();

      // Hiển thị thông báo thành công
      message.success('Đặt sân thành công!');
    } catch (error) {
      console.error('Booking error:', error);
      message.error('Vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };

  // Hủy đặt sân
  const handleCancelBooking = (bookingId: string) => {
    setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
    message.success('Đã hủy đặt sân thành công');
  };

  // Định dạng ngày
  const formatDate = (dateStr: string) => {
    return moment(dateStr).format('ddd, DD/MM');
  };

  // Cột cho bảng lịch
  const columns = [
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      fixed: 'left' as const,
    },
    {
      title: 'Sân',
      dataIndex: 'court',
      key: 'court',
      width: 100,
      fixed: 'left' as const,
    },
    ...Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + (currentWeek * 7) - date.getDay() + 1 + i);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        title: formatDate(dateStr),
        key: dateStr,
        render: (_: any, record: any) => {
          const slot = allSlots.find(s => 
            s.time === record.time && 
            s.court === record.court && 
            s.date === dateStr
          );

          if (!slot) return null;

          let statusText = '';
          let className = '';
          
          switch (slot.status) {
            case 'booked':
              statusText = 'Đã đặt';
              className = 'booked-slot';
              break;
            case 'past':
              statusText = 'Quá giờ';
              className = 'past-slot';
              break;
            default:
              statusText = `${slot.price.toLocaleString()} đ`;
              className = selectedSlots.some(s => s.id === slot.id) 
                ? 'selected-slot' 
                : 'available-slot';
          }

          return (
            <div 
              className={`time-slot ${className}`}
              onClick={() => handleSlotClick(slot)}
            >
              {statusText}
            </div>
          );
        },
      };
    }),
  ];

  // Dữ liệu cho bảng
  const tableData = times.flatMap(time => 
    courts.map(court => ({
      key: `${time}-${court}`,
      time,
      court,
    }))
  );

  // CSS
  const slotStyles = `
    .time-slot {
      padding: 8px;
      margin: 2px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .available-slot {
      background-color: #f6ffed;
      border: 1px solid #b7eb8f;
      color: #389e0d;
    }
    .available-slot:hover {
      background-color: #d9f7be;
    }
    .selected-slot {
      background-color: #1890ff;
      color: white;
      font-weight: bold;
    }
    .booked-slot {
      background-color: #fff1f0;
      border: 1px solid #ffa39e;
      color: #cf1322;
      cursor: not-allowed;
    }
    .past-slot {
      background-color: #f5f5f5;
      color: #8c8c8c;
      cursor: not-allowed;
    }
    .booking-list {
      max-height: 300px;
      overflow-y: auto;
    }
  `;

  return (
    <div className="user-booking-page" style={{ padding: 24 }}>
      <style>{slotStyles}</style>
      
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Đặt sân bóng đá</Title>
        <Text type="secondary">Chọn các khung giờ trống để đặt sân</Text>
        
        <Divider />
        
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Button 
                icon={<LeftOutlined />} 
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                Tuần trước
              </Button>
              <Button 
                icon={<RightOutlined />} 
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                Tuần sau
              </Button>
            </Space>
          </Col>
          <Col>
            <Text strong>
              Tuần: {moment().add(currentWeek * 7, 'days').startOf('week').add(1, 'day').format('DD/MM')} -{' '}
              {moment().add(currentWeek * 7, 'days').endOf('week').format('DD/MM')}
            </Text>
          </Col>
        </Row>

        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            size="middle"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>

        {selectedSlots.length > 0 && (
          <Card 
            title="Thông tin đặt sân" 
            style={{ marginTop: 24 }}
            extra={
              <Button 
                type="primary" 
                onClick={() => setShowBookingForm(true)}
              >
                Tiến hành đặt sân ({selectedSlots.length})
              </Button>
            }
          >
            <div className="booking-list">
              {selectedSlots.map(slot => (
                <div key={slot.id} style={{ marginBottom: 8 }}>
                  <Text strong>{slot.court}</Text> -{' '}
                  {moment(slot.date).format('DD/MM/YYYY')} -{' '}
                  {slot.time}{' '}
                  <Tag color="blue" style={{ marginLeft: 4 }}>
                    {slot.price.toLocaleString()} đ
                  </Tag>
                </div>
              ))}
            </div>
            <Divider />
            <Text strong style={{ fontSize: 16 }}>
              Tổng cộng: <span style={{ color: '#1890ff' }}>
                {selectedSlots.reduce((sum, slot) => sum + slot.price, 0).toLocaleString()} đ
              </span>
            </Text>
          </Card>
        )}
      </Card>

      {/* Lịch sử đặt sân */}
      {userBookings.length > 0 && (
        <Card title="Lịch sử đặt sân của bạn" bordered={false}>
          {userBookings.map(booking => (
            <Card 
              key={booking.id} 
              type="inner" 
              title={`Đơn #${booking.id.slice(-6)} - ${moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}`}
              style={{ marginBottom: 16 }}
              extra={
                <Popconfirm
                  title="Bạn chắc chắn muốn hủy đặt sân này?"
                  onConfirm={() => handleCancelBooking(booking.id)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button danger size="small">Hủy đặt sân</Button>
                </Popconfirm>
              }
            >
              <div style={{ marginBottom: 8 }}>
                <Text strong>Thông tin khách hàng:</Text>{' '}
                {booking.customerInfo.name} - {booking.customerInfo.phone} - {booking.customerInfo.email}
              </div>
              <div className="booking-list">
                {booking.slots.map(slot => (
                  <div key={slot.id} style={{ marginBottom: 4 }}>
                    <Badge status="success" />{' '}
                    {slot.court} - {moment(slot.date).format('DD/MM/YYYY')} -{' '}
                    {slot.time}{' '}
                    <Tag color="blue" style={{ marginLeft: 4 }}>
                      {slot.price.toLocaleString()} đ
                    </Tag>
                  </div>
                ))}
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Text strong>Tổng tiền: {booking.totalAmount.toLocaleString()} đ</Text>
            </Card>
          ))}
        </Card>
      )}

      {/* Form đặt sân */}
      <Modal
        title="Thông tin liên hệ"
        visible={showBookingForm}
        onCancel={() => setShowBookingForm(false)}
        footer={[
          <Button key="back" onClick={() => setShowBookingForm(false)}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleBookSlots}
          >
            Xác nhận đặt sân
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Họ và tên"
          >
            <Input placeholder="Nhập họ tên của bạn" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Form>
        <Alert
          message="Lưu ý quan trọng"
          description="Vui lòng kiểm tra kỹ thông tin đặt sân trước khi xác nhận. Bạn sẽ không thể thay đổi sau khi đặt."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default UserBookingPage;