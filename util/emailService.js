const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'anh508023@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'ioxo uaxe smjn pucw'
  }
});

// Template HTML cho email xác nhận đặt sân
const getBookingConfirmationTemplate = (bookingData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .success { color: #4CAF50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Xác Nhận Đặt Sân Thành Công!</h1>
        </div>
        
        <div class="content">
          <h2>Chào ${bookingData.user_name},</h2>
          <p>Cảm ơn bạn đã đặt sân tại hệ thống của chúng tôi. Booking của bạn đã được <span class="success">xác nhận và thanh toán thành công</span>!</p>
          
          <div class="booking-info">
            <h3>📋 Thông Tin Đặt Sân</h3>
            <div class="info-row">
              <span class="label">Mã đặt sân:</span>
              <span>#${bookingData.id}</span>
            </div>
            <div class="info-row">
              <span class="label">Tên sân:</span>
              <span>${bookingData.pitch_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Địa chỉ:</span>
              <span>${bookingData.location}</span>
            </div>
            <div class="info-row">
              <span class="label">Ngày đặt:</span>
              <span>${bookingData.formatted_date}</span>
            </div>
            <div class="info-row">
              <span class="label">Giờ chơi:</span>
              <span>${bookingData.start_time} - ${bookingData.end_time}</span>
            </div>
            <div class="info-row">
              <span class="label">Tổng tiền:</span>
              <span style="color: #4CAF50; font-weight: bold;">${bookingData.total_price?.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div class="info-row">
              <span class="label">Trạng thái:</span>
              <span class="success">Đã xác nhận</span>
            </div>
          </div>

          <div class="booking-info">
            <h3>📞 Thông Tin Liên Hệ Chủ Sân</h3>
            <div class="info-row">
              <span class="label">Tên chủ sân:</span>
              <span>${bookingData.owner_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Số điện thoại:</span>
              <span>${bookingData.owner_phone}</span>
            </div>
          </div>

          <div style="background: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4>📝 Lưu Ý Quan Trọng:</h4>
            <ul>
              <li>Vui lòng có mặt đúng giờ đặt sân</li>
              <li>Mang theo giày thể thao phù hợp</li>
              <li>Liên hệ chủ sân nếu có thay đổi lịch</li>
              <li>Giữ lại email này để đối chiếu khi cần</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          <p><small>Email này được gửi tự động, vui lòng không trả lời.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Hàm gửi email xác nhận đặt sân
const sendBookingConfirmationEmail = async (userEmail, bookingData) => {
  try {
    const mailOptions = {
      from: {
        name: 'Hệ Thống Đặt Sân',
        address: process.env.EMAIL_USER || 'anh508023@gmail.com'
      },
      to: userEmail,
      subject: `✅ Xác nhận đặt sân thành công - Mã #${bookingData.id}`,
      html: getBookingConfirmationTemplate(bookingData)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Hàm gửi email thông báo hủy đặt sân
const sendBookingCancellationEmail = async (userEmail, bookingData) => {
  try {
    const cancelTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .cancelled { color: #f44336; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Thông Báo Hủy Đặt Sân</h1>
          </div>
          
          <div class="content">
            <h2>Chào ${bookingData.user_name},</h2>
            <p>Chúng tôi xin thông báo booking của bạn đã được <span class="cancelled">hủy bỏ</span>.</p>
            
            <div class="booking-info">
              <h3>📋 Thông Tin Đặt Sân Đã Hủy</h3>
              <div class="info-row">
                <span class="label">Mã đặt sân:</span>
                <span>#${bookingData.id}</span>
              </div>
              <div class="info-row">
                <span class="label">Tên sân:</span>
                <span>${bookingData.pitch_name}</span>
              </div>
              <div class="info-row">
                <span class="label">Ngày đặt:</span>
                <span>${bookingData.formatted_date}</span>
              </div>
              <div class="info-row">
                <span class="label">Giờ chơi:</span>
                <span>${bookingData.start_time} - ${bookingData.end_time}</span>
              </div>
              <div class="info-row">
                <span class="label">Trạng thái:</span>
                <span class="cancelled">Đã hủy</span>
              </div>
            </div>

            <div style="background: #ffebee; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <p>Nếu bạn có thắc mắc về việc hủy booking, vui lòng liên hệ trực tiếp với chủ sân hoặc hỗ trợ khách hàng.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: {
        name: 'Hệ Thống Đặt Sân',
        address: process.env.EMAIL_USER || 'anh508023@gmail.com'
      },
      to: userEmail,
      subject: `❌ Thông báo hủy đặt sân - Mã #${bookingData.id}`,
      html: cancelTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail
};