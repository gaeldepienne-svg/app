import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, className, variant = 'primary', size = 'md', icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-500',
    danger: 'bg-red-100 dark:bg-red-500/20 text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-200 dark:hover:bg-red-500/30 focus:ring-red-500',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary',
    white: 'bg-white text-primary shadow-sm hover:bg-slate-50 focus:ring-white',
  };

  const sizes = {
    xs: 'h-8 px-2 text-xs',
    sm: 'h-9 px-3 text-xs',
    md: 'h-12 px-4 text-sm',
    lg: 'h-14 px-6 text-base',
    icon: 'h-10 w-10 p-0 flex items-center justify-center',
    fab: 'h-16 w-16 p-0 flex items-center justify-center text-4xl',
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className={clsx("w-5 h-5", children && "mr-2")} />}
      {children}
    </button>
  );
};
