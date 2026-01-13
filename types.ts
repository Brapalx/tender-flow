
export interface Tender {
  id: string;
  title: string;
  issuer: string;
  description: string;
  value: string;
  date: string;
  status: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type ViewType = 'inbox' | 'interested' | 'in_process' | 'trash' | 'users' | 'settings';
