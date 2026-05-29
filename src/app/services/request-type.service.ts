import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import {
  RequestType,
  RequestTypeField,
  SaveRequestTypeFieldRequest,
  SaveRequestTypeRequest
} from '../models/request-type.model';

@Injectable({ providedIn: 'root' })
export class RequestTypeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/RequestTypes`;

  getAll() {
    return this.http.get<RequestType[]>(this.url);
  }

  getByDepartment(departmentId: number) {
    return this.http.get<RequestType[]>(`${this.url}/by-department/${departmentId}`);
  }

  create(request: SaveRequestTypeRequest) {
    return this.http.post<RequestType>(this.url, request);
  }

  update(requestTypeId: number, request: SaveRequestTypeRequest) {
    return this.http.put<RequestType>(`${this.url}/${requestTypeId}`, request);
  }

  delete(requestTypeId: number) {
    return this.http.delete<RequestType>(`${this.url}/${requestTypeId}`);
  }

  getFields(requestTypeId: number) {
    return this.http.get<RequestTypeField[]>(`${this.url}/${requestTypeId}/fields`);
  }

  createField(requestTypeId: number, request: SaveRequestTypeFieldRequest) {
    return this.http.post<RequestTypeField>(`${this.url}/${requestTypeId}/fields`, request);
  }
}
