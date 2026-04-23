import { useState } from "react";
import { Check, Moon, Sun, LogOut, User, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReminderControl } from "./ReminderControl";
import { AddHabit } from "./AddHabit";
import type { HabitFrequency } from "@/lib/habits/types";
import { useTheme } from "@/hooks/useTheme";
import { useReminder } from "@/hooks/useReminder";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Link } from "react-router-dom";
export function HabitHeader({
  onAddHabit,
  hasHabits,
}: {
  onAddHabit: (name: string, freq: HabitFrequency) => void;
  hasHabits: boolean;
}) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { settings, update } = useReminder();
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
  };

  return (
    <>
      {isLoggingOut && <LoadingScreen message="Please wait" />}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className=" text-2xl leading-none">Atomic Habits</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasHabits && (
              <>
                <AddHabit onAddHabit={onAddHabit} />
                <Separator orientation="vertical" className="mx-2" />
              </>
            )}
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col items-center justify-center p-4 gap-1">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.user_metadata?.full_name ||
                        user?.user_metadata?.name ||
                        "Habit User"}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs cursor-pointer my-2"
                  render={<Link to="/user-settings" />}
                >
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>User Settings</span>
                </DropdownMenuItem>
                <ReminderControl
                  enabled={settings.enabled}
                  hour={settings.hour}
                  minute={settings.minute}
                  onToggle={(v) => update({ enabled: v })}
                  onTime={(h, m) => update({ hour: h, minute: m })}
                >
                  <DropdownMenuItem
                    closeOnClick={false}
                    className="text-xs cursor-pointer my-2"
                  >
                    <Bell className="mr-2 h-3.5 w-3.5" />
                    <span>Set Reminder</span>
                  </DropdownMenuItem>
                </ReminderControl>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="text-xs cursor-pointer my-2"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
