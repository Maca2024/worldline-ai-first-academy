import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClass =
    percentage >= 80
      ? 'bg-accent-green'
      : percentage >= 40
        ? 'bg-accent-blue'
        : 'bg-accent-coral';

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-400">Voortgang</span>
          <span className="text-xs font-medium text-white">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-navy-700', sizeStyles[size])}>
        <div
          className={cn('rounded-full transition-all duration-500 ease-out', colorClass, sizeStyles[size])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
