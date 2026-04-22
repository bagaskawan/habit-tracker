import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subDays,
  parseISO,
} from "date-fns";
import type { Completion, Habit } from "./types";

export const dailyKey = (d: Date) => format(d, "yyyy-MM-dd");

export function keyForFrequency(habit: Habit, d: Date) {
  return dailyKey(d);
}

export function isCompleted(completions: Completion[], habit: Habit, d: Date) {
  const key = keyForFrequency(habit, d);
  return completions.some((c) => c.habit_id === habit.id && c.period_key === key);
}

export function toggleCompletion(
  completions: Completion[],
  habit: Habit,
  d: Date,
): Completion[] {
  const key = keyForFrequency(habit, d);
  const exists = completions.some(
    (c) => c.habit_id === habit.id && c.period_key === key,
  );
  if (exists) {
    return completions.filter(
      (c) => !(c.habit_id === habit.id && c.period_key === key),
    );
  }
  return [
    ...completions,
    { habit_id: habit.id, period_key: key, completed_at: new Date().toISOString() },
  ];
}

export function monthDays(reference: Date) {
  return eachDayOfInterval({
    start: startOfMonth(reference),
    end: endOfMonth(reference),
  });
}

export function completionRate(
  habits: Habit[],
  completions: Completion[],
  reference: Date,
): number {
  const days = monthDays(reference);
  const dailyHabits = habits.filter(
    (h) => !h.archived && h.frequency === "daily",
  );
  if (dailyHabits.length === 0) return 0;
  const total = dailyHabits.length * days.length;
  const done = days.reduce((acc, d) => {
    return (
      acc + dailyHabits.filter((h) => isCompleted(completions, h, d)).length
    );
  }, 0);
  return total === 0 ? 0 : (done / total) * 100;
}

export function dailyTrend(
  habits: Habit[],
  completions: Completion[],
  reference: Date,
) {
  const days = monthDays(reference);
  const dailyHabits = habits.filter(
    (h) => !h.archived && h.frequency === "daily",
  );
  return days.map((d) => {
    const done = dailyHabits.filter((h) =>
      isCompleted(completions, h, d),
    ).length;
    const pct =
      dailyHabits.length === 0 ? 0 : (done / dailyHabits.length) * 100;
    return { day: d.getDate(), value: Math.round(pct) };
  });
}

export function streakFor(
  completions: Completion[],
  habit: Habit,
  today = new Date(),
): number {
  let streak = 0;
  let cursor = today;
  while (isCompleted(completions, habit, cursor)) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function habitCompletionPctForMonth(
  completions: Completion[],
  habit: Habit,
  reference: Date,
): number {
  const days = monthDays(reference);
  const done = days.filter((d) => isCompleted(completions, habit, d)).length;
  return (done / days.length) * 100;
}

export const uid = () => crypto.randomUUID();

export { parseISO };
