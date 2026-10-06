import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl whitespace-nowrap shrink-0 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50';

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 min-h-[36px] gap-1.5',
    md: 'text-sm py-2 px-4 min-h-[42px] gap-2',
    lg: 'text-base py-2.5 px-5 min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/25 active:scale-[0.98]',
    secondary:
      'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/50 active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-white/[0.05] text-neutral-200 border border-neutral-700/80 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-neutral-800/60 text-neutral-300 hover:text-white',
    danger:
      'bg-rose-600/90 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 active:scale-[0.98]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
