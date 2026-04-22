import { supabase } from "@/lib/supabase/supabaseClient";
import type { Habit, Completion, ReminderSettings } from "@/lib/habits/types";

// const HABITS_KEY = "ht.habits.v1";
// const COMPLETIONS_KEY = "ht.completions.v1";
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
  async list() {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as Habit[];
  },

  async add(habit: Habit) {
    const { error } = await supabase.from("habits").insert([habit]);
    if (error) throw error;
    return;
  },

  async update(id: string, updates: Partial<Habit>) {
    const { error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return;
  },

  async delete(id: string) {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;
    return;
  },
};

export const completionStore = {
  async list(): Promise<Completion[]> {
    const { data, error } = await supabase
      .from("habit_completions")
      .select("*");

    if (error) {
      console.error("Error fetching completions:", error);
      return [];
    }
    return data as Completion[];
  },

  async add(completion: Completion) {
    const { error } = await supabase.from("habit_completions").insert([
      {
        habit_id: completion.habit_id,
        period_key: completion.period_key,
        completed_at: completion.completed_at || new Date().toISOString(),
      },
    ]);
    if (error) console.error("Error checking habit:", error);
  },

  async remove(habit_id: string, period_key: string) {
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .match({ habit_id, period_key });

    if (error) console.error("Error unchecking habit:", error);
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
