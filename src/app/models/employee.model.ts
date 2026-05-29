export interface Employee {
  employeeId: number;
  employeeName: string;
  email: string;
  mobileNumber?: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
}

export interface CreateEmployeeRequest {
  departmentId: number;
  roleId: number;
  employeeName: string;
  email: string;
  password: string;
  mobileNumber?: string;
}
