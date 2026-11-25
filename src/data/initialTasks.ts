import { Task, TaskCategory, UserSettings } from '../types/task';

export const TODAY_DATE = '2026-11-25';
export const TODAY_DISPLAY_DATE = 'Wednesday, November 25, 2026';

export const AVATAR_IMAGE_SRC = '/src/assets/images/avatar_maya_lin_1795599412536.jpg';
export const EMPTY_DESK_IMAGE_SRC = '/src/assets/images/empty_tasks_desk_1795599411259.jpg';

export const CATEGORIES: { name: TaskCategory; dotClass: string }[] = [
  { name: 'Product Design', dotClass: 'bg-accent' },
  { name: 'Engineering', dotClass: 'bg-light-tertiary dark:bg-dark-tertiary' },
  { name: 'Marketing', dotClass: 'bg-warning' },
  { name: 'Personal', dotClass: 'bg-success' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Finalize Taskly design system tokens',
    description: 'Audit spacing scale, contrast ratios, and button states before handoff.',
    dueDate: '2026-11-25',
    dueTime: '2:00 PM',
    priority: 'High',
    category: 'Product Design',
    completed: false,
    important: true,
  },
  {
    id: 't2',
    title: 'Ship keyboard shortcut command palette',
    description: 'Support Cmd+K quick search and arrow-key navigation across task rows.',
    dueDate: '2026-11-25',
    dueTime: '4:30 PM',
    priority: 'High',
    category: 'Engineering',
    completed: false,
    important: true,
  },
  {
    id: 't3',
    title: 'Review Q4 launch email sequence',
    description: 'Tighten subject lines and verify UTM tracking links with growth team.',
    dueDate: '2026-11-25',
    dueTime: '5:15 PM',
    priority: 'Medium',
    category: 'Marketing',
    completed: false,
    important: false,
  },
  {
    id: 't4',
    title: 'Sync with mobile team on offline cache',
    description: 'Confirm optimistic checkbox updates reconcile cleanly after reconnect.',
    dueDate: '2026-11-25',
    dueTime: '11:00 AM',
    priority: 'Low',
    category: 'Engineering',
    completed: true,
    important: false,
  },
  {
    id: 't5',
    title: 'Pick up espresso beans and oat milk',
    description: 'Stop by Blue Bottle on the way back from the studio.',
    dueDate: '2026-11-25',
    dueTime: '6:30 PM',
    priority: 'Low',
    category: 'Personal',
    completed: true,
    important: false,
  },
  {
    id: 't6',
    title: 'Prepare user interview synthesis deck',
    description: 'Summarize 6 customer sessions on recurring task workflows.',
    dueDate: '2026-11-26',
    dueTime: '10:30 AM',
    priority: 'High',
    category: 'Product Design',
    completed: false,
    important: true,
  },
  {
    id: 't7',
    title: 'Optimize task query indexing in Postgres',
    description: 'Add composite index on workspace_id and due_date for faster load.',
    dueDate: '2026-11-26',
    dueTime: '3:00 PM',
    priority: 'Medium',
    category: 'Engineering',
    completed: false,
    important: false,
  },
  {
    id: 't8',
    title: 'Publish Product Hunt teaser graphics',
    description: 'Export light-mode dashboard shots at 2x resolution.',
    dueDate: '2026-11-27',
    dueTime: '1:00 PM',
    priority: 'Medium',
    category: 'Marketing',
    completed: false,
    important: false,
  },
  {
    id: 't9',
    title: 'Refine onboarding empty-state illustrations',
    description: 'Align stroke weights and soft violet accents across all views.',
    dueDate: '2026-11-27',
    dueTime: '4:00 PM',
    priority: 'Low',
    category: 'Product Design',
    completed: false,
    important: false,
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Maya Lin',
  email: 'maya.lin@taskly.app',
  workspaceName: 'Pro Workspace',
  dailyGoal: 6,
  morningDigest: true,
  autoArchive: true,
  darkMode: false,
};

export function formatUpcomingDateLabel(dateStr: string): string {
  if (dateStr === '2026-11-25') return 'Today · Wed, Nov 25';
  if (dateStr === '2026-11-26') return 'Tomorrow · Thu, Nov 26';

  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;

  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).replace(',', ' ·');
}
