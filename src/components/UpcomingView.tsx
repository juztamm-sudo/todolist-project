import { Calendar, Plus } from 'lucide-react';
import {
  EMPTY_DESK_IMAGE_SRC,
  formatUpcomingDateLabel,
  TODAY_DATE,
} from '../data/initialTasks';
import { Task } from '../types/task';
import { ResilientImage } from './ResilientImage';
import { TaskRow } from './TaskRow';

interface UpcomingViewProps {
  tasks: Task[];
  searchQuery: string;
  onClearSearch: () => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenNewTask: (prefillDate?: string) => void;
}

export function UpcomingView({
  tasks,
  searchQuery,
  onClearSearch,
  onToggleComplete,
  onToggleImportant,
  onEdit,
  onDelete,
  onOpenNewTask,
}: UpcomingViewProps) {
  const q = searchQuery.trim().toLowerCase();

  const upcomingTasks = tasks.filter((t) => {
    if (t.dueDate <= TODAY_DATE) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.dueTime.toLowerCase().includes(q)
    );
  });

  const grouped: Record<string, Task[]> = {};
  for (const task of upcomingTasks) {
    if (!grouped[task.dueDate]) grouped[task.dueDate] = [];
    grouped[task.dueDate].push(task);
  }
  const sortedDates = Object.keys(grouped).sort();

  const hasWeekendTasks = tasks.some(
    (t) => t.dueDate === '2026-11-28' || t.dueDate === '2026-11-29'
  );

  return (
    <div className="flex flex-col gap-8 view-transition">
      <section className="flex flex-col gap-1">
        <h1 className="text-[28px] leading-[36px] tracking-[-0.5px] font-bold text-light-on-surface dark:text-dark-on-surface">
          Upcoming Schedule
        </h1>
        <p className="text-[15px] leading-[22px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Plan ahead with tasks grouped by upcoming dates.
        </p>
      </section>

      {sortedDates.length === 0 ? (
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-10 flex flex-col items-center text-center gap-4">
          <ResilientImage
            src={EMPTY_DESK_IMAGE_SRC}
            alt="Calm desk illustration for empty upcoming schedule"
            className="w-48 h-36 object-cover rounded-[12px]"
          />
          <div className="flex flex-col gap-1 max-w-sm">
            <h2 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
              No upcoming tasks match
            </h2>
            <p className="text-[14px] leading-[20px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
              {q
                ? 'Try clearing your search filter or schedule a new upcoming task.'
                : 'Your upcoming schedule is open. Add a task to plan ahead.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {q && (
              <button
                type="button"
                onClick={onClearSearch}
                className="px-4 py-2 rounded-[10px] bg-light-surface-container-low dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container transition-colors duration-150 text-[14px] leading-[20px] font-medium cursor-pointer"
              >
                Clear search
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenNewTask('2026-11-26')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[14px] leading-[20px] font-medium">Schedule Task</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedDates.map((dateStr) => {
            const items = grouped[dateStr];
            return (
              <section
                key={dateStr}
                className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] overflow-visible"
              >
                <header className="flex items-center justify-between px-5 py-4 bg-light-surface-container-low/50 dark:bg-dark-surface-container-low/70 border-b border-light-outline-variant dark:border-dark-outline-variant rounded-t-[14px]">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    <h2 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                      {formatUpcomingDateLabel(dateStr)}
                    </h2>
                  </div>
                  <span className="text-[12px] leading-[16px] font-semibold px-2.5 py-0.5 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container tabular-nums whitespace-nowrap">
                    {items.length} {items.length === 1 ? 'task' : 'tasks'}
                  </span>
                </header>
                <div className="divide-y divide-light-outline-variant dark:divide-dark-outline-variant">
                  {items.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      compact
                      onToggleComplete={onToggleComplete}
                      onToggleImportant={onToggleImportant}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Weekend Empty State Card */}
      {!hasWeekendTasks && !q && (
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            <ResilientImage
              src={EMPTY_DESK_IMAGE_SRC}
              alt="Calm desk illustration for clear weekend"
              className="w-32 h-24 object-cover rounded-[12px] shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                Weekend · Nov 28 – 29 is clear
              </h3>
              <p className="text-[14px] leading-[20px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                No tasks scheduled for the weekend yet. Enjoy the open space or add a personal reminder.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenNewTask('2026-11-28')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container hover:bg-accent-soft dark:hover:bg-dark-primary-container/40 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-[14px] leading-[20px] font-medium">Schedule Task</span>
          </button>
        </section>
      )}
    </div>
  );
}
