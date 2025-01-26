export type TeamRole = 'owner' | 'admin' | 'member' | 'observer';

export type TeamMember = {
  agentId: string;
  role: TeamRole;
  joinedAt: string;
  permissions: {
    canCreateTasks: boolean;
    canAssignTasks: boolean;
    canModifyTeam: boolean;
    canInviteMembers: boolean;
  };
};

export type TeamPolicy = {
  maxAgents?: number;
  allowExternalTools: boolean;
  requireApprovalForTasks: boolean;
  autoAssignTasks: boolean;
  priorityRules?: {
    defaultPriority: 'low' | 'medium' | 'high';
    allowOverride: boolean;
  };
};

export type TeamMetrics = {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  averageCompletionTime: number; // in milliseconds
  successRate: number; // percentage
  lastUpdated: string;
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  leader: string; // agentId of the team leader
  specialization?: string[];
  policy: TeamPolicy;
  metrics?: TeamMetrics;
  activeTaskIds: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'archived';
  workingHours?: {
    timezone: string;
    schedule: {
      days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
      startTime: string; // HH:mm format
      endTime: string; // HH:mm format
    };
  };
}; 