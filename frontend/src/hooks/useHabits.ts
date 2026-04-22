import { useCallback, useEffect, useState } from "react";
import { completionStore, habitStore, subscribe } from "@/lib/habits/store";
import type { Completion, Habit, HabitFrequency } from "@/lib/habits/types";
import { toggleCompletion, uid } from "@/lib/habits/utils";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setHabits(habitStore.list());
    setCompletions(completionStore.list());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const unsub = subscribe(refresh);
    return unsub;
  }, [refresh]);

  const addHabit = useCallback((name: string, frequency: HabitFrequency) => {
    const next: Habit = {
      id: uid(),
      name: name.trim(),
      frequency,
      createdAt: new Date().toISOString(),
    };
    const all = [...habitStore.list(), next];
    habitStore.save(all);
  }, []);

  const updateHabit = useCallback((id: string, patch: Partial<Habit>) => {
    const all = habitStore
      .list()
      .map((h) => (h.id === id ? { ...h, ...patch } : h));
    habitStore.save(all);
  }, []);

  const removeHabit = useCallback((id: string) => {
    habitStore.save(habitStore.list().filter((h) => h.id !== id));
    completionStore.save(
      completionStore.list().filter((c) => c.habitId !== id),
    );
  }, []);

  const toggle = useCallback((habit: Habit, date: Date) => {
    const next = toggleCompletion(completionStore.list(), habit, date);
    completionStore.save(next);
  }, []);

  return {
    habits,
    completions,
    addHabit,
    updateHabit,
    removeHabit,
    toggle,
    hydrated,
  };
}
