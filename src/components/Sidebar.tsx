import {
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Star,
  Sun,
  X,
} from 'lucide-react';
import { CATEGORIES, TODAY_DATE } from '../data/initialTasks';
import { NavView, Task } from '../types/task';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  tasks: Task[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeView,
  onSelectView,
  tasks,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const totalCount = tasks.length;
  const todayCount = tasks.filter((t) => t.dueDate === TODAY_DATE).length;
  const upcomingCount = tasks.filter((t) => t.dueDate > TODAY_DATE).length;

  const navItems: {
    id: NavView;
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all', label: 'My Tasks', icon: CheckSquare, count: totalCount },
    { id: 'today', label: 'Today', icon: Sun, count: todayCount },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: upcomingCount },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'important', label: 'Important', icon: Star },
  ];

  const handleNavClick = (view: NavView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/35 dark:bg-black/60 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Workspace navigation"
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border-r border-light-outline-variant dark:border-dark-outline-variant flex flex-col justify-between px-4 py-5 transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[6px] cursor-pointer"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-light-primary dark:bg-dark-primary-container text-white shadow-sm shrink-0">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span className="text-[16px] leading-[22px] font-semibold tracking-tight text-light-on-surface dark:text-dark-on-surface whitespace-nowrap">
                Taskly
              </span>
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav aria-label="Primary" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-[14px] leading-[20px] font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low hover:text-light-on-surface dark:hover:text-dark-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && (
                    <span
                      className={`text-[12px] leading-[16px] font-semibold px-2 py-0.5 rounded-full tabular-nums shrink-0 ${
                        isActive
                          ? 'bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest text-light-on-secondary-container dark:text-dark-on-secondary-container'
                          : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Categories Section */}
          <div className="flex flex-col gap-2 pt-4 border-t border-light-outline-variant dark:border-dark-outline-variant">
            <div className="px-3">
              <span className="text-[12px] leading-[16px] font-medium text-light-outline dark:text-dark-outline uppercase tracking-wider">
                Categories
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((category) => {
                const viewKey: NavView = `cat-${category.name}`;
                const isActive = activeView === viewKey;
                const count = tasks.filter((t) => t.category === category.name).length;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleNavClick(viewKey)}
                    className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-[14px] leading-[20px] transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-medium'
                        : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low hover:text-light-on-surface dark:hover:text-dark-on-surface'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${category.dotClass}`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{category.name}</span>
                    </span>
                    <span className="text-[12px] leading-[16px] font-medium text-light-outline dark:text-dark-outline tabular-nums shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Settings Link */}
        <div className="pt-4 border-t border-light-outline-variant dark:border-dark-outline-variant">
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[14px] leading-[20px] font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
              activeView === 'settings'
                ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
                : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low hover:text-light-on-surface dark:hover:text-dark-on-surface'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
