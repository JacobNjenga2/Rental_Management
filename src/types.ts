export type UserRole = 'landlord' | 'manager' | 'tenant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isMfaEnabled?: boolean;
}

export type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Duplex';
export type PropertyStatus = 'Active' | 'Draft' | 'Archived';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: PropertyType;
  description: string;
  amenities: string[];
  photos: string[];
  status: PropertyStatus;
  ownerId: string;
  managerId: string;
}

export type UnitStatus = 'Occupied' | 'Vacant' | 'Maintenance';

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  rentAmount: number;
  status: UnitStatus;
}

export type LeaseStatus = 'Active' | 'Pending' | 'Terminated' | 'Expired';

export interface Lease {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  status: LeaseStatus;
  signedDate?: string;
  terms: string;
}

export type PaymentMethod = 'M-Pesa' | 'Credit Card' | 'Bank Transfer';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type PaymentType = 'Rent' | 'Deposit' | 'Late Fee';

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  method?: PaymentMethod;
  status: PaymentStatus;
  type: PaymentType;
  lateFeeCharged?: number;
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'General';

export interface MaintenanceLog {
  status: MaintenanceStatus;
  updatedAt: string;
  note: string;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  category: MaintenanceCategory;
  assignedTechnician?: string;
  createdAt: string;
  photos: string[];
  cost?: number;
  logs: MaintenanceLog[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export type DocumentType = 'Lease' | 'Invoice' | 'Notice' | 'Report';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  url: string;
  uploadDate: string;
  size: string;
  signedStatus?: 'Signed' | 'Unsigned' | 'N/A';
  tenantId?: string;
  fileData?: string;
  mimeType?: string;
}

export interface TenantApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  requestedStartDate: string;
  monthlyIncome: number;
  creditScore: number;
  backgroundCheckStatus: 'Passed' | 'Failed' | 'Pending';
  creditCheckStatus: 'Passed' | 'Failed' | 'Pending';
  status: 'Received' | 'Screening' | 'Approved' | 'Rejected';
  createdAt: string;
}
