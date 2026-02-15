import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900': variant === 'default',
          'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300': variant === 'secondary',
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300':
            variant === 'success',
          'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
