export type HabitFrequency = "daily";

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  created_at: string; // ISO
  archived?: boolean;
}

export interface Completion {
  habit_id: string;
  period_key: string; // YYYY-MM-DD for daily
  completed_at: string; // ISO
}

export interface ReminderSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
}
