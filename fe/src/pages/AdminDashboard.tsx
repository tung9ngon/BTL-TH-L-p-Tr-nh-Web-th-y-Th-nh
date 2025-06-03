import React, { useState } from "react";
import { 
  Layout, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Button, 
  Upload, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Divider,
  InputNumber,
  Space,
  message
} from "antd";
import { InboxOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft";

const { Content, Sider } = Layout;
const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Option } = Select;

type FieldType = {
  fieldName: string;
  description: string;
  address: string;
  mainImage: any[];
  isComplex: boolean;
  subFields: {
    name: string;
    type: string;
    goals: number;
    price: number;
    status: string;
    image: any[];
  }[];
};

const AdminDashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [isComplex, setIsComplex] = useState(false);

  const onFinish = (values: FieldType) => {
    console.log('Received values:', values);
    message.success('Thêm sân bóng thành công!');
    form.resetFields();
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
          <Card 
            title={<Title level={4} style={{ margin: 0, color: "#1890ff" }}>Thông tin sân bóng</Title>}
            bordered={false}
            headStyle={{ borderBottom: "1px solid #f0f0f0" }}
          >
            <Form<FieldType>
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ isComplex: false, subFields: [{}] }}
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label={<Text strong>Tên sân bóng</Text>}
                    name="fieldName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sân!' }]}
                  >
                    <Input placeholder="VD: Sân bóng KARA" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={<Text strong>Mô tả sân</Text>}
                    name="description"
                  >
                    <Input.TextArea rows={3} placeholder="Mô tả chi tiết về sân bóng..." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={<Text strong>Địa chỉ</Text>}
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={<Text strong>Hình ảnh chính</Text>}
                    name="mainImage"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Vui lòng tải lên ít nhất 1 ảnh!' }]}
                  >
                    <Dragger 
                      multiple={false}
                      beforeUpload={() => false}
                      accept="image/*"
                      listType="picture-card"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: "#1890ff" }} />
                      </p>
                      <p className="ant-upload-text">Nhấn hoặc kéo thả ảnh vào đây</p>
                      <p className="ant-upload-hint">Hỗ trợ định dạng JPG, PNG</p>
                    </Dragger>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="isComplex"
                    valuePropName="checked"
                  >
                    <Checkbox onChange={(e) => setIsComplex(e.target.checked)}>
                      <Text strong>Đây là khu sân có nhiều sân con</Text>
                    </Checkbox>
                  </Form.Item>
                </Col>

                {isComplex && (
                  <Col span={24}>
                    <Divider orientation="left" style={{ color: "#1890ff" }}>
                      <Text strong>Thông tin các sân con</Text>
                    </Divider>
                    
                    <Form.List name="subFields">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Card 
                              key={key} 
                              style={{ marginBottom: 16, borderColor: "#d9d9d9" }}
                              title={`Sân con ${name + 1}`}
                              extra={
                                <Button
                                  type="text"
                                  danger
                                  icon={<MinusOutlined />}
                                  onClick={() => remove(name)}
                                />
                              }
                            >
                              <Row gutter={16}>
                                <Col span={24}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    label={<Text strong>Tên sân con</Text>}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên sân con!' }]}
                                  >
                                    <Input placeholder="VD: Sân A1" />
                                  </Form.Item>
                                </Col>

                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    label={<Text strong>Loại sân</Text>}
                                    rules={[{ required: true, message: 'Vui lòng chọn loại sân!' }]}
                                  >
                                    <Select placeholder="Chọn loại sân">
                                      <Option value="5 người">5 người</Option>
                                      <Option value="7 người">7 người</Option>
                                      <Option value="11 người">11 người</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>

                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'goals']}
                                    label={<Text strong>Số khung thành</Text>}
                                    rules={[{ required: true, message: 'Vui lòng chọn số khung thành!' }]}
                                  >
                                    <Select placeholder="Chọn số khung thành">
                                      <Option value={1}>1 khung</Option>
                                      <Option value={2}>2 khung</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>

                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    label={<Text strong>Giá thuê (VND)</Text>}
                                    rules={[{ required: true, message: 'Vui lòng nhập giá thuê!' }]}
                                  >
                                    <InputNumber 
                                      style={{ width: '100%' }}
                                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                      placeholder="500.000"
                                    />
                                  </Form.Item>
                                </Col>

                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'status']}
                                    label={<Text strong>Trạng thái</Text>}
                                    initialValue="available"
                                  >
                                    <Select placeholder="Chọn trạng thái">
                                      <Option value="available">Có sẵn</Option>
                                      <Option value="maintenance">Bảo trì</Option>
                                      <Option value="booked">Đã đặt</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>

                                <Col span={24}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'image']}
                                    label={<Text strong>Hình ảnh sân con</Text>}
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                  >
                                    <Dragger 
                                      multiple={false}
                                      beforeUpload={() => false}
                                      accept="image/*"
                                    >
                                      <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: "#1890ff" }} />
                                      </p>
                                      <p className="ant-upload-text">Nhấn hoặc kéo thả ảnh vào đây</p>
                                    </Dragger>
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Thêm sân con
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Col>
                )}

                {!isComplex && (
                  <>
                    <Col span={12}>
                      <Form.Item
                        name="type"
                        label={<Text strong>Loại sân</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn loại sân!' }]}
                      >
                        <Select placeholder="Chọn loại sân">
                          <Option value="5 người">5 người</Option>
                          <Option value="7 người">7 người</Option>
                          <Option value="11 người">11 người</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="goals"
                        label={<Text strong>Số khung thành</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn số khung thành!' }]}
                      >
                        <Select placeholder="Chọn số khung thành">
                          <Option value={1}>1 khung</Option>
                          <Option value={2}>2 khung</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="price"
                        label={<Text strong>Giá thuê (VND)</Text>}
                        rules={[{ required: true, message: 'Vui lòng nhập giá thuê!' }]}
                      >
                        <InputNumber 
                          style={{ width: '100%' }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                          placeholder="500.000"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="status"
                        label={<Text strong>Trạng thái</Text>}
                        initialValue="available"
                      >
                        <Select placeholder="Chọn trạng thái">
                          <Option value="available">Có sẵn</Option>
                          <Option value="maintenance">Bảo trì</Option>
                          <Option value="booked">Đã đặt</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}

                <Col span={24}>
                  <Form.Item style={{ marginTop: 24 }}>
                    <Space>
                      <Button type="primary" htmlType="submit" size="large">
                        Lưu thông tin
                      </Button>
                      <Button htmlType="reset" size="large">
                        Đặt lại
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;