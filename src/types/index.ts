export type UserRole = 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type BugStatus = 'reported' | 'processing' | 'completed';

export type BugPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Bug {
  id: string;
  title: string;
  description: string;
  steps: string;
  priority: BugPriority;
  status: BugStatus;
  reportedBy: string;
  reportedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  completedAt?: string;
}