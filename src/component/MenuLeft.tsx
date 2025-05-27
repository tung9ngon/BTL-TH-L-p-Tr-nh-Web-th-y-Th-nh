// MenuLeft.tsx
import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const MenuLeft: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.includes("/admin/fields")) return "2";
    if (location.pathname.includes("/admin/payments")) return "3";
    if (location.pathname.includes("/admin/messages")) return "4";
    return "1";
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate("/admin")}>
        Tổng quan
      </Menu.Item>
      <Menu.Item key="2" icon={<FieldTimeOutlined />} onClick={() => navigate("/admin/fields")}>
        Quản lý sân
      </Menu.Item>
      <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => navigate("/admin/payments")}>
        Quản lý đơn đặt
      </Menu.Item>
      <Menu.Item key="4" icon={<MessageOutlined />} onClick={() => navigate("/admin/messages")}>
        Tin nhắn
      </Menu.Item>
    </Menu>
  );
};

export default MenuLeft;
