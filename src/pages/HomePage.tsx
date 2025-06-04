import React, { useState, useEffect } from 'react';

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
  Spin,
  message,
  Empty,
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
  CarOutlined,
  LockOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface FootballField {
  id: string;
  name: string;
  title?: string;
  location: string;
  price_per_hour: number;
  price?: number;
  pitch_type_id: number;
  avatar: string;
  status: string;
  created_at: string;
  owner_id: string;
  avg_rating?: number;
  reviews?: number;
  features?: string[];
  times?: string[];
  description?: string;
  images?: string[];
  amenities?: {
    parking: boolean;
    showers: boolean;
    locker: boolean;
    drinks: boolean;
  };
  phone?: string;
  openingHours?: string;
  city?: string;
}

class PitchService {
  private baseURL = 'http://localhost:5000/api';

  async getAllPitches(): Promise<FootballField[]> {
    try {
      const response = await fetch(`${this.baseURL}/pitches`);
      if (!response.ok) {
        throw new Error('Failed to fetch pitches');
      }
      const data = await response.json();
      return data.data; // Lưu ý: truy cập vào trường data của response
    } catch (error) {
      console.error('Error fetching pitches:', error);
      throw error;
    }
  }

  async getPitchesByOwner(ownerId: string): Promise<FootballField[]> {
    try {
      const response = await fetch(`${this.baseURL}/owner/${ownerId}/pitches`);
      if (!response.ok) {
        throw new Error('Failed to fetch owner pitches');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching owner pitches:', error);
      throw error;
    }
  }

  async searchPitches(params: {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    pitchType?: string;
  }): Promise<FootballField[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.location) queryParams.append('location', params.location);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.pitchType) queryParams.append('pitchType', params.pitchType);

