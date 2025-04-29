import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  labelClassName?: string;
  className?: string;
  color?: string;
  bgColor?: string;
}

export function ProgressCircle({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  label,
  labelClassName,
  className,
  color = "stroke-primary-500",
  bgColor = "stroke-neutral-200"
}: ProgressCircleProps) {
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={bgColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className={color}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-lg font-semibold", labelClassName)}>
          {label || `${percentage}%`}
        </span>
      </div>
    </div>
  );
}
