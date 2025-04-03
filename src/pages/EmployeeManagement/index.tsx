import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Table, Button, Space, Card, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EmployeeForm from './components/EmployeeForm';
import EmployeeFilter from './components/EmployeeFilter';
import type { Employee } from '@/types/employee';
import { EmployeeStatus } from '@/types/employee';

const EmployeePage = ({ dispatch, employee }) => {
	const { filteredEmployees, departments, positions, statuses } = employee;

	useEffect(() => {
		dispatch({ type: 'employee/fetch' });
	}, []);

	const handleAdd = (values) => {
		dispatch({ type: 'employee/add', payload: values });
	};

	const handleUpdate = (id, values) => {
		dispatch({ type: 'employee/update', payload: { id, data: values } });
	};

	const handleDelete = (id) => {
		dispatch({ type: 'employee/remove', payload: id });
	};

	const handleSearch = (query, filters) => {
		dispatch({ type: 'employee/search', payload: { query, filters } });
	};

	const handleSort = () => {
		const sorted = [...filteredEmployees].sort((a, b) => b.salary - a.salary);
		dispatch({
			type: 'employee/save',
			payload: { filteredEmployees: sorted },
		});
	};

	const columns = [
		{
			title: 'Mã NV',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Họ tên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Chức vụ',
			dataIndex: 'position',
			key: 'position',
		},
		{
			title: 'Phòng ban',
			dataIndex: 'department',
			key: 'department',
		},
		{
			title: 'Lương',
			dataIndex: 'salary',
			key: 'salary',
			render: (salary: number) => salary.toLocaleString('vi-VN') + ' VND',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_, record: Employee) => (
				<Space size='middle'>
					<EmployeeForm
						employee={record}
						onFinish={(values) => handleUpdate(record.id, values)}
						departments={departments}
						positions={positions}
						statuses={statuses}
					/>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger disabled={![EmployeeStatus.Probation, EmployeeStatus.Terminated].includes(record.status)}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title='Quản lý nhân viên'
			extra={
				<Space>
					<Button type='primary' onClick={handleSort}>
						Sắp xếp theo lương giảm dần
					</Button>
					<EmployeeForm onFinish={handleAdd} departments={departments} positions={positions} statuses={statuses}>
						<Button type='primary' icon={<PlusOutlined />}>
							Thêm nhân viên
						</Button>
					</EmployeeForm>
				</Space>
			}
		>
			<EmployeeFilter departments={departments} positions={positions} onSearch={handleSearch} />
			<Table columns={columns} dataSource={filteredEmployees} rowKey='id' pagination={{ pageSize: 10 }} />
		</Card>
	);
};

export default connect(({ employee }) => ({ employee }))(EmployeePage);
