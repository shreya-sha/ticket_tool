export interface RequestType {
  requestTypeId: number;
  departmentId: number;
  departmentName?: string;
  requestTypeName: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface SaveRequestTypeRequest {
  departmentId: number;
  requestTypeName: string;
  description?: string;
}

export interface RequestTypeField {
  requestTypeFieldId: number;
  requestTypeId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldOptionsJson?: string;
  isRequired: boolean;
  displayOrder: number;
}

export interface SaveRequestTypeFieldRequest {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldOptionsJson?: string;
  isRequired: boolean;
  displayOrder: number;
}
