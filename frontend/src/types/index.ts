export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'COMPANY_ADMIN' | 'MANAGER' | 'CONSULTANT';
  company: Company | string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  maxUsers: number;
  active: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  sapModule: string;
  client: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  hourlyRate: number;
  active: boolean;
}

export interface Timesheet {
  id: string;
  date: string;
  hours: number;
  description: string;
  activity: string;
  approved: boolean;
  user: User;
  project: Project;
}