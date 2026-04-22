import { useCallback, useEffect, useState } from "react";
import { completionStore, habitStore, subscribe } from "@/lib/habits/store";
import type { Completion, Habit, HabitFrequency } from "@/lib/habits/types";
import { toggleCompletion, uid } from "@/lib/habits/utils";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const fetchedHabits = await habitStore.list();
    const fetchedCompletions = await completionStore.list();
    setHabits(fetchedHabits);
    setCompletions(fetchedCompletions);
  }, []);

  useEffect(() => {
    refresh().then(() => setHydrated(true));

    const unsub = subscribe(refresh);
    return unsub;
  }, [refresh]);

  const addHabit = useCallback(
    async (name: string, frequency: HabitFrequency) => {
      const next: Habit = {
        id: uid(),
        name: name.trim(),
        frequency,
        created_at: new Date().toISOString(),
      };

      setHabits((prev) => [...prev, next]);

      await habitStore.add(next);
    },
    [],
  );

  const updateHabit = useCallback(async (id: string, patch: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    );

    await habitStore.update(id, patch);
  }, []);

  const removeHabit = useCallback(async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => prev.filter((c) => c.habit_id !== id));

    await habitStore.delete(id);
  }, []);

  const toggle = useCallback(
    async (habit: Habit, date: Date) => {
      const nextCompletions = toggleCompletion(completions, habit, date);

      const isNowCompleted = nextCompletions.length > completions.length;

      setCompletions(nextCompletions);

      if (isNowCompleted) {
        const added = nextCompletions.find(
          (nc) =>
            !completions.some(
              (c) => c.habit_id === nc.habit_id && c.period_key === nc.period_key,
            ),
        );
        if (added) await completionStore.add(added);
      } else {
        const removed = completions.find(
          (c) =>
            !nextCompletions.some(
              (nc) => nc.habit_id === c.habit_id && nc.period_key === c.period_key,
            ),
        );
        if (removed)
          await completionStore.remove(removed.habit_id, removed.period_key);
      }
    },
    [completions],
  );

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
