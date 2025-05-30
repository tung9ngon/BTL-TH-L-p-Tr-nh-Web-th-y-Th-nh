import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Badge,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Space,
  Divider,
  Select,
  Rate,
  Tag,
  List,
  Dropdown,
  Pagination,
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  ReadOutlined,
  SearchOutlined,
  StarOutlined,
  WifiOutlined,
  CoffeeOutlined,
  LogoutOutlined,
  EditOutlined,
  ProfileOutlined,
  InfoCircleOutlined,
  StarFilled,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface FootballField {
  id: string;
  title: string;
  location: string;
  pitches: number;
  rating: number;
  reviews: number;
  features: string[];
  times: string[];
  city: string;
  price: number;
  description: string;
  images: string[];
  amenities: {
    parking: boolean;
    showers: boolean;
    locker: boolean;
    drinks: boolean;
  };
  address: string;
  phone: string;
  openingHours: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const pageSize = 6;

  const footballFields: FootballField[] = [
    {
      id: 'field-1',
      title: 'Sân bóng KARA Sport khu đô thị Hòa Quý',
      location: 'Quận Ngũ Hành Sơn - Đà Nẵng',
      city: 'danang',
      pitches: 4,
      rating: 4.5,
      reviews: 12,
      features: ['Sân trống', 'Wifi', 'Căng tin'],
      times: ['15:00', '17:30', '19:00'],
      price: 300000,
      description: 'Sân bóng đá cỏ nhân tạo chất lượng cao, đạt tiêu chuẩn quốc tế. Sân có 4 mặt cỏ nhân tạo mới nhất, hệ thống chiếu sáng hiện đại, phòng thay đồ rộng rãi.',
      images: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: true
      },
      address: '56 Đặng Thái Trâm, Khu đô thị Hòa Quý, Ngũ Hành Sơn, Đà Nẵng',
      phone: '0905 123 456',
      openingHours: '06:00 - 23:00 hàng ngày'
    },
    {
      id: 'field-2',
      title: 'Sân cỏ nhân tạo Đại Học Bách Khoa',
      location: 'Quận Đống Đa - Hà Nội',
      city: 'hanoi',
      pitches: 3,
      rating: 4.2,
      reviews: 8,
      features: ['Sân trống', 'Wifi'],
      times: ['15:00', '17:30', '19:00'],
      price: 250000,
      description: 'Sân bóng đá cỏ nhân tạo trong khuôn viên Đại học Bách Khoa Hà Nội. Mặt cỏ mới, hệ thống thoát nước tốt.',
      images: [
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: false,
        locker: true,
        drinks: true
      },
      address: '1 Đại Cồ Việt, Đống Đa, Hà Nội',
      phone: '0905 234 567',
      openingHours: '05:30 - 22:00 hàng ngày'
    },
    {
      id: 'field-3',
      title: 'Sân bóng Hồng Hà',
      location: 'Quận Hoàng Mai - Hà Nội',
      city: 'hanoi',
      pitches: 2,
      rating: 4.0,
      reviews: 5,
      features: ['Sân trống', 'Căng tin'],
      times: ['15:00', '17:30', '19:00'],
      price: 180000,
      description: 'Sân bóng đá cỏ nhân tạo chất lượng tốt tại quận Hoàng Mai. Có 2 sân cỏ nhân tạo đạt tiêu chuẩn.',
      images: [
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: false,
        drinks: true
      },
      address: '123 Minh Khai, Hoàng Mai, Hà Nội',
      phone: '0905 345 678',
      openingHours: '06:00 - 22:30 hàng ngày'
    },
    {
      id: 'field-4',
      title: 'Sân bóng đá cỏ nhân tạo Thống Nhất',
      location: 'Quận Tân Bình - Hồ Chí Minh',
      city: 'hcm',
      pitches: 5,
      rating: 4.7,
      reviews: 18,
      features: ['Sân trống', 'Wifi', 'Căng tin'],
      times: ['15:00', '17:30', '19:00'],
      price: 350000,
      description: 'Sân bóng đá cỏ nhân tạo lớn tại TP.HCM với 5 sân đạt tiêu chuẩn. Cơ sở vật chất hiện đại, dịch vụ chuyên nghiệp.',
      images: [
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: true
      },
      address: '45 Trường Chinh, Tân Bình, TP.HCM',
      phone: '0905 456 789',
      openingHours: '05:00 - 24:00 hàng ngày'
    },
    {
      id: 'field-5',
      title: 'Sân bóng Anh Dũng',
      location: 'Thành phố Hạ Long - Quảng Ninh',
      city: 'quangninh',
      pitches: 1,
      rating: 5,
      reviews: 1,
      features: ['Sân trống'],
      times: ['15:00', '17:30', '19:00'],
      price: 150000,
      description: 'Sân bóng đá cỏ nhân tạo tại Hạ Long với chất lượng tốt, giá cả phải chăng. Phù hợp cho các nhóm bạn đá phong trào.',
      images: [
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: false,
        locker: false,
        drinks: true
      },
      address: '78 Hạ Long, Bãi Cháy, Quảng Ninh',
      phone: '0905 567 890',
      openingHours: '07:00 - 21:00 hàng ngày'
    },
    {
      id: 'field-6',
      title: 'Sân bóng Trường Sơn',
      location: 'Thành phố Vĩnh Yên - Vĩnh Phúc',
      city: 'other',
      pitches: 1,
      rating: 4.8,
      reviews: 3,
      features: ['Sân trống', 'Wifi'],
      times: ['15:00', '17:30', '19:00'],
      price: 200000,
      description: 'Sân bóng đá cỏ nhân tạo tại Vĩnh Yên, Vĩnh Phúc. Mặt cỏ mới, hệ thống chiếu sáng tốt.',
      images: [
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: false,
        locker: false,
        drinks: true
      },
      address: '12 Trường Sơn, Vĩnh Yên, Vĩnh Phúc',
      phone: '0905 678 901',
      openingHours: '06:30 - 22:00 hàng ngày'
    },
    {
      id: 'field-7',
      title: 'Sân bóng Thanh Xuân',
      location: 'Quận Thanh Xuân - Hà Nội',
      city: 'hanoi',
      pitches: 2,
      rating: 4.3,
      reviews: 7,
      features: ['Sân trống', 'Wifi'],
      times: ['16:00', '18:30', '20:00'],
      price: 220000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận Thanh Xuân. Có 2 sân cỏ nhân tạo chất lượng tốt.',
      images: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: false
      },
      address: '34 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      phone: '0905 789 012',
      openingHours: '06:00 - 23:00 hàng ngày'
    },
    {
      id: 'field-8',
      title: 'Sân bóng Sơn Trà',
      location: 'Quận Sơn Trà - Đà Nẵng',
      city: 'danang',
      pitches: 3,
      rating: 4.1,
      reviews: 6,
      features: ['Sân trống', 'Căng tin'],
      times: ['14:00', '16:30', '18:00'],
      price: 280000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận Sơn Trà, Đà Nẵng. Có 3 sân cỏ nhân tạo chất lượng.',
      images: [
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: true
      },
      address: '89 Lê Văn Hiến, Sơn Trà, Đà Nẵng',
      phone: '0905 890 123',
      openingHours: '05:30 - 23:30 hàng ngày'
    },
    {
      id: 'field-9',
      title: 'Sân bóng Phú Thọ',
      location: 'Quận 11 - Hồ Chí Minh',
      city: 'hcm',
      pitches: 5,
      rating: 4.4,
      reviews: 9,
      features: ['Sân trống', 'Wifi', 'Căng tin'],
      times: ['15:30', '17:00', '19:30'],
      price: 320000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận 11, TP.HCM. Có 5 sân cỏ nhân tạo chất lượng cao.',
      images: [
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: true
      },
      address: '23 Phú Thọ, Quận 11, TP.HCM',
      phone: '0905 901 234',
      openingHours: '05:00 - 24:00 hàng ngày'
    },
    {
      id: 'field-10',
      title: 'Sân bóng Gò Vấp',
      location: 'Quận Gò Vấp - Hồ Chí Minh',
      city: 'hcm',
      pitches: 4,
      rating: 4.6,
      reviews: 11,
      features: ['Sân trống', 'Wifi'],
      times: ['16:00', '18:00', '20:00'],
      price: 300000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận Gò Vấp, TP.HCM. Có 4 sân cỏ nhân tạo chất lượng tốt.',
      images: [
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: false
      },
      address: '56 Quang Trung, Gò Vấp, TP.HCM',
      phone: '0905 012 345',
      openingHours: '06:00 - 23:30 hàng ngày'
    },
    {
      id: 'field-11',
      title: 'Sân bóng Hải Châu',
      location: 'Quận Hải Châu - Đà Nẵng',
      city: 'danang',
      pitches: 2,
      rating: 4.0,
      reviews: 4,
      features: ['Sân trống'],
      times: ['15:00', '17:00', '19:00'],
      price: 240000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận Hải Châu, Đà Nẵng. Có 2 sân cỏ nhân tạo chất lượng.',
      images: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: false,
        locker: true,
        drinks: false
      },
      address: '78 Hải Phòng, Hải Châu, Đà Nẵng',
      phone: '0905 123 456',
      openingHours: '06:00 - 22:30 hàng ngày'
    },
    {
      id: 'field-12',
      title: 'Sân bóng Cầu Giấy',
      location: 'Quận Cầu Giấy - Hà Nội',
      city: 'hanoi',
      pitches: 3,
      rating: 4.5,
      reviews: 10,
      features: ['Sân trống', 'Wifi', 'Căng tin'],
      times: ['14:30', '16:30', '18:30'],
      price: 270000,
      description: 'Sân bóng đá cỏ nhân tạo tại quận Cầu Giấy, Hà Nội. Có 3 sân cỏ nhân tạo chất lượng cao.',
      images: [
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543357480-c60d400e2ef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      amenities: {
        parking: true,
        showers: true,
        locker: true,
        drinks: true
      },
      address: '12 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      phone: '0905 234 567',
      openingHours: '05:30 - 23:00 hàng ngày'
    },
  ];

  const services = [
    'Tư vấn đầu tư thể thao',
    'Thiết kế & thi công sân thể thao',
    'Phần mềm quản lý thể thao',
    'Quảng cáo trên sân thể thao',
    'Dịch vụ đặt sân & Tin đối',
    'Phần mềm tổ chức giải đấu',
  ];

  const policies = [
    'Chính sách bảo mật',
    'Điều khoản sử dụng',
    'Hướng dẫn đổi trả',
    'Cam kết chất lượng',
    'Giao hàng & lắp đặt',
    'Đặt hàng & Thanh toán',
  ];

  const cityContacts = {
    hanoi: {
      address: 'Số 56 Đặng Thái Trâm - Dịch Vọng - Cầu Giấy - Hà Nội',
      phone: '024 1234 5678',
      email: 'hanoi@thegioithethao.vn',
      hotline: '0904 123 456'
    },
    haiduong: {
      address: 'Số 78 Nguyễn Lương Bằng - TP Hải Dương - Hải Dương',
      phone: '0220 1234 567',
      email: 'haiduong@thegioithethao.vn',
      hotline: '0904 234 567'
    },
    danang: {
      address: 'Số 89 Lê Văn Hiến - Sơn Trà - Đà Nẵng',
      phone: '0236 1234 567',
      email: 'danang@thegioithethao.vn',
      hotline: '0904 345 678'
    },
    quangninh: {
      address: 'Số 12 Hạ Long - Bãi Cháy - Quảng Ninh',
      phone: '0203 1234 567',
      email: 'quangninh@thegioithethao.vn',
      hotline: '0904 456 789'
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        Xem thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Chỉnh sửa trang cá nhân
      </Menu.Item>  
      <Menu.Item key="bill" icon={<BarChartOutlined />}>
        Lịch sử giao dịch
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Filter logic
  const filteredFields = footballFields.filter(field => {
    // Search term filter
    const matchesSearch = field.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Location filter
    const matchesLocation = locationFilter === 'all' || field.city === locationFilter;
    
    // Rating filter
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '5' && field.rating === 5) ||
                         (ratingFilter === '4' && field.rating >= 4) ||
                         (ratingFilter === '3' && field.rating >= 3);
    
    // Price filter
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'low' && field.price < 200000) ||
                        (priceFilter === 'medium' && field.price >= 200000 && field.price <= 500000) ||
                        (priceFilter === 'high' && field.price > 500000);
    
    return matchesSearch && matchesLocation && matchesRating && matchesPrice;
  });

  // Pagination logic
  const currentFields = filteredFields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFieldClick = (fieldId: string) => {
    navigate(`/field/${fieldId}`);
  };

  const handleBookNow = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/booking/${fieldId}`);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };
  const gotoComments = () => {
    navigate('/comments')
  };  
  const renderContactInfo = () => {
    if (!selectedCity) return null;
    
    const contact = cityContacts[selectedCity as keyof typeof cityContacts];
    if (!contact) return null;
    
    return (
      <div style={{ marginTop: 16 }}>
        <Text style={{ display: 'block' }}>Địa chỉ: {contact.address}</Text>
        <Text style={{ display: 'block' }}>Điện thoại: {contact.phone}</Text>
        <Text style={{ display: 'block' }}>Email: {contact.email}</Text>
        <Text style={{ display: 'block' }}>Hotline: {contact.hotline}</Text>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER */}
      <Header style={{
        background: '#fff',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 10,
        height: 64,
        lineHeight: '64px',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#1890ff', marginRight: 24 }}>
          Football Booking
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ flex: 1, borderBottom: 'none' }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />} onClick={gotoComments}>Đánh giá</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
        </Menu>
        <Space size="middle">
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </Space>
      </Header>

      {/* SEARCH SECTION */}
      <div style={{ background: '#fff', padding: '24px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong>Tìm sân theo</Text>
              <Input 
                placeholder="Tìm sân bóng..." 
                prefix={<SearchOutlined />} 
                style={{ marginTop: 8 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong>Khu vực</Text>
              <Select 
                defaultValue="all" 
                style={{ width: '100%', marginTop: 8 }}
                onChange={(value) => setLocationFilter(value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="hanoi">Hà Nội</Option>
                <Option value="danang">Đà Nẵng</Option>
                <Option value="quangninh">Quảng Ninh</Option>
                <Option value="other">Khu vực khác</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong>Đánh giá</Text>
              <Select 
                defaultValue="all" 
                style={{ width: '100%', marginTop: 8 }}
                onChange={(value) => setRatingFilter(value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="5">5 sao</Option>
                <Option value="4">4 sao trở lên</Option>
                <Option value="3">3 sao trở lên</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong>Mức giá</Text>
              <Select 
                defaultValue="all" 
                style={{ width: '100%', marginTop: 8 }}
                onChange={(value) => setPriceFilter(value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="low">Dưới 200k</Option>
                <Option value="medium">200k-500k</Option>
                <Option value="high">Trên 500k</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Button 
          type="primary" 
          style={{ marginTop: 16 }}
          onClick={handleSearch}
        >
          Tìm sân
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <Content style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            {filteredFields.length > 0 ? 
              `Có ${filteredFields.length} sân bóng đá phù hợp` : 
              'Không tìm thấy sân bóng phù hợp'}
          </Title>
        </div>

        <Divider orientation="left">
          <Text strong>SÂN BÓNG ĐÁ NỔI BẬT</Text>
        </Divider>

        <Row gutter={[16, 16]}>
          {currentFields.map((field, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8}>
              <Card
                hoverable
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                onClick={() => handleFieldClick(field.id)}
                cover={
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img 
                      alt={field.title} 
                      src={field.images?.[0] || 'https://via.placeholder.com/300x200?text=Football+Field'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                }
              >
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ marginBottom: 8 }}>{field.title}</Title>
                  <Text type="secondary">{field.location}</Text>
                  {field.pitches && (
                    <div style={{ marginTop: 8 }}>
                      <Text>Số sân: {field.pitches}</Text>
                    </div>
                  )}
                  
                  <div style={{ margin: '12px 0' }}>
                    <Rate 
                      disabled 
                      defaultValue={field.rating} 
                      style={{ fontSize: 14 }} 
                      character={<StarOutlined />}
                    />
                    <Text type="secondary" style={{ marginLeft: 8 }}>({field.reviews} đánh giá)</Text>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    {field.features.map((feature, i) => (
                      <Tag key={i} icon={
                        feature === 'Wifi' ? <WifiOutlined /> : 
                        feature === 'Căng tin' ? <CoffeeOutlined /> : null
                      }>
                        {feature}
                      </Tag>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                    {field.price.toLocaleString()} VND/giờ
                  </Text>
                  <Button 
                    type="primary" 
                    onClick={(e) => handleBookNow(field.id, e)}
                  >
                    Đặt sân
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={filteredFields.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>

        <Divider>DỊCH VỤ ĐẶT SÂN BÓNG</Divider>
      </Content>

      {/* FOOTER */}
      <Footer style={{ background: '#f0f2f5', padding: '24px 20px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Title level={5}>Kết nối với Thế Giới Thể Thao</Title>
            <div style={{ marginTop: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={6}>
                  <Text 
                    strong 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCityClick('hanoi')}
                  >
                    Hà Nội
                  </Text>
                </Col>
                <Col span={6}>
                  <Text 
                    strong 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCityClick('haiduong')}
                  >
                    Hải Dương
                  </Text>
                </Col>
                <Col span={6}>
                  <Text 
                    strong 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCityClick('danang')}
                  >
                    Đà Nẵng
                  </Text>
                </Col>
                <Col span={6}>
                  <Text 
                    strong 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCityClick('quangninh')}
                  >
                    Quảng Ninh
                  </Text>
                </Col>
              </Row>
              {renderContactInfo()}
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <Title level={5}>Chính sách</Title>
            <List
              size="small"
              dataSource={policies}
              renderItem={item => <List.Item>{item}</List.Item>}
              style={{ marginTop: 16 }}
            />
          </Col>
          
          <Col xs={24} md={8}>
            <Title level={5}>Dịch vụ</Title>
            <List
              size="small"
              dataSource={services}
              renderItem={item => <List.Item>{item}</List.Item>}
              style={{ marginTop: 16 }}
            />
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Text>Copyright ©2025 TheGioiTheThao.vn. Sản quyền thuộc về Thế Giới Thể Thao</Text>
          <div style={{ marginTop: 8 }}>
            <Text>Công ty Cổ Phần Ollu Trì Vũ Xây Dựng Thế Giới Thể Thao</Text>
          </div>
          <div style={{ marginTop: 8 }}>
            <Text>Giấy chứng nhận đăng ký kinh doanh số: 0801445522</Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage;