import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Form, message } from 'antd';
import axios from 'axios';

const AdminDashboard = () => {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchFields = async () => {
    // const res = await axios.get('/api/fields');
    // setFields(res.data);
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleAddField = () => {
    form.validateFields().then(async (values) => {
      await axios.post('/api/fields', values);
      message.success('Thêm sân thành công!');
      form.resetFields();
      setOpen(false);
      fetchFields();
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm sân mới
      </Button>

      <Table
        columns={[
          { title: 'Tên sân', dataIndex: 'name', key: 'name' },
          { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        ]}
        dataSource={fields}
        rowKey="_id"
        style={{ marginTop: 20 }}
      />

      <Modal
        open={open}
        title="Thêm sân bóng"
        onCancel={() => setOpen(false)}
        onOk={handleAddField}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên sân" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
