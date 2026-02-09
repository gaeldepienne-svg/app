import { useNavigate } from 'react-router-dom';

export const Header = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="flex items-center h-14 px-4 justify-between">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 text-primary active:opacity-50 transition-opacity rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-xl font-bold">arrow_back_ios_new</span>
          </button>
        ) : (
          <div className="size-10 flex items-center justify-center text-primary">
             <span className="material-symbols-outlined text-3xl font-bold">explore</span>
          </div>
        )}

        <h1 className="flex-1 text-center text-slate-900 dark:text-white font-bold text-lg truncate px-2">
          {title}
        </h1>

        <div className="flex items-center justify-end min-w-10">
          {rightAction}
        </div>
      </div>
    </header>
  );
};
