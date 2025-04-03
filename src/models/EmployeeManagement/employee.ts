import { Reducer, Effect } from 'umi';
import {
	getEmployees,
	addEmployee,
	updateEmployee,
	deleteEmployee,
	searchEmployees,
} from '@/services/EmployeeManagement/employeeService';
import type { Employee } from '@/types/employee';
import { Department, Position, EmployeeStatus } from '@/types/employee';
import { message } from 'antd';

interface EmployeeModelState {
	employees: Employee[];
	filteredEmployees: Employee[];
	departments: Department[];
	positions: Position[];
	statuses: EmployeeStatus[];
}

interface EmployeeModelType {
	namespace: 'employee';
	state: EmployeeModelState;
	effects: {
		fetch: Effect;
		add: Effect;
		update: Effect;
		remove: Effect;
		search: Effect;
	};
	reducers: {
		save: Reducer<EmployeeModelState>;
	};
}

const EmployeeModel: EmployeeModelType = {
	namespace: 'employee',
	state: {
		employees: [],
		filteredEmployees: [],
		departments: Object.values(Department),
		positions: Object.values(Position),
		statuses: Object.values(EmployeeStatus),
	},
	effects: {
		*fetch(_, { call, put }) {
			const employees = yield call(getEmployees);
			yield put({
				type: 'save',
				payload: {
					employees,
					filteredEmployees: employees,
				},
			});
		},
		*add({ payload }, { call, put }) {
			try {
				yield call(addEmployee, payload);
				message.success('Thêm nhân viên thành công');
				yield put({ type: 'fetch' });
			} catch (error) {
				message.error('Thêm nhân viên thất bại');
			}
		},
		*update({ payload }, { call, put }) {
			try {
				yield call(updateEmployee, payload.id, payload.data);
				message.success('Cập nhật nhân viên thành công');
				yield put({ type: 'fetch' });
			} catch (error) {
				message.error('Cập nhật nhân viên thất bại');
			}
		},
		*remove({ payload }, { call, put }) {
			try {
				const success = yield call(deleteEmployee, payload);
				if (success) {
					message.success('Xóa nhân viên thành công');
					yield put({ type: 'fetch' });
				} else {
					message.error('Không thể xóa nhân viên với trạng thái hiện tại');
				}
			} catch (error) {
				message.error('Xóa nhân viên thất bại');
			}
		},
		*search({ payload }, { call, put, select }) {
			const { query, filters } = payload;
			let employees = yield select((state) => state.employee.employees);

			if (query) {
				employees = yield call(searchEmployees, query);
			}

			if (filters) {
				if (filters.department) {
					employees = employees.filter((e: Employee) => e.department === filters.department);
				}
				if (filters.position) {
					employees = employees.filter((e: Employee) => e.position === filters.position);
				}
			}

			yield put({
				type: 'save',
				payload: {
					filteredEmployees: employees,
				},
			});
		},
	},
	reducers: {
		save(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	},
};

export default EmployeeModel;
