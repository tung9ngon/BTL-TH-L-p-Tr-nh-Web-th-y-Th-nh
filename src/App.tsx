import { Layout, Typography } from 'antd';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../src/pages/SignUp';
import BookingSuccess from '../src/pages/BookingSuccess';  
import UserBookingPage from '../src/pages/UserBookingPage';

import HomePage from '../src/pages/HomePage';
import AdminLogin from '../src/pages/AdminLogin';
import Login from '../src/pages/Login';
import BookingHistory from '../src/component/BookingHistory';
import FieldDetailPage from '../src/pages/FieldDetailPage';
import ManageFields from "../src/pages/ManageFields";
import ManagePayment from '../src/pages/ManagePayment';
import CommentPage from '../src/pages/CommentPage';
import ContentPage from './pages/ContentPage';
import ContactPage from './pages/ContactPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import NewsPage from './pages/NewsPage';

import DashBoard from './pages/DashBoard';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%'
        }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            ⚽ Football Booking
          </Title>
        </Header>

        <Content style={{ padding: '0', margin: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/content" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="/booking/:fieldId" element={<UserBookingPage />} />
            
            <Route path="/home" element={<HomePage />} />
            <Route path="/field/:fieldId" element={<FieldDetailPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="admin/fields" element={<ManageFields />} />
            <Route path="/admin/payments" element={<ManagePayment />} />
            <Route path='/admin/dashboard' element ={<DashBoard/>} />
            <Route path="/comments" element={<CommentPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/news" element={<NewsPage />} />
            
          </Routes>
        </Content>


      </Layout>
    </Router>
  );
}