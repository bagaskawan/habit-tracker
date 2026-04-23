import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ReminderControl({
  enabled,
  hour,
  minute,
  onToggle,
  onTime,
  children,
}: {
  enabled: boolean;
  hour: number;
  minute: number;
  onToggle: (v: boolean) => void;
  onTime: (h: number, m: number) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        nativeButton={!children}
        render={
          children ? (
            (children as React.ReactElement)
          ) : (
            <Button variant="ghost" size="icon" aria-label="Reminder" />
          )
        }
      >
        {!children &&
          (enabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          ))}
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
