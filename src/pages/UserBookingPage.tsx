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
  Popconfirm,
  Select,
  Spin
} from "antd";
import { LeftOutlined, RightOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
}

interface Pitch {
  id: number;
  name: string;
  location: string;
  price_per_hour: number;
  status: string;
  owner_name: string;
  owner_phone: string;
}

interface BookingSlot {
  id: string;
  time_slot_id: number;
  time: string;
  date: string;
  pitch_id: number;
  pitch_name: string;
  price: number;
  status: 'available' | 'booked' | 'past';
}

interface UserBooking {
  id: number;
  pitch_name: string;
  location: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  total_price: number;
  owner_name: string;
  owner_phone: string;
}

const UserBookingPage: React.FC = () => {
  const navigate = useNavigate();
  // State quản lý dữ liệu
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<{[key: string]: TimeSlot[]}>({});

  // Mock user_id - trong thực tế sẽ lấy từ authentication
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

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  // Lấy danh sách sân
  const fetchPitches = async () => {
    try {
      setPitchLoading(true);
      const response = await fetch(`${API_BASE}/bookings/pitches`);
      const data = await response.json();
      setPitches(data);
      if (data.length > 0 && !selectedPitch) {
        setSelectedPitch(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pitches:', error);
      message.error('Không thể tải danh sách sân');
    } finally {
      setPitchLoading(false);
    }
  };

  // Lấy khả dụng của sân theo ngày
  const fetchPitchAvailability = async (pitchId: number, date: string) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/pitches/${pitchId}/availability?date=${date}`);
      const data = await response.json();
      return data.time_slots || [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  };

  // Tạo booking
  const createBooking = async (pitchId: number, timeSlotId: number, bookingDate: string) => {
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: 'user',
          pitch_id: pitchId,
          time_slot_id: timeSlotId,
          booking_date: bookingDate
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Lấy bookings của user
  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings/user/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: 'user'
        })
      });
      const data = await response.json();
      setUserBookings(data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      message.error('Không thể tải lịch sử đặt sân');
    }
  };

  // Hủy booking
  const cancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: 'user'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Cancel failed');
      }

      message.success('Đã hủy đặt sân thành công');
      fetchUserBookings(); // Refresh bookings
      loadWeekData(); // Refresh availability
    } catch (error) {
      console.error('Error canceling booking:', error);
      message.error('Không thể hủy đặt sân');
    }
  };

  // Tạo dữ liệu slots cho tuần hiện tại
  const generateWeekDates = () => {
    const days = [];
    const today = new Date();
    today.setDate(today.getDate() + currentWeek * 7);
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Load dữ liệu cho tuần
  const loadWeekData = async () => {
    if (!selectedPitch) return;

    setLoading(true);
    const weekDates = generateWeekDates();
    const availabilityPromises = weekDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return fetchPitchAvailability(selectedPitch, dateStr);
    });

    try {
      const results = await Promise.all(availabilityPromises);
      const newAvailabilityData: {[key: string]: TimeSlot[]} = {};
      
      weekDates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        newAvailabilityData[dateStr] = results[index];
      });

      setAvailabilityData(newAvailabilityData);
      
      // Set time slots from first day's data
      if (results[0] && results[0].length > 0) {
        setTimeSlots(results[0]);
      }
    } catch (error) {
      console.error('Error loading week data:', error);
      message.error('Không thể tải dữ liệu tuần');
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo dữ liệu
  useEffect(() => {
    fetchPitches();
    fetchUserBookings();
  }, []);

  useEffect(() => {
    if (selectedPitch) {
      loadWeekData();
    }
  }, [selectedPitch, currentWeek]);

  // Xử lý khi chọn slot
  const handleSlotClick = (timeSlot: TimeSlot, date: string) => {
    if (!timeSlot.is_available) return;

    const selectedPitchData = pitches.find(p => p.id === selectedPitch);
    if (!selectedPitchData) return;

    const slotId = `${date}-${timeSlot.id}-${selectedPitch}`;
    const bookingSlot: BookingSlot = {
      id: slotId,
      time_slot_id: timeSlot.id,
      time: `${timeSlot.start_time} - ${timeSlot.end_time}`,
      date,
      pitch_id: selectedPitch!,
      pitch_name: selectedPitchData.name,
      price: selectedPitchData.price_per_hour,
      status: 'available'
    };

    setSelectedSlots(prev => {
      const existingIndex = prev.findIndex(s => s.id === slotId);
      if (existingIndex >= 0) {
        return prev.filter(s => s.id !== slotId);
      } else {
        return [...prev, bookingSlot];
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

      // Create bookings for all selected slots
      const bookingPromises = selectedSlots.map(slot => 
        createBooking(slot.pitch_id, slot.time_slot_id, slot.date)
      );

      await Promise.all(bookingPromises);

      // Reset form và selected slots
      setSelectedSlots([]);
      setShowBookingForm(false);
      form.resetFields();

      // Refresh data
      fetchUserBookings();
      loadWeekData();

      // Chuyển hướng đến trang thành công
      navigate('/success');
    } catch (error: any) {
      console.error('Booking error:', error);
      message.error(error.message || 'Không thể đặt sân');
    } finally {
      setLoading(false);
    }
  };

  // Định dạng ngày
  const formatDate = (dateStr: string) => {
    return moment(dateStr).format('ddd, DD/MM');
  };

  // Kiểm tra slot đã được chọn
  const isSlotSelected = (timeSlotId: number, date: string) => {
    return selectedSlots.some(slot => 
      slot.time_slot_id === timeSlotId && slot.date === date
    );
  };

  // Cột cho bảng lịch
  const columns = [
    {
      title: 'Khung giờ',
      dataIndex: 'time_display',
      key: 'time_display',
      width: 120,
      fixed: 'left' as const,
    },
    ...generateWeekDates().map(date => {
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        title: formatDate(dateStr),
        key: dateStr,
        render: (_: any, record: TimeSlot) => {
          const dayAvailability = availabilityData[dateStr] || [];
          const timeSlot = dayAvailability.find(ts => ts.id === record.id);
          
          if (!timeSlot) return null;

          const isPast = moment(`${dateStr} ${timeSlot.start_time}`).isBefore(moment());
          const isSelected = isSlotSelected(timeSlot.id, dateStr);
          const selectedPitchData = pitches.find(p => p.id === selectedPitch);

          let statusText = '';
          let className = '';
          
          if (isPast) {
            statusText = 'Quá giờ';
            className = 'past-slot';
          } else if (!timeSlot.is_available) {
            statusText = 'Đã đặt';
            className = 'booked-slot';
          } else if (isSelected) {
            statusText = `${selectedPitchData?.price_per_hour.toLocaleString()} đ`;
            className = 'selected-slot';
          } else {
            statusText = `${selectedPitchData?.price_per_hour.toLocaleString()} đ`;
            className = 'available-slot';
          }

          return (
            <div 
              className={`time-slot ${className}`}
              onClick={() => handleSlotClick(timeSlot, dateStr)}
            >
              {statusText}
            </div>
          );
        },
      };
    }),
  ];

  // Dữ liệu cho bảng
  const tableData = timeSlots.map(slot => ({
    ...slot,
    key: slot.id,
    time_display: `${slot.start_time} - ${slot.end_time}`
  }));

  // CSS
  const slotStyles = `
    .time-slot {
      padding: 8px;
      margin: 2px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
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

  function handleBack(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <div className="user-booking-page" style={{ padding: 24 }}>
      <Button 
        type="text" 
        icon={<LeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      <style>{slotStyles}</style>
      
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Đặt sân bóng đá</Title>
        <Text type="secondary">Chọn sân và các khung giờ trống để đặt sân</Text>
        
        <Divider />

        {/* Chọn sân */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Text strong>Chọn sân:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Chọn sân"
              value={selectedPitch}
              onChange={setSelectedPitch}
              loading={pitchLoading}
            >
              {pitches.map(pitch => (
                <Option key={pitch.id} value={pitch.id}>
                  {pitch.name} - {pitch.location} ({pitch.price_per_hour.toLocaleString()}đ)
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <br />
            {selectedPitch && (
              <Text type="secondary">
                Sân đã chọn: {pitches.find(p => p.id === selectedPitch)?.name}
              </Text>
            )}
          </Col>
        </Row>
        
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
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadWeekData}
                loading={loading}
              >
                Tải lại
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

        <Spin spinning={loading}>
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
        </Spin>

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
                  <Text strong>{slot.pitch_name}</Text> -{' '}
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
              title={`Đơn #${booking.id} - ${moment(booking.booking_date).format('DD/MM/YYYY')} ${booking.start_time}-${booking.end_time}`}
              style={{ marginBottom: 16 }}
              extra={
                booking.status === 'pending' ? (
                  <Popconfirm
                    title="Bạn chắc chắn muốn hủy đặt sân này?"
                    onConfirm={() => cancelBooking(booking.id)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    <Button danger size="small">Hủy đặt sân</Button>
                  </Popconfirm>
                ) : null
              }
            >
              <div style={{ marginBottom: 8 }}>
                <Text strong>Sân:</Text> {booking.pitch_name} - {booking.location}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Chủ sân:</Text> {booking.owner_name} - {booking.owner_phone}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Badge 
                  status={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'error' : 'processing'} 
                />
                <Text strong>Trạng thái:</Text> {booking.status}
                <span style={{ marginLeft: 16 }}>
                  <Text strong>Thanh toán:</Text> {booking.payment_status}
                </span>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Text strong>Tổng tiền: {booking.total_price.toLocaleString()} đ</Text>
            </Card>
          ))}
        </Card>
      )}

      {/* Form đặt sân */}
      <Modal
        title="Xác nhận đặt sân"
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
        <Alert
          message="Thông tin đặt sân"
          description={`Bạn đang đặt ${selectedSlots.length} khung giờ với tổng tiền ${selectedSlots.reduce((sum, slot) => sum + slot.price, 0).toLocaleString()} đ`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <div className="booking-list" style={{ marginBottom: 16 }}>
          {selectedSlots.map(slot => (
            <div key={slot.id} style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
              <Text strong>{slot.pitch_name}</Text><br />
              <Text>{moment(slot.date).format('DD/MM/YYYY')} - {slot.time}</Text><br />
              <Tag color="blue">{slot.price.toLocaleString()} đ</Tag>
            </div>
          ))}
        </div>

        <Alert
          message="Lưu ý quan trọng"
          description="Sau khi xác nhận, bạn cần liên hệ với chủ sân để thanh toán và nhận sân. Thông tin liên hệ sẽ được hiển thị trong lịch sử đặt sân."
          type="warning"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default UserBookingPage;