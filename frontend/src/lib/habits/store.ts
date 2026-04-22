import type { Habit, Completion, ReminderSettings } from "@/lib/habits/types";

const HABITS_KEY = "ht.habits.v1";
const COMPLETIONS_KEY = "ht.completions.v1";
const REMINDER_KEY = "ht.reminder.v1";
const THEME_KEY = "ht.theme.v1";

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("ht:change", { detail: { key } }));
}

export const habitStore = {
  list(): Habit[] {
    return read<Habit[]>(HABITS_KEY, []);
  },
  save(habits: Habit[]) {
    write(HABITS_KEY, habits);
  },
};

export const completionStore = {
  list(): Completion[] {
    return read<Completion[]>(COMPLETIONS_KEY, []);
  },
  save(items: Completion[]) {
    write(COMPLETIONS_KEY, items);
  },
};

export const reminderStore = {
  get(): ReminderSettings {
    return read<ReminderSettings>(REMINDER_KEY, {
      enabled: false,
      hour: 20,
      minute: 0,
    });
  },
  set(value: ReminderSettings) {
    write(REMINDER_KEY, value);
  },
};

export const themeStore = {
  get(): "light" | "dark" {
    return read<"light" | "dark">(THEME_KEY, "light");
  },
  set(value: "light" | "dark") {
    write(THEME_KEY, value);
  },
};

export function subscribe(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener("ht:change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("ht:change", handler);
    window.removeEventListener("storage", handler);
  };
}
