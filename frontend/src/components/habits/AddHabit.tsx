import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { HabitFrequency } from "@/lib/habits/types";
import { useTranslation } from "react-i18next";

export function AddHabit({
  onAddHabit,
}: {
  onAddHabit: (name: string, freq: HabitFrequency) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { t } = useTranslation();

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddHabit(newName, "daily");
    setNewName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="gap-2" />}>
        <Plus className="h-4 w-4" /> {t("addHabit.trigger")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("addHabit.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("addHabit.name_label")}</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("addHabit.placeholder")}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t("addHabit.cancel")}
          </Button>
          <Button onClick={handleAdd}>{t("addHabit.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
