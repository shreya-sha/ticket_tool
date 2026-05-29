import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { CreateTicketRequest, DashboardStats, Ticket, UpdateTicketStatusRequest } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly ticketUrl = `${API_BASE_URL}/Tickets`;
  private readonly dashboardUrl = `${API_BASE_URL}/Dashboard`;

  create(request: CreateTicketRequest) {
    return this.http.post<Ticket>(this.ticketUrl, request);
  }

  getRaisedByEmployee(employeeId: number) {
    return this.http.get<Ticket[]>(`${this.ticketUrl}/raised-by/${employeeId}`);
  }

  getAssignedToEmployee(employeeId: number) {
    return this.http.get<Ticket[]>(`${this.ticketUrl}/assigned-to/${employeeId}`);
  }

  updateStatus(ticketId: number, request: UpdateTicketStatusRequest) {
    return this.http.put<Ticket>(`${this.ticketUrl}/${ticketId}/status`, request);
  }

  getDashboard(employeeId: number) {
    //debugger;
    return this.http.get<DashboardStats>(`${this.dashboardUrl}/employee/${employeeId}`);
  }
}