      const response = await fetch(`${this.baseURL}/pitches/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to search pitches');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching pitches:', error);
      throw error;
    }
  }
}

const pitchService = new PitchService();

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [pitchTypeFilter, setPitchTypeFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [footballFields, setFootballFields] = useState<FootballField[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredFields, setFilteredFields] = useState<FootballField[]>([]);
  const navigate = useNavigate();
  const pageSize = 6;

  const pitchTypes = [
    { id: 1, name: 'Sân 5 người' },
    { id: 2, name: 'Sân 7 người' },
    { id: 3, name: 'Sân 11 người' },
  ];

  const locationMapping = {
    'hanoi': ['hà nội', 'hanoi', 'ha noi'],
    'danang': ['đà nẵng', 'da nang', 'đa nẵng'],
    'hcm': ['hồ chí minh', 'ho chi minh', 'sài gòn', 'saigon', 'tp.hcm', 'hcm'],
    'quangninh': ['quảng ninh', 'quang ninh', 'hạ long', 'ha long']
  };

  const getCityFromLocation = (location: string): string => {
    const lowerLocation = location.toLowerCase();
    for (const [city, variations] of Object.entries(locationMapping)) {
      if (variations.some(variation => lowerLocation.includes(variation))) {
        return city;
      }
    }
    return 'other';
  };

  const getRandomPitchType = () => {
    const types = [5, 7, 11];
    return types[Math.floor(Math.random() * types.length)];
  };

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        setLoading(true);
        const pitches = await pitchService.getAllPitches();
        
        // Transform data and add city field
        const transformedPitches = pitches.map(pitch => ({
          ...pitch,
          city: getCityFromLocation(pitch.location),
          title: pitch.name,
          price: pitch.price_per_hour,
          rating: pitch.avg_rating || 4.0 + Math.random() * 1,
          reviews: pitch.reviews || Math.floor(Math.random() * 20) + 1,
          features: pitch.features || ['Wifi', 'Nước uống'],
          description: pitch.description || `Sân bóng đá chất lượng cao tại ${pitch.location}`,
          images: pitch.images || [
            pitch.avatar || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          ],
          amenities: pitch.amenities || {
            parking: true,
            showers: Math.random() > 0.5,
            locker: Math.random() > 0.5,
            drinks: Math.random() > 0.3,
          },
          phone: pitch.phone || '0905 123 456',
          openingHours: pitch.openingHours || '06:00 - 23:00 hàng ngày'
        }));
        
        setFootballFields(transformedPitches);
        setFilteredFields(transformedPitches);
      } catch (error) {
        message.error('Không thể tải dữ liệu sân bóng');
        console.error('Error fetching pitches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPitches();
  }, []);

  useEffect(() => {
    let filtered = footballFields.filter(field => {
      const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = locationFilter === 'all' || field.city === locationFilter;

      const matchesRating = ratingFilter === 'all' ||
        (ratingFilter === '5' && (field.avg_rating || 0) >= 4.5) ||
        (ratingFilter === '4' && (field.avg_rating || 0) >= 4) ||
        (ratingFilter === '3' && (field.avg_rating || 0) >= 3);

      const matchesPrice = priceFilter === 'all' ||
        (priceFilter === 'low' && (field.price || field.price_per_hour) < 200000) ||
        (priceFilter === 'medium' && (field.price || field.price_per_hour) >= 200000 && (field.price || field.price_per_hour) <= 500000) ||
        (priceFilter === 'high' && (field.price || field.price_per_hour) > 500000);

      const matchesPitchType = pitchTypeFilter === 'all' || field.pitch_type_id === Number(pitchTypeFilter);

      return matchesSearch && matchesLocation && matchesRating && matchesPrice && matchesPitchType;
    });

    setFilteredFields(filtered);
    setCurrentPage(1);
  }, [footballFields, searchTerm, locationFilter, ratingFilter, priceFilter, pitchTypeFilter]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      // Build search parameters
      const searchParams: any = {};
      
      if (searchTerm) {
        searchParams.search = searchTerm;
      }
      
      if (locationFilter !== 'all') {
        // Convert location filter to actual location names for API search
        const locationNames = locationMapping[locationFilter as keyof typeof locationMapping];
        if (locationNames && locationNames.length > 0) {
          searchParams.location = locationNames[0]; // Use first variation for API call
        }
      }
      
      if (priceFilter === 'low') {
        searchParams.maxPrice = 200000;
      } else if (priceFilter === 'medium') {
        searchParams.minPrice = 200000;
        searchParams.maxPrice = 500000;
      } else if (priceFilter === 'high') {
        searchParams.minPrice = 500000;
      }
      
      if (pitchTypeFilter !== 'all') {
        searchParams.pitchType = pitchTypeFilter;
      }

      const results = await pitchService.searchPitches(searchParams);
      
      const transformedResults = results.map(pitch => ({
        ...pitch,
        city: getCityFromLocation(pitch.location),
        title: pitch.name,
        price: pitch.price_per_hour,
        rating: pitch.avg_rating || 4.0 + Math.random() * 1,
        reviews: pitch.reviews || Math.floor(Math.random() * 20) + 1,
        features: pitch.features || ['Wifi', 'Nước uống'],
        description: pitch.description || `Sân bóng đá chất lượng cao tại ${pitch.location}`,
        images: pitch.images || [
          pitch.avatar || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        amenities: pitch.amenities || {
          parking: true,
          showers: Math.random() > 0.5,
          locker: Math.random() > 0.5,
          drinks: Math.random() > 0.3,
        },
        phone: pitch.phone || '0905 123 456',
        openingHours: pitch.openingHours || '06:00 - 23:00 hàng ngày'
      }));

      setFilteredFields(transformedResults);
      setCurrentPage(1);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm sân bóng');
    } finally {
      setLoading(false);
    }
  };

  const currentFields = filteredFields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFieldClick = (fieldId: string) => {
  navigate(`/field/${fieldId}`); // Chỉ cần navigate với fieldId trong URL
  console.log('Navigating to field:', fieldId);
};

  const handleBookNow = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/booking/${fieldId}`);
    console.log('Book field:', fieldId);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const gotoComments = () => {
    navigate(`/comments`)
    console.log('Navigate to comments');
  };

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
      <Menu.Item key="bill" icon={<BarChartOutlined />}>
        Lịch sử giao dịch
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'parking': return <CarOutlined />;
      case 'showers': return <WifiOutlined />;
      case 'locker': return <LockOutlined />;
      case 'drinks': return <CoffeeOutlined />;
      default: return null;
    }
  };

  const getPitchTypeName = (typeId: number) => {
    const type = pitchTypes.find(t => t.id === typeId);
    return type ? type.name : 'Không xác định';
  };

  const getPitchTypeIcon = (typeId: number) => {
    return <TeamOutlined />;
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
        <div style={{ fontWeight: 'bold', fontSize: 20, color: '#1890ff', marginRight: 24 }}>
          Football Booking
        </div>
        <Menu 
          mode="horizontal" 
          defaultSelectedKeys={['home']} 
          style={{ 
            flex: 1, 
            borderBottom: 'none',
            minWidth: 0,
            lineHeight: '62px'
          }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />} onClick={gotoComments}>Đánh giá</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
        </Menu>
        <Space size="middle" style={{ marginLeft: 'auto' }}>
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
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
      <div style={{ 
        background: '#fff', 
        padding: '16px 20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24
      }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm sân bóng..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col flex="200px">
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={(value) => setLocationFilter(value)}
              size="large"
            >
              <Option value="all">Tất cả khu vực</Option>
              <Option value="hanoi">Hà Nội</Option>
              <Option value="danang">Đà Nẵng</Option>
              <Option value="hcm">TP.HCM</Option>
              <Option value="quangninh">Quảng Ninh</Option>
            </Select>
          </Col>
          
          <Col flex="160px">
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={(value) => setPitchTypeFilter(value)}
              size="large"
            >
              <Option value="all">Tất cả loại sân</Option>
              {pitchTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Col>
          
          <Col flex="160px">
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={(value) => setPriceFilter(value)}
              size="large"
            >
              <Option value="all">Mọi mức giá</Option>
              <Option value="low">Dưới 200k</Option>
              <Option value="medium">200k-500k</Option>
              <Option value="high">Trên 500k</Option>
            </Select>
          </Col>
          
          <Col flex="none">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              size="large"
            >
              Tìm
            </Button>
          </Col>
        </Row>
      </div>

      {/* MAIN CONTENT */}
      <Content style={{ padding: '0 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            {loading ? 'Đang tải...' : (
              filteredFields.length > 0 ?
                `Có ${filteredFields.length} sân bóng đá phù hợp` :
                'Không tìm thấy sân bóng phù hợp'
            )}
          </Title>
        </div>

        <Divider orientation="left">
          <Text strong>SÂN BÓNG ĐÁ NỔI BẬT</Text>
        </Divider>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : filteredFields.length === 0 ? (
          <Empty
            description="Không tìm thấy sân bóng phù hợp"
            style={{ margin: '50px 0' }}
          />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentFields.map((field) => (
                <Col key={field.id} xs={24} sm={12} md={8} lg={8}>
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
                          alt={field.name}
                          src={field.images?.[0] || field.avatar || 'https://via.placeholder.com/300x200?text=Football+Field'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ marginBottom: 8 }}>{field.name}</Title>
                      <Text type="secondary">{field.location}</Text>
                      
                      <div style={{ marginTop: 8 }}>
                        <Tag icon={getPitchTypeIcon(field.pitch_type_id)} color="blue">
                          {getPitchTypeName(field.pitch_type_id)}
                        </Tag>
                      </div>

                      <div style={{ margin: '12px 0' }}>
                        <Rate
                          disabled
                          value={field.avg_rating || 0}
                          allowHalf
                          style={{ fontSize: 14 }}
                          character={<StarOutlined />}
                        />
                        
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        {field.amenities && Object.entries(field.amenities).map(([key, value]) =>
                          value && (
                            <Tag key={key} icon={getAmenityIcon(key)}>
                              {key === 'parking' ? 'Bãi đỗ xe' :
                                key === 'showers' ? 'Phòng tắm' :
                                  key === 'locker' ? 'Tủ đồ' :
                                    key === 'drinks' ? 'Nước uống' : key}
                            </Tag>
                          )
                        )}
                      </div>

                      {field.status && (
                        <div style={{ marginBottom: 8 }}>
                          <Tag color={field.status === 'available' ? 'green' : 'red'}>
                            {field.status === 'available' ? 'Hoạt động' : 'Tạm ngưng'}
                          </Tag>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                        {(field.price || field.price_per_hour).toLocaleString()} VND
                      </Text>
                      <Button
                        type="primary"
                        onClick={(e) => handleBookNow(field.id, e)}
                        disabled={field.status === 'maintenance'}
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
          </>
        )}

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