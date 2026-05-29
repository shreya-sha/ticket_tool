import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/department.model';
import { RequestType, RequestTypeField } from '../../models/request-type.model';
import { AuthService } from '../../services/auth.service';
import { DepartmentService } from '../../services/department.service';
import { RequestTypeService } from '../../services/request-type.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-raise-ticket',
  imports: [FormsModule],
  templateUrl: './raise-ticket.html'
})
export class RaiseTicketComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly departmentService = inject(DepartmentService);
  private readonly requestTypeService = inject(RequestTypeService);
  private readonly ticketService = inject(TicketService);

  readonly departments = signal<Department[]>([]);
  readonly requestTypes = signal<RequestType[]>([]);
  readonly fields = signal<RequestTypeField[]>([]);
  readonly fieldValues = signal<Record<string, string>>({});
  readonly message = signal('');
  readonly error = signal('');
  readonly isLoading = signal(false);

  readonly form = signal({
    departmentId: 0,
    requestTypeId: 0,
    title: '',
    description: '',
    priority: 'Medium'
  });

  ngOnInit(): void {
    this.departmentService.getAll().subscribe({
      next: departments => this.departments.set(departments.filter(x => x.isActive)),
      error: () => this.error.set('Could not load departments.')
    });
  }

  departmentChanged(departmentId: number): void {
    this.form.update(form => ({ ...form, departmentId, requestTypeId: 0 }));
    this.requestTypes.set([]);
    this.fields.set([]);
    this.fieldValues.set({});

    if (!departmentId) {
      return;
    }

    this.requestTypeService.getByDepartment(departmentId).subscribe({
      next: requestTypes => this.requestTypes.set(requestTypes),
      error: () => this.error.set('Could not load request types.')
    });
  }

  requestTypeChanged(requestTypeId: number): void {
    this.form.update(form => ({ ...form, requestTypeId }));
    this.fields.set([]);
    this.fieldValues.set({});

    if (!requestTypeId) {
      return;
    }

    this.requestTypeService.getFields(requestTypeId).subscribe({
      next: fields => this.fields.set(fields),
      error: () => this.error.set('Could not load request fields.')
    });
  }

  updateFieldValue(fieldName: string, value: string): void {
    this.fieldValues.update(values => ({ ...values, [fieldName]: value }));
  }

  getOptions(field: RequestTypeField): string[] {
    if (!field.fieldOptionsJson) {
      return [];
    }

    try {
      return JSON.parse(field.fieldOptionsJson) as string[];
    } catch {
      return [];
    }
  }

  submit(): void {
    const user = this.authService.currentUser();
    const form = this.form();

    if (!user) {
      this.error.set('Please login first.');
      return;
    }

    if (!form.departmentId || !form.requestTypeId || !form.title.trim()) {
      this.error.set('Department, request type, and title are required.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.ticketService.create({
      raisedByEmployeeId: user.employeeId,
      departmentId: form.departmentId,
      requestTypeId: form.requestTypeId,
      title: form.title,
      description: form.description,
      priority: form.priority,
      requestDataJson: JSON.stringify(this.fieldValues())
    }).subscribe({
      next: ticket => {
        this.message.set(`Ticket ${ticket.ticketNumber} created successfully.`);
        this.form.set({ departmentId: 0, requestTypeId: 0, title: '', description: '', priority: 'Medium' });
        this.requestTypes.set([]);
        this.fields.set([]);
        this.fieldValues.set({});
      },
      error: () => this.error.set('Could not create ticket.'),
      complete: () => this.isLoading.set(false)
    });
  }
}
