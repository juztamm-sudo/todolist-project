import { Clock, Layers } from 'lucide-react';
import { TODAY_DATE } from '../data/initialTasks';
import { Task } from '../types/task';

interface OverviewCardsProps {
  tasks: Task[];
}

export function OverviewCards({ tasks }: OverviewCardsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPending = tasks.filter(
    (t) => !t.completed && t.priority === 'High'
  ).length;

  const activeCategoryCount = new Set(tasks.map((t) => t.category)).size;

  const todayTasks = tasks.filter((t) => t.dueDate === TODAY_DATE);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const pct = todayTasks.length
    ? Math.round((todayCompleted / todayTasks.length) * 100)
    : 0;

  const circumference = 201.06;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <section
      aria-label="Productivity Overview"
      className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
    >
      {/* Card 1: Total Tasks */}
      <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] leading-[20px] font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Total Tasks
          </span>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container shrink-0">
            <Layers className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[36px] leading-[44px] tracking-[-0.75px] font-bold text-light-on-surface dark:text-dark-on-surface tabular-nums">
            {total}
          </span>
          <span className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
            {activeCategoryCount} {activeCategoryCount === 1 ? 'category' : 'categories'} active
          </span>
        </div>
      </article>

      {/* Card 2: Completed Tasks + Circular Progress */}
      <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] flex items-center justify-between gap-4">
        <div className="flex flex-col justify-between h-full gap-4">
          <span className="text-[14px] leading-[20px] font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Completed Tasks
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[36px] leading-[44px] tracking-[-0.75px] font-bold text-light-on-surface dark:text-dark-on-surface tabular-nums">
              {completed}
            </span>
            <span className="text-[13px] leading-[18px] text-on-success-container dark:text-emerald-400">
              Today&apos;s completion rate
            </span>
          </div>
        </div>

        <div
          className="relative w-20 h-20 shrink-0 flex items-center justify-center"
          aria-label={`Today's completion percentage: ${pct}%`}
        >
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              className="stroke-[#ECEEF4] dark:stroke-[#2C2C38]"
              strokeWidth="7"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              className="stroke-[#6D28D9] dark:stroke-[#D3BBFF]"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset.toFixed(2)}
              style={{
                transition: 'stroke-dashoffset 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </svg>
          <span className="absolute text-[14px] leading-[20px] font-semibold text-light-on-surface dark:text-dark-on-surface tabular-nums">
            {pct}%
          </span>
        </div>
      </article>

      {/* Card 3: Pending Tasks */}
      <article className="h-full bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] leading-[20px] font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Pending Tasks
          </span>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-warning-container dark:bg-amber-950/60 text-on-warning-container dark:text-amber-300 shrink-0">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[36px] leading-[44px] tracking-[-0.75px] font-bold text-light-on-surface dark:text-dark-on-surface tabular-nums">
            {pending}
          </span>
          <span className="text-[13px] leading-[18px] text-light-on-error-container dark:text-red-300 tabular-nums">
            {highPending} high priority
          </span>
        </div>
      </article>
    </section>
  );
}
