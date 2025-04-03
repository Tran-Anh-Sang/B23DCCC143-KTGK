import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import type { Department, Position } from '@/types/employee';

interface EmployeeFilterProps {
	departments: Department[];
	positions: Position[];
	onSearch: (query: string, filters: any) => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({ departments, positions, onSearch }) => {
	const [form] = Form.useForm();

	const handleSearch = (values: any) => {
		onSearch(values.query, {
			department: values.department,
			position: values.position,
		});
	};

	const handleReset = () => {
		form.resetFields();
		onSearch('', {});
	};

	return (
		<Form form={form} onFinish={handleSearch}>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item name='query'>
						<Input placeholder='Tìm theo mã hoặc tên nhân viên' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name='department'>
						<Select
							placeholder='Tất cả phòng ban'
							options={[{ label: 'Tất cả phòng ban', value: '' }, ...departments.map((d) => ({ label: d, value: d }))]}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name='position'>
						<Select
							placeholder='Tất cả chức vụ'
							options={[{ label: 'Tất cả chức vụ', value: '' }, ...positions.map((p) => ({ label: p, value: p }))]}
						/>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Button type='primary' htmlType='submit'>
						Tìm kiếm
					</Button>
					<Button style={{ marginLeft: 8 }} onClick={handleReset}>
						Đặt lại
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default EmployeeFilter;
