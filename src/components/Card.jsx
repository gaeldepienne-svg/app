import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-2xl p-5 shadow-ios dark:shadow-ios-dark relative overflow-hidden transition-all",
        onClick && "active:scale-[0.98] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
