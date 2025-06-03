// components/BookingHistory.tsx
import React from "react";
import { Card, Tag, Typography, Badge, Popconfirm, Button, Divider } from "antd";
import moment from "moment";

const { Text } = Typography;

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

interface Props {
  bookings: UserBooking[];
  onCancelBooking?: (bookingId: string) => void;
}

const BookingHistory: React.FC<Props> = ({ bookings, onCancelBooking }) => {
  if (bookings.length === 0) return null;

  return (
    <Card title="Lịch sử đặt sân của bạn" bordered={false}>
      {bookings.map(booking => (
        <Card
          key={booking.id}
          type="inner"
          title={`Đơn #${booking.id.slice(-6)} - ${moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}`}
          style={{ marginBottom: 16 }}
          extra={onCancelBooking && (
            <Popconfirm
              title="Bạn chắc chắn muốn hủy đặt sân này?"
              onConfirm={() => onCancelBooking(booking.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button danger size="small">Hủy đặt sân</Button>
            </Popconfirm>
          )}
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
  );
};

export default BookingHistory;
