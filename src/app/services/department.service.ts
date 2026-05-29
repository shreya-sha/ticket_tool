import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { Department, SaveDepartmentRequest } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/Departments`;

  getAll() {
    return this.http.get<Department[]>(this.url);
  }

  create(request: SaveDepartmentRequest) {
    return this.http.post<Department>(this.url, request);
  }

  update(departmentId: number, request: SaveDepartmentRequest) {
    return this.http.put<Department>(`${this.url}/${departmentId}`, request);
  }

  delete(departmentId: number) {
    return this.http.delete<Department>(`${this.url}/${departmentId}`);
  }
}
