import React from "react";
import { Layout, Form, Input, Select, Checkbox, Button, Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft";

const { Content, Sider } = Layout;
const { Dragger } = Upload;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: "#fff" }}>
        <div style={{ padding: 16, fontWeight: "bold", fontSize: 18 }}>⚽ FootballBooking</div>
        <MenuLeft />
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
          <Title level={4} style={{ background: "#faad14", padding: 8, borderRadius: 4, color: "#fff" }}>
            Thông tin sân bóng
          </Title>

          <Form layout="vertical" style={{ marginTop: 24 }}>
            <Form.Item label="Tên sân">
              <Input placeholder="Sân ABC" />
            </Form.Item>

            <Form.Item label="Mô tả sân">
              <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về sân bóng..." />
            </Form.Item>

            <Form.Item label="Loại sân">
              <Select defaultValue="5 người">
                <Select.Option value="5 người">5 người</Select.Option>
                <Select.Option value="7 người">7 người</Select.Option>
                <Select.Option value="11 người">11 người</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Số lượng khung thành">
              <Checkbox.Group>
                <Checkbox value="1">1 khung</Checkbox>
                <Checkbox value="2">2 khung</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item label="Giá thuê (VND)">
              <Input placeholder="500.000" />
            </Form.Item>

            <Form.Item label="Hình ảnh sân">
              <Dragger>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Kéo ảnh vào hoặc bấm để tải lên</p>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
