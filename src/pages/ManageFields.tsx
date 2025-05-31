import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Layout,
  Card,
  Row,
  Col,
  Image,
  Tag,
  Divider,
  Collapse
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  MinusOutlined
} from "@ant-design/icons";
import MenuLeft from "../component/MenuLeft";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;
const { Sider, Content } = Layout;

interface SubField {
  id: string;
  name: string;
  description: string;
  type: string;
  goals: number;
  price: number;
  imageUrl: string;
  status: 'available' | 'maintenance' | 'booked';
}

interface Field {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  subFields: SubField[];
}

const initialFields: Field[] = [
  {
    id: "1",
    name: "KARA Football Center",
    description: "Trung tâm bóng đá hiện đại với nhiều sân tiêu chuẩn",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    subFields: [
      {
        id: "1-1",
        name: "Sân Kara 1",
        description: "Sân tiêu chuẩn FIFA, chất lượng cao",
        type: "7 người",
        goals: 2,
        price: 800000,
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        status: 'available'
      },
      {
        id: "1-2",
        name: "Sân Kara 2",
        description: "Sân nhân tạo đẹp, thoáng mát",
        type: "5 người",
        goals: 2,
        price: 600000,
        imageUrl: "https://via.placeholder.com/300x200?text=Kara+2",
        status: 'available'
      },
      {
        id: "1-3",
        name: "Sân Kara 3",
        description: "Sân mini phù hợp trẻ em",
        type: "5 người",
        goals: 1,
        price: 500000,
        imageUrl: "https://via.placeholder.com/300x200?text=Kara+3",
        status: 'maintenance'
      },
    ],
  },
  {
    id: "2",
    name: "Sân bóng Sài Gòn",
    description: "Sân bóng chất lượng với nhiều tiện ích",
    imageUrl: "https://via.placeholder.com/400x200?text=Sai+Gon+Football",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    subFields: [
      {
        id: "2-1",
        name: "Sân SG1",
        description: "Sân cỏ tự nhiên tiêu chuẩn",
        type: "11 người",
        goals: 2,
        price: 1200000,
        imageUrl: "https://via.placeholder.com/300x200?text=SG1",
        status: 'available'
      },
      {
        id: "2-2",
        name: "Sân SG2",
        description: "Sân nhân tạo chất lượng cao",
        type: "7 người",
        goals: 2,
        price: 900000,
        imageUrl: "https://via.placeholder.com/300x200?text=SG2",
        status: 'booked'
      },
    ],
  },
];

const statusColors: Record<string, string> = {
  available: 'green',
  maintenance: 'orange',
  booked: 'red'
};

const statusLabels: Record<string, string> = {
  available: 'Có sẵn',
  maintenance: 'Bảo trì',
  booked: 'Đã đặt'
};

const ManageFields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const pageSize = 5;

  const handleEdit = (record: Field | SubField) => {
    message.info(`Sửa ${'subFields' in record ? 'sân chính' : 'sân phụ'}: ${record.name}`);
    // TODO: redirect hoặc mở form modal
  };

  const handleView = (record: Field | SubField) => {
    const isMainField = 'subFields' in record;
    
    Modal.info({
      title: `Chi tiết ${isMainField ? 'sân chính' : 'sân phụ'}: ${record.name}`,
      width: 800,
      content: (
        <div>
          {record.imageUrl && (
            <Image 
              src={record.imageUrl} 
              alt={record.name}
              style={{ marginBottom: 16, borderRadius: 4 }}
            />
          )}
          
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>Mô tả:</strong> {record.description}</p>
              {isMainField && (
                <p><strong>Địa chỉ:</strong> {(record as Field).address}</p>
              )}
            </Col>
            <Col span={12}>
              {!isMainField && (
                <>
                  <p><strong>Loại sân:</strong> {(record as SubField).type}</p>
                  <p><strong>Số khung thành:</strong> {(record as SubField).goals}</p>
                  <p><strong>Giá thuê:</strong> {(record as SubField).price.toLocaleString()} VND</p>
                  <p><strong>Trạng thái:</strong> 
                    <Tag color={statusColors[(record as SubField).status]} style={{ marginLeft: 8 }}>
                      {statusLabels[(record as SubField).status]}
                    </Tag>
                  </p>
                </>
              )}
              {isMainField && (
                <p><strong>Số sân con:</strong> {(record as Field).subFields.length}</p>
              )}
            </Col>
          </Row>
        </div>
      ),
      onOk() {},
    });
  };

  const handleDelete = (record: Field | SubField, parentId?: string) => {
    confirm({
      title: `Bạn có chắc muốn xóa ${parentId ? 'sân phụ' : 'sân chính'} "${record.name}"?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (parentId) {
          // Delete sub-field
          setFields(fields.map(field => 
            field.id === parentId 
              ? {...field, subFields: field.subFields.filter(sub => sub.id !== record.id)}
              : field
          ));
        } else {
          // Delete main field
          setFields(fields.filter(field => field.id !== record.id));
        }
        message.success("Xóa thành công!");
      },
    });
  };

  const handleAddSubField = (fieldId: string) => {
    message.info(`Thêm sân phụ vào sân ${fields.find(f => f.id === fieldId)?.name}`);
    // TODO: Open add sub-field form
  };

  const columns: ColumnsType<Field> = [
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={record.imageUrl} 
            alt={text}
            width={80}
            height={50}
            style={{ borderRadius: 4, marginRight: 12, objectFit: 'cover' }}
          />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.address}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Số sân con",
      key: "subFieldsCount",
      render: (_, record) => record.subFields.length,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)} 
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              handleAddSubField(record.id);
            }} 
          />
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: Field) => {
    const subFieldColumns: ColumnsType<SubField> = [
      {
        title: "Tên sân phụ",
        dataIndex: "name",
        key: "name",
        render: (text, subRecord) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image 
              src={subRecord.imageUrl} 
              alt={text}
              width={60}
              height={40}
              style={{ borderRadius: 4, marginRight: 8, objectFit: 'cover' }}
            />
            <div>{text}</div>
          </div>
        ),
      },
      {
        title: "Loại sân",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Giá thuê (VND)",
        dataIndex: "price",
        key: "price",
        render: (value: number) => value.toLocaleString(),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
        ),
      },
      {
        title: "Thao tác",
        key: "action",
        render: (_, subRecord) => (
          <Space>
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(subRecord)} 
            />
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(subRecord)} 
            />
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(subRecord, record.id)} 
            />
          </Space>
        ),
      },
    ];

    return (
      <div style={{ margin: '0 48px' }}>
        <Title level={5} style={{ marginBottom: 16 }}>Danh sách sân phụ</Title>
        <Table
          rowKey="id"
          columns={subFieldColumns}
          dataSource={record.subFields}
          pagination={false}
          size="small"
          bordered
        />
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: "#fff" }}>
        <MenuLeft />
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
          <Title level={4} style={{ marginBottom: 24 }}>Quản lý sân bóng</Title>
          
          <Table
            rowKey="id"
            columns={columns}
            dataSource={fields}
            expandable={{
              expandedRowRender,
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <MinusOutlined onClick={e => onExpand(record, e)} />
                ) : (
                  <PlusOutlined onClick={e => onExpand(record, e)} />
                ),
              rowExpandable: (record) => record.subFields.length > 0,
              expandedRowKeys: expandedRows,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRows([...expandedRows, record.id]);
                } else {
                  setExpandedRows(expandedRows.filter(id => id !== record.id));
                }
              },
            }}
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