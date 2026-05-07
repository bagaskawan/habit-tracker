import { supabase } from "@/lib/supabase/supabaseClient";
import type { Habit, Completion, ReminderSettings } from "@/lib/habits/types";

// const HABITS_KEY = "ht.habits.v1";
// const COMPLETIONS_KEY = "ht.completions.v1";
const REMINDER_KEY = "ht.reminder.v1";
const THEME_KEY = "ht.theme.v1";
const API_URL = "http://localhost:3000/api";

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

const getHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("User not authenticated");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`, // Tiket masuk untuk backend!
  };
};

export const habitStore = {
  list: async () => {
    const response = await fetch(`${API_URL}/habits`, {
      method: "GET",
      headers: await getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch habits");
    const result = await response.json();
    return result.data;
  },

  add: async (habitData: { name: string; frequency: string }) => {
    const response = await fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(habitData),
    });

    if (!response.ok) throw new Error("Failed to fetch habits");
    const result = await response.json();
    return result.data;
  },

  update: async (id: string, updates: Partial<Habit>) => {
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Failed to update habits");
    const result = await response.json();
    return result.data;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete habits");
    return true;
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("habit_completions").insert([
      {
        habit_id: completion.habit_id,
        period_key: completion.period_key,
        completed_at: completion.completed_at || new Date().toISOString(),
        user_id: user?.id,
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
