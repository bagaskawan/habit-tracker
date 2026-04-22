import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendChart } from "./TrendChart";
import { CompletionDonut } from "./CompletionDonut";

export function HabitStats({
  reference,
  onReferenceChange,
  dailyHabitsCount,
  completionRate,
  trendData,
}: {
  reference: Date;
  onReferenceChange: (d: Date) => void;
  dailyHabitsCount: number;
  completionRate: number;
  trendData: { day: number; value: number }[];
}) {
  return (
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
              onClick={() => onReferenceChange(subMonths(reference, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onReferenceChange(addMonths(reference, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-4 font-serif text-3xl">
          {format(reference, "MMMM yyyy")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {dailyHabitsCount} daily
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Total completion
        </p>
        <div className="mt-2 flex items-center gap-6">
          <CompletionDonut value={completionRate} />
          <div>
            <p className="font-serif text-4xl leading-none">
              {completionRate.toFixed(1)}%
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
          <TrendChart data={trendData} />
        </div>
      </div>
    </section>
  );
}
