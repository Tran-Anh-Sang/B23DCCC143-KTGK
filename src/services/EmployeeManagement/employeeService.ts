import type { Employee } from '@/types/employee';
import { EmployeeStatus } from '@/types/employee';

const EMPLOYEE_STORAGE_KEY = 'employees';

export const getEmployees = (): Employee[] => {
	const data = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

export const saveEmployees = (employees: Employee[]) => {
	localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
};

export const addEmployee = (employee: Omit<Employee, 'id'>) => {
	const employees = getEmployees();
	const newId = `NV-${Date.now()}`;
	const newEmployee = { ...employee, id: newId };
	employees.push(newEmployee);
	saveEmployees(employees);
	return newEmployee;
};

export const updateEmployee = (id: string, employee: Partial<Employee>) => {
	const employees = getEmployees();
	const index = employees.findIndex((e) => e.id === id);
	if (index !== -1) {
		employees[index] = { ...employees[index], ...employee };
		saveEmployees(employees);
		return employees[index];
	}
	return null;
};

export const deleteEmployee = (id: string) => {
	const employees = getEmployees();
	const employee = employees.find((e) => e.id === id);

	if (!employee || ![EmployeeStatus.Probation, EmployeeStatus.Terminated].includes(employee.status)) {
		return false;
	}

	const filtered = employees.filter((e) => e.id !== id);
	saveEmployees(filtered);
	return true;
};

export const searchEmployees = (query: string) => {
	const employees = getEmployees();
	const lowerQuery = query.toLowerCase();
	return employees.filter((e) => e.id.toLowerCase().includes(lowerQuery) || e.name.toLowerCase().includes(lowerQuery));
};
