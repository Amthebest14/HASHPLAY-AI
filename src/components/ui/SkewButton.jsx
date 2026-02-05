import clsx from 'clsx';

export const SkewButton = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "group relative font-bold uppercase tracking-wider transform -skew-x-12 transition-all duration-200 cursor-pointer flex items-center justify-center";

  const variants = {
    primary: "px-8 py-3 bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-black",
    ghost: "px-6 py-2 bg-transparent border border-primary text-primary hover:bg-primary/10 active:scale-95",
    solid: "px-8 py-3 bg-primary text-background-dark border-2 border-primary hover:bg-white",
  };

  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      <div className="transform skew-x-12 block w-full h-full flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};
