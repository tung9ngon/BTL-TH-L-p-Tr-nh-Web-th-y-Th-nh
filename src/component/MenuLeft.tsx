// MenuLeft.tsx
import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const MenuLeft: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.includes("/admin/fields")) return "2";
    if (location.pathname.includes("/admin/payments")) return "3";
    // if (location.pathname.includes("/admin/messages")) return "4";
    if (location.pathname.includes("/admin/dashboard")) return "5";
    return "1";
  };

  const handleLogout = () => {
    // Xử lý đăng xuất tại đây
    console.log("Logging out...");
    navigate("/admin-login");
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ height: "100%", borderRight: 0 }}
      >
        
        
        <Menu.Item key="2" icon={<FieldTimeOutlined />} onClick={() => navigate("/admin/fields")}>
          Quản lý sân
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => navigate("/admin/payments")}>
          Quản lý đơn đặt
        </Menu.Item>
        <Menu.Item key="5" icon={<BarChartOutlined/>} onClick={() => navigate("/admin/dashboard")}>
          Thống kê
        </Menu.Item>

      </Menu>

      {/* Divider và các mục ở dưới cùng */}
      <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Menu mode="inline" selectable={false}>
          <Menu.Divider />
          {/* <Menu.Item key="5" icon={<SettingOutlined />} onClick={() => navigate("/admin/settings")}>
            Cài đặt
          </Menu.Item> */}
          <Menu.Item key="6" icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default MenuLeft;
