import { useMemo, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellOff,
  Sun,
  Moon,
  Flame,
  Check,
} from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useTheme } from "@/hooks/useTheme";
import { useReminder } from "@/hooks/useReminder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  completionRate,
  dailyTrend,
  habitCompletionPctForMonth,
  isCompleted,
  monthDays,
  streakFor,
} from "@/lib/habits/utils";
import type { HabitFrequency } from "@/lib/habits/types";
import { TrendChart } from "./TrendChart";
import { CompletionDonut } from "./CompletionDonut";

export function HabitTracker() {
  const { habits, completions, addHabit, removeHabit, toggle, hydrated } =
    useHabits();
  const { theme, toggle: toggleTheme } = useTheme();
  const { settings, update } = useReminder();
  const [reference, setReference] = useState(new Date());
  const [tab, setTab] = useState<HabitFrequency>("daily");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFreq, setNewFreq] = useState<HabitFrequency>("daily");

  const dailyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "daily" && !h.archived),
    [habits],
  );
  const weeklyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "weekly" && !h.archived),
    [habits],
  );
  const monthlyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "monthly" && !h.archived),
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

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName, newFreq);
    setNewName("");
    setNewFreq("daily");
    setOpen(false);
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl leading-none">
                Habit Tracker
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Daily, weekly, and monthly habits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ReminderControl
              enabled={settings.enabled}
              hour={settings.hour}
              minute={settings.minute}
              onToggle={(v) => update({ enabled: v })}
              onTime={(h, m) => update({ hour: h, minute: m })}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm" className="gap-2" />}>
                <Plus className="h-4 w-4" /> New habit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    New habit
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Read 20 pages"
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={newFreq}
                      onValueChange={(v) => setNewFreq(v as HabitFrequency)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Month
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setReference(subMonths(reference, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setReference(addMonths(reference, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 font-serif text-3xl">
              {format(reference, "MMMM yyyy")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {dailyHabits.length} daily · {weeklyHabits.length} weekly ·{" "}
              {monthlyHabits.length} monthly
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Total completion
            </p>
            <div className="mt-2 flex items-center gap-6">
              <CompletionDonut value={rate} />
              <div>
                <p className="font-serif text-4xl leading-none">
                  {rate.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  All daily habits this month
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Daily trend
            </p>
            <div className="mt-2 h-[120px]">
              <TrendChart data={trend} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as HabitFrequency)}
          className="mt-8"
        >
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <DailyGrid
              habits={dailyHabits}
              completions={completions}
              days={days}
              onToggle={toggle}
              onRemove={removeHabit}
              reference={reference}
            />
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <SimpleList
              emptyHint="No weekly habits yet."
              habits={weeklyHabits}
              completions={completions}
              reference={reference}
              onToggle={toggle}
              onRemove={removeHabit}
              periods={5}
              periodLabel={(i) => `Week ${i + 1}`}
              dateForIndex={(i) => {
                const d = new Date(reference);
                d.setDate(1 + i * 7);
                return d;
              }}
            />
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <SimpleList
              emptyHint="No monthly habits yet."
              habits={monthlyHabits}
              completions={completions}
              reference={reference}
              onToggle={toggle}
              onRemove={removeHabit}
              periods={1}
              periodLabel={() => format(reference, "MMM")}
              dateForIndex={() => reference}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DailyGrid({
  habits,
  completions,
  days,
  onToggle,
  onRemove,
  reference,
}: {
  habits: ReturnType<typeof useHabits>["habits"];
  completions: ReturnType<typeof useHabits>["completions"];
  days: Date[];
  onToggle: (h: any, d: Date) => void;
  onRemove: (id: string) => void;
  reference: Date;
}) {
  if (habits.length === 0) {
    return (
      <EmptyState message="No daily habits yet. Click 'New habit' to start." />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Habit
            </th>
            {days.map((d) => (
              <th
                key={d.toISOString()}
                className="w-8 py-3 text-center text-[11px] font-normal text-muted-foreground"
              >
                {d.getDate()}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              %
            </th>
            <th className="px-2 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Streak
            </th>
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
                  {h.name}
                </td>
                {days.map((d) => {
                  const done = isCompleted(completions, h, d);
                  return (
                    <td
                      key={d.toISOString()}
                      className="px-0.5 py-2 text-center"
                    >
                      <button
                        onClick={() => onToggle(h, d)}
                        className={`h-6 w-6 rounded-sm border transition-colors ${
                          done
                            ? "border-grid-filled bg-grid-filled"
                            : "border-border bg-grid-empty hover:border-foreground/40"
                        }`}
                        aria-label={`Toggle ${format(d, "MMM d")}`}
                      />
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {pct.toFixed(0)}%
                </td>
                <td className="px-2 py-3 text-right">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Flame className="h-3 w-3" />
                    {streak}
                  </span>
                </td>
                <td className="px-2 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(h.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SimpleList({
  habits,
  completions,
  onToggle,
  onRemove,
  periods,
  periodLabel,
  dateForIndex,
  emptyHint,
}: {
  habits: ReturnType<typeof useHabits>["habits"];
  completions: ReturnType<typeof useHabits>["completions"];
  reference: Date;
  onToggle: (h: any, d: Date) => void;
  onRemove: (id: string) => void;
  periods: number;
  periodLabel: (i: number) => string;
  dateForIndex: (i: number) => Date;
  emptyHint: string;
}) {
  if (habits.length === 0) {
    return <EmptyState message={emptyHint} />;
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Habit
            </th>
            {Array.from({ length: periods }).map((_, i) => (
              <th
                key={i}
                className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {periodLabel(i)}
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => (
            <tr
              key={h.id}
              className="border-b border-border last:border-b-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3 font-medium">{h.name}</td>
              {Array.from({ length: periods }).map((_, i) => {
                const d = dateForIndex(i);
                const done = isCompleted(completions, h, d);
                return (
                  <td key={i} className="px-3 py-3 text-center">
                    <button
                      onClick={() => onToggle(h, d)}
                      className={`mx-auto flex h-7 w-7 items-center justify-center rounded-sm border transition-colors ${
                        done
                          ? "border-grid-filled bg-grid-filled text-background"
                          : "border-border bg-grid-empty hover:border-foreground/40"
                      }`}
                    >
                      {done && (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </button>
                  </td>
                );
              })}
              <td className="px-2 py-3 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(h.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <p className="font-serif text-2xl text-muted-foreground">{message}</p>
    </div>
  );
}

function ReminderControl({
  enabled,
  hour,
  minute,
  onToggle,
  onTime,
}: {
  enabled: boolean;
  hour: number;
  minute: number;
  onToggle: (v: boolean) => void;
  onTime: (h: number, m: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Reminder" />}>
        {enabled ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Daily reminder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-enabled" className="text-sm">
              Enable browser notification
            </Label>
            <Switch
              id="reminder-enabled"
              checked={enabled}
              onCheckedChange={onToggle}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder-time" className="text-sm">
              Time
            </Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                onTime(h, m);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Reminder fires while this tab is open.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
