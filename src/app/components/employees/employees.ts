import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/department.model';
import { Employee } from '../../models/employee.model';
import { Role } from '../../models/role.model';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-employees',
  imports: [FormsModule],
  templateUrl: './employees.html'
})
export class EmployeesComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly roleService = inject(RoleService);

  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly message = signal('');
  readonly error = signal('');
  readonly isLoading = signal(false);

  readonly form = signal({
    departmentId: 0,
    roleId: 0,
    employeeName: '',
    email: '',
    password: 'Password@123',
    mobileNumber: ''
  });

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
    this.loadRoles();
  }

  createEmployee(): void {
    const form = this.form();

    if (!form.departmentId || !form.roleId || !form.employeeName.trim() || !form.email.trim() || !form.password.trim()) {
      this.error.set('Department, role, name, email, and password are required.');
      this.message.set('');
      return;
    }

    this.isLoading.set(true);

    this.employeeService.create(form).subscribe({
      next: () => {
        this.message.set('Employee created successfully.');
        this.error.set('');
        this.form.set({
          departmentId: 0,
          roleId: 0,
          employeeName: '',
          email: '',
          password: 'Password@123',
          mobileNumber: ''
        });
        this.loadEmployees();
      },
      error: () => {
        this.error.set('Could not create employee. Email may already exist.');
        this.message.set('');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  private loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: employees => this.employees.set(employees),
      error: () => this.error.set('Could not load employees.')
    });
  }

  private loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: departments => this.departments.set(departments.filter(x => x.isActive)),
      error: () => this.error.set('Could not load departments.')
    });
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: roles => this.roles.set(roles),
      error: () => this.error.set('Could not load roles.')
    });
  }
}
