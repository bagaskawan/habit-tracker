import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Flame, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  habitCompletionPctForMonth,
  isCompleted,
  streakFor,
} from "@/lib/habits/utils";
import type { Completion, Habit } from "@/lib/habits/types";
import { AddHabit } from "./AddHabit";
import type { HabitFrequency } from "@/lib/habits/types";
import { useHabits } from "@/hooks/useHabits";

function EmptyState({
  message,
  onAddHabit,
}: {
  message: string;
  onAddHabit: (name: string, freq: HabitFrequency) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center mt-6">
      <p className="font-serif text-2xl text-muted-foreground mb-4">
        {message}
      </p>
      <AddHabit onAddHabit={onAddHabit} />
    </div>
  );
}

export function HabitList({
  habits,
  completions,
  days,
  reference,
  onToggle,
  onRemove,
  onAddHabit,
  onUpdateHabit,
}: {
  habits: Habit[];
  completions: Completion[];
  days: Date[];
  reference: Date;
  onToggle: (h: Habit, d: Date) => void;
  onRemove: (id: string) => void;
  onAddHabit: (name: string, freq: HabitFrequency) => void;
  onUpdateHabit?: (id: string, patch: Partial<Habit>) => void;
}) {
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState("");

  if (habits.length === 0) {
    return (
      <EmptyState
        message="No daily habits yet. Click 'New habit' to start."
        onAddHabit={onAddHabit}
      />
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Habit
            </th>
            {days.map((d) => {
              const isToday = isSameDay(d, new Date());
              return (
                <th
                  key={d.toISOString()}
                  className={`w-8 py-3 text-center text-[16px] font-normal text-muted-foreground ${
                    isToday ? "bg-red-50 dark:bg-red-950/30" : ""
                  }`}
                >
                  <span
                    className={
                      isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white mx-auto font-bold"
                        : ""
                    }
                  >
                    {d.getDate()}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              %
            </th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"></th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const pct = habitCompletionPctForMonth(completions, h, reference);
            const streak = streakFor(completions, h);
            return (
              <tr
                key={h.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/40"
              >
                <td className="sticky left-0 z-10 bg-card px-4 py-3 font-medium">
                  <button
                    onClick={() => {
                      setEditingHabit(h);
                      setEditName(h.name);
                    }}
                    className="cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    {h.name}
                  </button>
                </td>
                {days.map((d) => {
                  const isToday = isSameDay(d, new Date());
                  const done = isCompleted(completions, h, d);
                  return (
                    <td
                      key={d.toISOString()}
                      className={`px-0.5 py-2 text-center ${
                        isToday ? "bg-red-50 dark:bg-red-950/30" : ""
                      }`}
                    >
                      <button
                        onClick={() => onToggle(h, d)}
                        className={`h-6 w-6 rounded-sm border transition-colors ${
                          done
                            ? "border-primary bg-primary"
                            : "border-border bg-transparent hover:border-foreground/40"
                        }`}
                        aria-label={`Toggle ${format(d, "MMM d")}`}
                      />
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
                  {pct.toFixed(0)}%
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Flame className="h-3 w-3" />
                    {streak}
                  </span>
                </td>
                <td className="px-2 py-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setHabitToDelete(h)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog
        open={!!habitToDelete}
        onOpenChange={(open) => !open && setHabitToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-500">
                {`'${habitToDelete?.name}'`}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setHabitToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (habitToDelete) {
                  onRemove(habitToDelete.id);
                  setHabitToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!editingHabit}
        onOpenChange={(open) => {
          if (!open) setEditingHabit(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Change the name of your habit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Habit name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && editName.trim() && editingHabit) {
                  onUpdateHabit?.(editingHabit.id, { name: editName.trim() });
                  setEditingHabit(null);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingHabit(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editName.trim() && editingHabit) {
                  onUpdateHabit?.(editingHabit.id, { name: editName.trim() });
                  setEditingHabit(null);
                }
              }}
              disabled={
                !editName.trim() || editName.trim() === editingHabit?.name
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
