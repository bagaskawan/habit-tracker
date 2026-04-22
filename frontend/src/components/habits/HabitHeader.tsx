import { Check, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReminderControl } from "./ReminderControl";
import { AddHabit } from "./AddHabit";
import type { HabitFrequency } from "@/lib/habits/types";
import { useTheme } from "@/hooks/useTheme";
import { useReminder } from "@/hooks/useReminder";
import { Separator } from "@/components/ui/separator";
export function HabitHeader({
  onAddHabit,
}: {
  onAddHabit: (name: string, freq: HabitFrequency) => void;
}) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { settings, update } = useReminder();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <h2 className=" text-2xl leading-none">Atomic Habits</h2>
        </div>
        <div className="flex items-center gap-2">
          <AddHabit onAddHabit={onAddHabit} />
          <Separator orientation="vertical" className="mx-2" />
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
        </div>
      </div>
    </header>
  );
}
