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
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

interface Pitch {
  id: number;
  name: string;
  location: string;
  price_per_hour: number;
  owner_name: string;
  owner_phone: string;
  booked_slots?: number[];
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface BookingSlot {
  id: string;
  time: string;
  date: string;
  pitch: Pitch;
  timeSlot: TimeSlot;
  price: number;
  status: 'available' | 'booked' | 'past';
}

interface UserBooking {
  id: number;
  pitch_name: string;
  location: string;
  price_per_hour: number;
  start_time: string;
  end_time: string;
  booking_date: string;
  owner_name: string;
  owner_phone: string;
  status: string;
}

const apiService = {
  baseURL: 'http://localhost:5000/api',
  
  async getPitches(location: string = '', date: string = '') {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (date) params.append('date', date);
      
      const response = await fetch(`${this.baseURL}/pitches?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pitches');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching pitches:', error);
      throw error;
    }
  },

  async getAllTimeSlots(): Promise<TimeSlot[]> {
    try {
      const response = await fetch(`${this.baseURL}/timeslots`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch time slots');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async getPitchAvailability(pitchId: number, date: string) {
    try {
      const response = await fetch(`${this.baseURL}/pitches/${pitchId}/availability?date=${date}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch availability');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  async getPitchAvailabilityWithTimeSlots(pitchId: number, date: string) {
    try {
      const allTimeSlots = await this.getAllTimeSlots();
      const availabilityResponse = await fetch(`${this.baseURL}/pitches/${pitchId}/availability?date=${date}`);
      const availabilityData = await availabilityResponse.json();
      
      if (!availabilityResponse.ok) {
        throw new Error(availabilityData.message || 'Failed to fetch availability');
      }

      const bookedSlotIds = availabilityData.booked_slots || [];
      
      const timeSlots = allTimeSlots.map((slot: TimeSlot) => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: !bookedSlotIds.includes(slot.id)
      }));

      return { time_slots: timeSlots };
    } catch (error) {
      console.error('Error fetching availability with time slots:', error);
      throw error;
    }
  },

