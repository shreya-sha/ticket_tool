import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/Roles`;

  getAll() {
    return this.http.get<Role[]>(this.url);
  }
}
