import { Check, RotateCcw } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { AVATAR_IMAGE_SRC } from '../data/initialTasks';
import { UserSettings } from '../types/task';
import { ResilientImage } from './ResilientImage';

interface SettingsViewProps {
  settings: UserSettings;
  searchQuery: string;
  onSaveSettings: (next: UserSettings) => void;
  onResetDemoTasks: () => void;
}

export function SettingsView({
  settings,
  searchQuery,
  onSaveSettings,
  onResetDemoTasks,
}: SettingsViewProps) {
  const [draft, setDraft] = useState<UserSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...draft,
      displayName: draft.displayName.trim() || 'Maya Lin',
      dailyGoal: Math.max(1, Math.min(50, Number(draft.dailyGoal) || 6)),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2600);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    const next = { ...draft, darkMode: enabled };
    setDraft(next);
    onSaveSettings(next);
  };

  const handleReset = () => {
    onResetDemoTasks();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2600);
  };

  const q = searchQuery.trim().toLowerCase();
  const showProfile =
    !q ||
    'profile display name daily task goal maya lin workspace'.includes(q);
  const showPreferences =
    !q ||
    'productivity preferences morning digest notification auto-archive completed dark mode theme appearance'.includes(
      q
    );

  const initials = draft.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto flex flex-col gap-6 view-transition"
    >
      <header>
        <h1 className="text-[28px] leading-[36px] tracking-[-0.5px] font-bold text-light-on-surface dark:text-dark-on-surface">
          Settings
        </h1>
        <p className="text-[15px] leading-[22px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Manage your profile, daily focus goals, and workspace preferences.
        </p>
      </header>

      {showProfile && (
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <ResilientImage
              src={AVATAR_IMAGE_SRC}
              alt={draft.displayName}
              fallbackType="avatar"
              fallbackLabel={initials || 'ML'}
              className="w-14 h-14 rounded-full object-cover border border-light-outline-variant dark:border-dark-outline-variant shrink-0"
            />
            <div className="flex flex-col">
              <h2 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                {draft.displayName || 'Maya Lin'}
              </h2>
              <span className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                {draft.email} · {draft.workspaceName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-light-outline-variant dark:border-dark-outline-variant">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                Display name
              </span>
              <input
                type="text"
                value={draft.displayName}
                onChange={(e) =>
                  setDraft({ ...draft, displayName: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface text-[14px] leading-[20px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-[16px] font-medium text-light-on-surface dark:text-dark-on-surface">
                Daily task goal
              </span>
              <input
                type="number"
                min={1}
                max={50}
                value={draft.dailyGoal}
                onChange={(e) =>
                  setDraft({ ...draft, dailyGoal: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-[10px] bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface dark:text-dark-on-surface text-[14px] leading-[20px] tabular-nums focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>
          </div>
        </section>
      )}

      {showPreferences && (
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)] flex flex-col gap-4">
          <h2 className="text-[16px] leading-[22px] font-semibold text-light-on-surface dark:text-dark-on-surface">
            Productivity Preferences
          </h2>

          <label className="flex items-center justify-between gap-4 py-2 border-b border-light-outline-variant dark:border-dark-outline-variant cursor-pointer">
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                Morning digest notification
              </p>
              <p className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Receive a summary of Today&apos;s Tasks at 8:30 AM.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.morningDigest}
              onChange={(e) =>
                setDraft({ ...draft, morningDigest: e.target.checked })
              }
              className="w-5 h-5 rounded-[6px] accent-[#5300B7] border-light-outline-variant cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-2 border-b border-light-outline-variant dark:border-dark-outline-variant cursor-pointer">
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                Auto-archive completed tasks
              </p>
              <p className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Move completed tasks to Completed view after 24 hours.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.autoArchive}
              onChange={(e) =>
                setDraft({ ...draft, autoArchive: e.target.checked })
              }
              className="w-5 h-5 rounded-[6px] accent-[#5300B7] border-light-outline-variant cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
            <div>
              <p className="text-[14px] leading-[20px] font-semibold text-light-on-surface dark:text-dark-on-surface">
                Dark mode appearance
              </p>
              <p className="text-[13px] leading-[18px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Switch workspace surfaces to low-glare dark mode.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.darkMode}
              onChange={(e) => handleDarkModeToggle(e.target.checked)}
              className="w-5 h-5 rounded-[6px] accent-[#5300B7] border-light-outline-variant cursor-pointer shrink-0"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-light-outline-variant dark:border-dark-outline-variant">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-light-outline-variant dark:border-dark-outline-variant text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-low dark:hover:bg-dark-surface-container-low transition-colors duration-150 text-[13px] leading-[18px] font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{resetNotice ? 'Tasks Restored' : 'Restore Sample Tasks'}</span>
            </button>

            <div className="flex items-center gap-3">
              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-success dark:text-emerald-400">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Preferences saved</span>
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-[10px] bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors duration-150 shadow-sm text-[14px] leading-[20px] font-medium cursor-pointer whitespace-nowrap"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </section>
      )}

      {!showProfile && !showPreferences && (
        <section className="bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant rounded-[14px] p-8 text-center">
          <p className="text-[14px] leading-[20px] text-light-on-surface-variant dark:text-dark-on-surface-variant">
            No settings match &ldquo;{searchQuery}&rdquo;.
          </p>
        </section>
      )}
    </form>
  );
}
