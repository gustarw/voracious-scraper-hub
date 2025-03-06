
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
}

export function Logo({ className, size = "md", compact = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-1 font-bold", sizeClasses[size], className)}>
      <span className="text-scrapvorn-orange">{compact ? "S" : "Scrap"}</span>
      <span className="text-white">{compact ? "v" : "vorn"}</span>
    </div>
  );
}
