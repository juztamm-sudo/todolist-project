export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskCategory =
  | 'Product Design'
  | 'Engineering'
  | 'Marketing'
  | 'Personal';

export type NavView =
  | 'dashboard'
  | 'all'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'important'
  | 'settings'
  | `cat-${TaskCategory}`;

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // e.g. '2:00 PM'
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  important: boolean;
}

export interface UserSettings {
  displayName: string;
  email: string;
  workspaceName: string;
  dailyGoal: number;
  morningDigest: boolean;
  autoArchive: boolean;
  darkMode: boolean;
}
