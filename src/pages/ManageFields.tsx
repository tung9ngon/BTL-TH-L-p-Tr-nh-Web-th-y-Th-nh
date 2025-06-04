import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Layout,
  Image,
  Tag,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Descriptions,
  Spin
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { Sider, Content } = Layout;
const { Item } = Descriptions;

interface Pitch {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  price_per_hour: number;
  pitch_type_id: number | null;
  status: 'available' | 'maintenance';
  created_at: string;
  avatar: string | null;
  avg_rating?: string;
  total_reviews?: number;
}

const pitchTypes = [
  { id: 1, name: "5 người" },
  { id: 2, name: "7 người" },
  { id: 3, name: "11 người" },
];

const statusColors: Record<string, string> = {
  available: 'green',
  maintenance: 'orange'
};

const statusLabels: Record<string, string> = {
  available: 'Có sẵn',
  maintenance: 'Bảo trì'
};

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

const ManageFields: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [form] = Form.useForm();
  const pageSize = 5;

  // Get owner_id from localStorage
  const getOwnerId = () => {
    return localStorage.getItem('owner_id') || localStorage.getItem('selectedFieldId') || '1';
  };

  // API calls
  const fetchPitches = async () => {
    setLoading(true);
    try {
      const ownerId = getOwnerId();
      const response = await fetch(`${API_BASE_URL}/pitches/owner/${ownerId}/pitches`);
      const data = await response.json();

      if (data.success) {
        setPitches(data.data);
      } else {
        message.error(data.message || 'Lỗi khi tải danh sách sân');
      }
    } catch (error) {
      message.error('Lỗi kết nối server');
      console.error('Error fetching pitches:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPitch = async (pitchData: any) => {
    try {
      const ownerId = getOwnerId();
      const response = await fetch(`${API_BASE_URL}/pitches/owner/${ownerId}/pitches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pitchData),
      });

      const data = await response.json();

      if (data.success) {
        message.success('Thêm sân thành công!');
        fetchPitches();
        return true;
      } else {
        message.error(data.message || 'Lỗi khi thêm sân');
        return false;
      }
    } catch (error) {
      message.error('Lỗi kết nối server');
      console.error('Error adding pitch:', error);
      return false;
    }
  };

  const updatePitch = async (pitchId: number, pitchData: any) => {
    try {
      const ownerId = getOwnerId();
      const response = await fetch(`${API_BASE_URL}/pitches/owner/${ownerId}/pitches/${pitchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pitchData),
      });

      const data = await response.json();

      if (data.success) {
        message.success('Cập nhật sân thành công!');
        fetchPitches();
        return true;
      } else {
        message.error(data.message || 'Lỗi khi cập nhật sân');
        return false;
      }
    } catch (error) {
      message.error('Lỗi kết nối server');
      console.error('Error updating pitch:', error);
      return false;
    }
  };



  // Load pitches on component mount
  useEffect(() => {
    fetchPitches();
  }, []);

  const showModal = (mode: 'view' | 'edit' | 'add', pitch?: Pitch) => {
    setModalMode(mode);
    setCurrentPitch(pitch || null);

    if (mode === 'add') {
      form.resetFields();
    } else if (pitch) {
      form.setFieldsValue({
        name: pitch.name,
        location: pitch.location,
        price_per_hour: pitch.price_per_hour,
        pitch_type_id: Number(pitch.pitch_type_id),
        status: pitch.status,
        avatar: pitch.avatar
      });
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (modalMode === 'add') {
        const success = await addPitch(values);
        if (success) {
          setIsModalVisible(false);
          form.resetFields();
        }
      } else if (modalMode === 'edit' && currentPitch) {
        const success = await updatePitch(currentPitch.id, values);
        if (success) {
          setIsModalVisible(false);
          form.resetFields();
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };



  const columns: ColumnsType<Pitch> = [
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
      width: '35%',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.avatar && (
            <Image
              src={record.avatar}
              alt={text}
              width={60}
              height={40}
              style={{ borderRadius: 4, marginRight: 12, objectFit: 'cover' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxM"
            />
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.location}</Text>
            {record.avg_rating && (
              <div style={{ fontSize: 12, color: '#faad14' }}>
                ⭐ {record.avg_rating} ({record.total_reviews || 0} đánh giá)
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Giá thuê (VND/giờ)",
      dataIndex: "price_per_hour",
      key: "price_per_hour",
      width: '15%',
      render: (value: number) => value?.toLocaleString() || '0',
    },
    {
      title: "Loại sân",
      key: "pitch_type_id",
      width: '10%',
      render: (_, record) => {
        // Convert to number để đảm bảo matching đúng
        const pitchTypeId = Number(record.pitch_type_id);
        const type = pitchTypes.find(t => t.id === pitchTypeId);
        return type ? type.name : `Không xác định (ID: ${record.pitch_type_id})`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: '10%',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showModal('view', record)}
            type="text"
            style={{ color: '#1890ff' }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal('edit', record)}
            type="text"
            style={{ color: '#52c41a' }}
          />

        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>Quản lý sân bóng</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('add')}
            >
              Thêm sân mới
            </Button>
          </div>

          <Spin spinning={loading}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={pitches}
              pagination={{
                current: currentPage,
                pageSize,
                total: pitches.length,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sân`,
              }}
              scroll={{ x: true }}
            />
          </Spin>

          {/* View Modal */}
          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 24, marginRight: 12 }} />
                <span>Thông tin chi tiết sân bóng</span>
              </div>
            }
            open={isModalVisible && modalMode === 'view'}
            width={700}
            onCancel={handleCancel}
            footer={[
              <Button key="close" onClick={handleCancel}>Đóng</Button>
            ]}
            centered
          >
            {currentPitch && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {currentPitch.avatar && (
                    <Image
                      src={currentPitch.avatar}
                      alt={currentPitch.name}
                      width={400}
                      style={{ borderRadius: 8, maxHeight: 300, objectFit: 'cover' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxM"
                    />
                  )}
                </div>

                <Descriptions bordered column={1} size="middle">
                  <Item label="Tên sân">
                    <Text strong>{currentPitch.name}</Text>
                  </Item>
                  <Item label="Địa điểm">
                    {currentPitch.location}
                  </Item>
                  <Item label="Giá thuê (VND/giờ)">
                    {currentPitch.price_per_hour?.toLocaleString() || '0'}
                  </Item>
                  <Item label="Loại sân">
                    {(() => {
                      const pitchTypeId = Number(currentPitch.pitch_type_id);
                      const type = pitchTypes.find(t => t.id === pitchTypeId);
                      return type ? type.name : `Không xác định (ID: ${currentPitch.pitch_type_id})`;
                    })()}
                  </Item>
                  <Item label="Trạng thái">
                    <Tag color={statusColors[currentPitch.status]}>
                      {statusLabels[currentPitch.status]}
                    </Tag>
                  </Item>
                  {currentPitch.avg_rating && (
                    <Item label="Đánh giá">
                      <div>
                        <span style={{ color: '#faad14' }}>⭐ {currentPitch.avg_rating}</span>
                        <span style={{ marginLeft: 8, color: '#666' }}>
                          ({currentPitch.total_reviews} đánh giá)
                        </span>
                      </div>
                    </Item>
                  )}
                  <Item label="Ngày tạo">
                    {new Date(currentPitch.created_at).toLocaleDateString('vi-VN')}
                  </Item>
                </Descriptions>
              </div>
            )}
          </Modal>

          {/* Add/Edit Modal */}
          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {modalMode === 'add' ? (
                  <PlusOutlined style={{ color: '#1890ff', fontSize: 24, marginRight: 12 }} />
                ) : (
                  <EditOutlined style={{ color: '#52c41a', fontSize: 24, marginRight: 12 }} />
                )}
                <span>{modalMode === 'add' ? 'Thêm sân bóng mới' : 'Chỉnh sửa thông tin sân bóng'}</span>
              </div>
            }
            open={isModalVisible && (modalMode === 'edit' || modalMode === 'add')}
            width={700}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>
                {modalMode === 'add' ? 'Thêm sân' : 'Cập nhật'}
              </Button>
            ]}
            centered
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: 'available'
              }}
            >
              <Form.Item
                label="URL ảnh đại diện"
                name="avatar"
              >
                <Input placeholder="Nhập URL ảnh sân bóng" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tên sân"
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên sân!' },
                      { min: 2, message: 'Tên sân phải có ít nhất 2 ký tự!' }
                    ]}
                  >
                    <Input placeholder="Nhập tên sân" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Loại sân"
                    name="pitch_type_id"
                    rules={[
                      { required: true, message: 'Vui lòng chọn loại sân!' }
                    ]}
                  >
                    <Select placeholder="Chọn loại sân">
                      {pitchTypes.map(type => (
                        <Option key={type.id} value={type.id}>{type.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Địa điểm"
                name="location"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa điểm!' },
                  { min: 5, message: 'Địa điểm phải có ít nhất 5 ký tự!' }
                ]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Nhập địa chỉ sân bóng"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Giá thuê (VND/giờ)"
                    name="price_per_hour"
                    rules={[
                      { required: true, message: 'Vui lòng nhập giá thuê!' },
                      { type: 'number', min: 1000, message: 'Giá thuê phải lớn hơn 1,000 VND!' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      placeholder="Nhập giá thuê"

                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[
                      { required: true, message: 'Vui lòng chọn trạng thái!' }
                    ]}
                  >
                    <Select placeholder="Chọn trạng thái">
                      <Option value="available">Có sẵn</Option>
                      <Option value="maintenance">Bảo trì</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageFields;