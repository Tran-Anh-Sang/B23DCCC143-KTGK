export enum EmployeeStatus {
	Probation = 'Thử việc',
	Active = 'Đã ký hợp đồng',
	OnLeave = 'Nghỉ phép',
	Terminated = 'Đã thôi việc',
}

export enum Department {
	HR = 'Nhân sự',
	IT = 'Công nghệ thông tin',
	Finance = 'Tài chính',
	Marketing = 'Marketing',
}

export enum Position {
	Intern = 'Thực tập sinh',
	Staff = 'Nhân viên',
	Manager = 'Quản lý',
	Director = 'Giám đốc',
}

export interface Employee {
	id: string;
	name: string;
	position: Position;
	department: Department;
	salary: number;
	status: EmployeeStatus;
}
