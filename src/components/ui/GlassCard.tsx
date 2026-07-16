import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'maroon' | 'highlight';
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = 'default',
  hover = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  const baseStyles = 'glass-card rounded-2xl transition-all duration-500 ease-out';

  const variantStyles = {
    default: '',
    maroon: 'bg-[rgba(43,3,2,0.35)] border-[rgba(74,4,4,0.4)] dark:bg-[rgba(25,1,1,0.45)] dark:border-[rgba(43,3,2,0.4)]',
    highlight: 'bg-[rgba(212,175,55,0.08)] border-[rgba(212,175,55,0.35)] shadow-[var(--shadow-gold)]',
  };

  const hoverStyles = hover
    ? 'cursor-pointer hover:-translate-y-1.5 hover:scale-[1.01] hover:bg-white/55 dark:hover:bg-[rgba(13,21,44,0.55)] hover:border-[var(--color-gold)]/50 hover:shadow-[var(--shadow-gold-lg)]'
    : '';

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

