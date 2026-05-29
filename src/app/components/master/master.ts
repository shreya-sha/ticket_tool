import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department, SaveDepartmentRequest } from '../../models/department.model';
import {
  RequestType,
  RequestTypeField,
  SaveRequestTypeFieldRequest,
  SaveRequestTypeRequest
} from '../../models/request-type.model';
import { DepartmentService } from '../../services/department.service';
import { RequestTypeService } from '../../services/request-type.service';

type MasterTab = 'departments' | 'requestTypes';

@Component({
  selector: 'app-master',
  imports: [FormsModule],
  templateUrl: './master.html',
  styleUrl: './master.css'
})
export class MasterComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly requestTypeService = inject(RequestTypeService);

  readonly selectedTab = signal<MasterTab>('departments');
  readonly departments = signal<Department[]>([]);
  readonly requestTypes = signal<RequestType[]>([]);
  readonly requestTypeFields = signal<RequestTypeField[]>([]);
  readonly selectedRequestTypeId = signal<number | null>(null);
  readonly isLoading = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly activeDepartments = computed(() => this.departments().filter(x => x.isActive));
  readonly selectedRequestType = computed(() =>
    this.requestTypes().find(x => x.requestTypeId === this.selectedRequestTypeId()) ?? null
  );

  readonly departmentForm = signal<SaveDepartmentRequest>({
    departmentName: '',
    isActive: true
  });

  readonly requestTypeForm = signal<SaveRequestTypeRequest>({
    departmentId: 0,
    requestTypeName: '',
    description: ''
  });

  readonly fieldForm = signal<SaveRequestTypeFieldRequest>({
    fieldName: '',
    fieldLabel: '',
    fieldType: 'text',
    fieldOptionsJson: '',
    isRequired: true,
    displayOrder: 1
  });

  readonly editingDepartmentId = signal<number | null>(null);
  readonly editingRequestTypeId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadDepartments();
    this.loadRequestTypes();
  }

  selectTab(tab: MasterTab): void {
    this.selectedTab.set(tab);
    this.clearMessages();
  }

  saveDepartment(): void {
    const request = this.departmentForm();

    if (!request.departmentName.trim()) {
      this.showError('Department name is required.');
      return;
    }

    this.isLoading.set(true);
    const editId = this.editingDepartmentId();
    const saveCall = editId
      ? this.departmentService.update(editId, request)
      : this.departmentService.create(request);

    saveCall.subscribe({
      next: () => {
        this.showMessage(editId ? 'Department updated.' : 'Department created.');
        this.resetDepartmentForm();
        this.loadDepartments();
      },
      error: () => this.showError('Could not save department. Check API and database.'),
      complete: () => this.isLoading.set(false)
    });
  }

  editDepartment(department: Department): void {
    this.editingDepartmentId.set(department.departmentId);
    this.departmentForm.set({
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      isActive: department.isActive
    });
  }

  deleteDepartment(department: Department): void {
    this.isLoading.set(true);

    this.departmentService.delete(department.departmentId).subscribe({
      next: () => {
        this.showMessage('Department disabled.');
        this.loadDepartments();
      },
      error: () => this.showError('Could not disable department.'),
      complete: () => this.isLoading.set(false)
    });
  }

  saveRequestType(): void {
    const request = this.requestTypeForm();

    if (!request.departmentId || !request.requestTypeName.trim()) {
      this.showError('Department and request type name are required.');
      return;
    }

    this.isLoading.set(true);
    const editId = this.editingRequestTypeId();
    const saveCall = editId
      ? this.requestTypeService.update(editId, request)
      : this.requestTypeService.create(request);

    saveCall.subscribe({
      next: () => {
        this.showMessage(editId ? 'Request type updated.' : 'Request type created.');
        this.resetRequestTypeForm();
        this.loadRequestTypes();
      },
      error: () => this.showError('Could not save request type.'),
      complete: () => this.isLoading.set(false)
    });
  }

  editRequestType(requestType: RequestType): void {
    this.editingRequestTypeId.set(requestType.requestTypeId);
    this.requestTypeForm.set({
      departmentId: requestType.departmentId,
      requestTypeName: requestType.requestTypeName,
      description: requestType.description ?? ''
    });
  }

  deleteRequestType(requestType: RequestType): void {
    this.isLoading.set(true);

    this.requestTypeService.delete(requestType.requestTypeId).subscribe({
      next: () => {
        this.showMessage('Request type disabled.');
        this.loadRequestTypes();
      },
      error: () => this.showError('Could not disable request type.'),
      complete: () => this.isLoading.set(false)
    });
  }

  selectRequestType(requestType: RequestType): void {
    this.selectedRequestTypeId.set(requestType.requestTypeId);
    this.loadFields(requestType.requestTypeId);
  }

  saveField(): void {
    const requestTypeId = this.selectedRequestTypeId();
    const request = this.fieldForm();

    if (!requestTypeId) {
      this.showError('Select a request type first.');
      return;
    }

    if (!request.fieldName.trim() || !request.fieldLabel.trim()) {
      this.showError('Field name and label are required.');
      return;
    }

    this.isLoading.set(true);

    this.requestTypeService.createField(requestTypeId, request).subscribe({
      next: () => {
        this.showMessage('Field added.');
        this.resetFieldForm();
        this.loadFields(requestTypeId);
      },
      error: () => this.showError('Could not add field. Check option JSON if using select/radio.'),
      complete: () => this.isLoading.set(false)
    });
  }

  resetDepartmentForm(): void {
    this.editingDepartmentId.set(null);
    this.departmentForm.set({ departmentName: '', isActive: true });
  }

  resetRequestTypeForm(): void {
    this.editingRequestTypeId.set(null);
    this.requestTypeForm.set({ departmentId: 0, requestTypeName: '', description: '' });
  }

  resetFieldForm(): void {
    this.fieldForm.set({
      fieldName: '',
      fieldLabel: '',
      fieldType: 'text',
      fieldOptionsJson: '',
      isRequired: true,
      displayOrder: this.requestTypeFields().length + 1
    });
  }

  private loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: departments => this.departments.set(departments),
      error: () => this.showError('Could not load departments.')
    });
  }

  private loadRequestTypes(): void {
    this.requestTypeService.getAll().subscribe({
      next: requestTypes => this.requestTypes.set(requestTypes),
      error: () => this.showError('Could not load request types.')
    });
  }

  private loadFields(requestTypeId: number): void {
    this.requestTypeService.getFields(requestTypeId).subscribe({
      next: fields => {
        this.requestTypeFields.set(fields);
        this.resetFieldForm();
      },
      error: () => this.showError('Could not load request type fields.')
    });
  }

  private showMessage(text: string): void {
    this.message.set(text);
    this.error.set('');
  }

  private showError(text: string): void {
    this.error.set(text);
    this.message.set('');
    this.isLoading.set(false);
  }

  private clearMessages(): void {
    this.message.set('');
    this.error.set('');
  }
}
