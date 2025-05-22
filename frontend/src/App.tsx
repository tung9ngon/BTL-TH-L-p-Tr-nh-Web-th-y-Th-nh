import { Layout, Typography } from 'antd';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../src/pages/SignUp';
import BookingSuccess from '../src/pages/BookingSuccess';  
import UserBookingPage from '../src/pages/UserBookingPage';
import AdminDashboard from '../src/pages/AdminDashboard';
import HomePage from '../src/pages/HomePage';
import AdminLogin from '../src/pages/AdminLogin';
import Login from '../src/pages/Login';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            ⚽ Football Booking
          </Title>
        </Header>

        <Content style={{ padding: '24px 50px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="/booking" element={<UserBookingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            {/* Add more routes as needed */}
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          ©2025 Football Field Booking App
        </Footer>
      </Layout>
    </Router>
  );
}
