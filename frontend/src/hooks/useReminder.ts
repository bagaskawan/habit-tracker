import { useCallback, useEffect, useState } from "react";
import { reminderStore, subscribe } from "@/lib/habits/store";
import type { ReminderSettings } from "@/lib/habits/types";

export function useReminder() {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    hour: 20,
    minute: 0,
  });
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    setSettings(reminderStore.get());
    if (typeof Notification !== "undefined")
      setPermission(Notification.permission);
    const unsub = subscribe(() => setSettings(reminderStore.get()));
    return unsub;
  }, []);

  // Schedule check every minute
  useEffect(() => {
    if (!settings.enabled) return;
    if (typeof Notification === "undefined") return;

    const tick = () => {
      const now = new Date();
      if (
        now.getHours() === settings.hour &&
        now.getMinutes() === settings.minute
      ) {
        const flagKey = `ht.notified.${now.toDateString()}`;
        if (
          !localStorage.getItem(flagKey) &&
          Notification.permission === "granted"
        ) {
          new Notification("Habit Tracker", {
            body: "Saatnya check-in habit kamu hari ini.",
          });
          localStorage.setItem(flagKey, "1");
        }
      }
    };
    const id = setInterval(tick, 30 * 1000);
    tick();
    return () => clearInterval(id);
  }, [settings]);

  const update = useCallback(async (patch: Partial<ReminderSettings>) => {
    const next = { ...reminderStore.get(), ...patch };
    if (
      next.enabled &&
      typeof Notification !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") next.enabled = false;
    }
    reminderStore.set(next);
  }, []);

  return { settings, permission, update };
}
