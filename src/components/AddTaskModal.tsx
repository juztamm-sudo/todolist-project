import { X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { CATEGORIES, TODAY_DATE } from '../data/initialTasks';
import { Task, TaskCategory, TaskPriority } from '../types/task';

interface AddTaskModalProps {
  open: boolean;
  editingTask: Task | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    category: TaskCategory;
    priority: TaskPriority;
    important: boolean;
  }) => void;
}

export function AddTaskModal({
  open,
  editingTask,
  defaultDate,
  onClose,
  onSave,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(TODAY_DATE);
  const [dueTime, setDueTime] = useState('5:00 PM');
  const [category, setCategory] = useState<TaskCategory>('Product Design');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [important, setImportant] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setImportant(editingTask.important);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(defaultDate || TODAY_DATE);
      setDueTime('5:00 PM');
      setCategory('Product Design');
      setPriority('Medium');
      setImportant(false);
    }
    const timer = setTimeout(() => titleInputRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [open, editingTask, defaultDate]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onSave({
      id: editingTask?.id,
      title: cleanTitle,
      description:
        description.trim() || 'Scheduled via Taskly quick capture.',
      dueDate: dueDate || TODAY_DATE,
      dueTime: dueTime.trim() || '5:00 PM',
      category,
      priority,
      important: editingTask ? important : important || priority === 'High',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/35 dark:bg-black/65 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-modal-title"
        className="w-full max-w-lg rounded-[18px] bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)] overflow-hidden view-transition"
      >
        <form onSubmit={handleSubmit}>
          <header className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-light-outline-variant dark:border-dark-outline-variant">
            <div>
              <h2
                id="add-modal-title"
                className="text-[18px] leading-[24px] tracking-[-0.2px] font-semibold text-light-on-surface dark:text-dark-on-surface"
              >
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <p className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5">
                Capture a task with due date, priority, and category.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low transition-colors duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="px-6 py-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                Task title
              </span>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Design interactive onboarding checklist"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface placeholder:text-light-outline dark:placeholder:text-dark-outline text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                Description
              </span>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, links, or key deliverables..."
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface placeholder:text-light-outline dark:placeholder:text-dark-outline text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                  Due date
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                  Time
                </span>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="5:00 PM"
                  className="w-full px-3 py-2.5 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                Priority
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {(['High', 'Medium', 'Low'] as TaskPriority[]).map((level) => {
                  const selected = priority === level;
                  const activeStyle =
                    level === 'High'
                      ? 'border-light-error bg-light-error-container text-light-on-error-container dark:bg-red-950/60 dark:text-red-200 dark:border-red-500/70'
                      : level === 'Medium'
                        ? 'border-warning bg-warning-container text-on-warning-container dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-500/70'
                        : 'border-success bg-success-container text-on-success-container dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-500/70';

                  const dotColor =
                    level === 'High'
                      ? 'bg-light-error dark:bg-red-400'
                      : level === 'Medium'
                        ? 'bg-warning dark:bg-amber-400'
                        : 'bg-success dark:bg-emerald-400';

                  return (
                    <label key={level} className="cursor-pointer">
                      <input
                        type="radio"
                        name="modal-priority"
                        value={level}
                        checked={selected}
                        onChange={() => setPriority(level)}
                        className="sr-only"
                      />
                      <span
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] border transition-colors duration-150 ${
                          selected
                            ? activeStyle
                            : 'border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${dotColor}`}
                          aria-hidden="true"
                        />
                        <span className="text-[12px] leading-[16px] font-medium">
                          {level}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="w-4 h-4 rounded-[4px] accent-[#5300B7] border-light-outline-variant cursor-pointer"
              />
              <span className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Star as important task
              </span>
            </label>
          </div>

          <footer className="flex items-center justify-end gap-3 px-6 py-4 bg-light-surface-container-low/60 dark:bg-dark-surface-container-low/70 border-t border-light-outline-variant dark:border-dark-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low transition-colors duration-150 text-[14px] leading-[20px] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[10px] bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors duration-150 shadow-sm text-[14px] leading-[20px] font-medium cursor-pointer"
            >
              {editingTask ? 'Save Changes' : 'Save Task'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
