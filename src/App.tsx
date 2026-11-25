import { ArrowRight, Calendar, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AddTaskModal } from './components/AddTaskModal';
import { HeaderBar } from './components/HeaderBar';
import { OverviewCards } from './components/OverviewCards';
import { ResilientImage } from './components/ResilientImage';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { TaskRow } from './components/TaskRow';
import { UpcomingView } from './components/UpcomingView';
import {
  DEFAULT_SETTINGS,
  EMPTY_DESK_IMAGE_SRC,
  formatUpcomingDateLabel,
  INITIAL_TASKS,
  TODAY_DATE,
  TODAY_DISPLAY_DATE,
} from './data/initialTasks';
import {
  NavView,
  Task,
  TaskCategory,
  TaskPriority,
  UserSettings,
} from './types/task';

const TASKS_STORAGE_KEY = 'taskly.tasks.v1';
const SETTINGS_STORAGE_KEY = 'taskly.settings.v1';

function loadInitialTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

function loadInitialSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadInitialTasks);
  const [settings, setSettings] = useState<UserSettings>(loadInitialSettings);
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(
    undefined
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectView = (view: NavView) => {
    setActiveView(view);
    setSearchQuery('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleImportant = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenNewTask = (prefillDate?: string) => {
    setEditingTask(null);
    setModalDefaultDate(prefillDate);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalDefaultDate(undefined);
    setModalOpen(true);
  };

  const handleSaveTask = (payload: {
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    category: TaskCategory;
    priority: TaskPriority;
    important: boolean;
  }) => {
    if (payload.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === payload.id
            ? {
                ...t,
                title: payload.title,
                description: payload.description,
                dueDate: payload.dueDate,
                dueTime: payload.dueTime,
                category: payload.category,
                priority: payload.priority,
                important: payload.important,
              }
            : t
        )
      );
      return;
    }

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      dueTime: payload.dueTime,
      priority: payload.priority,
      category: payload.category,
      completed: false,
      important: payload.important,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q) {
        const matches =
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.dueTime.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (activeView === 'today') return t.dueDate === TODAY_DATE;
      if (activeView === 'upcoming') return t.dueDate > TODAY_DATE;
      if (activeView === 'completed') return t.completed;
      if (activeView === 'important') return t.important;
      if (activeView.startsWith('cat-')) {
        return t.category === activeView.replace('cat-', '');
      }
      return true;
    });
  }, [tasks, searchQuery, activeView]);

  const todayDashboardItems = useMemo(
    () => filteredTasks.filter((t) => t.dueDate === TODAY_DATE),
    [filteredTasks]
  );

  const upcomingDashboardGroups = useMemo(() => {
    const upcoming = filteredTasks.filter((t) => t.dueDate > TODAY_DATE);
    const groups: Record<string, Task[]> = {};
    for (const item of upcoming) {
      if (!groups[item.dueDate]) groups[item.dueDate] = [];
      groups[item.dueDate].push(item);
    }
    return Object.keys(groups)
      .sort()
      .map((date) => ({ date, items: groups[date] }));
  }, [filteredTasks]);

  const viewTitleMap: Record<string, string> = {
    all: 'My Tasks',
    today: "Today's Tasks",
    completed: 'Completed Tasks',
    important: 'Important Tasks',
  };

  const listHeading = activeView.startsWith('cat-')
    ? `${activeView.replace('cat-', '')} Tasks`
    : viewTitleMap[activeView] || "Today's Tasks";

  const firstName = settings.displayName.trim().split(' ')[0] || 'Maya';

  return (
    <div className="min-h-screen flex bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface">
      <Sidebar
        activeView={activeView}
        onSelectView={handleSelectView}
        tasks={tasks}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar
          activeView={activeView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewTask={() => handleOpenNewTask()}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSelectSettings={() => handleSelectView('settings')}
          displayName={settings.displayName}
          searchInputRef={searchInputRef}
        />

        <main className="flex-1 px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {activeView === 'settings' ? (
              <SettingsView
                settings={settings}
                searchQuery={searchQuery}
                onSaveSettings={setSettings}
                onResetDemoTasks={() => setTasks(INITIAL_TASKS)}
              />
            ) : activeView === 'upcoming' ? (
              <UpcomingView
                tasks={tasks}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                onToggleComplete={handleToggleComplete}
                onToggleImportant={handleToggleImportant}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onOpenNewTask={handleOpenNewTask}
              />
            ) : (
              <div
                key={activeView}
                className="flex flex-col gap-8 view-transition"
              >
                {/* Greeting & Date Header */}
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      <Calendar className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                      <span className="text-[12px] leading-[16px] font-medium tabular-nums">
                        {TODAY_DISPLAY_DATE}
                      </span>
                    </div>
                    <h1 className="text-[28px] leading-[36px] tracking-[-0.5px] font-bold text-light-on-surface dark:text-dark-on-surface">
                      Good afternoon, {firstName} 👋
                    </h1>
                    <p className="text-[15px] leading-[22px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      Let&apos;s get things done today.
                    </p>
                  </div>
                </section>

                {/* Overview Cards (shown on Dashboard and My Tasks) */}
                {(activeView === 'dashboard' || activeView === 'all') && (
                  <OverviewCards tasks={tasks} />
                )}

                {filteredTasks.length === 0 ? (
                  <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-10 flex flex-col items-center text-center gap-4">
                    <ResilientImage
                      src={EMPTY_DESK_IMAGE_SRC}
                      alt="Calm desk illustration for empty task list"
                      className="w-48 h-36 object-cover rounded-[12px]"
                    />
                    <div className="flex flex-col gap-1 max-w-sm">
                      <h2 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                        No tasks match this view
                      </h2>
                      <p className="text-[14px] leading-[20px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        Create a new task or clear your search filter to see your schedule.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="px-4 py-2 rounded-[10px] bg-light-surface-container-low dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container transition-colors duration-150 text-[14px] leading-[20px] font-medium cursor-pointer"
                        >
                          Clear search
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenNewTask()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors duration-150 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span className="text-[14px] leading-[20px] font-medium">
                          Add New Task
                        </span>
                      </button>
                    </div>
                  </section>
                ) : activeView === 'dashboard' ? (
                  <>
                    {/* Today's Tasks Section */}
                    <section aria-label="Today's Tasks" className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-[18px] leading-[24px] tracking-[-0.2px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                            Today&apos;s Tasks
                          </h2>
                          <span
                            role="status"
                            className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container tabular-nums"
                          >
                            <span className="text-[12px] leading-[16px] font-semibold">
                              {todayDashboardItems.length}
                            </span>
                          </span>
                        </div>
                        <span className="hidden sm:inline text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          Click checkbox to complete
                        </span>
                      </div>

                      {todayDashboardItems.length === 0 ? (
                        <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-6 text-center text-[14px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          No tasks scheduled for today match your filter.
                        </div>
                      ) : (
                        <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] divide-y divide-light-outline-variant dark:divide-dark-outline-variant overflow-visible">
                          {todayDashboardItems.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              onToggleComplete={handleToggleComplete}
                              onToggleImportant={handleToggleImportant}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                            />
                          ))}
                        </div>
                      )}
                    </section>

                    {/* Upcoming Tasks Section */}
                    {upcomingDashboardGroups.length > 0 && (
                      <section aria-label="Upcoming Tasks" className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-[18px] leading-[24px] tracking-[-0.2px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                            Upcoming Tasks
                          </h2>
                          <button
                            type="button"
                            onClick={() => handleSelectView('upcoming')}
                            className="inline-flex items-center gap-1 text-light-primary dark:text-dark-primary hover:underline text-[14px] leading-[20px] font-medium cursor-pointer whitespace-nowrap"
                          >
                            <span>View all upcoming</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          {upcomingDashboardGroups.slice(0, 2).map((group) => (
                            <div
                              key={group.date}
                              className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] overflow-visible"
                            >
                              <div className="flex items-center justify-between px-5 py-3.5 bg-light-surface-container-low/50 dark:bg-dark-surface-container-low/70 border-b border-light-outline-variant dark:border-dark-outline-variant rounded-t-[14px]">
                                <div className="flex items-center gap-2">
                                  <Calendar
                                    className="w-4 h-4 text-accent shrink-0"
                                    aria-hidden="true"
                                  />
                                  <h3 className="text-[14px] leading-[20px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                                    {formatUpcomingDateLabel(group.date)}
                                  </h3>
                                </div>
                                <span className="text-[12px] leading-[16px] font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                                  {group.items.length}{' '}
                                  {group.items.length === 1 ? 'task' : 'tasks'}
                                </span>
                              </div>
                              <div className="divide-y divide-light-outline-variant dark:divide-dark-outline-variant">
                                {group.items.map((task) => (
                                  <TaskRow
                                    key={task.id}
                                    task={task}
                                    compact
                                    onToggleComplete={handleToggleComplete}
                                    onToggleImportant={handleToggleImportant}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  /* Filtered Single-List Views (My Tasks, Today, Completed, Important, Category) */
                  <section aria-label={listHeading} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] leading-[24px] tracking-[-0.2px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                          {listHeading}
                        </h2>
                        <span
                          role="status"
                          className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container tabular-nums"
                        >
                          <span className="text-[12px] leading-[16px] font-semibold">
                            {filteredTasks.length}
                          </span>
                        </span>
                      </div>
                      <span className="hidden sm:inline text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        Click checkbox to complete
                      </span>
                    </div>

                    <div className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] divide-y divide-light-outline-variant dark:divide-dark-outline-variant overflow-visible">
                      {filteredTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onToggleImportant={handleToggleImportant}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddTaskModal
        open={modalOpen}
        editingTask={editingTask}
        defaultDate={modalDefaultDate}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}
