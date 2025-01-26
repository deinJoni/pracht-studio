export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type TaskResult = {
  output: any;
  error?: string;
  metadata?: Record<string, any>;
};

export type TaskStep = {
  id: string;
  toolId: string;
  parameters: Record<string, any>;
  status: TaskStatus;
  result?: TaskResult;
  startedAt?: string;
  completedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  agentId: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  steps: TaskStep[];
  result?: TaskResult;
  metadata?: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  deadline?: string;
  parentTaskId?: string; // For subtasks
  dependencies?: string[]; // IDs of tasks that must complete before this one
}; 