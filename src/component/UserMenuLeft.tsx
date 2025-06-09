import React from 'react';
import { Menu, Divider, Button, Layout, Typography } from 'antd';
import { 
  HomeOutlined, 
  CreditCardOutlined, 
  UserOutlined, 
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

interface UserMenuLeftProps {
  collapsed: boolean;
}

const UserMenuLeft: React.FC<UserMenuLeftProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy pathname hiện tại và loại bỏ '/' ở đầu nếu có
  const currentPath = location.pathname.replace(/^\//, '');

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => navigate('/home')
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: 'Thanh toán',
      onClick: () => navigate('/payment')
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/profile')
    },

  ];

  return (
    <Sider 
      width={200}
      collapsed={collapsed}
      collapsedWidth={80}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        overflow: 'auto',
        height: '96.5vh',
      }}
    >
      <div style={{ 
        padding: collapsed ? '16px 8px' : '16px 24px', 
        textAlign: collapsed ? 'center' : 'left',
      }}>
        <Text strong style={{ color: '#1890ff', fontSize: collapsed ? '16px' : '18px' }}>
          {collapsed ? 'FB' : 'Football Booking'}
        </Text>
      </div>

      <Divider style={{ margin: 0 }} />

      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        style={{ borderRight: 0, height: 'calc(100% - 145px)', overflowY: 'auto' }}
        items={items}
      />

      <div style={{ 
        padding: '16px', 
        width: '100%',
        background: '#fff',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Button 
          type="text" 
          danger 
          icon={<LogoutOutlined />} 
          block 
          style={{ textAlign: 'left', height: 'auto', padding: collapsed ? '8px 0' : '8px 16px' }}
          onClick={() => {
            navigate('/login');
            console.log('Logout clicked');
          }}
        >
          {!collapsed && 'Đăng xuất'}
        </Button>
      </div>
    </Sider>
  );
};

export default UserMenuLeft;