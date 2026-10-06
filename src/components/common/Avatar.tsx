import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onlineStatus?: 'online' | 'idle' | 'offline';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const statusClasses = {
  online: 'bg-emerald-500',
  idle: 'bg-amber-500',
  offline: 'bg-neutral-500',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  onlineStatus,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full select-none ${sizeClasses[size]} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-transform' : ''
      } ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full ring-1 ring-white/10"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-900/60 to-violet-800/40 border border-indigo-500/20 text-indigo-200 font-semibold tracking-wider">
          {initials || '?'}
        </div>
      )}

      {onlineStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-[#0b0e14] ${statusClasses[onlineStatus]} ${
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          }`}
          title={`Status: ${onlineStatus}`}
        />
      )}
    </div>
  );
};