  async createBooking(bookingData: any) {
    try {
      const response = await fetch(`${this.baseURL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async getUserBookings(userId: number, userType: string = 'user') {
    try {
      const response = await fetch(`${this.baseURL}/user/bookings?user_id=${userId}&user_type=${userType}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId: number, userId: number, userType: string = 'user') {
    try {
      const response = await fetch(`${this.baseURL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, user_type: userType })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }
};

const UserBookingPage: React.FC = () => {
  const location = useLocation();
  const [selectedPitchFromHome, setSelectedPitchFromHome] = useState<any>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');
  
  const userId = 1;

  useEffect(() => {
    if (location.state) {
      setSelectedPitchFromHome(location.state);
      setLocationFilter(location.state.location);
    }
    loadInitialData();
  }, [location.state, locationFilter]);

  const loadInitialData = async () => {
    try {
      setPageLoading(true);
      await Promise.all([
        loadTimeSlots(),
        loadPitches(),
        loadUserBookings()
      ]);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setPageLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      const timeSlots = await apiService.getAllTimeSlots();
      setAllTimeSlots(timeSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      message.error('Không thể tải danh sách khung giờ');
    }
  };

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    today.setDate(today.getDate() + currentWeek * 7);
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const loadPitches = async () => {
    try {
      const data = await apiService.getPitches(locationFilter);
      setPitches(data);
      
      if (selectedPitchFromHome) {
        const pitch = data.find((p: Pitch) => p.id.toString() === selectedPitchFromHome.pitchId);
        if (pitch) setSelectedPitch(pitch);
      }
    } catch (error) {
      message.error('Không thể tải danh sách sân');
    }
  };

  const loadPitchAvailability = async (pitch: Pitch, date: string) => {
    try {
      const data = await apiService.getPitchAvailabilityWithTimeSlots(pitch.id, date);
      return data.time_slots;
    } catch (error) {
      console.error('Error loading availability:', error);
      return [];
    }
  };

  const loadUserBookings = async () => {
    try {
      const data = await apiService.getUserBookings(userId);
      setUserBookings(data);
    } catch (error) {
      message.error('Không thể tải lịch sử đặt sân');
    }
  };

  const handleSlotClick = async (pitch: Pitch, timeSlot: TimeSlot, date: string) => {
    if (!timeSlot.is_available) return;

    const slotId = `${pitch.id}-${timeSlot.id}-${date}`;
    const bookingSlot: BookingSlot = {
      id: slotId,
      time: `${timeSlot.start_time} - ${timeSlot.end_time}`,
      date,
      pitch,
      timeSlot,
      price: pitch.price_per_hour,
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

  const handleBookSlots = async () => {
    try {
      setLoading(true);
      
      const name = form.getFieldValue('name');
      const phone = form.getFieldValue('phone');
      
      if (!name || !phone) {
        message.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      
      if (!/^[0-9]{10,11}$/.test(phone)) {
        message.error('Số điện thoại không hợp lệ');
        return;
      }

      if (selectedSlots.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 khung giờ');
        return;
      }

      const bookingPromises = selectedSlots.map(slot => 
        apiService.createBooking({
          user_id: userId,
          user_type: 'user',
          pitch_id: slot.pitch.id,
          time_slot_id: slot.timeSlot.id,
          booking_date: slot.date
        })
      );

      await Promise.all(bookingPromises);

      setSelectedSlots([]);
      setShowBookingForm(false);
      form.setFields([
        { name: 'name', value: '' },
        { name: 'phone', value: '' }
      ]);
      await loadUserBookings();
      message.success('Đặt sân thành công!');
      
    } catch (error: any) {
      message.error(error.message || 'Đặt sân thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await apiService.cancelBooking(bookingId, userId);
      await loadUserBookings();
      message.success('Đã hủy đặt sân thành công');
    } catch (error: any) {
      message.error(error.message || 'Hủy đặt sân thất bại');
    }
  };

  const handleRefreshAll = async () => {
    try {
      setPageLoading(true);
      await loadInitialData();
      message.success('Đã làm mới dữ liệu');
    } catch (error) {
      message.error('Không thể làm mới dữ liệu');
    } finally {
      setPageLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const renderSelectedPitchInfo = () => {
    if (!selectedPitchFromHome) return null;

    return (
      <Alert
        message={`Bạn đang đặt sân: ${selectedPitchFromHome.pitchName}`}
        description={`Địa điểm: ${selectedPitchFromHome.location} | Giá: ${selectedPitchFromHome.price.toLocaleString()} VND/giờ`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  };

  const renderBookingGrid = () => {
    const weekDates = generateWeekDates();
    
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', background: '#fafafa' }}>
                Sân
              </th>
              {weekDates.map(date => (
                <th 
                  key={date.toISOString()} 
                  style={{ border: '1px solid #d9d9d9', padding: '8px', background: '#fafafa' }}
                >
                  {formatDate(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pitches.map(pitch => (
              <PitchRow 
                key={pitch.id}
                pitch={pitch}
                weekDates={weekDates}
                selectedSlots={selectedSlots}
                userBookings={userBookings}
                onSlotClick={handleSlotClick}
                loadPitchAvailability={loadPitchAvailability}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const slotStyles = `
    .time-slot {
      padding: 4px;
      margin: 2px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 12px;
      min-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
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
  `;

  if (pageLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="user-booking-page" style={{ padding: 24 }}>
      <style>{slotStyles}</style>
      
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Đặt sân bóng đá</Title>
        <Text type="secondary">
          Chọn các khung giờ trống để đặt sân 
          {allTimeSlots.length > 0 && (
            <span> - Có {allTimeSlots.length} khung giờ khả dụng</span>
          )}
        </Text>
        
        {renderSelectedPitchInfo()}
        
        <Divider />
        
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm theo địa điểm"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              onSearch={loadPitches}
              enterButton="Tìm kiếm"
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefreshAll}
              loading={pageLoading}
            >
              Làm mới tất cả
            </Button>
          </Col>
        </Row>

        {allTimeSlots.length > 0 && (
          <Alert
            message="Khung giờ hoạt động"
            description={
              <div>
                <Text>Các khung giờ hiện tại: </Text>
                {allTimeSlots.map((slot, index) => (
                  <Tag key={slot.id} color="green" style={{ margin: '2px' }}>
                    {slot.start_time} - {slot.end_time}
                  </Tag>
                ))}
              </div>
            }
            type="success"
            style={{ marginBottom: 16 }}
          />
        )}
        
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
              {generateWeekDates()[0].toLocaleDateString('vi-VN')} - {generateWeekDates()[6].toLocaleDateString('vi-VN')}
            </Text>
          </Col>
        </Row>

        {pitches.length > 0 ? renderBookingGrid() : (
          <Alert
            message="Không có sân nào được tìm thấy"
            description="Vui lòng thử tìm kiếm với từ khóa khác"
            type="info"
            showIcon
          />
        )}

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
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {selectedSlots.map(slot => (
                <div key={slot.id} style={{ marginBottom: 8 }}>
                  <Text strong>{slot.pitch.name}</Text> - {slot.pitch.location}<br/>
                  <Text>{new Date(slot.date).toLocaleDateString('vi-VN')} - {slot.time}</Text>
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {slot.price.toLocaleString()} đ/giờ
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

      {userBookings.length > 0 && (
        <Card title="Lịch sử đặt sân của bạn" bordered={false}>
          {userBookings.map(booking => (
            <Card 
              key={booking.id} 
              type="inner" 
              title={`${booking.pitch_name} - ${booking.location}`}
              style={{ marginBottom: 16 }}
              extra={
                booking.status !== 'cancelled' && (
                  <Popconfirm
                    title="Bạn chắc chắn muốn hủy đặt sân này?"
                    onConfirm={() => handleCancelBooking(booking.id)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    <Button danger size="small">Hủy đặt sân</Button>
                  </Popconfirm>
                )
              }
            >
              <div style={{ marginBottom: 8 }}>
                <Badge status={booking.status === 'cancelled' ? 'error' : 'success'} />
                <Text strong>Ngày:</Text> {new Date(booking.booking_date).toLocaleDateString('vi-VN')}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Giờ:</Text> {booking.start_time} - {booking.end_time}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Giá:</Text> {booking.price_per_hour.toLocaleString()} đ/giờ
              </div>
              <div>
                <Text strong>Liên hệ:</Text> {booking.owner_name} - {booking.owner_phone}
              </div>
            </Card>
          ))}
        </Card>
      )}

      <Modal
        title="Xác nhận thông tin đặt sân"
        open={showBookingForm}
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
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
              Họ và tên *
            </label>
            <Input 
              placeholder="Nhập họ tên của bạn"
              value={form.getFieldValue('name') || ''}
              onChange={(e) => form.setFields([{ name: 'name', value: e.target.value }])}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
              Số điện thoại *
            </label>
            <Input 
              placeholder="Nhập số điện thoại"
              value={form.getFieldValue('phone') || ''}
              onChange={(e) => form.setFields([{ name: 'phone', value: e.target.value }])}
            />
          </div>
        </div>
        
        <Alert
          message="Thông tin đặt sân"
          description={
            <div>
              {selectedSlots.map(slot => (
                <div key={slot.id}>
                  • {slot.pitch.name} - {new Date(slot.date).toLocaleDateString('vi-VN')} - {slot.time}
                </div>
              ))}
            </div>
          }
          type="info"
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

const PitchRow: React.FC<{
  pitch: Pitch;
  weekDates: Date[];
  selectedSlots: BookingSlot[];
  userBookings: UserBooking[];
  onSlotClick: (pitch: Pitch, timeSlot: TimeSlot, date: string) => void;
  loadPitchAvailability: (pitch: Pitch, date: string) => Promise<TimeSlot[]>;
}> = ({ pitch, weekDates, selectedSlots, userBookings, onSlotClick, loadPitchAvailability }) => {
  const [daySlots, setDaySlots] = useState<{ [key: string]: TimeSlot[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadAllDays = async () => {
      const newDaySlots: { [key: string]: TimeSlot[] } = {};
      const newLoading: { [key: string]: boolean } = {};
      
      for (const date of weekDates) {
        const dateStr = date.toISOString().split('T')[0];
        newLoading[dateStr] = true;
        setLoading(prev => ({ ...prev, [dateStr]: true }));
        
        try {
          const slots = await loadPitchAvailability(pitch, dateStr);
          
          const processedSlots = slots.map((slot: TimeSlot) => {
            const isBookedByUser = userBookings.some(booking => 
              booking.pitch_name === pitch.name &&
              booking.booking_date === dateStr &&
              booking.start_time === slot.start_time &&
              booking.status !== 'cancelled'
            );
            
            return {
              ...slot,
              is_available: slot.is_available && !isBookedByUser
            };
          });
          
          newDaySlots[dateStr] = processedSlots;
        } catch (error) {
          newDaySlots[dateStr] = [];
        }
        
        newLoading[dateStr] = false;
        setLoading(prev => ({ ...prev, [dateStr]: false }));
      }
      
      setDaySlots(newDaySlots);
    };

    loadAllDays();
  }, [pitch, weekDates, userBookings, loadPitchAvailability]);

  return (
    <tr>
      <td style={{ border: '1px solid #d9d9d9', padding: '8px', verticalAlign: 'top' }}>
        <div>
          <Text strong>{pitch.name}</Text><br/>
          <Text type="secondary" style={{ fontSize: '12px' }}>{pitch.location}</Text><br/>
          <Tag color="blue">{pitch.price_per_hour.toLocaleString()} đ/giờ</Tag>
        </div>
      </td>
      {weekDates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const slots = daySlots[dateStr] || [];
        const isLoading = loading[dateStr];
        
        return (
          <td 
            key={dateStr} 
            style={{ 
              border: '1px solid #d9d9d9', 
              padding: '4px', 
              verticalAlign: 'top',
              minWidth: '120px'
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="small" />
              </div>
            ) : (
              <div>
                {slots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '10px', color: '#999' }}>
                    Chưa có khung giờ
                  </div>
                ) : (
                  slots.map(slot => {
                    const slotId = `${pitch.id}-${slot.id}-${dateStr}`;
                    const isSelected = selectedSlots.some(s => s.id === slotId);
                    const isPast = new Date(dateStr + 'T' + slot.start_time) < new Date();
                    
                    let className = 'time-slot ';
                    if (isPast) {
                      className += 'past-slot';
                    } else if (!slot.is_available) {
                      className += 'booked-slot';
                    } else if (isSelected) {
                      className += 'selected-slot';
                    } else {
                      className += 'available-slot';
                    }
                    
                    return (
                      <div
                        key={slot.id}
                        className={className}
                        onClick={() => onSlotClick(pitch, slot, dateStr)}
                        title={`${slot.start_time} - ${slot.end_time}`}
                      >
                        {slot.start_time}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default UserBookingPage;