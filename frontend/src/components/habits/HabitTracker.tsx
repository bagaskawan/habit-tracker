import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { completionRate, dailyTrend, monthDays } from "@/lib/habits/utils";
import { HabitHeader } from "./HabitHeader";
import { HabitStats } from "./HabitStats";
import { HabitList } from "./HabitList";

export function HabitTracker() {
  const { habits, completions, addHabit, removeHabit, toggle, hydrated } =
    useHabits();
  const [reference, setReference] = useState(new Date());

  const dailyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "daily" && !h.archived),
    [habits],
  );

  const days = useMemo(() => monthDays(reference), [reference]);

  const rate = useMemo(
    () => completionRate(habits, completions, reference),
    [habits, completions, reference],
  );

  const trend = useMemo(
    () => dailyTrend(habits, completions, reference),
    [habits, completions, reference],
  );

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HabitHeader onAddHabit={addHabit} hasHabits={habits.length > 0} />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <HabitStats
          reference={reference}
          onReferenceChange={setReference}
          dailyHabitsCount={dailyHabits.length}
          completionRate={rate}
          trendData={trend}
        />

        <HabitList
          habits={dailyHabits}
          completions={completions}
          days={days}
          reference={reference}
          onToggle={toggle}
          onRemove={removeHabit}
          onAddHabit={addHabit}
        />
      </main>
    </div>
  );
}
