export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  mobile: string;
  role: UserRole;
  memberId?: string; // Links to member record if role is 'member'
  name: string;
}

export interface Plan {
  id: string;
  name: string;
  durationMonths: number;
  feeAmount: number;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  mobile: string;
  photo?: string; // base64 string
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  address: string;
  joiningDate: string; // YYYY-MM-DD
  planId: string;
  feeAmount: number;
  feeDueDate: string; // YYYY-MM-DD
  emergencyContact: {
    name: string;
    relation: string;
    mobile: string;
  };
  status: 'active' | 'expired';
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  status: 'paid' | 'unpaid';
  dueDate: string; // YYYY-MM-DD
  receiptNumber: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM:SS
  method: 'qr' | 'manual';
}

export interface GymAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string; // YYYY-MM-DD
  type: 'fee_due' | 'expiry' | 'announcement' | 'birthday' | 'promo';
  targetMemberId?: string; // 'all' or specific member ID
}

export interface GymConfig {
  name: string;
  logoUrl?: string; // base64 or URL
  mobile: string;
  address: string;
  whatsappTemplate: string;
}
