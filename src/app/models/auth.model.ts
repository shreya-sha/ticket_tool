export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  employeeId: number;
  employeeName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
}
