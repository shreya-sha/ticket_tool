import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { CreateEmployeeRequest, Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/Employees`;

  getAll() {
    return this.http.get<Employee[]>(this.url);
  }

  create(request: CreateEmployeeRequest) {
    return this.http.post<Employee>(this.url, request);
  }
}
