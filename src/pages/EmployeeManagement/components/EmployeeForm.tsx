import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';
import type { Employee, Department, Position, EmployeeStatus } from '@/types/employee';

interface EmployeeFormProps {
	employee?: Employee;
	onFinish: (values: Omit<Employee, 'id'>) => void;
	departments: Department[];
	positions: Position[];
	statuses: EmployeeStatus[];
	children?: React.ReactNode;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
	employee,
	onFinish,
	departments,
	positions,
	statuses,
	children,
}) => {
	const [form] = Form.useForm();
	const [visible, setVisible] = useState(false);

	const showModal = () => {
		setVisible(true);
		if (employee) {
			form.setFieldsValue(employee);
		} else {
			form.resetFields();
		}
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onFinish(values);
			setVisible(false);
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleCancel = () => {
		setVisible(false);
	};

	return (
		<>
			{children ? (
				<span onClick={showModal}>{children}</span>
			) : (
				<Button onClick={showModal}>{employee ? 'Chỉnh sửa' : 'Thêm mới'}</Button>
			)}
			<Modal
				title={employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Họ tên'
						rules={[
							{ required: true, message: 'Vui lòng nhập họ tên' },
							{ max: 50, message: 'Họ tên không quá 50 ký tự' },
							{
								pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
								message: 'Họ tên không chứa ký tự đặc biệt',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name='position' label='Chức vụ' rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}>
						<Select options={positions.map((p) => ({ label: p, value: p }))} />
					</Form.Item>
					<Form.Item
						name='department'
						label='Phòng ban'
						rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
					>
						<Select options={departments.map((d) => ({ label: d, value: d }))} />
					</Form.Item>
					<Form.Item
						name='salary'
						label='Lương'
						rules={[
							{ required: true, message: 'Vui lòng nhập lương' },
							{ type: 'number', min: 0, message: 'Lương phải là số dương' },
						]}
					>
						<InputNumber
							style={{ width: '100%' }}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select options={statuses.map((s) => ({ label: s, value: s }))} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default EmployeeForm;
