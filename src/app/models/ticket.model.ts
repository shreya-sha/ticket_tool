export interface CreateTicketRequest {
  raisedByEmployeeId: number;
  departmentId: number;
  requestTypeId: number;
  title: string;
  description?: string;
  requestDataJson?: string;
  priority: string;
}

export interface Ticket {
  ticketId: number;
  ticketNumber: string;
  raisedByEmployeeId: number;
  raisedByEmployeeName: string;
  assignedToEmployeeId?: number;
  assignedToEmployeeName?: string;
  departmentId: number;
  departmentName: string;
  requestTypeId: number;
  requestTypeName: string;
  title: string;
  description?: string;
  requestDataJson?: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
}

export interface UpdateTicketStatusRequest {
  changedByEmployeeId: number;
  newStatus: string;
  comment?: string;
}

export interface DashboardStats {
  assignedTotal: number;
  assignedOpen: number;
  assignedClosed: number;
  raisedTotal: number;
  raisedOpen: number;
  raisedClosed: number;
}
