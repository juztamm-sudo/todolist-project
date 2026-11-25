import { Menu, Plus, Search } from 'lucide-react';
import { RefObject } from 'react';
import { AVATAR_IMAGE_SRC } from '../data/initialTasks';
import { NavView } from '../types/task';
import { ResilientImage } from './ResilientImage';

interface HeaderBarProps {
  activeView: NavView;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenNewTask: () => void;
  onOpenMobileSidebar: () => void;
  onSelectSettings: () => void;
  displayName: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function HeaderBar({
  activeView,
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenMobileSidebar,
  onSelectSettings,
  displayName,
  searchInputRef,
}: HeaderBarProps) {
  const placeholder =
    activeView === 'upcoming'
      ? 'Filter upcoming tasks...'
      : activeView === 'settings'
        ? 'Search settings...'
        : 'Search tasks, categories, or times...';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-20 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-sm border-b border-light-outline-variant dark:border-dark-outline-variant px-6 lg:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation"
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          <label className="relative flex items-center w-full">
            <span className="sr-only">Search</span>
            <span
              aria-hidden="true"
              className="absolute left-3.5 text-light-outline dark:text-dark-outline pointer-events-none"
            >
              <Search className="w-4 h-4" />
            </span>
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface placeholder:text-light-outline dark:placeholder:text-dark-outline text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-150"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-light-primary-container text-light-on-primary-container hover:bg-light-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors duration-150 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-[14px] leading-[20px] font-medium">Add New Task</span>
          </button>

          <button
            type="button"
            onClick={onSelectSettings}
            aria-label={`${displayName} profile and settings`}
            title={`${displayName} — Settings`}
            className="inline-flex items-center justify-center rounded-full p-0.5 border border-light-outline-variant dark:border-dark-outline-variant hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-150 cursor-pointer shrink-0"
          >
            <ResilientImage
              src={AVATAR_IMAGE_SRC}
              alt={`${displayName} profile avatar`}
              fallbackType="avatar"
              fallbackLabel={initials || 'ML'}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
