import { Clock, MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Task, TaskPriority } from '../types/task';

interface TaskRowProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

function PriorityTag({ priority }: { priority: TaskPriority }) {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-light-error-container dark:bg-red-950/60 text-light-on-error-container dark:text-red-200 whitespace-nowrap shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full bg-light-error dark:bg-red-400"
          aria-hidden="true"
        />
        <span className="text-[12px] leading-[16px] font-medium">High</span>
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning-container dark:bg-amber-950/60 text-on-warning-container dark:text-amber-200 whitespace-nowrap shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full bg-warning dark:bg-amber-400"
          aria-hidden="true"
        />
        <span className="text-[12px] leading-[16px] font-medium">Medium</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-container dark:bg-emerald-950/60 text-on-success-container dark:text-emerald-200 whitespace-nowrap shrink-0">
      <span
        className="w-1.5 h-1.5 rounded-full bg-success dark:bg-emerald-400"
        aria-hidden="true"
      />
      <span className="text-[12px] leading-[16px] font-medium">Low</span>
    </span>
  );
}

export function TaskRow({
  task,
  onToggleComplete,
  onToggleImportant,
  onEdit,
  onDelete,
  compact = false,
}: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-5 py-4 first:rounded-t-[14px] last:rounded-b-[14px] hover:bg-light-surface-container-low/60 dark:hover:bg-dark-surface-container-low/70 transition-colors duration-150 ${
        task.completed ? 'opacity-65' : ''
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <label className="relative inline-flex items-center mt-0.5 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            className="sr-only peer"
          />
          <span
            className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all duration-150 ${
              task.completed
                ? 'bg-light-primary border-light-primary dark:bg-dark-primary-container dark:border-dark-primary-container scale-105'
                : 'border-light-outline/60 dark:border-dark-outline bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest group-hover:border-accent'
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 text-white transition-all duration-150 ${
                task.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </label>

        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-[14px] leading-[20px] font-semibold truncate ${
                task.completed
                  ? 'line-through text-light-on-surface-variant dark:text-dark-on-surface-variant'
                  : 'text-light-on-surface dark:text-dark-on-surface'
              }`}
            >
              {task.title}
            </span>
            {task.important && (
              <Star
                className="w-3.5 h-3.5 text-warning fill-warning shrink-0"
                aria-label="Important"
              />
            )}
          </div>
          {task.description && (
            <p className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant line-clamp-1">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pl-8 sm:pl-0 shrink-0">
        <span className="inline-flex items-center gap-1 text-light-on-surface-variant dark:text-dark-on-surface-variant whitespace-nowrap">
          {!compact && <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
          <span className="font-mono text-[12px] leading-[16px] font-medium tabular-nums">
            {task.dueTime}
          </span>
        </span>

        <PriorityTag priority={task.priority} />

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container text-light-on-surface-variant dark:text-dark-on-surface-variant border border-light-outline-variant dark:border-dark-outline-variant whitespace-nowrap shrink-0">
          <span className="text-[12px] leading-[16px] font-medium">{task.category}</span>
        </span>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={`Actions for ${task.title}`}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container transition-colors duration-150 cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-9 z-30 w-44 rounded-[12px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant shadow-lg py-1.5"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggleImportant(task.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] leading-[18px] text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span>{task.important ? 'Remove Important' : 'Mark Important'}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] leading-[18px] text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 shrink-0" />
                <span>Edit Task</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] leading-[18px] text-light-error dark:text-dark-error hover:bg-light-error-container/50 dark:hover:bg-red-950/50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
