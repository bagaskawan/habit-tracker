import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({
  message = "Please wait",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated text with dots */}
        <div className="flex items-center text-xl font-medium text-foreground">
          {message}
          <span className="ml-1 flex w-6 justify-start tracking-widest">
            <span className="animate-[pulse_1.5s_infinite] [animation-delay:0ms]">
              .
            </span>
            <span className="animate-[pulse_1.5s_infinite] [animation-delay:300ms]">
              .
            </span>
            <span className="animate-[pulse_1.5s_infinite] [animation-delay:600ms]">
              .
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
