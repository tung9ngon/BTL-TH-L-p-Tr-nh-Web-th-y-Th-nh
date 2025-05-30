import React from 'react';
import { Menu, Divider, Button, Layout, Typography } from 'antd';
import { 
  HomeOutlined, 
  CreditCardOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

interface UserMenuLeftProps {
  collapsed: boolean;
  currentPath: string;
}

const UserMenuLeft: React.FC<UserMenuLeftProps> = ({ collapsed, currentPath }) => {
  const navigate = useNavigate();

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => navigate('/')
    },
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: 'Thanh toán',
      onClick: () => navigate('/payments')
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/settings')
    },
  ];

  return (
    <Sider 
      width={250}
      collapsed={collapsed}
      collapsedWidth={80}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ padding: collapsed ? '16px 8px' : '16px 24px', textAlign: collapsed ? 'center' : 'left' }}>
        <Text strong style={{ color: '#1890ff', fontSize: collapsed ? '16px' : '18px' }}>
          {collapsed ? 'FB' : 'Football Booking'}
        </Text>
      </div>

      <Divider style={{ margin: 0 }} />

      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        style={{ borderRight: 0 }}
        items={items}
      />

      <Divider style={{ margin: 0 }} />

      <div style={{ padding: '16px', position: 'absolute', bottom: 0, width: '100%' }}>
        <Button 
          type="text" 
          danger 
          icon={<LogoutOutlined />} 
          block 
          style={{ textAlign: 'left', height: 'auto', padding: collapsed ? '8px 0' : '8px 16px' }}
          onClick={() => {
            // Add your logout logic here
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