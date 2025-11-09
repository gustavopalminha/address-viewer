import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  label?: string;
  className?: string;
}

export const Loading = ({ label = "Loading...", className }: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-muted-foreground",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary"/>
      <span className="text-sm">{label}</span>
    </div>
  );
};