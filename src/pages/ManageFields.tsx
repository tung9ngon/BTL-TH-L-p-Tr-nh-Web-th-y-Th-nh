import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Layout,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft"; // Đảm bảo đúng đường dẫn

const { Title } = Typography;
const { confirm } = Modal;
const { Sider, Content } = Layout;

interface Field {
  id: string;
  name: string;
  description: string;
  type: string;
  goals: number;
  price: number;
}

const initialFields: Field[] = [
  {
    id: "1",
    name: "Sân A",
    description: "Sân nhân tạo đẹp, thoáng mát",
    type: "5 người",
    goals: 2,
    price: 500000,
  },
  {
    id: "2",
    name: "Sân B",
    description: "Sân tiêu chuẩn FIFA",
    type: "7 người",
    goals: 2,
    price: 800000,
  },
  {
    id: "3",
    name: "Sân C",
    description: "Sân mini phù hợp trẻ em",
    type: "5 người",
    goals: 1,
    price: 400000,
  },
];

const ManageFields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const handleEdit = (record: Field) => {
    message.info(`Sửa sân: ${record.name}`);
    // TODO: redirect hoặc mở form modal
  };

  const handleView = (record: Field) => {
    Modal.info({
      title: `Chi tiết sân: ${record.name}`,
      content: (
        <div>
          <p><strong>Mô tả:</strong> {record.description}</p>
          <p><strong>Loại sân:</strong> {record.type}</p>
          <p><strong>Số khung thành:</strong> {record.goals}</p>
          <p><strong>Giá thuê:</strong> {record.price.toLocaleString()} VND</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleDelete = (record: Field) => {
    confirm({
      title: `Bạn có chắc muốn xóa sân "${record.name}"?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setFields(fields.filter((field) => field.id !== record.id));
        message.success("Xóa thành công!");
      },
    });
  };

  const columns: ColumnsType<Field> = [
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại sân",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Khung thành",
      dataIndex: "goals",
      key: "goals",
    },
    {
      title: "Giá thuê (VND)",
      dataIndex: "price",
      key: "price",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: "#fff" }}>
        <div style={{ padding: 16, fontWeight: "bold", fontSize: 18 }}>⚽ FootballBooking</div>
        <MenuLeft />
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
          <Title level={4}>Danh sách sân bóng</Title>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={fields}
            pagination={{
              current: currentPage,
              pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageFields;
