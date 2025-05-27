import React, { useState } from "react";
import { Card, Tabs, Table, Button, Layout, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import MenuLeft from "../component/MenuLeft";

const { TabPane } = Tabs;
const { Sider, Content } = Layout;

interface Booking {
  key: string;
  name: string;
  phone: string;
  cccd: string;
  checkin: string;
  checkout: string;
  price: string;
  status: "paid" | "unpaid";
  field: string;
  timeSlot: string;
}

const initialBookings: Booking[] = [
  {
    key: "1",
    name: "Hoàng Viên",
    phone: "0775770099",
    cccd: "0480009993213",
    checkin: "20/6/2022",
    checkout: "24/6/2022",
    price: "300.000 vnđ",
    status: "unpaid",
    field: "Sân A",
    timeSlot: "18:00 - 20:00",
  },
  {
    key: "2",
    name: "Hoàng Viên",
    phone: "0775770099",
    cccd: "0480009993213",
    checkin: "25/6/2022",
    checkout: "27/6/2022",
    price: "400.000 vnđ",
    status: "paid",
    field: "Sân B",
    timeSlot: "20:00 - 22:00",
  },
  {
    key: "3",
    name: "Hoàng Viên",
    phone: "0775770099",
    cccd: "0480009993213",
    checkin: "28/6/2022",
    checkout: "30/6/2022",
    price: "500.000 vnđ",
    status: "unpaid",
    field: "Sân C",
    timeSlot: "16:00 - 18:00",
  },
];

const ManagePayment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"paid" | "unpaid">("unpaid");
  const [data, setData] = useState<Booking[]>(initialBookings);

  const handleConfirmPayment = (key: string) => {
    const newData = data.map((b) =>
      b.key === key ? { ...b, status: "paid" as const } : b
    );
    setData(newData);
    message.success("Đã xác nhận thanh toán.");
  };

  const filteredData = data.filter((b) => b.status === activeTab);

  const columns: ColumnsType<Booking> = [
    {
      title: "Thông tin người đặt phòng",
      dataIndex: "name",
      render: (_: any, record: Booking) => (
        <div>
          <div>
            <b>Họ và tên</b>: {record.name}
          </div>
          <div>
            <b>Số điện thoại</b>: {record.phone}
          </div>
          <div>
            <b>CCCD</b>: {record.cccd}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày đến - Ngày đi",
      render: (_: any, record: Booking) => (
        <div>
          {record.checkin} - {record.checkout}
        </div>
      ),
    },
    {
      title: "Giờ đặt - Sân",
      render: (_: any, record: Booking) => (
        <div>
          <div>
            <b>Giờ</b>: {record.timeSlot}
          </div>
          <div>
            <b>Sân</b>: {record.field}
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
    },
    ...(activeTab === "unpaid"
      ? [
          {
            title: "Hành động",
            render: (_: any, record: Booking) => (
              <Button
                type="primary"
                onClick={() => handleConfirmPayment(record.key)}
              >
                Xác nhận đã thanh toán
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Card>
            <Tabs
              defaultActiveKey="unpaid"
              onChange={(key) => setActiveTab(key as "paid" | "unpaid")}
              tabBarGutter={30}
            >
              <TabPane tab="Chưa thanh toán" key="unpaid" />
              <TabPane tab="Đã thanh toán" key="paid" />
            </Tabs>

            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={false}
              bordered
              style={{ marginTop: 16 }}
              rowKey="key"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagePayment;
