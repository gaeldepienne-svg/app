import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({ className, label, error, icon: Icon, suffix, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      {label && <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {Icon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            "w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-medium",
            Icon && "pl-12",
            suffix && "pr-10",
            error && "ring-2 ring-red-50 bg-red-50 dark:bg-red-900/10",
            className
          )}
          {...props}
        />
        {suffix && (
             <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 pointer-events-none">
                {suffix}
             </span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ className, label, error, icon: Icon, children, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1 w-full mb-4">
        {label && <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">{label}</label>}
        <div className="relative">
          {Icon && (
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {Icon}
            </span>
          )}
          <select
            id={selectId}
            ref={ref}
            className={twMerge(
              "w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium appearance-none",
              Icon && "pl-12",
              error && "ring-2 ring-red-50 bg-red-50 dark:bg-red-900/10",
              className
            )}
            {...props}
          >
            {children}
          </select>
           <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
            </span>
        </div>
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  });

  Select.displayName = 'Select';
