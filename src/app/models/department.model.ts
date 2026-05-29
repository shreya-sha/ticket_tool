export interface Department {
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  createdAt?: string;
}

export interface SaveDepartmentRequest {
  departmentId?: number;
  departmentName: string;
  isActive: boolean;
}
