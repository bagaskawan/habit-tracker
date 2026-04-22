export type HabitFrequency = "daily" | "weekly" | "monthly";

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  createdAt: string; // ISO
  archived?: boolean;
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD for daily; YYYY-Www for weekly; YYYY-MM for monthly
  completedAt: string; // ISO
}

export interface ReminderSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
}
